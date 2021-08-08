prompt PL/SQL Developer Export Tables for user QA@DEVCURR
prompt Created by ss89222 on Wednesday, April 22, 2020
set feedback off
set define off

prompt Dropping STATISTICMASTER2...
drop table STATISTICMASTER2 cascade constraints;
prompt Creating STATISTICMASTER2...
create table STATISTICMASTER2
(
  objectid    NUMBER(10) not null,
  type        CHAR(1),
  code        VARCHAR2(15),
  name        VARCHAR2(40),
  accthierid  NUMBER(10),
  depthierid  NUMBER(10),
  lockversion NUMBER(10) default 1 not null
)
;
create index FK_STATISTICMASTER_ACCTHIERID on STATISTICMASTER2 (ACCTHIERID);
create index FK_STATISTICMASTER_DEPTHIERID on STATISTICMASTER2 (DEPTHIERID);
create index STATISTICMASTER_TYPE on STATISTICMASTER2 (TYPE);
alter table STATISTICMASTER2
  add constraint PK_STATISTICMASTER primary key (OBJECTID);
alter table STATISTICMASTER2
  add constraint UNQ_STATISTICMASTER unique (TYPE, CODE);
alter table STATISTICMASTER2
  add constraint FK_STATISTICMASTER_ACCTHIERID foreign key (ACCTHIERID)
  references ACCOUNTHIERARCHY2 (OBJECTID);
alter table STATISTICMASTER2
  add constraint FK_STATISTICMASTER_DEPTHIERID foreign key (DEPTHIERID)
  references DEPARTMENTHIERARCHY2 (OBJECTID);
alter table STATISTICMASTER2
  add constraint NN_STATISTICMASTER_CODE
  check ("CODE" IS NOT NULL);
alter table STATISTICMASTER2
  add constraint NN_STATISTICMASTER_DEPTHIERID
  check (
            (
                TYPE IN ('B', 'D')
                AND DEPTHIERID IS NOT NULL
            )
            OR
            (
                TYPE IN ('C', 'E')
                AND DEPTHIERID IS NULL
            )
        );
alter table STATISTICMASTER2
  add constraint NN_STATISTICMASTER_NAME
  check ("NAME" IS NOT NULL);
alter table STATISTICMASTER2
  add constraint NN_STATISTICMASTER_TYPE
  check ("TYPE" IS NOT NULL);

