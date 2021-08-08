using ABS.DBModels;
using ABS.DBModels.Processing;

using ABSProcessing.Context;
using ABSProcessing.Controllers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using ABSProcessing.Operations;


namespace ABSProcessing.Services
{
    public class ApplyForecastMethod
    {

        public BudgetingContext _context;
        // private ILogger<ForecastController> _logger;
        // static HttpClient client = new HttpClient();
        public List<BudgetVersions> AllBV { get; set; }
        public List<ItemTypes> AllIT { get; set; }
        public List<TimePeriods> AllTimePeriods { get; set; }
        public List<DataScenario> AllDatascenario { get; set; }

        public List<Relationships> AllRelationships { get; set; }
        public List<Entities> AllEnt { get; set; }
        public List<Departments> AllDept { get; set; }
        public List<StatisticsCodes> AllStatsCodes { get; set; }
        public List<GLAccounts> AllGLAccounts { get; set; }

        public List<PayTypes> AllPayTypes { get; set; }
        public List<JobCodes> AllJobCodes { get; set; }

        /* Forecast object/lists Parsing */
        public List<ItemTypes> months = new List<ItemTypes>();

        public ForecastMethods ForecastObject { get; set; }
        public List<ABS.DBModels.Processing.ForecastSection> AllforecastSections { get; set; }
        public List<int> AllBVIDs = new List<int>();
        public List<string> AllForecastTypes = new List<string>();
        public groupcheck groupcheck = new groupcheck();

        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<ABS.DBModels.Processing.DataRow>> AllSourceDataRows
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<ABS.DBModels.Processing.DataRow>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, string> AllScenarioTypes
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, string>();

        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<ABS.DBModels.Processing.DataRow>> AllTargetDataRows
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<ABS.DBModels.Processing.DataRow>>
            ();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, ABS.DBModels.Processing.DimensionRow> AllSourceDimensionRows
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, ABS.DBModels.Processing.DimensionRow>();

        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<ABS.DBModels.Processing.DimensionRow>> AllTargetDimensionRows
         = new Dictionary<ABS.DBModels.Processing.ForecastSection,List<ABS.DBModels.Processing.DimensionRow>>();

        /*Dimensions Pre loaded Data*/
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<Entities>> SourceEntities
         = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<Entities>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<Entities>> TargetEntities
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<Entities>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<Departments>> SourceDepartments
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<Departments>>();

        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<Departments>> TargetDepartments
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<Departments>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<StatisticsCodes>> SourceStatisticsCode
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<StatisticsCodes>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<StatisticsCodes>> TargetStatisticsCode
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<StatisticsCodes>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<GLAccounts>> SourceGLAccounts
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<GLAccounts>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<GLAccounts>> TargetGLAccounts
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<GLAccounts>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<PayTypes>> SourcePayTypes
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<PayTypes>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<PayTypes>> TargetPayTypes
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<PayTypes>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<JobCodes>> SourceJobCodes
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<JobCodes>>();
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<JobCodes>> TargetJobCodes
            = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<JobCodes>>();
        
       
        /* end here */


        public IServiceScopeFactory ServiceScopeFactory { get; }

        public ConcurrentBag<List<BudgetVersionGLAccounts>> BVGLSource = new ConcurrentBag<List<BudgetVersionGLAccounts>>();
        public ConcurrentBag<List<BudgetVersionStaffing>> BVSFSource = new ConcurrentBag<List<BudgetVersionStaffing>>();
        public ConcurrentBag<List<BudgetVersionStatistics>> BVSTSource = new ConcurrentBag<List<BudgetVersionStatistics>>();
        public bool savezerovalues = false;
         public BudgetVersions TargetBudgetVersion { get; set; }
        public Dictionary<ABS.DBModels.Processing.ForecastSection, List<BudgetVersions>> SourceBudgetVersions
           = new Dictionary<ABS.DBModels.Processing.ForecastSection, List<BudgetVersions>>();

        public ApplyForecastMethod(IServiceScopeFactory _ServiceScopeFactory)
        {
            ServiceScopeFactory = _ServiceScopeFactory;
        }

