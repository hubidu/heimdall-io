package alert

import (
	"fmt"

	"github.com/hubidu/e2e-backend/report-lib/model"
)

var alertedReports []model.Report

func init() {
	alertedReports = []model.Report{}
}

func HasBeenReported(report *model.Report) bool {
	for _, alertedReport := range alertedReports {
		if alertedReport.HashCategory == report.HashCategory {
			return true
		}
	}
	return false
}

func contains(reports []model.Report, report model.Report) int {
	for i, r := range reports {
		if r.HashCategory == report.HashCategory {
			return i
		}
	}
	return -1
}

func remove(reports []model.Report, i int) []model.Report {
	return append(reports[:i], reports[i+1:]...)
}

func logReports(title string, reports []model.Report) {
	fmt.Println(title)
	for _, r := range reports {
		fmt.Println(r.Title)
	}
}

func UpdateAlertedReports(alertableReports []model.Report, successfulReports []model.Report) {
	logReports("New alerts:", alertableReports)
	for _, alertableReport := range alertableReports {
		alertedReports = append(alertedReports, alertableReport)
	}

	for i, alertedReport := range alertedReports {
		if contains(successfulReports, alertedReport) > -1 {
			remove(alertedReports, i)
		}
	}

	logReports("Now alerted reports:", alertedReports)
}
