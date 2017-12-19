package alert

import (
	"fmt"

	"github.com/hubidu/e2e-backend/report-lib/model"
)

var alertedReports []model.Report

func init() {
	alertedReports = []model.Report{}
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

func ClearAlertedReports() {
	alertedReports = []model.Report{}
}

func HasAlreadyBeenReported(report model.Report) bool {
	return contains(alertedReports, report) >= 0
}

func GetAlertableReports(failedReports []model.Report) []model.Report {
	alertableReports := []model.Report{}

	for _, report := range failedReports {
		if !HasAlreadyBeenReported(report) {
			alertableReports = append(alertableReports, report)
		}
	}
	return alertableReports
}

func UpdateAlertedReports(failedReports []model.Report, successfulReports []model.Report) ([]model.Report, []model.Report) {
	fixedReports := []model.Report{}
	alertableReports := GetAlertableReports(failedReports)
	// logReports("New alerts:", alertableReports)
	for _, alertableReport := range alertableReports {
		alertedReports = append(alertedReports, alertableReport)
	}

	for i, alertedReport := range alertedReports {
		if contains(successfulReports, alertedReport) > -1 {
			fixedReports = append(fixedReports, alertedReport)
			alertedReports = remove(alertedReports, i)
		}
	}

	// logReports("Now alerted reports:", alertedReports)

	return alertableReports, fixedReports
}
