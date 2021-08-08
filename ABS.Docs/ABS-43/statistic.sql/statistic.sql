prompt PL/SQL Developer Export Tables for user QA@DEVCURR
prompt Created by ss89222 on Wednesday, April 22, 2020
set feedback off
set define off

prompt Dropping STATISTIC...
drop table STATISTIC cascade constraints;
prompt Creating STATISTIC...
create table STATISTIC
(
  objectid        NUMBER(10),
  code            VARCHAR2(15),
  description     VARCHAR2(40),
  column_label    VARCHAR2(15),
  summable        CHAR(1),
  code_set_id     NUMBER(10),
  lockversion     NUMBER(10) default 1,
  patient_type_id NUMBER(10)
)
;
create index FK_STATISTIC_PATTYPE on STATISTIC (PATIENT_TYPE_ID);
create index REF9691424 on STATISTIC (CODE_SET_ID);
alter table STATISTIC
  add constraint PK_STATISTIC primary key (OBJECTID);
alter table STATISTIC
  add constraint UNQ_STATISTIC unique (CODE, CODE_SET_ID);
alter table STATISTIC
  add constraint FK_STATISTIC_CODESET foreign key (CODE_SET_ID)
  references CODE_SET_BKUP (OBJECTID);
alter table STATISTIC
  add constraint FK_STATISTIC_PATTYPE foreign key (PATIENT_TYPE_ID)
  references PATIENT_TYPE (OBJECTID);
alter table STATISTIC
  add constraint NN_STATISTIC_CODE
  check (CODE IS NOT NULL);
alter table STATISTIC
  add constraint NN_STATISTIC_LOCK
  check (LOCKVERSION IS NOT NULL);
alter table STATISTIC
  add constraint NN_STATISTIC_OBJECT
  check (OBJECTID IS NOT NULL);
alter table STATISTIC
  add constraint NN_STATISTIC_SUM
  check (SUMMABLE IS NOT NULL);

