#!/bin/bash

# set -e

# Define some environement variables
export IMAGE_NAME="dev-using-db-deployment"
export BASE_DIR=$(pwd)
export GCP_PROJECT="mlproject01-207413" # Change to your GCP Project
export GCP_ZONE="us-central1-c"
export GOOGLE_APPLICATION_CREDENTIALS=/secrets/deployment.json

# Build the image based on the Dockerfile
docker build -t $IMAGE_NAME -f Dockerfile .

# Run the container
docker run --rm --name $IMAGE_NAME -ti \
-v /var/run/docker.sock:/var/run/docker.sock \
--mount type=bind,source="$BASE_DIR",target=/app \
--mount type=bind,source="$BASE_DIR/../secrets/",target=/secrets \
--mount type=bind,source="$HOME/.ssh",target=/home/app/.ssh \
--mount type=bind,source="$BASE_DIR/../api-service",target=/api-service \
--mount type=bind,source="$BASE_DIR/../frontend",target=/frontend \
--mount type=bind,source="$BASE_DIR/../database-server",target=/database-server \
-e GOOGLE_APPLICATION_CREDENTIALS=$GOOGLE_APPLICATION_CREDENTIALS \
-e GCP_PROJECT=$GCP_PROJECT \
-e GCP_ZONE=$GCP_ZONE $IMAGE_NAME

