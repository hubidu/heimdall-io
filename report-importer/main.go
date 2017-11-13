package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"

	"github.com/hubidu/e2e-backend/report-lib/db"
	"github.com/hubidu/e2e-backend/report-lib/model"
)

func init() {
	db.Connect()
}

func importJob(baseDir string, removeReportFiles bool) {
	fmt.Println("Importing reports from directory " + baseDir + " ...")

	reports := model.GetReportFiles(baseDir)

	insertReportsIntoDB(reports)
	fmt.Println("Inserted " + strconv.Itoa(len(reports)) + " report files into database ...")

	if removeReportFiles {
		fmt.Println("Removing report files ...")
		for _, report := range reports {
			// fmt.Println("Removing file " + report.FileName)
			os.Remove(report.FileName)

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

	importJob(baseDir, *removeReportFiles)
}
