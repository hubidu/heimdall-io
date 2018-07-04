package routes

import (
	b64 "encoding/base64"
	"fmt"
	"net/http"
	url "net/url"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// GetAttachment gets a screenshot by path and png filename
func GetAttachment(c *gin.Context) {
	path, _ := b64.StdEncoding.DecodeString(c.Param("path"))
	file, _ := b64.StdEncoding.DecodeString(c.Param("file"))

	pathPlain, _ := url.PathUnescape(string(path))
	filePlain, _ := url.PathUnescape(string(file))

	attachmentPath := filepath.Join(baseDir, pathPlain, filePlain)

	if _, err := os.Stat(attachmentPath); os.IsNotExist(err) {
		fmt.Println("Attachment not found (already archived?)", attachmentPath)
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.File(attachmentPath)
	}
}
