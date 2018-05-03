package main

import (
	"github.com/gin-gonic/gin"
	dashboard "github.com/hubidu/e2e-backend/report-uploader/routes"
	tokens "github.com/hubidu/e2e-backend/report-uploader/routes"
	uploads "github.com/hubidu/e2e-backend/report-uploader/routes"
)

func main() {
	router := gin.Default()

	// Set a lower memory limit for multipart forms (default is 32 MiB)
	// router.MaxMultipartMemory = 8 << 20 // 8 MiB

	router.POST("/upload", uploads.ReceiveZippedReportData)
	router.GET("/dashboard-url/:ownerkey/:project", dashboard.CreateUrl)
	router.GET("/tokens/create/:user", tokens.CreateToken)

	router.Run("0.0.0.0:8000")
}
