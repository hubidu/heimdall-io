package main

import (
	"log"
	"time"

	"github.com/hubidu/e2e-backend/report-lib/db"
	"github.com/hubidu/e2e-backend/report-lib/model"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// InsertReportsIntoDB will insert the given reports into the database
func InsertReportsIntoDB(reports []model.Report) {
	s := db.Session.Clone()

	defer s.Close()

	// Optional. Switch the session to a monotonic behavior.
	s.SetMode(mgo.Monotonic, true)

	coll := s.DB("e2e").C("reports")

	for _, report := range reports {
		err := coll.Insert(&report)
		if err != nil {
			log.Fatal(err)
		}
	}
}

// CleanupOldReports will delete report data older than a specified time
func CleanupOldReports(daysAgo int) {
	s := db.Session.Clone()

	defer s.Close()

	s.SetMode(mgo.Monotonic, true)

	coll := s.DB("e2e").C("reports")

	_, err := coll.RemoveAll(bson.M{
		"startedat": bson.M{
			"$lt": time.Now().AddDate(0, 0, -daysAgo).Unix() * 1000,
		},
	})

	if err != nil {
		log.Fatal("Failed to cleanup old report records", err)
	}
}
