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

func buildProjectInfo(projects []string, reports []model.Report) []projectInfo {
	var ret []projectInfo

	for i := range projects {
		pi := projectInfo{projects[i], reports[i]}
		ret = append(ret, pi)
	}

	return ret
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
		reports = append(reports, tmpReports[0])
	}

	if err != nil {
		c.Error(err)
	}

	c.JSON(http.StatusOK, buildProjectInfo(projects, reports))
}
