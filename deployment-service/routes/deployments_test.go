package routes

import (
	"testing"

	"github.com/hubidu/e2e-backend/deployment-service/routes"
)

func TestFormatMessage(t *testing.T) {
	deployment := routes.Deployment{
		DeployedBy:  "foo@bar.de",
		Environment: "production",
		Project:     "test-app",
		Changelog: routes.Changelog{
			GitRevision: "123455ljf",
			Logs: []string{
				"first line", "second line", "third line",
			},
		},
	}

	msg, _ := routes.FormatMessage(&deployment)
	if len(msg) == 0 {
		t.Fatal("Expected message to not be empty", msg)
	}
}
