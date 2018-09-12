package model

import (
	"log"

	"github.com/hubidu/e2e-backend/report-lib/db"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const TestStatusCollection = "test-status"
const KeepLastNReports = 500

type TestStatusReport struct {
	reportId       bson.ObjectId  `json:"_id,omitempty" bson:"_id,omitempty"`
	Runid          string         `json:"runid" bson:"runid"`
	StartedAt      int64          `json:"startedAt" bson:"startedAt"`
	Result         string         `json:"result" bson:"result"`
	Duration       float32        `json:"duration" bson:"duration"`
	DeviceSettings DeviceSettings `json:"deviceSettings" bson:"deviceSettings"`
	Environment    string         `json:"environment" bson:"environment"`
}

// TODO Extract data part from title
// TODO Could also calculate stability, average duration, unique devices etc.
type TestStatus struct {
	Id           bson.ObjectId      `json:"_id,omitempty" bson:"_id,omitempty"`
	CreatedAt    int64              `json:"createdAt" bson:"createdAt"`
	ModifiedAt   int64              `json:"modifiedAt" bson:"modifiedAt"`
	OwnerKey     string             `json:"ownerkey" bson:"ownerkey"`
	Project      string             `json:"project" bson:"project"`
	HashCategory uint32             `json:"hashcategory" bson:"hashcategory"`
	Prefix       string             `json:"prefix" bson:"prefix"`
	Title        string             `json:"title" bson:"title"`
	Tags         []string           `json:"tags" bson:"tags"`
	Reports      []TestStatusReport `json:"reports" bson:"reports"`
}

func (ts *TestStatus) AddReport(report *Report) {
	testStatusReport := TestStatusReport{
		reportId:       report.Id,
		StartedAt:      report.StartedAt,
		Result:         report.Result,
		Duration:       report.Duration,
		DeviceSettings: report.DeviceSettings,
		Environment:    report.Environment,
	}

	i := 0
	ts.Reports = append(ts.Reports[:i], append([]TestStatusReport{testStatusReport}, ts.Reports[i:]...)...)

	if len(ts.Reports) > KeepLastNReports {
		// Pop the last element
		_, ts.Reports = ts.Reports[len(ts.Reports)-1], ts.Reports[:len(ts.Reports)-1]
	}
}

func EnsureTestStatusIndexes() {
	s := db.Session.Clone()
	c := s.DB(DBName).C(TestStatusCollection)
	defer s.Close()

	index := mgo.Index{
		Key:        []string{"ownerkey: 1", "project: 1", "hashcategory: 1"},
		Background: true,
	}

	err := c.EnsureIndex(index)
	if err != nil {
		log.Fatal(err)
	}

}
