FROM saichler/builder:latest AS build

COPY main.go /home/src/github.com/saichler/build/
RUN go mod init
RUN GOPROXY=direct GOPRIVATE=github.com go mod tidy
RUN go build -o fmc-log-vnet

FROM saichler/fmc-security:latest AS final
COPY --from=build /home/src/github.com/saichler/build/fmc-log-vnet /home/run/fmc-log-vnet

ENTRYPOINT ["/home/run/fmc-log-vnet"]
