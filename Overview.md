# ABS (Affinity Budgeting System)

The budgeting system is an offering to supply general budgeting needs for new Harris customers and those currently using the ADS offering

## ADS (Affinity Decision Support) Integration

To leverage existing customer data on ADS, ABS will have loose integration to easily use/process existing ADS data.  

In order to also maintain standalone behavior, ABS will own its own copy / structure of data.  Data from ADS will be pulled through batch jobs occurring on a timeline/basis that makes sense.  

ADS will expose an API layer / Rest API for any items they may need to be pulled in real-time or on-demand.  

Additionally, ABS will also need to be able to leverage existing LDAP/AD authentication for existing ADS customers or be able to point/hookup to an existing AD if possible.

## Standalone

Budgeting will be able to stand along for non ADS customers who can specify data through a flatfile or potentially through Cerner in the future.

## Architecture

* UI

    * Carbon Design

    * React

    * nginx

* Authentication
    * LDAP / AD

    * Identity Server

* API/Server

    * Microservice Pattern / Design

    * Ocelot

    * API

* Database

    * MSSQL

    * Other Relational Databases

    * Liquibase

## Deployment

* Deployment to Harris Hosted

* Deployment to Self-Hosted