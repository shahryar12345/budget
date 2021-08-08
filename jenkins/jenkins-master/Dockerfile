FROM jenkins/jenkins:latest

RUN /usr/local/bin/install-plugins.sh git mstest matrix-auth workflow-aggregator docker-workflow blueocean credentials-binding strict-crumb-issuer Office-365-Connector antisamy-markup-formatter

COPY executors.groovy /usr/share/jenkins/ref/init.groovy.d/
COPY default-user.groovy /usr/share/jenkins/ref/init.groovy.d/