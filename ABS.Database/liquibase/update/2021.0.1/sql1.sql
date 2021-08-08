-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: ./changelog.xml
-- Ran at: 3/8/21, 1:32 PM
-- Against: sa@jdbc:sqlserver://localhost:1433;useFmtOnly=false;useBulkCopyForBatchInsert=false;cancelQueryTimeout=-1;sslProtocol=TLS;jaasConfigurationName=SQLJDBCDriver;statementPoolingCacheSize=0;serverPreparedStatementDiscardThreshold=10;enablePrepareOnFirstPreparedStatementCall=false;fips=false;socketTimeout=0;authentication=NotSpecified;authenticationScheme=nativeAuthentication;xopenStates=false;sendTimeAsDatetime=true;trustStoreType=JKS;trustServerCertificate=false;TransparentNetworkIPResolution=true;serverNameAsACE=false;sendStringParametersAsUnicode=true;selectMethod=direct;responseBuffering=adaptive;queryTimeout=-1;packetSize=8000;multiSubnetFailover=false;loginTimeout=15;lockTimeout=-1;lastUpdateCount=true;encrypt=false;disableStatementPooling=true;databaseName=BUDGET_DB;columnEncryptionSetting=Disabled;applicationName=Microsoft JDBC Driver for SQL Server;applicationIntent=readwrite;
-- Liquibase version: 3.9.0
-- *********************************************************************

USE BUDGET_DB;
GO

