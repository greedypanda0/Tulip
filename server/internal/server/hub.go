package server

import (
	"context"
	"sync"
)

type Hub struct {
	mu    sync.Mutex
	rooms map[string]*Room
}

func NewHub() *Hub {
	return &Hub{
		rooms: make(map[string]*Room),
	}
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
	}

	go room.Run()

	h.mu.Lock()
	h.rooms[room.Name] = room
	h.mu.Unlock()

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
	for _, room := range h.rooms {
		room.Shutdown(ctx)
	}
}
