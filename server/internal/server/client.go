package server

import (
	"encoding/json"
	"log/slog"
	"time"

	"github.com/gorilla/websocket"
	"github.com/greedypanda0/tulip/internal/utils"
)

type Client struct {
	ID   string
	Name string
	Room *Room
	Conn *websocket.Conn

	send chan []byte
}

func CreateClient(name string, room *Room, conn *websocket.Conn) *Client {
	return &Client{
		ID:   utils.ID(),
		Name: name,
		Room: room,
		Conn: conn,
		send: make(chan []byte, 1000),
	}
}

func (c *Client) Emit(eventType string, data any) {
	payload := Payload{
		Type: eventType,
		Data: data,
	}

	bytes, err := json.Marshal(payload)
	if err != nil {
		return
	}

	c.Room.events <- &payload
	c.Room.boardcast <- bytes
}

func (c *Client) ReadPump() {
	defer func() {
		c.Room.unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, raw, err := c.Conn.ReadMessage()
		if err != nil {
			return
		}

		var payload IncomingPayload
		if err := json.Unmarshal(raw, &payload); err != nil {
			continue
		}

		switch payload.Type {
		case "get_members":
			c.SendBytes(c.Room.GetMembersBytes())

		case "get_chats":
			message, _ := json.Marshal(Payload{
				Type: "chats",
				Data: c.Room.Chats,
			})
			c.SendBytes(message)

		case "get_strokes":
			message, _ := json.Marshal(Payload{
				Type: "strokes",
				Data: c.Room.Strokes,
			})
			c.SendBytes(message)

		case "chat":
			var text string
			if err := json.Unmarshal(payload.Data, &text); err != nil {
				slog.Error("chat unmarshal failed", "err", err)
				continue
			}

			c.Emit("chat", Chat{
				User: *c.getUser(),
				Text: text,
			})

		case "stroke":
			var stroke Stroke
			if err := json.Unmarshal(payload.Data, &stroke); err != nil {
				continue
			}

			c.Emit("stroke", stroke)

		case "cursor":
			var point Point
			if err := json.Unmarshal(payload.Data, &point); err != nil {
				continue
			}

			message, _ := json.Marshal(&Payload{
				Type: "cursor",
				Data: map[string]any{
					"user":  c.getUser(),
					"point": point,
				},
			})
			c.Room.boardcast <- message

		default:
			c.Room.boardcast <- raw
		}
	}
}

func (c *Client) SendBytes(b []byte) {
	select {
	case c.send <- b:
	default:
		c.Room.unregister <- c
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case msg, ok := <-c.send:
			c.Conn.SetWriteDeadline(time.Now().Add(pongWait))

			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			if _, err := w.Write(msg); err != nil {
				_ = w.Close()
				return
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(pongWait))

			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (c *Client) getUser() *User {
	return &User{
		Name: c.Name,
		ID:   c.ID,
	}
}
