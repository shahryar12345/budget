-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 8/25/20, 3:17 PM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (192.168.4.145)', LOCKGRANTED = '2020-08-25T15:17:19.849' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionEntityIDAddition::jbeam
ALTER TABLE PayTypeDistribution ADD EntityID int
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionEntityIDAddition', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 318, '8:63eac390195acbd5d00dbeca3687bb44', 'addColumn tableName=PayTypeDistribution', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionDepartmentIDAddition::jbeam
ALTER TABLE PayTypeDistribution ADD DepartmentID int
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionDepartmentIDAddition', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 319, '8:734812dcea6a5c3fab8e26de878154c6', 'addColumn tableName=PayTypeDistribution', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionPayTypeIDAddition::jbeam
ALTER TABLE PayTypeDistribution ADD PayTypeID int
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionPayTypeIDAddition', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 320, '8:4e6c7e9706cae851e355203396547333', 'addColumn tableName=PayTypeDistribution', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionJobCodeIDAddition::jbeam
ALTER TABLE PayTypeDistribution ADD JobCodeID int
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionJobCodeIDAddition', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 321, '8:385bf183bb70b1ea8975465d42ac9ddd', 'addColumn tableName=PayTypeDistribution', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionProductiveAddition::jbeam
ALTER TABLE PayTypeDistribution ADD Productive bit
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionProductiveAddition', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 322, '8:b847bea8d15b6c851608b71e1de205e6', 'addColumn tableName=PayTypeDistribution', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionIsGroupAddition::jbeam
ALTER TABLE PayTypeDistribution ADD IsGroup bit
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionIsGroupAddition', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 323, '8:62bb3b7ae3bcad00422f534f483bc280', 'addColumn tableName=PayTypeDistribution', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionPayTypeIDFK::jbeam
ALTER TABLE PayTypeDistribution ADD CONSTRAINT FK_PayTypeDistribution_PayTypes_PayTypeID FOREIGN KEY (PayTypeID) REFERENCES PayTypes (PayTypeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionPayTypeIDFK', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 324, '8:3561c3fba1470495b4807d8296a224f7', 'addForeignKeyConstraint baseTableName=PayTypeDistribution, constraintName=FK_PayTypeDistribution_PayTypes_PayTypeID, referencedTableName=PayTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionDepartmentIDFK::jbeam
ALTER TABLE PayTypeDistribution ADD CONSTRAINT FK_PayTypeDistribution_Departments_DepartmentID FOREIGN KEY (DepartmentID) REFERENCES Departments (DepartmentID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionDepartmentIDFK', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 325, '8:0d9e4d868d53f50b01dade225ada3f17', 'addForeignKeyConstraint baseTableName=PayTypeDistribution, constraintName=FK_PayTypeDistribution_Departments_DepartmentID, referencedTableName=Departments', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionEntityIDFK::jbeam
ALTER TABLE PayTypeDistribution ADD CONSTRAINT FK_PayTypeDistribution_Entities_EntityID FOREIGN KEY (EntityID) REFERENCES Entities (EntityID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionEntityIDFK', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 326, '8:b961ae5a7e4e9ff3b988b48fc2f10761', 'addForeignKeyConstraint baseTableName=PayTypeDistribution, constraintName=FK_PayTypeDistribution_Entities_EntityID, referencedTableName=Entities', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionJobCodeIDFK::jbeam
ALTER TABLE PayTypeDistribution ADD CONSTRAINT FK_PayTypeDistribution_JobCodes_JobCodeID FOREIGN KEY (JobCodeID) REFERENCES JobCodes (JobCodeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionJobCodeIDFK', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 327, '8:53345859017f80368e0f42b9c73f85b2', 'addForeignKeyConstraint baseTableName=PayTypeDistribution, constraintName=FK_PayTypeDistribution_JobCodes_JobCodeID, referencedTableName=JobCodes', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Changeset 20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml::20200824132124-PayTypeDistributionPercentageAllowNulls::jbeam
ALTER TABLE PayTypeDistribution ALTER COLUMN Percentage decimal(18, 2) NULL
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200824132124-PayTypeDistributionPercentageAllowNulls', 'jbeam', '20200824132124_ABS-640_PayTypeDistributionFieldUpdate.xml', GETDATE(), 328, '8:e2bff9c4b54ba6bbfd94d697e818497c', 'dropNotNullConstraint columnName=Percentage, tableName=PayTypeDistribution', '', 'EXECUTED', NULL, NULL, '3.9.0', '8350641961')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

