FROM scratch

WORKDIR /go/src/app/
VOLUME ["/data/e2e-reports", "/go/src/app/reports"]

ADD ./bin/main /go/src/app/

EXPOSE 8000

ENV GO_ENV=docker
# ENV GIN_MODE=release

CMD ["/go/src/app/main"]

