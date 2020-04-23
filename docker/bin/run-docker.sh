#!/bin/bash

TEM_REDE_AGENDA="$(docker network ls -f name=^agenda$ | grep agenda)"

if [[ $TEM_REDE_AGENDA == "" ]]; then
  docker network create agenda > /dev/null
fi

docker-compose up -d