prompt Loading STATISTICMASTER2...
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (5, 'E', 'GRPSTAT1', 'Group Statistic Master', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1, 'D', 'GLSTATS', 'General Ledger Statistics', 1, 1, 6);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2, 'B', 'ACTSTATS', 'Activity Statistics', null, 1, 5);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (3, 'C', 'ADHOCSTATS', 'Ad Hoc Statistics', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (45, 'E', 'TESTGRPSTAT', 'testing group statistic- modified name', null, null, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (65, 'E', 'GROUPMSTR', 'Group Statistic Master for v4.2', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (105, 'E', 'GROUPSTATMASTER', 'Group Statistic Master', null, null, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (85, 'E', 'FPGROUPMSTR', 'FP Group Statistic Master', null, null, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (90, 'E', 'TOBEMODIFIED', 'Modifed the name', null, null, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (86, 'D', 'V42TEST', 'V4.2 Test GL Stat Master', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (87, 'B', '42TESTACT', '4.2 Test Act Stat', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (88, 'C', '42TESTADHOC', '4.2 Test Ad Hoc', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (207, 'B', 'IMPORTEST2', 'IMPORTTEST2', null, 70061401, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (165, 'D', 'FPGLSTATMASTER', 'FP GL STATISTIC MASTER', 63, 83, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (166, 'B', 'FPACTSTATMASTER', 'FP ACTIVITY STATISTIC MASTER', null, 83, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (167, 'C', 'FPADHOCSTATMAST', 'FP AD HOC STATISTIC MASTER', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (206, 'B', 'IMPORTTEST', 'IMPORTTEST', null, 70061401, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (145, 'D', 'JHBJHB', 'JBJNM', null, 70061401, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (265, 'C', 'ASESC831ADHOC', 'ASESC-831 AD HOC', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (266, 'D', 'ASESC831GLSTAT', 'ASESC-831 GL STAT', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (305, 'D', 'DLGLSTATS', 'DLGLSTATS', 103, 163, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (125, 'C', 'JUNKSAT', 'JUNK', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (285, 'D', 'TBGLSTAT', 'TB GL STAT', 83, 143, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (245, 'D', 'IMPORT', 'ASESC-787', null, 70061401, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (185, 'D', 'NEWSTATS', 'Stat Master', 1, 103, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (328, 'D', 'STATMASTER', 'old master StatMaster', 2, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (327, 'D', '500JC', 'ASESC-133 Testing', 2, 183, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (545, 'B', 'JKACTVOLSTATS', 'JK Activity Volume Stats', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (345, 'D', 'XGLSTATMASTER', 'XGLSTATISTICMASTER', 123, 203, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (346, 'B', 'XACTSTAMASTER', 'XACTIVITYSTATISTICMASTER', null, 203, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (347, 'C', 'XADHOCSTAMASTER', 'XADHOCSTATISTICMASTER', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (605, 'B', 'XACTSTMASTER2', 'XACTSTMASTER2', null, 203, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (865, 'B', 'YAACTSTATMASTER', 'YAZDISTATISTICMASTER', null, 364, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1278, 'B', '041720140', 'test 5533-1', null, 70061400, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (365, 'B', 'DRACTSTATS', 'DR Activity Statistics', null, 243, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (366, 'D', 'DRSTATMASTER', 'DR GL Statistic Master', 163, 243, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (385, 'C', 'DRADHOCSTATS', 'DR ADHOC STATISTICS', null, null, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (825, 'B', 'BCACTSTATS', 'BC Activity Statistics', null, 363, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1112, 'C', 'ADFADF', '#', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1110, 'C', '0198401', ' ? #', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1049, 'C', 'TBADHOC3', '?$ ad hoc  > 1234567890123456789 ABCD', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1111, 'C', '1341', '* ?#', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1172, 'D', 'MBNEW09APR', 'MBNEW', 70061352, 143, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1190, 'D', 'MBNEW2', 'MBNEW2', 1, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1191, 'D', 'MBNEW3', 'MBNEW3', 2, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1271, 'B', 'RT1', 'rt1', null, 243, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1272, 'B', 'RT2', 'rt2', null, 243, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1276, 'B', 'RT3', 'rt3', null, 243, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1411, 'C', 'RLSADHOCSTATMAS', 'RLS AD HOC STAT MASTER - DM', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1410, 'B', 'RLSACTSTATMAST', 'RLS  ACT STAT MASTER - DM', null, 243, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1412, 'D', 'RLSGLSSTATMAST', 'RLS GL STAT MASTER - DM', 22, 243, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1413, 'E', 'RLSGRPSTATMAST', 'RLS GROUP STAT MASTER', null, null, 4);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1450, 'B', 'RTESTMASTER', 'r test master', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1490, 'E', 'JKGROUPMSTR', 'JK Group Statistic Master for v4.2', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1510, 'B', 'TEST0528', 'Testing', null, 726, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (705, 'D', 'WGLMASTER', 'wglmaster', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (725, 'B', 'XACTSTATMASTER3', 'xactstatmaster3', null, 203, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1150, 'D', 'MBNEW', 'mbnew', 1, 70061401, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1279, 'B', '041720142', 'test 5533-2', null, 163, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1280, 'B', 'CODE12', 'name12', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1281, 'C', 'AXADHOCSTATMAST', 'AXADHOCSTATMASTER', null, null, 3);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1370, 'B', '55TESTACT', '55testact 5615', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1511, 'E', 'NEW', 'new', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (769, 'D', 'COST658', 'COST-658', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1277, 'B', 'TEST1642014', 'test4162014', null, 363, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (888, 'B', 'TEST2', 'TEST', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (925, 'C', 'RRADHOCSTMASTER', 'RRadhoc statistic master', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (485, 'D', 'JKSTATMASTER', 'JK Statistics Master', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1025, 'E', 'MBSTAT', 'MB Statistic Master', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (745, 'D', 'COST657', 'COST-657', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (985, 'C', 'ADHOCTEST', 'Ad Hoc Test', null, null, 3);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1005, 'C', 'CLASSMIG2183', 'CLASSMIG-2183', null, null, 4);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1130, 'B', 'TBVERIFICATION', 'TB Verify', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1131, 'C', 'NEW', 'New', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1132, 'C', 'ABE', 'abe', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1530, 'B', 'JKSDF', 'erer', null, 726, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1210, 'D', 'PJTEST', 'Testing', 143, 263, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1310, 'B', 'RCLASSMIG5531', 'retest classmig-5531', null, 243, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (665, 'B', 'RRSTATMASTPERF', 'rr stat master performance test1', null, 1, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (946, 'B', '222', 'test no stat', null, 183, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1051, 'C', 'ERRORTESTING', 'Error Test', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1470, 'B', '5770ASMT1', '5770ASMT1', null, 726, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (885, 'D', 'TEST', 'test', 263, 70061401, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1090, 'C', 'CLASSMIG4343', 'Classmig-4343', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (627, 'B', 'RACTSTATMAS100', 'RACTSTATMASTER100', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (886, 'B', 'TEST', 'test', null, 323, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1192, 'B', 'RSECURITY1', 'r security test1', null, 243, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1274, 'D', 'RT1', 'rt1', 163, 243, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1331, 'D', 'R5533', 'r 5533', 1, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (905, 'D', 'BCSTATS', 'BC GL Statistic Master', 263, 363, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (906, 'C', 'BCADHOCSTAT', 'BC Adhoc Statistic Master', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1050, 'C', 'CLASSMIG3342', 'Classmig - 3342', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (405, 'D', 'YGLSTATMASTER', 'yglstatisticmaster', 124, 204, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (425, 'D', 'MEGLSTATMASTER', 'meglstatmaster', 2, 1, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (445, 'C', 'YADHOCSTAMASTER', 'yadhocstatisticmaster', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (446, 'B', 'YACTSTAMASTER', 'yactstatmaster', null, 204, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (447, 'D', 'YGLSTATMASTER2', 'yglstatmaster2', 124, 204, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1250, 'D', 'MBNEWIMPORT', 'mbnewimport', 1, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (465, 'D', 'WWTEST1', 'william test 1', 123, 143, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (685, 'D', 'JKSTATMASTER3', 'JKSTATMASTER3', 183, 263, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (785, 'B', 'RRASM', 'RR ACT STAT MASTER', null, 283, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1431, 'C', 'APR29ADHOCMASTE', 'april29adhocstatmaster', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1353, 'B', 'RRACTSTATS', 'rractstats', null, 243, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1045, 'C', 'TBADHOCSTAT', 'Ad Hoc Test', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1391, 'B', '55TESTACTC', 'Name', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1392, 'B', 'STATTSMASTER', 'Test', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1430, 'C', 'JKSECOHSTATMSTR', 'JK Security OH Stat Master', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1230, 'B', 'RMARSOUMASTER', 'r marina south master', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1550, 'E', 'JKSECGROUPMSTR', 'JK Secure Group Statistic Master for v8', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (505, 'D', 'GLPERFMASTER', 'GLPERFMASTER', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (585, 'B', 'RRACTSTATMAST', 'RRACTSTATMAST', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (526, 'D', 'GLPERFCALCMASTE', 'GLPERFCALCMASTER', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (565, 'D', 'STATGLMASTER', 'statglmaster', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (586, 'D', 'RRGLSTATMASTER', 'RRGLSTATMASTER', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (926, 'B', 'JKOHAVSTATS', 'JKOHSTATS', null, 223, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (927, 'D', 'JKOHGLSTATS', 'JKOHCHGST', 143, 223, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (928, 'C', 'JKOHADHOCSTAT', 'JKOHADHOCSTAT', null, null, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1291, 'D', 'AXGLSTATMASTER', 'AXGLSTATMASTER', 423, 726, 9);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (965, 'B', 'MB', 'mb', null, 183, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1292, 'C', 'XMASTERT1ADHOC', 'Xmaster ADHOC', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1290, 'B', 'AXACTSTATMASTER', 'AXACTSTATMASTER', null, 726, 13);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (765, 'B', 'RPTEST1', 'rr performance test1', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (766, 'D', 'RRGLMASTER', 'RR GL STAT MASTER', 203, 283, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (767, 'B', 'RRSTATMASTPERF2', 'rr stat master performance test2', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (768, 'B', 'RRSTATMASTPERF3', 'rr stat master performance test3', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (805, 'D', 'JKSTATMUS16779', 'JKSTATMASTERUS16779', 183, 263, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1352, 'B', '60TESTACT', 'test export import multifile', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (566, 'B', 'JKXXACTVOL', 'JK XXX ACTVOL', null, 223, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (645, 'D', 'JKSTATMASTER2', 'JK Statistics Master 2', 143, 223, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (845, 'B', 'JKUS16870AVSTAT', 'JK US1870 AV STAT MASTER', null, 223, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1610, 'B', 'JKAVSTATMASTQTY', 'JK Activity Stat Master for Qty', null, 223, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1591, 'C', 'XPADHOCSTATMAST', 'XPADHOCSTATISTICMASTER', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1570, 'B', 'XPACTSTATMASTER', 'XPACTSTATMASTER', null, 203, 11);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1590, 'D', 'XPGLSTATMASTER', 'XPGLSTATMASTER', 123, 203, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1741, 'B', 'ASESC1979AVSTAT', 'ASESC-1979 Actvy Stat Master', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1630, 'B', '1833ACTSTATS', 'ASESC-1833 Activity Statistics', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1670, 'B', '1833ACTSTAT1', '1833 Act Stat 1', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1802, 'B', 'ASESC1979AVSFIX', 'ASESC-1979 Actvty Stat Master Fix', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1803, 'C', 'ASESC1979AHSTAT', 'ASESC-1979 Adhoc Stat Master', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1805, 'D', 'ASESC1979GLSTAT', 'ASESC-1979 GL STAT', 143, 223, 3);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1650, 'C', '1833ADHOC', 'ASESC-1833 - Ad Hoc', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1690, 'D', '1833GLSTATS', '1833 GL Statistics', 1, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1855, 'B', 'TESTIN124', 'delete me later', null, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1856, 'D', 'TESTGS', 'TESTGS', 663, 1146, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1870, 'D', 'TEST1581', 'Testing', 629, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1910, 'D', 'JULY23GLSTATMAS', 'new gl stat master', 629, 1146, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1850, 'D', 'ORGLSTATMASTER', 'or gl statistic master', 629, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1851, 'D', 'DELETEME', 'test', 629, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1970, 'B', 'JULY29ACTSTATMA', 'july29actstatmaster', null, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1971, 'C', 'JULY29ADHSTATMA', 'july 29 adhoc stat master-modified', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1972, 'E', 'JULY29GRPSTATMA', 'july29groupstatmaster', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1973, 'D', 'JULY29GLSTATMAS', 'july29 gl stat master-modified', 629, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1990, 'D', 'XGLSTATMDELETE', 'xglstatmaster delete', 123, 203, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1954, 'B', '0TEST1619', 'Testing-modified', null, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1955, 'D', 'TEST16191', 'Testing', 633, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1957, 'C', 'TEST16191', 'Testing', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1958, 'E', 'TEST16191', 'Testing', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1854, 'C', 'NEWADHOCSTATMAS', 'delete me later', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1871, 'B', 'ORACTSTATMASTER', 'or act stat master', null, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1890, 'D', 'JULY17GLSTATMAS', 'new gl stat master july 17', 629, 1146, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1810, 'B', '2015STATISTICS', '2015 Statistics', null, 906, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1811, 'C', 'ASESC2266', 'ASESC2266', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1813, 'D', 'ASESC2266A', 'ASESC2266A', 1, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1814, 'C', 'ASESC2266A', 'ASESC2266A', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1815, 'C', 'ASESC2266B', 'ASESC2266B', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1816, 'B', 'ASESC2266B', 'ASESC2266B', null, 1, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1817, 'D', 'ASESC2266B', 'ASESC2266B', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1853, 'C', 'ORADHOCSTATMAST', 'or adhoc statistic master', null, null, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1953, 'D', 'TESTGL1619', 'Testing', 633, 1146, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1852, 'D', 'TESTING123', 'test', 629, 1146, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1952, 'B', 'TESTACT1', 'test', null, 1146, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1812, 'D', 'ASESC2266', 'ASESC-2266', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1956, 'B', 'TEST16191', 'Testing', null, 1146, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1959, 'B', 'TEST16192', 'Testing AADMIN', null, 726, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1960, 'C', 'TEST16192', 'Testing AADMIN', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1961, 'D', 'TEST16192', 'Testing AADMIN', 70061351, 726, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (1962, 'E', 'TEST16192', 'Testing AADMIN', null, null, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2010, 'D', '1234DERRICK', '1234DERRICK', 70061351, 1106, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2070, 'D', 'GLSTATST', 'Tinesha''s Stats', 1, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2032, 'D', 'DMGLASESC2579', 'DM GL Stat Mtr for ASESC-2579', 1, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2090, 'B', 'ACTSTATS2518', 'ASESC-2518 Act Stats', null, 1, 4);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2110, 'D', 'GLSTATS2518', 'ASESC-2518 GL Stats', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2031, 'C', 'DMADASESC2579', 'DM Ad Hoc Stat Mtr for ASESC-2579', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2030, 'B', 'DMACTASESC2579', 'DM Act Stat Mtr for ASESC-2579', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2170, 'B', 'DS2397ACTSTATS', 'DSS-2397 Act Stat Test', null, 1, 4);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2190, 'B', 'ACTSTATS2518FZ', 'Copy of ACTSTATS2518 to test DSS-2397', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2230, 'C', 'ACTADHOCSTATS', 'Actual Ad Hoc Stats', null, null, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2231, 'D', 'ACTGLSTATS', 'Actual Gl Stat', 1, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2232, 'B', 'ACTACTSTATS', 'Actual Activity Stats', null, 1, 1);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2172, 'B', 'DMTEST', 'diane test aug 16 2016', null, 1, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2210, 'E', 'FZGROUP', 'FZ Group Master', null, null, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (6350, 'B', '0TESTPJ', 'Testing', null, 546, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (2171, 'B', '08162016', 'TB 08162016', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (7732, 'B', 'ADS105', 'ADS-105', null, 1, 0);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (7733, 'B', 'ADS142', 'ADS 142', null, 1, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (7712, 'D', 'PHYSCOSTGLSTATS', 'Phys Cost GL Stat', 1, 1, 2);
insert into STATISTICMASTER2 (objectid, type, code, name, accthierid, depthierid, lockversion)
values (7690, 'B', 'TESTPT', 'TESTPT', null, 1, 0);
prompt 197 records loaded

set feedback on
set define on
prompt Done
