# ABS (Affinity Budgeting System) Setup

Setup information for how to setup and properly run the application locally and even during a client install.

## Install Docker
____
Grab the latest install of Docker for your system:
* [Mac](https://download.docker.com/mac/stable/Docker.dmg)
* [Windows](https://download.docker.com/win/stable/Docker%20Desktop%20Installer.exe)

## Run the application locally
___

### Open up the root folder of the Budgeting codebase with a terminal

Start with attached: ```docker-compose up```

Start with detached: ```docker-compose up -d```

The `docker-compose.yml` file is similar to the `docker-compose.int.yml` except it does not run the UI in a container. The UI should be run locally via webpack to allow hot-reloading of UI changes instantly for quicker UI development turnaround.

To run the UI via webpack:
* open up a terminal and navigate to the `ABS.Client/ABS.React` folder
* install npm dependencies: `yarn`
* start the application: `yarn start`

## Run the application in a managed environment
___

### Open up the root folder of the Budgeting codebase with a terminal

```docker-compose -f docker-compose.int.yml up -d```

This will build and start up the various docker containers.  Once they have all started, the application should be available at [localhost](http://localhost)