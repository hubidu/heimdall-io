package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"

	"github.com/hubidu/e2e-backend/report-lib/db"
	"github.com/hubidu/e2e-backend/report-lib/model"
	"github.com/jasonlvhit/gocron"
)

func init() {
	db.Connect()
}

func importJob(baseDir string, removeReportFiles bool) {
	fmt.Println("Importing reports from directory " + baseDir + " ...")

	reports := model.GetReportFiles(baseDir)

	// TODO Should not insert duplicate reports
	insertReportsIntoDB(reports)
	fmt.Println("Inserted " + strconv.Itoa(len(reports)) + " report files into database ...")

	if removeReportFiles {
		fmt.Println("Removing report files ...")
		for _, report := range reports {
			os.Rename(report.ReportFileName, report.ReportDir+"report_imported.json")

		}
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

	importJobTask := func() {
		importJob(baseDir, *removeReportFiles)
	}

	var intervalInSeconds uint64
	intervalInSeconds = 30
	if len(os.Getenv("JOB_INTERVAL")) != 0 {
		interval, _ := strconv.Atoi(os.Getenv("JOB_INTERVAL"))
		intervalInSeconds = uint64(interval)
	}

	gocron.Every(intervalInSeconds).Seconds().Do(importJobTask)

	<-gocron.Start()
}
