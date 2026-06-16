package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	Room "github.com/greedypanda0/tulip/internal/room"
)

var upgrader = &websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// TODO: tighten origin check for production
		return true
	},
}

var roomManager = Room.NewRoomManager()

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("ws upgrade error: %v", err)
		http.Error(w, "could not upgrade to websocket", http.StatusBadRequest)
		return
	}

	roomID := r.URL.Query().Get("room")
	if roomID == "" {
		roomID = "default"
	}

	name := r.URL.Query().Get("name")
	if name == "" {
		name = "anonymous"
	}

	log.Printf("new connection: room=%s name=%s remote=%s", roomID, name, conn.RemoteAddr())

	room := roomManager.GetRoom(roomID)
	room.ServeWS(conn, name)
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	addr := ":8080"
	log.Printf("starting server on %s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
