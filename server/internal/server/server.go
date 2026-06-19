package server

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
)

type Server struct {
	s   *http.Server
	Hub *Hub
}

const (
	pongWait   = 60 * time.Second
	pingPeriod = 50 * time.Second
)

var ws = &websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewServer() *Server {
	return &Server{
		s: &http.Server{
			Addr: ":" + os.Getenv("PORT"),
		},
		Hub: NewHub(),
	}
}

func (s *Server) WSHandler(w http.ResponseWriter, r *http.Request) {
	con, err := ws.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Failed to upgrade to WebSocket", http.StatusBadRequest)
		return
	}

	name := r.URL.Query().Get("name")
	roomName := r.URL.Query().Get("room")
	if name == "" || roomName == "" {
		s.SendError(con, "Name and room are required")
		con.Close()
		return
	}

	room := s.Hub.AddOrCreate(roomName)
	client := room.GetClient(name)
	if client == nil {
		client = CreateClient(name, room, con)
		room.register <- client
	}

	go client.ReadPump()
	go client.WritePump()
}

func (s *Server) SendError(conn *websocket.Conn, err string) {
	conn.WriteJSON(&SocketError{
		Error: err,
		Code:  http.StatusBadRequest,
	})
}

func (s *Server) ListenAndServe() error {
	http.HandleFunc("/ws", s.WSHandler)
	if err := s.s.ListenAndServe(); err != nil {
		return err
	}
	return nil
}

func (s *Server) Shutdown(ctx context.Context) error {
	if err := s.s.Shutdown(ctx); err != nil {
		return err
	}

	s.Hub.Shutdown(ctx)
	return nil
}
