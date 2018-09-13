set -e

IMAGE_NAME=report-app

mkdir -p ./bin
EXECUTABLE=./bin/main

TAG=`git log -1 --pretty=%h`

NAME=$DOCKER_ID_USER/$IMAGE_NAME
IMG=${NAME}:${TAG}
LATEST=${NAME}:${TAG}

docker build -t $IMG .
docker tag $IMG $LATEST

docker push $NAME

