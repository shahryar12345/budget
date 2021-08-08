-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 3/28/21, 10:32 PM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (192.168.119.1)', LOCKGRANTED = '2021-03-28T22:32:29.899' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SubAccounts_SubAccountDimensions_TablesCreate::fshaikh
CREATE TABLE SubAccountsDimensions (SubAccountsDimensionID int IDENTITY (1, 1) NOT NULL, subAccountCode nvarchar(MAX), subAccountName nvarchar(MAX), subAccountValue nvarchar(MAX), subAccountTitle nvarchar(MAX), Description nvarchar(MAX), Comments nvarchar(MAX), BudgetVersionID int, EntityID int, DepartmentID int, StatisticsCodesStatisticsCodeID int, GLAccountsGLAccountID int, JobCodeID int, PayTypeID int, TimePeriodID1 int, DataScenarioTypeIDItemTypeID int, DataScenarioID1 int, StaffingDataTypeItemTypeID int, DimensionsRowIDDimensionsID int, January decimal(18, 2), February decimal(18, 2), March decimal(18, 2), April decimal(18, 2), May decimal(18, 2), June decimal(18, 2), July decimal(18, 2), August decimal(18, 2), September decimal(18, 2), October decimal(18, 2), November decimal(18, 2), December decimal(18, 2), rowTotal decimal(18, 2), wageRateOverride decimal(18, 2), Identifier uniqueidentifier, CreationDate datetime2, UpdatedDate datetime2, CreatedBy int, UpdateBy int, IsActive bit, IsDeleted bit, RowVersion varbinary(MAX), CONSTRAINT PK_SubAccountsDimensions PRIMARY KEY (SubAccountsDimensionID))
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SubAccounts_SubAccountDimensions_TablesCreate', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 481, '8:77d952cc370e3fe23ab2c55b82439f68', 'createTable tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_BudgetVersionID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_BudgetVersionID ON SubAccountsDimensions(BudgetVersionID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_BudgetVersionID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 482, '8:ba2c92572543e31792c1da317cd5b98d', 'createIndex indexName=IX_SubAccountsDimensions_BudgetVersionID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_DataScenarioID1::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_DataScenarioID1 ON SubAccountsDimensions(DataScenarioID1)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_DataScenarioID1', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 483, '8:b7b0137af042b41c4a7631e00bc4757d', 'createIndex indexName=IX_SubAccountsDimensions_DataScenarioID1, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_DataScenarioTypeIDItemTypeID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_DataScenarioTypeIDItemTypeID ON SubAccountsDimensions(DataScenarioTypeIDItemTypeID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_DataScenarioTypeIDItemTypeID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 484, '8:587fcafc7d5eb80a945bc44c9c59e114', 'createIndex indexName=IX_SubAccountsDimensions_DataScenarioTypeIDItemTypeID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_DepartmentID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_DepartmentID ON SubAccountsDimensions(DepartmentID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_DepartmentID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 485, '8:9e82a4503b46a80b4388ba8766b42264', 'createIndex indexName=IX_SubAccountsDimensions_DepartmentID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_DimensionsRowIDDimensionsID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_DimensionsRowIDDimensionsID ON SubAccountsDimensions(DimensionsRowIDDimensionsID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_DimensionsRowIDDimensionsID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 486, '8:31b6d19c8376128b98e64dc8bde77b6f', 'createIndex indexName=IX_SubAccountsDimensions_DimensionsRowIDDimensionsID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_EntityID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_EntityID ON SubAccountsDimensions(EntityID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_EntityID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 487, '8:b3356f3c6c54646f4a764deebbd843d7', 'createIndex indexName=IX_SubAccountsDimensions_EntityID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_GLAccountsGLAccountID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_GLAccountsGLAccountID ON SubAccountsDimensions(GLAccountsGLAccountID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_GLAccountsGLAccountID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 488, '8:9684899952fddcc3a06a9aa028d97dcf', 'createIndex indexName=IX_SubAccountsDimensions_GLAccountsGLAccountID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_JobCodeID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_JobCodeID ON SubAccountsDimensions(JobCodeID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_JobCodeID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 489, '8:384e8b270df41eaaf2e7c5b5625423d2', 'createIndex indexName=IX_SubAccountsDimensions_JobCodeID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_PayTypeID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_PayTypeID ON SubAccountsDimensions(PayTypeID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_PayTypeID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 490, '8:62f795029c7048a67458db2000415125', 'createIndex indexName=IX_SubAccountsDimensions_PayTypeID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_StaffingDataTypeItemTypeID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_StaffingDataTypeItemTypeID ON SubAccountsDimensions(StaffingDataTypeItemTypeID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_StaffingDataTypeItemTypeID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 491, '8:50a5f6b7b4bb2b82c05942a5ee650f08', 'createIndex indexName=IX_SubAccountsDimensions_StaffingDataTypeItemTypeID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_StatisticsCodesStatisticsCodeID::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_StatisticsCodesStatisticsCodeID ON SubAccountsDimensions(StatisticsCodesStatisticsCodeID)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_StatisticsCodesStatisticsCodeID', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 492, '8:e44c92156b65c8e33dac4792ec66ca33', 'createIndex indexName=IX_SubAccountsDimensions_StatisticsCodesStatisticsCodeID, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_IA_IX_SubAccountsDimensions_TimePeriodID1::FShaikh
CREATE NONCLUSTERED INDEX IX_SubAccountsDimensions_TimePeriodID1 ON SubAccountsDimensions(TimePeriodID1)
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_IA_IX_SubAccountsDimensions_TimePeriodID1', 'FShaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 493, '8:fc2e454c3036a6265a433f2a1593b74a', 'createIndex indexName=IX_SubAccountsDimensions_TimePeriodID1, tableName=SubAccountsDimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_BudgetVersions_BudgetVersionID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_BudgetVersions_BudgetVersionID FOREIGN KEY (BudgetVersionID) REFERENCES BudgetVersions (BudgetVersionID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_BudgetVersions_BudgetVersionID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 494, '8:0285b60b23b9ee78ef24c0f9c25c3a76', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_BudgetVersions_BudgetVersionID, referencedTableName=BudgetVersions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_DataScenario_DataScenarioID1::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_DataScenario_DataScenarioID1 FOREIGN KEY (DataScenarioID1) REFERENCES DataScenario (DataScenarioID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_DataScenario_DataScenarioID1', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 495, '8:91a9325d1838ba3c815297039b909ecf', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_DataScenario_DataScenarioID1, referencedTableName=DataScenario', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_ItemTypes_DataScenarioTypeIDItemTypeID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_ItemTypes_DataScenarioTypeIDItemTypeID FOREIGN KEY (DataScenarioTypeIDItemTypeID) REFERENCES ItemTypes (ItemTypeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_ItemTypes_DataScenarioTypeIDItemTypeID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 496, '8:97b958f16c8ef5d8b5bbee56a0124d37', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_ItemTypes_DataScenarioTypeIDItemTypeID, referencedTableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_Departments_DepartmentID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_Departments_DepartmentID FOREIGN KEY (DepartmentID) REFERENCES Departments (DepartmentID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_Departments_DepartmentID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 497, '8:d138d413925c552ef6f9d8ba2f267e40', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_Departments_DepartmentID, referencedTableName=Departments', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_Dimensions_DimensionsRowIDDimensionsID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_Dimensions_DimensionsRowIDDimensionsID FOREIGN KEY (DimensionsRowIDDimensionsID) REFERENCES Dimensions (DimensionsID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_Dimensions_DimensionsRowIDDimensionsID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 498, '8:6241d6cdb1c2a28acbf8fa5f4c8f62da', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_Dimensions_DimensionsRowIDDimensionsID, referencedTableName=Dimensions', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_Entities_EntityID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_Entities_EntityID FOREIGN KEY (EntityID) REFERENCES Entities (EntityID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_Entities_EntityID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 499, '8:afebf3e688a5641f043fa23421471773', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_Entities_EntityID, referencedTableName=Entities', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_GLAccounts_GLAccountsGLAccountID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_GLAccounts_GLAccountsGLAccountID FOREIGN KEY (GLAccountsGLAccountID) REFERENCES GLAccounts (GLAccountID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_GLAccounts_GLAccountsGLAccountID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 500, '8:b8d1706f4e30f7a2a01edd33030136c5', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_GLAccounts_GLAccountsGLAccountID, referencedTableName=GLAccounts', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_JobCodes_JobCodeID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_JobCodes_JobCodeID FOREIGN KEY (JobCodeID) REFERENCES JobCodes (JobCodeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_JobCodes_JobCodeID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 501, '8:55fe2a648b0de12e181ec68173fdabe0', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_JobCodes_JobCodeID, referencedTableName=JobCodes', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_PayTypes_PayTypeID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_PayTypes_PayTypeID FOREIGN KEY (PayTypeID) REFERENCES PayTypes (PayTypeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_PayTypes_PayTypeID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 502, '8:935246ede9eaac0e0a5a70f9882b0490', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_PayTypes_PayTypeID, referencedTableName=PayTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_ItemTypes_StaffingDataTypeItemTypeID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_ItemTypes_StaffingDataTypeItemTypeID FOREIGN KEY (StaffingDataTypeItemTypeID) REFERENCES ItemTypes (ItemTypeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_ItemTypes_StaffingDataTypeItemTypeID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 503, '8:d0d1a1dc27a1931a44b04209d29db423', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_ItemTypes_StaffingDataTypeItemTypeID, referencedTableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_StatisticsCodes_StatisticsCodesStatisticsCodeID::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_StatisticsCodes_StatisticsCodesStatisticsCodeID FOREIGN KEY (StatisticsCodesStatisticsCodeID) REFERENCES StatisticsCodes (StatisticsCodeID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_StatisticsCodes_StatisticsCodesStatisticsCodeID', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 504, '8:0a4ecb4bf96a8787caaf07ff5f12ba7e', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_StatisticsCodes_StatisticsCodesStatisticsCodeID, referencedTableName=StatisticsCodes', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml::202103110606_SA_SAD_FK_SubAccountsDimensions_TimePeriods_TimePeriodID1::fshaikh
ALTER TABLE SubAccountsDimensions ADD CONSTRAINT FK_SubAccountsDimensions_TimePeriods_TimePeriodID1 FOREIGN KEY (TimePeriodID1) REFERENCES TimePeriods (TimePeriodID) ON UPDATE NO ACTION ON DELETE NO ACTION
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('202103110606_SA_SAD_FK_SubAccountsDimensions_TimePeriods_TimePeriodID1', 'fshaikh', 'SubAccounts/202103110606_SubAccounts_SubAccountDimensions_TablesCreate.xml', GETDATE(), 505, '8:ccec25255f528c41e42a3776b85f6b18', 'addForeignKeyConstraint baseTableName=SubAccountsDimensions, constraintName=FK_SubAccountsDimensions_TimePeriods_TimePeriodID1, referencedTableName=TimePeriods', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Changeset Reporting/20210328175555_Configuration_ItemType_Update_ReportingDisplayOption.xml::20210328175555_Configuration_ItemType_Update_ReportingDisplayOption.xml::sshahid
update [ItemTypes]
  			set ItemTypeDisplayName = 'Report header'
  			where ItemTypeDisplayName = 'Report Header'
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210328175555_Configuration_ItemType_Update_ReportingDisplayOption.xml', 'sshahid', 'Reporting/20210328175555_Configuration_ItemType_Update_ReportingDisplayOption.xml', GETDATE(), 506, '8:1daf61e526d3dfdd1326f83e679fa6eb', 'sql', '', 'EXECUTED', NULL, NULL, '3.9.0', '6952751497')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

