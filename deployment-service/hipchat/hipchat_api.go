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
	Notify        bool   `json:"notify"`
	MessageFormat string `json:"message_format"`
}

// RoomResponse hipchat room response
type RoomResponse struct {
	Items []Room `json:"items"`
}

// ListRooms lists hipchat rooms
func ListRooms() []Room {
	url := fmt.Sprintf("%s/v2/room?auth_token=%s&max-results=1000", HipchatURL, APIToken)
	res, err := httpclient.Get(url)

	if err != nil {
		fmt.Println("Error in ListRooms", err)
		return []Room{}
	}

	roomResponse := RoomResponse{}
	bodyBytes, _ := res.ReadAll()
	json.Unmarshal(bodyBytes, &roomResponse)

	return roomResponse.Items
}

// SendMessageToRoom sends a hipchat message to the specified room
func SendMessageToRoom(roomIdOrName string, message string) error {
	url := fmt.Sprintf("%s/v2/room/%s/notification?auth_token=%s", HipchatURL, roomIdOrName, APIToken)
	msg := Message{
		Message:       message,
		Notify:        true,
		MessageFormat: "html",
	}

	fmt.Println("Sending message to room", url, msg)

	_, err := httpclient.PostJson(url, msg)
	if err != nil {
		fmt.Println("Error in SendMessageToRoom", err)
	}

	return err
}

func sendMessage(idOrEmail string, message string) {
	url := fmt.Sprintf("%s/v2/user/%s/message?auth_token=%s", HipchatURL, idOrEmail, APIToken)
	msg := Message{
		Message:       message,
		Notify:        true,
		MessageFormat: "html",
	}

	fmt.Println("Sending message to", url, msg)

	_, err := httpclient.PostJson(url, msg)
	if err != nil {
		fmt.Println("Error in sendMessage", err)
	}
}

// SendMessages sends a message to multiple recipients
func SendMessages(ids []string, message string) {
	for _, id := range ids {
		sendMessage(id, message)
	}
}

// GetRoom gets information for a hipchat room
func GetRoom(id int) string {
	url := fmt.Sprintf("%s/v2/room/%d?auth_token=%s", HipchatURL, id, APIToken)
	fmt.Println(url)
	res, _ := httpclient.Get(url)

	body, _ := res.ToString()
	return body
}