-- Lock Database
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 1, LOCKEDBY = 'CRKRL-SHAHISHA1 (192.168.119.1)', LOCKGRANTED = '2021-03-08T13:32:56.994' WHERE ID = 1 AND LOCKED = 0
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_ReportingTypes_M1::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'MEASURES', 'Amount', '1', 'amount/volumeRate', 'AMOUNT')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_ReportingTypes_M1', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 458, '8:e5a3163a1ae4e825c6f76fc39c45166f', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_ReportingTypes_M2::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'MEASURES', 'VOLUMERATE', '2', 'amount/volumeRate', 'VOLUMERATE')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_ReportingTypes_M2', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 459, '8:2a9e10906bbd4e4a660b0ff74a32218b', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_ReportingTypes_Q1::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'QUARTERS', '1st quarter', '1', 'amount/volumeRate', '1st quarter')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_ReportingTypes_Q1', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 460, '8:53597cdafb6d0797d2bab56894919352', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_ReportingTypes_Q2::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'QUARTERS', '1st quarter', '2', 'amount/volumeRate', '2nd quarter')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_ReportingTypes_Q2', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 461, '8:83a73c7302781144020b885616409160', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_ReportingTypes_Q3::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'QUARTERS', '1st quarter', '3', 'amount/volumeRate', '3rd quarter')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_ReportingTypes_Q3', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 462, '8:e89033fa828ff80b16f2d4b06f90c53e', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_ReportingTypes_Q4::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'QUARTERS', '1st quarter', '4', 'amount/volumeRate', '4th quarter')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_ReportingTypes_Q4', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 463, '8:5e4d0d7d0be194a8cd9204fc1a30ad8d', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_FileTypes_F1::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'FILEFORMAT', 'PDF', 'PDF', 'PDF/XLSX/CSV/CONNECTEDEXCEL', 'PDF')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_FileTypes_F1', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 464, '8:d2f7a8e3577120adf59e039c5c63cf11', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_FileTypes_F2::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'FILEFORMAT', 'XLSX', 'XLSX', 'PDF/XLSX/CSV/CONNECTEDEXCEL', 'Connected excel')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_FileTypes_F2', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 465, '8:cdbf8a6f1fe1a9010cc0f2a3500a3efa', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_FileTypes_F3::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'FILEFORMAT', 'XLSX', 'XLSX', 'PDF/XLSX/CSV/CONNECTEDEXCEL', 'Excel')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_FileTypes_F3', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 466, '8:a8a79fdb1a17ead98cc123a449c327a0', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_FileTypes_F4::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'FILEFORMAT', 'CSV', 'CSV', 'PDF/XLSX/CSV/CONNECTEDEXCEL', 'Comma delimited (.csv)')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_FileTypes_F4', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 467, '8:3f459009843d3b1fcb810555cb772961', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_Periods_P1::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'PERIODS', 'Months and FY total', '1', 'Months and FY total', 'Months and FY total')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_Periods_P1', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 468, '8:c2818676feb3fb0c850d6b018c602f33', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_Periods_P2::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'PERIODS', 'Month', '2', 'Month', 'Month')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_Periods_P2', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 469, '8:8e9b06c9ff3f5940ab187e9085ab978a', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_Periods_P3::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'PERIODS', 'Current month', '3', 'Current month', 'Current month')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_Periods_P3', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 470, '8:28e36f2aa005f30a9db65d98eddf17c3', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_Periods_P4::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'PERIODS', 'Current FYTD', '4', 'Current FYTD', 'Current FYTD')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_Periods_P4', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 471, '8:7724357805f900d5655bc3bdfb15f539', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_Periods_P5::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'PERIODS', 'Quarters and FY total', '5', 'Quarters and FY total', 'Quarters and FY total')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_Periods_P5', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 472, '8:e94c8828671cbe985716a10b237f2184', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_Periods_P6::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'PERIODS', 'Quarter', '6', 'Quarter', 'Quarter')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_Periods_P6', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 473, '8:8f87a63471415d1b2b8594fccb2ffb03', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_Periods_P7::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'PERIODS', 'Current quarter', '1', 'Current quarter', 'Current quarter')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_Periods_P7', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 474, '8:d173acbdb6e2ed4792e8c23d53346ef2', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_Periods_P8::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'PERIODS', 'Current quarter FYTD', '8', 'Current quarter FYTD', 'Current quarter FYTD')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_Periods_P8', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 475, '8:d8a47cd8755dbd7a2b28702183f4e642', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_Periods_P9::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'PERIODS', 'FY total', '9', 'FY total', 'FY total')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_Periods_P9', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 476, '8:898b59591a4d175d010c996422562028', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_ReportDisplay_RD1::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'REPORTDISPLAY', 'Report Header', '1', 'Report Header', 'Report Header')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_ReportDisplay_RD1', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 477, '8:722cabd72e3dd68b2699883a2395b3f7', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_ReportDisplay_RD2::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'REPORTDISPLAY', 'Row', '2', 'Row', 'Row')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_ReportDisplay_RD2', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 478, '8:03f9957640587fec8b7dfd75526d3b87', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml::20210301175555_Configuration_ItemType_Inserts_ReportDisplay_RD3::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('string', 1, 0, 'REPORTDISPLAY', 'Column', '3', 'Column', 'Column')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('20210301175555_Configuration_ItemType_Inserts_ReportDisplay_RD3', 'fshaikh', 'Reporting/20210301175555_Configuration_ItemType_Inserts_ReportingTypes.xml', GETDATE(), 479, '8:ea8f6668dbc3b9cce3c4363b6b9055a8', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Changeset 2021030221470000_Configuration_ItemType_Inserts_StoreParentChildData.xml::2021030221470000_Configuration_ItemType_Inserts_StoreParentChildData::fshaikh
INSERT INTO ItemTypes (ItemDataType, IsActive, IsDeleted, ItemTypeKeyword, ItemTypeCode, ItemTypeValue, ItemTypeDescription, ItemTypeDisplayName) VALUES ('bool', 1, 0, 'CONFIGURATION', 'STOREPARENTCHILDDATA', 'TRUE', 'true/false', 'STOREPARENTCHILDDATA')
GO

INSERT INTO DATABASECHANGELOG (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('2021030221470000_Configuration_ItemType_Inserts_StoreParentChildData', 'fshaikh', '2021030221470000_Configuration_ItemType_Inserts_StoreParentChildData.xml', GETDATE(), 480, '8:1237772b2455f924d55c70b2c0061ea1', 'insert tableName=ItemTypes', '', 'EXECUTED', NULL, NULL, '3.9.0', '5192379014')
GO

-- Release Database Lock
UPDATE DATABASECHANGELOGLOCK SET LOCKED = 0, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1
GO

