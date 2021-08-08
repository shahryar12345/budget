FROM microsoft/mssql-server-linux:latest

# Create scripts folder and copy initialization scripts
RUN mkdir -p /usr/scripts
WORKDIR /usr/scripts
COPY . /usr/scripts

# Grant permissions for the import-data script to be executable
RUN chmod +x /usr/scripts/import-data.sh

EXPOSE 1433

CMD /bin/bash ./entrypoint.sh