-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 9/29/20, 12:12 AM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (172.17.63.113)', LOCKGRANTED = '2020-09-29T00:12:02.109' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset 202009281806_BudgetVersion_ColumnAddition_CalculationStatus.xml::202009281806_BudgetVersion_ColumnAddition_CalculationStatus::fshaikh
ALTER TABLE BudgetVersions ADD CalculationStatus nvarchar(MAX)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202009281806_BudgetVersion_ColumnAddition_CalculationStatus', 'fshaikh', '202009281806_BudgetVersion_ColumnAddition_CalculationStatus.xml', GETDATE(), 344, '8:7d7f4185e20bcc2f92b2a194b9dc614e', 'addColumn tableName=BudgetVersions', '', 'EXECUTED', NULL, NULL, '3.9.0', '1320323684')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

