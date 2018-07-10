package model

import (
	"encoding/json"
	"fmt"
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
	Environment    string        // test environment: dev, int, staging, production
	OwnerKey       string        // api key of report creator/owner
	Runid          string        // id which identifies the test run
	Project        string        // name/id of the test project
	HashCategory   uint32        // hash of test title and test prefix to generate an id for a test case
	ReportFileName string        // name of the report metadata file
	ReportDir      string
	Started        time.Time
	StartedAt      int64   // timestamp when the report has been generated
	Type           string  // ???
	Prefix         string  // Prefix/namespace/directory folder of test case
	Title          string  // test/scenario title
	FullTitle      string  // Prefix + title
	Result         string  // test result "success" | "error"
	Duration       float32 // duration of test run in ms
	Outline        Outline
	Tags           []string       // Test tags extracted from title and prefix
	Screenshots    []Screenshot   // a list of screenshots taken during test execution
	Logs           []LogEntry     // @deprecated
	DeviceSettings DeviceSettings // info about browser/device type and resolution
	User           UserInfo
}

type UserInfo struct {
	Name  string // git user name
	Email string // git user email
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
	Actual     string
	Expected   string
	OrgStack   string
	Screenshot string
	Page       Page
	Cmd        Command
	CodeStack  []CodeStack
}

func (s *Screenshot) ComputeHashID() uint32 {
	if len(s.CodeStack) == 0 {
		return 0
	}

	return hash(s.Message + s.CodeStack[0].Location.File + s.CodeStack[0].GetExecutedCommand())
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

type Command struct {
	Name string
	Args []string
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
	Timestamp int64
}

type DeviceSettings struct {
	Name           string
	Type           string
	Browser        string
	BrowserVersion string
	Os             string
	Width          int32
	Height         int32
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
			log.Println("Failed to read report file ", path)
			return nil
		}

		r := Report{}
		err = json.Unmarshal(raw, &r)

		if err != nil {
			log.Println("Failed to parse report file ", path, err)
			return nil
		}

		r.ReportFileName = filepath.Base(path)
		r.ReportDir = strings.Replace(filepath.Dir(path), baseDir, "", -1)
		// Compute a hash so same test on different envs and projects can be grouped together
		r.HashCategory = hash(fmt.Sprintf("%s_%s", r.Prefix, r.Title))
		r.Started = time.Unix(r.StartedAt/1000, 0)

		// Add hashid to all screenshots to find them faster
		for i, s := range r.Screenshots {
			r.Screenshots[i].HashID = s.ComputeHashID()
		}

		fileList = append(fileList, r)
		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

	return fileList
}
