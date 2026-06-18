package utils

import (
	"crypto/rand"
	"fmt"
)

func ID() string {
	return fmt.Sprintf(
		"%04X-%04X-%04X-%04X",
		random16(),
		random16(),
		random16(),
		random16(),
	)
}

func random16() uint16 {
	var b [2]byte
	rand.Read(b[:])
	return uint16(b[0])<<8 | uint16(b[1])
}
