package server

import (
	"context"
	"encoding/json"
	"log/slog"
	"sync"
)

type Room struct {
	Name    string
	Clients map[string]*Client
	Strokes []Stroke
	Chats   []Chat

	register   chan *Client
	unregister chan *Client
	boardcast  chan []byte
	events     chan *Payload

	hub       *Hub
	closeOnce sync.Once
}

func (r *Room) Run() {
	slog.Info("Room started", "name", r.Name)

	for {
		select {
		case client := <-r.register:
			r.Clients[client.Name] = client
			r.BroadcastMembers()

		case client := <-r.unregister:
			if _, ok := r.Clients[client.Name]; ok {
				close(client.send)
				delete(r.Clients, client.Name)
				r.BroadcastMembers()
				// room empty
				if len(r.Clients) == 0 && r.hub != nil {
					select {
					case r.hub.roomCh <- r:
					default:
						// drop
					}
				}
			}

		case data := <-r.boardcast:
			for _, client := range r.Clients {
				select {
				case client.send <- data:
				default:
					close(client.send)
					delete(r.Clients, client.Name)
				}
			}

		// events
		case event := <-r.events:
			r.HandleEvents(event)
		}
	}
}

func (r *Room) GetClient(name string) *Client {
	return r.Clients[name]
}

func (r *Room) HandleEvents(event *Payload) {
	switch event.Type {
	case "chat":
		r.Chats = append(r.Chats, event.Data.(Chat))
	case "stroke":
		r.Strokes = append(r.Strokes, event.Data.(Stroke))
	case "get_members":
		if requester, ok := event.Data.(string); ok {
			var members []User
			for _, client := range r.Clients {
				members = append(members, User{ID: client.ID, Name: client.Name})
			}
			message, _ := json.Marshal(Payload{Type: "members", Data: members})
			if client, ok := r.Clients[requester]; ok {
				select {
				case client.send <- message:
				default:
					// drop
				}
			}
		}
	case "get_chats":
		if requester, ok := event.Data.(string); ok {
			message, _ := json.Marshal(Payload{Type: "chats", Data: r.Chats})
			if client, ok := r.Clients[requester]; ok {
				select {
				case client.send <- message:
				default:
					// drop
				}
			}
		}
	case "get_strokes":
		if requester, ok := event.Data.(string); ok {
			message, _ := json.Marshal(Payload{Type: "strokes", Data: r.Strokes})
			if client, ok := r.Clients[requester]; ok {
				select {
				case client.send <- message:
				default:
					// drop
				}
			}
		}
	default:
	}
}

func (r *Room) BroadcastMembers() {
	for _, client := range r.Clients {
		select {
		case client.send <- r.GetMembersBytes():
		default:
			// drop
		}
	}
}

func (r *Room) GetMembersBytes() []byte {
	var members []User
	for _, client := range r.Clients {
		members = append(members, User{ID: client.ID, Name: client.Name})
	}
	message, _ := json.Marshal(Payload{
		Type: "members",
		Data: members,
	})

	return message
}

func (r *Room) Shutdown(ctx context.Context) {
	r.closeOnce.Do(func() {
		for _, client := range r.Clients {
			if client.Conn != nil {
				client.Conn.Close()
			}
			if client.send != nil {
				close(client.send)
			}
		}
	})

	slog.Info("Room shutdown", "name", r.Name)
}
