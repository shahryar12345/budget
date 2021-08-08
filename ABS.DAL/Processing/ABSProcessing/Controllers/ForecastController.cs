using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using ABS.DBModels;

using ABSProcessing.Context;
using System.Net.Http;
using ABSProcessing.Operations;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Hangfire;
using System.Collections.Concurrent;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace ABSProcessing.Controllers
{
    [ApiController]
    [Route("/processing/[controller]")]
    public class ForecastController : ControllerBase
    {
        private readonly BudgetingContext _context;
        private readonly ILogger<ForecastController> _logger;
        static HttpClient client = new HttpClient();
        List<BudgetVersions> AllBV = new List<BudgetVersions>();
        List<ItemTypes> AllIT = new List<ItemTypes>();
        List<Entities> AllEnt = new List<Entities>();
        List<Departments> AllDept = new List<Departments>();
        List<StatisticsCodes> AllStatsCodes = new List<StatisticsCodes>();
        List<GLAccounts> AllGLAccounts = new List<GLAccounts>();
        List<TimePeriods> AllTimePeriods = new List<TimePeriods>();
        List<DataScenario> AllDatascenario = new List<DataScenario>();
        List<PayTypes> AllPayTypes = new List<PayTypes>();
        List<JobCodes> AllJobCodes = new List<JobCodes>();
        List<Relationships> AllRelationships = new List<Relationships>();

        ConcurrentBag<List<BudgetVersionGLAccounts>> BVGLSource = new ConcurrentBag<List<BudgetVersionGLAccounts>>();
        ConcurrentBag<List<BudgetVersionStaffing>> BVSFSource = new ConcurrentBag<List<BudgetVersionStaffing>>();
        ConcurrentBag<List<BudgetVersionStatistics>> BVSTSource = new ConcurrentBag<List<BudgetVersionStatistics>>();
        bool savezerovalues = false;

        public ForecastController(BudgetingContext context, ILogger<ForecastController> logger)
        {
            _context = context;
            _logger = logger;
        }
        public Dictionary<int, string> monthDictionary = new Dictionary<int, string>()
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

        [HttpPost]
        [Route("")]
        public async Task<ActionResult<string>> FormulaParse(Forecast forecast)
        {
            await LoadAllData(_context);
            //Operations.opBudgetVersions opBudgetVersions = new Operations.opBudgetVersions();
            //_context = opBudgetVersions.getBudgetVersionContext(context);
            Operations.opBudgetVersions opBudgetVersions = new Operations.opBudgetVersions();
            Operations.opItemTypes _opItemTypes = new Operations.opItemTypes();
            // this is not currently being used but if a forecast times out in the browser (longer than 90 seconds) this can be set to true to trigger a background job
            // after the initial error checks have been completed
            bool longProcessing = true;

            // get or create the target budget
            // there will only be a single target regardless of how many source budgets we use
            //   BudgetVersions targetBudget = await opBudgetVersions.GetBudgetVersionByCode(forecast.Forecast_budgetversion_code, _context);
            BudgetVersions targetBudget = AllBV.Where(f => f.Code == forecast.Forecast_budgetversion_code).FirstOrDefault();

            if (targetBudget == null)
            {
                throw new ArgumentException("Target budget version does not exist.");
            }

            List<ItemTypes> months = AllIT.Where(d => d.ItemTypeKeyword.ToUpper() == "MONTHS").ToList();
            List<ParsedSectionData> parsedSectionDataList = new List<ParsedSectionData>();
            List<int> AllBVIds = new List<int>();
            // for each section parse the dimensions so we can check for loops
            foreach (ForecastSection section in forecast.Forecastsections)
            {
                List<DataRowWithID> sourceDataRowWithIDs = new List<DataRowWithID>();
                foreach (DataRow dataRow in section.source.dataRow)
                {
                    string sourceBudgetCode = dataRow.budgetversion_code;
                    //BudgetVersions sourceBudget = await opBudgetVersions.GetBudgetVersionByCode(sourceBudgetCode, _context);
                    BudgetVersions sourceBudget = AllBV.Where(f => f.Code == sourceBudgetCode).FirstOrDefault();
                    if (sourceBudget == null)
                    {
                        throw new ArgumentException(string.Format("Source budget version '{0}' not found.", sourceBudgetCode));
                    }
                    // add the budgetversionid and month range to be used later
                    DataRowWithID dataRowWithID = new DataRowWithID();
                    dataRowWithID.budgetVersionID = sourceBudget.BudgetVersionID;
                    AllBVIds.Add(sourceBudget.BudgetVersionID);
                    // ratio does not pass months but should use all of them
                    if (section.forecastType == "ratio" || section.forecastType == "ratioGL_Statistics" || section.forecastType == "ratio_staffing_hours_statistics")
                    {
                        dataRowWithID.startMonth = "fiscalStartMonth-01";
                        dataRowWithID.endMonth = "fiscalStartMonth-12";
                    }
                    else
                    {
                        dataRowWithID.startMonth = dataRow.startMonth;
                        dataRowWithID.endMonth = dataRow.endMonth;
                    }
                    sourceDataRowWithIDs.Add(dataRowWithID);
                }

                // add the budgetversionid and month range to be used later
                DataRowWithID targetDataRowWithID = new DataRowWithID();
                targetDataRowWithID.budgetVersionID = targetBudget.BudgetVersionID;
                AllBVIds.Add(targetBudget.BudgetVersionID);

                // annualization passes months the rest should use all of the months
                if (section.forecastType == "annualization" || section.forecastType == "annualize_staffing_dollars" || section.forecastType == "annualize_staffing_hours")
                {
                    targetDataRowWithID.startMonth = section.target.dataRow[0].includeStartMonth;
                    targetDataRowWithID.endMonth = section.target.dataRow[0].includeEndMonth;
                }
                else
                {
                    targetDataRowWithID.startMonth = "fiscalStartMonth-01";
                    targetDataRowWithID.endMonth = "fiscalStartMonth-12";
                }

                // average wage rate will time out in the UI so it needs to be started as a background job
                if (section.forecastType == "staffing_average_wage_rate")
                {
                    longProcessing = true;
                }

                // save the data so that we don't have to do the calls again if it passes the loop check
                ParsedSectionData parsedSectionData = new ParsedSectionData();
                parsedSectionData.sourceBudgetInfo = sourceDataRowWithIDs;
                parsedSectionData.targetBudgetInfo = targetDataRowWithID;
                parsedSectionData.section = section;

                switch (forecast.Forecast_budgetversion_scenario_type)
                {

                    case "Statistic":

                        var opbvstat = new opBudgetVersionStatistics();
                        BVSTSource.Add(await opbvstat.getAllBVStatistics(AllBVIds.Distinct().ToList(), _context));
                        parsedSectionData.parsedSectionDimensionPairings = await GetDimensionData(sourceDataRowWithIDs, targetDataRowWithID, months, section, forecast.Forecast_budgetversion_scenario_type);

                        break;
                    case "General Ledger":
                        string forecastmethodtypeGL = "";
                        if (section != null)
                        {
                            forecastmethodtypeGL = section.forecastType.ToUpper();
                        }
                        if (forecastmethodtypeGL == "ratioGL_Statistics".ToUpper())
                        {
                            var opbvstatsf = new opBudgetVersionStatistics();
                            BVSTSource.Add(await opbvstatsf.getAllBVStatistics(AllBVIds.Distinct().ToList(), _context));

                        }
                        var opbvgl = new opBudgetVersionGLAccounts();
                        BVGLSource.Add(await opbvgl.getALlBVGL(AllBVIds.Distinct().ToList(), _context));
                        parsedSectionData.parsedSectionDimensionPairings = await GetDimensionData(sourceDataRowWithIDs, targetDataRowWithID, months, section, forecast.Forecast_budgetversion_scenario_type);

                        break;
                    case "Staffing":
                        string forecastmethodtype = "";
                        if (section != null)
                        {
                            forecastmethodtype = section.forecastType.ToUpper();
                        }
                        if (forecastmethodtype == "RATIO_STAFFING_HOURS_STATISTICS".ToUpper())
                        {
                            var opbvstatsf = new opBudgetVersionStatistics();
                            BVSTSource.Add(await opbvstatsf.getAllBVStatistics(AllBVIds.Distinct().ToList(), _context));

                        }
                        var opbvsf = new opBudgetVersionStaffing();
                        BVSFSource.Add(await opbvsf.getALlBVSF(AllBVIds.Distinct().ToList(), _context));

                        try
                        {
                            if (section.forecastType == "staffing_average_wage_rate")
                            {
                                section.source.dimensionRow.entity = "all";
                                section.source.dimensionRow.department = "all";
                                section.source.dimensionRow.jobCode = "all";
                                section.source.dimensionRow.payType = "all";
                                section.target.dimensionRow.entity = "all";
                                section.target.dimensionRow.department = "all";
                                section.target.dimensionRow.jobCode = "all";
                                section.target.dimensionRow.payType = "all";
                            }
                            else if (section.forecastType == "staffing_pay_type_distribution")
                            {
                                section.source.dimensionRow.payType = section.source.dimensionRow.productivePayTypeGroup + "," + section.source.dimensionRow.nonProductivePayTypeGroup;
                                section.target.dimensionRow = section.source.dimensionRow;
                            }
                            parsedSectionData.parsedSectionDimensionPairings = await GetDimensionData(sourceDataRowWithIDs, targetDataRowWithID, months, section, forecast.Forecast_budgetversion_scenario_type);
                        }
                        catch (ArgumentException)
                        {
                            // if one of the group checks fails due to having no children skip that forecast step
                            continue;
                        }
                        break;
                    default:
                        throw new ArgumentException(string.Format("Unknown scenario type: {0}"), forecast.Forecast_budgetversion_scenario_type);
                }

                parsedSectionDataList.Add(parsedSectionData);
            }

            // check sections that are set to automatically update for loops
            List<string> loopErrors = new List<string>();
            foreach (ParsedSectionData parsedSectionData in parsedSectionDataList)
            {
                if (parsedSectionData.section.automaticallyUpdate == "true")
                {
                    foreach (DataRowWithID sourceInfo in parsedSectionData.sourceBudgetInfo)
                    {
                        foreach (ParsedSectionDimensionPairings parsedSectionDimensionPairings in parsedSectionData.parsedSectionDimensionPairings)
                        {
                            int driverBudgetVersionID = 0;
                            int driverEntityID = 0;
                            int driverDepartmentID = 0;
                            int? driverStatisticID = null;
                            int? driverGeneralLedgerID = null;
                            int? driverJobCodeID = null;
                            int? driverPayTypeID = null;

                            // original values are passed each time so you know when you've found a loop
                            JObject originalValue = new JObject();
                            originalValue.Add("budgetVersionID", parsedSectionData.targetBudgetInfo.budgetVersionID);
                            if (parsedSectionData.section.source.dimensionRow.denominator == null)
                            {
                                driverBudgetVersionID = sourceInfo.budgetVersionID;
                                driverEntityID = int.Parse(parsedSectionDimensionPairings.sourceDimensionRow.entity);
                                driverDepartmentID = int.Parse(parsedSectionDimensionPairings.sourceDimensionRow.department);
                                originalValue.Add("entityID", parsedSectionDimensionPairings.targetDimensionRow.entity);
                                originalValue.Add("departmentID", parsedSectionDimensionPairings.targetDimensionRow.department);

                                switch (forecast.Forecast_budgetversion_scenario_type)
                                {
                                    case "Statistic":
                                        driverStatisticID = StringToNullableInt(parsedSectionDimensionPairings.sourceDimensionRow.statistic);
                                        originalValue.Add("statisticsCodeID", parsedSectionDimensionPairings.targetDimensionRow.statistic);
                                        originalValue.Add("generalLedgerID", null);
                                        originalValue.Add("jobCodeID", null);
                                        originalValue.Add("payTypeID", null);
                                        break;
                                    case "General Ledger":
                                        driverGeneralLedgerID = StringToNullableInt(parsedSectionDimensionPairings.sourceDimensionRow.generalLedger);
                                        originalValue.Add("statisticsCodeID", null);
                                        originalValue.Add("generalLedgerID", parsedSectionDimensionPairings.targetDimensionRow.generalLedger);
                                        originalValue.Add("jobCodeID", null);
                                        originalValue.Add("payTypeID", null);
                                        break;
                                    case "Staffing":
                                        driverJobCodeID = StringToNullableInt(parsedSectionDimensionPairings.sourceDimensionRow.jobCode);
                                        driverPayTypeID = StringToNullableInt(parsedSectionDimensionPairings.sourceDimensionRow.payType);
                                        originalValue.Add("statisticsCodeID", null);
                                        originalValue.Add("generalLedgerID", null);
                                        originalValue.Add("jobCodeID", parsedSectionDimensionPairings.targetDimensionRow.jobCode);
                                        originalValue.Add("payTypeID", parsedSectionDimensionPairings.targetDimensionRow.payType);
                                        break;
                                }
                            }
                            else
                            {
                                driverBudgetVersionID = sourceInfo.budgetVersionID;
                                driverEntityID = int.Parse(parsedSectionDimensionPairings.targetDenominatorDimensionRow.entity);
                                driverDepartmentID = int.Parse(parsedSectionDimensionPairings.targetDenominatorDimensionRow.department);
                                originalValue.Add("entityID", parsedSectionDimensionPairings.targetNumeratorDimensionRow.entity);
                                originalValue.Add("departmentID", parsedSectionDimensionPairings.targetNumeratorDimensionRow.department);

                                switch (forecast.Forecast_budgetversion_scenario_type)
                                {
                                    case "Statistic":
                                        driverStatisticID = StringToNullableInt(parsedSectionDimensionPairings.targetDenominatorDimensionRow.statistic);
                                        originalValue.Add("statisticID", parsedSectionDimensionPairings.targetNumeratorDimensionRow.statistic);
                                        originalValue.Add("generalLedgerID", null);
                                        originalValue.Add("jobCodeID", null);
                                        originalValue.Add("payTypeID", null);
                                        break;
                                    case "General Ledger":
                                        if (parsedSectionData.section.forecastType == "ratioGL_Statistics")
                                        {
                                            driverStatisticID = StringToNullableInt(parsedSectionDimensionPairings.targetDenominatorDimensionRow.statistic);
                                            originalValue.Add("statisticID", null);
                                            originalValue.Add("generalLedgerID", parsedSectionDimensionPairings.targetNumeratorDimensionRow.generalLedger);
                                            originalValue.Add("jobCodeID", null);
                                            originalValue.Add("payTypeID", null);
                                        }
                                        else
                                        {
                                            driverGeneralLedgerID = StringToNullableInt(parsedSectionDimensionPairings.targetDenominatorDimensionRow.generalLedger);
                                            originalValue.Add("statisticID", null);
                                            originalValue.Add("generalLedgerID", parsedSectionDimensionPairings.targetNumeratorDimensionRow.generalLedger);
                                            originalValue.Add("jobCodeID", null);
                                            originalValue.Add("payTypeID", null);
                                        }
                                        break;
                                    case "Staffing":
                                        if (parsedSectionData.section.forecastType == "ratio_staffing_hours_statistics")
                                        {
                                            driverStatisticID = StringToNullableInt(parsedSectionDimensionPairings.targetDenominatorDimensionRow.statistic);
                                            originalValue.Add("statisticsCodeID", null);
                                            originalValue.Add("generalLedgerID", null);
                                            originalValue.Add("jobCodeID", parsedSectionDimensionPairings.targetNumeratorDimensionRow.jobCode);
                                            originalValue.Add("payTypeID", parsedSectionDimensionPairings.targetNumeratorDimensionRow.payType);
                                        }
                                        else
                                        {
                                            driverJobCodeID = StringToNullableInt(parsedSectionDimensionPairings.targetDenominatorDimensionRow.jobCode);
                                            driverPayTypeID = StringToNullableInt(parsedSectionDimensionPairings.targetDenominatorDimensionRow.payType);
                                            originalValue.Add("statisticsCodeID", null);
                                            originalValue.Add("generalLedgerID", null);
                                            originalValue.Add("jobCodeID", parsedSectionDimensionPairings.targetNumeratorDimensionRow.jobCode);
                                            originalValue.Add("payTypeID", parsedSectionDimensionPairings.targetNumeratorDimensionRow.payType);
                                        }
                                        break;
                                }
                            }
                            // check if creating this would result in a loop 
                            if (await CheckForDimensionsLoop(originalValue, driverBudgetVersionID, driverEntityID, driverDepartmentID, driverStatisticID, driverGeneralLedgerID, driverJobCodeID, driverPayTypeID, parsedSectionDataList, parsedSectionData.section.forecastType))
                            {
                                if (driverStatisticID != null)
                                {
                                    loopErrors.Add("[Budget Version: " + driverBudgetVersionID + " Entity: " + driverEntityID + " Department: " + driverDepartmentID + " Statistic: " + driverStatisticID + "]");
                                }
                                else if (driverGeneralLedgerID != null)
                                {
                                    loopErrors.Add("[Budget Version: " + driverBudgetVersionID + " Entity: " + driverEntityID + " Department: " + driverDepartmentID + " General Ledger: " + driverGeneralLedgerID + "]");
                                }
                                else
                                {
                                    loopErrors.Add("[Budget Version: " + driverBudgetVersionID + " Entity: " + driverEntityID + " Department: " + driverDepartmentID + " Job Code: " + driverJobCodeID + " Pay Type: " + driverPayTypeID + "]");
                                }
                            }
                        }
                    }
                }
            }

            if (loopErrors.Count != 0)
            {
                return "The following entries would create an update loop: " + string.Join(", ", loopErrors);
            }

            // if it was determined this may time out start a background job and return
            if (longProcessing)
            {

                Guid Identifier = Guid.NewGuid();
                var jobId = BackgroundJob.Enqueue(() => StartProcessing(targetBudget, parsedSectionDataList, months, forecast.Forecast_budgetversion_scenario_type, Identifier));
                await Operations.opBGJobs.InsertBGJob("ForecastMethod_" + forecast.Forecast_budgetversion_scenario_type + "_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Identifier.ToString(), Identifier, Identifier.ToString(), _context);
                UpdateBudgetVersionCalculationStatus("Forecasting", targetBudget.BudgetVersionID);

                return "Background job started with JobID: " + jobId + ", Identifier:" + Identifier;
            }
            else
            {
                Guid Identifier = Guid.NewGuid();

                await StartProcessing(targetBudget, parsedSectionDataList, months, forecast.Forecast_budgetversion_scenario_type, Identifier);

            }

            return "Processing complete";
        }
        [Route("StaffingGLMapping")]
        public async Task<ActionResult<string>> StaffingGLMapping(int budgetVersionID)
        {
            try
            {
                UpdateBudgetVersionCalculationStatus("Calculating", budgetVersionID);
                await LoadAllData(_context);

                Operations.opItemTypes _opItemTypes = new Operations.opItemTypes();

                // get the target budget
                BudgetVersions targetBudget = AllBV.Where(f => f.BudgetVersionID == budgetVersionID).FirstOrDefault();

                if (targetBudget == null)
                {
                    throw new ArgumentException("Target budget version does not exist.");
                }

                List<ItemTypes> months = AllIT.Where(f => f.ItemTypeKeyword == "MONTHS").ToList();
                List<ParsedSectionData> parsedSectionDataList = new List<ParsedSectionData>();
                List<DataRowWithID> sourceDataRowWithIDs = new List<DataRowWithID>();

                BudgetVersions sourceBudget = AllBV.Where(f => f.BudgetVersionID == budgetVersionID).FirstOrDefault(); ;
                if (sourceBudget == null)
                {
                    throw new ArgumentException(string.Format("Source budget version '{0}' not found.", budgetVersionID));
                }
                // add the budgetversionid and month range to be used later
                DataRowWithID dataRowWithID = new DataRowWithID();
                dataRowWithID.budgetVersionID = sourceBudget.BudgetVersionID;
                dataRowWithID.startMonth = "fiscalStartMonth-01";
                dataRowWithID.endMonth = "fiscalStartMonth-12";
                sourceDataRowWithIDs.Add(dataRowWithID);

                // add the budgetversionid and month range to be used later
                DataRowWithID targetDataRowWithID = new DataRowWithID();
                targetDataRowWithID.budgetVersionID = targetBudget.BudgetVersionID;
                targetDataRowWithID.startMonth = "fiscalStartMonth-01";
                targetDataRowWithID.endMonth = "fiscalStartMonth-12";

                // save the data into the object that is passed to processing
                ParsedSectionData parsedSectionData = new ParsedSectionData();
                parsedSectionData.sourceBudgetInfo = sourceDataRowWithIDs;
                parsedSectionData.targetBudgetInfo = targetDataRowWithID;
                ForecastSection section = new ForecastSection();
                section.forecastType = "staffingGL_mapping";
                parsedSectionData.section = section;

                parsedSectionData.parsedSectionDimensionPairings = await GetStaffingGLMappingData(sourceDataRowWithIDs, targetDataRowWithID, months);

                parsedSectionDataList.Add(parsedSectionData);
                Guid Identifier = Guid.NewGuid();

                var jobId = BackgroundJob.Enqueue(() => StartProcessing(targetBudget, parsedSectionDataList, months, "General Ledger", Identifier));
                UpdateBudgetVersionCalculationStatus("Completed", budgetVersionID);
                return "Background job started with JobID: " + jobId;

            }
            catch (Exception ex)
            {

                UpdateBudgetVersionCalculationStatus("Failed", budgetVersionID);
                return "Processing incomplete. Error occoured";
            }
        }

        private async Task LoadAllData(BudgetingContext context)
        {
            AllBV = await Operations.opBudgetVersions.GetAllBudgetVersions(_context);
            AllIT = await Operations.opItemTypes.getAllItemTypes(_context);
            AllEnt = await Operations.opEntities.GetAllEntities(_context);
            AllDept = await Operations.opDepartments.GetAllDepartments(_context);
            AllGLAccounts = await Operations.opGLAccounts.GetAllGLAccounts(_context);
            AllTimePeriods = await Operations.opTimePeriods.GetAllTimePeriods(_context);
            AllDatascenario = await Operations.opDataScenario.GetAllDataScenarios(_context);
            AllPayTypes = await Operations.opPayTypes.GetAllPayTypes(_context);
            AllJobCodes = await Operations.opJobCodes.GetAllJobCodes(_context);
            AllRelationships = await Operations.opRelationships.GetAllRelationships(_context);
            AllStatsCodes = await Operations.opStatisticsCodes.GetAllStatisticsCodes(_context);
            savezerovalues = SaveZeroValues(context);
        }

        private void UpdateBudgetVersionCalculationStatus(string status, int budgetversionID)
        {
            BudgetVersions bv = _context._BudgetVersions.FirstOrDefault(stat =>
            stat.BudgetVersionID == budgetversionID);

            if (bv != null)
            {
                _context.Entry(bv).State = EntityState.Modified;

                bv.CalculationStatus = status;
                bv.UpdatedDate = DateTime.UtcNow;
                _context.SaveChanges();
            }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [NonAction]
        [AutomaticRetry(Attempts = 1)]

        public async Task<string> StartProcessing(BudgetVersions targetBudget, List<ParsedSectionData> parsedSectionDataList, List<ItemTypes> months, string forecastScenarioType, Guid Identifier)
        {
            int staffingRowsUpdatedCount = 0;
            Console.WriteLine(DateTime.UtcNow.ToString() + "||Processing Started !!! with JobID:" + Identifier);

            await LoadAllData(_context);

            List<int> AllBVIds = new List<int>();
            foreach (var item in parsedSectionDataList)
            {
                var sourceid = item.sourceBudgetInfo;
                foreach (var rowWithID in sourceid)
                {
                    AllBVIds.Add(rowWithID.budgetVersionID);
                }

                var targetids = item.targetBudgetInfo;

                AllBVIds.Add(targetids.budgetVersionID);


            }


            switch (forecastScenarioType)
            {
                case "Statistic":

                    var opbvstat = new opBudgetVersionStatistics();
                    BVSTSource.Add(await opbvstat.getAllBVStatistics(AllBVIds.Distinct().ToList(), _context));
                    break;
                case "General Ledger":
                    var opbvgl = new opBudgetVersionGLAccounts();
                    BVGLSource.Add(await opbvgl.getALlBVGL(AllBVIds.Distinct().ToList(), _context));
                    string forecastmethodtypeGL = "";
                    if (parsedSectionDataList.Count == 1)
                    {
                        forecastmethodtypeGL = parsedSectionDataList[0].section.forecastType.ToUpper();
                    }
                    if (forecastmethodtypeGL == "ratioGL_Statistics".ToUpper())
                    {
                        var opbvstatsf = new opBudgetVersionStatistics();
                        BVSTSource.Add(await opbvstatsf.getAllBVStatistics(AllBVIds.Distinct().ToList(), _context));

                    }
                    break;
                case "Staffing":
                    string forecastmethodtype = "";
                    if (parsedSectionDataList.Count == 1)
                    {
                        forecastmethodtype = parsedSectionDataList[0].section.forecastType.ToUpper();
                    }
                    if (forecastmethodtype == "RATIO_STAFFING_HOURS_STATISTICS".ToUpper())
                    {
                        var opbvstatsf = new opBudgetVersionStatistics();
                        BVSTSource.Add(await opbvstatsf.getAllBVStatistics(AllBVIds.Distinct().ToList(), _context));

                    }
                    var opbvsf = new opBudgetVersionStaffing();
                    BVSFSource.Add(await opbvsf.getALlBVSF(AllBVIds.Distinct().ToList(), _context));
                    break;
                default:
                    break;
            }



            // process the data
            foreach (ParsedSectionData parsedSectionData in parsedSectionDataList)
            {
                List<opForecastResults> forecastResultsList = new List<opForecastResults>();
                dynamic forecastResultsByTarget = null;

                // pay type distribution uses all of the data at once instead of one row at a time
                if (parsedSectionData.section.forecastType == "staffing_pay_type_distribution")
                {
                    forecastResultsList = await StaffingPayTypeDistributionFormula(parsedSectionData.sourceBudgetInfo, parsedSectionData.targetBudgetInfo, months, parsedSectionData.section, parsedSectionData.parsedSectionDimensionPairings, forecastScenarioType);
                    forecastResultsByTarget = forecastResultsList.GroupBy(frl => new { frl.targetDimensionRow.entity, frl.targetDimensionRow.department, frl.targetDimensionRow.jobCode, frl.targetDimensionRow.payType }, (key, group) => new { entity = key.entity, department = key.department, jobCode = key.jobCode, payType = key.payType, results = group.ToList() });
                }
                else
                {
                    foreach (ParsedSectionDimensionPairings parsedSectionDimensionPairings in parsedSectionData.parsedSectionDimensionPairings)
                    {
                        // Process the appropriate formula for the source budget and store the results for a group by check
                        JObject results = await ProcessFormula(parsedSectionData.sourceBudgetInfo, parsedSectionData.targetBudgetInfo, months, parsedSectionData.section, parsedSectionDimensionPairings.sourceDimensionRow, parsedSectionDimensionPairings.targetDimensionRow, parsedSectionDimensionPairings.sourceNumeratorDimensionRow, parsedSectionDimensionPairings.sourceDenominatorDimensionRow, parsedSectionDimensionPairings.targetNumeratorDimensionRow, parsedSectionDimensionPairings.targetDenominatorDimensionRow, forecastScenarioType);
                        opForecastResults forecastResults = new opForecastResults();
                        forecastResults._ForcastResults = new ForecastResults();
                        if (parsedSectionData.section.source == null || parsedSectionData.section.source.dimensionRow.denominator == null)
                        {
                            forecastResults.targetDimensionRow = parsedSectionDimensionPairings.targetDimensionRow;
                        }
                        else
                        {
                            forecastResults.targetDimensionRow = parsedSectionDimensionPairings.targetNumeratorDimensionRow;
                        }
                        forecastResults.result = results;
                        forecastResultsList.Add(forecastResults);

                        // group the results
                        switch (forecastScenarioType)
                        {
                            case "Statistic":
                                // group the results by the target, any records that are the same target should be added together because they are using the group total
                                forecastResultsByTarget = forecastResultsList
                                    .GroupBy(frl =>
                                    new
                                    {
                                        frl.targetDimensionRow.entity
                                    ,
                                        frl.targetDimensionRow.department
                                    ,
                                        frl.targetDimensionRow.statistic
                                    }
                                    , (key, group) => new
                                    {
                                        entity = key.entity
                                    ,
                                        department = key.department
                                    ,
                                        stastitic = key.statistic
                                    ,
                                        results = group.ToList()
                                    });
                                break;
                            case "General Ledger":
                                // group the results by the target, any records that are the same target should be added together because they are using the group total
                                forecastResultsByTarget = forecastResultsList.GroupBy(frl => new { frl.targetDimensionRow.entity, frl.targetDimensionRow.department, frl.targetDimensionRow.generalLedger }, (key, group) => new { entity = key.entity, department = key.department, generalLedger = key.generalLedger, results = group.ToList() });
                                break;
                            case "Staffing":
                                // group the results by the target, any records that are the same target should be added together because they are using the group total
                                forecastResultsByTarget = forecastResultsList.GroupBy(frl => new { frl.targetDimensionRow.entity, frl.targetDimensionRow.department, frl.targetDimensionRow.jobCode, frl.targetDimensionRow.payType }, (key, group) => new { entity = key.entity, department = key.department, jobCode = key.jobCode, payType = key.payType, results = group.ToList() });
                                break;
                            default:
                                throw new ArgumentException(string.Format("Unknown scenario type: {0}"), forecastScenarioType);
                        }
                    }
                }

                if (forecastResultsByTarget == null)
                {
                    return "Empty Target Values";
                }

                // combine grouped values and save the results
                foreach (var forecastResult in forecastResultsByTarget)
                {
                    JObject results = CombineGroupResults(forecastResult.results, months);
                    switch (forecastScenarioType)
                    {
                        case "Statistic":
                            await UpdateStatisticsBudgetVersion(targetBudget, forecastResult.entity, forecastResult.department, forecastResult.stastitic, results, months);
                            break;
                        case "General Ledger":
                            await UpdateGLAccountsBudgetVersion(targetBudget, forecastResult.entity, forecastResult.department, forecastResult.generalLedger, results, months);
                            break;
                        case "Staffing":
                            string returnValue = await UpdateStaffingBudgetVersion(targetBudget, forecastResult.entity, forecastResult.department, forecastResult.jobCode, forecastResult.payType, results, months, parsedSectionData.section.forecastType);
                            if (returnValue == "Save Complete" && results.Count > 0)
                            {
                                staffingRowsUpdatedCount++;
                            }
                            break;
                        default:
                            throw new ArgumentException(string.Format("Unknown scenario type: {0}"), forecastScenarioType);
                    }
                }
                _context.SaveChanges();
            }
            if (staffingRowsUpdatedCount > 0)
            {
                UpdateBudgetVersionCalculationStatus("Need to calculate", targetBudget.BudgetVersionID);
            }
            else
            {
                UpdateBudgetVersionCalculationStatus("Forecast completed", targetBudget.BudgetVersionID);

            }
            Console.WriteLine(DateTime.UtcNow.ToString() + "|| Processing Completed");
            await Operations.opBGJobs.UpdateBGJobs("SUCCESS", Identifier, _context);
            Console.WriteLine("^^^ BG JOB BACKGROUND PRCESSING COMPLETED ^^^");
            return "Processing complete";
        }

        private async Task<List<ParsedSectionDimensionPairings>> GetDimensionData(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, List<ItemTypes> months, ForecastSection section, string scenarioType)
        {
            ParsedSectionDimensions parsedSectionDimensions = new ParsedSectionDimensions();

            // average wage rate uses all possible dimensions so group check is not needed and creating combinations of every dimension available can result in tens of millions of rows
            if (section.forecastType == "staffing_average_wage_rate")
            {
                Operations.opBudgetVersionStaffing opStaffing = new Operations.opBudgetVersionStaffing();
                // using this instead of getContext to try and eliminate some extra calls since QA is slow
                //_context.BudgetVersionStaffing
                //    .Include("Entity")
                //    .Include("Department")
                //    .Include("JobCode")
                //    .Include("PayType")
                //    .ToList();
                // get all staffing hour and dollar data for the source and select the distict values for entity,department,jobCode,payType into the source and target lists
                //  List<BudgetVersionStaffing> budgetVersionStaffings = await opStaffing.getHoursAndDollarsByBudgetID(sourceBudgetInfo[0].budgetVersionID, _context);
                // var bvsf =  BVSFSource.;
                List<BudgetVersionStaffing> budgetVersionStaffings = opStaffing.getHoursAndDollarsByBudgetIDLocal(sourceBudgetInfo[0].budgetVersionID, BVSFSource.SelectMany(f => f).ToList());
                parsedSectionDimensions.sourceEntityList = budgetVersionStaffings.Select(bvs => bvs.Entity).Distinct().ToList();
                parsedSectionDimensions.targetEntityList = budgetVersionStaffings.Select(bvs => bvs.Entity).Distinct().ToList();
                parsedSectionDimensions.sourceDepartmentList = budgetVersionStaffings.Select(bvs => bvs.Department).Distinct().ToList();
                parsedSectionDimensions.targetDepartmentList = budgetVersionStaffings.Select(bvs => bvs.Department).Distinct().ToList();
                parsedSectionDimensions.sourceJobCodeList = budgetVersionStaffings.Select(bvs => bvs.JobCode).Distinct().ToList();
                parsedSectionDimensions.targetJobCodeList = budgetVersionStaffings.Select(bvs => bvs.JobCode).Distinct().ToList();
                parsedSectionDimensions.sourcePayTypeList = budgetVersionStaffings.Select(bvs => bvs.PayType).Distinct().ToList();
                parsedSectionDimensions.targetPayTypeList = budgetVersionStaffings.Select(bvs => bvs.PayType).Distinct().ToList();
            }
            else
            if (section.source.dimensionRow.denominator == null)
            {
                // look up the source and target dimensions needed for each scenario and create a list of each if needed
                parsedSectionDimensions.sourceEntityList = await CheckEntityGroup(section.source.dimensionRow.entity, new List<Entities>());
                parsedSectionDimensions.sourceDepartmentList = await CheckDepartmentGroup(section.source.dimensionRow.department, new List<Departments>());
                parsedSectionDimensions.targetEntityList = await CheckEntityGroup(section.target.dimensionRow.entity, new List<Entities>());
                parsedSectionDimensions.targetDepartmentList = await CheckDepartmentGroup(section.target.dimensionRow.department, new List<Departments>());

                switch (scenarioType)
                {
                    case "Statistic":
                        parsedSectionDimensions.sourceStatisticList = await CheckStatisticsCodeGroup(section.source.dimensionRow.statistic, new List<StatisticsCodes>());
                        parsedSectionDimensions.targetStatisticList = await CheckStatisticsCodeGroup(section.target.dimensionRow.statistic, new List<StatisticsCodes>());
                        break;
                    case "General Ledger":
                        parsedSectionDimensions.sourceGLAccountList = await CheckGLAccountGroup(section.source.dimensionRow.generalLedger, new List<GLAccounts>());
                        parsedSectionDimensions.targetGLAccountList = await CheckGLAccountGroup(section.target.dimensionRow.generalLedger, new List<GLAccounts>());
                        break;
                    case "Staffing":
                        parsedSectionDimensions.sourceJobCodeList = await CheckJobCodeGroup(section.source.dimensionRow.jobCode, new List<JobCodes>());
                        parsedSectionDimensions.targetJobCodeList = await CheckJobCodeGroup(section.target.dimensionRow.jobCode, new List<JobCodes>());
                        parsedSectionDimensions.sourcePayTypeList = await CheckPayTypeGroup(section.source.dimensionRow.payType, new List<PayTypes>());
                        parsedSectionDimensions.targetPayTypeList = await CheckPayTypeGroup(section.target.dimensionRow.payType, new List<PayTypes>());
                        break;
                }

            }
            else
            {
                // look up the source and target dimensions needed for each scenario and create a list of each if needed
                parsedSectionDimensions.sourceNumeratorEntityList = await CheckEntityGroup(section.source.dimensionRow.numerator.entity, new List<Entities>());
                parsedSectionDimensions.sourceNumeratorDepartmentList = await CheckDepartmentGroup(section.source.dimensionRow.numerator.department, new List<Departments>());
                parsedSectionDimensions.sourceDenominatorEntityList = await CheckEntityGroup(section.source.dimensionRow.denominator.entity, new List<Entities>());
                parsedSectionDimensions.sourceDenominatorDepartmentList = await CheckDepartmentGroup(section.source.dimensionRow.denominator.department, new List<Departments>());

                parsedSectionDimensions.targetNumeratorEntityList = await CheckEntityGroup(section.target.dimensionRow.numerator.entity, new List<Entities>());
                parsedSectionDimensions.targetNumeratorDepartmentList = await CheckDepartmentGroup(section.target.dimensionRow.numerator.department, new List<Departments>());
                parsedSectionDimensions.targetDenominatorEntityList = await CheckEntityGroup(section.target.dimensionRow.denominator.entity, new List<Entities>());
                parsedSectionDimensions.targetDenominatorDepartmentList = await CheckDepartmentGroup(section.target.dimensionRow.denominator.department, new List<Departments>());

                switch (scenarioType)
                {
                    case "Statistic":
                        parsedSectionDimensions.sourceNumeratorStatisticList = await CheckStatisticsCodeGroup(section.source.dimensionRow.numerator.statistic, new List<StatisticsCodes>());
                        parsedSectionDimensions.sourceDenominatorStatisticList = await CheckStatisticsCodeGroup(section.source.dimensionRow.denominator.statistic, new List<StatisticsCodes>());
                        parsedSectionDimensions.targetNumeratorStatisticList = await CheckStatisticsCodeGroup(section.target.dimensionRow.numerator.statistic, new List<StatisticsCodes>());
                        parsedSectionDimensions.targetDenominatorStatisticList = await CheckStatisticsCodeGroup(section.target.dimensionRow.denominator.statistic, new List<StatisticsCodes>());
                        break;
                    case "General Ledger":
                        if (section.forecastType == "ratioGL_Statistics")
                        {
                            parsedSectionDimensions.sourceNumeratorGLAccountList = await CheckGLAccountGroup(section.source.dimensionRow.numerator.generalLedger, new List<GLAccounts>());
                            parsedSectionDimensions.sourceDenominatorStatisticList = await CheckStatisticsCodeGroup(section.source.dimensionRow.denominator.statistic, new List<StatisticsCodes>());
                            parsedSectionDimensions.targetNumeratorGLAccountList = await CheckGLAccountGroup(section.target.dimensionRow.numerator.generalLedger, new List<GLAccounts>());
                            parsedSectionDimensions.targetDenominatorStatisticList = await CheckStatisticsCodeGroup(section.target.dimensionRow.denominator.statistic, new List<StatisticsCodes>());
                        }
                        else
                        {
                            parsedSectionDimensions.sourceNumeratorGLAccountList = await CheckGLAccountGroup(section.source.dimensionRow.numerator.generalLedger, new List<GLAccounts>());
                            parsedSectionDimensions.sourceDenominatorGLAccountList = await CheckGLAccountGroup(section.source.dimensionRow.denominator.generalLedger, new List<GLAccounts>());
                            parsedSectionDimensions.targetNumeratorGLAccountList = await CheckGLAccountGroup(section.target.dimensionRow.numerator.generalLedger, new List<GLAccounts>());
                            parsedSectionDimensions.targetDenominatorGLAccountList = await CheckGLAccountGroup(section.target.dimensionRow.denominator.generalLedger, new List<GLAccounts>());
                        }
                        break;
                    case "Staffing":
                        if (section.forecastType == "ratio_staffing_hours_statistics")
                        {
                            parsedSectionDimensions.sourceNumeratorJobCodeList = await CheckJobCodeGroup(section.source.dimensionRow.numerator.jobCode, new List<JobCodes>());
                            parsedSectionDimensions.targetNumeratorJobCodeList = await CheckJobCodeGroup(section.target.dimensionRow.numerator.jobCode, new List<JobCodes>());
                            parsedSectionDimensions.sourceNumeratorPayTypeList = await CheckPayTypeGroup(section.source.dimensionRow.numerator.payType, new List<PayTypes>());
                            parsedSectionDimensions.targetNumeratorPayTypeList = await CheckPayTypeGroup(section.target.dimensionRow.numerator.payType, new List<PayTypes>());
                            parsedSectionDimensions.sourceDenominatorStatisticList = await CheckStatisticsCodeGroup(section.source.dimensionRow.denominator.statistic, new List<StatisticsCodes>());
                            parsedSectionDimensions.targetDenominatorStatisticList = await CheckStatisticsCodeGroup(section.target.dimensionRow.denominator.statistic, new List<StatisticsCodes>());
                        }
                        else
                        {
                            parsedSectionDimensions.sourceNumeratorJobCodeList = await CheckJobCodeGroup(section.source.dimensionRow.numerator.jobCode, new List<JobCodes>());
                            parsedSectionDimensions.targetNumeratorJobCodeList = await CheckJobCodeGroup(section.target.dimensionRow.numerator.jobCode, new List<JobCodes>());
                            parsedSectionDimensions.sourceNumeratorPayTypeList = await CheckPayTypeGroup(section.source.dimensionRow.numerator.payType, new List<PayTypes>());
                            parsedSectionDimensions.targetNumeratorPayTypeList = await CheckPayTypeGroup(section.target.dimensionRow.numerator.payType, new List<PayTypes>());
                            parsedSectionDimensions.sourceDenominatorJobCodeList = await CheckJobCodeGroup(section.source.dimensionRow.denominator.jobCode, new List<JobCodes>());
                            parsedSectionDimensions.targetDenominatorJobCodeList = await CheckJobCodeGroup(section.target.dimensionRow.denominator.jobCode, new List<JobCodes>());
                            parsedSectionDimensions.sourceDenominatorPayTypeList = await CheckPayTypeGroup(section.source.dimensionRow.denominator.payType, new List<PayTypes>());
                            parsedSectionDimensions.targetDenominatorPayTypeList = await CheckPayTypeGroup(section.target.dimensionRow.denominator.payType, new List<PayTypes>());
                        }
                        break;
                }
            }

            List<ParsedSectionDimensionPairings> parsedSectionDimensionPairings = new List<ParsedSectionDimensionPairings>();

            switch (scenarioType)
            {
                case "Statistic":
                    parsedSectionDimensionPairings = StatisticsParse(sourceBudgetInfo, targetBudgetInfo, parsedSectionDimensions, months, section, scenarioType);
                    break;
                case "General Ledger":
                    if (section.forecastType == "ratioGL_Statistics")
                    {
                        parsedSectionDimensionPairings = GLAccountsStatisticsParse(sourceBudgetInfo, targetBudgetInfo, parsedSectionDimensions, months, section, scenarioType);
                    }
                    else
                    {
                        parsedSectionDimensionPairings = GLAccountsParse(sourceBudgetInfo, targetBudgetInfo, parsedSectionDimensions, months, section, scenarioType);
                    }
                    break;
                case "Staffing":
                    if (section.forecastType == "ratio_staffing_hours_statistics")
                    {
                        parsedSectionDimensionPairings = StaffingStatisticsParse(sourceBudgetInfo, targetBudgetInfo, parsedSectionDimensions, months, section, scenarioType);
                    }
                    else
                    {
                        parsedSectionDimensionPairings = StaffingParse(sourceBudgetInfo, targetBudgetInfo, parsedSectionDimensions, months, section, scenarioType);
                    }
                    break;
                default:
                    throw new ArgumentException(string.Format("Unknown scenario type: {0}"), scenarioType);
            }

            return parsedSectionDimensionPairings;

        }

        private async Task<List<ParsedSectionDimensionPairings>> GetStaffingGLMappingData(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, List<ItemTypes> months)
        {
            List<ParsedSectionDimensionPairings> parsedSectionDimensionPairingsList = new List<ParsedSectionDimensionPairings>();

            _context.StaffingGLMappings
                .Include("Entity")
                .Include("Department")
                .Include("GLAccount")
                .Include("JobCode")
                .Include("PayType").ToList();

            List<StaffingGLMappings> staffingGLMappingsList = await _context.StaffingGLMappings.Where(e => e.IsActive == true && e.IsDeleted == false).ToListAsync();

            foreach (StaffingGLMappings staffingGLMappings in staffingGLMappingsList)
            {
                List<Entities> entityList = await CheckEntityGroup(staffingGLMappings.Entity.EntityID.ToString(), new List<Entities>());
                List<Departments> departmentList = await CheckDepartmentGroup(staffingGLMappings.Department.DepartmentID.ToString(), new List<Departments>());
                List<GLAccounts> glAccountList = await CheckGLAccountGroup(staffingGLMappings.GLAccount.GLAccountID.ToString(), new List<GLAccounts>());
                List<JobCodes> jobCodeList = await CheckJobCodeGroup(staffingGLMappings.JobCode.JobCodeID.ToString(), new List<JobCodes>());
                List<PayTypes> payTypeList = await CheckPayTypeGroup(staffingGLMappings.PayType.PayTypeID.ToString(), new List<PayTypes>());

                // loop through all the combinations of entity, department, jobCode, payType, and glAccount and send them to be processed
                for (int entity = 0; entity < entityList.Count; entity++)
                {
                    for (int department = 0; department < departmentList.Count; department++)
                    {
                        for (int jobCode = 0; jobCode < jobCodeList.Count; jobCode++)
                        {
                            for (int payType = 0; payType < payTypeList.Count; payType++)
                            {
                                for (int glAccount = 0; glAccount < glAccountList.Count; glAccount++)
                                {
                                    DimensionRow sourceDimensionRow = new DimensionRow();
                                    sourceDimensionRow.entity = entityList[entity].EntityID.ToString();
                                    sourceDimensionRow.department = departmentList[department].DepartmentID.ToString();
                                    sourceDimensionRow.jobCode = jobCodeList[jobCode].JobCodeID.ToString();
                                    sourceDimensionRow.payType = payTypeList[payType].PayTypeID.ToString();

                                    DimensionRow targetDimensionRow = new DimensionRow();
                                    targetDimensionRow.entity = entityList[entity].EntityID.ToString();
                                    targetDimensionRow.department = departmentList[department].DepartmentID.ToString();
                                    targetDimensionRow.generalLedger = glAccountList[glAccount].GLAccountID.ToString();

                                    // if the source dimensions already exist remove them, later records take priority when there are multiple
                                    ParsedSectionDimensionPairings existingSourceRecord = parsedSectionDimensionPairingsList.Where(pl => pl.sourceDimensionRow.entity == sourceDimensionRow.entity && pl.sourceDimensionRow.department == sourceDimensionRow.department && pl.sourceDimensionRow.jobCode == sourceDimensionRow.jobCode && pl.sourceDimensionRow.payType == sourceDimensionRow.payType).FirstOrDefault();
                                    if (existingSourceRecord != null)
                                    {
                                        parsedSectionDimensionPairingsList.Remove(existingSourceRecord);
                                    }

                                    ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                                    parsedSectionDimensionPairings.sourceDimensionRow = sourceDimensionRow;
                                    parsedSectionDimensionPairings.targetDimensionRow = targetDimensionRow;
                                    parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                                }
                            }
                        }
                    }
                }
            }

            return parsedSectionDimensionPairingsList;
        }

        private List<ParsedSectionDimensionPairings> StatisticsParse(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, ParsedSectionDimensions parsedSectionDimensions, List<ItemTypes> months, ForecastSection section, string scenarioType)
        {
            List<ParsedSectionDimensionPairings> parsedSectionDimensionPairingsList = new List<ParsedSectionDimensionPairings>();

            if (section.source.dimensionRow.denominator == null)
            {
                // loop through all the combinations of entity, department, and statisticCode and send them to be processed
                for (int entity = 0; entity < parsedSectionDimensions.sourceEntityList.Count; entity++)
                {
                    // default the targetEntityCounter to entity, if the sizes do not match use a mod calculation that will help group these before insert
                    int targetEntityCounter = entity;
                    if (parsedSectionDimensions.sourceEntityList.Count != parsedSectionDimensions.targetEntityList.Count)
                    {
                        targetEntityCounter = entity % parsedSectionDimensions.targetEntityList.Count;
                    }
                    // set all of the current loop XentityID values
                    string sourceEntityID = Convert.ToString(parsedSectionDimensions.sourceEntityList[entity].EntityID);
                    string targetEntityID = Convert.ToString(parsedSectionDimensions.targetEntityList[targetEntityCounter].EntityID);

                    for (int department = 0; department < parsedSectionDimensions.sourceDepartmentList.Count; department++)
                    {
                        // default the targetDepartmentCounter to department, if the sizes do not match use a mod calculation that will help group these before insert
                        int targetDepartmentCounter = department;
                        if (parsedSectionDimensions.sourceDepartmentList.Count != parsedSectionDimensions.targetDepartmentList.Count)
                        {
                            targetDepartmentCounter = department % parsedSectionDimensions.targetDepartmentList.Count;
                        }
                        // set all of the current loop XdeparmentID values
                        string sourceDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDepartmentList[department].DepartmentID);
                        string targetDepartmentID = Convert.ToString(parsedSectionDimensions.targetDepartmentList[targetDepartmentCounter].DepartmentID);

                        // each loop the statisticsList values needs to reset in case all, primary, secondary, or tertiary is being used
                        List<StatisticsCodes> loopingSourceStatisticsList = CheckMappedStatistics(parsedSectionDimensions.sourceStatisticList, section, "source", sourceEntityID, sourceDepartmentID);
                        List<StatisticsCodes> loopingTargetStatisticsList = CheckMappedStatistics(parsedSectionDimensions.targetStatisticList, section, "target", targetEntityID, targetDepartmentID);
                        for (int statisticCode = 0; statisticCode < loopingSourceStatisticsList.Count; statisticCode++)
                        {
                            DimensionRow sourceDimensionRow = new DimensionRow();
                            sourceDimensionRow.entity = sourceEntityID;
                            sourceDimensionRow.department = sourceDepartmentID;
                            sourceDimensionRow.statistic = Convert.ToString(loopingSourceStatisticsList[statisticCode].StatisticsCodeID);

                            // default the targetStatisticCodeCounter to department, if the sizes do not match use a mod calculation that will help group these before insert
                            int targetStatisticCodeCounter = statisticCode;
                            if (loopingSourceStatisticsList.Count != loopingTargetStatisticsList.Count)
                            {
                                targetStatisticCodeCounter = statisticCode % loopingTargetStatisticsList.Count;
                            }

                            DimensionRow targetDimensionRow = new DimensionRow();
                            targetDimensionRow.entity = targetEntityID;
                            targetDimensionRow.department = targetDepartmentID;
                            targetDimensionRow.statistic = Convert.ToString(loopingTargetStatisticsList[targetStatisticCodeCounter].StatisticsCodeID);

                            ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                            parsedSectionDimensionPairings.sourceDimensionRow = sourceDimensionRow;
                            parsedSectionDimensionPairings.targetDimensionRow = targetDimensionRow;
                            parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                        }
                    }
                }
            }
            else
            {
                // loop through all the combinations of entity, department, and statisticCode and send them to be processed
                for (int entity = 0; entity < parsedSectionDimensions.sourceDenominatorEntityList.Count; entity++)
                {
                    // default all of the entity counters to entity, if the sizes do not match use a mod calculation that will help group these before insert
                    int sourceNumeratorEntityCounter = entity;
                    int targetNumeratorEntityCounter = entity;
                    int targetDenominatorEntityCounter = entity;
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.sourceNumeratorEntityList.Count)
                    {
                        sourceNumeratorEntityCounter = entity % parsedSectionDimensions.sourceNumeratorEntityList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetNumeratorEntityList.Count)
                    {
                        targetNumeratorEntityCounter = entity % parsedSectionDimensions.targetNumeratorEntityList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetDenominatorEntityList.Count)
                    {
                        targetDenominatorEntityCounter = entity % parsedSectionDimensions.targetDenominatorEntityList.Count;
                    }
                    // set all of the current loop XentityID values
                    string sourceDenominatorEntityID = Convert.ToString(parsedSectionDimensions.sourceDenominatorEntityList[entity].EntityID);
                    string sourceNumeratorEntityID = Convert.ToString(parsedSectionDimensions.sourceNumeratorEntityList[sourceNumeratorEntityCounter].EntityID);
                    string targetNumeratorEntityID = Convert.ToString(parsedSectionDimensions.targetNumeratorEntityList[targetNumeratorEntityCounter].EntityID);
                    string targetDenominatorEntityID = Convert.ToString(parsedSectionDimensions.targetDenominatorEntityList[targetDenominatorEntityCounter].EntityID);

                    for (int department = 0; department < parsedSectionDimensions.sourceDenominatorDepartmentList.Count; department++)
                    {
                        // default all of the department counters to department, if the sizes do not match use a mod calculation that will help group these before insert
                        int sourceNumeratorDepartmentCounter = department;
                        int targetNumeratorDepartmentCounter = department;
                        int targetDenominatorDepartmentCounter = department;
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.sourceNumeratorDepartmentList.Count)
                        {
                            sourceNumeratorDepartmentCounter = department % parsedSectionDimensions.sourceNumeratorDepartmentList.Count;
                        }
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetNumeratorDepartmentList.Count)
                        {
                            targetNumeratorDepartmentCounter = department % parsedSectionDimensions.targetNumeratorDepartmentList.Count;
                        }
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetDenominatorDepartmentList.Count)
                        {
                            targetDenominatorDepartmentCounter = department % parsedSectionDimensions.targetDenominatorDepartmentList.Count;
                        }
                        // set all of the current loop XdepartmentID values
                        string sourceDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDenominatorDepartmentList[department].DepartmentID);
                        string sourceNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceNumeratorDepartmentList[sourceNumeratorDepartmentCounter].DepartmentID);
                        string targetNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.targetNumeratorDepartmentList[targetNumeratorDepartmentCounter].DepartmentID);
                        string targetDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.targetDenominatorDepartmentList[targetDenominatorDepartmentCounter].DepartmentID);

                        // each loop the statisticsList values needs to reset in case all, primary, secondary, or tertiary is being used
                        List<StatisticsCodes> loopingSourceNumeratorStatisticsList = CheckMappedStatistics(parsedSectionDimensions.sourceNumeratorStatisticList, section, "sourceNumerator", sourceNumeratorEntityID, sourceNumeratorDepartmentID);
                        List<StatisticsCodes> loopingSourceDenominatorStatisticsList = CheckMappedStatistics(parsedSectionDimensions.sourceDenominatorStatisticList, section, "sourceDenominator", sourceDenominatorEntityID, sourceDenominatorDepartmentID);
                        List<StatisticsCodes> loopingTargetNumeratorStatisticsList = CheckMappedStatistics(parsedSectionDimensions.targetNumeratorStatisticList, section, "targetNumerator", targetNumeratorEntityID, targetNumeratorDepartmentID);
                        List<StatisticsCodes> loopingTargetDenominatorStatisticsList = CheckMappedStatistics(parsedSectionDimensions.targetDenominatorStatisticList, section, "targetDenominator", targetDenominatorEntityID, targetDenominatorDepartmentID);
                        for (int statisticCode = 0; statisticCode < loopingSourceDenominatorStatisticsList.Count; statisticCode++)
                        {
                            // default all of the statisticCode counters to statisticCode, if the sizes do not match use a mod calculation that will help group these before insert
                            int sourceNumeratorStatisticCodeCounter = statisticCode;
                            int targetNumeratorStatisticCodeCounter = statisticCode;
                            int targetDenominatorStatisticCodeCounter = statisticCode;
                            if (loopingSourceDenominatorStatisticsList.Count != loopingSourceNumeratorStatisticsList.Count)
                            {
                                sourceNumeratorStatisticCodeCounter = statisticCode % loopingSourceNumeratorStatisticsList.Count;
                            }
                            if (loopingSourceDenominatorStatisticsList.Count != loopingTargetNumeratorStatisticsList.Count)
                            {
                                targetNumeratorStatisticCodeCounter = statisticCode % loopingTargetNumeratorStatisticsList.Count;
                            }
                            if (loopingSourceDenominatorStatisticsList.Count != loopingTargetDenominatorStatisticsList.Count)
                            {
                                targetDenominatorStatisticCodeCounter = statisticCode % loopingTargetDenominatorStatisticsList.Count;
                            }

                            DimensionRow sourceDenominatorDimensionRow = new DimensionRow();
                            sourceDenominatorDimensionRow.entity = sourceDenominatorEntityID;
                            sourceDenominatorDimensionRow.department = sourceDenominatorDepartmentID;
                            sourceDenominatorDimensionRow.statistic = Convert.ToString(loopingSourceDenominatorStatisticsList[statisticCode].StatisticsCodeID);

                            DimensionRow sourceNumeratorDimensionRow = new DimensionRow();
                            sourceNumeratorDimensionRow.entity = sourceNumeratorEntityID;
                            sourceNumeratorDimensionRow.department = sourceNumeratorDepartmentID;
                            sourceNumeratorDimensionRow.statistic = Convert.ToString(loopingSourceNumeratorStatisticsList[sourceNumeratorStatisticCodeCounter].StatisticsCodeID);

                            DimensionRow targetNumeratorDimensionRow = new DimensionRow();
                            targetNumeratorDimensionRow.entity = targetNumeratorEntityID;
                            targetNumeratorDimensionRow.department = targetNumeratorDepartmentID;
                            targetNumeratorDimensionRow.statistic = Convert.ToString(loopingTargetNumeratorStatisticsList[targetNumeratorStatisticCodeCounter].StatisticsCodeID);

                            DimensionRow targetDenominatorDimensionRow = new DimensionRow();
                            targetDenominatorDimensionRow.entity = targetDenominatorEntityID;
                            targetDenominatorDimensionRow.department = targetDenominatorDepartmentID;
                            targetDenominatorDimensionRow.statistic = Convert.ToString(loopingTargetDenominatorStatisticsList[targetDenominatorStatisticCodeCounter].StatisticsCodeID);

                            ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                            parsedSectionDimensionPairings.sourceNumeratorDimensionRow = sourceNumeratorDimensionRow;
                            parsedSectionDimensionPairings.targetNumeratorDimensionRow = targetNumeratorDimensionRow;
                            parsedSectionDimensionPairings.sourceDenominatorDimensionRow = sourceDenominatorDimensionRow;
                            parsedSectionDimensionPairings.targetDenominatorDimensionRow = targetDenominatorDimensionRow;
                            parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                        }
                    }
                }
            }

            return parsedSectionDimensionPairingsList;
        }

        private List<ParsedSectionDimensionPairings> GLAccountsParse(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, ParsedSectionDimensions parsedSectionDimensions, List<ItemTypes> months, ForecastSection section, string scenarioType)
        {
            List<ParsedSectionDimensionPairings> parsedSectionDimensionPairingsList = new List<ParsedSectionDimensionPairings>();

            if (section.source.dimensionRow.denominator == null)
            {
                // loop through all the combinations of entity, department, and generalLedger and send them to be processed
                for (int entity = 0; entity < parsedSectionDimensions.sourceEntityList.Count; entity++)
                {
                    // default the targetEntityCounter to entity, if the sizes do not match use a mod calculation that will help group these before insert
                    int targetEntityCounter = entity;
                    if (parsedSectionDimensions.sourceEntityList.Count != parsedSectionDimensions.targetEntityList.Count)
                    {
                        targetEntityCounter = entity % parsedSectionDimensions.targetEntityList.Count;
                    }
                    // set all of the current loop XentityID values
                    string sourceEntityID = Convert.ToString(parsedSectionDimensions.sourceEntityList[entity].EntityID);
                    string targetEntityID = Convert.ToString(parsedSectionDimensions.targetEntityList[targetEntityCounter].EntityID);

                    for (int department = 0; department < parsedSectionDimensions.sourceDepartmentList.Count; department++)
                    {
                        // default the targetEntityCounter to entity, if the sizes do not match use a mod calculation that will help group these before insert
                        int targetDepartmentCounter = department;
                        if (parsedSectionDimensions.sourceDepartmentList.Count != parsedSectionDimensions.targetDepartmentList.Count)
                        {
                            targetDepartmentCounter = department % parsedSectionDimensions.targetDepartmentList.Count;
                        }
                        // set all of the current loop XdepartmentID values
                        string sourceDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDepartmentList[department].DepartmentID);
                        string targetDepartmentID = Convert.ToString(parsedSectionDimensions.targetDepartmentList[targetDepartmentCounter].DepartmentID);

                        for (int generalLedger = 0; generalLedger < parsedSectionDimensions.sourceGLAccountList.Count; generalLedger++)
                        {
                            // default the targetEntityCounter to entity, if the sizes do not match use a mod calculation that will help group these before insert
                            int targetGLAccountCounter = generalLedger;
                            if (parsedSectionDimensions.sourceGLAccountList.Count != parsedSectionDimensions.targetGLAccountList.Count)
                            {
                                targetGLAccountCounter = generalLedger % parsedSectionDimensions.targetGLAccountList.Count;
                            }

                            DimensionRow sourceDimensionRow = new DimensionRow();
                            sourceDimensionRow.entity = sourceEntityID;
                            sourceDimensionRow.department = sourceDepartmentID;
                            sourceDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.sourceGLAccountList[generalLedger].GLAccountID);

                            DimensionRow targetDimensionRow = new DimensionRow();
                            targetDimensionRow.entity = targetEntityID;
                            targetDimensionRow.department = targetDepartmentID;
                            targetDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.targetGLAccountList[targetGLAccountCounter].GLAccountID);

                            ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                            parsedSectionDimensionPairings.sourceDimensionRow = sourceDimensionRow;
                            parsedSectionDimensionPairings.targetDimensionRow = targetDimensionRow;
                            parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                        }
                    }
                }
            }
            else
            {
                // loop through all the combinations of entity, department, and glAccount and send them to be processed
                for (int entity = 0; entity < parsedSectionDimensions.sourceDenominatorEntityList.Count; entity++)
                {
                    // default all of the entity counters to entity, if the sizes do not match use a mod calculation that will help group these before insert
                    int sourceNumeratorEntityCounter = entity;
                    int targetNumeratorEntityCounter = entity;
                    int targetDenominatorEntityCounter = entity;
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.sourceNumeratorEntityList.Count)
                    {
                        sourceNumeratorEntityCounter = entity % parsedSectionDimensions.sourceNumeratorEntityList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetNumeratorEntityList.Count)
                    {
                        targetNumeratorEntityCounter = entity % parsedSectionDimensions.targetNumeratorEntityList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetDenominatorEntityList.Count)
                    {
                        targetDenominatorEntityCounter = entity % parsedSectionDimensions.targetDenominatorEntityList.Count;
                    }
                    // set all of the current loop XentityID values
                    string sourceDenominatorEntityID = Convert.ToString(parsedSectionDimensions.sourceDenominatorEntityList[entity].EntityID);
                    string sourceNumeratorEntityID = Convert.ToString(parsedSectionDimensions.sourceNumeratorEntityList[sourceNumeratorEntityCounter].EntityID);
                    string targetNumeratorEntityID = Convert.ToString(parsedSectionDimensions.targetNumeratorEntityList[targetNumeratorEntityCounter].EntityID);
                    string targetDenominatorEntityID = Convert.ToString(parsedSectionDimensions.targetDenominatorEntityList[targetDenominatorEntityCounter].EntityID);

                    for (int department = 0; department < parsedSectionDimensions.sourceDenominatorDepartmentList.Count; department++)
                    {
                        // default all of the department counters to department, if the sizes do not match use a mod calculation that will help group these before insert
                        int sourceNumeratorDepartmentCounter = department;
                        int targetNumeratorDepartmentCounter = department;
                        int targetDenominatorDepartmentCounter = department;
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.sourceNumeratorDepartmentList.Count)
                        {
                            sourceNumeratorDepartmentCounter = department % parsedSectionDimensions.sourceNumeratorDepartmentList.Count;
                        }
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetNumeratorDepartmentList.Count)
                        {
                            targetNumeratorDepartmentCounter = department % parsedSectionDimensions.targetNumeratorDepartmentList.Count;
                        }
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetDenominatorDepartmentList.Count)
                        {
                            targetDenominatorDepartmentCounter = department % parsedSectionDimensions.targetDenominatorDepartmentList.Count;
                        }
                        // set all of the current loop XdepartmentID values
                        string sourceDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDenominatorDepartmentList[department].DepartmentID);
                        string sourceNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceNumeratorDepartmentList[sourceNumeratorDepartmentCounter].DepartmentID);
                        string targetNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.targetNumeratorDepartmentList[targetNumeratorDepartmentCounter].DepartmentID);
                        string targetDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.targetDenominatorDepartmentList[targetDenominatorDepartmentCounter].DepartmentID);

                        for (int generalLedger = 0; generalLedger < parsedSectionDimensions.sourceDenominatorGLAccountList.Count; generalLedger++)
                        {
                            // default all of the generalLedger counters to generalLedger, if the sizes do not match use a mod calculation that will help group these before insert
                            int sourceNumeratorGLAccountCounter = generalLedger;
                            int targetNumeratorGLAccountCounter = generalLedger;
                            int targetDenominatorGLAccountCounter = generalLedger;
                            if (parsedSectionDimensions.sourceDenominatorGLAccountList.Count != parsedSectionDimensions.sourceNumeratorGLAccountList.Count)
                            {
                                sourceNumeratorGLAccountCounter = generalLedger % parsedSectionDimensions.sourceNumeratorGLAccountList.Count;
                            }
                            if (parsedSectionDimensions.sourceDenominatorGLAccountList.Count != parsedSectionDimensions.targetNumeratorGLAccountList.Count)
                            {
                                targetNumeratorGLAccountCounter = generalLedger % parsedSectionDimensions.targetNumeratorGLAccountList.Count;
                            }
                            if (parsedSectionDimensions.sourceDenominatorGLAccountList.Count != parsedSectionDimensions.targetDenominatorGLAccountList.Count)
                            {
                                targetDenominatorGLAccountCounter = generalLedger % parsedSectionDimensions.targetDenominatorGLAccountList.Count;
                            }

                            DimensionRow sourceDenominatorDimensionRow = new DimensionRow();
                            sourceDenominatorDimensionRow.entity = sourceDenominatorEntityID;
                            sourceDenominatorDimensionRow.department = sourceDenominatorDepartmentID;
                            sourceDenominatorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.sourceDenominatorGLAccountList[generalLedger].GLAccountID);

                            DimensionRow sourceNumeratorDimensionRow = new DimensionRow();
                            sourceNumeratorDimensionRow.entity = sourceNumeratorEntityID;
                            sourceNumeratorDimensionRow.department = sourceNumeratorDepartmentID;
                            sourceNumeratorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.sourceNumeratorGLAccountList[sourceNumeratorGLAccountCounter].GLAccountID);

                            DimensionRow targetNumeratorDimensionRow = new DimensionRow();
                            targetNumeratorDimensionRow.entity = targetNumeratorEntityID;
                            targetNumeratorDimensionRow.department = targetNumeratorDepartmentID;
                            targetNumeratorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.targetNumeratorGLAccountList[targetNumeratorGLAccountCounter].GLAccountID);

                            DimensionRow targetDenominatorDimensionRow = new DimensionRow();
                            targetDenominatorDimensionRow.entity = targetDenominatorEntityID;
                            targetDenominatorDimensionRow.department = targetDenominatorDepartmentID;
                            targetDenominatorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.targetDenominatorGLAccountList[targetDenominatorGLAccountCounter].GLAccountID);

                            ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                            parsedSectionDimensionPairings.sourceNumeratorDimensionRow = sourceNumeratorDimensionRow;
                            parsedSectionDimensionPairings.targetNumeratorDimensionRow = targetNumeratorDimensionRow;
                            parsedSectionDimensionPairings.sourceDenominatorDimensionRow = sourceDenominatorDimensionRow;
                            parsedSectionDimensionPairings.targetDenominatorDimensionRow = targetDenominatorDimensionRow;
                            parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                        }
                    }
                }
            }

            return parsedSectionDimensionPairingsList;
        }

        private List<ParsedSectionDimensionPairings> GLAccountsParseRevised(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, ParsedSectionDimensions parsedSectionDimensions, List<ItemTypes> months, ForecastSection section, string scenarioType)
        {
            List<ParsedSectionDimensionPairings> parsedSectionDimensionPairingsList = new List<ParsedSectionDimensionPairings>();

            if (section.source.dimensionRow.denominator == null)
            {
                int sourceentitycount = parsedSectionDimensions.sourceEntityList.Count;
                int targetentitycount = parsedSectionDimensions.targetEntityList.Count;
                int loopcount = sourceentitycount >= targetentitycount ? sourceentitycount : targetentitycount;

                // loop through all the combinations of entity, department, and generalLedger and send them to be processed
                for (int entity = 0; entity < loopcount; entity++)
                {
                    // default the targetEntityCounter to entity, if the sizes do not match use a mod calculation that will help group these before insert
                    int targetEntityCounter = entity;
                    if (parsedSectionDimensions.sourceEntityList.Count < parsedSectionDimensions.targetEntityList.Count)
                    {
                        targetEntityCounter = entity % parsedSectionDimensions.targetEntityList.Count;
                    }
                    // set all of the current loop XentityID values
                    string sourceEntityID = Convert.ToString(parsedSectionDimensions.sourceEntityList[entity].EntityID);
                    string targetEntityID = Convert.ToString(parsedSectionDimensions.targetEntityList[targetEntityCounter].EntityID);

                    for (int department = 0; department < parsedSectionDimensions.sourceDepartmentList.Count; department++)
                    {
                        // default the targetEntityCounter to entity, if the sizes do not match use a mod calculation that will help group these before insert
                        int targetDepartmentCounter = department;
                        if (parsedSectionDimensions.sourceDepartmentList.Count != parsedSectionDimensions.targetDepartmentList.Count)
                        {
                            targetDepartmentCounter = department % parsedSectionDimensions.targetDepartmentList.Count;
                        }
                        // set all of the current loop XdepartmentID values
                        string sourceDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDepartmentList[department].DepartmentID);
                        string targetDepartmentID = Convert.ToString(parsedSectionDimensions.targetDepartmentList[targetDepartmentCounter].DepartmentID);

                        for (int generalLedger = 0; generalLedger < parsedSectionDimensions.sourceGLAccountList.Count; generalLedger++)
                        {
                            // default the targetEntityCounter to entity, if the sizes do not match use a mod calculation that will help group these before insert
                            int targetGLAccountCounter = generalLedger;
                            if (parsedSectionDimensions.sourceGLAccountList.Count != parsedSectionDimensions.targetGLAccountList.Count)
                            {
                                targetGLAccountCounter = generalLedger % parsedSectionDimensions.targetGLAccountList.Count;
                            }

                            DimensionRow sourceDimensionRow = new DimensionRow();
                            sourceDimensionRow.entity = sourceEntityID;
                            sourceDimensionRow.department = sourceDepartmentID;
                            sourceDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.sourceGLAccountList[generalLedger].GLAccountID);

                            DimensionRow targetDimensionRow = new DimensionRow();
                            targetDimensionRow.entity = targetEntityID;
                            targetDimensionRow.department = targetDepartmentID;
                            targetDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.targetGLAccountList[targetGLAccountCounter].GLAccountID);

                            ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                            parsedSectionDimensionPairings.sourceDimensionRow = sourceDimensionRow;
                            parsedSectionDimensionPairings.targetDimensionRow = targetDimensionRow;
                            parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                        }
                    }
                }
            }
            else
            {
                // loop through all the combinations of entity, department, and glAccount and send them to be processed
                for (int entity = 0; entity < parsedSectionDimensions.sourceDenominatorEntityList.Count; entity++)
                {
                    // default all of the entity counters to entity, if the sizes do not match use a mod calculation that will help group these before insert
                    int sourceNumeratorEntityCounter = entity;
                    int targetNumeratorEntityCounter = entity;
                    int targetDenominatorEntityCounter = entity;
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.sourceNumeratorEntityList.Count)
                    {
                        sourceNumeratorEntityCounter = entity % parsedSectionDimensions.sourceNumeratorEntityList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetNumeratorEntityList.Count)
                    {
                        targetNumeratorEntityCounter = entity % parsedSectionDimensions.targetNumeratorEntityList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetDenominatorEntityList.Count)
                    {
                        targetDenominatorEntityCounter = entity % parsedSectionDimensions.targetDenominatorEntityList.Count;
                    }
                    // set all of the current loop XentityID values
                    string sourceDenominatorEntityID = Convert.ToString(parsedSectionDimensions.sourceDenominatorEntityList[entity].EntityID);
                    string sourceNumeratorEntityID = Convert.ToString(parsedSectionDimensions.sourceNumeratorEntityList[sourceNumeratorEntityCounter].EntityID);
                    string targetNumeratorEntityID = Convert.ToString(parsedSectionDimensions.targetNumeratorEntityList[targetNumeratorEntityCounter].EntityID);
                    string targetDenominatorEntityID = Convert.ToString(parsedSectionDimensions.targetDenominatorEntityList[targetDenominatorEntityCounter].EntityID);

                    for (int department = 0; department < parsedSectionDimensions.sourceDenominatorDepartmentList.Count; department++)
                    {
                        // default all of the department counters to department, if the sizes do not match use a mod calculation that will help group these before insert
                        int sourceNumeratorDepartmentCounter = department;
                        int targetNumeratorDepartmentCounter = department;
                        int targetDenominatorDepartmentCounter = department;
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.sourceNumeratorDepartmentList.Count)
                        {
                            sourceNumeratorDepartmentCounter = department % parsedSectionDimensions.sourceNumeratorDepartmentList.Count;
                        }
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetNumeratorDepartmentList.Count)
                        {
                            targetNumeratorDepartmentCounter = department % parsedSectionDimensions.targetNumeratorDepartmentList.Count;
                        }
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetDenominatorDepartmentList.Count)
                        {
                            targetDenominatorDepartmentCounter = department % parsedSectionDimensions.targetDenominatorDepartmentList.Count;
                        }
                        // set all of the current loop XdepartmentID values
                        string sourceDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDenominatorDepartmentList[department].DepartmentID);
                        string sourceNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceNumeratorDepartmentList[sourceNumeratorDepartmentCounter].DepartmentID);
                        string targetNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.targetNumeratorDepartmentList[targetNumeratorDepartmentCounter].DepartmentID);
                        string targetDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.targetDenominatorDepartmentList[targetDenominatorDepartmentCounter].DepartmentID);

                        for (int generalLedger = 0; generalLedger < parsedSectionDimensions.sourceDenominatorGLAccountList.Count; generalLedger++)
                        {
                            // default all of the generalLedger counters to generalLedger, if the sizes do not match use a mod calculation that will help group these before insert
                            int sourceNumeratorGLAccountCounter = generalLedger;
                            int targetNumeratorGLAccountCounter = generalLedger;
                            int targetDenominatorGLAccountCounter = generalLedger;
                            if (parsedSectionDimensions.sourceDenominatorGLAccountList.Count != parsedSectionDimensions.sourceNumeratorGLAccountList.Count)
                            {
                                sourceNumeratorGLAccountCounter = generalLedger % parsedSectionDimensions.sourceNumeratorGLAccountList.Count;
                            }
                            if (parsedSectionDimensions.sourceDenominatorGLAccountList.Count != parsedSectionDimensions.targetNumeratorGLAccountList.Count)
                            {
                                targetNumeratorGLAccountCounter = generalLedger % parsedSectionDimensions.targetNumeratorGLAccountList.Count;
                            }
                            if (parsedSectionDimensions.sourceDenominatorGLAccountList.Count != parsedSectionDimensions.targetDenominatorGLAccountList.Count)
                            {
                                targetDenominatorGLAccountCounter = generalLedger % parsedSectionDimensions.targetDenominatorGLAccountList.Count;
                            }

                            DimensionRow sourceDenominatorDimensionRow = new DimensionRow();
                            sourceDenominatorDimensionRow.entity = sourceDenominatorEntityID;
                            sourceDenominatorDimensionRow.department = sourceDenominatorDepartmentID;
                            sourceDenominatorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.sourceDenominatorGLAccountList[generalLedger].GLAccountID);

                            DimensionRow sourceNumeratorDimensionRow = new DimensionRow();
                            sourceNumeratorDimensionRow.entity = sourceNumeratorEntityID;
                            sourceNumeratorDimensionRow.department = sourceNumeratorDepartmentID;
                            sourceNumeratorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.sourceNumeratorGLAccountList[sourceNumeratorGLAccountCounter].GLAccountID);

                            DimensionRow targetNumeratorDimensionRow = new DimensionRow();
                            targetNumeratorDimensionRow.entity = targetNumeratorEntityID;
                            targetNumeratorDimensionRow.department = targetNumeratorDepartmentID;
                            targetNumeratorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.targetNumeratorGLAccountList[targetNumeratorGLAccountCounter].GLAccountID);

                            DimensionRow targetDenominatorDimensionRow = new DimensionRow();
                            targetDenominatorDimensionRow.entity = targetDenominatorEntityID;
                            targetDenominatorDimensionRow.department = targetDenominatorDepartmentID;
                            targetDenominatorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.targetDenominatorGLAccountList[targetDenominatorGLAccountCounter].GLAccountID);

                            ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                            parsedSectionDimensionPairings.sourceNumeratorDimensionRow = sourceNumeratorDimensionRow;
                            parsedSectionDimensionPairings.targetNumeratorDimensionRow = targetNumeratorDimensionRow;
                            parsedSectionDimensionPairings.sourceDenominatorDimensionRow = sourceDenominatorDimensionRow;
                            parsedSectionDimensionPairings.targetDenominatorDimensionRow = targetDenominatorDimensionRow;
                            parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                        }
                    }
                }
            }

            return parsedSectionDimensionPairingsList;
        }

        private List<ParsedSectionDimensionPairings> GLAccountsStatisticsParse(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, ParsedSectionDimensions parsedSectionDimensions, List<ItemTypes> months, ForecastSection section, string scenarioType)
        {
            List<ParsedSectionDimensionPairings> parsedSectionDimensionPairingsList = new List<ParsedSectionDimensionPairings>();

            // loop through all the combinations of entity, department, and generalLedger/statistic and send them to be processed
            for (int entity = 0; entity < parsedSectionDimensions.sourceDenominatorEntityList.Count; entity++)
            {
                // default all of the entity counters to entity, if the sizes do not match use a mod calculation that will help group these before insert
                int sourceNumeratorEntityCounter = entity;
                int targetNumeratorEntityCounter = entity;
                int targetDenominatorEntityCounter = entity;
                if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.sourceNumeratorEntityList.Count)
                {
                    sourceNumeratorEntityCounter = entity % parsedSectionDimensions.sourceNumeratorEntityList.Count;
                }
                if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetNumeratorEntityList.Count)
                {
                    targetNumeratorEntityCounter = entity % parsedSectionDimensions.targetNumeratorEntityList.Count;
                }
                if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetDenominatorEntityList.Count)
                {
                    targetDenominatorEntityCounter = entity % parsedSectionDimensions.targetDenominatorEntityList.Count;
                }
                // set all of the current loop XentityID values
                string sourceDenominatorEntityID = Convert.ToString(parsedSectionDimensions.sourceDenominatorEntityList[entity].EntityID);
                string sourceNumeratorEntityID = Convert.ToString(parsedSectionDimensions.sourceNumeratorEntityList[sourceNumeratorEntityCounter].EntityID);
                string targetNumeratorEntityID = Convert.ToString(parsedSectionDimensions.targetNumeratorEntityList[targetNumeratorEntityCounter].EntityID);
                string targetDenominatorEntityID = Convert.ToString(parsedSectionDimensions.targetDenominatorEntityList[targetDenominatorEntityCounter].EntityID);

                for (int department = 0; department < parsedSectionDimensions.sourceDenominatorDepartmentList.Count; department++)
                {
                    // default all of the department counters to department, if the sizes do not match use a mod calculation that will help group these before insert
                    int sourceNumeratorDepartmentCounter = department;
                    int targetNumeratorDepartmentCounter = department;
                    int targetDenominatorDepartmentCounter = department;
                    if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.sourceNumeratorDepartmentList.Count)
                    {
                        sourceNumeratorDepartmentCounter = department % parsedSectionDimensions.sourceNumeratorDepartmentList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetNumeratorDepartmentList.Count)
                    {
                        targetNumeratorDepartmentCounter = department % parsedSectionDimensions.targetNumeratorDepartmentList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetDenominatorDepartmentList.Count)
                    {
                        targetDenominatorDepartmentCounter = department % parsedSectionDimensions.targetDenominatorDepartmentList.Count;
                    }
                    // set all of the current loop XdepartmentID values
                    string sourceDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDenominatorDepartmentList[department].DepartmentID);
                    string sourceNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceNumeratorDepartmentList[sourceNumeratorDepartmentCounter].DepartmentID);
                    string targetNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.targetNumeratorDepartmentList[targetNumeratorDepartmentCounter].DepartmentID);
                    string targetDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.targetDenominatorDepartmentList[targetDenominatorDepartmentCounter].DepartmentID);

                    // each loop the statisticsList values needs to reset in case all, primary, secondary, or tertiary is being used
                    List<StatisticsCodes> loopingSourceDenominatorStatisticsList = CheckMappedStatistics(parsedSectionDimensions.sourceDenominatorStatisticList, section, "sourceDenominator", sourceDenominatorEntityID, sourceDenominatorDepartmentID);
                    List<StatisticsCodes> loopingTargetDenominatorStatisticsList = CheckMappedStatistics(parsedSectionDimensions.targetDenominatorStatisticList, section, "targetDenominator", targetDenominatorEntityID, targetDenominatorDepartmentID);

                    for (int generalLedgerStatistic = 0; generalLedgerStatistic < loopingSourceDenominatorStatisticsList.Count; generalLedgerStatistic++)
                    {
                        // default all of the glAccount/statistic counters to generalLedgerStatistic, if the sizes do not match use a mod calculation that will help group these before insert
                        int sourceNumeratorGLAccountCounter = generalLedgerStatistic;
                        int targetNumeratorGLAccountCounter = generalLedgerStatistic;
                        int targetDenominatorStatisticCounter = generalLedgerStatistic;
                        if (loopingSourceDenominatorStatisticsList.Count != parsedSectionDimensions.sourceNumeratorGLAccountList.Count)
                        {
                            sourceNumeratorGLAccountCounter = generalLedgerStatistic % parsedSectionDimensions.sourceNumeratorGLAccountList.Count;
                        }
                        if (loopingSourceDenominatorStatisticsList.Count != parsedSectionDimensions.targetNumeratorGLAccountList.Count)
                        {
                            targetNumeratorGLAccountCounter = generalLedgerStatistic % parsedSectionDimensions.targetNumeratorGLAccountList.Count;
                        }
                        if (loopingSourceDenominatorStatisticsList.Count != loopingTargetDenominatorStatisticsList.Count)
                        {
                            targetDenominatorStatisticCounter = generalLedgerStatistic % loopingTargetDenominatorStatisticsList.Count;
                        }

                        DimensionRow sourceDenominatorDimensionRow = new DimensionRow();
                        sourceDenominatorDimensionRow.entity = sourceDenominatorEntityID;
                        sourceDenominatorDimensionRow.department = sourceDenominatorDepartmentID;
                        sourceDenominatorDimensionRow.statistic = Convert.ToString(loopingSourceDenominatorStatisticsList[generalLedgerStatistic].StatisticsCodeID);

                        DimensionRow sourceNumeratorDimensionRow = new DimensionRow();
                        sourceNumeratorDimensionRow.entity = sourceNumeratorEntityID;
                        sourceNumeratorDimensionRow.department = sourceNumeratorDepartmentID;
                        sourceNumeratorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.sourceNumeratorGLAccountList[sourceNumeratorGLAccountCounter].GLAccountID);

                        DimensionRow targetNumeratorDimensionRow = new DimensionRow();
                        targetNumeratorDimensionRow.entity = targetNumeratorEntityID;
                        targetNumeratorDimensionRow.department = targetNumeratorDepartmentID;
                        targetNumeratorDimensionRow.generalLedger = Convert.ToString(parsedSectionDimensions.targetNumeratorGLAccountList[targetNumeratorGLAccountCounter].GLAccountID);

                        DimensionRow targetDenominatorDimensionRow = new DimensionRow();
                        targetDenominatorDimensionRow.entity = targetDenominatorEntityID;
                        targetDenominatorDimensionRow.department = targetDenominatorDepartmentID;
                        targetDenominatorDimensionRow.statistic = Convert.ToString(loopingTargetDenominatorStatisticsList[targetDenominatorStatisticCounter].StatisticsCodeID);

                        ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                        parsedSectionDimensionPairings.sourceNumeratorDimensionRow = sourceNumeratorDimensionRow;
                        parsedSectionDimensionPairings.targetNumeratorDimensionRow = targetNumeratorDimensionRow;
                        parsedSectionDimensionPairings.sourceDenominatorDimensionRow = sourceDenominatorDimensionRow;
                        parsedSectionDimensionPairings.targetDenominatorDimensionRow = targetDenominatorDimensionRow;
                        parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                    }
                }
            }

            return parsedSectionDimensionPairingsList;
        }

        private List<ParsedSectionDimensionPairings> StaffingParse(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, ParsedSectionDimensions parsedSectionDimensions, List<ItemTypes> months, ForecastSection section, string scenarioType)
        {
            List<ParsedSectionDimensionPairings> parsedSectionDimensionPairingsList = new List<ParsedSectionDimensionPairings>();

            if (section.source.dimensionRow.denominator == null)
            {
                // loop through all the combinations of entity, department, jobCode, and payType and send them to be processed
                for (int entity = 0; entity < parsedSectionDimensions.sourceEntityList.Count; entity++)
                {
                    // default the targetEntityCounter to entity, if the sizes do not match use a mod calculation that will help group these before insert
                    int targetEntityCounter = entity;
                    if (parsedSectionDimensions.sourceEntityList.Count != parsedSectionDimensions.targetEntityList.Count)
                    {
                        targetEntityCounter = entity % parsedSectionDimensions.targetEntityList.Count;
                    }
                    // set all of the current loop XentityID values
                    string sourceEntityID = Convert.ToString(parsedSectionDimensions.sourceEntityList[entity].EntityID);
                    string targetEntityID = Convert.ToString(parsedSectionDimensions.targetEntityList[targetEntityCounter].EntityID);

                    for (int department = 0; department < parsedSectionDimensions.sourceDepartmentList.Count; department++)
                    {
                        // default the targetDepartmentCounter to department, if the sizes do not match use a mod calculation that will help group these before insert
                        int targetDepartmentCounter = department;
                        if (parsedSectionDimensions.sourceDepartmentList.Count != parsedSectionDimensions.targetDepartmentList.Count)
                        {
                            targetDepartmentCounter = department % parsedSectionDimensions.targetDepartmentList.Count;
                        }
                        // set all of the current loop XdepartmentID values
                        string sourceDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDepartmentList[department].DepartmentID);
                        string targetDepartmentID = Convert.ToString(parsedSectionDimensions.targetDepartmentList[targetDepartmentCounter].DepartmentID);

                        for (int jobCode = 0; jobCode < parsedSectionDimensions.sourceJobCodeList.Count; jobCode++)
                        {
                            // default the targetJobCodeCounter to jobCode, if the sizes do not match use a mod calculation that will help group these before insert
                            int targetJobCodeCounter = jobCode;
                            if (parsedSectionDimensions.sourceJobCodeList.Count != parsedSectionDimensions.targetJobCodeList.Count)
                            {
                                targetJobCodeCounter = jobCode % parsedSectionDimensions.targetJobCodeList.Count;
                            }
                            // set all of the current loop XjobCodeID values
                            string sourceJobCodeID = Convert.ToString(parsedSectionDimensions.sourceJobCodeList[jobCode].JobCodeID);
                            string targetJobCodeID = Convert.ToString(parsedSectionDimensions.targetJobCodeList[targetJobCodeCounter].JobCodeID);

                            for (int payType = 0; payType < parsedSectionDimensions.sourcePayTypeList.Count; payType++)
                            {
                                // check if the payType is excluded, if it is continue to the next item
                                if (section.source.dimensionRow.excludedPayTypes != null && section.source.dimensionRow.excludedPayTypes.Contains(Convert.ToString(parsedSectionDimensions.sourcePayTypeList[payType].PayTypeID)))
                                {
                                    continue;
                                }

                                // default the targetPayTypeCounter to payType, if the sizes do not match use a mod calculation that will help group these before insert
                                int targetPayTypeCounter = payType;
                                if (parsedSectionDimensions.sourcePayTypeList.Count != parsedSectionDimensions.targetPayTypeList.Count)
                                {
                                    targetPayTypeCounter = payType % parsedSectionDimensions.targetPayTypeList.Count;
                                }

                                DimensionRow sourceDimensionRow = new DimensionRow();
                                sourceDimensionRow.entity = sourceEntityID;
                                sourceDimensionRow.department = sourceDepartmentID;
                                sourceDimensionRow.jobCode = sourceJobCodeID;
                                sourceDimensionRow.payType = Convert.ToString(parsedSectionDimensions.sourcePayTypeList[payType].PayTypeID);

                                DimensionRow targetDimensionRow = new DimensionRow();
                                targetDimensionRow.entity = targetEntityID;
                                targetDimensionRow.department = targetDepartmentID;
                                targetDimensionRow.jobCode = targetJobCodeID;
                                targetDimensionRow.payType = Convert.ToString(parsedSectionDimensions.targetPayTypeList[targetPayTypeCounter].PayTypeID);

                                ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                                parsedSectionDimensionPairings.sourceDimensionRow = sourceDimensionRow;
                                parsedSectionDimensionPairings.targetDimensionRow = targetDimensionRow;
                                parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                            }
                        }
                    }
                }
            }
            else
            {
                // loop through all the combinations of entity, department, jobCode and payType and send them to be processed
                for (int entity = 0; entity < parsedSectionDimensions.sourceDenominatorEntityList.Count; entity++)
                {
                    // default all of the entity counters to entity, if the sizes do not match use a mod calculation that will help group these before insert
                    int sourceNumeratorEntityCounter = entity;
                    int targetNumeratorEntityCounter = entity;
                    int targetDenominatorEntityCounter = entity;
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.sourceNumeratorEntityList.Count)
                    {
                        sourceNumeratorEntityCounter = entity % parsedSectionDimensions.sourceNumeratorEntityList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetNumeratorEntityList.Count)
                    {
                        targetNumeratorEntityCounter = entity % parsedSectionDimensions.targetNumeratorEntityList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetDenominatorEntityList.Count)
                    {
                        targetDenominatorEntityCounter = entity % parsedSectionDimensions.targetDenominatorEntityList.Count;
                    }
                    // set all of the current loop XentityID values
                    string sourceDenominatorEntityID = Convert.ToString(parsedSectionDimensions.sourceDenominatorEntityList[entity].EntityID);
                    string sourceNumeratorEntityID = Convert.ToString(parsedSectionDimensions.sourceNumeratorEntityList[sourceNumeratorEntityCounter].EntityID);
                    string targetNumeratorEntityID = Convert.ToString(parsedSectionDimensions.targetNumeratorEntityList[targetNumeratorEntityCounter].EntityID);
                    string targetDenominatorEntityID = Convert.ToString(parsedSectionDimensions.targetDenominatorEntityList[targetDenominatorEntityCounter].EntityID);

                    for (int department = 0; department < parsedSectionDimensions.sourceDenominatorDepartmentList.Count; department++)
                    {
                        // default all of the department counters to department, if the sizes do not match use a mod calculation that will help group these before insert
                        int sourceNumeratorDepartmentCounter = department;
                        int targetNumeratorDepartmentCounter = department;
                        int targetDenominatorDepartmentCounter = department;
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.sourceNumeratorDepartmentList.Count)
                        {
                            sourceNumeratorDepartmentCounter = department % parsedSectionDimensions.sourceNumeratorDepartmentList.Count;
                        }
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetNumeratorDepartmentList.Count)
                        {
                            targetNumeratorDepartmentCounter = department % parsedSectionDimensions.targetNumeratorDepartmentList.Count;
                        }
                        if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetDenominatorDepartmentList.Count)
                        {
                            targetDenominatorDepartmentCounter = department % parsedSectionDimensions.targetDenominatorDepartmentList.Count;
                        }
                        // set all of the current loop XdepartmentID values
                        string sourceDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDenominatorDepartmentList[department].DepartmentID);
                        string sourceNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceNumeratorDepartmentList[sourceNumeratorDepartmentCounter].DepartmentID);
                        string targetNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.targetNumeratorDepartmentList[targetNumeratorDepartmentCounter].DepartmentID);
                        string targetDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.targetDenominatorDepartmentList[targetDenominatorDepartmentCounter].DepartmentID);

                        for (int jobCode = 0; jobCode < parsedSectionDimensions.sourceJobCodeList.Count; jobCode++)
                        {
                            // default all of the jobCode counters to jobCode, if the sizes do not match use a mod calculation that will help group these before insert
                            int sourceNumeratorJobCodeCounter = jobCode;
                            int targetNumeratorJobCodeCounter = jobCode;
                            int targetDenominatorJobCodeCounter = jobCode;
                            if (parsedSectionDimensions.sourceDenominatorJobCodeList.Count != parsedSectionDimensions.sourceNumeratorJobCodeList.Count)
                            {
                                sourceNumeratorJobCodeCounter = jobCode % parsedSectionDimensions.sourceNumeratorJobCodeList.Count;
                            }
                            if (parsedSectionDimensions.sourceDenominatorJobCodeList.Count != parsedSectionDimensions.targetNumeratorJobCodeList.Count)
                            {
                                targetNumeratorJobCodeCounter = jobCode % parsedSectionDimensions.targetNumeratorJobCodeList.Count;
                            }
                            if (parsedSectionDimensions.sourceDenominatorJobCodeList.Count != parsedSectionDimensions.targetDenominatorJobCodeList.Count)
                            {
                                targetDenominatorJobCodeCounter = jobCode % parsedSectionDimensions.targetDenominatorJobCodeList.Count;
                            }
                            // set all of the current loop XjobCodeID values
                            string sourceDenominatorJobCodeID = Convert.ToString(parsedSectionDimensions.sourceDenominatorJobCodeList[jobCode].JobCodeID);
                            string sourceNumeratorJobCodeID = Convert.ToString(parsedSectionDimensions.sourceNumeratorJobCodeList[sourceNumeratorJobCodeCounter].JobCodeID);
                            string targetNumeratorJobCodeID = Convert.ToString(parsedSectionDimensions.targetNumeratorJobCodeList[targetNumeratorJobCodeCounter].JobCodeID);
                            string targetDenominatorJobCodeID = Convert.ToString(parsedSectionDimensions.targetDenominatorJobCodeList[targetDenominatorJobCodeCounter].JobCodeID);

                            for (int payType = 0; payType < parsedSectionDimensions.sourcePayTypeList.Count; payType++)
                            {
                                // default all of the payType counters to payType, if the sizes do not match use a mod calculation that will help group these before insert
                                int sourceNumeratorPayTypeCounter = payType;
                                int targetNumeratorPayTypeCounter = payType;
                                int targetDenominatorPayTypeCounter = payType;
                                if (parsedSectionDimensions.sourceDenominatorPayTypeList.Count != parsedSectionDimensions.sourceNumeratorPayTypeList.Count)
                                {
                                    sourceNumeratorPayTypeCounter = payType % parsedSectionDimensions.sourceNumeratorPayTypeList.Count;
                                }
                                if (parsedSectionDimensions.sourceDenominatorPayTypeList.Count != parsedSectionDimensions.targetNumeratorPayTypeList.Count)
                                {
                                    targetNumeratorPayTypeCounter = payType % parsedSectionDimensions.targetNumeratorPayTypeList.Count;
                                }
                                if (parsedSectionDimensions.sourceDenominatorPayTypeList.Count != parsedSectionDimensions.targetDenominatorPayTypeList.Count)
                                {
                                    targetDenominatorPayTypeCounter = payType % parsedSectionDimensions.targetDenominatorPayTypeList.Count;
                                }

                                DimensionRow sourceDenominatorDimensionRow = new DimensionRow();
                                sourceDenominatorDimensionRow.entity = sourceDenominatorEntityID;
                                sourceDenominatorDimensionRow.department = sourceDenominatorDepartmentID;
                                sourceDenominatorDimensionRow.jobCode = sourceDenominatorJobCodeID;
                                sourceDenominatorDimensionRow.payType = Convert.ToString(parsedSectionDimensions.sourceDenominatorPayTypeList[payType].PayTypeID);

                                DimensionRow sourceNumeratorDimensionRow = new DimensionRow();
                                sourceNumeratorDimensionRow.entity = sourceNumeratorEntityID;
                                sourceNumeratorDimensionRow.department = sourceNumeratorDepartmentID;
                                sourceNumeratorDimensionRow.jobCode = sourceNumeratorJobCodeID;
                                sourceNumeratorDimensionRow.payType = Convert.ToString(parsedSectionDimensions.sourceNumeratorPayTypeList[sourceNumeratorPayTypeCounter].PayTypeID);

                                DimensionRow targetNumeratorDimensionRow = new DimensionRow();
                                targetNumeratorDimensionRow.entity = targetNumeratorEntityID;
                                targetNumeratorDimensionRow.department = targetNumeratorDepartmentID;
                                targetNumeratorDimensionRow.jobCode = targetNumeratorJobCodeID;
                                targetNumeratorDimensionRow.payType = Convert.ToString(parsedSectionDimensions.targetNumeratorPayTypeList[targetNumeratorPayTypeCounter].PayTypeID);

                                DimensionRow targetDenominatorDimensionRow = new DimensionRow();
                                targetDenominatorDimensionRow.entity = targetDenominatorEntityID;
                                targetDenominatorDimensionRow.department = targetDenominatorDepartmentID;
                                targetDenominatorDimensionRow.jobCode = targetDenominatorJobCodeID;
                                targetDenominatorDimensionRow.payType = Convert.ToString(parsedSectionDimensions.targetDenominatorPayTypeList[targetDenominatorPayTypeCounter].PayTypeID);

                                ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                                parsedSectionDimensionPairings.sourceNumeratorDimensionRow = sourceNumeratorDimensionRow;
                                parsedSectionDimensionPairings.targetNumeratorDimensionRow = targetNumeratorDimensionRow;
                                parsedSectionDimensionPairings.sourceDenominatorDimensionRow = sourceDenominatorDimensionRow;
                                parsedSectionDimensionPairings.targetDenominatorDimensionRow = targetDenominatorDimensionRow;
                                parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                            }
                        }
                    }
                }
            }

            return parsedSectionDimensionPairingsList;
        }

        private List<ParsedSectionDimensionPairings> StaffingStatisticsParse(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, ParsedSectionDimensions parsedSectionDimensions, List<ItemTypes> months, ForecastSection section, string scenarioType)
        {
            List<ParsedSectionDimensionPairings> parsedSectionDimensionPairingsList = new List<ParsedSectionDimensionPairings>();

            // loop through all the combinations of entity, department, and jobCode/payType/statistic and send them to be processed
            for (int entity = 0; entity < parsedSectionDimensions.sourceDenominatorEntityList.Count; entity++)
            {
                // default all of the entity counters to entity, if the sizes do not match use a mod calculation that will help group these before insert
                int sourceNumeratorEntityCounter = entity;
                int targetNumeratorEntityCounter = entity;
                int targetDenominatorEntityCounter = entity;
                if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.sourceNumeratorEntityList.Count)
                {
                    sourceNumeratorEntityCounter = entity % parsedSectionDimensions.sourceNumeratorEntityList.Count;
                }
                if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetNumeratorEntityList.Count)
                {
                    targetNumeratorEntityCounter = entity % parsedSectionDimensions.targetNumeratorEntityList.Count;
                }
                if (parsedSectionDimensions.sourceDenominatorEntityList.Count != parsedSectionDimensions.targetDenominatorEntityList.Count)
                {
                    targetDenominatorEntityCounter = entity % parsedSectionDimensions.targetDenominatorEntityList.Count;
                }
                // set all of the current loop XentityID values
                string sourceDenominatorEntityID = Convert.ToString(parsedSectionDimensions.sourceDenominatorEntityList[entity].EntityID);
                string sourceNumeratorEntityID = Convert.ToString(parsedSectionDimensions.sourceNumeratorEntityList[sourceNumeratorEntityCounter].EntityID);
                string targetNumeratorEntityID = Convert.ToString(parsedSectionDimensions.targetNumeratorEntityList[targetNumeratorEntityCounter].EntityID);
                string targetDenominatorEntityID = Convert.ToString(parsedSectionDimensions.targetDenominatorEntityList[targetDenominatorEntityCounter].EntityID);

                for (int department = 0; department < parsedSectionDimensions.sourceDenominatorDepartmentList.Count; department++)
                {
                    // default all of the department counters to department, if the sizes do not match use a mod calculation that will help group these before insert
                    int sourceNumeratorDepartmentCounter = department;
                    int targetNumeratorDepartmentCounter = department;
                    int targetDenominatorDepartmentCounter = department;
                    if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.sourceNumeratorDepartmentList.Count)
                    {
                        sourceNumeratorDepartmentCounter = department % parsedSectionDimensions.sourceNumeratorDepartmentList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetNumeratorDepartmentList.Count)
                    {
                        targetNumeratorDepartmentCounter = department % parsedSectionDimensions.targetNumeratorDepartmentList.Count;
                    }
                    if (parsedSectionDimensions.sourceDenominatorDepartmentList.Count != parsedSectionDimensions.targetDenominatorDepartmentList.Count)
                    {
                        targetDenominatorDepartmentCounter = department % parsedSectionDimensions.targetDenominatorDepartmentList.Count;
                    }
                    // set all of the current loop XdepartmentID values
                    string sourceDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceDenominatorDepartmentList[department].DepartmentID);
                    string sourceNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.sourceNumeratorDepartmentList[sourceNumeratorDepartmentCounter].DepartmentID);
                    string targetNumeratorDepartmentID = Convert.ToString(parsedSectionDimensions.targetNumeratorDepartmentList[targetNumeratorDepartmentCounter].DepartmentID);
                    string targetDenominatorDepartmentID = Convert.ToString(parsedSectionDimensions.targetDenominatorDepartmentList[targetDenominatorDepartmentCounter].DepartmentID);

                    // each loop the statisticsList values needs to reset in case all, primary, secondary, or tertiary is being used
                    List<StatisticsCodes> loopingSourceDenominatorStatisticsList = CheckMappedStatistics(parsedSectionDimensions.sourceDenominatorStatisticList, section, "sourceDenominator", sourceDenominatorEntityID, sourceDenominatorDepartmentID);
                    List<StatisticsCodes> loopingTargetDenominatorStatisticsList = CheckMappedStatistics(parsedSectionDimensions.targetDenominatorStatisticList, section, "targetDenominator", targetDenominatorEntityID, targetDenominatorDepartmentID);

                    for (int staffingStatistic = 0; staffingStatistic < loopingSourceDenominatorStatisticsList.Count; staffingStatistic++)
                    {
                        // default all of the jobCode/payType/statistic counters to staffingStatistic, if the sizes do not match use a mod calculation that will help group these before insert
                        int sourceNumeratorJobCodeCounter = staffingStatistic;
                        int sourceNumeratorPayTypeCounter = staffingStatistic;
                        int targetNumeratorJobCodeCounter = staffingStatistic;
                        int targetNumeratorPayTypeCounter = staffingStatistic;
                        int targetDenominatorStatisticCounter = staffingStatistic;
                        if (loopingSourceDenominatorStatisticsList.Count != parsedSectionDimensions.sourceNumeratorJobCodeList.Count)
                        {
                            sourceNumeratorJobCodeCounter = staffingStatistic % parsedSectionDimensions.sourceNumeratorJobCodeList.Count;
                        }
                        if (loopingSourceDenominatorStatisticsList.Count != parsedSectionDimensions.sourceNumeratorPayTypeList.Count)
                        {
                            sourceNumeratorPayTypeCounter = staffingStatistic % parsedSectionDimensions.sourceNumeratorPayTypeList.Count;
                        }
                        if (loopingSourceDenominatorStatisticsList.Count != parsedSectionDimensions.targetNumeratorJobCodeList.Count)
                        {
                            targetNumeratorJobCodeCounter = staffingStatistic % parsedSectionDimensions.targetNumeratorJobCodeList.Count;
                        }
                        if (loopingSourceDenominatorStatisticsList.Count != parsedSectionDimensions.targetNumeratorPayTypeList.Count)
                        {
                            targetNumeratorPayTypeCounter = staffingStatistic % parsedSectionDimensions.targetNumeratorPayTypeList.Count;
                        }
                        if (loopingSourceDenominatorStatisticsList.Count != loopingTargetDenominatorStatisticsList.Count)
                        {
                            targetDenominatorStatisticCounter = staffingStatistic % loopingTargetDenominatorStatisticsList.Count;
                        }

                        DimensionRow sourceDenominatorDimensionRow = new DimensionRow();
                        sourceDenominatorDimensionRow.entity = sourceDenominatorEntityID;
                        sourceDenominatorDimensionRow.department = sourceDenominatorDepartmentID;
                        sourceDenominatorDimensionRow.statistic = Convert.ToString(loopingSourceDenominatorStatisticsList[staffingStatistic].StatisticsCodeID);

                        DimensionRow sourceNumeratorDimensionRow = new DimensionRow();
                        sourceNumeratorDimensionRow.entity = sourceNumeratorEntityID;
                        sourceNumeratorDimensionRow.department = sourceNumeratorDepartmentID;
                        sourceNumeratorDimensionRow.jobCode = Convert.ToString(parsedSectionDimensions.sourceNumeratorJobCodeList[sourceNumeratorJobCodeCounter].JobCodeID);
                        sourceNumeratorDimensionRow.payType = Convert.ToString(parsedSectionDimensions.sourceNumeratorPayTypeList[sourceNumeratorPayTypeCounter].PayTypeID);

                        DimensionRow targetNumeratorDimensionRow = new DimensionRow();
                        targetNumeratorDimensionRow.entity = targetNumeratorEntityID;
                        targetNumeratorDimensionRow.department = targetNumeratorDepartmentID;
                        targetNumeratorDimensionRow.jobCode = Convert.ToString(parsedSectionDimensions.targetNumeratorJobCodeList[targetNumeratorJobCodeCounter].JobCodeID);
                        targetNumeratorDimensionRow.payType = Convert.ToString(parsedSectionDimensions.targetNumeratorPayTypeList[targetNumeratorPayTypeCounter].PayTypeID);

                        DimensionRow targetDenominatorDimensionRow = new DimensionRow();
                        targetDenominatorDimensionRow.entity = targetDenominatorEntityID;
                        targetDenominatorDimensionRow.department = targetDenominatorDepartmentID;
                        targetDenominatorDimensionRow.statistic = Convert.ToString(loopingTargetDenominatorStatisticsList[targetDenominatorStatisticCounter].StatisticsCodeID);

                        ParsedSectionDimensionPairings parsedSectionDimensionPairings = new ParsedSectionDimensionPairings();
                        parsedSectionDimensionPairings.sourceNumeratorDimensionRow = sourceNumeratorDimensionRow;
                        parsedSectionDimensionPairings.targetNumeratorDimensionRow = targetNumeratorDimensionRow;
                        parsedSectionDimensionPairings.sourceDenominatorDimensionRow = sourceDenominatorDimensionRow;
                        parsedSectionDimensionPairings.targetDenominatorDimensionRow = targetDenominatorDimensionRow;
                        parsedSectionDimensionPairingsList.Add(parsedSectionDimensionPairings);
                    }
                }
            }

            return parsedSectionDimensionPairingsList;
        }

        private async Task<JObject> ProcessFormula(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, List<ItemTypes> months, ForecastSection section, DimensionRow sourceDimensionRow, DimensionRow targetDimensionRow, DimensionRow sourceNumeratorDimensionRow, DimensionRow sourceDenominatorDimensionRow, DimensionRow targetNumeratorDimensionRow, DimensionRow targetDenominatorDimensionRow, string scenarioType)
        {
            JObject results;
            switch (section.forecastType)
            {
                case "copy":
                case "copy_staffing_dollars":
                case "copy_staffing_hours":
                    results = await CopyFormula(sourceBudgetInfo, targetBudgetInfo, months, section, sourceDimensionRow, targetDimensionRow, scenarioType);
                    break;
                case "annualization":
                case "annualize_staffing_dollars":
                case "annualize_staffing_hours":
                    results = await AnnualizeFormula(sourceBudgetInfo, targetBudgetInfo, months, section, sourceDimensionRow, targetDimensionRow, scenarioType);
                    break;
                case "ratio":
                case "ratioGL_Statistics":
                case "ratio_staffing_hours_statistics":
                    results = await RatioFormula(sourceBudgetInfo, targetBudgetInfo, months, section, sourceNumeratorDimensionRow, sourceDenominatorDimensionRow, targetNumeratorDimensionRow, targetDenominatorDimensionRow, scenarioType);
                    break;
                case "staffing_average_wage_rate":
                    results = await AverageWageFormula(sourceBudgetInfo, targetBudgetInfo, months, section, sourceDimensionRow, targetDimensionRow, scenarioType);
                    break;
                case "staffingGL_mapping":
                    results = await StaffingGLMappingFormula(sourceBudgetInfo, targetBudgetInfo, months, section, sourceDimensionRow, targetDimensionRow);
                    break;
                default:
                    throw new ArgumentException(string.Format("Unknown forecast type: {0}"), section.forecastType);
            }

            return results;
        }

        private async Task<string> UpdateStatisticsBudgetVersion(BudgetVersions targetBudget, string targetEntity, string targetDepartment, string targetStatisticCode, JObject results, List<ItemTypes> months)
        {

            // find a statistic for this dimension if it exists
            BudgetVersionStatistics statistic = _context.BudgetVersionStatistics.FirstOrDefault(stat =>
            //BudgetVersionStatistics statistic = BVSTSource.FirstOrDefault(stat =>
            stat.BudgetVersion.BudgetVersionID == targetBudget.BudgetVersionID &&
            stat.Entity.EntityID == int.Parse(targetEntity) &&
            stat.Department.DepartmentID == int.Parse(targetDepartment) &&
            stat.StatisticsCodes.StatisticsCodeID == int.Parse(targetStatisticCode));

            if (results.Count > 0) // If their is no source in DB , no target BV statistci saved.
            {
                //bool savezerovalues = SaveZeroValues(_context);
                // if not found, create a new statistic
                //if (statistic == null && savezerovalues)
                if (statistic == null)
                {
                    statistic = new BudgetVersionStatistics();
                    statistic.BudgetVersion = AllBV.FirstOrDefault(budgetVersion => budgetVersion.BudgetVersionID == targetBudget.BudgetVersionID);
                    if (targetBudget.ADSstatisticsID != null)
                    {
                        statistic.DataScenarioDataID = AllDatascenario.FirstOrDefault(f => f.DataScenarioID == targetBudget.ADSstatisticsID.DataScenarioID);

                    }
                    statistic.Entity = AllEnt.FirstOrDefault(entity => entity.EntityID == int.Parse(targetEntity));
                    statistic.Department = AllDept.FirstOrDefault(department => department.DepartmentID == int.Parse(targetDepartment));
                    statistic.StatisticsCodes = AllStatsCodes.FirstOrDefault(statisticsCode => statisticsCode.StatisticsCodeID == int.Parse(targetStatisticCode));
                    statistic.DataScenarioTypeID = AllIT.FirstOrDefault(dataScenario => dataScenario.ItemTypeID == targetBudget.scenarioTypeID.ItemTypeID);
                    statistic.TimePeriodID = AllTimePeriods.FirstOrDefault(timePeriod => timePeriod.TimePeriodID == targetBudget.TimePeriodID.TimePeriodID);
                    statistic.January = 0;
                    statistic.February = 0;
                    statistic.March = 0;
                    statistic.April = 0;
                    statistic.May = 0;
                    statistic.June = 0;
                    statistic.July = 0;
                    statistic.August = 0;
                    statistic.September = 0;
                    statistic.October = 0;
                    statistic.November = 0;
                    statistic.December = 0;



                    // add the new statistic
                    //_context.BudgetVersionStatistics.Add(statistic);
                }

                decimal rowTotal = 0;

                // add all stats from the results
                foreach (ItemTypes month in months)
                {
                    // if the results do not contain a month do not overwrite the existing value
                    if (results[month.ItemTypeCode.ToLower()] != null)
                    {
                        PropertyInfo propertyInfo = statistic.GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        propertyInfo.SetValue(statistic, (decimal)results[month.ItemTypeCode.ToLower()]["sum"], null);
                        rowTotal += (decimal)results[month.ItemTypeCode.ToLower()]["sum"];
                    }
                    // even if the value wasn't in the results we need to add it to the rowTotal
                    else
                    {
                        PropertyInfo propertyInfo = statistic.GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        rowTotal += (decimal)propertyInfo.GetValue(statistic);
                    }
                }

                statistic.rowTotal = rowTotal;

                // if a ratio element exists the ratio and driver dimensions need to be saved
                if (results["ratio"] != null)
                {
                    JObject sourceInfo = (JObject)results["sourceInfo"][0];
                    int driverBudgetVersion = int.Parse((string)sourceInfo["driverBudgetVersionID"]);
                    int driverEntity = int.Parse((string)results["driverDimensionRow"]["entity"]);
                    int driverDepartment = int.Parse((string)results["driverDimensionRow"]["department"]);
                    int driverStatistic = int.Parse((string)results["driverDimensionRow"]["statistic"]);

                    // delete existing drivers for this entry if they exist
                    if (statistic.DimensionsRowID != null)
                    {
                        Dimensions oldDriver = await _context.Dimensions.FindAsync(statistic.DimensionsRowID.DimensionsID);
                        string childDrivers = oldDriver.ChildID;
                        if (childDrivers != null)
                        {
                            foreach (string childDriver in childDrivers.Split(','))
                            {
                                Dimensions oldDriver2 = await _context.Dimensions.FindAsync(int.Parse(childDriver));
                                _context.Remove(oldDriver2);
                            }
                        }
                        statistic.DimensionsRowID = null;
                        _context.SaveChanges();
                        _context.Remove(oldDriver);
                    }

                    // create the first driver
                    Dimensions driver = new Dimensions();
                    driver.BudgetVersion = AllBV.Where(f => f.BudgetVersionID == driverBudgetVersion).FirstOrDefault();
                    driver.Entity = AllEnt.FirstOrDefault(entity => entity.EntityID == driverEntity);
                    driver.Department = AllDept.FirstOrDefault(department => department.DepartmentID == driverDepartment);
                    driver.StatisticsCode = AllStatsCodes.FirstOrDefault(statisticsCode => statisticsCode.StatisticsCodeID == driverStatistic);
                    driver.Seasonality = (bool)results["seasonality"];
                    driver.ForecastType = AllIT.Where(f => f.ItemTypeValue == (string)results["forecastType"]).FirstOrDefault();
                    driver.TargetStartDate = AllIT.Where(f => f.ItemTypeValue == (string)results["targetStartDate"]).FirstOrDefault();
                    driver.TargetEndDate = AllIT.Where(f => f.ItemTypeValue == (string)results["targetEndDate"]).FirstOrDefault();
                    driver.Ratio = (decimal)results["ratio"];
                    driver.SourceStartDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo["sourceStartDate"]).FirstOrDefault();
                    driver.SourceEndDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo["sourceEndDate"]).FirstOrDefault();
                    statistic.DimensionsRowID = driver;
                    driver.CreationDate = DateTime.UtcNow;
                    driver.UpdatedDate = DateTime.UtcNow;
                    driver.IsActive = true;
                    driver.IsActive = false;



                    _context.Add(driver);

                    _context.SaveChanges();

                    string childID = "";

                    // additional drivers will be created as children of the first
                    for (int i = 1; i < ((JArray)results["sourceInfo"]).Count; i++)
                    {
                        JObject sourceInfo2 = (JObject)results["sourceInfo"][i];
                        Dimensions driver2 = new Dimensions();
                        driver2.BudgetVersion = AllBV.Where(f => f.BudgetVersionID == int.Parse((string)sourceInfo2["driverBudgetVersionID"])).FirstOrDefault();
                        driver2.SourceStartDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo2["sourceStartDate"]).FirstOrDefault();
                        driver2.SourceEndDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo2["sourceEndDate"]).FirstOrDefault();
                        driver2.Entity = driver.Entity;
                        driver2.Department = driver.Department;
                        driver2.StatisticsCode = driver.StatisticsCode;
                        driver2.Seasonality = driver.Seasonality;
                        driver2.ForecastType = driver.ForecastType;
                        driver2.TargetStartDate = driver.TargetStartDate;
                        driver2.TargetEndDate = driver.TargetEndDate;
                        driver2.Ratio = driver.Ratio;
                        driver2.ParentID = driver.DimensionsID;
                        driver.CreationDate = DateTime.UtcNow;
                        driver.UpdatedDate = DateTime.UtcNow;
                        driver.IsActive = true;
                        driver.IsActive = false;



                        _context.Add(driver2);
                        _context.SaveChanges();

                        if (childID == "")
                        {
                            childID = driver.DimensionsID.ToString();
                        }
                        else
                        {
                            childID += "," + driver2.DimensionsID;
                        }
                    }

                    if (childID != "")
                    {
                        driver.ChildID = childID;
                    }
                }
                statistic.IsActive = true;
                statistic.IsDeleted = false;

                statistic.Identifier = Guid.NewGuid();
                // save all changes to the target budget
                // bool savezerovalues = SaveZeroValues(_context);
                //if (!savezerovalues && ZeroValuesCheckST (statistic))
                if (!savezerovalues && ZeroValuesCheckST(statistic))
                {
                    if (statistic.StatisticID > 0)
                    {

                        statistic.UpdatedDate = DateTime.UtcNow;
                        _context.SaveChanges();
                    }
                    else
                    {
                        statistic.CreationDate = DateTime.UtcNow;
                        statistic.UpdatedDate = DateTime.UtcNow;

                        _context.BudgetVersionStatistics.Add(statistic);
                        _context.SaveChanges();
                    }
                }


            }

            return "Save Complete";
        }

        private bool ZeroValuesCheckST(BudgetVersionStatistics Obj)
        {
            bool res = false;
            if (Obj.January == 0 &&
                Obj.February == 0 &&
                Obj.March == 0 &&
                Obj.April == 0 &&
                Obj.March == 0 &&
                Obj.June == 0 &&
                Obj.August == 0 &&
                Obj.September == 0 &&
                Obj.October == 0 &&
                Obj.November == 0 &&
                Obj.December == 0 &&
                Obj.rowTotal == 0)
            {

            }
            else
            {
                res = true;
            }

            return res;
        }
        private bool ZeroValuesCheckSF(BudgetVersionStaffing Obj)
        {
            bool res = false;
            if (Obj.January == 0 &&
                Obj.February == 0 &&
                Obj.March == 0 &&
                Obj.April == 0 &&
                Obj.March == 0 &&
                Obj.June == 0 &&
                Obj.August == 0 &&
                Obj.September == 0 &&
                Obj.October == 0 &&
                Obj.November == 0 &&
                Obj.December == 0 &&
                Obj.rowTotal == 0)
            {

            }
            else
            {
                res = true;
            }

            return res;
        }
        private bool ZeroValuesCheckGL(BudgetVersionGLAccounts Obj)
        {
            bool res = false;
            if (Obj.January == 0 &&
                Obj.February == 0 &&
                Obj.March == 0 &&
                Obj.April == 0 &&
                Obj.March == 0 &&
                Obj.June == 0 &&
                Obj.August == 0 &&
                Obj.September == 0 &&
                Obj.October == 0 &&
                Obj.November == 0 &&
                Obj.December == 0 &&
                Obj.rowTotal == 0)
            {

            }
            else
            {
                res = true;
            }

            return res;
        }

        private async Task<string> UpdateGLAccountsBudgetVersion(BudgetVersions targetBudget, string targetEntity, string targetDepartment, string targetGLAccount, JObject results, List<ItemTypes> months)
        {

            // find a general ledger for this dimension if it exists
            BudgetVersionGLAccounts glAccount = _context.BudgetVersionGLAccounts.FirstOrDefault(stat =>
            stat.BudgetVersion.BudgetVersionID == targetBudget.BudgetVersionID &&
            stat.Entity.EntityID == int.Parse(targetEntity) &&
            stat.Department.DepartmentID == int.Parse(targetDepartment) &&
            stat.GLAccount.GLAccountID == int.Parse(targetGLAccount));

            // Check if result have all zero, then discard this iteration, not save data in DB


            // if (results.Count > 0 && !checkAllZero(results)) // If their is no source in DB , OR Having source with all zeros , no target BV statistci saved.
            if (results.Count > 0) // If their is no source in DB , OR Having source with all zeros , no target BV statistci saved.
            {
                // bool savezerovalues = SaveZeroValues(_context);
                // if not found, create a new general ledger
                //if (glAccount == null && savezerovalues)
                if (glAccount == null)
                {

                    glAccount = new BudgetVersionGLAccounts();

                    glAccount.BudgetVersion = AllBV.FirstOrDefault(budgetVersion => budgetVersion.BudgetVersionID == targetBudget.BudgetVersionID);
                    if (targetBudget.ADSgeneralLedgerID != null)
                    {
                        glAccount.DataScenarioDataID = AllDatascenario.FirstOrDefault(f => f.DataScenarioID == targetBudget.ADSgeneralLedgerID.DataScenarioID);

                    }
                    glAccount.Entity = AllEnt.FirstOrDefault(entity => entity.EntityID == int.Parse(targetEntity));
                    glAccount.Department = AllDept.FirstOrDefault(department => department.DepartmentID == int.Parse(targetDepartment));
                    glAccount.GLAccount = AllGLAccounts.FirstOrDefault(glAccount => glAccount.GLAccountID == int.Parse(targetGLAccount));
                    glAccount.DataScenarioTypeID = AllIT.FirstOrDefault(dataScenario => dataScenario.ItemTypeID == targetBudget.scenarioTypeID.ItemTypeID);
                    glAccount.TimePeriodID = AllTimePeriods.FirstOrDefault(timePeriod => timePeriod.TimePeriodID == targetBudget.TimePeriodID.TimePeriodID);
                    glAccount.January = 0;
                    glAccount.February = 0;
                    glAccount.March = 0;
                    glAccount.April = 0;
                    glAccount.May = 0;
                    glAccount.June = 0;
                    glAccount.July = 0;
                    glAccount.August = 0;
                    glAccount.September = 0;
                    glAccount.October = 0;
                    glAccount.November = 0;
                    glAccount.December = 0;




                }

                decimal rowTotal = 0;

                // add all stats from the results
                foreach (ItemTypes month in months)
                {
                    // if the results do not contain a month do not overwrite the existing value
                    if (results[month.ItemTypeCode.ToLower()] != null)
                    {
                        PropertyInfo propertyInfo = glAccount.GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        propertyInfo.SetValue(glAccount, (decimal)results[month.ItemTypeCode.ToLower()]["sum"], null);
                        rowTotal += (decimal)results[month.ItemTypeCode.ToLower()]["sum"];
                    }
                    // even if the value wasn't in the results we need to add it to the rowTotal
                    else
                    {
                        PropertyInfo propertyInfo = glAccount.GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        rowTotal += (decimal)propertyInfo.GetValue(glAccount);
                    }
                }

                glAccount.rowTotal = rowTotal;

                // if a ratio element exists the ratio and driver dimensions need to be saved
                if (results["ratio"] != null)
                {
                    JObject sourceInfo = (JObject)results["sourceInfo"][0];
                    int driverBudgetVersion = int.Parse((string)sourceInfo["driverBudgetVersionID"]);
                    int driverEntity = int.Parse((string)results["driverDimensionRow"]["entity"]);
                    int driverDepartment = int.Parse((string)results["driverDimensionRow"]["department"]);
                    int? driverStatistic = null;
                    int? driverGeneralLedger = null;

                    if (results["driverDimensionRow"]["generalLedger"] != null)
                    {
                        driverGeneralLedger = int.Parse((string)results["driverDimensionRow"]["generalLedger"]);
                    }
                    else
                    {
                        driverStatistic = int.Parse((string)results["driverDimensionRow"]["statistic"]);
                    }

                    // delete existing drivers for this entry if they exist
                    if (glAccount.DimensionsRowID != null)
                    {
                        Dimensions oldDriver = await _context.Dimensions.FindAsync(glAccount.DimensionsRowID.DimensionsID);
                        string childDrivers = oldDriver.ChildID;
                        if (childDrivers != null)
                        {
                            foreach (string childDriver in childDrivers.Split(','))
                            {
                                Dimensions oldDriver2 = await _context.Dimensions.FindAsync(int.Parse(childDriver));
                                _context.Remove(oldDriver2);
                            }
                        }
                        glAccount.DimensionsRowID = null;
                        _context.SaveChanges();
                        _context.Remove(oldDriver);
                    }

                    // create the first driver
                    Dimensions driver = new Dimensions();
                    //driver.BudgetVersion = await _context._BudgetVersions.FindAsync(driverBudgetVersion);
                    driver.BudgetVersion = AllBV.Where(f => f.BudgetVersionID == driverBudgetVersion).FirstOrDefault();
                    driver.Entity = AllEnt.FirstOrDefault(entity => entity.EntityID == int.Parse((string)results["driverDimensionRow"]["entity"]));
                    driver.Department = AllDept.FirstOrDefault(department => department.DepartmentID == int.Parse((string)results["driverDimensionRow"]["department"]));
                    if (results["driverDimensionRow"]["generalLedger"] != null)
                    {
                        driver.GLAccount = AllGLAccounts.FirstOrDefault(glAccount => glAccount.GLAccountID == int.Parse((string)results["driverDimensionRow"]["generalLedger"]));
                    }
                    else
                    {
                        driver.StatisticsCode = AllStatsCodes.FirstOrDefault(statistic => statistic.StatisticsCodeID == int.Parse((string)results["driverDimensionRow"]["statistic"]));
                    }
                    driver.Seasonality = (bool)results["seasonality"];
                    driver.ForecastType = AllIT.Where(f => f.ItemTypeValue == (string)results["forecastType"]).FirstOrDefault();
                    driver.TargetStartDate = AllIT.Where(f => f.ItemTypeValue == (string)results["targetStartDate"]).FirstOrDefault();
                    driver.TargetEndDate = AllIT.Where(f => f.ItemTypeValue == (string)results["targetEndDate"]).FirstOrDefault();
                    driver.Ratio = (decimal)results["ratio"];
                    driver.SourceStartDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo["sourceStartDate"]).FirstOrDefault();
                    driver.SourceEndDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo["sourceEndDate"]).FirstOrDefault();
                    glAccount.DimensionsRowID = driver;
                    _context.SaveChanges();

                    string childID = "";

                    // additional drivers will be saved as children of the first
                    for (int i = 1; i < ((JArray)results["sourceInfo"]).Count; i++)
                    {
                        JObject sourceInfo2 = (JObject)results["sourceInfo"][i];
                        Dimensions driver2 = new Dimensions();
                        driver2.BudgetVersion = AllBV.Where(a => a.BudgetVersionID == int.Parse((string)sourceInfo2["driverBudgetVersionID"])).FirstOrDefault();
                        //driver2.BudgetVersion = await _context._BudgetVersions.FindAsync(int.Parse((string)sourceInfo2["driverBudgetVersionID"]));
                        driver2.SourceStartDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo2["sourceStartDate"]).FirstOrDefault();
                        driver2.SourceEndDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo2["sourceEndDate"]).FirstOrDefault();
                        driver2.Entity = driver.Entity;
                        driver2.Department = driver.Department;
                        driver2.StatisticsCode = driver.StatisticsCode;
                        driver2.GLAccount = driver.GLAccount;
                        driver2.Seasonality = driver.Seasonality;
                        driver2.ForecastType = driver.ForecastType;
                        driver2.TargetStartDate = driver.TargetStartDate;
                        driver2.TargetEndDate = driver.TargetEndDate;
                        driver2.Ratio = driver.Ratio;
                        driver2.ParentID = driver.DimensionsID;
                        _context.Add(driver2);
                        _context.SaveChanges();

                        if (childID == "")
                        {
                            childID = driver2.DimensionsID.ToString();
                        }
                        else
                        {
                            childID += "," + driver2.DimensionsID;
                        }
                    }

                    if (childID != "")
                    {
                        driver.ChildID = childID;
                    }
                }

                glAccount.IsActive = true;
                glAccount.IsDeleted = false;

                glAccount.Identifier = Guid.NewGuid();
                // bool savezerovalues = SaveZeroValues(_context);
                //if (!savezerovalues && ZeroValuesCheckST (statistic))
                if (!savezerovalues && ZeroValuesCheckGL(glAccount))
                {
                    if (glAccount.StatisticID > 0)
                    {
                        glAccount.UpdatedDate = DateTime.UtcNow;
                        _context.SaveChanges();
                    }
                    else
                    {

                        glAccount.CreationDate = DateTime.UtcNow;
                        glAccount.UpdatedDate = DateTime.UtcNow;
                        // add the new glAccount
                        _context.BudgetVersionGLAccounts.Add(glAccount);
                        _context.SaveChanges();
                    }
                }
            }

            return "Save Complete";
        }

        private bool SaveZeroValues(BudgetingContext context)
        {
            var SaveZeroValues = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "FORECASTSAVEZEROVALUES", _context);

            bool saveresults = bool.Parse(SaveZeroValues.ItemTypeValue);
            return saveresults;
        }

        private async Task<string> UpdateStaffingBudgetVersion(BudgetVersions targetBudget, string targetEntity, string targetDepartment, string targetJobCode, string targetPayType, JObject results, List<ItemTypes> months, string forecastType)
        {
            Console.WriteLine("UpdateStaffingBudgetVersion");
            string staffingType = "Dollars";
            if (forecastType.Contains("hours"))
            {
                staffingType = "Hours";
            }
            else if (forecastType.Contains("average_wage"))
            {
                staffingType = "AverageWage";
            }
            else if (forecastType.Contains("pay_type_distribution"))
            {
                staffingType = "PayTypeDistribution";
            }

            // find a staffing for this dimension if it exists
            BudgetVersionStaffing staffing = _context.BudgetVersionStaffing.FirstOrDefault(stat =>
            stat.BudgetVersion.BudgetVersionID == targetBudget.BudgetVersionID &&
            stat.Entity.EntityID == int.Parse(targetEntity) &&
            stat.Department.DepartmentID == int.Parse(targetDepartment) &&
            stat.JobCode.JobCodeID == int.Parse(targetJobCode) &&
            stat.PayType.PayTypeID == int.Parse(targetPayType) &&
            stat.StaffingDataType.ItemTypeValue == staffingType);

            if (results.Count > 0) // If their is no source in DB , no target BV statistci saved.
            {
                // bool savezerovalues = SaveZeroValues(_context);
                // if not found, create a new staffing
                if (staffing == null)
                //if (staffing == null && savezerovalues)
                {
                    staffing = new BudgetVersionStaffing();
                    staffing.BudgetVersion = AllBV.FirstOrDefault(budgetVersion => budgetVersion.BudgetVersionID == targetBudget.BudgetVersionID);
                    if (targetBudget.ADSstaffingID != null)
                    {
                        staffing.DataScenarioID = AllDatascenario.FirstOrDefault(f => f.DataScenarioID == targetBudget.ADSstaffingID.DataScenarioID);
                    }
                    staffing.Entity = AllEnt.FirstOrDefault(entity => entity.EntityID == int.Parse(targetEntity));
                    staffing.Department = AllDept.FirstOrDefault(department => department.DepartmentID == int.Parse(targetDepartment));
                    staffing.JobCode = AllJobCodes.FirstOrDefault(jobCode => jobCode.JobCodeID == int.Parse(targetJobCode));
                    staffing.PayType = AllPayTypes.FirstOrDefault(payType => payType.PayTypeID == int.Parse(targetPayType));
                    staffing.DataScenarioTypeID = AllIT.FirstOrDefault(dataScenario => dataScenario.ItemTypeID == targetBudget.scenarioTypeID.ItemTypeID);
                    staffing.TimePeriodID = AllTimePeriods.FirstOrDefault(timePeriod => timePeriod.TimePeriodID == targetBudget.TimePeriodID.TimePeriodID);
                    staffing.StaffingDataType = AllIT.FirstOrDefault(itemType => itemType.ItemTypeValue == staffingType);
                    //staffing.BudgetVersion = _context._BudgetVersions.FirstOrDefault(budgetVersion => budgetVersion.BudgetVersionID == targetBudget.BudgetVersionID);
                    //staffing.Entity = _context.Entities.FirstOrDefault(entity => entity.EntityID == int.Parse(targetEntity));
                    //staffing.Department = _context.Departments.FirstOrDefault(department => department.DepartmentID == int.Parse(targetDepartment));
                    //staffing.JobCode = _context.JobCodes.FirstOrDefault(jobCode => jobCode.JobCodeID == int.Parse(targetJobCode));
                    //staffing.PayType = _context.PayTypes.FirstOrDefault(payType => payType.PayTypeID == int.Parse(targetPayType));
                    //staffing.DataScenarioTypeID = _context._ItemTypes.FirstOrDefault(dataScenario => dataScenario.ItemTypeID == targetBudget.scenarioTypeID.ItemTypeID);
                    //staffing.TimePeriodID = _context.TimePeriods.FirstOrDefault(timePeriod => timePeriod.TimePeriodID == targetBudget.TimePeriodID.TimePeriodID);
                    //staffing.StaffingDataType = _context._ItemTypes.FirstOrDefault(itemType => itemType.ItemTypeValue == staffingType);



                    staffing.January = 0;
                    staffing.February = 0;
                    staffing.March = 0;
                    staffing.April = 0;
                    staffing.May = 0;
                    staffing.June = 0;
                    staffing.July = 0;
                    staffing.August = 0;
                    staffing.September = 0;
                    staffing.October = 0;
                    staffing.November = 0;
                    staffing.December = 0;




                }

                decimal rowTotal = 0;

                // add all stats from the results
                foreach (ItemTypes month in months)
                {
                    // if the results do not contain a month do not overwrite the existing value
                    if (results[month.ItemTypeCode.ToLower()] != null)
                    {
                        PropertyInfo propertyInfo = staffing.GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        propertyInfo.SetValue(staffing, (decimal)results[month.ItemTypeCode.ToLower()]["sum"], null);
                        rowTotal += (decimal)results[month.ItemTypeCode.ToLower()]["sum"];
                    }
                    // even if the value wasn't in the results we need to add it to the rowTotal
                    else
                    {
                        PropertyInfo propertyInfo = staffing.GetType().GetProperty(monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault().Value);
                        rowTotal += (decimal)propertyInfo.GetValue(staffing);
                    }
                }

                // for average wage the value for the year is the same as each month, not a total
                if (forecastType == "staffing_average_wage_rate")
                {
                    staffing.rowTotal = rowTotal / 12;
                    staffing.wageRateOverride = rowTotal / 12;
                }
                else
                {
                    // Set to NULL , Becuase for these hours no need to calculate its dollar. 
                    // If rowTotal OR wageRateOverride value is set then UI will show its dollars after calculation.
                    staffing.rowTotal = 0;
                    staffing.wageRateOverride = 0;
                }

                // if a ratio element exists the ratio and driver dimensions need to be saved
                if (results["ratio"] != null)
                {
                    JObject sourceInfo = (JObject)results["sourceInfo"][0];
                    int driverBudgetVersion = int.Parse((string)sourceInfo["driverBudgetVersionID"]);
                    int driverEntity = int.Parse((string)results["driverDimensionRow"]["entity"]);
                    int driverDepartment = int.Parse((string)results["driverDimensionRow"]["department"]);
                    int? driverStatistic = null;
                    int? driverJobCode = null;
                    int? driverPayType = null;

                    if (results["driverDimensionRow"]["jobCode"] != null)
                    {
                        driverJobCode = int.Parse((string)results["driverDimensionRow"]["jobCode"]);
                        driverPayType = int.Parse((string)results["driverDimensionRow"]["payType"]);
                    }
                    else
                    {
                        driverStatistic = int.Parse((string)results["driverDimensionRow"]["statistic"]);
                    }

                    // delete existing drivers for this entry if they exist
                    if (staffing.DimensionsRowID != null)
                    {
                        Dimensions oldDriver = await _context.Dimensions.FindAsync(staffing.DimensionsRowID.DimensionsID);
                        string childDrivers = oldDriver.ChildID;
                        if (childDrivers != null)
                        {
                            foreach (string childDriver in childDrivers.Split(','))
                            {
                                Dimensions oldDriver2 = await _context.Dimensions.FindAsync(int.Parse(childDriver));
                                _context.Remove(oldDriver2);
                            }
                        }
                        staffing.DimensionsRowID = null;
                        _context.SaveChanges();
                        _context.Remove(oldDriver);
                    }

                    // create the first driver
                    Dimensions driver = new Dimensions();
                    driver.BudgetVersion = AllBV.Where(f => f.BudgetVersionID == driverBudgetVersion).FirstOrDefault();
                    driver.Entity = AllEnt.FirstOrDefault(entity => entity.EntityID == int.Parse((string)results["driverDimensionRow"]["entity"]));
                    driver.Department = AllDept.FirstOrDefault(department => department.DepartmentID == int.Parse((string)results["driverDimensionRow"]["department"]));
                    if (results["driverDimensionRow"]["jobCode"] != null)
                    {
                        driver.JobCode = AllJobCodes.FirstOrDefault(jobCode => jobCode.JobCodeID == int.Parse((string)results["driverDimensionRow"]["jobCode"]));
                        driver.PayType = AllPayTypes.FirstOrDefault(payType => payType.PayTypeID == int.Parse((string)results["driverDimensionRow"]["payType"]));
                    }
                    else
                    {
                        driver.StatisticsCode = AllStatsCodes.FirstOrDefault(statistic => statistic.StatisticsCodeID == int.Parse((string)results["driverDimensionRow"]["statistic"]));
                    }
                    driver.Seasonality = (bool)results["seasonality"];
                    driver.ForecastType = AllIT.Where(f => f.ItemTypeValue == (string)results["forecastType"]).FirstOrDefault();
                    driver.TargetStartDate = AllIT.Where(f => f.ItemTypeValue == (string)results["targetStartDate"]).FirstOrDefault();
                    driver.TargetEndDate = AllIT.Where(f => f.ItemTypeValue == (string)results["targetEndDate"]).FirstOrDefault();
                    driver.Ratio = (decimal)results["ratio"];
                    driver.SourceStartDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo["sourceStartDate"]).FirstOrDefault();
                    driver.SourceEndDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo["sourceEndDate"]).FirstOrDefault();
                    staffing.DimensionsRowID = driver;
                    _context.SaveChanges();

                    string childID = "";

                    // additional drivers will be saved as children of the first
                    for (int i = 1; i < ((JArray)results["sourceInfo"]).Count; i++)
                    {
                        JObject sourceInfo2 = (JObject)results["sourceInfo"][i];
                        Dimensions driver2 = new Dimensions();
                        driver2.BudgetVersion = AllBV.Where(f => f.BudgetVersionID == int.Parse((string)sourceInfo2["driverBudgetVersionID"])).FirstOrDefault();
                        driver2.SourceStartDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo2["sourceStartDate"]).FirstOrDefault();
                        driver2.SourceEndDate = AllIT.Where(f => f.ItemTypeValue == (string)sourceInfo2["sourceEndDate"]).FirstOrDefault();
                        driver2.Entity = driver.Entity;
                        driver2.Department = driver.Department;
                        driver2.StatisticsCode = driver.StatisticsCode;
                        driver2.JobCode = driver.JobCode;
                        driver2.PayType = driver.PayType;
                        driver2.Seasonality = driver.Seasonality;
                        driver2.ForecastType = driver.ForecastType;
                        driver2.TargetStartDate = driver.TargetStartDate;
                        driver2.TargetEndDate = driver.TargetEndDate;
                        driver2.Ratio = driver.Ratio;
                        driver2.ParentID = driver.DimensionsID;
                        _context.Add(driver2);
                        _context.SaveChanges();

                        if (childID == "")
                        {
                            childID = driver2.DimensionsID.ToString();
                        }
                        else
                        {
                            childID += "," + driver2.DimensionsID;
                        }
                    }

                    if (childID != "")
                    {
                        driver.ChildID = childID;
                    }
                }
                staffing.IsActive = true;
                staffing.IsDeleted = false;


                staffing.Identifier = Guid.NewGuid();
                //bool savezerovalues = SaveZeroValues(_context);
                //if (!savezerovalues && ZeroValuesCheckST (statistic))
                if (!savezerovalues && ZeroValuesCheckSF(staffing))
                {
                    // add the new staffing
                    if (staffing.BudgetVersionStaffingID > 0)
                    {
                        staffing.UpdatedDate = DateTime.UtcNow;
                        _context.SaveChanges();
                    }
                    else
                    {
                        staffing.CreationDate = DateTime.UtcNow;
                        staffing.UpdatedDate = DateTime.UtcNow;
                        _context.BudgetVersionStaffing.Add(staffing);
                        _context.SaveChanges();
                    }

                }




            }

            return "Save Complete";
        }

        private async Task<JObject> CopyFormula(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, List<ItemTypes> months, ForecastSection section, DimensionRow sourceDimensionRow, DimensionRow targetDimensionRow, string scenarioType)
        {
            // get percent change multiplier
            double percentChangeMultiplier = 1.0 + (section.percentChange.GetValueOrDefault() / 100);

            // get source data
            var sourceData = await GetData(sourceBudgetInfo, months, sourceDimensionRow, scenarioType, section.forecastType);

            if (sourceData.Count == 0)
            {
                return new JObject();
            }

            // get target data
            var targetData = await GetData(new List<DataRowWithID> { targetBudgetInfo }, months, targetDimensionRow, scenarioType, section.forecastType);

            foreach (KeyValuePair<string, JToken> stat in sourceData)
            {
                if (targetData[stat.Key] != null)
                {
                    // TODO: incorporate spread method in calculation
                    targetData[stat.Key]["sum"] = (double)sourceData[stat.Key]["sum"] * percentChangeMultiplier;
                }
            }
            if (section.automaticallyUpdate == "true")
            {
                // add the ratio, driver dimensions, and date ranges to the return value so they can be saved
                double ratio = percentChangeMultiplier;
                targetData.Add("ratio", ratio);
                targetData.Add("seasonality", "false");
                targetData.Add("forecastType", "Copy data set");
                targetData.Add("targetStartDate", "fiscalStartMonth-01");
                targetData.Add("targetEndDate", "fiscalStartMonth-12");
                List<JObject> sourceInfoList = new List<JObject>();
                foreach (DataRowWithID source in sourceBudgetInfo)
                {
                    JObject sourceInfo = new JObject {
                            new JProperty("driverBudgetVersionID",source.budgetVersionID),
                            new JProperty("sourceStartDate", source.startMonth),
                            new JProperty("sourceEndDate", source.endMonth)
                    };
                    sourceInfoList.Add(sourceInfo);
                }
                targetData.Add("sourceInfo", JArray.FromObject(sourceInfoList));
                targetData.Add("driverDimensionRow", JToken.FromObject(sourceDimensionRow));
            }

            return targetData;
        }

        private async Task<JObject> AnnualizeFormula(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, List<ItemTypes> months, ForecastSection section, DimensionRow sourceDimensionRow, DimensionRow targetDimensionRow, string scenarioType)
        {
            // get percent change multiplier
            double percentChangeMultiplier = 1.0 + (section.percentChange.GetValueOrDefault() / 100);

            // get source data
            var sourceData = await GetData(sourceBudgetInfo, months, sourceDimensionRow, scenarioType, section.forecastType);
            if (sourceData.Count == 0)
            {
                return new JObject();
            }
            // get target data
            var targetData = await GetData(new List<DataRowWithID> { targetBudgetInfo }, months, targetDimensionRow, scenarioType, section.forecastType);

            // if maintainSeasonality is selected then each month must be annualized separately
            if (section.target.dataRow[0].maintainSeasonality.GetValueOrDefault())
            {
                foreach (KeyValuePair<string, JToken> stat in sourceData)
                {
                    if (targetData[stat.Key] != null)
                    {
                        // TODO: incorporate spread method in calculation
                        targetData[stat.Key]["sum"] = ((double)sourceData[stat.Key]["sum"] / (double)sourceData[stat.Key]["count"]) * percentChangeMultiplier;
                    }
                }
            }
            // if maintainSeasonality is not selected then all of the values will be used in the calculation so a total count and total sum is needed
            else
            {
                int sourceCount = 0;
                double sourceSum = 0;
                foreach (KeyValuePair<string, JToken> stat in sourceData)
                {
                    sourceCount += (int)sourceData[stat.Key]["count"];
                    sourceSum += (double)sourceData[stat.Key]["sum"];
                }

                // apply monthly source ratio to each month in target
                foreach (KeyValuePair<string, JToken> stat in targetData)
                {
                    if (targetData[stat.Key] != null)
                    {
                        // TODO: incorporate spread method in calculation
                        targetData[stat.Key]["sum"] = (sourceSum / (double)sourceCount) * percentChangeMultiplier;
                    }
                }
            }
            if (section.automaticallyUpdate == "true")
            {
                // add the ratio, driver dimensions, and date ranges to the return value so they can be saved
                double ratio = percentChangeMultiplier;
                targetData.Add("ratio", ratio);
                targetData.Add("seasonality", section.target.dataRow[0].maintainSeasonality.GetValueOrDefault());
                targetData.Add("forecastType", "Annualization");
                targetData.Add("targetStartDate", "fiscalStartMonth-01");
                targetData.Add("targetEndDate", "fiscalStartMonth-12");
                List<JObject> sourceInfoList = new List<JObject>();
                foreach (DataRowWithID source in sourceBudgetInfo)
                {
                    JObject sourceInfo = new JObject {
                            new JProperty("driverBudgetVersionID",source.budgetVersionID),
                            new JProperty("sourceStartDate", source.startMonth),
                            new JProperty("sourceEndDate", source.endMonth)
                    };
                    sourceInfoList.Add(sourceInfo);
                }
                targetData.Add("sourceInfo", JArray.FromObject(sourceInfoList));
                targetData.Add("driverDimensionRow", JToken.FromObject(sourceDimensionRow));
            }

            return targetData;
        }

        private async Task<JObject> RatioFormula(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, List<ItemTypes> months, ForecastSection section, DimensionRow sourceNumeratorDimensionRow, DimensionRow sourceDenominatorDimensionRow, DimensionRow targetNumeratorDimensionRow, DimensionRow targetDenominatorDimensionRow, string scenarioType)
        {
            // get percent change multiplier
            double percentChangeMultiplier = 1.0 + (section.percentChange.GetValueOrDefault() / 100);

            // ratioGL_Statistics uses generalLedger numerators and Statistic denominators
            string denominatorType = scenarioType;
            if (section.forecastType == "ratioGL_Statistics" || section.forecastType == "ratio_staffing_hours_statistics")
            {
                denominatorType = "Statistic";
            }

            // get source data
            var sourceNumeratorData = await GetData(sourceBudgetInfo, months, sourceNumeratorDimensionRow, scenarioType, section.forecastType);
            var sourceDenominatorData = await GetData(sourceBudgetInfo, months, sourceDenominatorDimensionRow, denominatorType, section.forecastType);
            if (sourceNumeratorData.Count == 0 || sourceDenominatorData.Count == 0)
            {
                return new JObject();
            }
            // get target data
            var targetNumeratorData = await GetData(new List<DataRowWithID> { targetBudgetInfo }, months, targetNumeratorDimensionRow, scenarioType, section.forecastType);
            var targetDenominatorData = await GetData(new List<DataRowWithID> { targetBudgetInfo }, months, targetDenominatorDimensionRow, denominatorType, section.forecastType);
            if (targetDenominatorData.Count == 0)
            {
                return new JObject();
            }

            // if the target numerator data doesn't exist copy the source data so that we have a structure to copy into
            if (targetNumeratorData.Count == 0)
            {
                targetNumeratorData = sourceNumeratorData;
            }

            double sourceNumeratorSum = 0;
            double sourceDenominatorSum = 0;
            double sourceRatio = 0;
            foreach (KeyValuePair<string, JToken> stat in sourceNumeratorData)
            {
                sourceNumeratorSum += (int)sourceNumeratorData[stat.Key]["sum"];
                sourceDenominatorSum += (double)sourceDenominatorData[stat.Key]["sum"];
            }
            // sourceDenominatorSum of 0 will cause an error trying to calculate, leave the ratio set to 0
            if (sourceDenominatorSum != 0)
            {
                sourceRatio = sourceNumeratorSum / sourceDenominatorSum;
            }
            foreach (KeyValuePair<string, JToken> stat in sourceNumeratorData)
            {
                if (targetNumeratorData[stat.Key] != null)
                {
                    // TODO: incorporate spread method in calculation
                    targetNumeratorData[stat.Key]["sum"] = (sourceRatio * (double)targetDenominatorData[stat.Key]["sum"]) * percentChangeMultiplier;
                }
            }
            if (section.automaticallyUpdate == "true")
            {
                // add the ratio, driver dimensions, and date ranges to the return value so they can be saved
                double ratio = sourceRatio * percentChangeMultiplier;
                targetNumeratorData.Add("ratio", ratio);
                targetNumeratorData.Add("seasonality", "false");
                targetNumeratorData.Add("forecastType", "Another statistic");
                targetNumeratorData.Add("targetStartDate", "fiscalStartMonth-01");
                targetNumeratorData.Add("targetEndDate", "fiscalStartMonth-12");
                List<JObject> sourceInfoList = new List<JObject>();
                foreach (DataRowWithID source in sourceBudgetInfo)
                {
                    JObject sourceInfo = new JObject {
                            new JProperty("driverBudgetVersionID",targetBudgetInfo.budgetVersionID),
                            new JProperty("sourceStartDate", "fiscalStartMonth-01"),
                            new JProperty("sourceEndDate","fiscalStartMonth-12")
                    };
                    sourceInfoList.Add(sourceInfo);
                }
                targetNumeratorData.Add("sourceInfo", JArray.FromObject(sourceInfoList));
                targetNumeratorData.Add("driverDimensionRow", JToken.FromObject(targetDenominatorDimensionRow));
            }

            return targetNumeratorData;
        }

        private async Task<JObject> AverageWageFormula(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, List<ItemTypes> months, ForecastSection section, DimensionRow sourceDimensionRow, DimensionRow targetDimensionRow, string scenarioType)
        {

            Console.WriteLine("AverageWageFormula||" + DateTime.UtcNow.ToLongTimeString());
            // get source data
            var sourceDollarData = await GetData(sourceBudgetInfo, months, sourceDimensionRow, scenarioType, "dollars");
            var sourceHourData = await GetData(sourceBudgetInfo, months, sourceDimensionRow, scenarioType, "hours");

            // get target data
            var targetData = await GetData(new List<DataRowWithID> { targetBudgetInfo }, months, targetDimensionRow, scenarioType, section.forecastType);

            double sourceDollarSum = 0;
            double sourceHourSum = 0;
            foreach (KeyValuePair<string, JToken> stat in sourceDollarData)
            {
                sourceDollarSum += (double)sourceDollarData[stat.Key]["sum"];
                sourceHourSum += (double)sourceHourData[stat.Key]["sum"];
            }

            // apply monthly source ratio to each month in target
            foreach (KeyValuePair<string, JToken> stat in targetData)
            {
                if (targetData[stat.Key] != null)
                {
                    if (sourceHourSum == 0)
                    {
                        targetData[stat.Key]["sum"] = 0;
                    }
                    else
                    {
                        targetData[stat.Key]["sum"] = (sourceDollarSum / sourceHourSum);
                    }
                }
            }

            return targetData;
        }

        private async Task<JObject> StaffingGLMappingFormula(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, List<ItemTypes> months, ForecastSection section, DimensionRow sourceDimensionRow, DimensionRow targetDimensionRow)
        {
            // get source data
            var sourceData = await GetData(sourceBudgetInfo, months, sourceDimensionRow, "Staffing", section.forecastType);

            if (sourceData.Count == 0)
            {
                return new JObject();
            }

            // get target data
            var targetData = await GetData(new List<DataRowWithID> { targetBudgetInfo }, months, targetDimensionRow, "General Ledger", section.forecastType);

            foreach (KeyValuePair<string, JToken> stat in sourceData)
            {
                if (targetData[stat.Key] != null)
                {
                    // TODO: incorporate spread method in calculation
                    targetData[stat.Key]["sum"] = (double)sourceData[stat.Key]["sum"];
                }
            }

            return targetData;
        }

        private async Task<List<opForecastResults>> StaffingPayTypeDistributionFormula(List<DataRowWithID> sourceBudgetInfo, DataRowWithID targetBudgetInfo, List<ItemTypes> months, ForecastSection section, List<ParsedSectionDimensionPairings> parsedSectionDimensionPairings, string scenarioType)
        {
            Operations.opBudgetVersionStaffing opStaffing = new Operations.opBudgetVersionStaffing();
            List<opForecastResults> forecastResultsList = new List<opForecastResults>();
            dynamic forecastResultsByTarget = null;
            List<PayTypes> productivePayTypes = await CheckPayTypeGroup(section.source.dimensionRow.productivePayTypeGroup, new List<PayTypes>());

            // this is used to get the entity, department, and jobCode values
            DimensionRow dimensionRow = parsedSectionDimensionPairings[0].sourceDimensionRow;
            List<BudgetVersionStaffing> data = opStaffing.getStaffingAllPayTypes(sourceBudgetInfo[0].budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.jobCode, "Dollars", BVSFSource.SelectMany(f => f).ToList());
            //List<BudgetVersionStaffing> data = await opStaffing.getStaffingAllPayTypes(sourceBudgetInfo[0].budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.jobCode, "Dollars", _context);

            // these variables get the ItemType month based on fiscalStartMonth-XX and then the int value of that month based on the abbreviation
            ItemTypes startMonth = months.Where(m => m.ItemTypeValue == sourceBudgetInfo[0].startMonth).FirstOrDefault();
            int startMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(startMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;
            ItemTypes endMonth = months.Where(m => m.ItemTypeValue == sourceBudgetInfo[0].endMonth).FirstOrDefault();
            int endMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(endMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;

            // loop and create a productive pay type total to be used to calculate percentages
            decimal total = 0;
            foreach (BudgetVersionStaffing bvs in data)
            {
                // skip any Paytype that are not in the productive group
                if (productivePayTypes.FindIndex(pt => pt.PayTypeID == bvs.PayType.PayTypeID) == -1)
                {
                    continue;
                }
                foreach (ItemTypes month in months)
                {
                    KeyValuePair<int, string> monthDicationaryItem = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault();
                    // if the start month is less than the end month get all the values greater than or equal to start AND less than or equal to end, ex. 6 <= x >= 10
                    // if the start month is greater than the end month get all the values greater than or equal to start OR less than or equal to end, ex. 10 <= x; 2 >= x
                    if (!monthDicationaryItem.Equals(default(KeyValuePair<int, string>)) &&
                            ((startMonthValue <= endMonthValue && monthDicationaryItem.Key >= startMonthValue && monthDicationaryItem.Key <= endMonthValue) ||
                            (startMonthValue > endMonthValue && (monthDicationaryItem.Key >= startMonthValue || monthDicationaryItem.Key <= endMonthValue))))
                    {
                        // add to the existing total
                        total += (decimal)bvs.GetType().GetProperty(monthDicationaryItem.Value).GetValue(bvs, null);
                    }
                }
            }

            foreach (BudgetVersionStaffing bvs in data)
            {
                decimal subTotal = 0;
                foreach (ItemTypes month in months)
                {
                    KeyValuePair<int, string> monthDicationaryItem = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault();
                    // if the start month is less than the end month get all the values greater than or equal to start AND less than or equal to end, ex. 6 <= x >= 10
                    // if the start month is greater than the end month get all the values greater than or equal to start OR less than or equal to end, ex. 10 <= x; 2 >= x
                    if (!monthDicationaryItem.Equals(default(KeyValuePair<int, string>)) &&
                            ((startMonthValue <= endMonthValue && monthDicationaryItem.Key >= startMonthValue && monthDicationaryItem.Key <= endMonthValue) ||
                            (startMonthValue > endMonthValue && (monthDicationaryItem.Key >= startMonthValue || monthDicationaryItem.Key <= endMonthValue))))
                    {
                        // add to the existing subTotal
                        subTotal += (decimal)bvs.GetType().GetProperty(monthDicationaryItem.Value).GetValue(bvs, null);
                    }
                }
                string jsonResult = "{";

                for (int i = 0; i < months.Count; i++)
                {
                    decimal ratio = 0;
                    // prevent divide by 0 error
                    if (total != 0)
                    {
                        ratio = subTotal / total;
                    }
                    jsonResult += "'" + months[i].ItemTypeDisplayName.ToLower() + "': { sum:" + ratio + ",count:1 },";
                }

                jsonResult += "}";

                JObject statisticsObj = JObject.Parse(jsonResult);

                opForecastResults forecastResults = new opForecastResults();
                forecastResults._ForcastResults = new ForecastResults();
                DimensionRow dimensions = new DimensionRow();
                dimensions.entity = bvs.Entity.EntityID.ToString();
                dimensions.department = bvs.Department.DepartmentID.ToString();
                dimensions.jobCode = bvs.JobCode.JobCodeID.ToString();
                dimensions.payType = bvs.PayType.PayTypeID.ToString();
                forecastResults.targetDimensionRow = dimensions;
                forecastResults.result = statisticsObj;
                forecastResultsList.Add(forecastResults);
            }

            return forecastResultsList;
        }

        private async Task<JObject> GetData(List<DataRowWithID> budgetInfo, List<ItemTypes> months, DimensionRow dimensionRow, string dimensionType, string forecastType)
        {
            Operations.opBudgetVersionStatistics opStatistics = new Operations.opBudgetVersionStatistics();
            Operations.opBudgetVersionGLAccounts opGLAccounts = new Operations.opBudgetVersionGLAccounts();
            Operations.opBudgetVersionStaffing opStaffing = new Operations.opBudgetVersionStaffing();
            // this will hold data in the format [sum, count]
            decimal[,] statData = new decimal[12, 2];

            // each budget source will be added to the array keeping track of the sum and count so that the same variable can calculate copy and annualize
            foreach (DataRowWithID info in budgetInfo)
            {
                dynamic data = null;
                switch (dimensionType)
                {
                    case "Statistic":

                        if (BVSTSource.Count > 0)
                        {
                            data = await opStatistics.getStatistics(info.budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.statistic, BVSTSource.SelectMany(f => f).ToList());
                        }
                        else
                        {
                            data = await opStatistics.getStatistics(info.budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.statistic, _context);

                        }
                        break;
                    case "General Ledger":

                        if (BVGLSource.Count > 1)
                        {
                            data = await opGLAccounts.getGLAccounts(info.budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.generalLedger, BVGLSource.SelectMany(f => f).ToList());
                        }
                        else
                        {
                            data = await opGLAccounts.getGLAccounts(info.budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.generalLedger, _context);
                        }
                        break;
                    case "Staffing":

                        if (forecastType == "staffingGL_mapping" && BVSFSource.Count < 1)
                        {
                            data = await opStaffing.getStaffing(info.budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.jobCode, dimensionRow.payType, forecastType, _context);
                        }
                        else
                           if (forecastType == "staffingGL_mapping" && BVSFSource.Count > 0)
                        {
                            data = await opStaffing.getStaffing(info.budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.jobCode, dimensionRow.payType, forecastType, BVSFSource.SelectMany(f => f).ToList());
                        }
                        else
                               if (forecastType != "staffingGL_mapping" && BVSFSource.Count > 0)
                        {
                            data = await opStaffing.getStaffing(info.budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.jobCode, dimensionRow.payType, forecastType, BVSFSource.SelectMany(f => f).ToList());
                        }
                        else
                               if (forecastType != "staffingGL_mapping" && BVSFSource.Count < 1)
                        {
                            data = await opStaffing.getStaffing(info.budgetVersionID, dimensionRow.entity, dimensionRow.department, dimensionRow.jobCode, dimensionRow.payType, forecastType, _context);
                        }



                        break;
                    default:
                        throw new ArgumentException(string.Format("Unknown dimension type: {0}"), dimensionType);
                }

                // these variables get the ItemType month based on fiscalStartMonth-XX and then the int value of that month based on the abbreviation
                ItemTypes startMonth = months.Where(m => m.ItemTypeValue == info.startMonth).FirstOrDefault();
                int startMonthValue = 0;
                int endMonthValue = 0;
                if (startMonth != null)
                {
                    startMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(startMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;
                }
                ItemTypes endMonth = months.Where(m => m.ItemTypeValue == info.endMonth).FirstOrDefault();
                if (endMonth != null)
                {
                    endMonthValue = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(endMonth.ItemTypeCode.ToUpper())).FirstOrDefault().Key;
                }
                foreach (ItemTypes month in months)
                {
                    // IEnumerable<dynamic> xdyn = data;
                    KeyValuePair<int, string> monthDicationaryItem = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault();
                    // if the start month is less than the end month get all the values greater than or equal to start AND less than or equal to end, ex. 6 <= x >= 10
                    // if the start month is greater than the end month get all the values greater than or equal to start OR less than or equal to end, ex. 10 <= x; 2 >= x
                    if (
                        // xdyn.Count() >0 &&
                        !monthDicationaryItem.Equals(default(KeyValuePair<int, string>)) &&
                            ((startMonthValue <= endMonthValue && monthDicationaryItem.Key >= startMonthValue && monthDicationaryItem.Key <= endMonthValue) ||
                            (startMonthValue > endMonthValue && (monthDicationaryItem.Key >= startMonthValue || monthDicationaryItem.Key <= endMonthValue))))
                    {
                        // add to the existing sum and increment the count one
                        //   if (data[0].GetType().GetProperty(monthDicationaryItem.Value).GetValue(data[0]) != null)
                        {
                            statData[monthDicationaryItem.Key - 1, 0] += data.Count > 0 ?
                                (decimal)data[0].GetType().GetProperty(monthDicationaryItem.Value)
                                .GetValue(data[0], null) : 0;

                            statData[monthDicationaryItem.Key - 1, 1]++;
                        }
                    }
                }
            }

            string jsonResult = "{";

            for (int i = 0; i < months.Count; i++)
            {
                // if a month does not include any data (based on count) do not include it so that the existing target data will be kept
                if (statData[i, 1] != 0)
                {
                    jsonResult += "'" + months[i].ItemTypeDisplayName.ToLower() + "': { sum:" + statData[i, 0] + ",count:" + statData[i, 1] + " },";
                }
            }

            jsonResult += "}";

            JObject statisticsObj = JObject.Parse(jsonResult);
            return statisticsObj;
        }

        private JObject CombineGroupResults(List<opForecastResults> results, List<ItemTypes> months)
        {
            // this will hold data in the format [sum, count]
            decimal[,] statData = new decimal[12, 2];
            foreach (ItemTypes month in months)
            {
                KeyValuePair<int, string> monthDicationaryItem = monthDictionary.Where(kvp => kvp.Value.ToUpper().Contains(month.ItemTypeCode.ToUpper())).FirstOrDefault();
                foreach (opForecastResults forecastResult in results)
                {
                    if (forecastResult.result[month.ItemTypeCode.ToLower()] != null)
                    {
                        // add to the existing sum and existing count
                        statData[monthDicationaryItem.Key - 1, 0] += (decimal)forecastResult.result[month.ItemTypeCode.ToLower()]["sum"];
                        statData[monthDicationaryItem.Key - 1, 1] += (decimal)forecastResult.result[month.ItemTypeCode.ToLower()]["count"];
                    }
                }
            }
            string jsonResult = "{";

            for (int i = 0; i < months.Count; i++)
            {
                // if a month does not include any data (based on count) do not include it so that the existing target data will be kept
                if (statData[i, 1] != 0)
                {
                    jsonResult += "'" + months[i].ItemTypeDisplayName.ToLower() + "': { sum:" + statData[i, 0] + ",count:" + statData[i, 1] + " },";
                }
            }

            // add the ratio and driver dimensions to the return value if they exist
            if (results[0].result["ratio"] != null)
            {
                jsonResult += "'ratio': " + results[0].result["ratio"] + ",";
                jsonResult += "'seasonality': " + ((string)results[0].result["seasonality"]).ToLower() + ",";
                jsonResult += "'forecastType': '" + results[0].result["forecastType"] + "',";
                jsonResult += "'targetStartDate': '" + results[0].result["targetStartDate"] + "',";
                jsonResult += "'targetEndDate': '" + results[0].result["targetEndDate"] + "',";
                jsonResult += "'sourceInfo': " + results[0].result["sourceInfo"] + ",";
                if (results[0].result["driverDimensionRow"]["statistic"] != null && results[0].result["driverDimensionRow"]["statistic"].ToString() != "")
                {
                    jsonResult += "'driverDimensionRow': { 'entity': " + results[0].result["driverDimensionRow"]["entity"] + ",'department': " + results[0].result["driverDimensionRow"]["department"] + ", 'statistic': " + results[0].result["driverDimensionRow"]["statistic"] + "}";
                }
                else if (results[0].result["driverDimensionRow"]["generalLedger"] != null && results[0].result["driverDimensionRow"]["generalLedger"].ToString() != "")
                {
                    jsonResult += "'driverDimensionRow': { 'entity': " + results[0].result["driverDimensionRow"]["entity"] + ",'department': " + results[0].result["driverDimensionRow"]["department"] + ", 'generalLedger': " + results[0].result["driverDimensionRow"]["generalLedger"] + "}";
                }
                else
                {
                    jsonResult += "'driverDimensionRow': { 'entity': " + results[0].result["driverDimensionRow"]["entity"] + ",'department': " + results[0].result["driverDimensionRow"]["department"] + ", 'jobCode': " + results[0].result["driverDimensionRow"]["jobCode"] + ", 'payType': " + results[0].result["driverDimensionRow"]["payType"] + "}";
                }
            }

            jsonResult += "}";

            JObject statisticsObj = JObject.Parse(jsonResult);
            return statisticsObj;
        }

        private async Task<List<Entities>> CheckEntityGroup(string entityID, List<Entities> returnList)
        {
            if (entityID == "all")
            {
                Operations.opEntities opEntities = new Operations.opEntities();
                // return all non group statistics

                //returnList = await opEntities.GetAllNonGroupEntities(_context);
                returnList = AllEnt.Where(f => f.isGroup == false).ToList();
            }
            else
            {
                Operations.opEntities opEntities = new Operations.opEntities();
                // var entity = await _context.Entities.FindAsync(int.Parse(entityID));
                var entity = AllEnt.Where(f => f.EntityID == (int.Parse(entityID))).FirstOrDefault();

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
            if (departmentID == "all")
            {
                Operations.opDepartments opDepartments = new Operations.opDepartments();
                // return all non group statistics

                //returnList = await opDepartments.GetAllNonGroupDepartments(_context);
                returnList = AllDept.Where(e => e.IsGroup == false && e.IsMaster == false).ToList();

            }
            else
            {
                Operations.opDepartments opDepartments = new Operations.opDepartments();
                // var department = await _context.Departments.FindAsync(int.Parse(departmentID));
                var department = AllDept.Where(x => x.DepartmentID == int.Parse(departmentID)).FirstOrDefault();

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
            }

            return returnList;
        }

        private async Task<List<StatisticsCodes>> CheckStatisticsCodeGroup(string statisticsCodeID, List<StatisticsCodes> returnList)
        {
            Operations.opStatisticsCodes opStatisticsCodes = new Operations.opStatisticsCodes();
            //   var _contextInclude = opStatisticsCodes.getopStatisticsCodesContext(_context);

            // if it is a mapping value it will be looked up later because it only applies to the specific entity/department combination
            // doing the lookup here would cause it to get paired with every combination instead
            if (statisticsCodeID == "primary" || statisticsCodeID == "secondary" || statisticsCodeID == "tertiary")
            {
                return null;
            }

            if (statisticsCodeID == "all")
            {
                // return all non group statistics
                //   returnList = await opStatisticsCodes.GetAllNonGroupStatistics(_context);
                returnList = AllStatsCodes.Where(e => e.IsGroup == false && e.IsMaster == false).ToList();
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
            if (glAccountID == "all")
            {
                Operations.opGLAccounts opGLAccounts = new Operations.opGLAccounts();
                // return all non group statistics
                // returnList = await opGLAccounts.GetAllNonGroupGLAccounts(_context);
                returnList = AllGLAccounts.Where(e => e.IsGroup == false && e.IsMaster == false).ToList();
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
            }

            return returnList;
        }

        private async Task<List<JobCodes>> CheckJobCodeGroup(string jobCodeID, List<JobCodes> returnList)
        {
            if (jobCodeID == "all")
            {
                Operations.opJobCodes opJobCodes = new Operations.opJobCodes();
                // return all non group statistics
                // returnList = await opJobCodes.GetAllNonGroupJobCodes(_context);
                returnList = AllJobCodes.Where(e => e.IsGroup == false && e.IsMaster == false).ToList();
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
            if (payTypeID == "all")
            {
                Operations.opPayTypes opPayTypes = new Operations.opPayTypes();
                // return all non group statistics
                ///returnList = await opPayTypes.GetAllNonGroupPayTypes(_context);
                returnList = AllPayTypes.Where(e => e.IsGroup == false && e.IsMaster == false).ToList();

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

        private List<StatisticsCodes> CheckMappedStatistics(List<StatisticsCodes> statisticsList, ForecastSection section, string statisticLocation, string entityID, string departmentID)
        {
            // if statistics is null it is using a mapping value that needs to be looked up otherwise just return
            if (statisticsList == null)
            {
                string statisticValue = "";
                switch (statisticLocation)
                {
                    case "source":
                        statisticValue = section.source.dimensionRow.statistic;
                        break;
                    case "target":
                        statisticValue = section.target.dimensionRow.statistic;
                        break;
                    case "sourceNumerator":
                        statisticValue = section.source.dimensionRow.numerator.statistic;
                        break;
                    case "sourceDenominator":
                        statisticValue = section.source.dimensionRow.denominator.statistic;
                        break;
                    case "targetNumerator":
                        statisticValue = section.target.dimensionRow.numerator.statistic;
                        break;
                    case "targetDenominator":
                        statisticValue = section.target.dimensionRow.denominator.statistic;
                        break;
                }

                Operations.opStatisticsMapping opStatisticsMapping = new Operations.opStatisticsMapping();
                // look up the mapped value
                statisticsList = new List<StatisticsCodes> { opStatisticsMapping.GetStatisticsMapping(entityID, departmentID, statisticValue, _context) };
            }

            return statisticsList;
        }

        private async Task<bool> CheckForDimensionsLoop(JObject originalValue, int budgetVersionID, int entityID, int departmentID, int? statisticsID, int? generalLedgerID, int? jobCodeID, int? payTypeID, List<ParsedSectionData> parsedSectionDataList, string forecastType)
        {
            Operations.opBudgetVersionStatistics opStatistics = new Operations.opBudgetVersionStatistics();
            Operations.opBudgetVersionGLAccounts opGLAccounts = new Operations.opBudgetVersionGLAccounts();
            Operations.opBudgetVersionStaffing opStaffing = new Operations.opBudgetVersionStaffing();
            dynamic data = null;
            int? dimensionsRow = 0;
            if (statisticsID != null)
            {
                //var context = opBudgetVersionStatistics.getContext(_context);
                // context.Dimensions.Include(a => a.StatisticsCode);
                // data = await opStatistics.getStatistics(budgetVersionID, entityID.ToString(), departmentID.ToString(), statisticsID.ToString(), context);
                data = await opStatistics.getStatistics(budgetVersionID, entityID.ToString(), departmentID.ToString(), statisticsID.ToString(), BVSTSource.SelectMany(f => f).ToList());
            }
            else if (generalLedgerID != null)
            {
                // var context = opBudgetVersionGLAccounts.getContext(_context);
                // context.Dimensions.Include(a => a.GLAccount);
                //  data = await opGLAccounts.getGLAccounts(budgetVersionID, entityID.ToString(), departmentID.ToString(), generalLedgerID.ToString(), context);
                data = await opGLAccounts.getGLAccounts(budgetVersionID, entityID.ToString(), departmentID.ToString(), generalLedgerID.ToString(), BVGLSource.SelectMany(f => f).ToList());
            }
            else
            {
                // var context = opBudgetVersionStaffing.getContext(_context);
                // context.Dimensions.Include(a => a.JobCode);
                // context.Dimensions.Include(a => a.PayType);
                // data = await opStaffing.getStaffing(budgetVersionID, entityID.ToString(), departmentID.ToString(), jobCodeID.ToString(), payTypeID.ToString(), forecastType, context);
                data = await opStaffing.getStaffing(budgetVersionID, entityID.ToString(), departmentID.ToString(), jobCodeID.ToString(), payTypeID.ToString(), forecastType, BVSFSource.SelectMany(f => f).ToList());
            }

            if (data != null && data.Count != 0)
            {
                Dimensions dimension = data[0].GetType().GetProperty("DimensionsRowID").GetValue(data[0], null);
                dimensionsRow = dimension?.DimensionsID;
                // if there is no dimensionsRow then you have reached the end and there is no loop
                if (dimensionsRow == null || dimensionsRow == 0)
                {
                    // check the other pairs being added in case the next step is also being added
                    foreach (ParsedSectionData parsedSectionData in parsedSectionDataList)
                    {
                        List<ParsedSectionDimensionPairings> newMatchingDimensions = new List<ParsedSectionDimensionPairings>();
                        if (statisticsID != null)
                        {
                            newMatchingDimensions = parsedSectionData.parsedSectionDimensionPairings.Where(p => (p.targetDimensionRow?.entity == entityID.ToString() && p.targetDimensionRow?.department == departmentID.ToString() && p.targetDimensionRow?.statistic == statisticsID.ToString()) || (p.targetNumeratorDimensionRow?.entity == entityID.ToString() && p.targetNumeratorDimensionRow?.department == departmentID.ToString() && p.targetNumeratorDimensionRow?.statistic == statisticsID.ToString())).ToList();
                        }
                        else if (generalLedgerID != null)
                        {
                            newMatchingDimensions = parsedSectionData.parsedSectionDimensionPairings.Where(p => (p.targetDimensionRow?.entity == entityID.ToString() && p.targetDimensionRow?.department == departmentID.ToString() && p.targetDimensionRow?.generalLedger == generalLedgerID.ToString()) || (p.targetNumeratorDimensionRow?.entity == entityID.ToString() && p.targetNumeratorDimensionRow?.department == departmentID.ToString() && p.targetNumeratorDimensionRow?.generalLedger == generalLedgerID.ToString())).ToList();

                        }
                        else
                        {
                            newMatchingDimensions = parsedSectionData.parsedSectionDimensionPairings.Where(p => (p.targetDimensionRow?.entity == entityID.ToString() && p.targetDimensionRow?.department == departmentID.ToString() && p.targetDimensionRow?.jobCode == jobCodeID.ToString() && p.targetDimensionRow?.payType == payTypeID.ToString()) || (p.targetNumeratorDimensionRow?.entity == entityID.ToString() && p.targetNumeratorDimensionRow?.department == departmentID.ToString() && p.targetNumeratorDimensionRow?.jobCode == jobCodeID.ToString() && p.targetNumeratorDimensionRow?.payType == payTypeID.ToString())).ToList();
                        }
                        // for each matching dimension and each source compare to the original values, if found a loop will be created by inserting multiple steps
                        foreach (var newDimension in newMatchingDimensions)
                        {
                            foreach (DataRowWithID sourceBudget in parsedSectionData.sourceBudgetInfo)
                            {
                                // copy and annualization values will be in sourceDimensionRow and ratios will be in targetDenominatorRow
                                if ((newDimension.sourceDimensionRow != null &&
                                    sourceBudget.budgetVersionID == int.Parse((string)originalValue["budgetVersionID"]) &&
                                    newDimension.sourceDimensionRow.entity == (string)originalValue["entityID"] &&
                                    newDimension.sourceDimensionRow.department == (string)originalValue["departmentID"] &&
                                    newDimension.sourceDimensionRow.statistic == (string)originalValue["statisticsCodeID"] &&
                                    newDimension.sourceDimensionRow.generalLedger == (string)originalValue["generalLedgerID"] &&
                                    newDimension.sourceDimensionRow.jobCode == (string)originalValue["jobCodeID"] &&
                                    newDimension.sourceDimensionRow.payType == (string)originalValue["payTypeID"])
                                    || (newDimension.targetDenominatorDimensionRow != null &&
                                    sourceBudget.budgetVersionID == int.Parse((string)originalValue["budgetVersionID"]) &&
                                    newDimension.targetDenominatorDimensionRow.entity == (string)originalValue["entityID"] &&
                                    newDimension.targetDenominatorDimensionRow.department == (string)originalValue["departmentID"] &&
                                    newDimension.targetDenominatorDimensionRow.statistic == (string)originalValue["statistiscCodeID"] &&
                                    newDimension.targetDenominatorDimensionRow.generalLedger == (string)originalValue["generalLedgerID"] &&
                                    newDimension.targetDenominatorDimensionRow.jobCode == (string)originalValue["jobCodeID"] &&
                                    newDimension.targetDenominatorDimensionRow.payType == (string)originalValue["payTypeID"]))
                                {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
                else
                {
                    // if the original values are found this would create a loop
                    if (dimension.BudgetVersion.BudgetVersionID == int.Parse((string)originalValue["budgetVersionID"]) &&
                                dimension.Entity.EntityID == int.Parse((string)originalValue["entityID"]) &&
                                dimension.Department.DepartmentID == int.Parse((string)originalValue["departmentID"]) &&
                                dimension.StatisticsCode?.StatisticsCodeID == StringToNullableInt((string)originalValue["statisticsCodeID"]) &&
                                dimension.GLAccount?.GLAccountID == StringToNullableInt((string)originalValue["generalLedgerID"]) &&
                                dimension.JobCode?.JobCodeID == StringToNullableInt((string)originalValue["jobCodeID"]) &&
                                dimension.PayType?.PayTypeID == StringToNullableInt((string)originalValue["payTypeID"]))
                    {
                        return true;
                    }
                    else
                    {
                        // if there are multiple sources they are stored as children of the first source, check the children for loops as well
                        if (dimension.ChildID != null)
                        {
                            foreach (string childID in dimension.ChildID.Split(','))
                            {
                                Dimensions dimension2 = await _context.Dimensions.FindAsync(int.Parse(childID));
                                if (await CheckForDimensionsLoop(originalValue, dimension2.BudgetVersion.BudgetVersionID, dimension2.Entity.EntityID, dimension2.Department.DepartmentID, dimension2.StatisticsCode?.StatisticsCodeID, dimension2.GLAccount?.GLAccountID, dimension2.JobCode?.JobCodeID, dimension2.PayType?.PayTypeID, parsedSectionDataList, forecastType))
                                {
                                    return true;
                                }
                            }
                        }

                        // call again with the new set of dimensions to check the next step
                        return await CheckForDimensionsLoop(originalValue, dimension.BudgetVersion.BudgetVersionID, dimension.Entity.EntityID, dimension.Department.DepartmentID, dimension.StatisticsCode?.StatisticsCodeID, dimension.GLAccount?.GLAccountID, dimension.JobCode?.JobCodeID, dimension.PayType?.PayTypeID, parsedSectionDataList, forecastType);
                    }
                }
            }

            return false;
        }

        private int? StringToNullableInt(string input)
        {
            int intValue;
            if (int.TryParse(input, out intValue)) return intValue;
            return null;
        }

        private bool checkAllZero(JObject results)
        {
            double sum = 0;
            foreach (KeyValuePair<string, JToken> stat in results)
            {
                sum += (double)results[stat.Key]["sum"];

            }
            if (sum > 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
}
