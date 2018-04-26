package model

import (
	"encoding/json"
	"hash/fnv"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gopkg.in/mgo.v2/bson"
)

type ReportGroup struct {
	HashCategory uint32
	Prefix       string
	Title        string
	Type         string
	LastReport   Report
	Items        []ReportSlim
}

type ReportSlim struct {
	Id             bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	StartedAt      int64
	Result         string
	Duration       float32
	DeviceSettings DeviceSettings
}

type Report struct {
	Id             bson.ObjectId `json:"_id,omitempty" bson:"_id,omitempty"`
	OwnerKey       string        // api key of report creator/owner
	RunID          string        // id which identifies the test run
	Project        string        // name/id of the test project
	HashCategory   uint32
	ReportFileName string
	ReportDir      string
	Started        time.Time
	StartedAt      int64
	Type           string
	Prefix         string
	Title          string
	FullTitle      string
	Result         string
	Duration       float32
	Outline        Outline
	Screenshots    []Screenshot
	Logs           []LogEntry
	DeviceSettings DeviceSettings
}

type Outline struct {
	Steps []Step
}

type Step struct {
	ReachedAt  int
	Success    bool
	Name       string
	ActualName string
}

type Screenshot struct {
	HashID     uint32 // identify similar screenshots
	ShotAt     int
	Success    bool
	Message    string
	OrgStack   string
	Screenshot string
	Page       Page
	CodeStack  []CodeStack
}

type CodeStack struct {
	Location Location
	Source   []SourceLine
}

func (m *CodeStack) GetExecutedCommand() string {
	execLine := m.Location.Line
	var ret string
	for _, line := range m.Source {
		if line.Line == execLine {
			ret = line.Value
		}
	}

	return ret
}

type Page struct {
	Url   string
	Title string
}

type Location struct {
	Line int32
	File string
}

type SourceLine struct {
	Line  int32
	Value string
}

type LogEntry struct {
	Level     string
	Message   string
	Source    string
	Timestamp int32
}

type DeviceSettings struct {
	Name    string
	Type    string
	Browser string
	Width   int32
	Height  int32
}

func hash(s string) uint32 {
	h := fnv.New32a()
	h.Write([]byte(s))
	return h.Sum32()
}

// GetReportFiles finds all report files in a given base directory and reads them in
func GetReportFiles(baseDir string) []Report {
	fileList := []Report{}

	err := filepath.Walk(baseDir, func(path string, f os.FileInfo, err error) error {
		if !strings.HasSuffix(path, "report.json") {
			return nil
		}

		raw, err := ioutil.ReadFile(path)

		if err != nil {
			return nil
		}

		r := Report{}
		json.Unmarshal(raw, &r)

		r.ReportFileName = filepath.Base(path)
		r.ReportDir = strings.Replace(filepath.Dir(path), baseDir, "", -1)
		r.HashCategory = hash(r.FullTitle)
		r.Started = time.Unix(r.StartedAt/1000, 0)

		// Add hashid to all screenshots to find them faster
		for i, s := range r.Screenshots {
			screenshotHashID := hash(s.Message + s.CodeStack[0].Location.File + s.CodeStack[0].GetExecutedCommand())
			r.Screenshots[i].HashID = screenshotHashID
		}

		fileList = append(fileList, r)
		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

	return fileList
}
