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

	coll := s.DB("e2e").C(model.ReportCollection)

	for i, _ := range reports {
		reports[i].Id = bson.NewObjectId() // Create id to be able to link to the report

		err := coll.Insert(&reports[i])

		if err != nil {
			log.Fatal(err)
		}
	}
}

func UpdateTestStatusView(reports []model.Report) {
	s := db.Session.Clone()
	defer s.Close()
	testStatiCollection := s.DB("e2e").C(model.TestStatusCollection)

	insertTestStati := []model.TestStatus{}
	updateTestStati := []model.TestStatus{}

	for _, report := range reports {

		testStatus := model.TestStatus{}

		err := testStatiCollection.Find(bson.M{
			"ownerkey": report.OwnerKey,
			// "project":      report.Project, // projects are more like "views" on tests, aka the same test can appear in multiple projects
			"hashcategory": report.HashCategory}).One(&testStatus)

		if err != nil {
			testStatus = model.NewTestStatus(&report)
			testStatus.AddReport(&report)
			insertTestStati = append(insertTestStati, testStatus)
		} else {

			testStatus.AddReport(&report)
			updateTestStati = append(updateTestStati, testStatus)
		}
	}

	// TODO Better use upsert
	for _, testStatus := range insertTestStati {
		err := testStatiCollection.Insert(&testStatus)
		if err != nil {
			log.Fatal(err)
		}
	}

	for _, testStatus := range updateTestStati {
		testStatus.ModifiedAt = int64(time.Now().Unix() * 1000)

		err := testStatiCollection.Update(bson.M{"_id": testStatus.ID}, &testStatus)
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

	coll := s.DB("e2e").C(model.ReportCollection)

	_, err := coll.RemoveAll(bson.M{
		"startedat": bson.M{
			"$lt": time.Now().AddDate(0, 0, -daysAgo).Unix() * 1000,
		},
	})
	if err != nil {
		log.Fatal("Failed to cleanup old report records", err)
	}

	err = s.Run(bson.D{{"compact", model.ReportCollection}}, bson.D{})
	if err != nil {
		log.Fatal("Failed to cleanup old report records", err)
	}

	err = s.Run(bson.D{{"compact", model.TestStatusCollection}}, bson.D{})
	if err != nil {
		log.Fatal("Failed to cleanup old report records", err)
	}
}
