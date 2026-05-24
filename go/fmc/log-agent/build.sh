#!/usr/bin/env bash
set -e
docker build --no-cache --platform=linux/amd64 -t saichler/fmc-log-agent:latest .
docker push saichler/fmc-log-agent:latest
