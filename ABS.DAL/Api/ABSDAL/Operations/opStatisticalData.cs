using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
namespace ABSDAL.Operations

{
    public class opStatisticalData
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {



            _context.StatisticalData
                .Include(a => a.Entity)
            .Include(a => a.Department)
            .Include(a => a.StatisticCode)
            .Include(a => a.StatisticTimePeriod)
            .Include(a => a.FiscalYearID)
            .Include(a => a.FiscalYearMonthID)
            .Include(a => a.DataSourcceID)

            .Include(a => a.DataScenarioTypeID)

            .Include(a => a.GlAccoutnID)
            .Include(a => a.GLAccountMasterID)
            .Include(a => a.GLAccountTypeID)

            .ToList();


            return _context;






        }

        public static BudgetingContext getSourceDataContext(BudgetingContext _context)
        {



            _context.StaffingData.Include(a => a.Entity).ToList();
            _context.StaffingData.Include(a => a.Department).ToList();
            _context.StaffingData.Include(a => a.PayType).ToList();
            _context.StaffingData.Include(a => a.JobCode).ToList();
            _context.StaffingData.Include(a => a.StaffingTimePeriod).ToList();
            _context.StaffingData.Include(a => a.DataScenarioID1).ToList();

            _context.StaffingData.Include(a => a.DataScenarioTypeID).ToList();
            _context.StaffingData.Include(a => a.FiscalMonth).ToList();
            _context.StaffingData.Include(a => a.FiscalYear).ToList();





            return _context;






        }


        public static async Task<ABS.DBModels.APIResponse> StatisticsDataBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;


                var extimeperiods = _context.TimePeriods.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exDataScenarios = _context.DataScenarios.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exentities = _context.Entities.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exdepartments = _context.Departments.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exGLAccounts = _context.GLAccounts.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exstatisticCodes = _context.StatisticsCodes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var exitemTypes = _context._ItemTypes.Where(i => i.IsActive == true && i.IsDeleted == false).ToList();
                var existingStatisticalData = await _context.StatisticalData.Where(d => d.IsActive == true && d.IsDeleted == false).ToListAsync();
                var updateAllActualBV = opItemTypes.getUpdateAllActualBV(_context);


                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                _context.ChangeTracker.AutoDetectChangesEnabled = false;
                int dbthreshold = opItemTypes.getProcessingThreshold(_context);
                ITUpdate.totalCount = values.Count();
                int totalitems = values.Count();
                if (totalitems < dbthreshold)
                {
                    dbthreshold = totalitems;
                }
                else
                {


                }
                int counter = 0;
                int remainingRecords = totalitems;
                foreach (var item in values)
                {



                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());

