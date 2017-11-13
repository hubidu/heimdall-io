mkdir -p ./bin

IMAGE_NAME=report-app

docker build -t  $DOCKER_ID_USER/$IMAGE_NAME . || exit 1

docker push $DOCKER_ID_USER/$IMAGE_NAME
