package main

import (
	"os"
	"strconv"
	"time"

	"github.com/hubidu/e2e-backend/alert-service/alert"
	"github.com/jasonlvhit/gocron"
)

func main() {
	var intervalInSeconds uint64
	intervalInSeconds = 60
	if len(os.Getenv("JOB_INTERVAL")) != 0 {
		interval, _ := strconv.Atoi(os.Getenv("JOB_INTERVAL"))
		intervalInSeconds = uint64(interval)

		gocron.Every(intervalInSeconds).Seconds().Do(alert.AlertTask)

		<-gocron.Start()
	} else {
		gocron.Every(1).Seconds().Do(alert.AlertTask)
		<-gocron.Start()
		time.Sleep(time.Second * 60)
	}

}
