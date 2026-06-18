package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/greedypanda0/tulip/internal/server"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		slog.Error("Could not load .env")
		return
	}

	s := server.NewServer()

	go func() {
		slog.Info("Server started", "port", os.Getenv("PORT"))
		s.ListenAndServe()
	}()

	// for shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	s.Shutdown(ctx)
	slog.Info("shutdown signal received")
}
