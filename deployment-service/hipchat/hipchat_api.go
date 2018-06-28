package hipchat

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/ddliu/go-httpclient"
)

// HipchatURL is the url of the hipchat REST API
var HipchatURL = os.Getenv("HIPCHAT_URL")

// APIToken is the hipchat REST API token
var APIToken = os.Getenv("HIPCHAT_API_TOKEN")

// Room represents a hipchat room
type Room struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Privacy string `json:"privacy"`
}

// Message is a hipchat message
type Message struct {
	Message       string `json:"message"`
	Notify        string `json:"notify"`
	MessageFormat string `json:"message_format"`
}

// RoomResponse hipchat room response
type RoomResponse struct {
	Items []Room `json:"items"`
}

func ListRooms() []Room {
	url := fmt.Sprintf("%s/v2/room?auth_token=%s", HipchatURL, APIToken)
	fmt.Println(url)
	res, _ := httpclient.Get(url)

	roomResponse := RoomResponse{}
	bodyBytes, _ := res.ReadAll()
	json.Unmarshal(bodyBytes, &roomResponse)

	return roomResponse.Items
}

func sendMessage(idOrEmail string, message string) {
	url := fmt.Sprintf("%s/v2/user/%s/message?auth_token=%s", HipchatURL, idOrEmail, APIToken)
	msg := Message{
		Message:       message,
		Notify:        "true",
		MessageFormat: "html",
	}

	fmt.Println("Sending message to ", url, msg)

	httpclient.PostJson(url, msg)
}

func SendMessages(ids []string, message string) {
	for _, id := range ids {
		sendMessage(id, message)
	}
}

func GetRoom(id int) string {
	url := fmt.Sprintf("%s/v2/room/%d?auth_token=%s", HipchatURL, id, APIToken)
	fmt.Println(url)
	res, _ := httpclient.Get(url)

	body, _ := res.ToString()
	return body
}

func main() {
	// rooms := listRooms()
	// room := getRoom(482)
	// fmt.Println(room)

	SendMessages([]string{"stefan.huber@check24.de", "foo@bar.de"}, "<strong>Hello</strong> stefan: <ul><li>one</li><li>two</li></ul>")
}
