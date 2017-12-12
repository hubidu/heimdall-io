package config

import "os"

type AlertConfig struct {
	From       string
	Recipients string
}

func NewAlertConfig() *AlertConfig {
	cfg := AlertConfig{From: os.Getenv("ALERT_FROM"), Recipients: os.Getenv("ALERT_RECIPIENTS")}

	return &cfg
}
