package routes

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hubidu/e2e-backend/deployment-service/hipchat"
)

// NotificationRecipients is a comma separated list of email addresses
var NotificationRecipients = os.Getenv("NOTIFICATION_RECIPIENTS")

// Change describes a single change of the deployed project
type Change struct {
	ID      string `json:"id"`
	Subject string `json:"subject"`
}

// Deployment data which can be reported
type Deployment struct {
	DeployedAt  int64    `json:"deployedAt"`
	DeployedBy  string   `json:"deployedBy"`
	Environment string   `json:"environment"`
	Project     string   `json:"project"`
	Changelog   []Change `json:"changelog"`
}

// Report a new deployment
func Report(c *gin.Context) {
	var deployment Deployment

	if err := c.ShouldBindJSON(&deployment); err == nil {
		msg := fmt.Sprintf("<i>%s</i> just deployed <strong>%s</strong> to <b>%s</b>",
			deployment.DeployedBy, deployment.Project, deployment.Environment)

		hipchat.SendMessages(strings.Split(NotificationRecipients, ","), msg)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}
