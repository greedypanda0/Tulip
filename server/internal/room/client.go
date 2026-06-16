package room

import (
	"encoding/json"
	"log"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

type Message struct {
	Type string          `json:"type"`
	Data any `json:"data"`
}

// Client is a middleman between the websocket connection and the room.
type Client struct {
	ID   string
	Name string
	Conn *websocket.Conn
	Send chan []byte
	room *Room
}

func NewClient(conn *websocket.Conn, name string, room *Room) *Client {
	id := strconv.FormatInt(time.Now().UnixNano(), 10)
	return &Client{
		ID:   id,
		Name: name,
		Conn: conn,
		Send: make(chan []byte, sendChannelBufferSize),
		room: room,
	}
}

func (c *Client) readPump() {
	defer func() {
		c.room.unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, raw, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("room %s: client %s read error: %v", c.room.ID, c.ID, err)
			} else {
				log.Printf("room %s: client %s disconnected: %v", c.room.ID, c.ID, err)
			}
			break
		}

		var message Message
		if err := json.Unmarshal(raw, &message); err != nil {
			continue
		}

		log.Println(message)
		switch message.Type {
		case "get_members":
			c.room.BroadcastMembers()
		default:
			log.Println("def", message.Type)
			c.room.broadcast <- raw
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case msg, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// channel closed
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			_, err = w.Write(msg)
			if err != nil {
				_ = w.Close()
				return
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				log.Printf("room %s: client %s ping failed: %v", c.room.ID, c.ID, err)
				return
			}
		}
	}
}
