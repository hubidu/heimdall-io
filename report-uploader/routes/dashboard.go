package routes

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CreateUrl(c *gin.Context) {
	ownerkey := c.Param("ownerkey")
	project := c.Param("project")
	runid := c.Param("runid")
	hostWithoutPort := strings.Replace(c.Request.Host, ":8003", "", -1)

	url := fmt.Sprintf("http://%s:4000/tests?ownerkey=%s&project=%s&runid=%s", hostWithoutPort, ownerkey, project, runid)

	c.JSON(http.StatusOK, gin.H{
		"Url": url,
	})
}
