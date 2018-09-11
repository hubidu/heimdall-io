package config

type ServiceConfig struct {
	ReportServiceHost string
}

func NewServiceConfig() ServiceConfig {
	return ServiceConfig{ReportServiceHost: "http://report-service:8000"}
}
