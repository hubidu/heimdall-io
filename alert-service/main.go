package main

import (
	"encoding/json"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/hubidu/e2e-backend/report-lib/db"
	"github.com/hubidu/e2e-backend/report-lib/model"
	"github.com/jasonlvhit/gocron"
	gomail "gopkg.in/gomail.v2"
	resty "gopkg.in/resty.v1"
)

func init() {
	db.Connect()
}

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
		if hasConsecutiveFailures(reportGroup, 2) {
			failedReports = append(failedReports, reportGroup.LastReport)
		}
	}
	return failedReports
}

func getAlertableReports(reports []model.Report) []model.Report {
	// TODO Implement this
	return reports
}

func sendAlert(reports []model.Report) {
	m := gomail.NewMessage()
	m.SetHeader("From", "someone")
	m.SetHeader("To", "someone")
	m.SetHeader("Subject", "One or more end-to-end tests failed!")

	var failedTests []string
	for _, report := range reports {
		failedTests = append(failedTests, report.Title)
	}
	m.SetBody("text/html", "Hello! The following end-to-end tests failed. You should take a look:"+strings.Join(failedTests, ","))
	// m.Attach("/home/Alex/lolcat.jpg")

	// TODO Add smtp server config
	d := gomail.NewDialer("smtpserver", 25, "", "")

	// Send the email to Bob, Cora and Dan.
	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}
}

func alertTask() {
	resp, err := resty.R().Get("http://localhost:8000/report-categories")
	if err != nil {
		log.Fatal(err)
	}

	reportGroups := []model.ReportGroup{}
	json.Unmarshal([]byte(resp.Body()), &reportGroups)

	failedReports := getFailedReports(reportGroups)
	alertableReports := getAlertableReports(failedReports)

	if len(alertableReports) > 0 {
		sendAlert(alertableReports)
	}
}

func main() {
	var intervalInSeconds uint64
	intervalInSeconds = 60
	if len(os.Getenv("JOB_INTERVAL")) != 0 {
		interval, _ := strconv.Atoi(os.Getenv("JOB_INTERVAL"))
		intervalInSeconds = uint64(interval)
	}

	gocron.Every(intervalInSeconds).Seconds().Do(alertTask)

	<-gocron.Start()
}
