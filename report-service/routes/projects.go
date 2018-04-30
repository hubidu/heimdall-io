package routes

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

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

	if err != nil {
		c.Error(err)
	}

	c.JSON(http.StatusOK, projects)
}
