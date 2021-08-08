// For one off builds and tagging:
// Build the application from a specific branch and tag it
pipeline {
    agent { label 'slave1' }

    // These items need to be dynamic, from user input and potentially allow the branch to be selected
    environment {
        VERSION = "2021.0.2"
    }

    stages {
    // DO NOT ADD no-cache options to this build.
    // Caching works fine per how ADD and COPY commands work in the Dockerfile
    // For more help understanding Docker caching visit: 
    //      https://docs.docker.com/develop/develop-images/dockerfile_best-practices/

        stage ('Build Database Image') {
            steps {
                sh "docker build ./ABS.Database/mssql -t abs-database:${VERSION}"
            }
        }

        stage ('Build Liquibase Image') {
            steps {
                sh "docker build ./ABS.Database/liquibase -t abs-liquibase:${VERSION}"
            }
        }

        stage ('Build API Image') {
            steps {
                sh "docker build ./ABS.DAL -t abs-api:${VERSION}"
            }
        }

        stage ('Build Gateway Image') {
            steps {
                sh "docker build ./ABS.Gateway/ABSOcelot -t abs-gateway:${VERSION}"
            }
        }

        stage ('Build Auth Image') {
            steps {
                sh "docker build ./ABS.Authentication -t abs-auth:${VERSION}"
            }
        }
        stage ('Build Integrator Image') {
            steps {
                sh "docker build ./ABS.Integrator/ABS.ADSIntegrator/ABS.ADSIntegrator -t abs-integrator:${VERSION}"
            }
        }
        stage ('Build UI Image') {
            steps {
                sh "docker build ./ABS.Client/ABS.React -t abs-ui:${VERSION}"
            }
        }
        stage ('Cleanup') {
            // Clean up dangling images, return true if command finds none to prevent build errors
            steps {
                sh 'docker rmi $(docker images | grep "^<none>" | awk "{print $3}") || true'
            }
        }
    }
}