        internal async Task<bool> BeginProcess(string userid)
        {

            /*
                 1       JSON Parse
                    a     Source Dimensions
                      a1   Child of Source DImensions
                    b     Target Dimensions
                      b1   CHild of Target Dimensions

                2. Source Data 
                3. Generate Target DImension
                4. Target Data with Target Dimensions
                5. Apply Formula/calculations
                6. Generate DB Object List
                7. Push to Database

             
             */



            try
            {
                using (var scope = ServiceScopeFactory.CreateScope())
                {

                    if (ForecastObject.Forecast_budgetversion_code == null)
                    {
                        return false;
                    }

                    var dbContext = scope.ServiceProvider.GetService<BudgetingContext>();
                    _context = dbContext;

                    Guid Identifier = Guid.NewGuid();

                    await Operations.opBGJobs.InsertBGJob("ForecastMethod_" + ForecastObject.Forecast_budgetversion_scenario_type + "_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Identifier.ToString(), Identifier, Identifier.ToString(), _context);

                    if (await BeginForecasting())
                    {
                        await Operations.opBGJobs.UpdateBGJobs("SUCCESS", Identifier, _context);

                    }
                    else
                    {
                        await Operations.opBGJobs.UpdateBGJobs("FAILED", Identifier, _context);

                    }




                    //LoadBVDatascenarioData();
                    //ApplyFormula();
                    //GEnerateObjects();
                    //DBOperations();





                }

                return true;

            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                return false;
            }


        }

        private async Task<bool> BeginForecasting()
        {


            /*
                1       JSON Parse
                   a     Source Dimensions
                     a1   Child of Source DImensions
                   b     Target Dimensions
                     b1   CHild of Target Dimensions

               2. Source Data 
               3. Generate Target DImension
               4. Target Data with Target Dimensions
               5. Apply Formula/calculations
               6. Generate DB Object List
               7. Push to Database


            */


            string TargetBudgetVersionID = ForecastObject.Forecast_budgetversion_code;



            AllforecastSections = ForecastObject.Forecastsections.ToList();

            await Task.Delay(1);
            if (ForecastObject.forecast_budgetversion_scenario_type_Code.ToUpper() == "ST")
            {
                if (!await UpdateBudgetVersionStatus())
                { return false; }

                if (!await LoadAllSTData())
                { return false; }

                if (!await ParseForecastObjectValues())
                { return false; }

                if (!await LoadAllSTBVData())
                {
                    return false;
                }

                opStatisticsFormula opstf = new opStatisticsFormula();
                opstf.ForecastObjectResult = this;
                opstf._context = _context;
                if (!await opstf.ParseSTSectionsValues())
                { return false; }
                await ProcessComplete("Forecast completed");
            }
            else
            if (ForecastObject.forecast_budgetversion_scenario_type_Code.ToUpper() == "GL")
            {
                if (!await UpdateBudgetVersionStatus())
                { return false; }
                await LoadAllGLData();

                await ParseForecastObjectValues();

                await LoadAllGLBVData();
                opGeneralLedgeFormula.ParseGLSectionsValues(AllforecastSections);
                await ProcessComplete("Need to calculate");

            }
            else
            if (ForecastObject.forecast_budgetversion_scenario_type_Code.ToUpper() == "SF")
            {
                if (!await UpdateBudgetVersionStatus())
                { return false; }
                await LoadAllSFData();
                await ParseForecastObjectValues();

                await LoadAllSFBVData();
                opStaffingFormula.ParseSFSectionsValues(AllforecastSections);
                await ProcessComplete("Need to calculate");

            }
            else
            {
                return false;
            }

            return true;
        }

        private async Task<bool> UpdateBudgetVersionStatus()
        {
            try
            {
                AllBV = await Operations.opBudgetVersions.GetAllBudgetVersions(_context);

                var bvid = AllBV.Where(f => f.Code.ToUpper() == ForecastObject.Forecast_budgetversion_code.ToUpper()).FirstOrDefault();
                if (bvid == null)
                {
                    Console.WriteLine("Target Budgetversion not found!!! ");
                    return false;
                }

                await opBudgetVersions.UpdateBudgetVersionCalculationStatus("Forecasting", bvid, _context);
                AllBVIDs.Add(bvid.BudgetVersionID);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return false;
            }
        }
        private async Task<bool> ProcessComplete(string status)
        {
            try
            {
                Console.WriteLine("Process Completed ");
                var bvid = AllBV.Where(f => f.Code.ToUpper() == ForecastObject.Forecast_budgetversion_code.ToUpper()).FirstOrDefault();


                await opBudgetVersions.UpdateBudgetVersionCalculationStatus(status, bvid, _context);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return false;
            }
        }

        private async Task<bool> LoadAllSFBVData()
        {
            try
            {
                Console.WriteLine("Loading SF Budget version data. ");
                var opbvsf = new opBudgetVersionStaffing();
                BVSFSource.Add(await opbvsf.getALlBVSF(AllBVIDs.Distinct().ToList(), _context));
                if (AllForecastTypes.Contains("RATIO_STAFFING_HOURS_STATISTICS".ToUpper()))
                {
                    var opbvstatsf = new opBudgetVersionStatistics();
                    BVSTSource.Add(await opbvstatsf.getAllBVStatistics(AllBVIDs.Distinct().ToList(), _context));

                }
                return true;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                return false;
            }
        }

        private async Task<bool> LoadAllGLBVData()
        {
            try
            {
                Console.WriteLine("Loading GL Budget version data. ");

                var opbvgl = new opBudgetVersionGLAccounts();
                BVGLSource.Add(await opbvgl.getALlBVGL(AllBVIDs.Distinct().ToList(), _context));
                if (AllForecastTypes.Contains("ratioGL_Statistics".ToUpper()))
                {
                    var opbvstatsf = new opBudgetVersionStatistics();
                    BVSTSource.Add(await opbvstatsf.getAllBVStatistics(AllBVIDs.Distinct().ToList(), _context));

                }
                return true;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                return false;
            }

        }

        private async Task<bool> LoadAllSTBVData()
        {
            try
            {
                Console.WriteLine("Loading ST Budget version data. ");

                var opbvstat = new opBudgetVersionStatistics();
                BVSTSource.Add(await opbvstat.getAllBVStatistics(AllBVIDs.Distinct().ToList(), _context));
                return true;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                return false;
            }

        }

        private async Task<bool> ParseForecastObjectValues()
        {
            try
            {
                 await Task.Delay(1);
                foreach (var item in AllforecastSections)
                {

                    // AutoUpdateThisSection.Add(item, item.automaticallyUpdate.ToString() == "true" ? true: false);
                    AllForecastTypes.Add(item.forecastType.ToUpper());
                    AllSourceDataRows.Add(item, item.source.dataRow.ToList());
                    AllSourceDimensionRows.Add(item, item.source.dimensionRow);
                    //AllTargetDataRows.Add(item, item.target.dataRow.ToList());
                    //AllTargetDimensionRows.Add(item, item.target.dimensionRow);
                    var allsrcdrs = item.source.dataRow;
                    foreach (var drs in allsrcdrs)
                    {

                        AllBVIDs.Add(AllBV.Where(f => f.Code.ToUpper() == drs.budgetversion_code.ToUpper()).FirstOrDefault().BudgetVersionID);
                    }
                    var srcDim = item.source.dimensionRow;
                    if (srcDim.numerator != null && srcDim.denominator != null)
                    {
                        // Numerator
                        await CheckDictionaryObject<Entities>(SourceEntities, item, await CheckEntityGroup(srcDim.numerator.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(SourceDepartments, item, await CheckDepartmentGroup(srcDim.numerator.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(SourceStatisticsCode, item, await CheckStatisticsCodeGroup(srcDim.numerator.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(SourceGLAccounts, item, await CheckGLAccountGroup(srcDim.numerator.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(SourcePayTypes, item, await CheckPayTypeGroup(srcDim.numerator.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(SourceJobCodes, item, await CheckJobCodeGroup(srcDim.numerator.jobCode, new List<JobCodes>()));
                        //Denominator
                        await CheckDictionaryObject<Entities>(SourceEntities, item, await CheckEntityGroup(srcDim.denominator.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(SourceDepartments, item, await CheckDepartmentGroup(srcDim.denominator.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(SourceStatisticsCode, item, await CheckStatisticsCodeGroup(srcDim.denominator.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(SourceGLAccounts, item, await CheckGLAccountGroup(srcDim.denominator.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(SourcePayTypes, item, await CheckPayTypeGroup(srcDim.denominator.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(SourceJobCodes, item, await CheckJobCodeGroup(srcDim.denominator.jobCode, new List<JobCodes>()));

                    }
                    else
                    if (srcDim.numerator == null && srcDim.denominator != null)

                    {
                        //Denominator
                        await CheckDictionaryObject<Entities>(SourceEntities, item, await CheckEntityGroup(srcDim.denominator.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(SourceDepartments, item, await CheckDepartmentGroup(srcDim.denominator.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(SourceStatisticsCode, item, await CheckStatisticsCodeGroup(srcDim.denominator.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(SourceGLAccounts, item, await CheckGLAccountGroup(srcDim.denominator.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(SourcePayTypes, item, await CheckPayTypeGroup(srcDim.denominator.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(SourceJobCodes, item, await CheckJobCodeGroup(srcDim.denominator.jobCode, new List<JobCodes>()));

                        // Non Numerator
                        await CheckDictionaryObject<Entities>(SourceEntities, item, await CheckEntityGroup(srcDim.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(SourceDepartments, item, await CheckDepartmentGroup(srcDim.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(SourceStatisticsCode, item, await CheckStatisticsCodeGroup(srcDim.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(SourceGLAccounts, item, await CheckGLAccountGroup(srcDim.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(SourcePayTypes, item, await CheckPayTypeGroup(srcDim.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(SourceJobCodes, item, await CheckJobCodeGroup(srcDim.jobCode, new List<JobCodes>()));

                    }
                    else
                    if (srcDim.numerator != null && srcDim.denominator == null)

                    {
                        // Numerator
                        await CheckDictionaryObject<Entities>(SourceEntities, item, await CheckEntityGroup(srcDim.numerator.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(SourceDepartments, item, await CheckDepartmentGroup(srcDim.numerator.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(SourceStatisticsCode, item, await CheckStatisticsCodeGroup(srcDim.numerator.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(SourceGLAccounts, item, await CheckGLAccountGroup(srcDim.numerator.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(SourcePayTypes, item, await CheckPayTypeGroup(srcDim.numerator.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(SourceJobCodes, item, await CheckJobCodeGroup(srcDim.numerator.jobCode, new List<JobCodes>()));

                        // Non Numerator
                        await CheckDictionaryObject<Entities>(SourceEntities, item, await CheckEntityGroup(srcDim.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(SourceDepartments, item, await CheckDepartmentGroup(srcDim.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(SourceStatisticsCode, item, await CheckStatisticsCodeGroup(srcDim.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(SourceGLAccounts, item, await CheckGLAccountGroup(srcDim.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(SourcePayTypes, item, await CheckPayTypeGroup(srcDim.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(SourceJobCodes, item, await CheckJobCodeGroup(srcDim.jobCode, new List<JobCodes>()));

                    }
                    else
                    if (srcDim.numerator == null && srcDim.denominator == null)


                    {
                        await CheckDictionaryObject<Entities>(SourceEntities, item, await CheckEntityGroup(srcDim.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(SourceDepartments, item, await CheckDepartmentGroup(srcDim.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(SourceStatisticsCode, item, await CheckStatisticsCodeGroup(srcDim.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(SourceGLAccounts, item, await CheckGLAccountGroup(srcDim.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(SourcePayTypes, item, await CheckPayTypeGroup(srcDim.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(SourceJobCodes, item, await CheckJobCodeGroup(srcDim.jobCode, new List<JobCodes>()));

                    }

                    var alltargetdrs = item.target.dataRow;
                    foreach (var drs in alltargetdrs)
                    {


                        if (drs.budgetversion_code != null)
                        {

                            var tarbvid = AllBV.Where(f => f.Code.ToUpper() == drs.budgetversion_code.ToUpper()).FirstOrDefault();
                            AllBVIDs.Add(tarbvid.BudgetVersionID);
                        }
                    }

                    var TargetDim = item.target.dimensionRow;

                    if (TargetDim.numerator != null && TargetDim.denominator != null)
                    {
                        // Numerator
                        await CheckDictionaryObject<Entities>(TargetEntities, item, await CheckEntityGroup(TargetDim.numerator.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(TargetDepartments, item, await CheckDepartmentGroup(TargetDim.numerator.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(TargetStatisticsCode, item, await CheckStatisticsCodeGroup(TargetDim.numerator.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(TargetGLAccounts, item, await CheckGLAccountGroup(TargetDim.numerator.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(TargetPayTypes, item, await CheckPayTypeGroup(TargetDim.numerator.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(TargetJobCodes, item, await CheckJobCodeGroup(TargetDim.numerator.jobCode, new List<JobCodes>()));
                        //Denominator
                        await CheckDictionaryObject<Entities>(TargetEntities, item, await CheckEntityGroup(TargetDim.denominator.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(TargetDepartments, item, await CheckDepartmentGroup(TargetDim.denominator.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(TargetStatisticsCode, item, await CheckStatisticsCodeGroup(TargetDim.denominator.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(TargetGLAccounts, item, await CheckGLAccountGroup(TargetDim.denominator.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(TargetPayTypes, item, await CheckPayTypeGroup(TargetDim.denominator.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(TargetJobCodes, item, await CheckJobCodeGroup(TargetDim.denominator.jobCode, new List<JobCodes>()));

                    }
                    else
                    if (TargetDim.numerator == null && TargetDim.denominator != null)

                    {
                        //Denominator
                        await CheckDictionaryObject<Entities>(TargetEntities, item, await CheckEntityGroup(TargetDim.denominator.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(TargetDepartments, item, await CheckDepartmentGroup(TargetDim.denominator.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(TargetStatisticsCode, item, await CheckStatisticsCodeGroup(TargetDim.denominator.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(TargetGLAccounts, item, await CheckGLAccountGroup(TargetDim.denominator.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(TargetPayTypes, item, await CheckPayTypeGroup(TargetDim.denominator.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(TargetJobCodes, item, await CheckJobCodeGroup(TargetDim.denominator.jobCode, new List<JobCodes>()));

                        // Non Numerator
                        await CheckDictionaryObject<Entities>(TargetEntities, item, await CheckEntityGroup(TargetDim.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(TargetDepartments, item, await CheckDepartmentGroup(TargetDim.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(TargetStatisticsCode, item, await CheckStatisticsCodeGroup(TargetDim.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(TargetGLAccounts, item, await CheckGLAccountGroup(TargetDim.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(TargetPayTypes, item, await CheckPayTypeGroup(TargetDim.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(TargetJobCodes, item, await CheckJobCodeGroup(TargetDim.jobCode, new List<JobCodes>()));

                    }
                    else
                    if (TargetDim.numerator != null && TargetDim.denominator == null)

                    {
                        // Numerator
                        await CheckDictionaryObject<Entities>(TargetEntities, item, await CheckEntityGroup(TargetDim.numerator.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(TargetDepartments, item, await CheckDepartmentGroup(TargetDim.numerator.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(TargetStatisticsCode, item, await CheckStatisticsCodeGroup(TargetDim.numerator.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(TargetGLAccounts, item, await CheckGLAccountGroup(TargetDim.numerator.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(TargetPayTypes, item, await CheckPayTypeGroup(TargetDim.numerator.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(TargetJobCodes, item, await CheckJobCodeGroup(TargetDim.numerator.jobCode, new List<JobCodes>()));

                        // Non Numerator
                        await CheckDictionaryObject<Entities>(TargetEntities, item, await CheckEntityGroup(TargetDim.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(TargetDepartments, item, await CheckDepartmentGroup(TargetDim.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(TargetStatisticsCode, item, await CheckStatisticsCodeGroup(TargetDim.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(TargetGLAccounts, item, await CheckGLAccountGroup(TargetDim.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(TargetPayTypes, item, await CheckPayTypeGroup(TargetDim.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(TargetJobCodes, item, await CheckJobCodeGroup(TargetDim.jobCode, new List<JobCodes>()));

                    }
                    else
                    if (TargetDim.numerator == null && TargetDim.denominator == null)


                    {
                        await CheckDictionaryObject<Entities>(TargetEntities, item, await CheckEntityGroup(TargetDim.entity, new List<Entities>()));
                        await CheckDictionaryObject<Departments>(TargetDepartments, item, await CheckDepartmentGroup(TargetDim.department, new List<Departments>()));
                        await CheckDictionaryObject<StatisticsCodes>(TargetStatisticsCode, item, await CheckStatisticsCodeGroup(TargetDim.statistic, new List<StatisticsCodes>()));
                        await CheckDictionaryObject<GLAccounts>(TargetGLAccounts, item, await CheckGLAccountGroup(TargetDim.generalLedger, new List<GLAccounts>()));
                        await CheckDictionaryObject<PayTypes>(TargetPayTypes, item, await CheckPayTypeGroup(TargetDim.payType, new List<PayTypes>()));
                        await CheckDictionaryObject<JobCodes>(TargetJobCodes, item, await CheckJobCodeGroup(TargetDim.jobCode, new List<JobCodes>()));

                    }

                    // LoadGroupCheckData();
                    ProcessTargetDimensions(item);

                }
                return true;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                return false;
            }

        }

        private void ProcessTargetDimensions(ABS.DBModels.Processing.ForecastSection item)
        {

            List<ABS.DBModels.Processing.DimensionRow> ndr = new List<ABS.DBModels.Processing.DimensionRow>();
            Console.WriteLine("Processing Target Dimensions");

            if (ForecastObject.forecast_budgetversion_scenario_type_Code.ToUpper() == "ST")
            {
                var ListofEntities = TargetEntities[item];
                var ListofDepartments = TargetDepartments[item];
                var ListofStatsCodes = TargetStatisticsCode[item];

 
                foreach (var ent in ListofEntities)
                {
                    foreach (var dept in ListofDepartments)
                    {
                        foreach (var stcode in ListofStatsCodes)
                        {
                            var targetdimensionrow = new ABS.DBModels.Processing.DimensionRow();
                            targetdimensionrow.entity = ent.EntityID.ToString();
                            targetdimensionrow.department = dept.DepartmentID.ToString();
                            targetdimensionrow.statistic = stcode.StatisticsCodeID.ToString();
                            ndr.Add(targetdimensionrow);
                        }
                    }              
                }
            }
            else
            if (ForecastObject.forecast_budgetversion_scenario_type_Code.ToUpper() == "GL")
            {

                var ListofEntities = TargetEntities[item];
                var ListofDepartments = TargetDepartments[item];
                var ListofGLAccount = TargetGLAccounts[item];

                foreach (var ent in ListofEntities)
                {
                    foreach (var dept in ListofDepartments)
                    {
                        foreach (var glcode in ListofGLAccount)
                        {
                            var targetdimensionrow = new ABS.DBModels.Processing.DimensionRow();

                            targetdimensionrow.entity = ent.EntityID.ToString();
                            targetdimensionrow.department = dept.DepartmentID.ToString();
                            targetdimensionrow.generalLedger = glcode.GLAccountID.ToString();
                            ndr.Add(targetdimensionrow);
                        }
                    }
                }

            }
            else
            if (ForecastObject.forecast_budgetversion_scenario_type_Code.ToUpper() == "SF")
            {

                var ListofEntities = TargetEntities[item];
                var ListofDepartments = TargetDepartments[item];
                var ListofJobCodes = TargetJobCodes[item];
                var ListofPayTypeCodes = TargetPayTypes[item];
                var ListofStatsCodes = TargetStatisticsCode[item];
                 foreach (var ent in ListofEntities)
                {
                    foreach (var dept in ListofDepartments)
                    {
                        foreach (var ptcodes in ListofPayTypeCodes)
                        {
                            foreach (var jccodes in ListofJobCodes)
                            {
                                var targetdimensionrow = new ABS.DBModels.Processing.DimensionRow();

                                targetdimensionrow.entity = ent.EntityID.ToString();
                                targetdimensionrow.department = dept.DepartmentID.ToString();
                                targetdimensionrow.jobCode = jccodes.JobCodeID.ToString();
                                targetdimensionrow.payType = ptcodes.PayTypeID.ToString();
                                ndr.Add(targetdimensionrow);
                            }
                        }
                    }
                }

            }


            AllTargetDimensionRows.Add(item, ndr);


        }

        private void LoadGroupCheckData()
        {



        }

        private async Task<bool> CheckDictionaryObject<T>(Dictionary<ABS.DBModels.Processing.ForecastSection, List<T>> sourceDict, ABS.DBModels.Processing.ForecastSection item, List<T> newlist) where T : class
        {
            try
            {
                await Task.Delay(1);
                if (sourceDict.ContainsKey(item))
                {
                    var itemlist = (List<T>)sourceDict[item];


                    itemlist.AddRange(newlist);

                    sourceDict[item] = itemlist;
                }
                else
                {
                    sourceDict.Add(item, newlist);
                }
                return true;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                return false;
            }
        }

        private async Task<bool> LoadAllSTData()
        {
            //System.Threading.ThreadPool.QueueUserWorkItem(new System.Threading.WaitCallback())
            Console.WriteLine(" LOADING ALL ST DATA ");
            AllIT = await opItemTypes.getAllItemTypes(_context);
            AllEnt = await opEntities.GetAllEntities(_context);
            AllDept = await Operations.opDepartments.GetAllDepartments(_context);
            AllTimePeriods = await opTimePeriods.GetAllTimePeriods(_context);
            AllDatascenario = await Operations.opDataScenario.GetAllDataScenarios(_context);
            AllRelationships = await Operations.opRelationships.GetAllRelationships(_context);
            AllStatsCodes = await Operations.opStatisticsCodes.GetAllStatisticsCodes(_context);
            savezerovalues = SaveZeroValues(_context);
            months = AllIT.Where(d => d.ItemTypeKeyword.ToUpper() == "MONTHS").ToList();
            return true;
        }
        private async Task<bool> LoadAllGLData()
        {
            Console.WriteLine(" LOADING ALL GL DATA ");

            // AllBV = await Operations.opBudgetVersions.GetAllBudgetVersions(_context);
            AllIT = await Operations.opItemTypes.getAllItemTypes(_context);
            AllEnt = await Operations.opEntities.GetAllEntities(_context);
            AllDept = await Operations.opDepartments.GetAllDepartments(_context);
            AllTimePeriods = await Operations.opTimePeriods.GetAllTimePeriods(_context);
            AllDatascenario = await Operations.opDataScenario.GetAllDataScenarios(_context);
            AllRelationships = await Operations.opRelationships.GetAllRelationships(_context);
            AllStatsCodes = await Operations.opStatisticsCodes.GetAllStatisticsCodes(_context);
            AllGLAccounts = await Operations.opGLAccounts.GetAllGLAccounts(_context); months = AllIT.Where(d => d.ItemTypeKeyword.ToUpper() == "MONTHS").ToList();
            months = AllIT.Where(d => d.ItemTypeKeyword.ToUpper() == "MONTHS").ToList();

            savezerovalues = SaveZeroValues(_context);
            return true;
        }
        private async Task<bool> LoadAllSFData()
        {
            Console.WriteLine(" LOADING ALL SF DATA ");

            // AllBV = await Operations.opBudgetVersions.GetAllBudgetVersions(_context);
            AllIT = await Operations.opItemTypes.getAllItemTypes(_context);
            AllEnt = await Operations.opEntities.GetAllEntities(_context);
            AllDept = await Operations.opDepartments.GetAllDepartments(_context);
            AllTimePeriods = await Operations.opTimePeriods.GetAllTimePeriods(_context);
            AllDatascenario = await Operations.opDataScenario.GetAllDataScenarios(_context);
            AllRelationships = await Operations.opRelationships.GetAllRelationships(_context);
            AllStatsCodes = await Operations.opStatisticsCodes.GetAllStatisticsCodes(_context);
            AllPayTypes = await Operations.opPayTypes.GetAllPayTypes(_context);
            AllJobCodes = await Operations.opJobCodes.GetAllJobCodes(_context);
            months = AllIT.Where(d => d.ItemTypeKeyword.ToUpper() == "MONTHS").ToList();

            savezerovalues = SaveZeroValues(_context);
            return true;
        }



        private bool SaveZeroValues(BudgetingContext context)
        {
            var SaveZeroValues = AllIT.Where(f => f.ItemTypeKeyword == "CONFIGURATION" && f.ItemTypeCode == "FORECASTSAVEZEROVALUES").FirstOrDefault();

            bool saveresults = bool.Parse(SaveZeroValues.ItemTypeValue);
            return saveresults;
        }



        private void GEnerateObjects()
        {
            throw new NotImplementedException();
        }

        private void DBOperations()
        {
            throw new NotImplementedException();
        }


        private async Task<List<Entities>> CheckEntityGroup(string entityID, List<Entities> returnList, bool isTarget = false)
        {

            if (entityID == "")
            { }
            else
                if (entityID == "all")
            {
                Operations.opEntities opEntities = new Operations.opEntities();
                // return all non group statistics

                //returnList = await opEntities.GetAllNonGroupEntities(_context);
                returnList.AddRange(AllEnt.Where(f => f.isGroup == false).ToList());
            }
            else
            {
                Operations.opEntities opEntities = new Operations.opEntities();
                // var entity = await _context.Entities.FindAsync(int.Parse(entityID));
                var entity = AllEnt.Where(f => f.EntityID == (int.Parse(entityID))).FirstOrDefault();
                if (entity == null) { return returnList; }
                // if the entity passed in is a group get a list of the entities contained in the group
                bool isGroup = entity.isGroup ?? false;
                if (isGroup)
                {
                    Operations.opRelationships opRelationships = new Operations.opRelationships();
                    // List<Relationships> relationships = await opRelationships.getGroupChildData(entity.EntityID, "Entity", _context);
                    List<Relationships> relationships = opRelationships.getGroupChildData(entity.EntityID, "Entity", AllRelationships);
                    if (relationships == null || relationships.Count == 0)
                    {


                        // throw new ArgumentException("Entity is flagged as a group but has no children.");
                    }
                    // create a comma separated list that will be used to get the matching entities
                    string childIDs = string.Join(",", relationships.Select(x => x.ChildID));
                    List<Entities> childEntityResults = await opEntities.getGroupList(childIDs, AllEnt);
                    // recursively call this function to check if each of the children are a group
                    foreach (Entities childEntity in childEntityResults)
                    {
                        // results will be added to the list in the calls once they no longer have child results
                        await CheckEntityGroup(childEntity.EntityID.ToString(), returnList);
                    }
                }
                // if it is not a group add the base entity to the list and return it
                else
                {
                    returnList.Add(entity);
                }
            }

            return returnList;
        }
        private async Task<List<Departments>> CheckDepartmentGroup(string departmentID, List<Departments> returnList)
        {
            if (departmentID == "") { }
            else
            if (departmentID == "all")
            {
                Operations.opDepartments opDepartments = new Operations.opDepartments();
                // return all non group statistics

                //returnList = await opDepartments.GetAllNonGroupDepartments(_context);
                returnList.AddRange(AllDept.Where(e => e.IsGroup == false && e.IsMaster == false).ToList());

            }
            else
            {
                Operations.opDepartments opDepartments = new Operations.opDepartments();
                // var department = await _context.Departments.FindAsync(int.Parse(departmentID));
                var department = AllDept.Where(x => x.DepartmentID == int.Parse(departmentID)).FirstOrDefault();
                if (department == null) { return returnList; }
                // if the department passed in is a group get a list of the departments contained in the group
                bool isGroup = department.IsGroup ?? false;
                if (isGroup)
                {
                    Operations.opRelationships opRelationships = new Operations.opRelationships();
                    //List<Relationships> relationships = await opRelationships.getGroupChildData(department.DepartmentID, "Department", _context);
                    List<Relationships> relationships = opRelationships.getGroupChildData(department.DepartmentID, "Department", AllRelationships);
                    if (relationships == null || relationships.Count == 0)
                    {
                        //  throw new ArgumentException("Department is flagged as a group but has no children.");
                    }
                    // create a comma separated list that will be used to get the matching departments
                    string childIDs = string.Join(",", relationships.Select(x => x.ChildID));
                    //List<Departments> childDepartmentResults = await opDepartments.getGroupList(childIDs, AllDept);
                    List<Departments> childDepartmentResults = opDepartments.getGroupList(childIDs, AllDept);
                    // recursively call this function to check if each of the children are a group
                    foreach (Departments childDepartment in childDepartmentResults)
                    {
                        // results will be added to the list in the calls once they no longer have child results
                        await CheckDepartmentGroup(childDepartment.DepartmentID.ToString(), returnList);
                    }
                }
                // if it is not a group add the base department to the list and return it
                else
                {
                    returnList.Add(department);
                }

                //CHeck For Hierarchy Data
                bool isHierchy = department.IsHierarchy ?? false;
                if (isHierchy)
                {
                    Operations.opRelationships opRelationships = new Operations.opRelationships();
                    //List<Relationships> relationships = await opRelationships.getGroupChildData(department.DepartmentID, "Department", _context);
                    List<Relationships> relationships = opRelationships.getHierarchyChildData(department.DepartmentID, "Department", AllRelationships);
                    if (relationships == null || relationships.Count == 0)
                    {
                        //  throw new ArgumentException("Department is flagged as a group but has no children.");
                    }
                    // create a comma separated list that will be used to get the matching departments
                    string childIDs = string.Join(",", relationships.Select(x => x.ChildID));
                    //List<Departments> childDepartmentResults = await opDepartments.getGroupList(childIDs, AllDept);
                    List<Departments> childDepartmentResults = opDepartments.getGroupList(childIDs, AllDept);
                    // recursively call this function to check if each of the children are a group
                    foreach (Departments childDepartment in childDepartmentResults)
                    {
                        // results will be added to the list in the calls once they no longer have child results
                        await CheckDepartmentGroup(childDepartment.DepartmentID.ToString(), returnList);
                    }
                }
                // if it is not a group add the base department to the list and return it
                else
                {
                    if (returnList.Contains(department)) { }
                    else
                    {
                        returnList.Add(department);
                    }
                }
            }

            return returnList;
        }

        private async Task<List<StatisticsCodes>> CheckStatisticsCodeGroup(string statisticsCodeID, List<StatisticsCodes> returnList)
        {


            Operations.opStatisticsCodes opStatisticsCodes = new Operations.opStatisticsCodes();
            //   var _contextInclude = opStatisticsCodes.getopStatisticsCodesContext(_context);

            // if it is a mapping value it will be looked up later because it only applies to the specific entity/department combination
            // doing the lookup here would cause it to get paired with every combination instead
            if (statisticsCodeID == "")
            {
                return returnList;
            }
            if (statisticsCodeID == "primary" || statisticsCodeID == "secondary" || statisticsCodeID == "tertiary")
            {
                return returnList;
            }

            if (statisticsCodeID == "all")
            {
                // return all non group statistics
                //   returnList = await opStatisticsCodes.GetAllNonGroupStatistics(_context);
                returnList.AddRange(AllStatsCodes.Where(e => e.IsGroup == false && e.IsMaster == false).ToList());
            }
            else
            {
                var statisticsCode = AllStatsCodes.Where(f => f.StatisticsCodeID == (int.Parse(statisticsCodeID))).FirstOrDefault();
                //var statisticsCode = await _contextInclude.StatisticsCodes.FindAsync(int.Parse(statisticsCodeID));
                List<StatisticsCodes> statisticsCodeResults = new List<StatisticsCodes>();

                // if the statisticsCode passed in is a group get a list of the statisticsCodes contained in the group
                bool isGroup = statisticsCode.IsGroup ?? false;
                if (isGroup)
                {
                    Operations.opRelationships opRelationships = new Operations.opRelationships();
                    // List<Relationships> relationships = await opRelationships.getGroupChildData(statisticsCode.StatisticsCodeID, "StatisticsCode", _context);
                    List<Relationships> relationships = opRelationships.getGroupChildData(statisticsCode.StatisticsCodeID, "StatisticsCode", AllRelationships);
                    if (relationships == null || relationships.Count == 0)
                    {
                        // throw new ArgumentException("StatisticsCode is flagged as a group but has no children.");
                    }
                    // create a comma separated list that will be used to get the matching statisticsCodes
                    string childIDs = string.Join(",", relationships.Select(x => x.ChildID));
                    // List<StatisticsCodes> childStatisticsCodeResults = await opStatisticsCodes.getGroupList(childIDs, _context);
                    List<StatisticsCodes> childStatisticsCodeResults = opStatisticsCodes.getGroupList(childIDs, AllStatsCodes);
                    // recursively call this function to check if each of the children are a group
                    foreach (StatisticsCodes childStatisticsCode in childStatisticsCodeResults)
                    {
                        // results will be added to the list in the calls once they no longer have child results
                        await CheckStatisticsCodeGroup(childStatisticsCode.StatisticsCodeID.ToString(), returnList);
                    }
                }
                // if it is not a group add the base statisticsCode to the list and return it
                else
                {
                    returnList.Add(statisticsCode);
                }
            }

            return returnList;
        }

        private async Task<List<GLAccounts>> CheckGLAccountGroup(string glAccountID, List<GLAccounts> returnList)
        {
            if (glAccountID == "") { }
            else
            if (glAccountID == "all")
            {
                Operations.opGLAccounts opGLAccounts = new Operations.opGLAccounts();
                // return all non group statistics
                // returnList = await opGLAccounts.GetAllNonGroupGLAccounts(_context);
                returnList.AddRange(AllGLAccounts.Where(e => e.IsGroup == false && e.IsMaster == false).ToList());
            }
            else
            {
                Operations.opGLAccounts opGLAccounts = new Operations.opGLAccounts();
                //var glAccount = await _context.GLAccounts.FindAsync(int.Parse(glAccountID));
                var glAccount = AllGLAccounts.Where(f => f.GLAccountID == int.Parse(glAccountID)).FirstOrDefault();

                // if the glAccount passed in is a group get a list of the glAccounts contained in the group
                bool isGroup = glAccount.IsGroup ?? false;
                if (isGroup)
                {
                    Operations.opRelationships opRelationships = new Operations.opRelationships();
                    List<Relationships> relationships = opRelationships.getGroupChildData(glAccount.GLAccountID, "GLAccount", AllRelationships);
                    if (relationships == null || relationships.Count == 0)
                    {
                        //   throw new ArgumentException("GLAccount is flagged as a group but has no children.");
                    }
                    // create a comma separated list that will be used to get the matching glAccounts
                    string childIDs = string.Join(",", relationships.Select(x => x.ChildID));
                    List<GLAccounts> childGLAccountResults = opGLAccounts.getGroupList(childIDs, AllGLAccounts);
                    //List<GLAccounts> childGLAccountResults = await opGLAccounts.getGroupList(childIDs, _context);
                    // recursively call this function to check if each of the children are a group
                    foreach (GLAccounts childGLAccount in childGLAccountResults)
                    {
                        // results will be added to the list in the calls once they no longer have child results
                        await CheckGLAccountGroup(childGLAccount.GLAccountID.ToString(), returnList);
                    }
                }
                // if it is not a group add the base glAccount to the list and return it
                else
                {
                    returnList.Add(glAccount);
                }
                bool ishierarchy = glAccount.IsHierarchy ?? false;
                if (ishierarchy)
                {
                    Operations.opRelationships opRelationships = new Operations.opRelationships();
                    List<Relationships> relationships = opRelationships.getHierarchyChildData(glAccount.GLAccountID, "GLAccount", AllRelationships);
                    if (relationships == null || relationships.Count == 0)
                    {
                        //   throw new ArgumentException("GLAccount is flagged as a group but has no children.");
                    }
                    // create a comma separated list that will be used to get the matching glAccounts
                    string childIDs = string.Join(",", relationships.Select(x => x.ChildID));
                    List<GLAccounts> childGLAccountResults = opGLAccounts.getGroupList(childIDs, AllGLAccounts);
                    //List<GLAccounts> childGLAccountResults = await opGLAccounts.getGroupList(childIDs, _context);
                    // recursively call this function to check if each of the children are a group
                    foreach (GLAccounts childGLAccount in childGLAccountResults)
                    {
                        // results will be added to the list in the calls once they no longer have child results
                        await CheckGLAccountGroup(childGLAccount.GLAccountID.ToString(), returnList);
                    }
                }
                // if it is not a group add the base glAccount to the list and return it
                else
                {
                    if (returnList.Contains(glAccount)) { }
                    else
                    {
                        returnList.Add(glAccount);
                    }
                }
            }

            return returnList;
        }

        private async Task<List<JobCodes>> CheckJobCodeGroup(string jobCodeID, List<JobCodes> returnList)
        {
            if (jobCodeID == "") { }
            else
            if (jobCodeID == "all")
            {
                Operations.opJobCodes opJobCodes = new Operations.opJobCodes();
                // return all non group statistics
                // returnList = await opJobCodes.GetAllNonGroupJobCodes(_context);
                returnList.AddRange(AllJobCodes.Where(e => e.IsGroup == false && e.IsMaster == false).ToList());
            }
            else
            {
                Operations.opJobCodes opJobCodes = new Operations.opJobCodes();
                // var jobCode = await _context.JobCodes.FindAsync(int.Parse(jobCodeID));
                var jobCode = AllJobCodes.Where(f => f.JobCodeID == (int.Parse(jobCodeID))).FirstOrDefault();

                // if the jobCode passed in is a group get a list of the jobCodes contained in the group
                bool isGroup = jobCode.IsGroup ?? false;
                if (isGroup)
                {
                    Operations.opRelationships opRelationships = new Operations.opRelationships();
                    List<Relationships> relationships = opRelationships.getGroupChildData(jobCode.JobCodeID, "JobCode", AllRelationships);
                    //List<Relationships> relationships = await opRelationships.getGroupChildData(jobCode.JobCodeID, "JobCode", _context);
                    if (relationships == null || relationships.Count == 0)
                    {
                        //  throw new ArgumentException("JobCodes is flagged as a group but has no children.");
                    }
                    else
                    {
                        // create a comma separated list that will be used to get the matching jobCodes
                        string childIDs = string.Join(",", relationships.Select(x => x.ChildID));
                        List<JobCodes> childJobCodesResults = opJobCodes.getGroupList(childIDs, AllJobCodes);
                        //List<JobCodes> childJobCodesResults = await opJobCodes.getGroupList(childIDs, _context);
                        // recursively call this function to check if each of the children are a group
                        foreach (JobCodes childJobCodes in childJobCodesResults)
                        {
                            // results will be added to the list in the calls once they no longer have child results
                            await CheckJobCodeGroup(childJobCodes.JobCodeID.ToString(), returnList);
                        }
                    }
                }
                // if it is not a group add the base jobCode to the list and return it
                else
                {
                    returnList.Add(jobCode);
                }
            }

            return returnList;
        }

        private async Task<List<PayTypes>> CheckPayTypeGroup(string payTypeID, List<PayTypes> returnList)
        {

            if (payTypeID == "") { }
            else
            if (payTypeID == "all")
            {
                Operations.opPayTypes opPayTypes = new Operations.opPayTypes();
                // return all non group statistics
                ///returnList = await opPayTypes.GetAllNonGroupPayTypes(_context);
                returnList.AddRange(AllPayTypes.Where(e => e.IsGroup == false && e.IsMaster == false).ToList());

            }
            else if (payTypeID.Contains(','))
            {
                // pay type distribution has productive and non productive ids and both need to be looked up, they are sent together
                foreach (string payType in payTypeID.Split(','))
                {
                    // results will be added to the list in the calls once they no longer have child results
                    await CheckPayTypeGroup(payType, returnList);
                }
            }
            else
            {
                Operations.opPayTypes opPayTypes = new Operations.opPayTypes();
                //  var payType = await _context.PayTypes.FindAsync(int.Parse(payTypeID));
                var payType = AllPayTypes.Where(x => x.PayTypeID == int.Parse(payTypeID)).FirstOrDefault();

                // if the payType passed in is a group get a list of the payTypes contained in the group
                bool isGroup = payType.IsGroup ?? false;
                if (isGroup)
                {
                    Operations.opRelationships opRelationships = new Operations.opRelationships();
                    List<Relationships> relationships = opRelationships.getGroupChildData(payType.PayTypeID, "PayType", AllRelationships);
                    //List<Relationships> relationships = await opRelationships.getGroupChildData(payType.PayTypeID, "PayType", _context);
                    if (relationships == null || relationships.Count == 0)
                    {
                        //  throw new ArgumentException("PayTypes is flagged as a group but has no children.");
                    }
                    else
                    {
                        // create a comma separated list that will be used to get the matching payTypes
                        string childIDs = string.Join(",", relationships.Select(x => x.ChildID));
                        // List<PayTypes> childPayTypesResults = await opPayTypes.getGroupList(childIDs, _context);
                        List<PayTypes> childPayTypesResults = opPayTypes.getGroupList(childIDs, AllPayTypes);
                        // recursively call this function to check if each of the children are a group
                        foreach (PayTypes childPayTypes in childPayTypesResults)
                        {
                            // results will be added to the list in the calls once they no longer have child results
                            await CheckPayTypeGroup(childPayTypes.PayTypeID.ToString(), returnList);
                        }
                    }
                }
                // if it is not a group add the base payType to the list and return it
                else
                {
                    returnList.Add(payType);
                }
            }

            return returnList;
        }

        public async static Task<List<T>> CheckisGroup<T>(string id, List<T> returnList) where T : class
        {
            try
            {
                Type getType = typeof(T);

                await Task.Delay(1);
                if (id == "")
                { return returnList; }
                else
                if (id == "all")
                { }
                else
                {

                }
                return returnList;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }

        }

        public async Task<bool> checkEntityisGroup(string id, bool isSource)
        {
            await Task.Delay(1);
            var grp = AllEnt.Where(f => f.EntityID == int.Parse(id)).FirstOrDefault();
            var mparent = AllRelationships.Where(f => f.ParentID == int.Parse(id)).ToList();

            if (grp.isGroup.GetValueOrDefault() && mparent.Count > 0)
            {
                if (isSource == true)
                {
                    groupcheck.issourceentitygroup = true;
                }
                else { groupcheck.istargetentitygroup = true; }
            }
            else
            {
                if (isSource == true)
                {
                    groupcheck.issourceentitygroup = false;
                }
                else { groupcheck.istargetentitygroup = false; }

            }



            return true;

        }
        public async Task<bool> checkDepartmentisGroup(string id, bool isSource)
        {
            await Task.Delay(1);
            var grp = AllDept.Where(f => f.DepartmentID == int.Parse(id)).FirstOrDefault();
            var mparent = AllRelationships.Where(f => f.ParentID == int.Parse(id)).ToList();

            bool isgrp = grp.IsGroup.GetValueOrDefault();
            bool ishrc = grp.IsHierarchy.GetValueOrDefault();
            bool ismast = grp.IsMaster.GetValueOrDefault();

            bool checkgp = false;
            if (isgrp || ishrc || ismast)
            {
                checkgp = true;
            }


            if (checkgp && mparent.Count > 0)
            {
                if (isSource == true)
                {
                    groupcheck.issourcedepartmentgroup = true;
                }
                else { groupcheck.istargetentitygroup = true; }
            }
            else
            {
                if (isSource == true)
                {
                    groupcheck.issourcedepartmentgroup = false;
                }
                else { groupcheck.istargetentitygroup = false; }

            }


            return true;

        }
        public async Task<bool> checkGLAccountsisGroup(string id, bool isSource)
        {
            await Task.Delay(1);
            var grp = AllGLAccounts.Where(f => f.GLAccountID == int.Parse(id)).FirstOrDefault();
            var mparent = AllRelationships.Where(f => f.ParentID == int.Parse(id)).ToList();

            bool isgrp = grp.IsGroup.GetValueOrDefault();
            bool ishrc = grp.IsHierarchy.GetValueOrDefault();
            bool ismast = grp.IsMaster.GetValueOrDefault();

            bool checkgp = false;
            if (isgrp || ishrc || ismast)
            {
                checkgp = true;
            }


            if (checkgp && mparent.Count > 0)
            {
                if (isSource == true)
                {
                    groupcheck.issourcedepartmentgroup = true;
                }
                else { groupcheck.istargetentitygroup = true; }
            }
            else
            {
                if (isSource == true)
                {
                    groupcheck.issourcedepartmentgroup = false;
                }
                else { groupcheck.istargetentitygroup = false; }

            }


            return true;

        }
        public async Task<bool> checkJobCodeisGroup(string id, bool isSource)
        {
            await Task.Delay(1);
            var grp = AllJobCodes.Where(f => f.JobCodeID == int.Parse(id)).FirstOrDefault();
            var mparent = AllRelationships.Where(f => f.ParentID == int.Parse(id)).ToList();

            bool isgrp = grp.IsGroup.GetValueOrDefault();
            // bool ishrc = grp.ish.GetValueOrDefault();
            bool ismast = grp.IsMaster.GetValueOrDefault();

            bool checkgp = false;
            if (isgrp || ismast)
            {
                checkgp = true;
            }


            if (checkgp && mparent.Count > 0)
            {
                if (isSource == true)
                {
                    groupcheck.issourcedepartmentgroup = true;
                }
                else { groupcheck.istargetentitygroup = true; }
            }
            else
            {
                if (isSource == true)
                {
                    groupcheck.issourcedepartmentgroup = false;
                }
                else { groupcheck.istargetentitygroup = false; }

            }


            return true;

        }
        public async Task<bool> checkPayTYpeisGroup(string id, bool isSource)
        {
            await Task.Delay(1);
            var grp = AllPayTypes.Where(f => f.PayTypeID == int.Parse(id)).FirstOrDefault();
            var mparent = AllRelationships.Where(f => f.ParentID == int.Parse(id)).ToList();

            bool isgrp = grp.IsGroup.GetValueOrDefault();
            //bool ishrc = grp.IsHierarchy.GetValueOrDefault();
            bool ismast = grp.IsMaster.GetValueOrDefault();

            bool checkgp = false;
            if (isgrp || ismast)
            {
                checkgp = true;
            }


            if (checkgp && mparent.Count > 0)
            {
                if (isSource == true)
                {
                    groupcheck.issourcedepartmentgroup = true;
                }
                else { groupcheck.istargetentitygroup = true; }
            }
            else
            {
                if (isSource == true)
                {
                    groupcheck.issourcedepartmentgroup = false;
                }
                else { groupcheck.istargetentitygroup = false; }

            }


            return true;

        }

    }

    public class groupcheck
    {
        public bool issourceentitygroup { get; set; } = false;
        public bool issourcedepartmentgroup { get; set; } = false;
        public bool issourcestatisticsgroup { get; set; } = false;
        public bool issourcepaytypegroup { get; set; } = false;
        public bool issourcejobcodegroup { get; set; } = false;
        public bool issourceentityhierarchy { get; set; } = false;
        public bool issourcedepartmenthierarchy { get; set; } = false;
        public bool issourcestatisticshierarchy { get; set; } = false;
        public bool issourcepaytypehierarchy { get; set; } = false;
        public bool issourcejobcodehierarchy { get; set; } = false;

        public bool istargetentitygroup { get; set; } = false;
        public bool istargetdepartmentgroup { get; set; } = false;
        public bool istargetstatisticsgroup { get; set; } = false;
        public bool istargetpaytypegroup { get; set; } = false;
        public bool istargetjobcodegroup { get; set; } = false;
        public bool istargetentityhierarchy { get; set; } = false;
        public bool istargetdepartmenthierarchy { get; set; } = false;
        public bool istargetstatisticshierarchy { get; set; } = false;
        public bool istargetpaytypehierarchy { get; set; } = false;
        public bool istargetjobcodehierarchy { get; set; } = false;

    }
}
