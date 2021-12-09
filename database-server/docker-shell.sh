#!/bin/bash

set -e

# Create the network if we don't have it yet
docker network inspect dev-using-db >/dev/null 2>&1 || docker network create dev-using-db

# Run Postgres DB and DBMate
docker-compose run --rm --service-ports dev-using-db-client
