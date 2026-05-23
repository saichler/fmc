#!/usr/bin/env bash
set -e
docker build --no-cache --platform=linux/amd64 -t saichler/fmc:latest .
docker push saichler/fmc:latest
