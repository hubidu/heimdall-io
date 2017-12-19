package config

import (
	"os"
	"strings"
)

type AlertConfig struct {
	From       string
	Recipients []string
}

func NewAlertConfig() *AlertConfig {
	cfg := AlertConfig{From: os.Getenv("ALERT_FROM"), Recipients: strings.Split(os.Getenv("ALERT_RECIPIENTS"), ",")}

	return &cfg
}
