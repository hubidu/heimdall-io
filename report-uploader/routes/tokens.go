package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/segmentio/ksuid"
)

func genKsuid() string {
	id := ksuid.New()
	return id.String()
}

func CreateToken(c *gin.Context) {
	c.String(http.StatusOK, genKsuid())
}
