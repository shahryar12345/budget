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
using AutoMapper;
using ABS.DBModels.Models.ContextClasses;
using Microsoft.Extensions.DependencyInjection;

namespace ABSDAL.Operations
{
    public class opBudgetVersionStaffing
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
            _context.BudgetVersionStaffing.Include(a => a.Entity).ToList();
            _context.BudgetVersionStaffing.Include(a => a.Department).ToList();
            _context.BudgetVersionStaffing.Include(a => a.JobCode).ToList();
            _context.BudgetVersionStaffing.Include(a => a.PayType).ToList();
            _context.BudgetVersionStaffing.Include(a => a.TimePeriodID).ToList();
            _context.BudgetVersionStaffing.Include(a => a.BudgetVersion).ToList();
            _context.BudgetVersionStaffing.Include(a => a.DataScenarioTypeID).ToList();
            _context.BudgetVersionStaffing.Include(a => a.StaffingDataType).ToList();
            _context.BudgetVersionStaffing.Include(a => a.DimensionsRowID).ToList();

            return _context;
        }

        public class DataScenarioView
        {
            public string DataScenarioID { get; set; }
        }
        public async static Task<ABS.DBModels.APIResponse> AddBudgetVersionsStaffing(JsonElement jsonString, BudgetingContext _context)
        {
            ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();
            try
            {

               
                object[] values = JsonConvert.DeserializeObject<object[]>(jsonString.ToString());

                if (values.Length == 0)
                {
                    return aPIResponse;
                }
                else
                   if (values.Length > 1)
                {
                    var delobj = JsonConvert.DeserializeObject<Dictionary<string, object>>(values[0].ToString());

                    if (HelperFunctions.CheckKeyValuePairs(delobj, "budgetVersionId").ToString() == "")

                    {


                    }
                    else
                    {
                        string bvid = delobj["budgetVersionId"].ToString();
                        int bvIDint = int.Parse(bvid);
                        _context.BudgetVersionStaffing.RemoveRange  (_context.BudgetVersionStaffing
                            .Where(bv => bv.BudgetVersion.BudgetVersionID == bvIDint 
                            && bv.BudgetVersion.budgetVersionTypeID.ItemTypeCode == "A"));

                    }

                }




                var extimeperiods = _context.TimePeriods.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exbudgetversions = _context._BudgetVersions.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exentities = _context.Entities.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exdepartments = _context.Departments.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exjobcodes = _context.JobCodes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var expaytypes = _context.PayTypes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exitemtypes = _context._ItemTypes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exDataScenario = _context.DataScenarios.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();

                ConcurrentBag<ABS.DBModels.BudgetVersionStaffing> cbData = new ConcurrentBag<ABS.DBModels.BudgetVersionStaffing>();

                int totalitems = values.Length;

                int counter = 0;
                //  Parallel.ForEach(jObject, async (item) =>

                int threshold = totalitems  ;

               // bool savedOnce = false;

                _context.ChangeTracker.AutoDetectChangesEnabled = false;

                foreach (var jsonItem in values)
                {

                    var item = Newtonsoft.Json.JsonConvert.DeserializeObject<ABS.DBModels.BudgetVersionStaffing>(jsonItem.ToString());
                    if (item == null) return aPIResponse;

                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonItem.ToString());

                    var BVSObj = new ABS.DBModels.BudgetVersionStaffing();

                    ABS.DBModels.BudgetVersions bv = new ABS.DBModels.BudgetVersions();

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "budgetVersionId").ToString() == "")

                    {
                        bv = item.BudgetVersion;

                    }
                    else
                    {
                        bv = exbudgetversions.Where(f =>
                        f.BudgetVersionID == (int.Parse(arrval["budgetVersionId"].ToString()))
                        && f.IsDeleted == false
                        && f.IsActive == true).FirstOrDefault();
                    }

                    ABS.DBModels.PayTypes pt = new ABS.DBModels.PayTypes();

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "paytypecode").ToString() == "")

                    {
                        pt = item.PayType;

                    }
                    else
                    {
                        pt = expaytypes.Where(f =>
                        f.PayTypeCode == (arrval["paytypecode"].ToString())
                        && f.IsDeleted == false
                        && f.IsActive == true).FirstOrDefault();
                    }


                    ABS.DBModels.JobCodes jc = new ABS.DBModels.JobCodes();

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "jobcodecode").ToString() == "")

                    {
                        jc = item.JobCode;

                    }
                    else
                    {
                        jc = exjobcodes.Where(f =>
                        f.JobCodeCode == (arrval["jobcodecode"].ToString())
                        && f.IsDeleted == false
                        && f.IsActive == true).FirstOrDefault();
                    }


                    ABS.DBModels.DataScenario ds = new ABS.DBModels.DataScenario();

                    if (item.DataScenarioID != null)
                    {
                        ds = exDataScenario.Where(d => d.DataScenarioID == item.DataScenarioID.DataScenarioID).FirstOrDefault();
                    }
                     

                    ABS.DBModels.ItemTypes it = new ABS.DBModels.ItemTypes();

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "staffingaccounttypeid").ToString() == "")
                    {
                        it = item.StaffingDataType;

                    }
                    else
                    {
                        it = exitemtypes.Where(f =>
                        f.ItemTypeID == int.Parse(arrval["staffingaccounttypeid"].ToString())
                        && f.IsDeleted == false
                        && f.IsActive == true).FirstOrDefault();
                    }



                    BVSObj.TimePeriodID = item.TimePeriodID == null ? null : extimeperiods.Where(a => a.TimePeriodID == item.TimePeriodID.TimePeriodID).FirstOrDefault();//opTimePeriods.getTimePeriodObjbyID(item.TimePeriodID.TimePeriodID, _context);
                    if (bv != null) { BVSObj.BudgetVersion = bv; }
                    BVSObj.Entity = item.Entity == null ? null : exentities.Where(a => a.EntityID == item.Entity.EntityID).FirstOrDefault();// opEntities.getEntitiesObjbyID(item.Entity.EntityID, _context);
                    BVSObj.Department = item.Department == null ? null : exdepartments.Where(a => a.DepartmentID == item.Department.DepartmentID).FirstOrDefault();//opDepartments.getDepartmentObjbyID(item.Department.DepartmentID, _context);
                    if (jc != null) { BVSObj.JobCode = jc; }
                    if (pt != null) { BVSObj.PayType = pt; }
                    BVSObj.DataScenarioTypeID = item.DataScenarioTypeID == null ? null : exitemtypes.Where(a => a.ItemTypeID == item.DataScenarioTypeID.ItemTypeID).FirstOrDefault();// opItemTypes.getItemTypeObjbyID(item.DataScenarioTypeID.ItemTypeID, _context);
                    if (it != null)
                    {
                        BVSObj.StaffingDataType = it;
                    }

                    if (ds != null)
                    {
                        BVSObj.DataScenarioID = ds;
                    }
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
                    BVSObj.wageRateOverride = item.wageRateOverride ?? 0;

                    BVSObj.Identifier = Guid.NewGuid();
                    BVSObj.CreationDate = DateTime.UtcNow;
                    BVSObj.UpdatedDate = DateTime.UtcNow;
                    BVSObj.IsActive = true;
                    BVSObj.IsDeleted = false;


                    // cbData.Add(BVSObj);
                    // await _context.BudgetVersionStaffing.AddRangeAsync(cbData);
                    _context.Add(BVSObj);
                   
                    int currentcount = totalitems--;
                    if (currentcount < threshold)
                    { threshold = currentcount * (25 / 100); }
                    Console.WriteLine($"%%%% Remaining Records : " + currentcount);

                    counter++;
                    if (counter < threshold)
                    {


                    }
                    else
                    {
                        await _context.SaveChangesAsync();
                        counter = 0;
                    }
                }
                //  );

                //await _context.BudgetVersionStaffing.AddRangeAsync(cbData);
                //await _context.SaveChangesAsync();

                //await _context.BulkSaveChangesAsync(operation => operation.BatchSize = 10000);
                //if (!savedOnce)
                //{ 
                //    await _context.SaveChangesAsync();
                //}



                aPIResponse.status = "success";
                // aPIResponse.payload = .BudgetVersionID.ToString();
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
        public async static Task<ABS.DBModels.APIResponse> UpdateBudgetVersionStaffing(JsonElement jsonString, BudgetingContext _context)
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

                        //_context.BudgetVersionStaffing.Include("DimensionsRowID").ToList();

                        var BVSObj = _context.BudgetVersionStaffing
                            .Where(f => f.BudgetVersionStaffingID == dataIDs && f.IsActive == true && f.IsDeleted == false).FirstOrDefault();

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
                            //BVSObj.rowTotal = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "ROWTOTAL").ToString());
                            if (HelperFunctions.CheckKeyValuePairs(SSObj, "ROWTOTAL").ToString() != "")
                            {
                                BVSObj.rowTotal = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "ROWTOTAL").ToString());
                            }
                            
                            if (HelperFunctions.CheckKeyValuePairs(SSObj, "WAGERATEOVERRIDE").ToString() != "")
                            {
                                BVSObj.wageRateOverride = decimal.Parse(HelperFunctions.CheckKeyValuePairs(SSObj, "WAGERATEOVERRIDE").ToString());
                            }

                            BVSObj.Identifier = Guid.NewGuid();
                            BVSObj.UpdatedDate = DateTime.UtcNow;

                            // this value will be found if this update was triggered because of an association but not a manual update
                            // when a manual update has happened break any existing connection
                            if (HelperFunctions.CheckKeyValuePairs(SSObj, "AUTOMATICUPDATE").ToString() == "")
                            {
                                BVSObj.DimensionsRowID = null;
                            }



                            //_context.Add(BVSObj);
                            //await _context.SaveChangesAsync();
                            await _context.SaveChangesAsync();
                            aPIResponse.payload += BVSObj.BudgetVersionStaffingID + ",";


                        }
                    }
                }
                else
                {











                }

                // await _context.SaveChangesAsync();









                aPIResponse.status = "success";
                // aPIResponse.payload = .BudgetVersionID.ToString();
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

        public  static async Task<bool> UPdateAssociatedSFValues(string payload, IServiceScopeFactory serviceScopeFactory)
        {


            using (var scope = serviceScopeFactory.CreateScope())
            {

                var _context = scope.ServiceProvider.GetService<BudgetingContext>();

                Guid Jobguid = Guid.NewGuid();
                Logger.Loginfo("BG Job started for JobID: ", Jobguid.ToString());



                await Operations.opBGJobs.InsertBGJob("UpdateBudgetVersionStaffing_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Guid.Empty.ToString(), Jobguid, Jobguid.ToString(), _context);

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
                            var BVSTObj = await GetSFContext(BVSTid, _context);

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

        public async Task<List<ABS.DBModels.BudgetVersionStaffing>> getStaffingByDimensionID(int dimensionsID, BudgetingContext context)
        {
            var _staffing = await context.BudgetVersionStaffing
                .Where(t => t.DimensionsRowID.DimensionsID == dimensionsID && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _staffing;
        }

        public static async Task<bool> UpdateAssociatedValues(BudgetVersionStaffing BVSObj, BudgetingContext _context)
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

            Dimensions driver = _context.Dimensions.Include("ForecastType")
                .FirstOrDefault(dim =>
            dim.BudgetVersion == BVSObj.BudgetVersion &&
            dim.Entity == BVSObj.Entity &&
            dim.Department == BVSObj.Department &&
            dim.StatisticsCode == null &&
            dim.GLAccount == null &&
            dim.JobCode == BVSObj.JobCode &&
            dim.PayType == BVSObj.PayType);

            if (driver == null)
            {
                return true;
            }

            Operations.opBudgetVersionStatistics opStatistics = new Operations.opBudgetVersionStatistics();
            Operations.opBudgetVersionGLAccounts opGLAccounts = new Operations.opBudgetVersionGLAccounts();
            Operations.opBudgetVersionStaffing opStaffing = new Operations.opBudgetVersionStaffing();
            dynamic data = null;

            var context = opBudgetVersionStatistics.getContext(_context);
            data = await opStatistics.getStatisticsByDimensionID(driver.DimensionsID, context);

            if (data.Count == 0)
            {
                context = opBudgetVersionGLAccounts.getContext(_context);
                data = await opGLAccounts.getGLAccountByDimensionID(driver.DimensionsID, context);
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
                await opBudgetVersionGLAccounts.UpdateBudgetVersionsGLAccounts(jsonElement, _context);
            }
            else
            {
                await UpdateBudgetVersionStaffing(jsonElement, _context);
            }

            return true;
        }

        public static async Task<bool> UpdateAssociatedValues(SFContextClass BVSObj, BudgetingContext _context)
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

            Dimensions driver = _context.Dimensions.Include("ForecastType")
                .FirstOrDefault(dim =>
            dim.BudgetVersion == BVSObj.BudgetVersion &&
            dim.Entity == BVSObj.Entity &&
            dim.Department == BVSObj.Department &&
            dim.StatisticsCode == null &&
            dim.GLAccount == null &&
            dim.JobCode == BVSObj.JobCode &&
            dim.PayType == BVSObj.PayType);

            if (driver == null)
            {
                return true;
            }

            Operations.opBudgetVersionStatistics opStatistics = new Operations.opBudgetVersionStatistics();
            Operations.opBudgetVersionGLAccounts opGLAccounts = new Operations.opBudgetVersionGLAccounts();
            Operations.opBudgetVersionStaffing opStaffing = new Operations.opBudgetVersionStaffing();
            dynamic data = null;

            var context = opBudgetVersionStatistics.getContext(_context);
            data = await opStatistics.getStatisticsByDimensionID(driver.DimensionsID, context);

            if (data.Count == 0)
            {
                context = opBudgetVersionGLAccounts.getContext(_context);
                data = await opGLAccounts.getGLAccountByDimensionID(driver.DimensionsID, context);
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
                await opBudgetVersionGLAccounts.UpdateBudgetVersionsGLAccounts(jsonElement, _context);
            }
            else
            {
                await UpdateBudgetVersionStaffing(jsonElement, _context);
            }

            return true;
        }

        public async static Task<SFContextClass> GetSFContext(int BVstaffingdataid, BudgetingContext _context)
        {
            var bvsobjselect = await _context.BudgetVersionStaffing
                              .Where(f => f.BudgetVersionStaffingID == BVstaffingdataid)
                              .Select(f => new SFContextClass(f.April, f.August, f.BudgetVersion, f.BudgetVersionStaffingID, f.DataScenarioID
                              , f.DataScenarioTypeID, f.December, f.Department, f.Entity
                              , f.DimensionsRowID
                              , f.February
                              , f.Identifier
                              , f.IsActive
                              , f.IsDeleted
                              , f.January
                              , f.JobCode
                              , f.July
                              , f.June
                              , f.March
                              , f.May
                              , f.November
                              , f.October
                              , f.PayType
                              , f.rowTotal
                              , f.RowVersion
                              , f.September
                              , f.StaffingDataType
                              , f.TimePeriodID
                              , f.UpdateBy
                              , f.UpdatedDate
                              , f.wageRateOverride
                              , f.CreationDate
                              , f.CreatedBy

                              ))
                              //.Select(f=>f)
                              .FirstOrDefaultAsync();

            
            return bvsobjselect;
        }

        public async static Task<bool> UpdateActualBVStaffingAccounts(StaffingData staffingdata, BudgetingContext _context)
        {
            try
            {
                /*
                 Get list of Actual BV records having same BV Type and Timeperiod and DatascenarioID
                 traverse the list and update accordingly.
                 if not exist create new
                 
                 */

                var actualItemtype = opItemTypes.getItemTypeObjbyKeywordCode("BUDGETVERSIONTYPE", "A", _context);

                if (staffingdata != null)
                {

                    var budgetVersionStaffingAccounts = await _context._BudgetVersions
                                .Where(f =>
                                f.budgetVersionTypeID == actualItemtype
                                && f.IsDeleted == false
                                && f.IsActive == true
                                && f.TimePeriodID == staffingdata.StaffingTimePeriod
                                && f.ADSstaffingID == staffingdata.DataScenarioID1
                                )
                                .ToListAsync();


                    foreach (var bvs in budgetVersionStaffingAccounts)
                    {

                        var BVSObj = await _context.BudgetVersionStaffing
                           .Where(f =>
                           f.BudgetVersion.BudgetVersionID == bvs.BudgetVersionID
                           && f.TimePeriodID == staffingdata.StaffingTimePeriod
                           && f.DataScenarioID == staffingdata.DataScenarioID1
                           && f.DataScenarioTypeID == staffingdata.DataScenarioTypeID
                           && f.StaffingDataType.ItemTypeID == int.Parse(staffingdata.StaffingAccountTypeID.ToString())
                           && f.Entity == staffingdata.Entity
                           && f.Department == staffingdata.Department
                           && f.JobCode == staffingdata.JobCode
                           && f.PayType== staffingdata.PayType

                           && f.IsActive == true
                           && f.IsDeleted == false
                           )
                           .FirstOrDefaultAsync();


                        if (BVSObj == null)
                        {

                            BVSObj = new BudgetVersionStaffing();

                            BVSObj.BudgetVersion = bvs;
                            BVSObj.TimePeriodID = staffingdata.StaffingTimePeriod;
                            BVSObj.DataScenarioID = staffingdata.DataScenarioID1;
                            BVSObj.DataScenarioTypeID = staffingdata.DataScenarioTypeID;
                            BVSObj.StaffingDataType.ItemTypeID = int.Parse(staffingdata.StaffingAccountTypeID.ToString());
                            BVSObj.Entity = staffingdata.Entity;
                            BVSObj.Department = staffingdata.Department;
                            BVSObj.JobCode = staffingdata.JobCode;
                            BVSObj.PayType = staffingdata.PayType;

                             BVSObj.January = staffingdata.January;
                            BVSObj.February = staffingdata.February;
                            BVSObj.March = staffingdata.January;
                            BVSObj.April = staffingdata.April;
                            BVSObj.May = staffingdata.May;
                            BVSObj.June = staffingdata.June;
                            BVSObj.July = staffingdata.July;
                            BVSObj.August = staffingdata.August;
                            BVSObj.September = staffingdata.September;
                            BVSObj.October = staffingdata.October;
                            BVSObj.November = staffingdata.November;
                            BVSObj.December = staffingdata.December;
                            BVSObj.rowTotal = staffingdata.Value;


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

                            BVSObj.January = staffingdata.January;
                            BVSObj.February = staffingdata.February;
                            BVSObj.March = staffingdata.January;
                            BVSObj.April = staffingdata.April;
                            BVSObj.May = staffingdata.May;
                            BVSObj.June = staffingdata.June;
                            BVSObj.July = staffingdata.July;
                            BVSObj.August = staffingdata.August;
                            BVSObj.September = staffingdata.September;
                            BVSObj.October = staffingdata.October;
                            BVSObj.November = staffingdata.November;
                            BVSObj.December = staffingdata.December;
                            BVSObj.rowTotal = staffingdata.Value;


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

        internal async static Task<List<BudgetVersionStaffing>> GenerateObjects(List<StaffingData> getallRecords, BudgetVersions bvRecord,  List<ItemTypes> lstitemtypes)
        {

            await Task.Delay(1);
            List<BudgetVersionStaffing> lstbvst = new List<BudgetVersionStaffing>();
            foreach (var item in getallRecords)
            {
                BudgetVersionStaffing bvst = new BudgetVersionStaffing();

                bvst.Entity = item.Entity;
                bvst.Department = item.Department;
                bvst.JobCode = item.JobCode;
                bvst.PayType = item.PayType;
                bvst.BudgetVersion = bvRecord;
                bvst.TimePeriodID = item.StaffingTimePeriod;
                bvst.DataScenarioID = item.DataScenarioID1;
                bvst.DataScenarioTypeID = item.DataScenarioTypeID;
                bvst.StaffingDataType = lstitemtypes.Where(f=>f.ItemTypeID ==  int.Parse(item.StaffingAccountTypeID.ToString() )).FirstOrDefault();
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
        internal async static Task<List<BudgetVersionStaffing>> GenerateObjects(List<BudgetVersionStaffing> getallRecords, BudgetVersions bvRecord, List<ItemTypes> lstitemtypes)
        {

            await Task.Delay(1);
            List<BudgetVersionStaffing> lstbvst = new List<BudgetVersionStaffing>();
            foreach (var item in getallRecords)
            {
                BudgetVersionStaffing bvst = new BudgetVersionStaffing();

                bvst.Entity = item.Entity;
                bvst.Department = item.Department;
                bvst.JobCode = item.JobCode;
                bvst.PayType = item.PayType;
                bvst.BudgetVersion = bvRecord;
                bvst.TimePeriodID = item.TimePeriodID;
                bvst.DataScenarioID = item.DataScenarioID;
                bvst.DataScenarioTypeID = item.DataScenarioTypeID;
                bvst.StaffingDataType = lstitemtypes.Where(f => f.ItemTypeID == int.Parse(item.StaffingDataType.ItemTypeID.ToString())).FirstOrDefault();
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


    }


}
