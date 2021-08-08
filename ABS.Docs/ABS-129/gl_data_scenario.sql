prompt PL/SQL Developer Export Tables for user QA@DEVCURR
prompt Created by ss89222 on Wednesday, April 22, 2020
set feedback off
set define off

prompt Dropping GL_DATA_SCENARIO...
drop table GL_DATA_SCENARIO cascade constraints;
prompt Creating GL_DATA_SCENARIO...
create table GL_DATA_SCENARIO
(
  objectid       NUMBER(10) not null,
  description    VARCHAR2(40) not null,
  timeperiodname VARCHAR2(40) not null,
  lockversion    NUMBER(10) default 1 not null
)
;
create index FK_GLDATASCENARIO_TIMEPERIOD on GL_DATA_SCENARIO (TIMEPERIODNAME);
alter table GL_DATA_SCENARIO
  add constraint PK_GLDATASCENARIO primary key (OBJECTID);
alter table GL_DATA_SCENARIO
  add constraint UNQ_GLDATASCENARIO unique (DESCRIPTION, TIMEPERIODNAME);
alter table GL_DATA_SCENARIO
  add constraint FK_GLDATASCENARIO_TIMEPERIOD foreign key (TIMEPERIODNAME)
  references TIMEPERIOD2 (NAME);

