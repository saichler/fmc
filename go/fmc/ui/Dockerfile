FROM saichler/builder:latest AS build

COPY ./main.go /home/src/github.com/saichler/build/
RUN go mod init
RUN GOPROXY=direct GOPRIVATE=github.com go mod tidy
RUN go build -o fmcweb

FROM saichler/fmc-security:latest AS final
COPY --from=build /home/src/github.com/saichler/build/fmcweb /home/run/fmcweb
COPY ./web /home/run/web

ENTRYPOINT ["/home/run/fmcweb"]
