set -e

IMAGE_NAME=report-importer

mkdir -p ./bin
EXECUTABLE=./bin/main

TAG=`git log -1 --pretty=%h`

NAME=$DOCKER_ID_USER/$IMAGE_NAME
IMG=${NAME}:${TAG}
LATEST=${NAME}:${TAG}

CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o $EXECUTABLE .

docker build -t $IMG .
docker tag $IMG $LATEST

docker push $NAME