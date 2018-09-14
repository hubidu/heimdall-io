package model

import (
	"log"
	"strings"
	"time"

	"github.com/hubidu/e2e-backend/report-lib/db"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const TestStatusCollection = "test-status"
const KeepLastNReports = 250

type TestStatusReport struct {
	ReportID       bson.ObjectId  `json:"reportId" bson:"reportId"`
	Runid          string         `json:"runid" bson:"runid"`
	StartedAt      int64          `json:"startedAt" bson:"startedAt"`
	Result         string         `json:"result" bson:"result"`
	Duration       float32        `json:"duration" bson:"duration"`
	DeviceSettings DeviceSettings `json:"deviceSettings" bson:"deviceSettings"`
	Environment    string         `json:"environment" bson:"environment"`
	Project        string         `json:"project" bson:"project"`
}

// TODO Extract data part from title
// TODO Could also calculate stability, average duration, unique devices etc.
type TestStatus struct {
	ID           bson.ObjectId                 `json:"_id,omitempty" bson:"_id,omitempty"`
	CreatedAt    int64                         `json:"createdAt" bson:"createdAt"`
	ModifiedAt   int64                         `json:"modifiedAt" bson:"modifiedAt"`
	OwnerKey     string                        `json:"ownerkey" bson:"ownerkey"`
	Project      string                        `json:"project" bson:"project"`
	HashCategory uint32                        `json:"hashcategory" bson:"hashcategory"`
	Prefix       string                        `json:"prefix" bson:"prefix"`
	Title        string                        `json:"title" bson:"title"`
	Data         string                        `json:"data" bson:"data"`
	Tags         []string                      `json:"tags" bson:"tags"`
	Reports      map[string][]TestStatusReport `json:"reports" bson:"reports"`
}

func separateTitleAndData(title string) (string, string) {
	i := strings.Index(title, "|")
	if i < 0 {
		return title, ""
	}
	return title[:i], title[i+1:]
}

func NewTestStatus(report *Report) TestStatus {
	reportTitle, reportData := separateTitleAndData(report.Title)

	testStatus := TestStatus{
		ID:           bson.NewObjectId(),
		CreatedAt:    int64(time.Now().Unix() * 1000),
		ModifiedAt:   int64(time.Now().Unix() * 1000),
		OwnerKey:     report.OwnerKey,
		Project:      report.Project,
		HashCategory: report.HashCategory,
		Prefix:       report.Prefix,
		Title:        reportTitle,
		Data:         reportData,
		Tags:         report.Tags,
		Reports:      map[string][]TestStatusReport{},
	}

	return testStatus
}

func (ts *TestStatus) AddReport(report *Report) {
	testStatusReport := TestStatusReport{
		ReportID:       report.Id,
		Runid:          report.Runid,
		StartedAt:      report.StartedAt,
		Result:         report.Result,
		Duration:       report.Duration,
		DeviceSettings: report.DeviceSettings,
		Environment:    report.Environment,
		Project:        report.Project,
	}

	ForDevice := report.Environment + "_" + report.DeviceSettings.Type + "_" + report.DeviceSettings.Browser

	reportsForDevice := ts.Reports[ForDevice]

	i := 0
	reportsForDevice = append(reportsForDevice[:i], append([]TestStatusReport{testStatusReport}, reportsForDevice[i:]...)...)

	if len(reportsForDevice) > KeepLastNReports {
		// Pop the last element
		_, reportsForDevice = reportsForDevice[len(reportsForDevice)-1], reportsForDevice[:len(reportsForDevice)-1]
	}

	ts.Reports[ForDevice] = reportsForDevice
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
