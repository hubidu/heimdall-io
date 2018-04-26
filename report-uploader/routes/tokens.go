package routes

import (
	"crypto/rsa"
	"fmt"
	"io/ioutil"
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

const (
	privKeyPath = "keys/app.rsa"     // openssl genrsa -out app.rsa keysize
	pubKeyPath  = "keys/app.rsa.pub" // openssl rsa -in app.rsa -pubout > app.rsa.pub
)

var (
	verifyKey *rsa.PublicKey
	signKey   *rsa.PrivateKey
)

func init() {
	signBytes, err := ioutil.ReadFile(privKeyPath)
	if err != nil {
		fmt.Println(err)
	}

	signKey, err = jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		fmt.Println(err)
	}

	verifyBytes, err := ioutil.ReadFile(pubKeyPath)
	if err != nil {
		fmt.Println(err)
	}

	verifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
	if err != nil {
		fmt.Println(err)
	}
}

// CreateToken creates a jwt token
func CreateToken(c *gin.Context) {
	// user := c.Param("user")

	token := jwt.New(jwt.GetSigningMethod("RS256"))

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString(signKey)

	if err != nil {
		fmt.Println("Can not create token", err)
	}

	c.String(http.StatusOK, tokenString)
}
