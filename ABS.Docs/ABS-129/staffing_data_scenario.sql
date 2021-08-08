prompt PL/SQL Developer Export Tables for user QA@DEVCURR
prompt Created by ss89222 on Wednesday, April 22, 2020
set feedback off
set define off

prompt Dropping STAFFING_DATA_SCENARIO...
drop table STAFFING_DATA_SCENARIO cascade constraints;
prompt Creating STAFFING_DATA_SCENARIO...
create table STAFFING_DATA_SCENARIO
(
  objectid       NUMBER(10) not null,
  description    VARCHAR2(40) not null,
  timeperiodname VARCHAR2(40) not null,
  lockversion    NUMBER(10) default 1 not null
)
;
create index FK_STAFFDATSCENARIO_TIMEPERIOD on STAFFING_DATA_SCENARIO (TIMEPERIODNAME);
alter table STAFFING_DATA_SCENARIO
  add constraint PK_STAFFINGDATASCENARIO primary key (OBJECTID);
alter table STAFFING_DATA_SCENARIO
  add constraint UNQ_STAFFINGDATASCENARIO unique (DESCRIPTION, TIMEPERIODNAME);
alter table STAFFING_DATA_SCENARIO
  add constraint FK_STAFFDATSCENARIO_TIMEPERIOD foreign key (TIMEPERIODNAME)
  references TIMEPERIOD2 (NAME);

