FROM scratch

WORKDIR /go/src/app/

ADD ./bin/main /go/src/app/

EXPOSE 8080

ENV GO_ENV=docker

CMD ["/go/src/app/main", "/go/src/app/reports"]

