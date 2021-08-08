# ABS (Affinity Budgeting System) Jenkins Setup

Documentation for the ABS Jenkins CI/CD setup and configuration using the master/slave configuration

## Getting Started
____

### Build the initial Jenkins Master and Slave images

1. build the images:
    1. ensure you have pulled the code locally, you only need the jenkins folder
    1. navigate to the `jenkins/jenkins-master` folder
    1. execute the following: `docker build . -t jenkins-master`
    1. navigate to the `jenkins/jenkins-slave` folder
    1. execute the following: `docker build . -t jenkins-slave`
    1. now that all images are built, navigate back to the root `jenkins` folder
1. start the containers:
    1. start the container using: `docker-compose up -d`
        1. you can follow the container logs using `docker logs -f jenkins-master` until it starts
        1. you may notice the initial `jenkins-slave` fails to start, this is by design
    1. Once the container is started, you will need to login and configure global-security for the slaves to work
        1. login to the jenkins dashboard using: `admin admin`
        1. click `Manage Jenkins`
        1. click `Configure Global Security`
        1. scroll down to the section `CSRF Protection`
        1. ensure `Strict Crumb Issuer` is selected, then click advanced
        1. uncheck `Check the session ID`
        1. click `Save` at the bottom of the page and it will redirect to an error page
        1. this is fine, you can simply navigate back to the original jenkins page
1. scale the slaves 
    1. go to the `jenkins` root directory
    1. execute the following command, entering the number(IE: 2) of slave desired: `docker-compose scale jenkins-slave:2`

## Starting, Restarting and Stopping
____

### Starting

* From the root `jenkins` folder using: `docker-compose up` or `docker-compose up -d`

### Restarting

* From the root `jenkins` folder using: `docker-compose restart`

### Stopping

* From the root `jenkins` folder using: `docker-compose stop`

### Destroy the container

#### Safe Destroy

* From the root `jenkins` folder using: `docker-compose down`

#### Destroy and Unmount Volumes

* From the root `jenkins` folder using: `docker-compose down -v`

### Volumes

The Jenkins container is using named mount volumes.  These are persisted even between container destruction.
* Volumes can be viewed using: `docker volumes ls`

*USE EXTREME CAUTION PERFORMING THE BELOW AS PERSISTED DATA WILL BE WIPED ON THESE VOLUMES!!!*
* Volumes can be pruned when they have no mounted containers using: `docker volume prune`
* Volumes can be manually removed by name or id using: `docker volume rm volume-name`