package service

import (
	b64 "encoding/base64"
	"fmt"
	"net/url"
	"path"

	"github.com/hubidu/e2e-backend/alert-service/config"
	resty "gopkg.in/resty.v1"
)

type DownloadedScreenshot struct {
	Path string
}

func DownloadScreenshot(testPath string, screenshot string) DownloadedScreenshot {
	config := config.NewServiceConfig()
	pathEncoded := b64.StdEncoding.EncodeToString([]byte(url.PathEscape(testPath)))
	screenshotEncoded := b64.StdEncoding.EncodeToString([]byte(url.PathEscape(screenshot)))

	downloadURL := fmt.Sprintf("%s/screenshots/%s/%s", config.ReportServiceHost, pathEncoded, screenshotEncoded)
	resty.SetOutputDirectory("/tmp")
	resty.R().SetOutput(screenshot).Get(downloadURL)

	return DownloadedScreenshot{Path: path.Join("/tmp", screenshot)}
}
