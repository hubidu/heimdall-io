package routes

import (
	b64 "encoding/base64"
	"fmt"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// see Dockerfile
var baseDir = "/go/src/app/reports"

// GetScreenshotImg gets a screenshot by path and png filename
func GetScreenshotImg(c *gin.Context) {
	path, _ := b64.StdEncoding.DecodeString(c.Param("path"))
	file, _ := b64.StdEncoding.DecodeString(c.Param("file"))

	screenshotPath := filepath.Join(baseDir, string(path), string(file))

	fmt.Println("Path", screenshotPath)

	c.File(screenshotPath)
}
