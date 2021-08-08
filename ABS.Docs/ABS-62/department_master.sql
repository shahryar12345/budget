prompt PL/SQL Developer Export Tables for user QA@DEVCURR
prompt Created by ss89222 on Wednesday, April 22, 2020
set feedback off
set define off

prompt Dropping DEPARTMENT_MASTER...
drop table DEPARTMENT_MASTER cascade constraints;
prompt Creating DEPARTMENT_MASTER...
create table DEPARTMENT_MASTER
(
  objectid    NUMBER(10) not null,
  code        VARCHAR2(15) not null,
  name        VARCHAR2(40) not null,
  lockversion NUMBER(10) default 1 not null
)
;
alter table DEPARTMENT_MASTER
  add constraint PK_DEPARTMENT_MASTER primary key (OBJECTID);
alter table DEPARTMENT_MASTER
  add constraint UNQ_DEPARTMENT_MASTER unique (CODE);

prompt Loading DEPARTMENT_MASTER...
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (81, 'CM', 'Costing Migration Department Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (223, 'TBDEPT3', 'Tinesha'' Department 3', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (161, 'YADEPTMASTER', 'YADEPTMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (241, 'TBDEPT4', 'TBDEPT4', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (301, 'FDEPTMASTER', 'FDEPARTMENTMASTER', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (421, 'RTEST2', 'rtest master 2', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (461, 'AXDEPTMASTER', 'AXDEPTMASTER', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (341, '0ALLTEST', 'All Test2', 2);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (481, '0APR17DEPTMAST', 'april17departmentmaster', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (501, 'RM', 'r department master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (561, 'V8REGDM', 'V8 Regression Department Master', 2);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (321, 'VELDEPT', 'VEL DEPARTMENT MASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (261, 'TBDEPT5', 'Test', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (265, 'TBDEPT6', 'Dept 6', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (268, 'CLASSMIG2888', 'CLASSMIG-2888', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (281, 'TBDEPT10', 'Department 10', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (441, 'JKSECDEPTM', 'JK Security Department Master', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (361, 'DEPTMSTCOG', 'DEPTMSTCOG', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (381, 'CLASSMIG3775', 'Test', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (263, 'DEPTMASTTEST', 'DEPTMASTTEST', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (264, 'DEPTMASTTEST1', 'DEPTMASTTEST1', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (521, 'MCDEPTMAST', 'MC Department Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (141, 'BCDEPTMASTER', 'BCDEPTMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (401, 'RTEST', 'rtest master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (201, 'TBDEPT', 'Tinesha''s Department Master', 2);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (181, 'JKTESTJIRADEPTM', 'JKTESTJIRADEPTMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (121, 'RDEPTMAS', 'RDEPTMAS', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (1, '150', 'old master 150', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (2, '200', 'old master 200', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (3, '221', 'Test Master', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (4, '222', 'QAMASTER 222', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (5, '300', 'old master 300', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (6, '350', 'old master 350', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (7, '456', 'New Item 456', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (8, '5000SM', 'old master 5000SM', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (9, '500AM', 'old master 500AM', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (10, '500CM', 'old master 500CM', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (11, '500DM', 'old master 500DM', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (12, '500JC', 'old 500JC', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (13, '500PT', 'old master 500PT', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (14, '500SM', 'old master 500SM', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (15, '530', 'old master 530', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (16, '600', 'old master 600', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (17, '800', 'old master 800', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (18, '815', 'QA Test 815', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (19, 'AKRON', 'Akron Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (20, 'AKT1', 'Test Master 1', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (21, 'AM', 'AM Account Master with Accts', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (22, 'ASDEPTMASTER', 'ASDEPTMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (23, 'ASGLMASTER', 'ASGLMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (24, 'CHARGE', 'Charge master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (25, 'DEPTMASTER', 'Marina Department Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (26, 'DEV', 'default master DEV', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (27, 'DLACCT1', 'DL Account Master 1', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (28, 'DLDEPT1', 'DL Department Master 1', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (29, 'DLSTAT1', 'DL Statistics Master 1', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (30, 'DM', 'DM Upgraded Dept Master w Depts', 6);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (31, 'FPBPMST', 'FPBPMST', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (32, 'FPDEPTMASTER', 'FP DEPARTMENT MASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (33, 'FPEMPLOYEEMAST2', 'FP EMPLOYEE MASTER 2', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (34, 'FPEMPLOYEEMAST3', 'FP EMPLOYEE MASTER 3', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (35, 'FPEMPLOYEEMASTE', 'FP EMPLOYEE MASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (36, 'FPGLACCTMAST1', 'FP GL ACCOUNT MASTER 1', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (37, 'FPJOBCODEMAST1', 'FP JOB CODE MASTER 1', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (38, 'FPPAYTYPEMAST1', 'FP PAY TYPE MASTER 1', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (39, 'FPSTATMASTER', 'FP STATISTIC MASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (40, 'FPSUPPLYMASTER', 'FP SUPPLY MASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (41, 'FPVENDORMASTER', 'FP VENDOR MASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (42, 'GSDEPTMASTER', 'GSDEPTMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (43, 'GSGLMASTER', 'GS GLMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (44, 'JKDEPTMASTER', 'JKDEPTMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (45, 'JKGLMASTER', 'JKGLMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (46, 'JOBCODEMASTER', 'Marina Job Codes', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (47, 'JSTEST', 'JS Test Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (48, 'JZACCT', 'jz Account Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (49, 'JZDEPT', 'jz Department Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (50, 'LPHMAST', 'LPH Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (51, 'MARINA', 'Marina Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (52, 'MARINA2', 'Marina 2 Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (53, 'PAYTYPEMASTER', 'old master Pay Type Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (54, 'QA1', 'Master created for QA by Diane', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (55, 'STATMASTER', 'old master StatMaster', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (56, 'TESTMAST3', 'TESTMAST3', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (57, 'TESTMASTER', 'Test Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (58, 'VENDORMASTER', 'old master VendorMaster', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (59, 'XDEPTMASTER', 'XDEPTMASTER', 6);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (60, 'XGLMASTER', 'XGLMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (61, 'YDEPTMASTER', 'YDEPTMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (62, 'YGLMASTER', 'YGLMASTER', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (105, 'RRDEPTMASTER', 'RRDEPTMASTER', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (106, 'JKTESTDEPT', 'JKTESTDEPT', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (582, 'ASESC1747DEPT', 'ASESC 1747 Dept', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (621, 'JKDMDSS40', 'JK Department Master JIRA DSS-40', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (601, '1833DEPT', '!833 Dept Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (682, 'JKASESC2060', 'JKASESC-2060', 2);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (662, 'TEST2061', 'Test', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (661, 'TEST2060', 'Testing', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (641, 'EHC', 'Evergreen RVU Test', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (721, 'CMH1DEPTMST', 'Catawba Test Dept Mast', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (761, 'VALLEY', 'Valley Medical Department Master', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (701, 'ORDEPTMASTER', 'or department master', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (741, '573', 'DPTest', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (11562, 'PAD01', 'PAD01 MASTER1', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (11582, 'ALPHASGMCPAD', 'Alpha SGMC for GL Classification MastPAD', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (802, 'DMT', 'Tinesha''s Department Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (6984, 'ASESC2938DMB', 'ASESC2938DM B Before', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (6983, 'ASESC2938DMA', 'ASESC-2938 DM A Before', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (11722, 'ASESC2938AFTDM', 'ASESC-2938 After Dept Master', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (11742, '2938AFTERFIXNEW', 'ASESC-2938 DM After Fix New User', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (6962, 'P001', 'Padma Dept Master1', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (782, 'PJDEPTMAST', 'PJ Testing', 0);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (20402, 'PJDEPT01', 'PJ Test Dept Master', 1);
insert into DEPARTMENT_MASTER (objectid, code, name, lockversion)
values (20423, 'JK_DEPT_MAST', 'kingjames department master', 1);
prompt 113 records loaded

set feedback on
set define on
prompt Done
