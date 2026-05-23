#!/usr/bin/env bash
set -e
docker build --no-cache --platform=linux/amd64 -t saichler/fmc-web:latest .
docker push saichler/fmc-web:latest
