package alert

import (
	"testing"

	"github.com/hubidu/e2e-backend/report-lib/model"
)

func TestHasBeenReported(t *testing.T) {
	failedReport := model.Report{Id: "5a329f21ad01f66f7f5be4ec", HashCategory: 12345}
	failedReports := []model.Report{
		failedReport,
	}
	successfulReports := []model.Report{}

	ClearAlertedReports()

	newAlerts, _ := UpdateAlertedReports(failedReports, successfulReports)
	if len(newAlerts) != 1 {
		t.Error("Expected one alerted report, but found", len(newAlerts))
	}

	newAlerts, _ = UpdateAlertedReports(failedReports, successfulReports)
	if len(newAlerts) != 0 {
		t.Error("Expected still one alerted report, but found", len(newAlerts))
	}

	successfulReport := model.Report{Id: "5a329f21ad01f66f7f5be4ec", HashCategory: 12345}
	successfulReports = []model.Report{
		successfulReport,
	}
	newAlerts, fixedReports := UpdateAlertedReports(failedReports, successfulReports)

	if len(newAlerts) != 0 {
		t.Error("Expected no alerted Reports after updating with successful reports")
	}
	if len(fixedReports) != 1 {
		t.Error("Expected one fixed report")
	}
}

func TestUpdateState(t *testing.T) {
	alertableReports := []model.Report{
		{Id: "5a329f21ad01f66f7f5be4ec", HashCategory: 12345},
	}
	successfulReports := []model.Report{}

	ClearAlertedReports()

	newAlerts, _ := UpdateAlertedReports(alertableReports, successfulReports)
	if len(newAlerts) != 1 {
		t.Error("Expected one alerted report")
	}
}
