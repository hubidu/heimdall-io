package alert

import resty "gopkg.in/resty.v1"

func GetReportCategories() (*resty.Response, error) {
	return resty.R().Get("http://report-service:8000/report-categories")
}
