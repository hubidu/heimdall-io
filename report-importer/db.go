package main

import (
	"log"

	"github.com/hubidu/e2e-backend/report-lib/db"
	"gopkg.in/mgo.v2"
)

func insertReportsIntoDB(reports []Report) {
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
