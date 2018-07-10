package routes

import (
	"bytes"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hubidu/e2e-backend/deployment-service/hipchat"
)

// NotificationRecipients is a comma separated list of email addresses
var NotificationRecipients = os.Getenv("NOTIFICATION_RECIPIENTS")

// Changelog consists of git log lines
type Changelog struct {
	GitRevision         string   `json:"git_revision"`
	GitPreviousRevision string   `json:"git_previous_revision"`
	Logs                []string `json:"log"`
}

// Deployment data which can be reported
type Deployment struct {
	DeployedAt  int64     `json:"deployedAt"`
	DeployedBy  string    `json:"deployedBy"`
	Environment string    `json:"environment"`
	Project     string    `json:"project"`
	Changelog   Changelog `json:"changelog"`
}

// FormatMessage formats the chat message for deployments
func FormatMessage(deployment *Deployment) (string, error) {
	t := template.Must(template.New("chat message template").Parse(`
		<i>{{.DeployedBy}}</i> just deployed <strong>{{.Project}}</strong> 
		{{if .Changelog -}}
			{{if .Changelog.GitRevision -}}
			[at rev {{.Changelog.GitRevision}}]
			{{- end}}

			<ul>
			{{- range .Changelog.Logs }}
				<li>
					{{.}}
				</li>
			{{- end}}
			</ul>
		{{- end}}
	`))

	var tpl bytes.Buffer
	if err := t.Execute(&tpl, deployment); err != nil {
		return "", err
	}

	return tpl.String(), nil
}

// Report a new deployment
func Report(c *gin.Context) {
	var deployment Deployment

	if err := c.ShouldBindJSON(&deployment); err == nil {
		// TODO Persist deployments
		// TODO Read notification rules from config
		msg, _ := FormatMessage(&deployment)

		err := hipchat.SendMessageToRoom(NotificationRecipients, msg)
		if err != nil {
			// Hacky retry
			time.Sleep(1000 * time.Millisecond)
			err = hipchat.SendMessageToRoom(NotificationRecipients, msg)
			if err != nil {
				time.Sleep(1000 * time.Millisecond)
				err = hipchat.SendMessageToRoom(NotificationRecipients, msg)
				if err != nil {
					fmt.Println("Finally failed to send hipchat notification", err)
				}
			}
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
}
