pipeline {
    agent { label 'slave1' }

    // Shared environment variables, used by docker-compose.managed.yml
    environment {
        DB_HOST = 'db'
        DB_NAME = 'BUDGET_DB'
        DB_USER = 'sa'
        DB_PASS = 'AbsDa7a9as3'
        LIQUIBASE_DEBUG = 'N'
        LIQUIBASE_TRACE = 'Y'
    }
    
    // Prompt user for environment to deploy
    parameters {
        choice (
            name: 'ENVIRONMENT_NAME',
            choices: ['DEMO', 'SALES','CLEANDEMO'],
            description: 'Choose which environment to deploy from master'
        )
    }

    stages {
        stage ('Deploy to DEMO') {
            when {
                anyOf {
                    expression { params.ENVIRONMENT_NAME == 'DEMO' }
                }
            }

            environment {
                ENVIRONMENT_NAME = "${params.ENVIRONMENT_NAME}"
                VERSION = '2021.0.2'
                DB_PORT = '1432'
                UI_PORT = '82'
                AUTH_PORT = '20202'
                GATEWAY_PORT = '2022'
                API_PORT = '20222'
                REDIS_PORT = '6302'
                PROCESSING_PORT = '20242'
                ADS_REST_PORT = '20262'
                INTEGRATOR_PORT = '20282'
                DOMAIN_URL = "http://ash-aff-absops:${UI_PORT}"

                // ADS environment for import data
                ADS_LDAP_URL='192.168.214.245'
                ADS_DB_PORT='1623'
                ADS_DB_SID='echelon'
                ADS_LDAP_DN='allianceLDAPAdmin'
                ADS_LDAP_PASS='decision support'
                ADS_DB_URL='192.168.210.100'
                ADS_DB_USER='qa'
                ADS_DB_PASS='pass'
            }

            steps {
                echo "Deploying ${ENVIRONMENT_NAME}"
                sh 'printenv'
                //sh "docker-compose -f docker-compose.managed.yml -p ${ENVIRONMENT_NAME} down --remove-orphans"
                sh "docker-compose -f docker-compose.managed.yml -p ${ENVIRONMENT_NAME} down --remove-orphans -v"
                sh "docker-compose --compatibility -f docker-compose.managed.yml -p ${ENVIRONMENT_NAME} up --force-recreate -d"
            }
        }

        stage ('Deploy to SALES') {
            when {
                anyOf {
                    expression { params.ENVIRONMENT_NAME == 'SALES' }
                }
            }

            environment {
                ENVIRONMENT_NAME = "${params.ENVIRONMENT_NAME}"
                VERSION = '2021.0.2'
                DB_PORT = '1433'
                UI_PORT = '83'
                AUTH_PORT = '20203'
                GATEWAY_PORT = '2023'
                API_PORT = '20223'
                REDIS_PORT = '6303'
                PROCESSING_PORT = '20243'
                ADS_REST_PORT = '20263'
                INTEGRATOR_PORT = '20283'
                DOMAIN_URL = "http://ash-aff-absops:${UI_PORT}"

                // ADS environment for import data
                ADS_LDAP_URL='salesdemo.harrisaffinity.com'
                ADS_DB_PORT='1624'
                ADS_DB_SID='saledemo'
                ADS_LDAP_DN='allianceLDAPAdmin'
                ADS_LDAP_PASS='decision support'
                ADS_DB_URL='192.168.210.100'
                ADS_DB_USER='ads'
                ADS_DB_PASS='pass'
            }

            steps {
                echo "Deploying ${ENVIRONMENT_NAME}"
                sh 'printenv'
                sh "docker-compose -f docker-compose.managed.yml -p ${ENVIRONMENT_NAME} down --remove-orphans"
                sh "docker-compose --compatibility -f docker-compose.managed.yml -p ${ENVIRONMENT_NAME} up --force-recreate -d"
            }
        }
    }
}