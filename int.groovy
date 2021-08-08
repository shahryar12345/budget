// INT (Integration) environment Jenkins pipeline configuration
pipeline {
    agent { label 'slave1' }

    // Shared environment variables, used by docker-compose.managed.yml
    environment {
        ENVIRONMENT_NAME = 'int'
        VERSION = '2021.0.2'
        DB_HOST = 'db'
        DB_NAME = 'BUDGET_DB'
        DB_USER = 'sa'
        DB_PASS = 'AbsDa7a9as3'
        LIQUIBASE_DEBUG = 'Y'
        LIQUIBASE_TRACE = 'Y'
        DB_PORT = '1431'
        UI_PORT = '81'
        AUTH_PORT = '20201'
        GATEWAY_PORT = '2021'
        API_PORT = '20221'
        REDIS_PORT = '6301'
        PROCESSING_PORT = '20241'
        DOMAIN_URL = "http://ash-aff-absops:${UI_PORT}"
        ADS_REST_PORT = '20261'
        INTEGRATOR_PORT = '20281'

        // INT will point to ADS QA Echelon for now
        ADS_LDAP_URL='192.168.214.245'
        ADS_DB_PORT='1623'
        ADS_DB_SID='echelon'
        ADS_LDAP_DN='allianceLDAPAdmin'
        ADS_LDAP_PASS='decision support'
        ADS_DB_URL='192.168.210.100'
        ADS_DB_USER='qa'
        ADS_DB_PASS='pass'
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
                sh "docker build -f ./ABS.DAL/Api/Dockerfile  ./ABS.DAL -t abs-api:${VERSION}"
            }
        }

        stage ('Build Gateway Image') {
            steps {
                sh "docker build ./ABS.Gateway/ABSOcelot -t abs-gateway:${VERSION}"
            }
        }

        stage ('Build Processing Image') {
            steps {
                sh "docker build -f ./ABS.DAL/Processing/Dockerfile ./ABS.DAL -t abs-processing:${VERSION}"
            }
        }

        stage ('Build Integrator Image') {
            steps {
                sh "docker build ./ABS.Integrator/ABS.ADSIntegrator/ABS.ADSIntegrator -t abs-integrator:${VERSION}"
            }
        }
        stage ('Build Auth Image') {
            steps {
                sh "docker build ./ABS.Authentication -t abs-auth:${VERSION}"
            }
        }

        stage ('Build UI Image') {
            steps {
                sh "docker build ./ABS.Client/ABS.React -t abs-ui:${VERSION}"
            }
        }

        stage ('Deploy to INT') {
            // INT is the only environment that will build images
            steps {
                // standard start / stop of services
                // ensure we remove the persistent container - this is ONLY for int
                sh "docker-compose -f docker-compose.managed.yml -p ${ENVIRONMENT_NAME} down --remove-orphans -v"
                sh "docker-compose --compatibility -f docker-compose.managed.yml -p ${ENVIRONMENT_NAME} up --force-recreate -d"
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