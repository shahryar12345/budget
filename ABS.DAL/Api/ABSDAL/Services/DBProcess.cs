using ABS.DBModels;
using ABSDAL.Context;
using ABSDAL.Operations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ABSDAL.Services
{
    public class DBProcess<T> where T : class
    {
        private bool deleteOldRecords { get; set; }
        public string Jobguid { get; set; }
        APIResponse APIResponse { get; set; } = new APIResponse();
        List<TimePeriods> extimeperiods { get; set; }
        List<DataScenario> exDataScenarios { get; set; }
        List<Entities> exentities { get; set; }
        List<Departments> exdepartments { get; set; }
        List<StatisticsCodes> exstatisticscodes { get; set; }
        List<GLAccounts> exGLAccounts { get; set; }
        List<PayTypes> exPaytypes { get; set; }
        List<JobCodes> exjobcodes { get; set; }
        List<ItemTypes> exitemTypes { get; set; }
        List<BudgetVersions> exbudgetversions { get; set; }

        List<T> TObjList { get; set; }
        List<Dictionary<string, object>> parsedValues { get; set; } = new List<Dictionary<string, object>>();
        List<int> IdstoDelete { get; set; } = new List<int>();

        ConcurrentBag<T> TObjListAsync { get; set; } = new ConcurrentBag<T>();

        ConcurrentBag<T> GeneratedObjects { get; set; } = new ConcurrentBag<T>();
        ConcurrentBag<T> NewData { get; set; } = new ConcurrentBag<T>();
        ConcurrentBag<T> UpdatedData { get; set; } = new ConcurrentBag<T>();


        T TObj { get; set; }
        int errorones { get; set; } = 0;
        int successones { get; set; } = 0;
        int duplicates { get; set; } = 0;
        public IBackgroundTaskQueue Queue { get; }
        public IServiceScopeFactory ServiceScopeFactory { get; }
        public BudgetingContext _context { get; set; }

        public DBProcess(IBackgroundTaskQueue queue, IServiceScopeFactory serviceScopeFactory)
        {

            Queue = queue;
            ServiceScopeFactory = serviceScopeFactory;

        }
        public async Task ProcessDBObjects(System.Text.Json.JsonElement rawText, bool deleteRecords)

        {
            /*


                         Get Json
                        Uncompress JSON 
                        Parse Json

                        Get list of Objects

                        Load Master Data (needed for Model/JSON data)

                        Each Item
                        parse Dictionary object
                        Parse JSON to Model



                        Return with validation message.
                        Delete if Required
                        If NEW - Insert
                        If Existing - Update



                         */

            try
            {

                await Task.Delay(1);

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);
                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                Logger.Loginfo(DateTime.UtcNow.ToString() + "||" + Jobguid + "||Starting Background Job");
                //  RunBGJob();
                deleteOldRecords = deleteRecords;
                 
                using (var scope = ServiceScopeFactory.CreateScope())
                {

                    var dbContext = scope.ServiceProvider.GetService<BudgetingContext>();
                    _context = dbContext;

                    Logger.Loginfo("BG Job started for JobID: ", Jobguid);

                    LoadMasterData();
                    //    LoadExistingData();
                    //   await RunDBProcess(false);

                    string ProcessingMethod = getProcessingMethod();
                    string DBProcessingMethod = getDBProcessingMethod();
                    int dbthreshold = getProcessingThreshold();

                    int counter = 0;
                    if (ProcessingMethod == "VALIDATIONPARALLEL")
                    {

                        Parallel.ForEach(values,
                                  new ParallelOptions { MaxDegreeOfParallelism = dbthreshold },

                            async (item, state, index) =>
                        {
                            Logger.Loginfo("TPL-JSON Validation Current Index: " + index);

                            var dictobj = await ValidateJSONAsync(item);
                            var modelobj = await ValidateModelAsync(item);

                            await GenerateDBObjects(dictobj, modelobj);
                            counter++;
                        });

                        if (deleteOldRecords)
                        {
                            await GenerateDeleteObject(true, true);
                        }



                    }
                    else
                   if (ProcessingMethod == "VALIDATIONNORMAL")
                    {
                        int loopindex = 0;
                        foreach (var item in values)
                        {
                            loopindex++;
                            Logger.Loginfo("Model Validation Current Index: " + loopindex);


                            var dictobj = ValidateJSON(item);
                            var modelobj = ValidateModel(item);

                            await GenerateDBObjects(dictobj, modelobj);
                            counter++;

                        }
                        if (deleteOldRecords)
                        {
                            await GenerateDeleteObject(true, true);
                        }

                    }

                    Logger.Loginfo("||counter: " + counter, Jobguid);
                    if (counter >= values.Count())
                    {
                        if (DBProcessingMethod == "VALIDATIONNORMAL")
                        {
                            await SaveDBObjectUpdates();

                        }
                        else
                      if (DBProcessingMethod == "VALIDATIONPARALLEL")

                        {
                            await SaveDBObjectsParallel();
                        }
                    }

                    Logger.Loginfo(DateTime.UtcNow.ToString() + "||" + Jobguid + "|| Background Finished");
                    await Operations.opBGJobs.UpdateBGJobs("SUCCESS", Guid.Parse(Jobguid), _context);

                  
                }

                //  Logger.Loginfo("Background Job Finished", _context, Jobguid.ToString());

                return;
            }
            catch (Exception ex)
            {
                await Operations.opBGJobs.UpdateBGJobs("FAILED",  Guid.Parse( Jobguid ), _context);

                Logger.LogError(ex);
                _context.Dispose();
                throw;
            }
            finally
            {
                if (_context != null)
                {
                    _context.Dispose();
                }
            }
        }


        private async Task GenerateDeleteObject(bool deleteoldrecords, bool deleterange)
        {
            Logger.Loginfo("Generating Objects for Deletion", Jobguid);

            foreach (var item in IdstoDelete)
            {
                await DeleteData(true, item);
            }
            return;
        }

        public void RunBGJob()
        {
            for (int i = 0; i < 2; i++)
            {
                Logger.Loginfo(i.ToString(), "BGJOB_STARTED");
                Task.Delay(1000);
            }
        }

        public string getProcessingMethod()
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "PROCESSMETHOD", _context);


            return ProcessingMethod.ItemTypeValue;
        }
        public string getDBProcessingMethod()
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "DBPROCESSMETHOD", _context);


            return ProcessingMethod.ItemTypeValue;
        }


        public int getProcessingThreshold()
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "DATABASEPROCESSINGTHRESHOLD", _context);


            return int.Parse(ProcessingMethod.ItemTypeValue);
        }


        private async Task GenerateDBObjects(Dictionary<string, object> DictJson, T DataObject)
        {
            try
            {
                Logger.Loginfo("Generating Object", Jobguid);

                await Task.Delay(1);
                if (getTType() == typeof(BudgetVersionStaffing))
                {
                    var generatedobj = await CheckBudgetVersionStaffing(DictJson, DataObject);

                    NewData.Add(generatedobj);

                }
                else
                if (getTType() == typeof(BudgetVersionStatistics))
                {
                    var generatedobj = await CheckBudgetVersionStatistics(DictJson, DataObject);

                    NewData.Add(generatedobj);

                }
                else
                if (getTType() == typeof(BudgetVersionGLAccounts))
                {
                    var generatedobj = await CheckBudgetVersionGL(DictJson, DataObject);

                    NewData.Add(generatedobj);

                }

            }
            catch (Exception)
            {

                throw;
            }
        }

        private async Task<T> CheckBudgetVersionStaffing(Dictionary<string, object> DictJson, T DataObject)
        {
            Logger.Loginfo("Staffing Object", Jobguid);

            await Task.Delay(1);
            object temp = DataObject;

            BudgetVersionStaffing bvstaff = (BudgetVersionStaffing)temp;

            bvstaff.Identifier = Guid.NewGuid();
            bvstaff.CreationDate = DateTime.UtcNow;
            bvstaff.UpdatedDate = DateTime.UtcNow;
            bvstaff.IsActive = true;
            bvstaff.IsDeleted = false;


            if (bvstaff.TimePeriodID == null)
            {
                bvstaff.TimePeriodID = checkPropertyValue<TimePeriods>(bvstaff.TimePeriodID, DictJson, "timeperiodid");
            }
            else
            {
                bvstaff.TimePeriodID = checkPropertyValue<TimePeriods>(bvstaff.TimePeriodID, DictJson, "timeperiodid", true, bvstaff.TimePeriodID.TimePeriodID);

            }

            if (bvstaff.BudgetVersion == null)
            {
                bvstaff.BudgetVersion = checkPropertyValue<BudgetVersions>(bvstaff.BudgetVersion, DictJson, "budgetversionid");

            }
            else
            {
                bvstaff.BudgetVersion = checkPropertyValue<BudgetVersions>(bvstaff.BudgetVersion, DictJson, "budgetversionid", true, bvstaff.BudgetVersion.BudgetVersionID);

            }
            if (bvstaff.Entity == null)
            {
                bvstaff.Entity = checkPropertyValue<Entities>(bvstaff.Entity, DictJson, "entitycode");

            }
            else
            {
                bvstaff.Entity = checkPropertyValue<Entities>(bvstaff.Entity, DictJson, "entitycode", true, bvstaff.Entity.EntityID);

            }
            if (bvstaff.Department == null)
            {
                bvstaff.Department = checkPropertyValue<Departments>(bvstaff.Department, DictJson, "departmentcode");

            }
            else
            {
                bvstaff.Department = checkPropertyValue<Departments>(bvstaff.Department, DictJson, "departmentcode", true, bvstaff.Department.DepartmentID);

            }
            if (bvstaff.JobCode == null)
            {
                bvstaff.JobCode = checkPropertyValue<JobCodes>(bvstaff.JobCode, DictJson, "jobcodecode");

            }
            else
            {
                bvstaff.JobCode = checkPropertyValue<JobCodes>(bvstaff.JobCode, DictJson, "jobcodecode", true, bvstaff.JobCode.JobCodeID);

            }
            if (bvstaff.PayType == null)
            {
                bvstaff.PayType = checkPropertyValue<PayTypes>(bvstaff.PayType, DictJson, "paytypecode");

            }
            else
            {
                bvstaff.PayType = checkPropertyValue<PayTypes>(bvstaff.PayType, DictJson, "paytypecode", true, bvstaff.PayType.PayTypeID);

            }
            if (bvstaff.DataScenarioTypeID == null)
            {
                bvstaff.DataScenarioTypeID = checkPropertyValue<ItemTypes>(bvstaff.DataScenarioTypeID, DictJson, "scenariotypeID");

            }
            else
            {
                bvstaff.DataScenarioTypeID = checkPropertyValue<ItemTypes>(bvstaff.DataScenarioTypeID, DictJson, "scenariotypeID", true, bvstaff.DataScenarioTypeID.ItemTypeID);

            }
            if (bvstaff.DataScenarioID == null)
            {
                bvstaff.DataScenarioID = checkPropertyValue<DataScenario>(bvstaff.DataScenarioID, DictJson, "dataScenarioid");

            }
            else
            {
                bvstaff.DataScenarioID = checkPropertyValue<DataScenario>(bvstaff.DataScenarioID, DictJson, "dataScenarioid", true, bvstaff.DataScenarioID.DataScenarioID);

            }
            if (bvstaff.StaffingDataType == null || bvstaff.StaffingDataType.ItemTypeID == 0)
            {
                bvstaff.StaffingDataType = checkPropertyValue<ItemTypes>(bvstaff.StaffingDataType, DictJson, "staffingaccounttypeid", false, 0, "itemtypeID");

            }
            else
            {
                bvstaff.StaffingDataType = checkPropertyValue<ItemTypes>(bvstaff.StaffingDataType, DictJson, "staffingaccounttypeid", true, bvstaff.StaffingDataType.ItemTypeID);

            }
            if (bvstaff.DimensionsRowID == null)
            {
                bvstaff.DimensionsRowID = checkPropertyValue<Dimensions>(bvstaff.DimensionsRowID, DictJson, "dimensionsrowid");

            }
            else
            {
                bvstaff.DimensionsRowID = checkPropertyValue<Dimensions>(bvstaff.DimensionsRowID, DictJson, "dimensionsrowid", true, bvstaff.DimensionsRowID.DimensionsID);

            }

            if (deleteOldRecords)
            {
                if (!IdstoDelete.Contains(bvstaff.BudgetVersion.BudgetVersionID))
                {
                    IdstoDelete.Add(bvstaff.BudgetVersion.BudgetVersionID);
                }
                //    await  DeleteData(true, bvstaff.BudgetVersion.BudgetVersionID);

            }
            else
            {

            }



            temp = bvstaff;
            DataObject = (T)temp;

            return DataObject;
        }

        private async Task<T> CheckBudgetVersionStatistics(Dictionary<string, object> DictJson, T DataObject)
        {
            Logger.Loginfo("Statistics Object", Jobguid);

            await Task.Delay(1);
            object temp = DataObject;

            BudgetVersionStatistics bvstats = (BudgetVersionStatistics)temp;

            bvstats.Identifier = Guid.NewGuid();
            bvstats.CreationDate = DateTime.UtcNow;
            bvstats.UpdatedDate = DateTime.UtcNow;
            bvstats.IsActive = true;
            bvstats.IsDeleted = false;


            if (bvstats.TimePeriodID == null)
            {
                bvstats.TimePeriodID = checkPropertyValue<TimePeriods>(bvstats.TimePeriodID, DictJson, "timeperiodid");
            }
            else
            {
                bvstats.TimePeriodID = checkPropertyValue<TimePeriods>(bvstats.TimePeriodID, DictJson, "timeperiodid", true, bvstats.TimePeriodID.TimePeriodID);

            }

            if (bvstats.BudgetVersion == null)
            {
                bvstats.BudgetVersion = checkPropertyValue<BudgetVersions>(bvstats.BudgetVersion, DictJson, "budgetversionid");

            }
            else
            {
                bvstats.BudgetVersion = checkPropertyValue<BudgetVersions>(bvstats.BudgetVersion, DictJson, "budgetversionid", true, bvstats.BudgetVersion.BudgetVersionID);

            }
            if (bvstats.Entity == null)
            {
                bvstats.Entity = checkPropertyValue<Entities>(bvstats.Entity, DictJson, "entitycode");

            }
            else
            {
                bvstats.Entity = checkPropertyValue<Entities>(bvstats.Entity, DictJson, "entitycode", true, bvstats.Entity.EntityID);

            }
            if (bvstats.Department == null)
            {
                bvstats.Department = checkPropertyValue<Departments>(bvstats.Department, DictJson, "departmentcode");

            }
            else
            {
                bvstats.Department = checkPropertyValue<Departments>(bvstats.Department, DictJson, "departmentcode", true, bvstats.Department.DepartmentID);

            }
            if (bvstats.StatisticsCodes == null)
            {
                bvstats.StatisticsCodes = checkPropertyValue<StatisticsCodes>(bvstats.StatisticsCodes, DictJson, "statisticscode");

            }
            else
            {
                bvstats.StatisticsCodes = checkPropertyValue<StatisticsCodes>(bvstats.StatisticsCodes, DictJson, "statisticscode", true, bvstats.StatisticsCodes.StatisticsCodeID);

            }

            if (bvstats.DataScenarioTypeID == null)
            {
                bvstats.DataScenarioTypeID = checkPropertyValue<ItemTypes>(bvstats.DataScenarioTypeID, DictJson, "scenariotypeID");

            }
            else
            {
                bvstats.DataScenarioTypeID = checkPropertyValue<ItemTypes>(bvstats.DataScenarioTypeID, DictJson, "scenariotypeID", true, bvstats.DataScenarioTypeID.ItemTypeID);

            }
            if (bvstats.DataScenarioDataID == null)
            {
                bvstats.DataScenarioDataID = checkPropertyValue<DataScenario>(bvstats.DataScenarioDataID, DictJson, "datascenarioid");

            }
            else
            {
                bvstats.DataScenarioDataID = checkPropertyValue<DataScenario>(bvstats.DataScenarioDataID, DictJson, "datascenarioid", true, bvstats.DataScenarioDataID.DataScenarioID);

            }

            if (bvstats.DimensionsRowID == null)
            {
                bvstats.DimensionsRowID = checkPropertyValue<Dimensions>(bvstats.DimensionsRowID, DictJson, "dimensionsrowid");

            }
            else
            {
                bvstats.DimensionsRowID = checkPropertyValue<Dimensions>(bvstats.DimensionsRowID, DictJson, "dimensionsrowid", true, bvstats.DimensionsRowID.DimensionsID);

            }

            if (deleteOldRecords)
            {
                if (!IdstoDelete.Contains(bvstats.BudgetVersion.BudgetVersionID))
                {
                    IdstoDelete.Add(bvstats.BudgetVersion.BudgetVersionID);
                }
                //    await  DeleteData(true, bvstaff.BudgetVersion.BudgetVersionID);

            }
            else
            {

            }



            temp = bvstats;
            DataObject = (T)temp;

            return DataObject;
        }
        private async Task<T> CheckBudgetVersionGL(Dictionary<string, object> DictJson, T DataObject)
        {
            Logger.Loginfo("GL Object", Jobguid);

            await Task.Delay(1);
            object temp = DataObject;

            BudgetVersionGLAccounts bvGL = (BudgetVersionGLAccounts)temp;

            bvGL.Identifier = Guid.NewGuid();
            bvGL.CreationDate = DateTime.UtcNow;
            bvGL.UpdatedDate = DateTime.UtcNow;
            bvGL.IsActive = true;
            bvGL.IsDeleted = false;


            if (bvGL.TimePeriodID == null)
            {
                bvGL.TimePeriodID = checkPropertyValue<TimePeriods>(bvGL.TimePeriodID, DictJson, "timeperiodid");
            }
            else
            {
                bvGL.TimePeriodID = checkPropertyValue<TimePeriods>(bvGL.TimePeriodID, DictJson, "timeperiodid", true, bvGL.TimePeriodID.TimePeriodID);

            }

            if (bvGL.BudgetVersion == null)
            {
                bvGL.BudgetVersion = checkPropertyValue<BudgetVersions>(bvGL.BudgetVersion, DictJson, "budgetversionid");

            }
            else
            {
                bvGL.BudgetVersion = checkPropertyValue<BudgetVersions>(bvGL.BudgetVersion, DictJson, "budgetversionid", true, bvGL.BudgetVersion.BudgetVersionID);

            }
            if (bvGL.Entity == null)
            {
                bvGL.Entity = checkPropertyValue<Entities>(bvGL.Entity, DictJson, "entitycode");

            }
            else
            {
                bvGL.Entity = checkPropertyValue<Entities>(bvGL.Entity, DictJson, "entitycode", true, bvGL.Entity.EntityID);

            }
            if (bvGL.Department == null)
            {
                bvGL.Department = checkPropertyValue<Departments>(bvGL.Department, DictJson, "departmentcode");

            }
            else
            {
                bvGL.Department = checkPropertyValue<Departments>(bvGL.Department, DictJson, "departmentcode", true, bvGL.Department.DepartmentID);

            }

            if (bvGL.GLAccount == null)
            {
                bvGL.GLAccount = checkPropertyValue<GLAccounts>(bvGL.GLAccount, DictJson, "glaccountcode");

            }
            else
            {
                bvGL.GLAccount = checkPropertyValue<GLAccounts>(bvGL.GLAccount, DictJson, "glaccountcode", true, bvGL.GLAccount.GLAccountID);

            }



            if (bvGL.DataScenarioTypeID == null)
            {
                bvGL.DataScenarioTypeID = checkPropertyValue<ItemTypes>(bvGL.DataScenarioTypeID, DictJson, "scenariotypeID");

            }
            else
            {
                bvGL.DataScenarioTypeID = checkPropertyValue<ItemTypes>(bvGL.DataScenarioTypeID, DictJson, "scenariotypeID", true, bvGL.DataScenarioTypeID.ItemTypeID);

            }
            if (bvGL.DataScenarioDataID == null)
            {
                bvGL.DataScenarioDataID = checkPropertyValue<DataScenario>(bvGL.DataScenarioDataID, DictJson, "dataScenarioid");

            }
            else
            {
                bvGL.DataScenarioDataID = checkPropertyValue<DataScenario>(bvGL.DataScenarioDataID, DictJson, "dataScenarioid", true, bvGL.DataScenarioDataID.DataScenarioID);

            }

            if (bvGL.DimensionsRowID == null)
            {
                bvGL.DimensionsRowID = checkPropertyValue<Dimensions>(bvGL.DimensionsRowID, DictJson, "dimensionsrowid");

            }
            else
            {
                bvGL.DimensionsRowID = checkPropertyValue<Dimensions>(bvGL.DimensionsRowID, DictJson, "dimensionsrowid", true, bvGL.DimensionsRowID.DimensionsID);

            }

            if (deleteOldRecords)
            {
                if (!IdstoDelete.Contains(bvGL.BudgetVersion.BudgetVersionID))
                {
                    IdstoDelete.Add(bvGL.BudgetVersion.BudgetVersionID);
                }
                //    await  DeleteData(true, bvstaff.BudgetVersion.BudgetVersionID);

            }
            else
            {

            }



            temp = bvGL;
            DataObject = (T)temp;

            return DataObject;
        }

        private F checkPropertyValue<F>(F obj, Dictionary<string, object> dictJson, string Keyname, bool isidentity = false, int id = 0, string secondkey = "") where F : class
        {
            try
            {
                var jvalue = "";
                if (isidentity && id != 0)
                {
                    jvalue = id.ToString();

                    obj = getRecordbyID(obj, jvalue);
                }
                else
                {


                    if (HelperFunctions.CheckKeyValuePairs(dictJson, Keyname).ToString() == "")
                    {


                    }
                    else
                    {

                        jvalue = dictJson[Keyname].ToString();
                        var jvalparse = getJvalueparse(jvalue, Keyname, secondkey);

                        obj = getRecord(obj, jvalparse);

                    }
                }
                return obj;
            }
            catch (Exception ex)
            {

                Logger.LogError(ex);
                return null;
            }

        }

        private string getJvalueparse(string jvalue, string keyname, string secondkeyname = "")
        {
            try
            {

                var definition = new { data = "" };



                string jsondef = $"{keyname.ToUpper()} : {string.Empty} ";
                dynamic parsejvalue = JsonConvert.DeserializeObject<dynamic>(jvalue.ToUpper());

                var val = (string) parsejvalue[keyname.ToUpper()] ;

                if (  val == "")
                {


                    val = (string)parsejvalue[secondkeyname.ToUpper()];


                }

                return val;
            }
            catch (Exception ex)
            {
                //Logger.Loginfo("SingleJSON Object does not exists", "FS_getJvalueparse");
                Console.WriteLine(ex);
                return jvalue;
            }


        }

        private F getRecord<F>(F obj, string jvalue)
        {
            if (typeof(F) == typeof(TimePeriods))
            {
                object tempobj = extimeperiods.Where(f =>
                 f.TimePeriodID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(JobCodes))
            {
                object tempobj = exjobcodes.Where(f =>
                 f.JobCodeCode == jvalue
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(Entities))
            {
                object tempobj = exentities.Where(f =>
                 f.EntityCode == jvalue
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(Departments))
            {
                object tempobj = exdepartments.Where(f =>
                 f.DepartmentCode == jvalue
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(DataScenario))
            {
                object tempobj = exDataScenarios.Where(f =>
                 f.DataScenarioID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(PayTypes))
            {
                object tempobj = exPaytypes.Where(f =>
                 f.PayTypeCode == jvalue
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }

            else

                if (typeof(F) == typeof(ItemTypes))
            {
                object tempobj = exitemTypes.Where(f =>
                 f.ItemTypeID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(StatisticsCodes))
            {
                object tempobj = exstatisticscodes.Where(f =>
                 f.StatisticsCode == jvalue
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(GLAccounts))
            {
                object tempobj = exGLAccounts.Where(f =>
                 f.GLAccountCode == jvalue
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            return obj;
        }
        private F getRecordbyID<F>(F obj, string jvalue)
        {
            if (typeof(F) == typeof(TimePeriods))
            {
                object tempobj = extimeperiods.Where(f =>
                 f.TimePeriodID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(JobCodes))
            {
                object tempobj = exjobcodes.Where(f =>
                 f.JobCodeID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(Entities))
            {
                object tempobj = exentities.Where(f =>
                 f.EntityID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(Departments))
            {
                object tempobj = exdepartments.Where(f =>
                 f.DepartmentID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(DataScenario))
            {
                object tempobj = exDataScenarios.Where(f =>
                 f.DataScenarioID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(PayTypes))
            {
                object tempobj = exPaytypes.Where(f =>
                 f.PayTypeID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }

            else

                if (typeof(F) == typeof(ItemTypes))
            {
                object tempobj = exitemTypes.Where(f =>
                 f.ItemTypeID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }

            else

                if (typeof(F) == typeof(BudgetVersions))
            {
                object tempobj = exbudgetversions.Where(f =>
                 f.BudgetVersionID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(StatisticsCodes))
            {
                object tempobj = exstatisticscodes.Where(f =>
                 f.StatisticsCodeID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            else

                if (typeof(F) == typeof(GLAccounts))
            {
                object tempobj = exGLAccounts.Where(f =>
                 f.GLAccountID == int.Parse(jvalue)
                 && f.IsDeleted == false
                 && f.IsActive == true).FirstOrDefault();


                obj = (F)tempobj;
            }
            return obj;
        }

        private System.Type getTType()
        {
            return typeof(T);
        }

        private async Task RunDBProcess(bool deleteOldRecords)
        {
            try
            {

                Logger.Loginfo("RunDBProcess-- Started");

                var cntxt = _context;
                await Task.Delay(1);
                //await DeleteData(deleteOldRecords);
                ////await GenerateDBObjects();
                //await SaveDBObjectUpdates();


            }
            catch (Exception)
            {

                throw;
            }
        }

        private async Task SaveDBObjectUpdates()
        {
            try
            {
                Logger.Loginfo("DB Operations Starting", Jobguid);


                if (NewData.Count > 0)
                {
                    int dbthreshold = getProcessingThreshold();
                    int totalitems = NewData.Count();


                    if (totalitems < dbthreshold)
                    {
                        dbthreshold = totalitems;
                    }
                    else
                    {


                    }

                    int counter = 0;
                    int remainingRecords = totalitems;
                    _context.ChangeTracker.AutoDetectChangesEnabled = false;

                    Logger.Loginfo($"Objects need to insert:  {NewData.Count() }");
                    foreach (var newdataitem in NewData)

                    {
                        _context.Add(newdataitem);
                        counter++;
                        remainingRecords--;
                        Logger.Loginfo($"%%%% Remaining Records : " + remainingRecords);




                        if (counter < dbthreshold && remainingRecords > dbthreshold)
                        {


                        }
                        else
                        {
                            await _context.SaveChangesAsync();
                            counter = 0;
                        }


                    }
                }
                if (UpdatedData.Count > 0)
                {
                    int dbthreshold = getProcessingThreshold();
                    int counter = 0;
                    int totalitems = UpdatedData.Count();
                    int currentcount = 0;
                    _context.ChangeTracker.AutoDetectChangesEnabled = false;

                    Logger.Loginfo($"Objects need to Update:  {UpdatedData.Count() }");
                    foreach (var item in UpdatedData)

                    {
                        if (currentcount < dbthreshold)
                        { dbthreshold = currentcount * (25 / 100); }
                        Logger.Loginfo($"%%%% Remaining Records : " + currentcount);

                        counter++;
                        if (counter < dbthreshold)
                        {


                        }
                        else
                        {
                            _context.Entry(item).State = EntityState.Modified;

                            await _context.SaveChangesAsync();
                            counter = 0;
                        }

                    }

                }

                await Task.Delay(1);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                throw;
            }
            finally
            {
                _context.ChangeTracker.AutoDetectChangesEnabled = true;
            }
        }

        private async Task SaveDBObjectsParallel()
        {
            try
            {
                Logger.Loginfo("Parllel DB Operations Starting", _context, Jobguid);
                int dbthreshold = getProcessingThreshold();


                if (NewData.Count > 0)
                {

                    _context.ChangeTracker.AutoDetectChangesEnabled = false;

                    Logger.Loginfo($"Objects need to insert:  {NewData.Count() }");


                    //foreach (var newdataitem in NewData)

                    Parallel.ForEach(NewData,
                               new ParallelOptions { MaxDegreeOfParallelism = dbthreshold },

                        async (newdataitem, state, index) =>
                    {

                        _context.Add(newdataitem);

                        await _context.SaveChangesAsync();

                    }
                    );
                }
                if (UpdatedData.Count > 0)
                {
                    _context.ChangeTracker.AutoDetectChangesEnabled = false;

                    Logger.Loginfo($"Objects need to Update:  {UpdatedData.Count() }");
                    // foreach (var item in UpdatedData)
                    Parallel.ForEach(UpdatedData, async (item, state, index) =>
                    {


                        _context.Entry(item).State = EntityState.Modified;

                        await _context.SaveChangesAsync();


                    }
);
                }

                await Task.Delay(1);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                throw;
            }
            finally
            {
                _context.ChangeTracker.AutoDetectChangesEnabled = true;
            }
        }

        private async Task DeleteData(bool deleterange, int ID)
        {
            try
            {
                Logger.Loginfo("Deletion Required: " + deleteOldRecords);
                Logger.Loginfo("Generating Deletion Objects for Job  : " + Jobguid);
                await Task.Delay(1);
                Logger.Loginfo("Deleting Records for BudgetVersion :  ", ID.ToString());

                if (deleteOldRecords && deleterange)
                {
                    if (typeof(T) == typeof(BudgetVersionStaffing))
                    {
                        _context.BudgetVersionStaffing.RemoveRange(_context.BudgetVersionStaffing
                           .Where(bv => bv.BudgetVersion.BudgetVersionID == ID
                           && bv.BudgetVersion.budgetVersionTypeID.ItemTypeCode == "A"));

                    }
                    else
                    if (typeof(T) == typeof(BudgetVersionStatistics))
                    {
                        _context.BudgetVersionStatistics.RemoveRange(_context.BudgetVersionStatistics
                           .Where(bv => bv.BudgetVersion.BudgetVersionID == ID
                           && bv.BudgetVersion.budgetVersionTypeID.ItemTypeCode == "A"));

                    }
                    else
                    if (typeof(T) == typeof(BudgetVersionGLAccounts))
                    {
                        _context.BudgetVersionGLAccounts.RemoveRange(_context.BudgetVersionGLAccounts
                           .Where(bv => bv.BudgetVersion.BudgetVersionID == ID
                           && bv.BudgetVersion.budgetVersionTypeID.ItemTypeCode == "A"));

                    }
                }
                else
                {

                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        private void LoadExistingData()

        {
            TObjList = getData<T>().Result.ToList();
            TObjListAsync = new ConcurrentBag<T>(TObjList);

        }

        private void LoadMasterData()
        {


            Logger.Loginfo("BG Job", Jobguid.ToString());

            LoadEntities();
            Loaddepartments();
            LoadItemTypes();
            LoadJobCodes();
            LoadPayTypes();

            LoadGLAccounts();
            LoadDataScenarios();
            Loadextimeperiods();
            Loadstatisticscodes();
            LoadBudgetVersions();

        }



        private Dictionary<string, object> ValidateJSON(object item)
        {
            try
            {
                var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());


                return arrval;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);

                return null;
            }

        }
        private async Task<Dictionary<string, object>> ValidateJSONAsync(object item)
        {
            try
            {
                await Task.Delay(1);
                var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());


                return arrval;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);

                return null;
            }

        }
        private T ValidateModel(object item)
        {
            try
            {

                var itemObj = JsonConvert.DeserializeObject<T>(item.ToString());


                return itemObj;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                return null;
            }

        }

        private async Task<T> ValidateModelAsync(object item)
        {
            try
            {
                await Task.Delay(1);

                var itemObj = JsonConvert.DeserializeObject<T>(item.ToString());


                return itemObj;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                return null;
            }

        }


        public void LoadEntities()
        {
            exentities = getData<Entities>().Result.ToList();

            exentities = exentities.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }

        public void Loaddepartments()
        {
            exdepartments = getData<Departments>().Result.ToList();

            exdepartments = exdepartments.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }

        public void LoadItemTypes()
        {
            exitemTypes = getData<ItemTypes>().Result.ToList();

            exitemTypes = exitemTypes.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }

        public void LoadJobCodes()
        {
            exjobcodes = getData<JobCodes>().Result.ToList();

            exjobcodes = exjobcodes.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }

        public void LoadPayTypes()
        {
            exPaytypes = getData<PayTypes>().Result.ToList();

            exPaytypes = exPaytypes.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }

        public void LoadGLAccounts()
        {
            exGLAccounts = getData<GLAccounts>().Result.ToList();

            exGLAccounts = exGLAccounts.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }


        public void LoadDataScenarios()
        {
            exDataScenarios = getData<DataScenario>().Result.ToList();

            exDataScenarios = exDataScenarios.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }
        public void Loadextimeperiods()
        {
            extimeperiods = getData<TimePeriods>().Result.ToList();

            extimeperiods = extimeperiods.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }

        public void Loadstatisticscodes()
        {
            exstatisticscodes = getData<StatisticsCodes>().Result.ToList();

            exstatisticscodes = exstatisticscodes.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }

        public void LoadBudgetVersions()
        {
            exbudgetversions = getData<BudgetVersions>().Result.ToList();

            exbudgetversions = exbudgetversions.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
        }


        public async Task<IEnumerable<F>> getData<F>() where F : class
        {
            var repo = new Repository.GenericRepository<F>(_context);

            var listobj = await repo.GetAllAsync();


            return listobj;
        }


        public T getNewObject()
        {

            return (T)Activator.CreateInstance(typeof(T));

        }
        public F GetParsedObject<F>(F LoadedList, Dictionary<string, object> sourcearray, string keyName) where F : class
        {

            var getObj = (F)Activator.CreateInstance(typeof(F));
            //ABS.DBModels.BudgetVersions bv = new ABS.DBModels.BudgetVersions();

            if (HelperFunctions.CheckKeyValuePairs(sourcearray, keyName).ToString() == "")

            {
                /*bv = item.BudgetVersion*/
                ;

            }
            else
            {
                //getObj = 
                //bv = LoadedList.Where(f =>
                //f.BudgetVersionID == (int.Parse(sourcearray["budgetVersionId"].ToString()))
                //&& f.IsDeleted == false
                //&& f.IsActive == true).FirstOrDefault();
            }
            return getObj;
        }



    }
}
