-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 12/22/20, 10:54 PM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (192.168.253.129)', LOCKGRANTED = '2020-12-22T22:54:55.471' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset 202012161420_TableCreate_ForecastHistory.xml::202012161420_TableCreate_ForecastHistory::fshaikh
CREATE TABLE ForecastHistory (ForecastHistoryID int IDENTITY (1, 1) NOT NULL, ForecastHistoryName nvarchar(MAX), ForecastHistoryCode nvarchar(MAX), ForecastHistoryDescription nvarchar(MAX), formulaMethod nvarchar(MAX), DatascenarioType nvarchar(MAX), DatascenarioTypeIdItemTypeID int, budgetVersionID int, UserIDUserProfileID int, Identifier uniqueidentifier, CreationDate datetime2, UpdatedDate datetime2, CreatedBy int, UpdateBy int, IsActive bit, IsDeleted bit, RowVersion datetime, CONSTRAINT PK_ForecastHistory PRIMARY KEY (ForecastHistoryID))
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202012161420_TableCreate_ForecastHistory', 'fshaikh', '202012161420_TableCreate_ForecastHistory.xml', GETDATE(), 350, '8:ef6b14af1624e4a4dd0997d83b0bc093', 'createTable tableName=ForecastHistory', '', 'EXECUTED', NULL, NULL, '3.9.0', '8659696988')
GO

