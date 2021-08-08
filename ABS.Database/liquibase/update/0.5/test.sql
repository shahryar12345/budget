-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 10/26/20, 2:35 PM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (192.168.164.17)', LOCKGRANTED = '2020-10-26T14:35:45.305' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset 202010261350_Configuration_ItemType_Inserts_UPDATEALLACTUALBV.xml::202010261350_Configuration_ItemType_Inserts_UPDATEALLACTUALBV::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'CONFIGURATION', 'UPDATEALLACTUALBV', 'FALSE', 'True/false/', 'UPDATEALLACTUALBV')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202010261350_Configuration_ItemType_Inserts_UPDATEALLACTUALBV', 'fshaikh', '202010261350_Configuration_ItemType_Inserts_UPDATEALLACTUALBV.xml', GETDATE(), 349, '8:87e261db45477068408e89ada79465c0', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '3704948247')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

