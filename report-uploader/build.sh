IMAGE_NAME=report-uploader

CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ./bin/main . || exit 1

docker build -t  $DOCKER_ID_USER/$IMAGE_NAME . || exit 1

docker push $DOCKER_ID_USER/$IMAGE_NAME