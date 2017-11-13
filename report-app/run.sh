docker build -t e2e-reporter . || exit

RUNNING=`docker ps | grep e2e-reporter | wc -l`
if [ ${RUNNING} -gt 1 ]; then
  echo "E2E reporter is already running -> stopping..."
  docker stop --name e2e-reporter
fi

docker run --name e2e-reporter -d --restart unless-stopped -p 4000:4000 -v /var/atlassian/application-data/e2e/out:/opt/e2e/__out -it e2e-reporter || exit 1
