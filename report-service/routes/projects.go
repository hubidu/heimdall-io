package routes

import (
	"errors"
	"net/http"

	"github.com/hubidu/e2e-backend/report-lib/model"

	"github.com/gin-gonic/gin"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type projectInfo struct {
	Name   string
	Report model.Report
}

// Build a list of projects with the last executed test
func buildProjectInfo(projects []string, reports []model.Report) []projectInfo {
	var ret []projectInfo

	for i := range projects {
		pi := projectInfo{projects[i], reports[i]}
		ret = append(ret, pi)
	}

	return ret
}

// DeleteByOwnerkey deletes a project of the given ownerkey
func DeleteByOwnerkey(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	ownerkey := c.Param("ownerkey")
	if ownerkey == "" {
		c.AbortWithError(400, errors.New("ownerkey must be provided"))
		return
	}

	project := c.Param("project")
	if project == "" {
		c.AbortWithError(400, errors.New("project must be provided"))
		return
	}

	_, err := db.C(ReportsCollection).RemoveAll(bson.M{"ownerkey": ownerkey, "project": project})
	if err != nil {
		c.Error(err)
	}

	c.Status(http.StatusOK)
}

// GetByOwnerkey retrieves available test projects for the given owner key
func GetByOwnerkey(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	ownerkey := c.Param("ownerkey")
	if ownerkey == "" {
		c.AbortWithError(400, errors.New("ownerkey must be provided"))
		return
	}

	// fields := bson.M{"hashcategory": 1, "filename": 1, "startedat": 1, "started": 1, "type": 1, "prefix": 1, "title": 1, "fulltitle": 1, "result": 1, "duration": 1}
	var projects []string

	err := db.C(ReportsCollection).Find(bson.M{"ownerkey": ownerkey}).Distinct("project", &projects)

	projects = append([]string{"#All"}, projects...)

	// For each project find the last executed test
	var reports []model.Report
	for i := range projects {
		var tmpReports []model.Report

		if i == 0 {
			err := db.C(ReportsCollection).Find(bson.M{"ownerkey": ownerkey}).Sort("-_id").Limit(1).All(&tmpReports)
			if err != nil {
				c.AbortWithError(400, err)
			}
		} else {
			err := db.C(ReportsCollection).Find(bson.M{"ownerkey": ownerkey, "project": projects[i]}).Sort("-_id").Limit(1).All(&tmpReports)
			if err != nil {
				c.AbortWithError(400, err)
			}
		}

		// Don't really understand how this can happen (no test report for a project), but it does
		if len(tmpReports) > 0 {
			reports = append(reports, tmpReports[0])
		} else {
			// Create a dummy report
			reports = append(reports, model.Report{Project: projects[i], Title: "Dummy"})
		}
	}

	if err != nil {
		c.Error(err)
	}

	c.JSON(http.StatusOK, buildProjectInfo(projects, reports))
}
