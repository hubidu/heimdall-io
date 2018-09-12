package main

import (
	"flag"
	"fmt"
	"os"
	"path"
	"strconv"

	"github.com/hubidu/e2e-backend/report-lib/db"
	"github.com/hubidu/e2e-backend/report-lib/model"
	"github.com/jasonlvhit/gocron"
)

func init() {
	db.Connect()

	model.EnsureTestStatusIndexes()
}

func deleteOldReports() {
	CleanupOldReports(7)
}

func removeReportFiles(baseDir string, reports []model.Report) {
	// fmt.Println("Renaming report files ...")
	for _, report := range reports {
		reportFileName := path.Join(baseDir, report.ReportDir, report.ReportFileName)
		os.Rename(reportFileName, path.Join(baseDir, report.ReportDir, "report_imported.json"))
	}
}

func importReportsTask(baseDir string, doRemoveReportFiles bool) {
	reports := model.GetReportFiles(baseDir)

	reportCount := len(reports)
	if reportCount > 0 {
		fmt.Println("Starting report import: " + strconv.Itoa(reportCount) + " reports from directory " + baseDir + " ...")

		// TODO Should not insert duplicate reports
		InsertReportsIntoDB(reports)
		fmt.Println("Inserted " + strconv.Itoa(reportCount) + " report files into database ...")

		fmt.Println("Updating test status view")
		UpdateTestStatusView(reports)

		if doRemoveReportFiles {
			removeReportFiles(baseDir, reports)
		}

		fmt.Println("Report import finished")
	}
}

func main() {
	removeReportFiles := flag.Bool("rm", false, "set to true to remove report files from disk")
	flag.Parse()

	args := flag.Args()

	var baseDir string
	if len(args) >= 1 {
		baseDir = args[0]
	} else {
		baseDir = "./fixtures"
	}

	var intervalInSeconds uint64
	intervalInSeconds = 3
	if len(os.Getenv("JOB_INTERVAL")) != 0 {
		interval, _ := strconv.Atoi(os.Getenv("JOB_INTERVAL"))
		intervalInSeconds = uint64(interval)
	}

	gocron.Every(intervalInSeconds).Seconds().Do(func() {
		importReportsTask(baseDir, *removeReportFiles)
	})
	gocron.Every(1).Day().At("05:00").Do(deleteOldReports)

	<-gocron.Start()
}