prompt Loading STAFFING_DATA_SCENARIO...
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (100, 'EA Test', 'EA Test', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (101, 'SG FY05', 'FY05', 439);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (102, 'FY06 Actual', 'FY06 Actual', 16945);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (103, 'FY07 Budget', 'FY07 Budget', 21498);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (104, 'FY06 Projected', 'FY06 Projected', 17919);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (105, 'FY03 Actual', 'FY03 Actual', 15662);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (106, 'FY02 Actual', 'FY02 Actual', 17981);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (107, 'FY06 Budget', 'FY06 Budget', 17862);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (108, 'FY04 Actual', 'FY04 Actual', 16246);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (109, 'FY05 Actual', 'FY05 Actual', 16143);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (110, 'FY05 Budget', 'FY05 Budget', 15786);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (111, '520FY03Budget', 'FY03', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (112, '540FY06Reclass', 'FY06', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (113, 'MB FY07 CPY TST', 'MB FY07 CPY TST', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (114, 'MBFY07TEST - 2', 'MBFY07TEST - 2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (115, 'MBFY07TEST-2', 'MBFY07TEST-2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (116, 'MC FY04 Budget', 'MC FY04 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (117, 'FY08 Actual Ak', 'FY08 Actual Ak', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (118, 'FY09 Budget Ak', 'FY09 Budget Ak', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (119, 'FY04 Earned', 'FY04 Earned', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (120, 'MB 2009 Budget Scenario', 'MB 2009 Budget Scenario', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (121, 'MC FY05 Budget', 'MC FY05 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (122, 'MC FY0405 Budget', 'MC FY0405 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (123, 'MC FY04 Budget Copy', 'MC FY04 Budget Copy', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (124, 'IG FY2009 Budget', 'IG FY2009 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (125, 'MB 2009 Budget', 'MB 2009 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (126, 'MB FY09 Data Set', 'MB FY09 Data Set', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (127, 'FP 2008 - ACTUAL', 'FP 2008 - ACTUAL', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (128, 'FP2007ACTUAL', 'FP2007ACTUAL', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (129, 'DM FY04 Actual', 'DM FY04 Actual', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (130, 'FP 2009 - ACTUAL', 'FP 2009 - ACTUAL', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (131, 'FP2006ACTUAL', 'FP2006ACTUAL', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (132, 'MB FY08 Projected', 'MB FY08 Projected', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (133, 'FP 2010 ACTUAL', 'FP 2010 ACTUAL', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (134, 'FY05 Actual MC', 'FY05 Actual MC', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (135, 'FY05 Budget MC', 'FY05 Budget MC', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (136, 'MC FY05 Budget Copy', 'MC FY05 Budget Copy', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (137, 'MC FY06 Budget Copy', 'MC FY06 Budget Copy', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (138, 'FP2011ACTUAL', 'FP2011ACTUAL', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (139, 'MC FY05 BudToAct Copy', 'MC FY05 BudToAct Copy', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (140, 'MC FY05 Rolling Budget', 'MC FY05 Rolling Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (141, 'MC 06 from MC 05 Year End Projection', 'MC 06 from MC 05 Year End Projection', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (142, 'FP-2011-Actual', 'FP-2011-Actual', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (143, '2010-Actual', '2010-Actual', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (144, '2004-Actual', '2004-Actual', 2);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (145, 'AUM UTILITY TEST', 'AUM UTILITY TEST', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (146, 'JS FY05 Budget', 'JS FY05 Budget', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (147, 'FP 2012 ACTUAL', 'FP 2012 ACTUAL', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (148, 'FP 2012 BUDGET SCENARIO', 'FP 2012 BUDGET SCENARIO', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (149, 'DATASETFY2006', 'DATASETFY2006', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (150, 'DATASETFY2007', 'DATASETFY2007', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (151, 'DATASETFY2008', 'DATASETFY2008', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (152, 'DATASETFY2009', 'DATASETFY2009', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (153, 'DATASETFY2010', 'DATASETFY2010', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (154, 'DATASETFY2011', 'DATASETFY2011', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (155, 'DATASETFY2012', 'DATASETFY2012', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (156, 'cbs1', 'cbs1', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (157, 'cds1', 'cds1', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (158, 'cbs2', 'cbs2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (159, 'cbs3', 'cbs3', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (160, 'cbs4', 'cbs4', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (161, 'cbs5', 'cbs5', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (162, 'cbs6', 'cbs6', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (163, 'vds2', 'vds2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (164, 'vbs2', 'vbs2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (165, 'HRSANDSALTEST', 'HRSANDSALTEST', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (166, 'FY2011-actual-test', 'FY2011-actual-test', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (167, 'FY2010-actual-test', 'FY2010-actual-test', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (168, 'FY2010-TEST', 'FY2010-TEST', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (169, 'gbs1', 'gbs1', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (170, 'MB09 SALARY Before', 'MB09 SALARY Before', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (171, 'MB FY09 Before - 2', 'MB FY09 Before - 2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (172, 'MB F09 Projected BEFORE', 'MB F09 Projected BEFORE', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (173, 'MB FY09 NEW Salary', 'MB FY09 NEW Salary', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (174, 'MB FY09 NEW Salary Copy 1', 'MB FY09 NEW Salary Copy 1', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (175, 'MB FY09 NEW Salary Copy 2', 'MB FY09 NEW Salary Copy 2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (176, 'MB FY09 NEW Salary with Salary', 'MB FY09 NEW Salary with Salary', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (177, 'MB FY09 NEW Salary with Salary  2', 'MB FY09 NEW Salary with Salary  2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (178, 'MB FY09 Update Salary Copy 1', 'MB FY09 Update Salary Copy 1', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (179, 'MB FY09 Update Salary Copy 2', 'MB FY09 Update Salary Copy 2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (180, 'MB FY09 Projected - Copy 1', 'MB FY09 Projected - Copy 1', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (181, 'MB FY09 Projected - Copy 2', 'MB FY09 Projected - Copy 2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (182, 'MB FY09 NEW Salary Copy 22', 'MB FY09 NEW Salary Copy 22', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (183, 'MB FY09 NEW Salary w data c11', 'MB FY09 NEW Salary w data c11', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (184, 'MB FY09 New Salary ND 3', 'MB FY09 New Salary ND 3', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (185, 'MB FY09 New Salary ND 4', 'MB FY09 New Salary ND 4', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (186, 'MB FY09 New Salary ND 5', 'MB FY09 New Salary ND 5', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (187, 'MB FY09 New Salary ND 6', 'MB FY09 New Salary ND 6', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (188, 'MB Fy09 Projected Copy 3', 'MB Fy09 Projected Copy 3', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (189, 'MB FY09 New Salary ND 7', 'MB FY09 New Salary ND 7', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (190, 'MB FY09 New Salary ND 8', 'MB FY09 New Salary ND 8', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (191, 'MB FY09 New Salary ND 9', 'MB FY09 New Salary ND 9', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (192, 'TB2010ACT', 'TB2010ACT', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (193, 'TB2011ACT', 'TB2011ACT', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (194, 'TB2012ACT', 'TB2012ACT', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (195, 'MB FY09 PT Dist 3512', 'MB FY09 PT Dist 3512', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (196, 'MB FY09 PT Disrt Sc 2', 'MB FY09 PT Disrt Sc 2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (197, 'MB FY09 PT Dist Test 3', 'MB FY09 PT Dist Test 3', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (198, 'MB FY09 PT Dist Test 4', 'MB FY09 PT Dist Test 4', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (199, 'MB FY09 PTD Test 4 Copy', 'MB FY09 PTD Test 4 Copy', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (200, 'MB FY09 PT Distr T2 AFTer', 'MB FY09 PT Distr T2 AFTer', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (201, 'MB NEW PT Distr', 'MB NEW PT Distr', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (202, 'MBFY09 NEW PT - 2', 'MBFY09 NEW PT - 2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (203, 'MB 2009 -4', 'MB 2009 -4', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (204, 'MBFY07 Projected', 'MBFY07 Projected', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (205, 'BC FY2010 Budget', 'BC FY2010 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (206, 'BVBS1', 'BVBS1', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (207, 'BVBS2', 'BVBS2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (208, 'EDS1', 'EDS1', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (209, 'EBS1', 'EBS1', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (210, 'EBS2', 'EBS2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (211, 'EBS5', 'EBS5', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (212, 'MB FY09 Employee Budget Scenario', 'MB FY09 Employee Budget Scenario', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (213, 'DR ROLL UP BUDGET', 'DR ROLL UP BUDGET', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (214, 'DS-FY2014', 'DS-FY2014', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (215, 'FY05 Flexed', 'FY05 Flexed', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (216, 'MB FY07', 'MB FY07', 2);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (217, 'FY08 Act/Proj', 'FY08 Act/Proj', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (218, 'FY06 Actual/Projection', 'FY06 Actual/Projection', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (219, 'MC - 07 Budget', 'MC - 07 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (220, 'MC Apr07-Mar08 Budget', 'MC Apr07-Mar08 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (221, 'MC 07 Budget - With Revenue', 'MC 07 Budget - With Revenue', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (222, 'FY07 Actual', 'FY07 Actual', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (223, 'FZ FY07 Copy - Target', 'FZ FY07 Copy - Target', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (224, 'FZ FY07 Copy2 - Target', 'FZ FY07 Copy2 - Target', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (225, 'FZ Data Set 2', 'FZ Data Set 2', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (226, 'MB FY08 Budget', 'MB FY08 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (227, 'MB FY08 Actual', 'MB FY08 Actual', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (228, 'MB FY07 APR', 'MB FY07 APR', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (229, 'MB FY09', 'MB FY09', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (230, 'Proxy Server Error Test', 'Proxy Server Error Test', 2);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (231, 'MC 05 - Year End Projection', 'MC 05 - Year End Projection', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (232, 'FY08 Budget Demo', 'FY08 Budget Demo', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (233, '2008 PRA TEST', '2008 PRA TEST', 9);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (234, 'MB FY07 Actual', 'MB FY07 Actual', 1);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (235, 'DM FY03 Actual', 'DM FY03 Actual', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (236, 'MC 06 Budget from MB FY05 Projected', 'MC 06 Budget from MB FY05 Projected', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (237, 'MBFY07 Actual', 'MBFY07 Actual', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (238, 'CB FY05 Budget', 'CB FY05 Budget', 0);
insert into STAFFING_DATA_SCENARIO (objectid, description, timeperiodname, lockversion)
values (300, 'Staffing Data Scenario Test', 'FY06', 0);
prompt 140 records loaded

set feedback on
set define on
prompt Done
