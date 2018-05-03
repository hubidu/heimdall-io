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
}

func importJob(baseDir string, removeReportFiles bool) {
	reports := model.GetReportFiles(baseDir)

	if len(reports) > 0 {
		fmt.Println("Importing reports from directory " + baseDir + " ...")

		// TODO Should not insert duplicate reports
		insertReportsIntoDB(reports)

		fmt.Println("Inserted " + strconv.Itoa(len(reports)) + " report files into database ...")

		if removeReportFiles {
			fmt.Println("Renaming report files ...")
			for _, report := range reports {
				reportFileName := path.Join(baseDir, report.ReportDir, report.ReportFileName)
				os.Rename(reportFileName, path.Join(baseDir, report.ReportDir, "report_imported.json"))
			}
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
	intervalInSeconds = 3
	if len(os.Getenv("JOB_INTERVAL")) != 0 {
		interval, _ := strconv.Atoi(os.Getenv("JOB_INTERVAL"))
		intervalInSeconds = uint64(interval)
	}

	gocron.Every(intervalInSeconds).Seconds().Do(importJobTask)

	<-gocron.Start()
}

// func main() {
// 	removeReportFiles := flag.Bool("rm", false, "set to true to remove report files from disk")
// 	flag.Parse()
// 	args := flag.Args()

// 	var baseDir string
// 	if len(args) >= 1 {
// 		baseDir = args[0]
// 	} else {
// 		baseDir = "./fixtures"
// 	}

// 	w := watcher.New()

// 	// SetMaxEvents to 1 to allow at most 1 event's to be received
// 	// on the Event channel per watching cycle.
// 	//
// 	// If SetMaxEvents is not set, the default is to send all events.
// 	w.SetMaxEvents(1)

// 	// Only notify rename and move events.
// 	w.FilterOps(watcher.Create)

// 	go func() {
// 		for {
// 			select {
// 			case event := <-w.Event:
// 				if filepath.Ext(event.FileInfo.Name()) == ".json" {
// 					fmt.Println("New report file created", event)
// 					importJob(baseDir, *removeReportFiles)
// 				}
// 			case err := <-w.Error:
// 				log.Fatalln(err)
// 			case <-w.Closed:
// 				fmt.Println("Closing...")
// 				return
// 			}
// 		}
// 	}()

// 	// Watch test_folder recursively for changes.
// 	if err := w.AddRecursive(baseDir); err != nil {
// 		log.Fatalln(err)
// 	}

// 	// Start the watching process - it'll check for changes every 100ms.
// 	if err := w.Start(time.Millisecond * 100); err != nil {
// 		log.Fatalln(err)
// 	}
// }

// func main() {
// 	removeReportFiles := flag.Bool("rm", false, "set to true to remove report files from disk")
// 	flag.Parse()
// 	args := flag.Args()

// 	var baseDir string
// 	if len(args) >= 1 {
// 		baseDir = args[0]
// 	} else {
// 		baseDir = "./fixtures"
// 	}

// 	watcher, err := fsnotify.NewWatcher()
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer watcher.Close()

// 	done := make(chan bool)
// 	go func() {
// 		for {
// 			select {
// 			case event := <-watcher.Events:
// 				log.Println("event:", event)
// 				if event.Op&fsnotify.Write == fsnotify.Write {
// 					// log.Println("modified file:", event.Name)

// 					if filepath.Ext(event.Name) == ".json" {
// 						fmt.Println("New report file created", event)
// 						importJob(baseDir, *removeReportFiles)
// 					}

// 				}
// 			case err := <-watcher.Errors:
// 				log.Println("error:", err)
// 			}
// 		}
// 	}()

// 	err = watcher.Add(baseDir)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	<-done
// }