                    ABS.DBModels.TimePeriods tpname = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "timePeriodName").ToString() == "")

                    {
                        errorones++;
                        continue;
                    }
                    else
                    {
                        tpname = extimeperiods.Where(a => a.TimePeriodCode == arrval["timePeriodName"].ToString()).FirstOrDefault();
                    }
                    string datascenariotype = "";
                    ABS.DBModels.ItemTypes statisticDataScenario = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "DataScenario").ToString() == "")

                    {
                        errorones++;
                        //   continue;
                    }
                    else
                    {
                        datascenariotype = arrval["DataScenario"].ToString();

                        statisticDataScenario = exitemTypes.Where(a => a.ItemTypeKeyword == "SCENARIOTYPE"
                        && a.ItemTypeCode == arrval["DataScenario"].ToString()).FirstOrDefault();
                    }
                    ABS.DBModels.Entities entitydt = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "entityCode").ToString() == "")

                    {
                        errorones++;
                        continue;
                    }
                    else
                    {
                        entitydt = exentities.Where(a => a.EntityCode == arrval["entityCode"].ToString()).FirstOrDefault();
                    }


                    ABS.DBModels.Departments departmentdt = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "deptCode").ToString() == "")

                    {
                        errorones++;
                        continue;
                    }
                    else
                    {
                        departmentdt = exdepartments.Where(a => a.DepartmentCode == arrval["deptCode"].ToString()).FirstOrDefault();
                    }
                    ABS.DBModels.StatisticsCodes statscodedt = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "costingActivityCode").ToString() == "")

                    {
                        errorones++;
                        //continue;
                    }
                    else
                    {
                        statscodedt = exstatisticCodes.Where(a => a.StatisticsCode == arrval["costingActivityCode"].ToString()).FirstOrDefault();
                    }


                    ABS.DBModels.DataScenario STdataScenarioID = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "costingActivityDataScenarioName").ToString() == "")

                    {
                        errorones++;
                        //    continue;
                    }
                    else
                    {
                        STdataScenarioID = exDataScenarios.Where(a => a.DataScenarioCode == arrval["costingActivityDataScenarioName"].ToString()).FirstOrDefault();
                    }


                    ABS.DBModels.DataScenario GLdataScenarioID = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "glDataScenarioDescription").ToString() == "")

                    {
                        errorones++;
                        //    continue;
                    }
                    else
                    {
                        GLdataScenarioID = exDataScenarios.Where(a => a.DataScenarioCode == arrval["glDataScenarioDescription"].ToString()).FirstOrDefault();
                    }




                    ABS.DBModels.GLAccounts glAccountID = null;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "glAccountCode").ToString() == "")

                    {
                        errorones++;
                        //    continue;
                    }
                    else
                    {
                        glAccountID = exGLAccounts.Where(a => a.GLAccountCode == arrval["glAccountCode"].ToString()).FirstOrDefault();
                    }
                    decimal totalvalue = decimal.Zero;
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "total").ToString() == "")

                    {
                        errorones++;
                        //    continue;
                    }
                    else
                    {
                        totalvalue = decimal.Parse(arrval["total"].ToString());
                    }



                    Dictionary<string, decimal> monthvalues = new Dictionary<string, decimal>();

                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month1Year", "month1Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month2Year", "month2Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month3Year", "month3Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month4Year", "month4Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month5Year", "month5Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month6Year", "month6Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month7Year", "month7Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month8Year", "month8Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month9Year", "month9Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month10Year", "month10Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month11Year", "month11Value");
                    HelperFunctions.PopulateDictionary(monthvalues, arrval, "month12Year", "month12Value");

                    if (monthvalues.Count < 12)
                    {
                        foreach (var Monthnames in ABS.DBModels.Models.MonthNames.monthDictionary)
                        {
                            if (monthvalues.ContainsKey(Monthnames.Value))
                            {

                            }
                            else
                            {

                                monthvalues.Add(Monthnames.Value, decimal.Zero);
                            }
                        }

                    }



                    ABS.DBModels.StatisticalData nStatisticalData = new ABS.DBModels.StatisticalData();

                    nStatisticalData.CreationDate = DateTime.UtcNow;
                    nStatisticalData.UpdatedDate = DateTime.UtcNow;
                    nStatisticalData.IsActive = true;
                    nStatisticalData.IsDeleted = false;
                    nStatisticalData.Identifier = Guid.NewGuid();

                    if (tpname != null)
                    {
                        nStatisticalData.StatisticTimePeriod = tpname;
                    }

                    if (entitydt != null)
                    {
                        nStatisticalData.Entity = entitydt;
                    }
                    if (departmentdt != null)
                    {
                        nStatisticalData.Department = departmentdt;
                    }
                    if (statscodedt != null)
                    {
                        nStatisticalData.StatisticCode = statscodedt;
                    }

                    if (glAccountID != null)
                    {
                        nStatisticalData.GlAccoutnID = glAccountID;
                    }
                    if (statisticDataScenario != null)
                    {
                        nStatisticalData.DataScenarioTypeID = statisticDataScenario;
                    }
                    if (GLdataScenarioID != null && datascenariotype == "GL")
                    {
                        nStatisticalData.DataScenarioDataID = GLdataScenarioID;
                    }
                    if (STdataScenarioID != null && datascenariotype == "ST")
                    {
                        nStatisticalData.DataScenarioDataID = STdataScenarioID;
                    }

                    if (totalvalue != decimal.Zero)
                    {
                        nStatisticalData.Value = int.Parse(totalvalue.ToString());
                    }

                    foreach (var monthlyvalue in monthvalues)
                    {
                        HelperFunctions.TrySetProperty(nStatisticalData, monthlyvalue.Key, monthlyvalue.Value);
                    }

                    if (datascenariotype == "ST")
                    {
                        var existingObj = existingStatisticalData.Where(f => 
                        f.StatisticTimePeriod.TimePeriodCode.ToUpper() == tpname.TimePeriodCode.ToUpper()
                     //   && f.DataScenarioDataID.DataScenarioID  == STdataScenarioID.DataScenarioID
                        && f.Entity.EntityCode.ToUpper() == entitydt.EntityCode.ToUpper()
                        && f.Department.DepartmentCode.ToUpper() == departmentdt.DepartmentCode.ToUpper()
                        && f.StatisticCode != null
                        && f.StatisticCode.StatisticsCode.ToUpper() == statscodedt.StatisticsCode.ToUpper()


                        ).FirstOrDefault();
                        if (existingObj != null)
                        {
                            duplicates++;
                            _context.Entry(existingObj).State = EntityState.Modified;
                            int existingID = existingObj.StatisticalDataID;

                            foreach (PropertyInfo property in typeof(ABS.DBModels.StatisticalData).GetProperties().Where(p => p.CanWrite))
                            {
                                property.SetValue(existingObj, property.GetValue(nStatisticalData, null), null);
                            }
                            existingObj.StatisticalDataID = existingID;
                            if (updateAllActualBV)
                            {
                                await opBudgetVersionStatistics.UpdateActualBVStatisticsAccounts(existingObj, _context);
                            }
                        }
                        else
                        {
                            _context.Add(nStatisticalData);
                            if (updateAllActualBV)
                            {
                                await opBudgetVersionStatistics.UpdateActualBVStatisticsAccounts(existingObj, _context);
                            }
                        }
                    }
                    else
                      if (datascenariotype == "GL")

                    {

                        var existingObj = existingStatisticalData.Where(f => 
                        f.StatisticTimePeriod.TimePeriodCode.ToUpper() == tpname.TimePeriodCode.ToUpper()
                     //&& f.DataScenarioDataID.DataScenarioID  == GLdataScenarioID.DataScenarioID 
                     && f.Entity.EntityCode.ToUpper() == entitydt.EntityCode.ToUpper()
                     && f.Department.DepartmentCode.ToUpper() == departmentdt.DepartmentCode.ToUpper()
                     && f.GlAccoutnID != null
                     && f.GlAccoutnID.GLAccountCode.ToUpper() == glAccountID.GLAccountCode.ToUpper()


                     ).FirstOrDefault();
                        if (existingObj != null)
                        {
                            foreach (PropertyInfo property in typeof(ABS.DBModels.StatisticalData).GetProperties().Where(p => p.CanWrite))
                            {

                                property.SetValue(existingObj, property.GetValue(nStatisticalData, null), null);
                            }
                            if (existingObj.StatisticalDataID > 0)

                            {
                                _context.Entry(existingObj).State = EntityState.Modified;
                                int existingID = existingObj.StatisticalDataID;


                                existingObj.StatisticalDataID = existingID;
                                if (updateAllActualBV)
                                {
                                    await opBudgetVersionGLAccounts.UpdateActualBVGLAccounts(existingObj, _context);
                                }
                            }
                            else
                            {

                            }
                        }
                        else
                        {
                            _context.Add(nStatisticalData);
                            existingStatisticalData.Add(nStatisticalData);
                            if (updateAllActualBV)
                            {
                                await opBudgetVersionGLAccounts.UpdateActualBVGLAccounts(existingObj, _context);
                            }

                        }
                    }

                    counter++;
                    remainingRecords--;

                    Console.WriteLine($"%%%% Remaining Records : " + remainingRecords);
                    if (counter < dbthreshold && remainingRecords > dbthreshold)
                    {


                    }
                    else
                    {
                        await _context.SaveChangesAsync();
                        counter = 0;
                    }



                    successones++;


                }
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
            //finally { GC.Collect();GC.WaitForPendingFinalizers(); }
        }


    }
}
