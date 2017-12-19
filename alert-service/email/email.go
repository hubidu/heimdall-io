package email

import (
	"crypto/tls"
	"fmt"

	"github.com/hubidu/e2e-backend/alert-service/config"
	"github.com/hubidu/e2e-backend/alert-service/service"
	"github.com/hubidu/e2e-backend/report-lib/model"
	gomail "gopkg.in/gomail.v2"
)

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

// SendAlert sends an alert email using a list of new failing tests
func SendAlert(newAlerts []model.Report, fixedAlerts []model.Report, newAlertScreenshots []service.DownloadedScreenshot) {
	smtpConfig := config.NewSMTPConfig()
	alertConfig := config.NewAlertConfig()

	m := gomail.NewMessage()
	m.SetHeader("From", alertConfig.From)
	m.SetHeader("To", alertConfig.Recipients)
	m.SetHeader("Subject", formatSubject(newAlerts))

	var failedTests []string
	for _, report := range newAlerts {
		failedTests = append(failedTests, report.Title)
	}
	m.SetBody("text/plain", formatMessage(newAlerts))
	for _, alertScreenshot := range newAlertScreenshots {
		m.Attach(alertScreenshot.Path)
	}

	// TODO Cleanup the screenshot files

	d := gomail.NewDialer(smtpConfig.Host, smtpConfig.Port, "", "")
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	// Send the email to Bob, Cora and Dan.
	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}
}
