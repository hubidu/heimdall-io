package deployments

import (
	"crypto/tls"
	"encoding/json"
	"net/http"
	"os"
	"sort"
	"time"
)

// Bamboo deployment moel
//

type Deployment struct {
	DeploymentProject   DeploymentProject
	EnvironmentStatuses []EnvironmentStatus
}

type DeploymentProject struct {
	Name string
}

type EnvironmentStatus struct {
	Environment      Environment
	DeploymentResult DeploymentResult
}

type Environment struct {
	Name string
}

type DeploymentResult struct {
	ReasonSummary         string
	DeploymentVersionName string
	DeploymentState       string
	FinishedDate          int64
}

//
// Generic deployment types
//

type ByDate []GenericDeployment

func (s ByDate) Len() int {
	return len(s)
}
func (s ByDate) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s ByDate) Less(i, j int) bool {
	return s[i].FinishedAt < s[j].FinishedAt
}

type GenericDeployment struct {
	FinishedAt  int64
	Finished    time.Time
	Environment string
	ProjectName string
	Version     string
	Result      string
	Description string
}

func selectSuccessfulProduction(deployments []Deployment) (ret []GenericDeployment) {
	for _, d := range deployments {
		for _, es := range d.EnvironmentStatuses {
			if es.Environment.Name == "Production" && es.DeploymentResult.DeploymentState == "SUCCESS" {
				ret = append(ret, GenericDeployment{
					FinishedAt:  es.DeploymentResult.FinishedDate,
					Finished:    time.Unix(es.DeploymentResult.FinishedDate/1000, 0),
					ProjectName: d.DeploymentProject.Name,
					Environment: es.Environment.Name,
					Version:     es.DeploymentResult.DeploymentVersionName,
					Result:      es.DeploymentResult.DeploymentState,
					Description: es.DeploymentResult.ReasonSummary})
			}
		}
	}
	return
}

func GetRecentBambooDeployments() []GenericDeployment {
	bambooHost := os.Getenv("BAMBOO_HOST")
	bambooUser := os.Getenv("BAMBOO_USER")
	bambooPassword := os.Getenv("BAMBOO_PASSWORD")

	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}

	client := &http.Client{Transport: tr}

	req, err := http.NewRequest("GET", "https://"+bambooHost+"/rest/api/latest/deploy/dashboard", nil)

	req.SetBasicAuth(bambooUser, bambooPassword)
	rs, err := client.Do(req)

	// Process response
	if err != nil {
		panic(err) // More idiomatic way would be to print the error and die unless it's a serious error
	}
	defer rs.Body.Close()

	deployments := []Deployment{}
	json.NewDecoder(rs.Body).Decode(&deployments)

	genericDeployments := selectSuccessfulProduction(deployments)
	genericDeploymentsByDate := ByDate(genericDeployments)
	sort.Sort(sort.Reverse(genericDeploymentsByDate))

	return genericDeployments
}
