prompt PL/SQL Developer Export Tables for user QA@DEVCURR
prompt Created by ss89222 on Wednesday, April 22, 2020
set feedback off
set define off

prompt Dropping TIMEPERIOD2...
drop table TIMEPERIOD2 cascade constraints;
prompt Creating TIMEPERIOD2...
create table TIMEPERIOD2
(
  objectid    NUMBER(10),
  name        VARCHAR2(40) not null,
  enddate     DATE,
  startdate   DATE,
  endtime     DATE,
  lockversion NUMBER(10) default 1 not null,
  starttime   DATE
)
;
alter table TIMEPERIOD2
  add constraint PK_TIMEPERD primary key (NAME);
alter table TIMEPERIOD2
  add constraint UNQ_TIMEPERD unique (OBJECTID);
alter table TIMEPERIOD2
  add constraint NN_TIMEPERD_ENDDATE
  check ("ENDDATE" IS NOT NULL);
alter table TIMEPERIOD2
  add constraint NN_TIMEPERD_OBJECTID
  check ("OBJECTID" IS NOT NULL);
alter table TIMEPERIOD2
  add constraint NN_TIMEPERD_STARTDATE
  check ("STARTDATE" IS NOT NULL);

prompt Loading TIMEPERIOD2...
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (4, 'FY01', to_date('31-03-2001', 'dd-mm-yyyy'), to_date('01-04-2000', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (5, 'FY02', to_date('31-03-2002', 'dd-mm-yyyy'), to_date('01-04-2001', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (6, 'FY03', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (7, 'FY04', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (8, 'FY05', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (28, 'FY06', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (48, 'FY07', to_date('31-03-2007', 'dd-mm-yyyy'), to_date('01-04-2006', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (187, 'FY07 Actual Ak', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (185, 'FY08 Budget Ak', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (184, 'FY08 Actual Ak', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (118, 'MB FY07 CPY TST', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (119, 'A DF06 Both BC', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (120, 'MB FY08 Act APR', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (121, 'FY02 Actual', to_date('31-03-2002', 'dd-mm-yyyy'), to_date('01-04-2001', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (122, 'FY08 Act/Proj', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (123, 'FY06 Actual', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (124, 'EA Test', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (125, 'DM FY03 Actual', to_date('31-12-2003', 'dd-mm-yyyy'), to_date('01-01-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (126, 'FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (127, 'A1 DF06 Just B', to_date('31-12-2000', 'dd-mm-yyyy'), to_date('01-01-2000', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (128, 'MB FY07 Actual', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (129, 'FY05 Act Recla', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (130, 'DF06 A Rec Tst', to_date('31-12-2006', 'dd-mm-yyyy'), to_date('01-01-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (131, 'Flexed', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (132, 'A1 DF06 Just C', to_date('31-12-2006', 'dd-mm-yyyy'), to_date('01-01-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (133, 'FZ Data Set 2', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (134, 'DF06 Act Tst', to_date('31-12-2006', 'dd-mm-yyyy'), to_date('01-01-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (135, 'FY03 Actual', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (136, 'FY04 Actual', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (137, 'DM FY02 Actual', to_date('31-12-2002', 'dd-mm-yyyy'), to_date('01-01-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (138, 'DF06 AR ER Onl', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (139, 'MBFY07 Actual', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (140, 'FY07 Actual', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (141, 'MB FY08 Actual', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (143, 'MBFY07TEST-2', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (264, 'FTFY02 ACT', to_date('31-03-2002', 'dd-mm-yyyy'), to_date('01-04-2001', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (204, 'test item-2', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (203, 'TEST item', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (223, 'TESTING', to_date('31-07-2009', 'dd-mm-yyyy'), to_date('01-08-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (224, 'TEST01', to_date('30-04-2010', 'dd-mm-yyyy'), to_date('01-05-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (263, 'FTFY07', to_date('31-03-2007', 'dd-mm-yyyy'), to_date('01-04-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (323, 'FPDATASET1', to_date('31-01-2010', 'dd-mm-yyyy'), to_date('01-02-2009', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (324, '520FY03', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (363, 'MB FY09 Data Set', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (303, 'TESTITEM', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (343, 'APR06TEST', to_date('31-03-2007', 'dd-mm-yyyy'), to_date('01-04-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (443, 'FP2007ACTUAL', to_date('31-03-2007', 'dd-mm-yyyy'), to_date('01-04-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (423, 'FP 2008 - ACTUAL', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (663, 'FY05 Actual HB', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (683, 'FP2011ACTUAL', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (903, 'AUM UTILITY TEST', to_date('30-09-2009', 'dd-mm-yyyy'), to_date('01-10-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1743, 'FY2010-TEST', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1823, 'pds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1824, 'pds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2103, 'hds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1943, 'mds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2123, 'hds3', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (524, 'FP 2008 BUDGET', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (525, 'FP 2009 BUDGET', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1223, 'ds3', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (527, 'FP 2007 BUDGET', to_date('31-03-2007', 'dd-mm-yyyy'), to_date('01-04-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (843, 'FY05 Actual MC2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1563, 'tds4', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2385, 'DL CY08 Budget', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (984, 'TestDataSet7-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1344, 'ds15', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1345, 'ds14', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1506, 'rds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1507, 'rds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1663, 'ASESC725DS1', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2424, 'qds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2447, '2013-ACTUAL', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2448, '2014-ACTUAL', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2464, 'BVDS1', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2484, '2011AFDACTUAL', to_date('31-12-2011', 'dd-mm-yyyy'), to_date('01-01-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2485, '2011AFDBUDGET', to_date('31-12-2011', 'dd-mm-yyyy'), to_date('01-01-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2504, 'BVDSFY2013', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2509, 'EDS1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2510, 'EDS2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2544, 'EDS5', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (823, 'JZFY0910GL', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (824, 'JZFY0910GLRC', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1083, 'MB FY08 Data Set', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1203, 'TESTDATASET', to_date('31-12-2010', 'dd-mm-yyyy'), to_date('01-01-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1307, 'ds11', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1503, 'sds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1504, 'cds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1526, 'rds5', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2063, 'ASESC804', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1509, 'rds4', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2143, 'hds4', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2306, 'SMOKEGLFY08ACT', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2404, 'DL CY08 Reclass', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1123, 'GLDATASCENARIO', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1403, '2011GLTEST', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1423, 'ASESC572 Test', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1383, '2010GLTEST', to_date('30-09-2010', 'dd-mm-yyyy'), to_date('01-10-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1843, 'gds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1963, 'etds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1043, 'TestDataSet13-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1583, 'vds1', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1603, 'vds2', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2264, 'wds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1683, 'JVT test GL Data_Set name', to_date('30-06-2011', 'dd-mm-yyyy'), to_date('01-07-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2224, 'lds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (643, 'FY05 Actual MC', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1004, 'TestDataSet9-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1194, 'DATASETFY2007', to_date('31-03-2007', 'dd-mm-yyyy'), to_date('01-04-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1195, 'DATASETFY2008', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1198, 'DATASETFY2011', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1243, 'ds4', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1543, 'tds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1544, 'tds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1608, 'vds4', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1723, 'FY2011-actual-test', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2083, 'hds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2344, 'JSRECLASS04', to_date('31-12-2004', 'dd-mm-yyyy'), to_date('01-01-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2444, '2001-ACTUAL', to_date('31-03-2001', 'dd-mm-yyyy'), to_date('01-04-2000', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2445, '2000-ACTUAL', to_date('31-03-2000', 'dd-mm-yyyy'), to_date('01-04-1999', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2446, '1999-ACTUAL', to_date('31-03-1999', 'dd-mm-yyyy'), to_date('01-04-1998', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (923, 'TestDataSet1-Fy05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (924, 'TestDataSet2-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1323, 'ds13', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1524, 'ASESC572', to_date('31-12-2010', 'dd-mm-yyyy'), to_date('01-01-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1525, 'ASESC572TB', to_date('31-12-2010', 'dd-mm-yyyy'), to_date('01-01-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2003, 'TINESHA2', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (583, 'FP2006ACTUAL', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (584, 'FP 2006 BUDGET', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (703, 'MC FY05 BudToAct Copy', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (783, 'AT FY05 Budget Data Set Simple Copy', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1023, 'DM FY05 Actual2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1103, 'FP 2012 ACTUAL', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1163, 'TestDataSet16-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1200, 'ds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1304, 'ds8', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1305, 'ds9', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1508, 'rds3', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1529, 'rds6', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1763, 'sample+_)(*&^%$#@!-', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2203, 'zds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2384, 'DL CY08 Actual', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2564, 'DS-FY2014', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (543, 'FY05 ACTUAL Sum', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (563, 'fy05 actual empty', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (603, 'FP 2010 ACTUAL', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1063, 'TestDataSet14-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1183, 'FP 2002 ACTUAL', to_date('31-03-2002', 'dd-mm-yyyy'), to_date('01-04-2001', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1184, 'FP 2003 ACTUAL', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1185, 'FP 2004 ACTUAL', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1186, 'FP 2005 ACTUAL', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1197, 'DATASETFY2010', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1193, 'DATASETFY2006', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1196, 'DATASETFY2009', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1199, 'DATASETFY2012', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2164, 'jds4', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1363, 'ds16', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1463, 'JSFY2005', to_date('31-12-2005', 'dd-mm-yyyy'), to_date('01-01-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2511, 'EDS3', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (943, 'TestDataSet5-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1303, 'ds7', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1724, 'FY2010-actual-test', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2183, 'kds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2326, 'TB2012ACT', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2305, 'SMOKEGLFY08RECL', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (723, 'FP-2011-Actual', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (863, '2010-Actual-Data Set', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1143, 'TestDataSet15-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1283, 'ds5', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1284, 'ds6', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1783, 'uds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1784, 'uds3', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1785, 'uds4', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1803, 'uds5', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1804, 'uds6', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1869, 'ASESC* 783 PP#', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1870, 'ASESC-783 M!', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2223, 'lds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2324, 'TB2010ACT', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2325, 'TB2011ACT', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2364, 'JS2RECLASS04', to_date('31-12-2004', 'dd-mm-yyyy'), to_date('01-01-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (483, 'FY08 Actuals - Diane', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (503, 'DM FY04 Actual', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1192, 'DATASETFY2005', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1190, '2005 ACTUAL', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1191, 'DATASETFY2004', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1523, 'TBTest', to_date('31-08-2010', 'dd-mm-yyyy'), to_date('01-08-2010', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1530, 'rds7', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1607, 'vds3-prj', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2246, 'ASESC831', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2247, 'ASESC831RC', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2524, 'EDS4', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (523, 'FP 2009 - ACTUAL', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (803, 'MC FY04 Svc Line Test', to_date('31-12-2004', 'dd-mm-yyyy'), to_date('01-01-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (925, 'TestDataSet3-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (926, 'TestDataSet4-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1204, 'ds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1263, 'JKDATASETFY05', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1483, 'cds1', to_date('31-12-2011', 'dd-mm-yyyy'), to_date('01-01-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1505, 'sds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1527, 'ASESC572tst2', to_date('31-01-2010', 'dd-mm-yyyy'), to_date('01-02-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2023, 'jds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2024, 'jds2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2043, 'TINESHA3', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (623, 'FP 2010 BUDGET', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (963, 'TestDataSet6-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (983, 'DM FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1024, 'TestDataSet10-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1025, 'TestDataSet11-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1026, 'TestDataSet12-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1443, 'ds17', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1444, 'ds18', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1623, 'HRSANDSALTEST', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1703, 'uds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1883, 'ASESC781DS', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1923, 'tbrowntest', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2163, 'jds3', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (743, '2010-Actual', to_date('31-03-2010', 'dd-mm-yyyy'), to_date('01-04-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (763, '2004-Actual', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1306, 'ds10', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (784, 'AT FY05 Budget Data Set Overlap Copy', to_date('30-06-2005', 'dd-mm-yyyy'), to_date('01-07-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1003, 'TestDataSet8-FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1308, 'ds12', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1643, 'ASESC725DS', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1903, 'TINESHA', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (1983, 'nds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2243, 'ASESC804B', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2284, 'xyzds1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2651, '150Source', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2652, '133Result', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2653, '150Result', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2624, 'AP02RCL', to_date('31-03-2002', 'dd-mm-yyyy'), to_date('01-04-2001', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2584, 'MB FY05 Actual', to_date('28-02-2005', 'dd-mm-yyyy'), to_date('01-03-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2650, '133Source', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2644, 'ASESC-133 Entity 133', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2645, 'ASESC-133 Entity 150', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2604, 'SPACETEST', to_date('31-12-2006', 'dd-mm-yyyy'), to_date('01-01-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2605, 'MBTEST', to_date('31-08-2010', 'dd-mm-yyyy'), to_date('01-08-2010', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2768, 'asds3', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2769, 'asds3reclass', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2928, 'a234567890123456789012345678901234567890', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2944, 'b234567890123456789012345678901234567890', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2904, 'gsds5', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2844, 'gsds4Reclass', to_date('31-07-2014', 'dd-mm-yyyy'), to_date('01-08-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3224, 'YATPER1', to_date('20-04-2012', 'dd-mm-yyyy'), to_date('20-04-2012', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2964, 'DR FY03 Actual', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2965, 'DR FY03 Reclass', to_date('31-03-2003', 'dd-mm-yyyy'), to_date('01-04-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2966, 'DR FY04 Actual', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2967, 'DR FY04 Reclass', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2968, 'DR FY05 Actual', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2969, 'DR FY05 Reclass', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2970, 'DR FY06 Actual', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2971, 'DR FY06 Reclass', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2972, 'DR FY07 Actual', to_date('31-03-2007', 'dd-mm-yyyy'), to_date('01-04-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2973, 'DR FY07 Reclass', to_date('31-03-2007', 'dd-mm-yyyy'), to_date('01-04-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3104, 'x2014', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3204, 'YADATASET2', to_date('31-07-2013', 'dd-mm-yyyy'), to_date('01-08-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2824, 'gsds4', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3144, 'rrds1', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3145, 'rrds2', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3264, '2013-CALENDAR', to_date('31-12-2013', 'dd-mm-yyyy'), to_date('01-01-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3364, 'jksecds1', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3344, 'tst', to_date('31-07-2014', 'dd-mm-yyyy'), to_date('01-09-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3084, 'xds3', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2884, 'JKDataSet3ForCost-82', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3124, 'FY13', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2684, 'gsds1reclass', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2724, 'gsds2reclass', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2744, 'gsds3', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2745, 'gsds3reclass', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2764, 'asds1', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2765, 'asds1reclass', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2766, 'asds2', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2767, 'asds2reclass', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2784, 'xds1', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2785, 'xds1reclass', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2786, 'xds1-reclass2', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2787, 'xds2', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2788, 'xds2reclass', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2804, 'jkds1', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2805, 'jkds2', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3324, 'jkds3', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3244, 'F16TP1', to_date('30-04-2010', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2864, 'JKDataSet1ForCost-82', to_date('31-03-2013', 'dd-mm-yyyy'), to_date('01-04-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2865, 'JKDataSet2ForCost-82', to_date('30-04-2013', 'dd-mm-yyyy'), to_date('01-05-2012', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2665, 'gsds1', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 1, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2704, 'gsds2', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3284, 'FY04 Earned', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3285, 'vbs2', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3286, 'MB FY09 NEW Salary Copy 22', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3287, 'MB FY09 New Salary ND 3', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3288, 'MB FY09 New Salary ND 8', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3289, 'MB FY09 New Salary ND 9', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3290, 'MB FY09 PT Disrt Sc 2', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3291, 'MB FY09 PT Dist Test 3', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3292, 'MB FY09 PT Dist Test 4', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3293, 'MB FY09 PTD Test 4 Copy', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3294, 'MB FY09 PT Distr T2 AFTer', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3295, 'MB NEW PT Distr', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3296, 'MBFY09 NEW PT - 2', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3297, 'MB 2009 -4', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3298, 'BC FY2010 Budget', to_date('31-12-2010', 'dd-mm-yyyy'), to_date('01-01-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3299, 'FY06 Actual/Projection', to_date('31-12-2006', 'dd-mm-yyyy'), to_date('01-01-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3300, 'MC Apr07-Mar08 Budget', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3301, 'FZ FY07 Copy - Target', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3302, 'FZ FY07 Copy2 - Target', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3303, 'Proxy Server Error Test', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2984, 'FY07 Budget', to_date('31-03-2007', 'dd-mm-yyyy'), to_date('01-04-2006', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2985, 'FY06 Projected', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2986, 'FY06 Budget', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2987, 'FY05 Budget', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2988, 'CORP - FY06 Budget', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2989, 'MBFY07TEST - 2', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2990, 'FY08 Flexed', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2991, 'MC FY04 Budget', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2992, 'MC Jul03-Jun04 Copy from MC FY04 Budget', to_date('30-06-2004', 'dd-mm-yyyy'), to_date('01-07-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2993, 'FY08 Projection Ak', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2994, 'FY09 Budget Ak', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2995, 'FY09 Budget Ak - First Pass', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2996, 'MB 2009 Budget Scenario', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2997, 'MC FY05 Budget', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2998, 'MC FY0405 Budget', to_date('30-06-2004', 'dd-mm-yyyy'), to_date('01-07-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2999, 'MC FY04 Budget Copy', to_date('31-03-2004', 'dd-mm-yyyy'), to_date('01-04-2003', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3000, 'IG FY2009 Budget', to_date('28-02-2010', 'dd-mm-yyyy'), to_date('01-03-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3001, 'MB 2009 Budget', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3002, 'FP 2009 BUDGET SCENARIO', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3003, 'MB FY08 Projected', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3004, 'FP 2006 BUDGET SCENARIO-PROJECTED', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3005, 'FY05 Budget MC', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3006, 'MC FY05 Budget Copy', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3007, 'MC FY06 Budget Copy', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3008, 'MC FY05 Rolling Budget', to_date('30-06-2005', 'dd-mm-yyyy'), to_date('01-07-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3009, 'MC 06 from MC 05 Year End Projection', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3010, 'AT FY05 Budget', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3011, 'AT FY05 Budget Overlap', to_date('30-06-2005', 'dd-mm-yyyy'), to_date('01-07-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3012, 'JS FY05 Budget', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3013, 'FP 2012 BUDGET SCENARIO', to_date('31-03-2012', 'dd-mm-yyyy'), to_date('01-04-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3014, 'cbs1', to_date('31-12-2011', 'dd-mm-yyyy'), to_date('01-01-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3015, 'cbs2', to_date('31-12-2011', 'dd-mm-yyyy'), to_date('01-01-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3016, 'cbs3', to_date('31-12-2011', 'dd-mm-yyyy'), to_date('01-01-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3017, 'cbs4', to_date('31-12-2011', 'dd-mm-yyyy'), to_date('01-01-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3018, 'cbs5', to_date('31-12-2011', 'dd-mm-yyyy'), to_date('01-01-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3019, 'cbs6', to_date('31-12-2011', 'dd-mm-yyyy'), to_date('01-01-2011', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3020, 'vbs1', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3021, 'vbs3', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3022, 'vbs4', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3023, 'gbs1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3024, 'MB09 SALARY Before', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3025, 'MB FY09 Before - 2', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3026, 'zbs1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3027, 'MB F09 Projected BEFORE', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3028, 'MB FY09 NEW Salary', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3029, 'MB FY09 NEW Salary Copy 1', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3030, 'MB FY09 NEW Salary Copy 2', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3031, 'MB FY09 NEW Salary with Salary', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3032, 'MB FY09 NEW Salary with Salary  2', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3033, 'MB FY09 Update Salary Copy 1', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3034, 'MB FY09 Update Salary Copy 2', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3035, 'MB FY09 Projected - Copy 1', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3036, 'MB FY09 Projected - Copy 2', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3037, 'MB FY09 NEW Salary w data c11', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3038, 'MB FY09 New Salary ND 4', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3039, 'MB FY09 New Salary ND 5', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3040, 'MB FY09 New Salary ND 6', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3041, 'MB Fy09 Projected Copy 3', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3042, 'MB FY09 New Salary ND 7', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3043, 'MB FY09 PT Dist 3512', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3044, 'MBFY07 Projected', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3045, 'BVBS1', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3046, 'BVBS2', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3047, 'EBS1', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3048, 'EBS2', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3049, 'EBS3', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3050, 'EBS5', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3051, 'MB FY09 Employee Budget Scenario', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3052, 'DR ROLL UP BUDGET', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3053, 'FY05 Flexed', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3054, 'MB FY07', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3055, 'MC - 07 Budget', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3056, 'MC - 07 Budget - 150 only', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3057, 'MC 07 Budget - With Revenue', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3058, 'MC - 07 Budget - All Entities', to_date('31-12-2007', 'dd-mm-yyyy'), to_date('01-01-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3059, 'DM FY02 Budget', to_date('31-03-2002', 'dd-mm-yyyy'), to_date('01-04-2001', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3060, 'MB FY08 Budget', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3061, 'MB FY07 APR', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3062, 'MB FY09', to_date('31-12-2009', 'dd-mm-yyyy'), to_date('01-01-2009', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3063, 'MC 05 - Year End Projection', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3064, 'FY09 Budget for Demo', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3065, 'FY08 Budget Demo', to_date('31-03-2008', 'dd-mm-yyyy'), to_date('01-04-2007', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3066, '2008 PRA TEST', to_date('31-12-2003', 'dd-mm-yyyy'), to_date('01-01-2002', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3067, 'MC 06 Budget from MB FY05 Projected', to_date('31-03-2006', 'dd-mm-yyyy'), to_date('01-04-2005', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3068, 'CB FY05 Budget', to_date('31-03-2005', 'dd-mm-yyyy'), to_date('01-04-2004', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3184, 'YADATASET1', to_date('28-02-2014', 'dd-mm-yyyy'), to_date('01-03-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2924, '1234567890123456789012345678901234567890', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2925, '0123456789012345678901234567890123456789', to_date('31-03-2009', 'dd-mm-yyyy'), to_date('01-04-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2926, '&23q2', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (2927, 'c', to_date('31-12-2008', 'dd-mm-yyyy'), to_date('01-01-2008', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3444, 'XPFY2011', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3464, 'XPFY2014', to_date('31-03-2014', 'dd-mm-yyyy'), to_date('01-04-2013', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3524, 'f234567890123456789012345678901234567890', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3504, 'Test483', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3484, 'FY2015', to_date('31-03-2015', 'dd-mm-yyyy'), to_date('01-04-2014', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3544, 'feb6timeperiod', to_date('31-12-2015', 'dd-mm-yyyy'), to_date('01-01-2015', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3545, 'feb6timeperiod2', to_date('31-03-2016', 'dd-mm-yyyy'), to_date('01-04-2015', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3564, 'TBFY15', to_date('31-03-2016', 'dd-mm-yyyy'), to_date('01-04-2015', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3604, 'ORFY2015', to_date('31-03-2015', 'dd-mm-yyyy'), to_date('01-04-2014', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3624, 'FY15', to_date('31-03-2015', 'dd-mm-yyyy'), to_date('01-04-2014', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3584, 'dss1479', to_date('30-04-2016', 'dd-mm-yyyy'), to_date('01-05-2015', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3644, 'CY2014ML', to_date('31-12-2014', 'dd-mm-yyyy'), to_date('01-01-2014', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3704, 'FY16 Actual', to_date('31-03-2016', 'dd-mm-yyyy'), to_date('01-04-2015', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3664, '**FY16', to_date('28-02-2017', 'dd-mm-yyyy'), to_date('01-03-2016', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3684, 'TB16', to_date('31-12-2016', 'dd-mm-yyyy'), to_date('01-01-2016', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3744, 'TB17', to_date('31-03-2017', 'dd-mm-yyyy'), to_date('01-04-2016', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (5504, 'JSFY2017', to_date('30-09-2017', 'dd-mm-yyyy'), to_date('01-10-2016', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (9444, 'ASESC2908', to_date('31-12-2016', 'dd-mm-yyyy'), to_date('01-01-2016', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (9445, 'ASESC2908 No Time', to_date('31-12-2016', 'dd-mm-yyyy'), to_date('01-01-2016', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (3724, 'PJFY16', to_date('31-12-2016', 'dd-mm-yyyy'), to_date('01-01-2016', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (33265, 'TB18', to_date('31-03-2018', 'dd-mm-yyyy'), to_date('01-04-2017', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (33305, 'TB19', to_date('31-03-2019', 'dd-mm-yyyy'), to_date('01-04-2018', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (33245, 'Apr 1992-Mar 1993', to_date('31-03-1993', 'dd-mm-yyyy'), to_date('01-04-1992', 'dd-mm-yyyy'), null, 0, null);
insert into TIMEPERIOD2 (objectid, name, enddate, startdate, endtime, lockversion, starttime)
values (33286, 'JK_TP_1', to_date('31-03-2011', 'dd-mm-yyyy'), to_date('01-04-2010', 'dd-mm-yyyy'), null, 1, null);
prompt 420 records loaded

set feedback on
set define on
prompt Done
