# Used to similar a jenkins managed build for the docker-compose.managed.yml locally
export ENVIRONMENT_NAME='int'
export VERSION='2020.0.6'
export DB_HOST='db'
export DB_NAME='BUDGET_DB'
export DB_USER='sa'
export DB_PASS='AbsDa7a9as3'
export LIQUIBASE_DEBUG='N'
export LIQUIBASE_TRACE='Y'
export DB_PORT=1431
export UI_PORT=81
export AUTH_PORT=20201
export GATEWAY_PORT=2021
export API_PORT=20221
export REDIS_PORT=6301
export PROCESSING_PORT=20241
export INTEGRATOR_PORT=20281
export DOMAIN_URL="http://ash-aff-absops:${UI_PORT}"
export ADS_REST_PORT=20261
export ADS_LDAP_URL='192.168.214.228'
export ADS_DB_PORT=1538
export ADS_DB_SID='devcurr'
export ADS_LDAP_DN='allianceLDAPAdmin'
export ADS_LDAP_PASS='decision support'
export ADS_DB_URL='192.168.210.100'
export ADS_DB_USER='qa'
export ADS_DB_PASS='pass'

printenv
        
docker build ./ABS.Database/mssql -t abs-database:${VERSION}
docker build ./ABS.Database/liquibase -t abs-liquibase:${VERSION}
docker build ./ABS.Gateway/ABSOcelot -t abs-gateway:${VERSION}
docker build -f ABS.DAL/Api/Dockerfile ./ABS.DAL -t abs-api:${VERSION}
docker build -f ABS.DAL/Processing/Dockerfile ./ABS.DAL -t abs-processing:${VERSION}
docker build ./ABS.Authentication -t abs-auth:${VERSION}
docker build ./ABS.Client/ABS.React -t abs-ui:${VERSION}
docker build ./ABS.Integrator/ABS.ADSIntegrator/ABS.ADSIntegrator -t abs-integrator:${VERSION}

docker-compose -f docker-compose.managed.yml -p $ENVIRONMENT_NAME down --remove-orphans -v
docker-compose --compatibility -f docker-compose.managed.yml -p $ENVIRONMENT_NAME up --force-recreate -d

docker image prune -f
docker network prune -f