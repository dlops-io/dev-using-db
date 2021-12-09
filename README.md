# Development using a Database

An application that will use a local postgres database and when deployed setup and use a Cloud SQL Database

## Prerequisites
### Install Docker 
Install `Docker Desktop`

#### Ensure Docker Memory
- To make sure we can run multiple container go to Docker>Preferences>Resources and in "Memory" make sure you have selected > 4GB

### Install VSCode  
Follow the [instructions](https://code.visualstudio.com/download) for your operating system.  
If you already have a preferred text editor, skip this step.  


## Database Server
-  `cd database-server`
- Start docker shell `sh ./docker-shell.sh`
- Can exit the docker shell without shutting down by typing `ctrl+d`
- Can reconnect to docker shell by typing...
- Check migration status: `dbmate status`
- To shut down docker container, type `ctrl+c`

### Create a new migration script 
#### These would have no tables created, and will update the schema.sql

`dbmate new base_tables`

`dbmate new seed_data`

### Running Migrations

`dbmate up` (see db/migrations for what tables are created)

`dbmate rollback`

`dbmate dump`

`dbmate status`


## API Service
-  `cd api-service`
- Start docker shell `sh ./docker-shell.sh`

To install a new python package use `pipenv install requests` from the docker shell

To run development api service run `uvicorn_server` from the docker shell

Test the API service by going to `http://0.0.0.0:9000/`

- We want to run the local database-server before api-service because we want to have the API set up a connection to the database