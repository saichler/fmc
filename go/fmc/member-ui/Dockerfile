FROM saichler/builder:latest AS build

COPY ./main.go /home/src/github.com/saichler/build/
RUN go mod init
RUN GOPROXY=direct GOPRIVATE=github.com go mod tidy
RUN go build -o fmcmemberweb

FROM saichler/fmc-security:latest AS final
COPY --from=build /home/src/github.com/saichler/build/fmcmemberweb /home/run/fmcmemberweb
COPY ./web /home/run/web

ENTRYPOINT ["/home/run/fmcmemberweb"]
