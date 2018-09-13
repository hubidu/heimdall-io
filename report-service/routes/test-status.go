package routes

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hubidu/e2e-backend/report-lib/model"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func ListTestStatus(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	ownerkey := c.Param("ownerkey")
	if ownerkey == "" {
		c.AbortWithError(400, errors.New("ownerkey must be provided"))
		return
	}

	testStatus := []model.TestStatus{}
	err := db.C(model.TestStatusCollection).Find(bson.M{"ownerkey": ownerkey}).All(&testStatus)
	if err != nil {
		c.Error(err)
	}

	c.JSON(http.StatusOK, testStatus)
}
