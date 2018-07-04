package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hubidu/e2e-backend/deployment-service/hipchat"
	deployments "github.com/hubidu/e2e-backend/deployment-service/routes"
	"github.com/hubidu/e2e-backend/report-lib/db"
	"github.com/hubidu/e2e-backend/report-lib/middlewares"
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
	r.POST("/:api_token/deployments", deployments.Report)
	r.GET("/hipchat/list-rooms", func(c *gin.Context) {
		rooms := hipchat.ListRooms()
		c.JSON(http.StatusOK, rooms)
	})

	r.Run("0.0.0.0:8000")
}
