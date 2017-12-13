package alert

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"

	"github.com/hubidu/e2e-backend/alert-service/config"
	"github.com/hubidu/e2e-backend/report-lib/model"
	gomail "gopkg.in/gomail.v2"
)

func hasConsecutiveFailures(reportGroup model.ReportGroup, numberOfFailures int) bool {
	if len(reportGroup.Items) >= numberOfFailures {
		failedReports := []model.ReportSlim{}

		for _, report := range reportGroup.Items {
			if report.Result != "error" {
				break
			}
			failedReports = append(failedReports, report)
		}

		return len(failedReports) >= numberOfFailures
	}
	return false
}

func getFailedReports(reportGroups []model.ReportGroup) []model.Report {
	failedReports := []model.Report{}
	for _, reportGroup := range reportGroups {
		// TODO Make this configurable
		if hasConsecutiveFailures(reportGroup, 2) {
			failedReports = append(failedReports, reportGroup.LastReport)
		}
	}
	return failedReports
}

func getSuccessfulReports(reportGroups []model.ReportGroup) []model.Report {
	successfulReports := []model.Report{}
	for _, reportGroup := range reportGroups {
		if reportGroup.LastReport.Result == "success" {
			successfulReports = append(successfulReports, reportGroup.LastReport)
		}
	}
	return successfulReports
}

func getAlertableReports(reports []model.Report) []model.Report {
	alertableReports := []model.Report{}

	for _, report := range reports {
		if !HasBeenReported(report) {
			alertableReports = append(alertableReports, report)
		}
	}
	return reports
}

func formatMessage(reports []model.Report) string {
	greetingLine := fmt.Sprintf("Hi there!\n\nWe have %d new test failures. You should probably have a look:\n\n", len(reports))

	content := ""
	for _, r := range reports {
		content += fmt.Sprintf("  - %s\n", r.Title)
	}

	return greetingLine + content
}

func formatSubject(reports []model.Report) string {
	return fmt.Sprintf("There are %d new end-to-end test failure(s)", len(reports))
}

func sendAlert(reports []model.Report) {
	smtpConfig := config.NewSMTPConfig()
	alertConfig := config.NewAlertConfig()

	m := gomail.NewMessage()
	m.SetHeader("From", alertConfig.From)
	m.SetHeader("To", alertConfig.Recipients)
	m.SetHeader("Subject", formatSubject(reports))

	var failedTests []string
	for _, report := range reports {
		failedTests = append(failedTests, report.Title)
	}
	m.SetBody("text/plain", formatMessage(reports))
	// m.Attach("/home/Alex/lolcat.jpg")

	d := gomail.NewDialer(smtpConfig.Host, smtpConfig.Port, "", "")
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	// Send the email to Bob, Cora and Dan.
	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}
}

func AlertTask() {
	resp, err := GetReportCategories()
	if err != nil {
		log.Fatal(err)
	}

	groupedReports := make(map[uint32]*model.ReportGroup)
	json.Unmarshal(resp.Body(), &groupedReports)

	reportGroups := []model.ReportGroup{}
	for _, v := range groupedReports {
		reportGroups = append(reportGroups, *v)
	}

	failedReports := getFailedReports(reportGroups)
	successfulReports := getSuccessfulReports(reportGroups)

	newAlerts := getAlertableReports(failedReports)

	UpdateAlertedReports(newAlerts, successfulReports)

	if len(newAlerts) > 0 {
		sendAlert(newAlerts)
	}
}
