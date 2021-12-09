#!/bin/bash

# exit immediately if a command exits with a non-zero status
set -e

# Define some environement variables
export IMAGE_NAME="dev-using-db-api-server"
export BASE_DIR=$(pwd)
export DATABASE_URL="postgres://test:welcome123@dev-using-db-server:5432/dev-using-db"

# Create the network if we don't have it yet
docker network inspect dev-using-db >/dev/null 2>&1 || docker network create dev-using-db

# Build the image based on the Dockerfile
docker build -t $IMAGE_NAME -f Dockerfile .

# Run the container
docker run --rm --name $IMAGE_NAME -ti \
--mount type=bind,source="$BASE_DIR",target=/app \
-p 9000:9000 \
-e DEV=1 \
-e DATABASE_URL=$DATABASE_URL \
--network dev-using-db $IMAGE_NAME