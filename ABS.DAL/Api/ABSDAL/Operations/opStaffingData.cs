using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using AutoMapper;




namespace ABSDAL.Operations
{
    public class opStaffingData
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {

            _context.StaffingData.Include(a => a.Entity).
            Include(a => a.Department).
            Include(a => a.JobCode).
            Include(a => a.PayType).
            Include(a => a.StaffingTimePeriod).
            Include(a => a.FiscalYear).
            Include(a => a.FiscalMonth).
            Include(a => a.DataScenarioTypeID).
            Include(a => a.DataScenarioID1).ToList();
            //Include(a => a.StaffingAccountID).ToList();
            //Include(a => a.StaffingMasterID).ToList();
            //Include(a => a.StaffingAccountTypeID).ToList();

            return _context;

        }

        public static async Task<ABS.DBModels.APIResponse> StaffingDataBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;


                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                ITUpdate.totalCount = values.Count();


                var extimeperiods = _context.TimePeriods.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exDataScenarios = _context.DataScenarios.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exentities = _context.Entities.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exdepartments = _context.Departments.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exPaytypes = _context.PayTypes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exjobcodes = _context.JobCodes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exitemTypes = _context._ItemTypes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var existingstaffingdata = _context.StaffingData.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();


                IEnumerable<IEnumerable<object>> staffingDatas = HelperFunctions.Splitdata<object>(values.ToList(), 10);
                //foreach (var x in staffingDatas)

                // Parallel.ForEach(staffingDatas, (x) =>
                //{
                //  Console.WriteLine(x);

                ConcurrentBag<ABS.DBModels.StaffingData> exstaffingData = new ConcurrentBag<ABS.DBModels.StaffingData>(existingstaffingdata);

                ConcurrentBag<ABS.DBModels.StaffingData> NewData = new ConcurrentBag<ABS.DBModels.StaffingData>();
                ConcurrentBag<ABS.DBModels.StaffingData> UpdatedData = new ConcurrentBag<ABS.DBModels.StaffingData>();


                //Parallel.ForEach(values, (item) =>



                foreach (var item in values)
                {
                    Console.WriteLine($"%%%% Remaining Records :" + ITUpdate.totalCount--);
                    // var newcontext = _context;
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());

