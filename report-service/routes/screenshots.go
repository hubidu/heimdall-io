package routes

import (
	b64 "encoding/base64"
	"fmt"
	url "net/url"
	"path/filepath"

	"github.com/gin-gonic/gin"
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
	fmt.Println("Screenshot file path", screenshotPath)

	// if _, err := os.Stat(screenshotPath); os.IsNotExist(err) {
	// 	// return a placeholder image if the screenshot does not exist (because it has been cleaned up)
	// 	c.Redirect(http.StatusMovedPermanently, "http://via.placeholder.com/800x600/")
	// } else {
	c.File(screenshotPath)
	// }
}
