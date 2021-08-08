using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using System.Reflection;
using Newtonsoft.Json;
using ABS.DBModels.Models.ContextClasses;
using Microsoft.Extensions.DependencyInjection;

namespace ABSDAL.Operations
{
    public class opBudgetVersionGLAccounts
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
            _context.BudgetVersionGLAccounts.Include(a => a.Entity).ToList();
            _context.BudgetVersionGLAccounts.Include(a => a.Department).ToList();
            _context.BudgetVersionGLAccounts.Include(a => a.GLAccount).ToList();
            _context.BudgetVersionGLAccounts.Include(a => a.TimePeriodID).ToList();
            _context.BudgetVersionGLAccounts.Include(a => a.BudgetVersion).ToList();

            _context.BudgetVersionGLAccounts.Include(a => a.DataScenarioTypeID).ToList();

            //ABS-340 - JAB 06/03/2020
            //_context.BudgetVersionGLAccounts.Include(a => a.DimensionsRowID).ToList();
            //End ABS-340

            return _context;
        }


        public async static Task<ABS.DBModels.APIResponse> AddBudgetVersionsGLAccounts(JsonElement jsonString, BudgetingContext _context)
        {
            ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();
            try
            {
                var jObject = Newtonsoft.Json.JsonConvert.DeserializeObject<List<BudgetVersionGLAccounts>>(jsonString.ToString());
                if (jObject.Count == 0)
                { return aPIResponse; }

                _context.BudgetVersionGLAccounts.RemoveRange(_context.BudgetVersionGLAccounts.Where(bv => bv.BudgetVersion.BudgetVersionID == jObject.FirstOrDefault().BudgetVersion.BudgetVersionID && bv.BudgetVersion.budgetVersionTypeID.ItemTypeCode == "A"));

                var extimeperiods = _context.TimePeriods.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exbudgetversions = _context._BudgetVersions.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exentities = _context.Entities.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exdepartments = _context.Departments.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exglaccounts = _context.GLAccounts.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exitemtypes = _context._ItemTypes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();

                ConcurrentBag<ABS.DBModels.BudgetVersionGLAccounts> cbData = new ConcurrentBag<ABS.DBModels.BudgetVersionGLAccounts>();
                int totalitems = jObject.Count;

                int counter = 0;
                //  Parallel.ForEach(jObject, async (item) =>

                int threshold = 30;

                _context.ChangeTracker.AutoDetectChangesEnabled = false;



                //Parallel.ForEach(jObject, (item) =>

                foreach (var item in jObject)
                {
                    int remaining = totalitems--;
                    Console.WriteLine("Remaing records to parse : " + remaining);
                    if (remaining >= threshold)
                    { }
                    else
                    {
                        threshold = remaining;
                    }

                    var BVSObj = new ABS.DBModels.BudgetVersionGLAccounts();

                    BVSObj.TimePeriodID = item.TimePeriodID == null ? null : extimeperiods.Where(a => a.TimePeriodID == item.TimePeriodID.TimePeriodID).FirstOrDefault();//opTimePeriods.getTimePeriodObjbyID(item.TimePeriodID.TimePeriodID, _context);
                    BVSObj.BudgetVersion = item.BudgetVersion == null ? null : exbudgetversions.Where(a => a.BudgetVersionID == item.BudgetVersion.BudgetVersionID).FirstOrDefault();//opBudgetVersions.getBudgetVersionsObjbyID(item.BudgetVersion.BudgetVersionID, _context);
                    BVSObj.Entity = item.Entity == null ? null : exentities.Where(a => a.EntityID == item.Entity.EntityID).FirstOrDefault();// opEntities.getEntitiesObjbyID(item.Entity.EntityID, _context);
                    BVSObj.Department = item.Department == null ? null : exdepartments.Where(a => a.DepartmentID == item.Department.DepartmentID).FirstOrDefault();//opDepartments.getDepartmentObjbyID(item.Department.DepartmentID, _context);
                    BVSObj.GLAccount = item.GLAccount == null ? null : exglaccounts.Where(a => a.GLAccountID == item.GLAccount.GLAccountID).FirstOrDefault();// opStatisticsCodes.getstatisticsCodeObjbyID(item.StatisticsCodes.StatisticsCodeID, _context);
                    BVSObj.DataScenarioTypeID = item.DataScenarioTypeID == null ? null : exitemtypes.Where(a => a.ItemTypeID == item.DataScenarioTypeID.ItemTypeID).FirstOrDefault();// opItemTypes.getItemTypeObjbyID(item.DataScenarioTypeID.ItemTypeID, _context);

                    BVSObj.January = item.January ?? 0;
                    BVSObj.February = item.February ?? 0;
                    BVSObj.March = item.March ?? 0;
                    BVSObj.April = item.April ?? 0;
                    BVSObj.May = item.May ?? 0;
                    BVSObj.June = item.June ?? 0;
                    BVSObj.July = item.July ?? 0;
                    BVSObj.August = item.August ?? 0;
                    BVSObj.September = item.September ?? 0;
                    BVSObj.October = item.October ?? 0;
                    BVSObj.November = item.November ?? 0;
                    BVSObj.December = item.December ?? 0;
                    BVSObj.rowTotal = item.rowTotal ?? 0;

                    BVSObj.Identifier = Guid.NewGuid();
                    BVSObj.CreationDate = DateTime.UtcNow;
                    BVSObj.IsActive = true;
                    BVSObj.IsDeleted = false;

                    // BudgetingContext gcon = new BudgetingContext(_context);


                    //  cbData.Add(BVSObj);
                    _context.Add(BVSObj);
                    counter++;
                    if (counter >= threshold)
                    {
                        await _context.SaveChangesAsync();
                        counter = 0;
                    }


                }
                //  );

                //  await _context.BudgetVersionGLAccounts.AddRangeAsync(cbData);

                //// await _context.BulkSaveChangesAsync(operation => operation.BatchSize = 10000);
                // await _context.SaveChangesAsync();


                aPIResponse.status = "success";
                aPIResponse.message = "record saved successfully ";

                return aPIResponse;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                aPIResponse.status = "failed";
                aPIResponse.error = ex.StackTrace;
                aPIResponse.message = ex.Message;
                return aPIResponse;
            }
            finally
            {
                _context.ChangeTracker.AutoDetectChangesEnabled = true;

            }
        }
        public async static Task<ABS.DBModels.APIResponse> UpdateBudgetVersionsGLAccounts(JsonElement jsonString, BudgetingContext _context)
        {
            ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();
            try
            {
                if (jsonString.GetArrayLength() > 0)
                {
                    foreach (var item in jsonString.EnumerateArray())
                    {
                        var SSObj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.ToString());
                        SSObj = SSObj.ToDictionary(x => x.Key.ToUpper(), x => x.Value == null ? "" : x.Value);

                        string xid = HelperFunctions.CheckKeyValuePairs(SSObj, "DATAID").ToString();
                        var dataIDs = int.Parse(xid);

                        //_context.BudgetVersionGLAccounts.Include("DimensionsRowID").ToList();

                        var BVSObj = _context.BudgetVersionGLAccounts
                            .Where(f => f.StatisticID == dataIDs && f.IsActive == true && f.IsDeleted == false).FirstOrDefault();

                        if (BVSObj == null)
                        {

                        }
                        else
                        {
                            _context.Entry(BVSObj).State = EntityState.Modified;

                            BVSObj.January = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "JANUARY").ToString());
                            BVSObj.February = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "FEBRUARY").ToString());
                            BVSObj.March = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "MARCH").ToString());
                            BVSObj.April = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "APRIL").ToString());
                            BVSObj.May = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "MAY").ToString());
                            BVSObj.June = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "JUNE").ToString());
                            BVSObj.July = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "JULY").ToString());
                            BVSObj.August = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "AUGUST").ToString());
                            BVSObj.September = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "SEPTEMBER").ToString());
                            BVSObj.October = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "OCTOBER").ToString());
                            BVSObj.November = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "NOVEMBER").ToString());
                            BVSObj.December = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "DECEMBER").ToString());

                            BVSObj.Identifier = Guid.NewGuid();
                            BVSObj.UpdatedDate = DateTime.UtcNow;

                            // this value will be found if this update was triggered because of an association but not a manual update
                            // when a manual update has happened break any existing connection
                            if (HelperFunctions.CheckKeyValuePairs(SSObj, "AUTOMATICUPDATE").ToString() == "")
                            {
                                BVSObj.DimensionsRowID = null;
                            }

                            await _context.SaveChangesAsync();
                            aPIResponse.payload += BVSObj.StatisticID + ",";

                            
                        }
                    }
                }
                else
                {

                }

                aPIResponse.status = "success";
                aPIResponse.message = "record saved successfully ";

                return aPIResponse;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                aPIResponse.status = "failed";
                aPIResponse.error = ex.StackTrace;
                aPIResponse.message = ex.Message;
                return aPIResponse;
            }
        }


        public async static Task<GLContextClass> GetGLContext(int statisticalDataID, BudgetingContext _context)
        {
            if (statisticalDataID <1)
            { return null; }
            else
            {

            
            var bvsobjselect = await _context.BudgetVersionGLAccounts
                              .Where(f => f.StatisticID == statisticalDataID)
                              .Select(f => new GLContextClass(f.April, f.August
                              , f.BudgetVersion, f.StatisticID, f.DataScenarioDataID
                              , f.DataScenarioTypeID, f.December, f.Department, f.Entity
                              , f.DimensionsRowID
                              , f.February
                              , f.Identifier
                              , f.IsActive
                              , f.IsDeleted
                              , f.January
                              , f.GLAccount
                              , f.July
                              , f.June
                              , f.March
                              , f.May
                              , f.November
                              , f.October
                               , f.rowTotal
                              , f.RowVersion
                              , f.September
                              , f.TimePeriodID
                              , f.UpdateBy
                              , f.UpdatedDate
                              , f.CreatedBy
                              , f.CreationDate


                              ))
                              //.Select(f=>f)
                              .FirstOrDefaultAsync();


            return bvsobjselect;
            }
        }


        public static async Task<bool> UPdateAssociatedGLValues(string payload, IServiceScopeFactory serviceScopeFactory)
        {


            using (var scope = serviceScopeFactory.CreateScope())
            {

                var _context = scope.ServiceProvider.GetService<BudgetingContext>();

                Guid Jobguid = Guid.NewGuid();
                Logger.Loginfo("BG Job started for JobID: ", Jobguid.ToString());



                await Operations.opBGJobs.InsertBGJob("UpdateBudgetVersionGL_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Guid.Empty.ToString(), Jobguid, Jobguid.ToString(), _context);

 
                string[] payloaditems = payload.Split(",");

                bool jobstatus = true;

                foreach (var item in payloaditems)
                {

                    if (item == "")
                    {

                    }
                    else
                    {
                        int BVSTid = 0;
                        var ids = int.TryParse(item, out BVSTid);

                        if (BVSTid != 0)
                        {
                            var BVSTObj = await GetGLContext(BVSTid, _context);

                            var updateall = await UpdateAssociatedValues(BVSTObj, _context);
                            if (!updateall)
                            {
                                jobstatus = false;
                            }
                        }


                    }

                }

                if (jobstatus)
                {
                    await Operations.opBGJobs.UpdateBGJobs("SUCCESS", Jobguid, _context);

                }
                else
                {
                    await Operations.opBGJobs.UpdateBGJobs("FAILED", Jobguid, _context);

                }
                return true;
            }

        }

        public async static Task<bool> UpdateActualBVGLAccounts(StatisticalData statisticalDatarow, BudgetingContext _context)
        {
            try
            {
                /*
                 Get list of Actual BV records having same BV Type and Timeperiod and DatascenarioID
                 traverse the list and update accordingly.
                 if not exist create new
                 
                 */

                var actualItemtype = opItemTypes.getItemTypeObjbyKeywordCode("BUDGETVERSIONTYPE", "A", _context);

                if (statisticalDatarow != null)
                {

                    var budgetVersionGLAccounts = await _context._BudgetVersions
                                .Where(f =>
                                f.budgetVersionTypeID == actualItemtype
                                && f.IsDeleted == false
                                && f.IsActive == true
                                && f.TimePeriodID == statisticalDatarow.StatisticTimePeriod
                                && f.ADSgeneralLedgerID == statisticalDatarow.DataScenarioDataID
                                )
                                .ToListAsync();


                    foreach (var bvs in budgetVersionGLAccounts)
                    {

                        var BVSObj = await _context.BudgetVersionGLAccounts
                           .Where(f =>
                           f.BudgetVersion.BudgetVersionID == bvs.BudgetVersionID
                           && f.TimePeriodID == statisticalDatarow.StatisticTimePeriod
                           && f.DataScenarioDataID == statisticalDatarow.DataScenarioDataID
                           && f.DataScenarioTypeID == statisticalDatarow.DataScenarioTypeID
                           && f.Entity == statisticalDatarow.Entity
                           && f.Department == statisticalDatarow.Department
                           && f.GLAccount == statisticalDatarow.GlAccoutnID
                           && f.IsActive == true
                           && f.IsDeleted == false
                           )
                           .FirstOrDefaultAsync();





                        if (BVSObj == null)
                        {




                            BVSObj = new BudgetVersionGLAccounts();

                            BVSObj.BudgetVersion = bvs;
                            BVSObj.TimePeriodID = statisticalDatarow.StatisticTimePeriod;
                            BVSObj.DataScenarioDataID = statisticalDatarow.DataScenarioDataID;
                            BVSObj.DataScenarioTypeID = statisticalDatarow.DataScenarioTypeID;
                            BVSObj.Entity = statisticalDatarow.Entity;
                            BVSObj.Department = statisticalDatarow.Department;
                            BVSObj.GLAccount = statisticalDatarow.GlAccoutnID;
                            BVSObj.January = statisticalDatarow.January;
                            BVSObj.February = statisticalDatarow.February;
                            BVSObj.March = statisticalDatarow.January;
                            BVSObj.April = statisticalDatarow.April;
                            BVSObj.May = statisticalDatarow.May;
                            BVSObj.June = statisticalDatarow.June;
                            BVSObj.July = statisticalDatarow.July;
                            BVSObj.August = statisticalDatarow.August;
                            BVSObj.September = statisticalDatarow.September;
                            BVSObj.October = statisticalDatarow.October;
                            BVSObj.November = statisticalDatarow.November;
                            BVSObj.December = statisticalDatarow.December;
                            BVSObj.rowTotal = statisticalDatarow.Value;


                            BVSObj.Identifier = Guid.NewGuid();
                            BVSObj.CreationDate = DateTime.UtcNow;
                            BVSObj.UpdatedDate = DateTime.UtcNow;
                            BVSObj.IsActive = true;
                            BVSObj.IsDeleted = false;

                            _context.Add(BVSObj);
                        }
                        else
                        {
                            _context.Entry(BVSObj).State = EntityState.Modified;

                            BVSObj.January = statisticalDatarow.January;
                            BVSObj.February = statisticalDatarow.February;
                            BVSObj.March = statisticalDatarow.January;
                            BVSObj.April = statisticalDatarow.April;
                            BVSObj.May = statisticalDatarow.May;
                            BVSObj.June = statisticalDatarow.June;
                            BVSObj.July = statisticalDatarow.July;
                            BVSObj.August = statisticalDatarow.August;
                            BVSObj.September = statisticalDatarow.September;
                            BVSObj.October = statisticalDatarow.October;
                            BVSObj.November = statisticalDatarow.November;
                            BVSObj.December = statisticalDatarow.December;
                            BVSObj.rowTotal = statisticalDatarow.Value;


                            BVSObj.Identifier = Guid.NewGuid();
                            BVSObj.UpdatedDate = DateTime.UtcNow;


                        }


                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return false;
            }
        }

        internal async static Task<List<BudgetVersionGLAccounts>> GenerateObjects(List<StatisticalData> getallRecords, BudgetVersions bvRecord)
        {

            await Task.Delay(1);
            List<BudgetVersionGLAccounts> lstbvst = new List<BudgetVersionGLAccounts>();

            foreach (var item in getallRecords)
            {
                BudgetVersionGLAccounts bvst = new BudgetVersionGLAccounts();

                bvst.Entity = item.Entity;
                bvst.Department = item.Department;
                bvst.GLAccount = item.GlAccoutnID;
                bvst.BudgetVersion = bvRecord;
                bvst.TimePeriodID = item.StatisticTimePeriod;
                bvst.DataScenarioDataID = item.DataScenarioDataID;
                bvst.DataScenarioTypeID = item.DataScenarioTypeID;
                bvst.January = item.January;
                bvst.February = item.February;
                bvst.March = item.March;
                bvst.April = item.April;
                bvst.May = item.May;
                bvst.June = item.June;
                bvst.July = item.July;
                bvst.August = item.August;
                bvst.September = item.September;
                bvst.October = item.October;
                bvst.November = item.November;
                bvst.December = item.December;
                bvst.rowTotal = item.Value;
                bvst.IsActive = true;
                bvst.IsDeleted = false;
                bvst.CreationDate = DateTime.UtcNow;
                bvst.UpdatedDate = DateTime.UtcNow;


                lstbvst.Add(bvst);


            }

            return lstbvst;
        }
         internal async static Task<List<BudgetVersionGLAccounts>> GenerateObjects(List<BudgetVersionGLAccounts> getallRecords, BudgetVersions bvRecord)
        {

            await Task.Delay(1);
            List<BudgetVersionGLAccounts> lstbvst = new List<BudgetVersionGLAccounts>();

            foreach (var item in getallRecords)
            {
                BudgetVersionGLAccounts bvst = new BudgetVersionGLAccounts();

                bvst.Entity = item.Entity;
                bvst.Department = item.Department;
                bvst.GLAccount = item.GLAccount;
                bvst.BudgetVersion = bvRecord;
                bvst.TimePeriodID = item.TimePeriodID;
                bvst.DataScenarioDataID = item.DataScenarioDataID;
                bvst.DataScenarioTypeID = item.DataScenarioTypeID;
                bvst.January = item.January;
                bvst.February = item.February;
                bvst.March = item.March;
                bvst.April = item.April;
                bvst.May = item.May;
                bvst.June = item.June;
                bvst.July = item.July;
                bvst.August = item.August;
                bvst.September = item.September;
                bvst.October = item.October;
                bvst.November = item.November;
                bvst.December = item.December;
                bvst.rowTotal = item.rowTotal;
                bvst.IsActive = true;
                bvst.IsDeleted = false;
                bvst.CreationDate = DateTime.UtcNow;
                bvst.UpdatedDate = DateTime.UtcNow;


                lstbvst.Add(bvst);


            }

            return lstbvst;
        }



        public async Task<List<ABS.DBModels.BudgetVersionGLAccounts>> getGLAccounts(int budgetVersionID, string entity, string department, string glAccount, BudgetingContext context)
        {
            var _glAccounts = await context.BudgetVersionGLAccounts
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID && t.Entity.EntityID == int.Parse(entity) && t.Department.DepartmentID == int.Parse(department) && t.GLAccount.GLAccountID == int.Parse(glAccount) && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _glAccounts;
        }

        public async Task<List<ABS.DBModels.BudgetVersionGLAccounts>> getGLAccountByDimensionID(int dimensionsID, BudgetingContext context)
        {
            var _glAccounts = await context.BudgetVersionGLAccounts
                .Where(t => t.DimensionsRowID.DimensionsID == dimensionsID && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _glAccounts;
        }

        public static async Task<bool> UpdateAssociatedValues(BudgetVersionGLAccounts BVSObj, BudgetingContext _context)
        {
            Dictionary<int, string> monthDictionary = new Dictionary<int, string>()
            {
                {1, "January"},
                {2, "February"},
                {3, "March"},
                {4, "April"},
                {5, "May"},
                {6, "June"},
                {7, "July"},
                {8, "August"},
                {9, "September"},
                {10, "October"},
                {11, "November"},
                {12, "December"},
            };
            Operations.opItemTypes _opItemTypes = new Operations.opItemTypes();
            List<ItemTypes> months = await _opItemTypes.getItemTypeObjbyKeyword("MONTHS", _context);

            _context = getContext(_context);

            Dimensions driver = _context.Dimensions.Include("ForecastType").FirstOrDefault(dim =>
            dim.BudgetVersion == BVSObj.BudgetVersion &&
            dim.Entity == BVSObj.Entity &&
            dim.Department == BVSObj.Department &&
            dim.StatisticsCode == null &&
            dim.GLAccount == BVSObj.GLAccount &&
            dim.JobCode == null &&
            dim.PayType == null);

            if (driver == null)
            {
                return true;
            }

            Operations.opBudgetVersionStatistics opStatistics = new Operations.opBudgetVersionStatistics();
            Operations.opBudgetVersionGLAccounts opGLAccounts = new Operations.opBudgetVersionGLAccounts();
            Operations.opBudgetVersionStaffing opStaffing = new Operations.opBudgetVersionStaffing();
            dynamic data = null;

            var context = opBudgetVersionGLAccounts.getContext(_context);
            data = await opGLAccounts.getGLAccountByDimensionID(driver.DimensionsID, context);

            if (data.Count == 0)
            {
                context = opBudgetVersionStatistics.getContext(_context);
                data = await opStatistics.getStatisticsByDimensionID(driver.DimensionsID, context);
            }

            if (data.Count == 0)
            {
                context = opBudgetVersionStaffing.getContext(_context);
                data = await opStaffing.getStaffingByDimensionID(driver.DimensionsID, context);
            }

            if (data.Count == 0)
            {
                return true;
            }

            // these variables get the ItemType month based on fiscalStartMonth-XX and then the int value of that month based on the abbreviation
            ItemTypes startMonth = months.Where(m => m.ItemTypeValue == driver.SourceStartDate.ItemTypeValue).FirstOrDefault();
            int startMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(startMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;
            ItemTypes endMonth = months.Where(m => m.ItemTypeValue == driver.SourceEndDate.ItemTypeValue).FirstOrDefault();
            int endMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(endMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;

            int annualizationCount = 0;
            decimal annualizationSum = 0;
            decimal rowTotal = 0;

            foreach (ItemTypes month in months)
            {
                KeyValuePair<int, string> monthDicationaryItem = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault();
                // if the start month is less than the end month get all the values greater than or equal to start AND less than or equal to end, ex. 6 <= x >= 10
                // if the start month is greater than the end month get all the values greater than or equal to start OR less than or equal to end, ex. 10 <= x; 2 >= x
                if (!monthDicationaryItem.Equals(default(KeyValuePair<int, string>)) &&
                        ((startMonthValue <= endMonthValue && monthDicationaryItem.Key >= startMonthValue && monthDicationaryItem.Key <= endMonthValue) ||
                        (startMonthValue > endMonthValue && (monthDicationaryItem.Key >= startMonthValue || monthDicationaryItem.Key <= endMonthValue))))
                {
                    // copy and ratio do the same thing at this point because we already have a saved ratio to use
                    if (driver.ForecastType.ItemTypeValue == "Annualization")
                    {
                        if (driver.Seasonality)
                        {
                            decimal? newValue = (decimal?)BVSObj.GetType().GetProperty(monthDicationaryItem.Value).GetValue(BVSObj, null) * driver.Ratio;
                            PropertyInfo propertyInfo = data[0].GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                            propertyInfo.SetValue(data[0], newValue, null);
                            rowTotal += newValue ?? 0;
                        }
                        else
                        {
                            annualizationCount++;
                            annualizationSum += (decimal)data[0].GetType().GetProperty(monthDicationaryItem.Value).GetValue(BVSObj, null);
                        }
                    }
                    else
                    {
                        decimal? newValue = (decimal?)BVSObj.GetType().GetProperty(monthDicationaryItem.Value).GetValue(BVSObj, null) * driver.Ratio;
                        PropertyInfo propertyInfo = data[0].GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        propertyInfo.SetValue(data[0], newValue, null);
                        rowTotal += newValue ?? 0;
                    }
                }
                else
                {
                    rowTotal += (decimal?)BVSObj.GetType().GetProperty(monthDicationaryItem.Value).GetValue(BVSObj, null) ?? 0;
                }
            }

            if (driver.ForecastType.ItemTypeValue == "Annualization" && !driver.Seasonality)
            {
                // these variables get the ItemType month based on fiscalStartMonth-XX and then the int value of that month based on the abbreviation
                startMonth = months.Where(m => m.ItemTypeValue == driver.TargetStartDate.ItemTypeValue).FirstOrDefault();
                startMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(startMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;
                endMonth = months.Where(m => m.ItemTypeValue == driver.TargetEndDate.ItemTypeValue).FirstOrDefault();
                endMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(endMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;
                rowTotal = 0;
                foreach (ItemTypes month in months)
                {
                    KeyValuePair<int, string> monthDicationaryItem = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault();
                    // if the start month is less than the end month get all the values greater than or equal to start AND less than or equal to end, ex. 6 <= x >= 10
                    // if the start month is greater than the end month get all the values greater than or equal to start OR less than or equal to end, ex. 10 <= x; 2 >= x
                    if (!monthDicationaryItem.Equals(default(KeyValuePair<int, string>)) &&
                            ((startMonthValue <= endMonthValue && monthDicationaryItem.Key >= startMonthValue && monthDicationaryItem.Key <= endMonthValue) ||
                            (startMonthValue > endMonthValue && (monthDicationaryItem.Key >= startMonthValue || monthDicationaryItem.Key <= endMonthValue))))
                    {
                        decimal newValue = (annualizationSum / annualizationCount) * (driver.Ratio != null ? (decimal)driver.Ratio : 0);
                        PropertyInfo propertyInfo = data[0].GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        propertyInfo.SetValue(data[0], newValue, null);
                        rowTotal += newValue;
                    }
                    else
                    {
                        rowTotal += BVSObj.GetType().GetProperty(monthDicationaryItem.Value).GetValue(data[0], null);
                    }
                }
            }

            data[0].rowTotal = rowTotal;

            string json = JsonConvert.SerializeObject(data[0]);
            // this lets the update know it is not a manual change so the link isn't removed
            json = "[" + json.Replace("StatisticID", "AUTOMATICUPDATE\":\"true\",\"DATAID") + "]";
            JsonElement jsonElement = JsonDocument.Parse(json).RootElement;
            if (data[0].GetType() == typeof(BudgetVersionStatistics))
            {
                await opBudgetVersionStatistics.UpdateBudgetVersionsStatistics(jsonElement, _context);
            }
            else if (data[0].GetType() == typeof(BudgetVersionGLAccounts))
            {
                await UpdateBudgetVersionsGLAccounts(jsonElement, _context);
            }
            else
            {
                await opBudgetVersionStaffing.UpdateBudgetVersionStaffing(jsonElement, _context);
            }

            return true;
        }

        public static async Task<bool> UpdateAssociatedValues(GLContextClass BVSObj, BudgetingContext _context)
        {
            Dictionary<int, string> monthDictionary = new Dictionary<int, string>()
            {
                {1, "January"},
                {2, "February"},
                {3, "March"},
                {4, "April"},
                {5, "May"},
                {6, "June"},
                {7, "July"},
                {8, "August"},
                {9, "September"},
                {10, "October"},
                {11, "November"},
                {12, "December"},
            };
            Operations.opItemTypes _opItemTypes = new Operations.opItemTypes();
            List<ItemTypes> months = await _opItemTypes.getItemTypeObjbyKeyword("MONTHS", _context);

           // _context = getContext(_context);

            Dimensions driver = _context.Dimensions.Include("ForecastType").FirstOrDefault(dim =>
            dim.BudgetVersion == BVSObj.BudgetVersion &&
            dim.Entity == BVSObj.Entity &&
            dim.Department == BVSObj.Department &&
            dim.StatisticsCode == null &&
            dim.GLAccount == BVSObj.GLAccount &&
            dim.JobCode == null &&
            dim.PayType == null);

            if (driver == null)
            {
                return true;
            }

            Operations.opBudgetVersionStatistics opStatistics = new Operations.opBudgetVersionStatistics();
            Operations.opBudgetVersionGLAccounts opGLAccounts = new Operations.opBudgetVersionGLAccounts();
            Operations.opBudgetVersionStaffing opStaffing = new Operations.opBudgetVersionStaffing();
            dynamic data = null;

            var context = opBudgetVersionGLAccounts.getContext(_context);
            data = await opGLAccounts.getGLAccountByDimensionID(driver.DimensionsID, context);

            if (data.Count == 0)
            {
                context = opBudgetVersionStatistics.getContext(_context);
                data = await opStatistics.getStatisticsByDimensionID(driver.DimensionsID, context);
            }

            if (data.Count == 0)
            {
                context = opBudgetVersionStaffing.getContext(_context);
                data = await opStaffing.getStaffingByDimensionID(driver.DimensionsID, context);
            }

            if (data.Count == 0)
            {
                return true;
            }

            // these variables get the ItemType month based on fiscalStartMonth-XX and then the int value of that month based on the abbreviation
            ItemTypes startMonth = months.Where(m => m.ItemTypeValue == driver.SourceStartDate.ItemTypeValue).FirstOrDefault();
            int startMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(startMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;
            ItemTypes endMonth = months.Where(m => m.ItemTypeValue == driver.SourceEndDate.ItemTypeValue).FirstOrDefault();
            int endMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(endMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;

            int annualizationCount = 0;
            decimal annualizationSum = 0;
            decimal rowTotal = 0;

            foreach (ItemTypes month in months)
            {
                KeyValuePair<int, string> monthDicationaryItem = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault();
                // if the start month is less than the end month get all the values greater than or equal to start AND less than or equal to end, ex. 6 <= x >= 10
                // if the start month is greater than the end month get all the values greater than or equal to start OR less than or equal to end, ex. 10 <= x; 2 >= x
                if (!monthDicationaryItem.Equals(default(KeyValuePair<int, string>)) &&
                        ((startMonthValue <= endMonthValue && monthDicationaryItem.Key >= startMonthValue && monthDicationaryItem.Key <= endMonthValue) ||
                        (startMonthValue > endMonthValue && (monthDicationaryItem.Key >= startMonthValue || monthDicationaryItem.Key <= endMonthValue))))
                {
                    // copy and ratio do the same thing at this point because we already have a saved ratio to use
                    if (driver.ForecastType.ItemTypeValue == "Annualization")
                    {
                        if (driver.Seasonality)
                        {
                            decimal? newValue = (decimal?)BVSObj.GetType().GetProperty(monthDicationaryItem.Value).GetValue(BVSObj, null) * driver.Ratio;
                            PropertyInfo propertyInfo = data[0].GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                            propertyInfo.SetValue(data[0], newValue, null);
                            rowTotal += newValue ?? 0;
                        }
                        else
                        {
                            annualizationCount++;
                            annualizationSum += (decimal)data[0].GetType().GetProperty(monthDicationaryItem.Value).GetValue(BVSObj, null);
                        }
                    }
                    else
                    {
                        decimal? newValue = (decimal?)BVSObj.GetType().GetProperty(monthDicationaryItem.Value).GetValue(BVSObj, null) * driver.Ratio;
                        PropertyInfo propertyInfo = data[0].GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        propertyInfo.SetValue(data[0], newValue, null);
                        rowTotal += newValue ?? 0;
                    }
                }
                else
                {
                    rowTotal += (decimal?)BVSObj.GetType().GetProperty(monthDicationaryItem.Value).GetValue(BVSObj, null) ?? 0;
                }
            }

            if (driver.ForecastType.ItemTypeValue == "Annualization" && !driver.Seasonality)
            {
                // these variables get the ItemType month based on fiscalStartMonth-XX and then the int value of that month based on the abbreviation
                startMonth = months.Where(m => m.ItemTypeValue == driver.TargetStartDate.ItemTypeValue).FirstOrDefault();
                startMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(startMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;
                endMonth = months.Where(m => m.ItemTypeValue == driver.TargetEndDate.ItemTypeValue).FirstOrDefault();
                endMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(endMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;
                rowTotal = 0;
                foreach (ItemTypes month in months)
                {
                    KeyValuePair<int, string> monthDicationaryItem = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault();
                    // if the start month is less than the end month get all the values greater than or equal to start AND less than or equal to end, ex. 6 <= x >= 10
                    // if the start month is greater than the end month get all the values greater than or equal to start OR less than or equal to end, ex. 10 <= x; 2 >= x
                    if (!monthDicationaryItem.Equals(default(KeyValuePair<int, string>)) &&
                            ((startMonthValue <= endMonthValue && monthDicationaryItem.Key >= startMonthValue && monthDicationaryItem.Key <= endMonthValue) ||
                            (startMonthValue > endMonthValue && (monthDicationaryItem.Key >= startMonthValue || monthDicationaryItem.Key <= endMonthValue))))
                    {
                        decimal newValue = (annualizationSum / annualizationCount) * (driver.Ratio != null ? (decimal)driver.Ratio : 0);
                        PropertyInfo propertyInfo = data[0].GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        propertyInfo.SetValue(data[0], newValue, null);
                        rowTotal += newValue;
                    }
                    else
                    {
                        rowTotal += BVSObj.GetType().GetProperty(monthDicationaryItem.Value).GetValue(data[0], null);
                    }
                }
            }

            data[0].rowTotal = rowTotal;

            string json = JsonConvert.SerializeObject(data[0]);
            // this lets the update know it is not a manual change so the link isn't removed
            json = "[" + json.Replace("StatisticID", "AUTOMATICUPDATE\":\"true\",\"DATAID") + "]";
            JsonElement jsonElement = JsonDocument.Parse(json).RootElement;
            if (data[0].GetType() == typeof(BudgetVersionStatistics))
            {
                await opBudgetVersionStatistics.UpdateBudgetVersionsStatistics(jsonElement, _context);
            }
            else if (data[0].GetType() == typeof(BudgetVersionGLAccounts))
            {
                await UpdateBudgetVersionsGLAccounts(jsonElement, _context);
            }
            else
            {
                await opBudgetVersionStaffing.UpdateBudgetVersionStaffing(jsonElement, _context);
            }

            return true;
        }



    }

  
}