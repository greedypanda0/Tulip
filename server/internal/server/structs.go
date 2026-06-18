package server

import "encoding/json"

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Stroke struct {
	ID     string  `json:"id"`
	Points []Point `json:"points"`
	Color  string  `json:"color"`
	Width  int     `json:"width"`
	UserID string  `json:"user_id"`
}

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type IncomingPayload struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type Payload struct {
	Type string `json:"type"`
	Data any    `json:"data"`
}

type Chat struct {
	User User   `json:"user"`
	Text string `json:"text"`
}

type SocketError struct {
	Error string `json:"error"`
	Code  int    `json:"code"`
}