prompt Loading STATISTIC...
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26127878, '500CMDEPTSTAT', '500CM DEPT STAT', null, 'T', 26093485, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27551189, 'IPVOL', 'IP VOLUME', 'IP VOL', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27551190, 'OPVOL', 'OP VOLUME', 'OP VOL', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27551191, 'MEALS', 'Meals Served', 'MEALS', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27551192, 'SQFT', 'Square Feet', 'SQ FT', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27551193, 'LBS', 'Pounds of Laundry', 'LBS', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802727, 'NEWSTAT2', 'NEWSTATII', 'NEWSTAT2', 'T', 24365930, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25602295, 'QATEST', 'QA TEST', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802724, 'NEWSTAT', 'NEWSTAT', 'NEWSTAT', 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802754, 'NEWSTAT3', 'NEWSTAT3', 'NEWSTAT3', 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24832200, 'DANSTAT101205', '1205', null, 'T', 24365930, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26157993, 'OBSERV', 'Observation', 'OBSERV', 'F', 2578575166, 0, 25790792);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26157994, 'MIN_OP', 'Minutes OP', 'MIN OP', 'F', 2578575166, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26157995, 'MIN_IP', 'Minutes IP', 'MIN IP', 'T', 2578575166, 8, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26157996, 'SURG', 'Surgery', 'SURG', 'F', 2578575166, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24832209, 'NSTAT2', 'NSTAT2', 'NSTAT2', 'T', 24365930, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802751, 'DANCODE100914', '0914', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24832206, 'NSTAT1', 'NSTAT1', 'NSTAT1', 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26857486, '3502222', 'Stat for Master 350  DF', null, 'T', 26093464, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (34958574, 'K3230', 'IP BTUs - Audiologist', 'IPBTU', 'T', 26093450, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27949660, 'BEDS', 'Licensed Beds', 'Beds', 'F', 2578575166, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27949662, 'CTPROCIP', 'CT Procedures - Inpatient', 'CTProcIP', 'T', 2578575166, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27949663, 'SCREEN', 'Screenings', 'Screen', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25854821, '003344', 'qatest3', null, 'T', null, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25854824, '456789', 'qatest', null, 'T', null, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26127695, '12345', '12345', null, 'T', 26093457, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368912, 'IPPROC', 'I/P Procedures', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368913, 'OPPROC', 'O/P Procedures', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368914, 'PATDAYS', 'Patient Days', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368915, 'OBSHRS', 'Observation Hours', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368916, '410000', 'Patient Days', 'Patient Days', 'T', 24365930, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368917, '410050', 'Adj Patient Days', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368918, '410100', 'Discharges', null, 'T', 24365930, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368919, '410150', 'Adj Discharges', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368920, '420000', 'OP Visits', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368921, '499000', 'Primary Workload Stat (PWS)', null, 'T', 24365930, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368922, '499101', 'LPM Stats', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368923, '499555', 'Secondary PWS Stat', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368924, '540100', 'STAT - HC REV-VISIT', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368925, '540102', 'STAT - HC REV-VISIT-PT', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368926, '540103', 'STAT-HC REV-VISIT--OT', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368927, '540104', 'STAT-HC-REV-VISIT-PT', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368928, '540105', 'STAT-HC REV-VISIT-MSW', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368929, '540106', 'STAT-HC-VISIT-HHA', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368930, '540200', 'STAT-HC REV SHIFT-RN', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368931, '540201', 'STAT-HC REV-SHIFT-LPN', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368932, '540207', 'STAT-HC REV-SHIFT-CNA', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368933, '540370', 'STAT-HC REV-PER DIEM-RHC', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368934, '540371', 'STAT-HC REV-PER DIEM-IPC', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368935, '540372', 'STAT-HC REV-PER DIEM-IPRC', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368936, '540520', 'STAT-HC REV-TRMT-COMM PR', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368937, 'INPVOL', 'Inpatient Volume', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24368938, 'OUTVOL', 'Outpatient Volume', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802733, 'DANCODE100906', '0906', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802736, 'DANCODE100908', '0908', null, 'F', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802739, 'DANCODE100910', '0910', null, 'F', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802742, 'DANCODE100911', '0911', '0911', 'T', 24365930, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802745, 'DANCODE100912', '0912', '0912', 'F', 24365930, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802748, 'DANCODE100913', '09013', null, 'F', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24832194, 'DANSTAT101201', '1201', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24832197, 'DANSTAT101203', '1203', 'non-sum', 'F', 24365930, 1, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27845819, 'SALARIES', 'Salaries', 'Salaries', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27845820, 'LPMSTATS', 'LPM Stats', 'LPM Stats', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27845821, 'SUPPLIES', 'Supplies', 'Supplies', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27845830, 'NUMEMP', 'Number Employees', '# EMP', 'F', 2578575166, 0, 25790792);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27845852, 'SALARIES_BEN', 'Salaries & Benefits', 'Sal & Ben', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (27845853, 'NOEMP', 'Number Employees', '# EMP', 'T', 2578575166, 0, 25790792);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24802730, 'DANCODE100905', '0905', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25824612, 'OPPROC', 'Outpatient Procedures', 'OP Proc', 'T', 2578575166, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25530852, '000088', 'qa test item', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25824609, 'PATDAYS', 'Patient Days', 'PAT DAYS', 'T', 2578575166, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26574365, 'JIRA362Y', 'Jira 362 with sum time periods Y', 'Jira 362 Y', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26574368, 'JIRA362N', 'Jira 362 with sum time periods N', 'Jira 362 N', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (29163966, 'EVAL', 'Evaluation', 'Eval', 'T', 2578575166, 1, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (29163967, 'TESTS', 'Laboratory Tests', 'Tests', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (29163968, 'CASES', 'Surgical Cases', 'Cases', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (55828, 'IPPROC', 'I/P Procedures', null, 'T', 55825, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (55830, 'OPPROC', 'O/P Procedures', null, 'T', 55825, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (1037622, 'PATDAYS', 'Patient Days', null, 'T', 55825, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (1037623, 'OBSHRS', 'Observation Hours', null, 'T', 55825, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039275, '410000', 'Patient Days', 'Patient Days', 'T', 55825, 7, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039276, '410050', 'Adj Patient Days', null, 'T', 55825, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039277, '410100', 'Discharges', null, 'T', 55825, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039278, '410150', 'Adj Discharges', null, 'T', 55825, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039279, '420000', 'OP Visits', null, 'T', 55825, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039280, '499000', 'Primary Workload Stat (PWS)', null, 'T', 55825, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039281, '499101', 'LPM Stats', null, 'T', 55825, 1, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039282, '499555', 'Secondary PWS Stat', null, 'T', 55825, 1, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039283, '540100', 'STAT - HC REV-VISIT', null, 'T', 55825, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039284, '540102', 'STAT - HC REV-VISIT-PT', null, 'T', 55825, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039285, '540103', 'STAT-HC REV-VISIT--OT', null, 'T', 55825, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039286, '540104', 'STAT-HC-REV-VISIT-PT', null, 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039287, '540105', 'STAT-HC REV-VISIT-MSW', null, 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039288, '540106', 'STAT-HC-VISIT-HHA', null, 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039289, '540200', 'STAT-HC REV SHIFT-RN', null, 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039290, '540201', 'STAT-HC REV-SHIFT-LPN', null, 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039291, '540207', 'STAT-HC REV-SHIFT-CNA', null, 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039292, '540370', 'STAT-HC REV-PER DIEM-RHC', null, 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039293, '540371', 'STAT-HC REV-PER DIEM-IPC', null, 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039294, '540372', 'STAT-HC REV-PER DIEM-IPRC', null, 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039295, '540520', 'STAT-HC REV-TRMT-COMM PR', null, 'T', 55825, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039296, 'INPVOL', 'Inpatient Volume', null, 'T', 55825, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3039297, 'OUTVOL', 'Outpatient Volume', null, 'T', 55825, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (24861663, 'NSTAT4', 'NSTAT4', 'NSTAT4', 'F', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25602279, ' QAITEM', 'QAITEM TEST', null, 'F', 24365930, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25602282, '   QAITEM2', 'QAITEMTEST2', null, 'T', 24365930, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (42153250, 'SQFT', 'Square Feet', 'SQFT', 'F', 55825, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25825103, '123456', 'qa test1', null, 'T', null, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (42153253, 'MEALS', 'Meals', 'Meals', 'T', 55825, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (25914219, '23456', 'QATest2', null, 'T', null, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (42153256, 'IPTESTS', 'IP Tests', 'IP Tests', 'T', 55825, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (42153259, 'OPTESTS', 'OP Tests', 'OP Tests', 'T', 55825, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26574499, 'QAITEM', 'QAITEM TEST', null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (26577278, '  32432423', null, null, 'T', 24365930, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (43300989, 'SM_SAL', 'Sal', 'Sal', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (43300990, 'SM_STATS', 'LPM Stats', 'LPM Stats', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (43300991, 'SM_SUP', 'Sup', 'Sup', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525386, '1DSTATS', 'LPM Stats', 'LPM Stats', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525173, 'SMOKE04', 'Pediatric Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525174, 'SMOKE05', 'Rehabilitation Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525175, 'SMOKE06', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525176, 'SMOKEA1', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525385, '1DSAL', 'Sal', 'Sal', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525387, '1DSUP', 'Sup', 'Sup', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110595123, 'PTDAY', 'Patient Days', null, 'T', 110595116, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504767, 'QQCOPIES', 'COPIES', 'COPIES', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504768, 'QQTRAUMA', 'Trauma', 'Trauma', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504769, 'QQNRSMED', 'Med/Surg Nursing Hours', 'Med/Surg Hrs', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110595955, 'IPUOSPRO', 'Inpatient UOS - Professional Fee', null, 'T', 110595116, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110593841, 'ATEST', 'dsd', 'sdfsd', 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110595954, 'IPUOSFACIL', 'Inpatient UOS - Facility Fee', null, 'T', 110595116, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110595956, 'OPUOSFACIL', 'Outpatient UOS - Facility Fee', null, 'T', 110595116, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110595957, 'OPUOSPRO', 'Oupatient UOS - Professional Fee', null, 'T', 110595116, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (221, 'MEMMNTH', 'Member Month', null, 'T', 5, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (222, 'DUESPMNT', 'DUESPMNTS', null, 'T', 5, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (1, 'PATREV', 'Patient Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (2, 'TOTSAL', 'Total Salaries', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (3, 'DIREXP', 'Direct Expense', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (4, 'PATDAYS', 'Patient Days', null, 'T', 2, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (5, '2000115', 'Volume of 2000115', null, 'T', 2, 2, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (107, 'CANCEXP', 'Cancer Expense', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (84, 'PATSAL', 'Patient Care Salaries', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (85, 'CTREV', 'Central Sterile Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (86, 'MSO', 'Material Services Ops', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (87, 'NRSMED', 'Med/Surg Nursing Hours', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (88, 'PATDAYS', 'Patient Days', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (89, 'TRAUMA', 'Trauma Charges', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (148, 'PHYSREV', 'Physician Billing Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (91, 'NRSNRS', 'Nursing Unit Nursing Hours', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (92, 'PDSURG', 'Patient Days Med/Surg', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (93, 'SQFTPSA', 'PSA Square Footage', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (94, 'PDNUTR', 'Patient Days Nutrition Services', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (95, 'PDNRS', 'Patient Days Nursing Units', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (96, 'NRSPED', 'Pediatric Nursing Hours', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (147, '3523DEPR', 'Other Depreciation Allocation', null, 'T', 3, 2, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (168, 'LLCDOH', 'LLC Direct Overhead', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (169, 'LLCCOH', 'LLC Corporate Overhead', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (170, 'LLCDEPR', 'LLC Depreciation', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (171, 'EPILEPSYVOL', 'Volume of Epilepsy charges', null, 'T', 2, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (172, 'STROKECHG', 'Neurosicences stroke allocation', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (173, 'PEDREV', 'Pediatric Ambulatory Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (174, 'TRANSNUM', 'Number of Transplants', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (175, 'HHOH', 'Home Health Overhead Alloc', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (176, 'TO5310', '100% of Costs to CC 5310', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (177, 'ACTDEPR', 'Actual Depreciation', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (178, 'TOTREV', 'Total Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (45, 'TO3010', '100% of Costs to CC 3010', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (53, 'TO3314', '100% of Costs to CC 3314', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (58, 'ERREV', 'ER Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (59, 'CANCREV', 'Cancer Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (60, 'CARDREV', 'Cardiac Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (61, 'PSYCHSAL', 'Psychiatric Salaries', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (62, 'REHABREV', 'Rehabilitation Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (63, 'PEDSAL', 'Pediatrics Salaries', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (64, 'CLINREV', 'Clinic Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (65, 'PSYCHREV', 'Psychiatric Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (66, 'LABREV', 'Lab Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (67, 'SURGREV', 'Surgery Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (68, 'WMNSREV', 'Women''s Services Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (69, 'LITHOREV', 'Lithotripter Revenue', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (70, 'PATEXP', 'Patient Care Expense', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (71, 'TERM', 'Terminated Emp w/ Severance', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (72, 'TRANS', 'Number of Transcriptions', null, 'T', 3, 2, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (73, 'LAUND', 'Pounds of Laundry', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (74, 'FTE', 'FTE', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (75, '4110MGR', 'CC 4110 Manager Provided %', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (76, 'RADPWS', 'Radiology PWS Volume', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (77, 'REFRL', 'Number of Referrals', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (78, 'NRSHRS', 'Direct Nursing Hours', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (79, 'SQFT', 'Square Footage', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (80, 'PHONE', 'Number of Phones', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (81, 'COPIES', 'Copy Machine Usage', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (82, 'DEPR', 'Depreciation', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (179, 'PATCENSUS', 'Patient Revenue Cost Center Census', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (180, 'NUCENSUS', 'Nursing Cost Center Census', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (181, 'NSCENSUS', 'Nutrition Services Cost Center Census', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (182, 'MSCENSUS', 'Medical Surgical Census', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (199, 'TO3232', '100% of Cost to CC 3232', null, 'T', 3, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (200, 'TRANSPATREV', 'Patient Revenue for CC4442', null, 'T', 1, 1, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504848, 'QQLLCDEPR', 'LLC Depreciation', 'LLC Dep', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504849, 'QQSTROKECHG', 'Neurosicences stroke allocation', 'NS stroke', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504850, 'QQHHOH', 'Home Health Overhead Alloc', 'HH Oh Alloc', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504904, 'QQPATDAY', 'Patient Days', 'Patient Days', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110524514, 'SMOKE01', 'Pediatric Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110524515, 'SMOKE02', 'Rehabilitation Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110524516, 'SMOKE03', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110524517, 'SMOKEA', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525612, '2DSAL', 'Sal', 'Sal', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525613, '2DSTATS', 'LPM Stats', 'LPM Stats', 'T', 2578575166, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110525614, '2DSUP', 'Sup', 'Sup', 'F', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110513856, 'RRPATDAYS', 'Q Pat Days', 'Q Pat Days', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110513861, 'QQPATDAYS', 'Q Pat Days', 'Q Pat Days', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110513862, 'RRLLCDEPR', 'LLC Depreciation', 'LLC Dep', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110513863, 'RRHHOH', 'Home Health Overhead Alloc', 'HH Oh Alloc', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110513864, 'RRSTROKECHG', 'Neurosicences stroke allocation', 'NS stroke', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504629, 'QPEDREV', 'Pediatric Ambulatory Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504630, 'QREHABREV', 'Rehabilitation Revenue', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504631, 'QPEDSAL', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504632, 'QPHYSREV', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504636, 'QLABREV', 'Lab Revenue', 'Lab Revenue', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504668, 'QQPEDRV', 'Pediatric Ambulatory Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504669, 'QQREHABRV', 'Rehabilitation Revenue', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504670, 'QQPEDSAL', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504671, 'QQPHYSRV', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504672, 'QQPEDREV', 'Pediatric Ambulatory Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110504673, 'QQLABREV', 'Lab Revenue', 'Lab Revenue', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110600288, '1SM1', 'Pediatric Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110600289, '1SM2', 'Rehabilitation Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110600290, '1SM3', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110600291, '1SMB1', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110812865, '608', 'Statistic item 608', 'statitem608', 'T', 26093443, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110816798, 'FPSTATISTIC4', 'FP STATISTIC ITEM 4 - OTHER', 'FPSTATISTIC4', 'T', 110813443, 0, 25790792);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112275097, '3SM1', 'Pediatric Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112275098, '3SM2', 'Rehabilitation Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112275099, '3SM3', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112275100, '3SMB1', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110816795, 'FPSTATISTICITEM', 'FP STATISTIC ITEM 1 - EMERGENCY', 'FPSTATISTICITEM', 'T', 110813443, 0, 25790791);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110817611, 'STATISTIC1', 'STATISTIC 1 - INPATIENT', 'STATISTIC1', 'T', 26093443, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110817613, 'STATISTIC2', 'STATISTIC 2 - OUTPATIENT', 'STATISTIC2', 'T', 26093443, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110822415, 'STATITEM400', 'STATISTIC ITEM 400 - OTHER-YESSUM', 'STATITEM400', 'T', 55825, 1, 25790792);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110816796, 'FPSTATISTIC2', 'FP STATISTIC 2 - INPATIENT', 'FPSTATISTIC2', 'T', 110813443, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110816797, 'FPSTATISTIC3', 'FP STATISTIC ITEM 3 - OUTPATIENT', 'FPSTATISTIC3', 'T', 110813443, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110820880, 'STATITEM100', 'STATISTIC ITEM 100 - INPATIENT-YESSUM', 'STATITEM100', 'T', 55825, 1, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110821478, 'STATITEM200', 'STATISTIC ITEM 200 - OUTPATIENT-YESSUM', 'STATITEM200', 'T', 55825, 1, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110821856, 'STATITEM300', 'STATISTIC ITEM 300 - EMERGENCY-YESSUM', 'STATITEM300', 'T', 55825, 1, 25790791);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (110812862, '607', 'Statistic item', 'statisticitem', 'T', 26093443, 0, 25790791);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112628957, 'ASM1', 'Pediatric Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112628958, 'ASM2', 'Rehabilitation Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112628959, 'ASM3', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112628960, 'ASMB1', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112631266, 'FPSTATISTIC5', 'FP STATISTIC ITEM 5 - EMERGENCY', 'FPSTATITME5', 'T', 110813443, 0, 25790791);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112344115, '4SM1', 'Pediatric Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112344116, '4SM2', 'Rehabilitation Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112344117, '4SM3', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112344118, '4SMB1', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112740392, 'FPSTATISTIC6', 'FP STATISTIC ITEM 6 - INPATIENT', 'FPSTATISTIC6', 'T', 110813443, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112740393, 'FPSTATISTIC7', 'FP STATISTIC ITEM - TOTAL', 'FPSTATISTIC7', 'T', 110813443, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112740394, 'FPSTATISTIC8', 'FP STATISTIC ITEM - NONE', 'FPSTATISTIC8', 'T', 110813443, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112740395, 'FPSTATISTIC9', 'FP STATISTIC9 - OUTPATIENT-NO SUM', 'FPSTATISTIC9', 'F', 110813443, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (116475645, 'STATITEM500', 'STATISTIC ITEM 500-TOTAL-YESSUM', 'STATITEM500', 'T', 55825, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (116475646, 'STATITEM600', 'STATISTIC ITEM 600-NONE-YESSUM', 'STATITEM600', 'T', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (116475647, 'STATITEM700', 'STATITEM700-NONE-NOSUM', 'STATITEM700', 'F', 55825, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (116475648, 'STATITEM800', 'STATITEM800-TOTAL-NOSUM', 'STATITEM800', 'F', 55825, 0, 1002);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (114683789, 'CSM1', 'Pediatric Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (114683790, 'CSM2', 'Rehabilitation Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (114683791, 'CSM3', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (114683792, 'CSMB1', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (113035319, 'FPTESTSTAT', 'FP TEST STAT', 'TEST', 'T', 110813443, 0, 25790791);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (115429201, 'TESTSTAT', 'Test Statistic', 'Test', 'T', 115429112, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (114852696, 'DSM1', 'Pediatric Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (114852697, 'DSM2', 'Rehabilitation Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (114852698, 'DSM3', 'Pediatrics Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (114852699, 'DSMB1', 'Physician Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (115534191, 'ERENCNTROP', 'ER Encounters', 'ERENCNTROP', 'T', 26093443, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (112756357, 'FPSTATISTIC10', 'FP STATISTIC ITEM 10 - INPATIENT', 'FPSTATISTIC10', 'T', 110813443, 0, 1000);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (115534190, 'EMERTOT', 'Total Emergency Room', 'EMERTOT', 'T', 26093443, 0, 1001);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (115414669, 'ESM1', 'Smoke Peds Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (115414670, 'ESM2', 'Smoke Rehab Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (115414671, 'ESM3', 'Smoke Peds Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (115414672, 'ESMB1', 'Smoke Phys Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (116083256, 'FSM1', 'Smoke Peds Ambulatory Rev', 'Ped Amb Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (116083257, 'FSM2', 'Smoke Rehab Rev', 'Rehab Rev', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (116083258, 'FSM3', 'Smoke Peds Salaries', 'Ped Sal', 'T', 2578575166, 0, null);
insert into STATISTIC (objectid, code, description, column_label, summable, code_set_id, lockversion, patient_type_id)
values (116083259, 'FSMB1', 'Smoke Phys Billing Revenue', 'Ped Amb Rev', 'T', 2578575166, 0, null);
prompt 284 records loaded

set feedback on
set define on
prompt Done
