package server

import (
	"context"
	"log/slog"
	"sync"
)

type Hub struct {
	mu     sync.Mutex
	rooms  map[string]*Room
	roomCh chan *Room
}

func NewHub() *Hub {
	h := &Hub{
		rooms:  make(map[string]*Room),
		roomCh: make(chan *Room, 16),
	}
	
	go h.RoomCh()
	return h
}

func (h *Hub) RoomCh() {
	slog.Info("Room clearing process started")
	
	for room := range h.roomCh {
		h.mu.Lock()
		if _, ok := h.rooms[room.Name]; ok {
			room.Shutdown(context.Background())
			delete(h.rooms, room.Name)
		}
		h.mu.Unlock()
	}
	
	slog.Info("Room clearing process stopped")
}

func (h *Hub) CreateRoom(name string) *Room {
	room := &Room{
		Name:       name,
		Clients:    make(map[string]*Client),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		Strokes:    make([]Stroke, 0),
		Chats:      make([]Chat, 0),
		boardcast:  make(chan []byte, 1000),
		events:     make(chan *Payload, 1000),
		hub:        h,
	}

	h.mu.Lock()
	h.rooms[room.Name] = room
	h.mu.Unlock()

	go room.Run()

	return room
}

func (h *Hub) GetRoom(name string) *Room {
	h.mu.Lock()
	defer h.mu.Unlock()

	if room, ok := h.rooms[name]; ok {
		return room
	}
	return nil
}

func (h *Hub) AddOrCreate(name string) *Room {
	if room := h.GetRoom(name); room != nil {
		return room
	}

	return h.CreateRoom(name)
}

func (h *Hub) Shutdown(ctx context.Context) {
	h.mu.Lock()
	rooms := make([]*Room, 0, len(h.rooms))
	for _, room := range h.rooms {
		rooms = append(rooms, room)
	}
	h.mu.Unlock()

	for _, room := range rooms {
		room.Shutdown(ctx)
	}
}
