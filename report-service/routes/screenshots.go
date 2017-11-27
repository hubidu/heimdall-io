package routes

import (
	b64 "encoding/base64"
	"fmt"
	"net/http"
	url "net/url"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hubidu/e2e-backend/report-lib/model"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// see Dockerfile
var baseDir = "/go/src/app/reports"

// GetScreenshotImg gets a screenshot by path and png filename
func GetScreenshotImg(c *gin.Context) {
	path, _ := b64.StdEncoding.DecodeString(c.Param("path"))
	file, _ := b64.StdEncoding.DecodeString(c.Param("file"))

	pathPlain, _ := url.PathUnescape(string(path))
	filePlain, _ := url.PathUnescape(string(file))

	screenshotPath := filepath.Join(baseDir, pathPlain, filePlain)

	if _, err := os.Stat(screenshotPath); os.IsNotExist(err) {
		fmt.Println("Screenshot not found (already archived?)", screenshotPath)
		// return a placeholder image if the screenshot does not exist (because it has been cleaned up)
		c.Redirect(http.StatusMovedPermanently, "http://via.placeholder.com/800x600/")
	} else {
		c.File(screenshotPath)
	}
}

type ScreenshotOfReport struct {
	ReportDir  string
	Screenshot model.Screenshot
}

// GetScreenshotsByCategory gets matching screenshot metadata using hashids
func GetScreenshotsByCategory(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	// reportLimit, _ := strconv.Atoi(c.DefaultQuery("limit", "100"))
	deviceType := c.DefaultQuery("device", "desktop")
	hashids, _ := strconv.Atoi(c.Param("hashids"))

	// Get successful reports containing a screenshot with same hashid
	query := bson.M{
		"result":              "success",
		"devicesettings.type": deviceType,
		"screenshots.hashid": bson.M{
			"$in": []int{hashids}, // TODO Support multiple, csv separated ids
		},
	}

	var reports []model.Report
	err := db.C(ReportsCollection).Find(query).Sort("-startedat").Limit(1).All(&reports)
	if err != nil {
		c.Error(err)
	}

	var screenshots []ScreenshotOfReport
	for _, report := range reports {
		for _, screenshot := range report.Screenshots {
			if screenshot.HashID == uint32(hashids) {
				screenshots = append(screenshots, ScreenshotOfReport{ReportDir: report.ReportDir, Screenshot: screenshot})
			}
		}
	}

	c.JSON(http.StatusOK, screenshots)
}
