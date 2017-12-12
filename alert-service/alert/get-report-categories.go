package alert

import resty "gopkg.in/resty.v1"

func GetReportCategories() (*resty.Response, error) {
	return resty.R().Get("http://localhost:8001/report-categories")
}
