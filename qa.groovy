// QA (Quality Assurance) environment Jenkins pipeline configuration
pipeline {
    agent { label 'slave1' }

    // Shared environment variables, used by docker-compose.managed.yml
    environment {
        ENVIRONMENT_NAME = 'QA'
        VERSION = '2021.0.2'
        DB_HOST = 'db'
        DB_NAME = 'BUDGET_DB'
        DB_USER = 'sa'
        DB_PASS = 'AbsDa7a9as3'
        LIQUIBASE_DEBUG = 'N'
        LIQUIBASE_TRACE = 'Y'
        DB_PORT = '1430'
        UI_PORT = '80'
        AUTH_PORT = '20200'
        GATEWAY_PORT = '2020'
        API_PORT = '20220'
        REDIS_PORT = '6300'
        PROCESSING_PORT = '20240'
        DOMAIN_URL = "http://ash-aff-absops"
        ADS_REST_PORT = '20260'
        INTEGRATOR_PORT = '20280'

        // QA will point to ADS QA Echelon for now
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
        stage ('Deploy to QA') {
            steps {
                // standard start / stop of services
                sh "docker-compose -f docker-compose.managed.yml -p ${ENVIRONMENT_NAME} down --remove-orphans"
                sh "docker-compose --compatibility -f docker-compose.managed.yml -p ${ENVIRONMENT_NAME} up --force-recreate -d"
            }
        }
    }
}