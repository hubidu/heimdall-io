package config

import (
	"os"
	"strings"
)

type AlertConfig struct {
	Ownerkeys  []string
	From       string
	Recipients []string
}

func NewAlertConfig() *AlertConfig {
	cfg := AlertConfig{
		Ownerkeys:  strings.Split(os.Getenv("ALERT_OWNERKEYS"), ","),
		From:       os.Getenv("ALERT_FROM"),
		Recipients: strings.Split(os.Getenv("ALERT_RECIPIENTS"), ","),
	}

	return &cfg
}
