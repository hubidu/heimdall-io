package config

import (
	"os"
	"strconv"
)

type SMTPConfig struct {
	Host string
	Port int
}

func NewSMTPConfig() *SMTPConfig {
	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	config := SMTPConfig{Host: os.Getenv("SMTP_HOST"), Port: port}

	return &config
}
