-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 7/15/20, 6:29 PM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (172.18.15.1)', LOCKGRANTED = '2020-07-15T18:29:22.13' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset 20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml::20200714182030-GLAccountsInflationTableCreation::jbeam
CREATE TABLE GLAccountsInflation (GLAccountsInflationID int IDENTITY (1, 1) NOT NULL, BudgetVersionID int, TimePeriodID1 int, EntityID int, DepartmentID int, GLAccountID int, InflationPercent decimal(18, 2), StartMonthItemTypeID int, EndMonthItemTypeID int, Identifier uniqueidentifier, CreationDate datetime2, UpdatedDate datetime2, CreatedBy int, UpdateBy int, IsActive bit, IsDeleted bit, RowVersion varbinary(MAX), CONSTRAINT PK_GLAccountsInflation PRIMARY KEY (GLAccountsInflationID))
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200714182030-GLAccountsInflationTableCreation', 'jbeam', '20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml', GETDATE(), 146, '8:2e1e2d0aac6d2e0936e7241c49e54f4c', 'createTable tableName=GLAccountsInflation', '', 'EXECUTED', NULL, NULL, '3.9.0', '4819764334')
GO

-- Changeset 20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml::20200714182030-GLAccountsInflationFKBudgetVersionID::jbeam
ALTER TABLE GLAccountsInflation ADD CONSTRAINT FK_GLAccountsInflation_BudgetVersions_BudgetVersionID FOREIGN KEY (BudgetVersionID) REFERENCES BudgetVersions (BudgetVersionID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200714182030-GLAccountsInflationFKBudgetVersionID', 'jbeam', '20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml', GETDATE(), 147, '8:7ae129fbf2978c473aedb4a3ca4790db', 'addForeignKeyConstraint baseTableName=GLAccountsInflation, constraintName=FK_GLAccountsInflation_BudgetVersions_BudgetVersionID, referencedTableName=BudgetVersions', '', 'EXECUTED', NULL, NULL, '3.9.0', '4819764334')
GO

-- Changeset 20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml::20200714182030-GLAccountsInflationDepartmentID::jbeam
ALTER TABLE GLAccountsInflation ADD CONSTRAINT FK_GLAccountsInflation_Departments_DepartmentID FOREIGN KEY (DepartmentID) REFERENCES Departments (DepartmentID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200714182030-GLAccountsInflationDepartmentID', 'jbeam', '20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml', GETDATE(), 148, '8:07be3838b03ca155d1758833bab4b912', 'addForeignKeyConstraint baseTableName=GLAccountsInflation, constraintName=FK_GLAccountsInflation_Departments_DepartmentID, referencedTableName=Departments', '', 'EXECUTED', NULL, NULL, '3.9.0', '4819764334')
GO

-- Changeset 20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml::20200714182030-GLAccountsInflationFKEntityID::jbeam
ALTER TABLE GLAccountsInflation ADD CONSTRAINT FK_GLAccountsInflation_Entities_EntityID FOREIGN KEY (EntityID) REFERENCES Entities (EntityID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200714182030-GLAccountsInflationFKEntityID', 'jbeam', '20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml', GETDATE(), 149, '8:f2b30538119ba73e11f0a3f1e1350a89', 'addForeignKeyConstraint baseTableName=GLAccountsInflation, constraintName=FK_GLAccountsInflation_Entities_EntityID, referencedTableName=Entities', '', 'EXECUTED', NULL, NULL, '3.9.0', '4819764334')
GO

-- Changeset 20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml::20200714182030-GLAccountsInflationFKGLAccountID::jbeam
ALTER TABLE GLAccountsInflation ADD CONSTRAINT FK_GLAccountsInflation_GLAccounts_GLAccountID FOREIGN KEY (GLAccountID) REFERENCES GLAccounts (GLAccountID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200714182030-GLAccountsInflationFKGLAccountID', 'jbeam', '20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml', GETDATE(), 150, '8:6895514ba17d6096e9bfe8d660d9cfbc', 'addForeignKeyConstraint baseTableName=GLAccountsInflation, constraintName=FK_GLAccountsInflation_GLAccounts_GLAccountID, referencedTableName=GLAccounts', '', 'EXECUTED', NULL, NULL, '3.9.0', '4819764334')
GO

-- Changeset 20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml::20200714182030-GLAccountsInflationFKEndMonthItemTypeID::jbeam
ALTER TABLE GLAccountsInflation ADD CONSTRAINT FK_GLAccountsInflation_ItemTypes_EndMonthItemTypeID FOREIGN KEY (EndMonthItemTypeID) REFERENCES ItemTypes (ItemTypeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200714182030-GLAccountsInflationFKEndMonthItemTypeID', 'jbeam', '20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml', GETDATE(), 151, '8:2d528d22f7703fe81bb60d4a7ba385b7', 'addForeignKeyConstraint baseTableName=GLAccountsInflation, constraintName=FK_GLAccountsInflation_ItemTypes_EndMonthItemTypeID, referencedTableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '4819764334')
GO

-- Changeset 20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml::20200714182030-GLAccountsInflationFKStartMonthItemTypeID::jbeam
ALTER TABLE GLAccountsInflation ADD CONSTRAINT FK_GLAccountsInflation_ItemTypes_StartMonthItemTypeID FOREIGN KEY (StartMonthItemTypeID) REFERENCES ItemTypes (ItemTypeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200714182030-GLAccountsInflationFKStartMonthItemTypeID', 'jbeam', '20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml', GETDATE(), 152, '8:f0708c8576484d78fcbfbbfdf6ea8854', 'addForeignKeyConstraint baseTableName=GLAccountsInflation, constraintName=FK_GLAccountsInflation_ItemTypes_StartMonthItemTypeID, referencedTableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '4819764334')
GO

-- Changeset 20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml::20200714182030-GLAccountsInflationFKTimePeriodID::jbeam
ALTER TABLE GLAccountsInflation ADD CONSTRAINT FK_GLAccountsInflation_TimePeriods_TimePeriodID1 FOREIGN KEY (TimePeriodID1) REFERENCES TimePeriods (TimePeriodID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20200714182030-GLAccountsInflationFKTimePeriodID', 'jbeam', '20200714182030_ABS-462_GLAccountsInflation_Table_Creation.xml', GETDATE(), 153, '8:f57b785fa16fd69db888bf2da97a1014', 'addForeignKeyConstraint baseTableName=GLAccountsInflation, constraintName=FK_GLAccountsInflation_TimePeriods_TimePeriodID1, referencedTableName=TimePeriods', '', 'EXECUTED', NULL, NULL, '3.9.0', '4819764334')
GO

-- Changeset 202007150400_ABS_246_Update_BudgetVersionStatisticsData.xml::202007150400_ABS_246_Update_BudgetVersionStatisticsData.xml::fsheikh
update StatisticalData set DataScenarioTypeIDItemTypeID = (select top 1 ItemTypeID from ItemTypes where ItemTypeKeyword = 'STATISTICSDATA' and ItemTypeCode = 'Patient Care') where DataScenarioTypeIDItemTypeID = (select top 1 ItemTypeID from ItemTypes where ItemTypeCode = 'ST')
        update StatisticalData set DataScenarioTypeIDItemTypeID = (select top 1 ItemTypeID from ItemTypes where ItemTypeKeyword = 'GENERALLEDGERDATA' and ItemTypeCode = 'Patient Care') where DataScenarioTypeIDItemTypeID = (select top 1 ItemTypeID from ItemTypes where ItemTypeCode = 'GL')
        update StatisticalData set DataScenarioTypeIDItemTypeID = (select top 1 ItemTypeID from ItemTypes where ItemTypeKeyword = 'STAFFINGDATA' and ItemTypeCode = 'Patient Care') where DataScenarioTypeIDItemTypeID = (select top 1 ItemTypeID from ItemTypes where ItemTypeCode = 'SF')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202007150400_ABS_246_Update_BudgetVersionStatisticsData.xml', 'fsheikh', '202007150400_ABS_246_Update_BudgetVersionStatisticsData.xml', GETDATE(), 154, '8:bf87f2adf055d1fa655b295aa0e6de8e', 'sql', '', 'EXECUTED', NULL, NULL, '3.9.0', '4819764334')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

