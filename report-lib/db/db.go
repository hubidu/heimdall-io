package db

import (
	"fmt"
	"os"

	"gopkg.in/mgo.v2"
)

var (
	// Session stores mongo session
	Session *mgo.Session

	// Mongo stores the mongodb connection string information
	Mongo *mgo.DialInfo
)

func getURI() string {
	var goenv string
	goenv = os.Getenv("GO_ENV")

	if goenv == "docker" {
		return "mongodb://mongodb:27017/e2e"
	}
	return "mongodb://localhost:27017/e2e"
}

// Connect connects to mongodb
func Connect() {
	uri := getURI()

	fmt.Println("Connecting to mongodb...", uri)

	mongo, err := mgo.ParseURL(uri)
	s, err := mgo.Dial(uri)
	if err != nil {
		fmt.Printf("Can't connect to mongo, go error %v\n", err)
		panic(err.Error())
	}
	s.SetSafe(&mgo.Safe{})
	fmt.Println("Connected to", uri)
	Session = s
	Mongo = mongo
}

// InitializeIndexes initializes indexes on db
func InitializeIndexes() {
	// Set mongo db indexes
	c := Session.DB("e2e").C("reports")

	index := mgo.Index{
		Key: []string{"hashcategory: 1"},
	}

	err := c.EnsureIndex(index)
	if err != nil {
		panic(err)
	}

}