prompt Loading GL_DATA_SCENARIO...
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6102, 'JKSECDS2', 'jksecds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2400, 'YAGLDATASET', 'xds3', 2);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3100, 'YAGLDATASET2', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1900, 'rgl1', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1903, 'rgl3', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4502, 'GLDATASCEN3430', '133Source', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2100, 'rgl5', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2700, 'jkds6', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1902, 'rgl2', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1500, 'RRDS9', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2800, 'jkds7', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1700, 'RRGL2', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2000, 'rgl4', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2204, 'jkds3', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2500, 'JCK FY07 Budget Update', 'YADATASET1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3700, 'GL Data Scen TB', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4200, 'test', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4902, '0-gldatascenario1', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (5602, 'JKSECDSOH', 'jksecds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6002, 'JKSECDSADJ1', 'jksecds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6003, 'JKSECDSADJ2', 'jksecds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3200, 'jkRT2', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4802, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrr', '2005 ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (5803, 'JKSECDSRECLASS2', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (5903, 'ASESC119', '133Result', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1103, 'RRDataSetzero ', 'FY04 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1104, 'RRDataSetneg ', 'FY04 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1109, 'xgl2012', 'xds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (5402, 'JKSECDS1', 'jksecds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3900, 'Classmig-2937', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6402, 'JKSECDSGA1', 'JKDATASETFY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (800, 'RRDS3', '2013-ACTUAL', 2);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3800, 'Classmig-1794', '2005 ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4702, 'Classmig-3486', '1999-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2600, 'jkds5', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3400, 'TB GL Data Scen', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1600, 'RRGL1', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4402, 'RTEST', '2010-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3401, 'TB GL Scen 2', '1999-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4202, 'CLASSMIG-3662', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4603, 'test123', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (5203, '0-axgldatascenario1', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2202, 'BCGL1', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2203, 'BCGL2', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3903, 'TRB02032014', '1999-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4302, 'Classmig - 3486', '2001-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4303, 'classmig3486', '2001-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (683, 'FY13', 'FY13', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3600, 'TB GL Data Scen 3', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2300, 'jkds4', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3300, 'BCGL3', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3902, '02032014', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1800, 'rrglnull1', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1801, 'rzero1', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1802, 'rzero2', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1300, 'RRDSDSZERO', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1201, 'RRDSDN', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1203, 'RRDSRENE', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (5002, 'TB GL Data Scenario for Test', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (5502, '0-AXGLDATA', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1200, 'RRDSOH', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1202, 'RRDSRE', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (2900, 'jkRT1', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1101, 'RRDataSet2 ', 'FY04 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1102, 'RRDataSetnull ', 'FY04 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1100, 'RRDataSet1 ', 'FY04 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1106, 'RRDSNULL', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1108, 'RRDS1', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4000, 'Test0205', '133Result', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4100, 'Test0205', '133Source', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (5802, 'JKSECDSRECLASS1', 'jksecds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (100, 'EA Test', 'EA Test', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (101, 'FY05 Act Recla', 'FY05 Act Recla', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (102, 'MH FY02', 'FY02', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (103, 'SG FY02', 'FY02', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (104, 'OC FY02', 'FY02', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (105, 'IP FY02', 'FY02', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (106, 'MH FY03', 'FY03', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (107, 'SG FY03', 'FY03', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (108, 'OC FY03', 'FY03', 439);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (109, 'IP FY03', 'FY03', 440);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (110, 'MHC FY03', 'FY03', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (111, 'CHC FY03', 'FY03', 439);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (112, 'MH FY04', 'FY04', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (113, 'SG FY04', 'FY04', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (114, 'OC FY04', 'FY04', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (115, 'IP FY04', 'FY04', 439);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (116, 'MHC FY04', 'FY04', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (117, 'CHC FY04', 'FY04', 439);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (118, 'MH FY05', 'FY05', 472);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (119, 'SG FY05', 'FY05', 439);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (120, 'OC FY05', 'FY05', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (121, 'IP FY05', 'FY05', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (122, 'CHC FY05', 'FY05', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (123, 'MHC FY05', 'FY05', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (124, 'MH FY06', 'FY06', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (125, 'SG FY06', 'FY06', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (126, 'OC FY06', 'FY06', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (127, 'IP FY06', 'FY06', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (128, 'MHC FY06', 'FY06', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (129, 'OT FY06', 'FY06', 438);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (130, 'FY06 Actual', 'FY06 Actual', 16945);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (131, 'FY07 Budget', 'FY07 Budget', 21498);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (132, 'FY06 Projected', 'FY06 Projected', 17919);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (133, 'FY03 Actual', 'FY03 Actual', 15662);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (134, 'FY02 Actual', 'FY02 Actual', 17981);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (135, 'FY06 Budget', 'FY06 Budget', 17862);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (136, 'FY04 Actual', 'FY04 Actual', 16246);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (137, 'FY05 Actual', 'FY05 Actual', 16143);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (138, 'FY05 Budget', 'FY05 Budget', 15786);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (139, 'CORP - FY06 Budget', 'CORP - FY06 Budget', 15211);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (140, '520FY03', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (141, '520FY03Budget', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (142, '520FY04', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (143, '520FY04Budget', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (144, '520FY05', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (145, '520FY05Budget', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (146, '520FY06', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (147, '520FY06Budget', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148, '540FY03', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149, '540FY03Budget', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (150, '540FY04', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (151, '540FY04Budget', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (152, '540FY05', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (153, '540FY05Budget', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (154, '540FY06', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (155, '540FY06Budget', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (156, 'CHC FY03 Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (157, 'CHC FY03Budget', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (158, 'CHC FY04 Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (159, 'CHC FY04Budget', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (160, 'CHC FY05Budget', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (161, 'CHC FY06', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (162, 'CHC FY06Budget', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (163, 'FY02', 'FY02', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (164, 'FY02 RCL', 'FY02', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (165, 'IP FY02 Reclass', 'FY02', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (166, 'IP FY03 Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (167, 'IP FY03Budget', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (168, 'IP FY03Budget Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (169, 'IP FY04 Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (170, 'IP FY04Budget', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (171, 'IP FY04Budget Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (172, 'IP FY05 Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (173, 'IP FY05Budget', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (174, 'IP FY05Budget Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (175, 'IP FY06 Reclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (176, 'IP FY06Budget', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (177, 'IP FY06BudgetReclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (178, 'MH FY02 Reclass', 'FY02', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (179, 'MH FY03 Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (180, 'MH FY03Budget', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (181, 'MH FY03Budget Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (182, 'MH FY04 Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (183, 'MH FY04Budget', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (184, 'MH FY04Budget Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (185, 'MH FY05 Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (186, 'MH FY05Budget', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (187, 'MH FY05Budget Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (188, 'MH FY06 Reclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (189, 'MH FY06Budget', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (190, 'MH FY06BudgetReclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (191, 'MH FY06CYProjected', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (192, 'MH FY07Budget', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (193, 'MHC FY03 Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (194, 'MHC FY03Budget', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (195, 'MHC FY03Budget Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (196, 'MHC FY04 Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (197, 'MHC FY04Budget', 'FY04', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (198, 'MHC FY04Budget Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (199, 'MHC FY05 Reclass', 'FY05', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (200, 'MHC FY05Budget', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (201, 'MHC FY05Budget Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (202, 'MHC FY06 Reclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (203, 'MHC FY06Budget', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (204, 'MHC FY06BudgetReclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (205, 'OC FY02 Reclass', 'FY02', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (206, 'OC FY03 Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (207, 'OC FY03Budget', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (208, 'OC FY03Budget Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (209, 'OC FY04 Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (210, 'OC FY04Budget', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (211, 'OC FY04Budget Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (212, 'OC FY05 Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (213, 'OC FY05Budget', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (214, 'OC FY05Budget Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (215, 'OC FY06 Reclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (216, 'OC FY06Budget', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (217, 'OC FY06BudgetReclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (218, 'OT FY06 Reclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (219, 'OT FY06Budget', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (220, 'OT FY06BudgetReclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (221, 'SG FY02 Reclass', 'FY02', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (222, 'SG FY03 Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (223, 'SG FY03Budget', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (224, 'SG FY03Budget Reclass', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (225, 'SG FY04 Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (226, 'SG FY04Budget', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (227, 'SG FY04Budget Reclass', 'FY04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (228, 'SG FY05 Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (229, 'SG FY05Budget', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (230, 'SG FY05Budget Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (231, 'SG FY06 Reclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (232, 'SG FY06Budget', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (233, 'SG FY06BudgetReclass', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (234, 'MB FY07 CPY TST', 'MB FY07 CPY TST', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (235, 'MBFY07TEST - 2', 'MBFY07TEST - 2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (236, 'MBFY07TEST-2', 'MBFY07TEST-2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (237, 'FY08 Flexed', 'FY08 Flexed', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (238, 'MC FY04 Budget', 'MC FY04 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (239, 'MC Jul03-Jun04 Copy from MC FY04 Budget', 'MC Jul03-Jun04 Copy from MC FY04 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (240, 'FY08 Actual Ak', 'FY08 Actual Ak', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (241, 'FY08 Budget Ak', 'FY08 Budget Ak', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (242, 'FY07 Actual Ak', 'FY07 Actual Ak', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (243, 'FY08 Projection Ak', 'FY08 Projection Ak', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (244, 'FY09 Budget Ak', 'FY09 Budget Ak', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (245, 'FY09 Budget Ak - First Pass', 'FY09 Budget Ak - First Pass', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (246, 'MB 2009 Budget Scenario', 'MB 2009 Budget Scenario', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (247, 'MC FY05 Budget', 'MC FY05 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (248, 'MC FY0405 Budget', 'MC FY0405 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (249, 'MC FY04 Budget Copy', 'MC FY04 Budget Copy', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (250, 'IG FY2009 Budget', 'IG FY2009 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (251, 'MB 2009 Budget', 'MB 2009 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (252, 'MB FY09 Data Set', 'MB FY09 Data Set', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (253, 'FP 2008 - ACTUAL', 'FP 2008 - ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (254, 'FP2007ACTUAL', 'FP2007ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (255, 'FY08 Actuals - Diane', 'FY08 Actuals - Diane', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (256, 'DM FY04 Actual', 'DM FY04 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (257, 'FP 2009 BUDGET SCENARIO', 'FP 2009 BUDGET SCENARIO', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (258, 'FP2006ACTUAL', 'FP2006ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (259, 'FP 2006 BUDGET', 'FP 2006 BUDGET', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (260, 'MB FY08 Projected', 'MB FY08 Projected', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (261, 'FP 2010 ACTUAL', 'FP 2010 ACTUAL', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (262, 'FP 2006 BUDGET SCENARIO-PROJECTED', 'FP 2006 BUDGET SCENARIO-PROJECTED', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (263, 'FY05 Actual MC', 'FY05 Actual MC', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (264, 'FY05 Budget MC', 'FY05 Budget MC', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (265, 'MC FY05 Budget Copy', 'MC FY05 Budget Copy', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (266, 'MC FY06 Budget Copy', 'MC FY06 Budget Copy', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (267, 'FY05 Actual HB', 'FY05 Actual HB', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (268, 'MC FY05 BudToAct Copy', 'MC FY05 BudToAct Copy', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (269, 'MC FY05 Rolling Budget', 'MC FY05 Rolling Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (270, 'MC 06 from MC 05 Year End Projection', 'MC 06 from MC 05 Year End Projection', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (271, 'AT FY05 Budget', 'AT FY05 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (272, 'AT FY05 Budget Overlap', 'AT FY05 Budget Overlap', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (273, 'JS FY05 Budget', 'JS FY05 Budget', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (274, 'TestDataSet13-FY05 Actual', 'TestDataSet13-FY05 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (275, 'TestDataSet14-FY05 Actual', 'TestDataSet14-FY05 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (276, 'FP 2012 BUDGET SCENARIO', 'FP 2012 BUDGET SCENARIO', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (277, 'DATASETFY2004', 'DATASETFY2004', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (278, 'DATASETFY2007', 'DATASETFY2007', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (279, 'DATASETFY2008', 'DATASETFY2008', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (280, 'DATASETFY2009', 'DATASETFY2009', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (281, 'DATASETFY2010', 'DATASETFY2010', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (282, 'DATASETFY2011', 'DATASETFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (283, 'DATASETFY2012', 'DATASETFY2012', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (284, 'cbs1', 'cbs1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (285, 'cds1', 'cds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (286, 'cbs2', 'cbs2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (287, 'cbs3', 'cbs3', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (288, 'cbs4', 'cbs4', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (289, 'cbs5', 'cbs5', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (290, 'cbs6', 'cbs6', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (291, 'vds1', 'vds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (292, 'vbs1', 'vbs1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (293, 'vds2', 'vds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (294, 'vbs3', 'vbs3', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (295, 'vds3-prj', 'vds3-prj', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (296, 'vds4', 'vds4', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (297, 'vbs4', 'vbs4', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (298, 'ASESC725DS', 'ASESC725DS', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (299, 'ASESC725DS1', 'ASESC725DS1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (300, 'gbs1', 'gbs1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (301, 'ASESC781DS', 'ASESC781DS', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (302, 'TINESHA', 'TINESHA', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (303, 'TINESHA2', 'TINESHA2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (304, 'TINESHA3', 'TINESHA3', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (305, 'ASESC804', 'ASESC804', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (306, 'MB09 SALARY Before', 'MB09 SALARY Before', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (307, 'MB FY09 Before - 2', 'MB FY09 Before - 2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (308, 'zbs1', 'zbs1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (309, 'MB F09 Projected BEFORE', 'MB F09 Projected BEFORE', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (310, 'MB FY09 NEW Salary', 'MB FY09 NEW Salary', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (311, 'MB FY09 NEW Salary Copy 1', 'MB FY09 NEW Salary Copy 1', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (312, 'MB FY09 NEW Salary Copy 2', 'MB FY09 NEW Salary Copy 2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (313, 'MB FY09 NEW Salary with Salary', 'MB FY09 NEW Salary with Salary', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (314, 'MB FY09 NEW Salary with Salary  2', 'MB FY09 NEW Salary with Salary  2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (315, 'MB FY09 Update Salary Copy 1', 'MB FY09 Update Salary Copy 1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (316, 'MB FY09 Update Salary Copy 2', 'MB FY09 Update Salary Copy 2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (317, 'ASESC804B', 'ASESC804B', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (318, 'MB FY09 Projected - Copy 1', 'MB FY09 Projected - Copy 1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (319, 'MB FY09 Projected - Copy 2', 'MB FY09 Projected - Copy 2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (320, 'MB FY09 NEW Salary w data c11', 'MB FY09 NEW Salary w data c11', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (321, 'ASESC831', 'ASESC831', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (322, 'ASESC831RC', 'ASESC831RC', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (323, 'MB FY09 New Salary ND 4', 'MB FY09 New Salary ND 4', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (324, 'MB FY09 New Salary ND 5', 'MB FY09 New Salary ND 5', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (325, 'MB FY09 New Salary ND 6', 'MB FY09 New Salary ND 6', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (326, 'MB Fy09 Projected Copy 3', 'MB Fy09 Projected Copy 3', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (327, 'MB FY09 New Salary ND 7', 'MB FY09 New Salary ND 7', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (328, 'SMOKEGLFY08RECL', 'SMOKEGLFY08RECL', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (329, 'SMOKEGLFY08ACT', 'SMOKEGLFY08ACT', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (330, 'TB2010ACT', 'TB2010ACT', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (331, 'TB2011ACT', 'TB2011ACT', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (332, 'TB2012ACT', 'TB2012ACT', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (333, 'MB FY09 PT Dist 3512', 'MB FY09 PT Dist 3512', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (334, 'JSRECLASS04', 'JSRECLASS04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (335, 'JS2RECLASS04', 'JS2RECLASS04', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (336, 'MBFY07 Projected', 'MBFY07 Projected', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (337, 'BVBS1', 'BVBS1', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (338, 'BVBS2', 'BVBS2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (339, 'EDS1', 'EDS1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (340, 'EBS1', 'EBS1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (341, 'EBS2', 'EBS2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (342, 'EBS3', 'EBS3', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (343, 'EBS5', 'EBS5', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (344, 'MB FY09 Employee Budget Scenario', 'MB FY09 Employee Budget Scenario', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (345, 'DR ROLL UP BUDGET', 'DR ROLL UP BUDGET', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (346, 'FY05 Flexed', 'FY05 Flexed', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (347, 'AP02RCL', 'AP02RCL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (348, 'ASESC-133 Entity 133', 'ASESC-133 Entity 133', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (349, 'ASESC-133 Entity 150', 'ASESC-133 Entity 150', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (350, '133Source', '133Source', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (351, '150Source', '150Source', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (352, '133Result', '133Result', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (353, 'gsds1', 'gsds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (354, 'gsds1reclass', 'gsds1reclass', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (355, 'gsds2', 'gsds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (356, 'gsds2reclass', 'gsds2reclass', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (357, 'gsds3', 'gsds3', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (358, 'gsds3reclass', 'gsds3reclass', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (359, 'xds1', 'xds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (360, 'xds1-reclass2', 'xds1-reclass2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (361, 'xds2', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (362, 'xds2reclass', 'xds2reclass', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (363, 'jkds1', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (364, 'jkds2', 'jkds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (365, 'gsds4', 'gsds4', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (366, 'gsds4Reclass', 'gsds4Reclass', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (367, 'JKDataSet1ForCost-82', 'JKDataSet1ForCost-82', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (368, 'JKDataSet2ForCost-82', 'JKDataSet2ForCost-82', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (369, 'JKDataSet3ForCost-82', 'JKDataSet3ForCost-82', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (370, '&23q2', '&23q2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (371, 'a234567890123456789012345678901234567890', 'a234567890123456789012345678901234567890', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (372, 'b234567890123456789012345678901234567890', 'b234567890123456789012345678901234567890', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (373, 'DR FY03 Actual', 'DR FY03 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (374, 'DR FY03 Reclass', 'DR FY03 Reclass', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (375, 'DR FY04 Actual', 'DR FY04 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (376, 'DR FY04 Reclass', 'DR FY04 Reclass', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (377, 'MB FY07', 'MB FY07', 2);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (378, 'MC - 07 Budget', 'MC - 07 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (379, 'MC - 07 Budget - 150 only', 'MC - 07 Budget - 150 only', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (380, 'MC 07 Budget - With Revenue', 'MC 07 Budget - With Revenue', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (381, 'MC - 07 Budget - All Entities', 'MC - 07 Budget - All Entities', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (382, 'FY07 Actual', 'FY07 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (383, 'FZ Data Set 2', 'FZ Data Set 2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (384, 'DM FY02 Budget', 'DM FY02 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (385, 'MB FY08 Budget', 'MB FY08 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (386, 'MB FY08 Actual', 'MB FY08 Actual', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (387, 'MB FY07 APR', 'MB FY07 APR', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (388, 'MB FY09', 'MB FY09', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (389, 'MC 05 - Year End Projection', 'MC 05 - Year End Projection', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (390, 'FY09 Budget for Demo', 'FY09 Budget for Demo', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (391, 'FY08 Budget Demo', 'FY08 Budget Demo', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (392, '2008 PRA TEST', '2008 PRA TEST', 9);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (393, 'MB FY07 Actual', 'MB FY07 Actual', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (394, 'MC 06 Budget from MB FY05 Projected', 'MC 06 Budget from MB FY05 Projected', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (395, 'MBFY07 Actual', 'MBFY07 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (396, 'CB FY05 Budget', 'CB FY05 Budget', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (397, '2004-Actual', '2004-Actual', 2);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (398, '520FY05 Reclass', 'FY05', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (399, 'CHC FY05 Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (400, 'DL CY08 Actual', 'DL CY08 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (401, 'DL CY08 Reclass', 'DL CY08 Reclass', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (402, 'FP 2005 ACTUAL', 'FP 2005 ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (403, 'IP FY07 Reclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (404, 'IP FY07BudgetReclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (405, 'MH FY07 Reclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (406, 'MH FY07BudgetReclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (407, 'MHC FY07 Reclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (408, 'MHC FY07BudgetReclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (409, 'OC FY07 Reclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (410, 'OC FY07BudgetReclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (411, 'OT FY07 Reclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (412, 'OT FY07BudgetReclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (413, 'SG FY07 Reclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (414, 'SG FY07BudgetReclass', 'FY07', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (415, 'gsds5', 'gsds5', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (500, 'c234567890123456789012345678901234567890', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (502, 'd234567890123456789012345678901234567890', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1400, 'RRDS10', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (4201, 'TEST0405', '2005 ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1105, 'RRDSZERO', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1107, 'RRDSNEG', '2013-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (1110, 'xgl2008', 'FY07 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (3901, 'Classmig2937', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6202, 'Test00530', '133Result', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (600, 'xds4', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (603, 'xds5calc', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (601, 'xds4calc', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (602, 'xds5', 'xds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6902, '* GL IMP XLSX', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6702, 'jkdsqty', 'jkds1', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7004, '0-sept22destgldatascenario', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7102, 'ASESC1629', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6802, '* GL IMP TXT TEST', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6502, 'XPGLDATA', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6503, 'XPDESTGLDATA', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7002, 'XPGLDATAFY2014', 'XPFY2014', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7003, 'XPDESTGLFY2014', 'XPFY2014', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (6602, '* MHFY05 Reclass TB', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7604, 'NOV19SOURCEGLDATA', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7605, 'NOV19DESTINATIONGLDATA', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7702, '* ASESC-1988 GL Reclass', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7402, 'XS34567890123456789012345678901234567890', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7403, 'XD34567890123456789012345678901234567890', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7802, 'JKDS2', 'jkds2', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7902, 'MC FY05 Test Scenario', 'FY05 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7602, 'Test483', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7603, 'XS34567890123456789012345678901234567891', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7502, 'TB FY03', 'FY03', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7302, '1833 GL', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7703, '** TB GL Reclass Calc Test', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7202, 'ASESC-1832 FY04 GL', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (7404, 'XPDESTGLOCT31', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8207, 'FEB2ARDESTINATIONGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8306, 'FEB12SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8406, 'FEB12DESTINATIONGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8808, 'FEB25SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8809, 'FEB25DESTGLADJ', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8810, 'FEB25DESTGLRECLASS', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8811, 'FEB25DESTGLADJANDRECLASS', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9006, 'MARCH2SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9007, 'MARCH2DESTGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8706, 'FEB19DESTGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8707, 'FEB19X3DESTGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8708, 'FEB19X2DESTGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9106, 'MARCH4SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9107, 'MARCH4DESTGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8103, 'Marina FY02 Destination GL', 'FY02', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8211, 'FY2015 - Marina', 'FY2015', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8206, 'FEB2RDESTINATIONGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8208, 'FEB2DESTINATIONGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8104, 'JAN23-SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8105, 'JAN23-DESTINATIONGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8102, 'MHC FY06 DESTINATION GL SCENARIO', 'FY06', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8212, 'FY2015 - Marina Reclass Scenario', 'FY2015', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8108, 'JAN30RDESTINATIONGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8109, 'JAN30ARDESTINATIONGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8209, 'FEB3SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8210, 'FEB3DESTINATIONGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8606, 'FEB19SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8806, 'FEB23SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8807, 'FEB23DESTGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8906, 'FEB26SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8907, 'FEB26DESTGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8106, 'JAN30SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8107, 'JAN30DESTINATIONGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8002, 'APO2RCLDest', 'AP02RCL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (8506, 'FEB18SOURCEGL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9206, 'Move Chg 2015 GL', 'TBFY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9306, 'DESTINATIONGLDATASCENARIO1', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9406, 'ORSOURCEGL', 'ORFY2015', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10006, '&FZ GL Data Scenario ASESC-2354', '2014-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9706, 'ASESC2305 GL BIG', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9506, 'ORDESTINATIONGL1', 'ORFY2015', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9606, 'ASESC2305 GL', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9906, 'XPGL-OCT21', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (9806, 'CY2014ML', 'CY2014ML', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10106, 'TB FY05 2016', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10206, 'PJTEST', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10506, 'EOC GL Data Scenario', 'FY16 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10606, 'DSS2218 TXT', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10607, 'DSS2218 XLSX', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10806, 'DSS2245 GL', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (11006, 'DSS2245 GL Reclass After 2', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (11106, 'ASESC-2518 FY05', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10406, 'ASESC2581GL', 'TB16', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10306, 'CHC FY03 Budget Reclass #2', 'DR FY03 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10307, 'MH FY05 Reclass1', 'DATASETFY2005', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10707, 'ASESC2612', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (10906, 'DSS2245 GL Reclass After', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (11306, 'Act Cost GL', 'TB17', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148207, 'dev', 'TEST01', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (54507, 'ASESC-2969 GL', 'FY16 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (37707, 'ASESC2908 No Time GL', 'ASESC2908 No Time', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (14206, 'FZJKSECDSGA1', 'JKDATASETFY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148507, 'FY 11 Automation FZL', 'FP-2011-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148508, 'FY11 Automation FZL', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (126907, '0TestPJ1', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (37706, 'ASESC2908 GL', 'ASESC2908', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148509, 'v9.7 GL automation fzl', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (19506, 'RVU Regress GL Do Not Modify', 'TB17', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (101707, 'ASESC2908 GL Data Both Calc', 'ASESC2908', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (11206, 'PJGLDataScen', 'PJFY16', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (126908, '0TestPJ2', '2004-Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (12206, '&FZ Simple GL Target FY2014', '2014-ACTUAL', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148407, 'v9.7 GL Data Destination Scenario FZL1', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (150207, 'ADS482 GL', 'FY13', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (150407, 'DM FY05 Actual', 'FY05 Actual', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149608, 'Diane GL Data Scenario', 'TB18', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (150107, 'ADS262 GL', 'TB19', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148709, 'GL Data TEST RUN 1', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149507, 'Pract Cost w Mod GL', 'TB18', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149907, 'DSS361', 'FY15', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (150507, 'DM MHFY05 Reclass TB', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148715, 'GL Data TEST RUN5', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (150307, 'UCQC GL Data', 'TB19', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149707, 'GL for Pract Costing', 'Apr 1992-Mar 1993', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148607, 'test PT', '**FY16', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148610, 'TEST RUN 9', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149607, 'v97 Diane GL Data Scenario', 'TB18', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148807, 'GL Data TEST RUN6', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148714, 'XGL Data TEST RUN4', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148608, 'TEST RUN 7', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148932, '4v9.6  GL automation1', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148912, 'Test GL PT', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149407, 'v9.6 GL automation', 'XPFY2011', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149809, 'JKGDS1', 'JK_TP_1', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149810, 'JKGDS2', 'JK_TP_1', 1);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (150807, 'QA ADS-302 FY05 Actual', 'FY05', 0);
insert into GL_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (150707, 'DMTEST1JAN', 'MB FY07', 0);
prompt 521 records loaded

set feedback on
set define on
prompt Done