                    ABS.DBModels.TimePeriods tpname = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "timePeriodName").ToString() == "")

                    {
                        errorones++;
                        continue;
                        //return;
                    }
                    else
                    {
                        tpname = extimeperiods.Where(f => f.TimePeriodName == arrval["timePeriodName"].ToString()).FirstOrDefault();
                    }

                    ABS.DBModels.DataScenario staffingDataScenario = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "staffingDataScenarioDescription").ToString() == "")

                    {
                        errorones++;
                        continue;
                        //return;
                    }
                    else
                    {
                        staffingDataScenario = exDataScenarios.Where(f => f.DataScenarioCode == arrval["staffingDataScenarioDescription"].ToString()).FirstOrDefault();
                    }
                    ABS.DBModels.Entities entitydt = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "entityCode").ToString() == "")

                    {
                        errorones++;
                        //  continue;
                    }
                    else
                    {
                        entitydt = exentities.Where(f => f.EntityCode == arrval["entityCode"].ToString()).FirstOrDefault();
                    }


                    ABS.DBModels.Departments departmentdt = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "departmentCode").ToString() == "")

                    {
                        errorones++;
                        //  continue;
                    }
                    else
                    {
                        departmentdt = exdepartments.Where(f => f.DepartmentCode == arrval["departmentCode"].ToString()).FirstOrDefault();
                    }


                    ABS.DBModels.JobCodes jobcode = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "jobCodeCode").ToString() == "")

                    {
                        // errorones++;
                        //continue;
                    }
                    else
                    {
                        jobcode = exjobcodes.Where(f => f.JobCodeCode == arrval["jobCodeCode"].ToString()).FirstOrDefault();
                    }


                    ABS.DBModels.PayTypes paytype = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "payTypeCode").ToString() == "")

                    {
                        //  errorones++;
                        // continue;
                    }
                    else
                    {
                        paytype = exPaytypes.Where(f => f.PayTypeCode == arrval["payTypeCode"].ToString()).FirstOrDefault();
                    }




                    decimal hourValue = 0;
                    string staffingHoursTotalHours = HelperFunctions.CheckKeyValuePairs(arrval, "staffingHoursTotalHours").ToString();
                    if (staffingHoursTotalHours == "")

                    {

                    }
                    else

                    {
                        hourValue = decimal.Parse(staffingHoursTotalHours);

                    }
                    DateTime valueperiod = DateTime.Now;

                    string staffingHoursPeriodValue = HelperFunctions.CheckKeyValuePairs(arrval, "staffingHoursPeriodValue").ToString();
                    if (staffingHoursPeriodValue == "")

                    {

                    }
                    else

                    {
                        valueperiod = DateTime.Parse(staffingHoursPeriodValue);

                        staffingHoursPeriodValue = valueperiod.ToString("MMMM");

                    }



                    var datascenarioType = new ABS.DBModels.ItemTypes();
                    datascenarioType = exitemTypes.Where(f => f.ItemTypeKeyword == "SCENARIOTYPE" && f.ItemTypeCode == "SF").FirstOrDefault();

                    ABS.DBModels.StaffingData existingData = null;
                    string StaffingDataType = HelperFunctions.CheckKeyValuePairs(arrval, "StaffingDataType").ToString();
                    if (StaffingDataType == "")

                    {
                        // errorones++;
                        //continue;
                        // return;

                        existingData = exstaffingData.Where(f =>
                           f.StaffingTimePeriod.TimePeriodCode.ToUpper() == tpname.TimePeriodCode.ToUpper()
                           && f.Entity.EntityCode.ToUpper() == entitydt.EntityCode.ToUpper()
                           && f.Department.DepartmentCode.ToUpper() == departmentdt.DepartmentCode.ToUpper()

                        ).FirstOrDefault();


                    }
                    else if (StaffingDataType == "PAYTYPE")

                    {
                        existingData = exstaffingData.Where(f =>
                        f.StaffingTimePeriod.TimePeriodCode.ToUpper() == tpname.TimePeriodCode.ToUpper()
                     && f.Entity.EntityCode.ToUpper() == entitydt.EntityCode.ToUpper()
                     && f.Department.DepartmentCode.ToUpper() == departmentdt.DepartmentCode.ToUpper()
                     && f.PayType != null
                     && f.PayType.PayTypeCode.ToUpper() == paytype.PayTypeCode.ToUpper()
                      ).FirstOrDefault();
                    }
                    else if (StaffingDataType == "JOBCODE")

                    {
                        existingData = exstaffingData.Where(f =>
                        f.StaffingTimePeriod.TimePeriodCode.ToUpper() == tpname.TimePeriodCode.ToUpper()
                        && f.Entity.EntityCode.ToUpper() == entitydt.EntityCode.ToUpper()
                        && f.Department.DepartmentCode.ToUpper() == departmentdt.DepartmentCode.ToUpper()
                        && f.JobCode != null
                        && f.JobCode.JobCodeCode.ToUpper() == jobcode.JobCodeCode.ToUpper()
                     ).FirstOrDefault();
                    }






                    ABS.DBModels.StaffingData nstaffingData = new ABS.DBModels.StaffingData();

                    nstaffingData.CreationDate = DateTime.UtcNow;
                    nstaffingData.UpdatedDate = DateTime.UtcNow;
                    nstaffingData.IsActive = true;
                    nstaffingData.IsDeleted = false;
                    nstaffingData.Identifier = Guid.NewGuid();

                    if (tpname != null)
                    {
                        nstaffingData.StaffingTimePeriod = tpname;
                    }

                    if (entitydt != null)
                    {
                        nstaffingData.Entity = entitydt;
                    }
                    if (departmentdt != null)
                    {
                        nstaffingData.Department = departmentdt;
                    }
                    if (jobcode != null)
                    {
                        nstaffingData.JobCode = jobcode;
                    }

                    if (paytype != null)
                    {
                        nstaffingData.PayType = paytype;
                    }
                    if (staffingDataScenario != null)
                    {
                        nstaffingData.DataScenarioID1 = staffingDataScenario;
                    }
                    if (datascenarioType != null)
                    {
                        nstaffingData.DataScenarioTypeID = datascenarioType;
                    }


                    HelperFunctions.TrySetProperty(nstaffingData, staffingHoursPeriodValue, hourValue);


                    if (existingData == null)
                    {
                        _context.Add(nstaffingData);
                        //NewData.Add(nstaffingData);
                        var newstaffinglist = exstaffingData;
                        newstaffinglist.Add(nstaffingData);
                        exstaffingData = newstaffinglist;
                    }
                    else
                    {
                        duplicates++;

                        _context.Entry(existingData).State = EntityState.Modified;
                        if (nstaffingData.JobCode != null && existingData.JobCode == null)
                        {
                            existingData.JobCode = nstaffingData.JobCode;
                        }

                        if (nstaffingData.PayType != null && existingData.PayType == null)
                        {
                            existingData.PayType = nstaffingData.PayType;
                        }

                        if (nstaffingData.StaffingTimePeriod != null)
                        {
                            existingData.StaffingTimePeriod = nstaffingData.StaffingTimePeriod;
                        }

                        if (nstaffingData.DataScenarioID1 != null)
                        {
                            existingData.DataScenarioID1 = nstaffingData.DataScenarioID1;
                        }
                        if (nstaffingData.DataScenarioTypeID != null)
                        {
                            existingData.DataScenarioTypeID = nstaffingData.DataScenarioTypeID;
                        }



                        existingData.January = HelperFunctions.GetNotNullValue(existingData.February, nstaffingData.January);
                        existingData.February = HelperFunctions.GetNotNullValue(existingData.February, nstaffingData.February);
                        existingData.March = HelperFunctions.GetNotNullValue(existingData.March, nstaffingData.March);
                        existingData.April = HelperFunctions.GetNotNullValue(existingData.April, nstaffingData.April);
                        existingData.May = HelperFunctions.GetNotNullValue(existingData.May, nstaffingData.May);
                        existingData.June = HelperFunctions.GetNotNullValue(existingData.June, nstaffingData.June);
                        existingData.July = HelperFunctions.GetNotNullValue(existingData.July, nstaffingData.July);
                        existingData.August = HelperFunctions.GetNotNullValue(existingData.August, nstaffingData.August);
                        existingData.September = HelperFunctions.GetNotNullValue(existingData.September, nstaffingData.September);
                        existingData.October = HelperFunctions.GetNotNullValue(existingData.October, nstaffingData.October);
                        existingData.November = HelperFunctions.GetNotNullValue(existingData.November, nstaffingData.November);
                        existingData.December = HelperFunctions.GetNotNullValue(existingData.December, nstaffingData.December);

                        // UpdatedData.Add(existingData);
                    }



                    successones++;

                    //await _context.AddRangeAsync(NewData);
                    //_context.UpdateRange(UpdatedData);

                    //   await _context.SaveChangesAsync();

                    await _context.SaveChangesAsync();

                }
                //);





                //  }
                //);
                //await _context.AddRangeAsync(cbData);

                //  Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods> bulk = new Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods>();
                //await  bulk.BulkInsertAsync();
                ITUpdate.message += "|| Total Inserted: " + successones;
                ITUpdate.message += "|| Duplicate Record(s) : " + duplicates;
                ITUpdate.message += "|| Total Errors found:  " + errorones;

                return ITUpdate;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return null;
            }
        }
        public async static Task<ABS.DBModels.APIResponse> CombinedStaffingDataBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;


                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                ITUpdate.totalCount = values.Count();


                var extimeperiods = _context.TimePeriods.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exDataScenarios = _context.DataScenarios.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exentities = _context.Entities.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exdepartments = _context.Departments.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exPaytypes = _context.PayTypes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exjobcodes = _context.JobCodes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exitemTypes = _context._ItemTypes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var existingstaffingdata = _context.StaffingData.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var updateAllActualBV = opItemTypes.getUpdateAllActualBV(_context);



                IEnumerable<IEnumerable<object>> staffingDatas = HelperFunctions.Splitdata<object>(values.ToList(), 10);

                ConcurrentBag<ABS.DBModels.StaffingData> exstaffingData = new ConcurrentBag<ABS.DBModels.StaffingData>(existingstaffingdata);

                ConcurrentBag<ABS.DBModels.StaffingData> NewData = new ConcurrentBag<ABS.DBModels.StaffingData>();
                ConcurrentBag<ABS.DBModels.StaffingData> UpdatedData = new ConcurrentBag<ABS.DBModels.StaffingData>();
                int currentLevel1 = ITUpdate.totalCount;


                //Parallel.ForEach(values, (item) =>
                //foreach (var item in values)
                #region L1
                for (int l1 = 0; l1 < values.Length; l1++)

                {

                    currentLevel1--;
                    var item = values[l1];
                    // var newcontext = _context;
                    //var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    var sdm = JsonConvert.DeserializeObject<StaffingDataMapper>(item.ToString());


                    //foreach (var sdm in arrval)
                    {


                        ABS.DBModels.Entities entitydt = null;
                        ABS.DBModels.TimePeriods tpname = null;
                        ABS.DBModels.DataScenario staffingDataScenario = null;


                        if (sdm.entityCode != null && sdm.entityCode != "")
                        {
                            entitydt = exentities.Where(f => f.EntityCode == sdm.entityCode).FirstOrDefault();

                        }
                        if (sdm.staffingDataScenarioDescription != null && sdm.staffingDataScenarioDescription != "")
                        {
                            staffingDataScenario = exDataScenarios.Where(f => f.DataScenarioCode == sdm.staffingDataScenarioDescription).FirstOrDefault();

                        }
                        if (sdm.staffingDataScenarioTimePeriodName != null && sdm.staffingDataScenarioTimePeriodName != "")
                        {
                            tpname = extimeperiods.Where(f => f.TimePeriodName == sdm.staffingDataScenarioTimePeriodName).FirstOrDefault();

                        }

                        List<DepartmentWithJobCodePayType> _departmentWithJobCodePayTypes = sdm.departmentWithJobCodePayType;
                        int count_departmentWithJobCodePayTypes = _departmentWithJobCodePayTypes.Count();
                        for (int i = 0; i < _departmentWithJobCodePayTypes.Count(); i++)

                        //foreach (var dwjcp in _departmentWithJobCodePayTypes)
                        {
                            count_departmentWithJobCodePayTypes--;
                            var dwjcp = _departmentWithJobCodePayTypes[i];
                            ABS.DBModels.Departments departmentdt = null;

                            if (dwjcp.deptCode != null && dwjcp.deptCode != "")
                            {
                                departmentdt = exdepartments.Where(f => f.DepartmentCode == dwjcp.deptCode).FirstOrDefault();

                            }

                            if (dwjcp.jobCodeWithPayTypeAbbreviatedIdentifier == null)
                            {
                                continue;
                            }
                            List<JobCodeWithPayTypeAbbreviatedIdentifier> _jobCodeWithPayTypeAbbreviatedIdentifiers = dwjcp.jobCodeWithPayTypeAbbreviatedIdentifier;
                            int count_jobCodeWithPayTypeAbbreviatedIdentifiers = _jobCodeWithPayTypeAbbreviatedIdentifiers.Count();


                            foreach (var jcpai in _jobCodeWithPayTypeAbbreviatedIdentifiers)
                            {
                                count_jobCodeWithPayTypeAbbreviatedIdentifiers--;

                                ABS.DBModels.JobCodes jobcode = null;

                                if (jcpai.jobCodeCode != null && jcpai.jobCodeCode != "")
                                {
                                    jobcode = exjobcodes.Where(f => f.JobCodeCode == jcpai.jobCodeCode).FirstOrDefault();

                                }

                                List<PayTypeAbbreviatedIdentifier> _payTypeAbbreviatedIdentifiers = jcpai.payTypeAbbreviatedIdentifier;
                                if (_payTypeAbbreviatedIdentifiers != null)
                                {
                                    int count__payTypeAbbreviatedIdentifiers = _payTypeAbbreviatedIdentifiers != null ? _payTypeAbbreviatedIdentifiers.Count() : 0;
                                    foreach (var ptai in _payTypeAbbreviatedIdentifiers)
                                    {
                                        count__payTypeAbbreviatedIdentifiers--;


                                        ABS.DBModels.PayTypes paytype = null;
                                        if (ptai.payTypeCode != null && ptai.payTypeCode != "")

                                        {

                                            paytype = exPaytypes.Where(f => f.PayTypeCode == ptai.payTypeCode).FirstOrDefault();
                                        }


                                        List<DataItemValueCombinedIdentifier> _dataItemValueCombinedIdentifiers = ptai.dataItemValueCombinedIdentifier;
                                        int counter = 0;
                                        int threshold = _dataItemValueCombinedIdentifiers.Count();
                                        int currentcount = _dataItemValueCombinedIdentifiers.Count();

                                        foreach (var divci in _dataItemValueCombinedIdentifiers)
                                        {
                                            #region HOURUPDATE



                                            var datascenarioType = new ABS.DBModels.ItemTypes();
                                            datascenarioType = exitemTypes.Where(f => f.ItemTypeKeyword == "SCENARIOTYPE" && f.ItemTypeCode == "SF").FirstOrDefault();

                                            var staffingAccountTypeIDHour = exitemTypes.Where(f => f.ItemTypeKeyword == "STAFFINGDATATYPE" && f.ItemTypeCode.ToUpper() == "HOURS").FirstOrDefault().ItemTypeID;



                                            ABS.DBModels.StaffingData xHours = new ABS.DBModels.StaffingData();
                                            xHours.Entity = entitydt;
                                            xHours.Department = departmentdt;
                                            xHours.JobCode = jobcode;
                                            xHours.PayType = paytype;
                                            xHours.StaffingTimePeriod = tpname;
                                            xHours.DataScenarioTypeID = datascenarioType;
                                            xHours.StaffingAccountTypeID = staffingAccountTypeIDHour;
                                            xHours.DataScenarioID1 = staffingDataScenario;
                                            xHours.IsActive = true;
                                            xHours.IsDeleted = false;
                                            xHours.CreationDate = DateTime.UtcNow;
                                            xHours.UpdatedDate = DateTime.UtcNow;
                                            xHours.Value = int.Parse(divci.timeIncrement.ToString());

                                            var staffingHoursPeriodValue = HelperFunctions.GetMonthName(divci.periodValue);

                                            HelperFunctions.TrySetProperty(xHours, staffingHoursPeriodValue, divci.totalHours);

                                            //Check If record already exists or not


                                            var checkexists = exstaffingData.Where(f =>
                                   f.StaffingTimePeriod.TimePeriodCode.ToUpper() == tpname.TimePeriodCode.ToUpper()
                                && f.Entity.EntityCode.ToUpper() == entitydt.EntityCode.ToUpper()
                                && f.Department.DepartmentCode.ToUpper() == departmentdt.DepartmentCode.ToUpper()
                                && f.PayType.PayTypeCode.ToUpper() == paytype.PayTypeCode.ToUpper()
                                && f.JobCode.JobCodeCode.ToUpper() == jobcode.JobCodeCode.ToUpper()
                                && f.DataScenarioID1.DataScenarioID == staffingDataScenario.DataScenarioID
                                && f.StaffingAccountTypeID == staffingAccountTypeIDHour
                                  ).FirstOrDefault();



                                            if (checkexists == null)
                                            {
                                                _context.Add(xHours);
                                                NewData.Add(xHours);
                                                var newstaffinglist = exstaffingData;
                                                newstaffinglist.Add(xHours);
                                                exstaffingData = newstaffinglist;
                                                if (updateAllActualBV)
                                                {
                                                    await opBudgetVersionStaffing.UpdateActualBVStaffingAccounts(xHours, _context);
                                                }
                                            }
                                            else

                                            {

                                                Console.WriteLine("staffing hour id: " + checkexists.StaffingDataID);
                                                //_context.Entry(checkexists).State = EntityState.Modified;



                                                checkexists.January = HelperFunctions.GetNotNullValue(checkexists.January, xHours.January);
                                                checkexists.February = HelperFunctions.GetNotNullValue(checkexists.February, xHours.February);
                                                checkexists.March = HelperFunctions.GetNotNullValue(checkexists.March, xHours.March);
                                                checkexists.April = HelperFunctions.GetNotNullValue(checkexists.April, xHours.April);
                                                checkexists.May = HelperFunctions.GetNotNullValue(checkexists.May, xHours.May);
                                                checkexists.June = HelperFunctions.GetNotNullValue(checkexists.June, xHours.June);
                                                checkexists.July = HelperFunctions.GetNotNullValue(checkexists.July, xHours.July);
                                                checkexists.August = HelperFunctions.GetNotNullValue(checkexists.August, xHours.August);
                                                checkexists.September = HelperFunctions.GetNotNullValue(checkexists.September, xHours.September);
                                                checkexists.October = HelperFunctions.GetNotNullValue(checkexists.October, xHours.October);
                                                checkexists.November = HelperFunctions.GetNotNullValue(checkexists.November, xHours.November);
                                                checkexists.December = HelperFunctions.GetNotNullValue(checkexists.December, xHours.December);
                                                checkexists.Value = int.Parse(HelperFunctions.GetNotNullValue(checkexists.Value, xHours.Value).ToString());
                                                if (!HelperFunctions.CompareAllMonthValuesActualSF(checkexists, xHours))
                                                {
                                                    checkexists.UpdatedDate = DateTime.UtcNow;

                                                    UpdatedData.Add(checkexists);
                                                    if (updateAllActualBV)
                                                    {
                                                        await opBudgetVersionStaffing.UpdateActualBVStaffingAccounts(xHours, _context);
                                                    }
                                                }
                                            }
                                            successones++;

                                            //   await _context.SaveChangesAsync();

                                            #endregion


                                            #region DOLLARUPDATE



                                            var staffingAccountTypeIDDollar = exitemTypes.Where(f => f.ItemTypeKeyword == "STAFFINGDATATYPE" && f.ItemTypeCode.ToUpper() == "DOLLARS").FirstOrDefault().ItemTypeID;

                                            ABS.DBModels.StaffingData xDollars = new ABS.DBModels.StaffingData();

                                            xDollars.Entity = entitydt;
                                            xDollars.Department = departmentdt;
                                            xDollars.JobCode = jobcode;
                                            xDollars.PayType = paytype;
                                            xDollars.StaffingTimePeriod = tpname;
                                            xDollars.DataScenarioTypeID = datascenarioType;
                                            xDollars.StaffingAccountTypeID = staffingAccountTypeIDDollar;
                                            xDollars.DataScenarioID1 = staffingDataScenario;
                                            xDollars.IsActive = true;
                                            xDollars.IsDeleted = false;
                                            xDollars.CreationDate = DateTime.UtcNow;
                                            xDollars.UpdatedDate = DateTime.UtcNow;
                                            xDollars.Value = int.Parse(divci.timeIncrement.ToString());

                                            var staffingHoursPeriodValueDollar = HelperFunctions.GetMonthName(divci.periodValue);

                                            HelperFunctions.TrySetProperty(xDollars, staffingHoursPeriodValueDollar, divci.totalSalary);




                                            //Check If record already exists or not


                                            var checkexistsxDollars = exstaffingData.Where(f =>
                                   f.StaffingTimePeriod.TimePeriodCode.ToUpper() == tpname.TimePeriodCode.ToUpper()
                                && f.Entity.EntityCode.ToUpper() == entitydt.EntityCode.ToUpper()
                                && f.Department.DepartmentCode.ToUpper() == departmentdt.DepartmentCode.ToUpper()
                                && f.PayType.PayTypeCode.ToUpper() == paytype.PayTypeCode.ToUpper()
                                && f.JobCode.JobCodeCode.ToUpper() == jobcode.JobCodeCode.ToUpper()
                                && f.DataScenarioID1.DataScenarioID == staffingDataScenario.DataScenarioID
                                && f.StaffingAccountTypeID == staffingAccountTypeIDDollar
                                  ).FirstOrDefault();



                                            if (checkexistsxDollars == null)
                                            {
                                                _context.Add(xDollars);
                                                NewData.Add(xDollars);
                                                var newstaffinglist = exstaffingData;
                                                newstaffinglist.Add(xDollars);
                                                exstaffingData = newstaffinglist;
                                                if (updateAllActualBV)
                                                {
                                                    await opBudgetVersionStaffing.UpdateActualBVStaffingAccounts(xDollars, _context);
                                                }
                                            }
                                            else

                                            {

                                                Console.WriteLine("staffing dollar id: " + checkexistsxDollars.StaffingDataID);

                                                //_context.Entry(checkexistsxDollars).State = EntityState.Modified;


                                                checkexistsxDollars.January = HelperFunctions.GetNotNullValue(checkexistsxDollars.January, xDollars.January);
                                                checkexistsxDollars.February = HelperFunctions.GetNotNullValue(checkexistsxDollars.February, xDollars.February);
                                                checkexistsxDollars.March = HelperFunctions.GetNotNullValue(checkexistsxDollars.March, xDollars.March);
                                                checkexistsxDollars.April = HelperFunctions.GetNotNullValue(checkexistsxDollars.April, xDollars.April);
                                                checkexistsxDollars.May = HelperFunctions.GetNotNullValue(checkexistsxDollars.May, xDollars.May);
                                                checkexistsxDollars.June = HelperFunctions.GetNotNullValue(checkexistsxDollars.June, xDollars.June);
                                                checkexistsxDollars.July = HelperFunctions.GetNotNullValue(checkexistsxDollars.July, xDollars.July);
                                                checkexistsxDollars.August = HelperFunctions.GetNotNullValue(checkexistsxDollars.August, xDollars.August);
                                                checkexistsxDollars.September = HelperFunctions.GetNotNullValue(checkexistsxDollars.September, xDollars.September);
                                                checkexistsxDollars.October = HelperFunctions.GetNotNullValue(checkexistsxDollars.October, xDollars.October);
                                                checkexistsxDollars.November = HelperFunctions.GetNotNullValue(checkexistsxDollars.November, xDollars.November);
                                                checkexistsxDollars.December = HelperFunctions.GetNotNullValue(checkexistsxDollars.December, xDollars.December);
                                                checkexistsxDollars.Value = int.Parse(HelperFunctions.GetNotNullValue(checkexistsxDollars.Value, xDollars.Value).ToString());


                                                if (!HelperFunctions.CompareAllMonthValuesActualSF(checkexists, xDollars))
                                                {
                                                    checkexistsxDollars.UpdatedDate = DateTime.UtcNow;

                                                    UpdatedData.Add(checkexistsxDollars);
                                                    if (updateAllActualBV)
                                                    {
                                                        await opBudgetVersionStaffing.UpdateActualBVStaffingAccounts(xDollars, _context);
                                                    }
                                                }
                                            }
                                            successones++;

                                            currentcount--;
                                            if (currentcount < threshold)
                                            { threshold = currentcount; }
                                            Console.WriteLine($"%%%% Remaining TOtal Records (Level 1):" + currentLevel1);
                                            Console.WriteLine($"%%%% Remaining Dept Records  (Level 2):" + count_departmentWithJobCodePayTypes);
                                            Console.WriteLine($"%%%% Remaining Paytype_Jobcode Records  (Level 3):" + count_jobCodeWithPayTypeAbbreviatedIdentifiers);
                                            Console.WriteLine($"%%%% Remaining PaytypeIDentifier Records  (Level 4):" + count__payTypeAbbreviatedIdentifiers);

                                            Console.WriteLine($"%%%% Remaining Hours/Dollars Records  (Level 5): " + currentcount);
                                            counter++;
                                            counter++;
                                            if (counter < threshold)
                                            {


                                            }
                                            else
                                            {
                                                //  await _context.AddRangeAsync(NewData);
                                                //     await _context.SaveChangesAsync();

                                                counter = 0;
                                            }
                                            //  await _context.SaveChangesAsync();


                                            #endregion



                                        }

                                    }
                                }//paytype identifier 
                            } //paytype jobcode record 


                        } // Department

                    } // Total Records
                    #endregion

                    ITUpdate.message += "|| Total Inserted: " + successones;
                    ITUpdate.message += "|| Duplicate Record(s) : " + duplicates;
                    ITUpdate.message += "|| Total Errors found:  " + errorones;

                    // return ITUpdate;


                }
                if (NewData.Count > 0)
                {
                    await DBOperations.SaveDBObjectUpdates<ABS.DBModels.StaffingData>(NewData.ToList(), false, _context);

                }
                if (UpdatedData.Count > 0)
                {
                    //  await DBOperations.SaveDBObjectUpdates<ABS.DBModels.StaffingData>(UpdatedData.ToList(), true, _context);
                    await _context.SaveChangesAsync();
                }
                return ITUpdate;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return null;
            }
        }


    }
}
