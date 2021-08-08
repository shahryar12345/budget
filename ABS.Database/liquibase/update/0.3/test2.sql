-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 8/23/20, 8:25 PM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (192.168.4.145)', LOCKGRANTED = '2020-08-23T20:25:23.699' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset 20200803171512_ABS-586_DimensionsJobCodeIDPayTypeIDAddition.xml::20200803171512-DimensionsPayTypeIDFK::jbeam
ALTER TABLE Dimensions ADD CONSTRAINT FK_Dimensions_JobCodes_JobCodeID FOREIGN KEY (JobCodeID) REFERENCES JobCodes (JobCodeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200803171512-DimensionsPayTypeIDFK', 'jbeam', '20200803171512_ABS-586_DimensionsJobCodeIDPayTypeIDAddition.xml', GETDATE(), 312, '8:029b4d0a07de558ee43971f24266c58c', 'addForeignKeyConstraint baseTableName=Dimensions, constraintName=FK_Dimensions_JobCodes_JobCodeID, referencedTableName=JobCodes', '', 'EXECUTED', NULL, NULL, '3.9.0', '8196326015')
GO

-- Changeset 20200820160244_BudgetVersionADSStaffingIDFKUpdate.xml::20200803171512-DimensionsPayTypeIDFK::jbeam
ALTER TABLE BudgetVersions ADD CONSTRAINT FK_BudgetVersions_DataScenario_ADSstaffingIDItemTypeID FOREIGN KEY (ADSstaffingIDItemTypeID) REFERENCES DataScenario (DataScenarioID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200803171512-DimensionsPayTypeIDFK', 'jbeam', '20200820160244_BudgetVersionADSStaffingIDFKUpdate.xml', GETDATE(), 313, '8:89243ce40bc65bd9804cf46cff0e3207', 'addForeignKeyConstraint baseTableName=BudgetVersions, constraintName=FK_BudgetVersions_DataScenario_ADSstaffingIDItemTypeID, referencedTableName=DataScenario', '', 'EXECUTED', NULL, NULL, '3.9.0', '8196326015')
GO

-- Changeset 20200821140252_BudgetVersionStaffingDataScenarioID1Addition.xml::20200821140252_BudgetVersionStaffingDataScenarioID1Addition::jbeam
ALTER TABLE BudgetVersionStaffing ADD DataScenarioID1DataScenarioID int
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200821140252_BudgetVersionStaffingDataScenarioID1Addition', 'jbeam', '20200821140252_BudgetVersionStaffingDataScenarioID1Addition.xml', GETDATE(), 314, '8:8fadd48460810dfe78c1ca3d45558d26', 'addColumn tableName=BudgetVersionStaffing', '', 'EXECUTED', NULL, NULL, '3.9.0', '8196326015')
GO

-- Changeset 20200821140252_BudgetVersionStaffingDataScenarioID1Addition.xml::20200821140252_BudgetVersionStaffingDataScenarioID1FK::jbeam
ALTER TABLE BudgetVersionStaffing ADD CONSTRAINT FK_BudgetVersionStaffing_DataScenario_DataScenarioID1DataScenarioID FOREIGN KEY (DataScenarioID1DataScenarioID) REFERENCES DataScenario (DataScenarioID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200821140252_BudgetVersionStaffingDataScenarioID1FK', 'jbeam', '20200821140252_BudgetVersionStaffingDataScenarioID1Addition.xml', GETDATE(), 315, '8:c25bd4e8440cace64be85c45f76b8e76', 'addForeignKeyConstraint baseTableName=BudgetVersionStaffing, constraintName=FK_BudgetVersionStaffing_DataScenario_DataScenarioID1DataScenarioID, referencedTableName=DataScenario', '', 'EXECUTED', NULL, NULL, '3.9.0', '8196326015')
GO

-- Changeset 20200821201044_BudgetVersionsADSStaffingIDRename.xml::20200821201044-BudgetVersionsADSStaffingIDRename::jbeam
exec sp_rename 'BudgetVersions.ADSstaffingIDItemTypeID', 'ADSstaffingIDDataScenarioID'
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200821201044-BudgetVersionsADSStaffingIDRename', 'jbeam', '20200821201044_BudgetVersionsADSStaffingIDRename.xml', GETDATE(), 316, '8:12a4e3f896a1ac5cf963ac3642a7e657', 'renameColumn newColumnName=ADSstaffingIDDataScenarioID, oldColumnName=ADSstaffingIDItemTypeID, tableName=BudgetVersions', '', 'EXECUTED', NULL, NULL, '3.9.0', '8196326015')
GO

-- Changeset 20200821234022_BudgetVersionsStaffingDataScenarioIDRename.xml::20200821234022_BudgetVersionsStaffingDataScenarioIDRename::jbeam
exec sp_rename 'BudgetVersionStaffing.DataScenarioID1DataScenarioID', 'DataScenarioID1'
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200821234022_BudgetVersionsStaffingDataScenarioIDRename', 'jbeam', '20200821234022_BudgetVersionsStaffingDataScenarioIDRename.xml', GETDATE(), 317, '8:792f2b53ae49a47a2f78490ffa2b31ae', 'renameColumn newColumnName=DataScenarioID1, oldColumnName=DataScenarioID1DataScenarioID, tableName=BudgetVersionStaffing', '', 'EXECUTED', NULL, NULL, '3.9.0', '8196326015')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

