-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 8/20/20, 10:54 PM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (192.168.4.145)', LOCKGRANTED = '2020-08-20T22:54:41.403' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset 20200819014643_ABS-640_PayTypeDistributionTableCreation.xml::20200819014643_PayTypeDistributionTableCreation::jbeam
CREATE TABLE PayTypeDistribution (PayTypeDistributionID int IDENTITY (1, 1) NOT NULL, Code nvarchar(MAX), Name nvarchar(MAX), Description nvarchar(MAX), Percentage decimal(18, 2) NOT NULL, Identifier uniqueidentifier, CreationDate datetime2, UpdatedDate datetime2, CreatedBy int, UpdateBy int, IsActive bit, IsDeleted bit, RowVersion varbinary(MAX), CONSTRAINT PK_PayTypeDistribution PRIMARY KEY (PayTypeDistributionID))
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200819014643_PayTypeDistributionTableCreation', 'jbeam', '20200819014643_ABS-640_PayTypeDistributionTableCreation.xml', GETDATE(), 309, '8:f6905f3bc0d15cf7ce0da075beaca548', 'createTable tableName=PayTypeDistribution', '', 'EXECUTED', NULL, NULL, '3.9.0', '7946083245')
GO

-- Changeset 20200819014643_ABS-640_DistributionRelationshipTypeITInsert.xml::20200819014643_DistributionRelationshipTypeITInsert::jbeam
INSERT INTO ItemTypes (ItemTypeKeyword, ItemTypeCode, ItemDataType, ItemTypeValue, ItemTypeDisplayName, ItemTypeDescription, Identifier, CreationDate, UpdatedDate, CreatedBy, UpdateBy, IsActive, IsDeleted, RowVersion) VALUES ('RELATIONSHIPTYPE', 'Distribution', 'string', 'Distribution', 'Distribution', 'Relationship Type - Distribution', '1D8DDD2E-4FD6-423B-BFC4-9EB2C0CB282E', '2020-08-20T01:39:26.92', '2020-08-20T01:39:26.92', 0, 0, 1, 0, NULL)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200819014643_DistributionRelationshipTypeITInsert', 'jbeam', '20200819014643_ABS-640_DistributionRelationshipTypeITInsert.xml', GETDATE(), 310, '8:0f4f149b6ff2ddfb1c0d72ccf7b11e46', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '7946083245')
GO

-- Changeset 20200820160244_BudgetVersionADSStaffingIDFKUpdate.xml::20200803171512-DimensionsJobCodeIDFK::jbeam
ALTER TABLE BudgetVersions DROP CONSTRAINT FK_BudgetVersions_ItemTypes_ADSstaffingIDItemTypeID
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200803171512-DimensionsJobCodeIDFK', 'jbeam', '20200820160244_BudgetVersionADSStaffingIDFKUpdate.xml', GETDATE(), 311, '8:9e842b6b80883d8beb09ec83656f8c13', 'dropForeignKeyConstraint baseTableName=BudgetVersions, constraintName=FK_BudgetVersions_ItemTypes_ADSstaffingIDItemTypeID', '', 'EXECUTED', NULL, NULL, '3.9.0', '7946083245')
GO

-- Changeset 20200820160244_BudgetVersionADSStaffingIDFKUpdate.xml::20200803171512-DimensionsPayTypeIDFK::jbeam
ALTER TABLE BudgetVersions ADD CONSTRAINT FK_BudgetVersions_DataScenario_ADSstaffingIDItemTypeID FOREIGN KEY (ADSStaffingIDItemTypeID) REFERENCES DataScenario (DataScenarioID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200803171512-DimensionsPayTypeIDFK', 'jbeam', '20200820160244_BudgetVersionADSStaffingIDFKUpdate.xml', GETDATE(), 312, '8:ff7dc6949c72f3b8b77a8e031bf7f688', 'addForeignKeyConstraint baseTableName=BudgetVersions, constraintName=FK_BudgetVersions_DataScenario_ADSstaffingIDItemTypeID, referencedTableName=DataScenario', '', 'EXECUTED', NULL, NULL, '3.9.0', '7946083245')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

