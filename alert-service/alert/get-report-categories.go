package alert

import resty "gopkg.in/resty.v1"

func GetReportCategories() (*resty.Response, error) {
	return resty.R().Get("http://report-service:8000/report-categories")
	// return resty.R().Get("http://veve-dev-test-01.intern.v.check24.de:8001/report-categories")
}
