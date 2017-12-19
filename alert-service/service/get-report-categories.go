package service

import (
	"fmt"

	"github.com/hubidu/e2e-backend/alert-service/config"
	resty "gopkg.in/resty.v1"
)

func GetReportCategories() (*resty.Response, error) {
	config := config.NewServiceConfig()
	return resty.R().Get(fmt.Sprintf("%d/report-categories", config.ReportServiceHost))
	// return resty.R().Get("http://veve-dev-test-01.intern.v.check24.de:8001/report-categories")
}
