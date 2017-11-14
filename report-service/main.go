package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hubidu/e2e-backend/report-lib/db"
	"github.com/hubidu/e2e-backend/report-service/middlewares"
	reports "github.com/hubidu/e2e-backend/report-service/routes"
)

func init() {
	db.Connect()
}

func main() {
	r := gin.Default()

	r.RedirectTrailingSlash = true
	r.RedirectFixedPath = true

	// Middlewares
	r.Use(middlewares.Connect)
	r.Use(middlewares.ErrorHandler)
	// TODO Use production config
	r.Use(cors.Default())

	// Routes
	r.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/reports")
	})

	r.GET("/reports", reports.List)
	r.GET("/reports/:_id", reports.Get)
	// TODO Strip down the report model in a report group items
	r.GET("/report-categories", reports.ReportCategories)
	r.GET("/report-categories/:hashcategory", reports.GetReportsByCategory)

	r.Run("0.0.0.0:8000")
}
