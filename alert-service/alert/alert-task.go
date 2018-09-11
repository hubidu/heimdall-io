package alert

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/hubidu/e2e-backend/alert-service/config"
	"github.com/hubidu/e2e-backend/alert-service/email"
	"github.com/hubidu/e2e-backend/alert-service/service"
	"github.com/hubidu/e2e-backend/report-lib/model"
)

func containsStr(arr []string, str string) bool {
	for _, item := range arr {
		if str == item {
			return true
		}
	}
	return false
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

func grepTag(reports []model.Report, tag string) []model.Report {
	filteredReports := []model.Report{}
	for _, report := range reports {
		if containsStr(report.Tags, tag) {
			filteredReports = append(filteredReports, report)
		}
	}
	return filteredReports
}

func getScreenshots(reports []model.Report) []service.DownloadedScreenshot {
	downloadedScreenshots := []service.DownloadedScreenshot{}
	for _, report := range reports {
		downloadedScreenshot := service.DownloadScreenshot(report.ReportDir, report.Screenshots[0].Screenshot)
		downloadedScreenshots = append(downloadedScreenshots, downloadedScreenshot)
	}
	return downloadedScreenshots
}

func selectConfiguredOwnerkeys(ownerkeys []string, alertableReports []model.Report) []model.Report {
	result := []model.Report{}

	for _, report := range alertableReports {
		if containsStr(ownerkeys, report.OwnerKey) {
			result = append(result, report)
		}
	}
	return result
}

// AlertTask sends out alerts when tests failed
func AlertTask() {
	fmt.Println("Checking alerts...")
	resp, err := service.GetReportCategories()
	if err != nil {
		log.Fatal(err)
	}

	alertConfig := config.NewAlertConfig()

	groupedReports := make(map[uint32]*model.ReportGroup)
	json.Unmarshal(resp.Body(), &groupedReports)

	reportGroups := []model.ReportGroup{}
	for _, v := range groupedReports {
		reportGroups = append(reportGroups, *v)
	}

	failedReports := grepTag(getFailedReports(reportGroups), alertConfig.GrepTag)
	successfulReports := grepTag(getSuccessfulReports(reportGroups), alertConfig.GrepTag)

	newAlerts, fixedAlerts := UpdateAlertedReports(failedReports, successfulReports)

	newAlertsForOwnerkeys := selectConfiguredOwnerkeys(alertConfig.Ownerkeys, newAlerts)
	fixedAlertsForOwnerkeys := selectConfiguredOwnerkeys(alertConfig.Ownerkeys, fixedAlerts)

	if len(newAlertsForOwnerkeys) > 0 {
		fmt.Println("Finishing with new alerts", len(newAlertsForOwnerkeys))

		newAlertScreenshots := getScreenshots(newAlertsForOwnerkeys)
		email.SendAlert(alertConfig.Recipients, newAlertsForOwnerkeys, fixedAlertsForOwnerkeys, newAlertScreenshots)
	} else {
		fmt.Println("Finishing with no new alerts (nothing to do)")
	}
}
