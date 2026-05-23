#!/usr/bin/env bash
set -e
docker build --no-cache --platform=linux/amd64 -t saichler/fmc-member-web:latest .
docker push saichler/fmc-member-web:latest
