package config

type ServiceConfig struct {
	ReportServiceHost string
}

func NewServiceConfig() ServiceConfig {
	return ServiceConfig{ReportServiceHost: "http://report-service:8000"}
	// return ServiceConfig{ReportServiceHost: "http://veve-dev-test-01.intern.v.check24.de:8001"}
}
