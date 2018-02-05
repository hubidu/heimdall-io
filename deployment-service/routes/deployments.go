package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hubidu/e2e-backend/report-lib/deployments"
)

// List returns a list of recent deployments
func List(c *gin.Context) {
	deployments := deployments.GetRecentBambooDeployments()

	c.JSON(http.StatusOK, deployments)
}
