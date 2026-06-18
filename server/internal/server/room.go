package server

import (
	"context"
	"encoding/json"
	"log/slog"
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
}

func (r *Room) Run() {
	slog.Info("Room started", "name", r.Name)

	for {
		select {
		case client := <-r.register:
			r.Clients[client.ID] = client
			r.BroadcastMembers()

		case client := <-r.unregister:
			if _, ok := r.Clients[client.Name]; ok {
				close(client.send)
				delete(r.Clients, client.Name)
				r.BroadcastMembers()
			}

		case data := <-r.boardcast:
			for _, client := range r.Clients {
				client.SendBytes(data)
			}

		// events
		case event := <-r.events:
			r.HandleEvents(event)
		}
	}
}

func (r *Room) GetClient(id string) *Client {
	return r.Clients[id]
}

func (r *Room) HandleEvents(event *Payload) {
	switch event.Type {
	case "chat":
		r.Chats = append(r.Chats, event.Data.(Chat))
	case "stroke":
		r.Strokes = append(r.Strokes, event.Data.(Stroke))
	default:
	}
}

func (r *Room) BroadcastMembers() {
	for _, client := range r.Clients {
		client.SendBytes(r.GetMembersBytes())
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
	for _, client := range r.Clients {
		close(client.send)
	}
	close(r.register)
	close(r.unregister)
	close(r.boardcast)
	close(r.events)
}
