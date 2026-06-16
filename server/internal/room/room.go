package room

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second
	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second
	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10
	// Maximum message size allowed from peer (1MB).
	maxMessageSize = 1024 * 1024
	// Buffered channel size per client to tolerate bursts.
	sendChannelBufferSize = 256
)

// Manager holds active rooms.
type Manager struct {
	mu    sync.RWMutex
	rooms map[string]*Room
}
type Member struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func NewRoomManager() *Manager {
	return &Manager{
		rooms: make(map[string]*Room),
	}
}

// GetRoom returns an existing room or creates a new one.
func (m *Manager) GetRoom(id string) *Room {
	m.mu.RLock()
	r := m.rooms[id]
	m.mu.RUnlock()
	if r != nil {
		return r
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	if r = m.rooms[id]; r == nil {
		r = NewRoom(id)
		m.rooms[id] = r
	}
	return r
}

// Room is a hub that manages clients and broadcasts messages.
type Room struct {
	ID string

	register   chan *Client
	unregister chan *Client
	broadcast  chan []byte

	clients map[*Client]bool

	quit chan struct{}
}

func NewRoom(id string) *Room {
	r := &Room{
		ID:         id,
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan []byte),
		clients:    make(map[*Client]bool),
		quit:       make(chan struct{}),
	}
	go r.run()
	return r
}

func (r *Room) run() {
	log.Printf("room %s: started", r.ID)
	for {
		select {
		case client := <-r.register:
			r.clients[client] = true
			log.Printf("room %s: client joined: %s (%s)", r.ID, client.ID, client.Name)
			r.BroadcastMembers()
		case client := <-r.unregister:
			if _, ok := r.clients[client]; ok {
				delete(r.clients, client)
				close(client.Send)
				log.Printf("room %s: client left: %s (%s)", r.ID, client.ID, client.Name)
				r.BroadcastMembers()
			}
		case msg := <-r.broadcast:
			for client := range r.clients {
				select {
				case client.Send <- msg:
				default:
					// send buffer full, drop the client
					close(client.Send)
					delete(r.clients, client)
					log.Printf("room %s: dropped client %s (%s) due to full send buffer", r.ID, client.ID, client.Name)
				}
			}
		case <-r.quit:
			log.Printf("room %s: shutting down", r.ID)
			for client := range r.clients {
				close(client.Send)
				delete(r.clients, client)
			}
			return
		}
	}
}

func (r *Room) BroadcastMembers() {
	members := make([]Member, 0, len(r.clients))
	for client := range r.clients {
		members = append(members, Member{
			ID:   client.ID,
			Name: client.Name,
		})
	}

	message := map[string]any{
		"type": "members",
		"data": members,
	}

	data, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
		return
	}

	for client := range r.clients {
		select {
		case client.Send <- data:
		default:
			// send buffer full, drop the client
			close(client.Send)
			delete(r.clients, client)
			log.Printf("room %s: dropped client %s (%s) due to full send buffer", r.ID, client.ID, client.Name)
		}
	}
}

// ServeWS registers a new websocket connection as a client in the room and
// starts read/write pumps for that client.
func (r *Room) ServeWS(conn *websocket.Conn, name string) {
	client := NewClient(conn, name, r)
	r.register <- client
	go client.writePump()
	go client.readPump()
}
