package routes

import (
	"net/http"
	"strconv"

	"github.com/hubidu/e2e-backend/report-lib/model"

	"github.com/gin-gonic/gin"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// ReportsCollection name of mongo collection
var ReportsCollection = "reports"

// ReportLimit mongo result set limit
var ReportLimit = 200

func listReports(c *gin.Context) []model.Report {
	db := c.MustGet("db").(*mgo.Database)

	// fields := bson.M{"hashcategory": 1, "filename": 1, "startedat": 1, "started": 1, "type": 1, "prefix": 1, "title": 1, "fulltitle": 1, "result": 1, "duration": 1}
	var reports []model.Report
	err := db.C(ReportsCollection).Find(nil).SetMaxScan(100).Limit(ReportLimit).All(&reports)
	if err != nil {
		c.Error(err)
	}

	return reports
}

// Get a test report by id
func Get(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	report := model.Report{}
	oID := bson.ObjectIdHex(c.Param("_id"))
	err := db.C(ReportsCollection).FindId(oID).One(&report)
	if err != nil {
		c.Error(err)
	}

	c.JSON(http.StatusOK, report)
}

//GetReportsByCategory finds all reports of the specified category/type
func GetReportsByCategory(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	var reports []model.Report
	hashcategory, _ := strconv.Atoi(c.Param("hashcategory"))

	query := bson.M{"hashcategory": hashcategory}

	err := db.C(ReportsCollection).Find(query).All(&reports)
	if err != nil {
		c.Error(err)
	}

	c.JSON(http.StatusOK, reports)
}

// List test reports
func List(c *gin.Context) {
	reports := listReports(c)

	c.JSON(http.StatusOK, reports)
}

// ReportCategories group reports by same category
func ReportCategories(c *gin.Context) {
	reports := listReports(c)

	reportsByCategory := make(map[uint32]*model.ReportGroup)

	for _, report := range reports {
		_, ok := reportsByCategory[report.HashCategory]
		if !ok {
			reportGroup := &model.ReportGroup{report.HashCategory, report.Prefix, report.Title, report.Type, nil}
			reportsByCategory[report.HashCategory] = reportGroup
		}
		reportsByCategory[report.HashCategory].Items = append(reportsByCategory[report.HashCategory].Items, report)
	}

	c.JSON(http.StatusOK, reportsByCategory)
}
