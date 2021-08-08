# ABS Database
files for database structure, updates and management as well as the configuration to setup a docker MSSQL container

## Liquibase
configuration for running liquibase and files that track database structure, updates and migration scripts

refer to the liquibase.md for information on Liquibase

All database updates / migrations should be tracked within this folder to be automatically applied at the creation of a new deployment/installation or to update an existing.

## Docker Container
The docker-compose.yml file contains configuration for two containers:
1. mssql - the standard SQL Server container
2. liquibse - the liquibase container which contains the liquibase executables and updates 

It is configured to start the mssql database then attempt to run the liquibase container against it until it successfully connects and runs.  Additional database updates can be made by simply restarting the liquibase container and it will grab the latest changes via a volume mounted for the liquibase folder.