-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 7/24/20, 4:31 PM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (192.168.136.241)', LOCKGRANTED = '2020-07-24T16:31:39.054' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset 20200722155100_IntegrationLogsTableAddition.xml::20200722155100_IntegrationLogsTableAddition::jbeam
CREATE TABLE Integrationlogs (MLogID int IDENTITY (1, 1) NOT NULL, SourceURL nvarchar(MAX), TargetURL nvarchar(MAX), DataREceivedfromSource nvarchar(MAX), DataPushedtoTarget nvarchar(MAX), ResponsefromSource nvarchar(MAX), ResponsefromTarget nvarchar(MAX), CreatedBy nvarchar(MAX), CreatedDate datetime2, TimeStamp datetime, CONSTRAINT PK_Integrationlogs PRIMARY KEY (MLogID))
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200722155100_IntegrationLogsTableAddition', 'jbeam', '20200722155100_IntegrationLogsTableAddition.xml', GETDATE(), 217, '8:183e016bb077141098320d2a12efc8d0', 'createTable tableName=Integrationlogs', '', 'EXECUTED', NULL, NULL, '3.9.0', '5590301737')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