-- Changeset 202012161420_TableCreate_ForecastHistory.xml::202012161420_IndexCreate_ForecastHistory-ForecastHistoryDatascenarioTypeIdItemTypeID::fshaikh
CREATE NONCLUSTERED INDEX IX_ForecastHistory_DatascenarioTypeIdItemTypeID ON ForecastHistory(DatascenarioTypeIdItemTypeID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202012161420_IndexCreate_ForecastHistory-ForecastHistoryDatascenarioTypeIdItemTypeID', 'fshaikh', '202012161420_TableCreate_ForecastHistory.xml', GETDATE(), 351, '8:4b47e6d5b002758e09fbded8532a1d07', 'createIndex indexName=IX_ForecastHistory_DatascenarioTypeIdItemTypeID, tableName=ForecastHistory', '', 'EXECUTED', NULL, NULL, '3.9.0', '8659696988')
GO

-- Changeset 202012161420_TableCreate_ForecastHistory.xml::202012161420_IndexCreate_ForecastHistory-ForecastHistorybudgetVersionIDIndex::fshaikh
CREATE NONCLUSTERED INDEX IX_ForecastHistory_budgetVersionID ON ForecastHistory(budgetVersionID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202012161420_IndexCreate_ForecastHistory-ForecastHistorybudgetVersionIDIndex', 'fshaikh', '202012161420_TableCreate_ForecastHistory.xml', GETDATE(), 352, '8:a91689b8798b90d35a80c3c18c737b4f', 'createIndex indexName=IX_ForecastHistory_budgetVersionID, tableName=ForecastHistory', '', 'EXECUTED', NULL, NULL, '3.9.0', '8659696988')
GO

-- Changeset 202012161420_TableCreate_ForecastHistory.xml::202012161420_IndexCreate_ForecastHistory-ForecastHistory_UserIDUserProfileID::fshaikh
CREATE NONCLUSTERED INDEX IX_ForecastHistory_UserIDUserProfileID ON ForecastHistory(UserIDUserProfileID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202012161420_IndexCreate_ForecastHistory-ForecastHistory_UserIDUserProfileID', 'fshaikh', '202012161420_TableCreate_ForecastHistory.xml', GETDATE(), 353, '8:9b50f1ae07af23b600ec4121eb47d5b4', 'createIndex indexName=IX_ForecastHistory_UserIDUserProfileID, tableName=ForecastHistory', '', 'EXECUTED', NULL, NULL, '3.9.0', '8659696988')
GO

-- Changeset 202012161420_TableCreate_ForecastHistory.xml::202012161420_FKCreate_ForecastHistory-BudgetVersionIDFK::fshaikh
ALTER TABLE ForecastHistory ADD CONSTRAINT FK_ForecastHistory_BudgetVersions_BudgetVersionID FOREIGN KEY (BudgetVersionID) REFERENCES BudgetVersions (BudgetVersionID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202012161420_FKCreate_ForecastHistory-BudgetVersionIDFK', 'fshaikh', '202012161420_TableCreate_ForecastHistory.xml', GETDATE(), 354, '8:e1815f81845fe3cc68ee43bb1194dafb', 'addForeignKeyConstraint baseTableName=ForecastHistory, constraintName=FK_ForecastHistory_BudgetVersions_BudgetVersionID, referencedTableName=BudgetVersions', '', 'EXECUTED', NULL, NULL, '3.9.0', '8659696988')
GO

-- Changeset 202012161420_TableCreate_ForecastHistory.xml::202012161420_FK_ForecastHistory_ItemTypes_DatascenarioTypeIdItemTypeID::fshaikh
ALTER TABLE ForecastHistory ADD CONSTRAINT FK_ForecastHistory_ItemTypes_DatascenarioTypeIdItemTypeID FOREIGN KEY (DatascenarioTypeIdItemTypeID) REFERENCES ItemTypes (ItemTypeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202012161420_FK_ForecastHistory_ItemTypes_DatascenarioTypeIdItemTypeID', 'fshaikh', '202012161420_TableCreate_ForecastHistory.xml', GETDATE(), 355, '8:ae2e00af26ccf15235b14b86bceb8ee8', 'addForeignKeyConstraint baseTableName=ForecastHistory, constraintName=FK_ForecastHistory_ItemTypes_DatascenarioTypeIdItemTypeID, referencedTableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '8659696988')
GO

-- Changeset 202012161420_TableCreate_ForecastHistory.xml::202012161420_FK_ForecastHistory_IdentityUserProfile_UserIDUserProfileID::fshaikh
ALTER TABLE ForecastHistory ADD CONSTRAINT FK_ForecastHistory_IdentityUserProfile_UserIDUserProfileID FOREIGN KEY (UserIDUserProfileID) REFERENCES IdentityUserProfile (UserProfileID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202012161420_FK_ForecastHistory_IdentityUserProfile_UserIDUserProfileID', 'fshaikh', '202012161420_TableCreate_ForecastHistory.xml', GETDATE(), 356, '8:3dc7f119f07956ca34295fd58c10282e', 'addForeignKeyConstraint baseTableName=ForecastHistory, constraintName=FK_ForecastHistory_IdentityUserProfile_UserIDUserProfileID, referencedTableName=IdentityUserProfile', '', 'EXECUTED', NULL, NULL, '3.9.0', '8659696988')
GO

-- Changeset 20201208080900_Change_FTE_Month_DataType.xml::20201208080900_Change_FTE_Month_DataType::shahrayr
ALTER TABLE StaffingWageAdjustment   ALTER COLUMN WageAdjustmentPercent decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN January decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN February decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN March decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN April decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN May decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN June decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN July decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN August decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN September decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN October decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN November decimal(18, 10) 
 ALTER TABLE StaffingData   ALTER COLUMN December decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN April decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN August decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN December decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN February decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN January decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN July decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN June decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN March decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN May decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN November decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN October decimal(18, 10) 
 ALTER TABLE StatisticalData   ALTER COLUMN September decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN January decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN February decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN March decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN April decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN May decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN June decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN July decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN August decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN September decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN October decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN November decimal(18, 10) 
 ALTER TABLE FullTimeEquivalent   ALTER COLUMN December decimal(18, 10) 
 ALTER TABLE ForecastSteps   ALTER COLUMN PercentageChangeValue decimal(18, 10) 
 ALTER TABLE PayTypeDistribution   ALTER COLUMN Percentage decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN January decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN February decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN March decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN April decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN May decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN June decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN July decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN August decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN September decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN October decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN November decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN December decimal(18, 10) 
 ALTER TABLE BudgetVersionStatistics   ALTER COLUMN rowTotal decimal(18, 10) 
 ALTER TABLE Dimensions   ALTER COLUMN Ratio decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN January decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN February decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN March decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN April decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN May decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN June decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN July decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN August decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN September decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN October decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN November decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN December decimal(18, 10) 
 ALTER TABLE BudgetVersionGLAccounts   ALTER COLUMN rowTotal decimal(18, 10) 
 ALTER TABLE GLAccountsInflation   ALTER COLUMN InflationPercent decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN January decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN February decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN March decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN April decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN May decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN June decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN July decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN August decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN September decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN October decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN November decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN December decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN rowTotal decimal(18, 10) 
 ALTER TABLE BudgetVersionStaffing   ALTER COLUMN WagerateOverride decimal(18, 10)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20201208080900_Change_FTE_Month_DataType', 'shahrayr', '20201208080900_Change_FTE_Month_DataType.xml', GETDATE(), 357, '8:61196fa1409cf047c1cfed514e825764', 'sql', '', 'EXECUTED', NULL, NULL, '3.9.0', '8659696988')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

