using ABS.DBModels.Models.Reporting;
using ABSProcessing.Context;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using ABS.DBModels;
using System.Linq.Expressions;
using System.IO;

namespace ABSProcessing.Operations
{
    internal class opReports
    {
        public IServiceScopeFactory ServiceScopeFactory { get; }
        public List<ReportConfig> repconf { get; set; } = new List<ReportConfig>();
        public Dictionary<int, List<string>> lstBV { get; set; } = new Dictionary<int, List<string>>();
        public Dictionary<int, List<string>> lstent { get; set; } = new Dictionary<int, List<string>>();
        public Dictionary<int, List<string>> lstdept { get; set; } = new Dictionary<int, List<string>>();
        public Dictionary<int, List<string>> lststatcode { get; set; } = new Dictionary<int, List<string>>();
        public Dictionary<int, List<string>> lstGLAcc { get; set; } = new Dictionary<int, List<string>>();
        public Dictionary<int, List<string>> lstJC { get; set; } = new Dictionary<int, List<string>>();
        public Dictionary<int, List<string>> lstPT { get; set; } = new Dictionary<int, List<string>>();
        public Dictionary<int, List<BudgetVersionGLAccounts>> lstAllGLBVData { get; set; } = new Dictionary<int, List<BudgetVersionGLAccounts>>();
        public Dictionary<int, List<BudgetVersionStaffing>> lstAllSFBVData { get; set; } = new Dictionary<int, List<BudgetVersionStaffing>>();
        public Dictionary<int, List<BudgetVersionStatistics>> lstAllSTBVData { get; set; } = new Dictionary<int, List<BudgetVersionStatistics>>();
        public Dictionary<int, List<BudgetVersionGLAccounts>> GLFinalOutput { get; set; } = new Dictionary<int, List<BudgetVersionGLAccounts>>();
        public Dictionary<int, List<BudgetVersionStaffing>> SFFinalOUtput { get; set; } = new Dictionary<int, List<BudgetVersionStaffing>>();
        public Dictionary<int, List<BudgetVersionStatistics>> STFinalOutput { get; set; } = new Dictionary<int, List<BudgetVersionStatistics>>();

        public ReportingDimensions CurrentreportingDimensions { get; set; }
        public string reportData { get; set; }
        public string reportpath { get; set; }

        public BudgetingContext _context { get; set; }


        public opReports(IServiceScopeFactory _ServiceScopeFactory)
        {
            ServiceScopeFactory = _ServiceScopeFactory;
        }



        public async Task<string> ProcessReports(List<ReportOutputConfiguration> reportConfiguration, Guid identifier)
        {
            if (reportConfiguration is null)
            {
                return "Report Configuration Error";
            }

            /*
                1.	API to accept Report Data (Configuration set by User)
                    a.	Parse Inputs
                    b.	Generate Database Query
                    c.	Query Database
                    d.	Collect Data
                    e.	Do the calculations (if required)
                    f.	Generate Output Data
                2.	Generate Output file
                    a.	API to generate user specific file format report 
                    b.	Encoder for different FileTypes

                3.	Store in Database/Desired Path

             */
            using (var scope = ServiceScopeFactory.CreateScope())
            {

                var dbContext = scope.ServiceProvider.GetService<BudgetingContext>();
                _context = dbContext;

                foreach (var item in reportConfiguration)
                {
                    try
                    {

                        var requestOptions = await ParseInputs(reportConfiguration);
                        if (requestOptions)
                        {
                            CurrentreportingDimensions = await UPdateReportStatus("Creating", item, _context);
                        }

                        var dbQuery = await GenerateQueryElements();
                        if (dbQuery)
                        {
                            CurrentreportingDimensions = await UPdateReportStatus("Fetching data", item, _context);

                        }

                        bool DBresults = await ExecuteDBQuery();
                        if (DBresults)
                        {
                            CurrentreportingDimensions = await UPdateReportStatus("Updating", item, _context);

                        }
                        bool FilterDataDBresults = await FilterQueryResults();
                        if (FilterDataDBresults)
                        {
                            CurrentreportingDimensions = await UPdateReportStatus("Generating file(s)", item, _context);

                        }





                        bool ResultFile = await GenerateOuptFile();
                        if (ResultFile)
                        {

                            CurrentreportingDimensions = await UPdateReportStatus("File(s) generated", item, _context, reportpath, reportpath, reportData, true);

                        }

                        //var StoreResultFile = SendtoFolder();
                        //var StoreResultDB = SendtoDB();
                        CurrentreportingDimensions = await UPdateReportStatus("Created", item, _context);

                        await opBGJobs.UpdateBGJobs("SUCCESS", identifier, _context);
                        Console.WriteLine("Process Completed!!");
                    }
                    catch (Exception ex)
                    {

                        Console.WriteLine(ex);
                        await UPdateReportStatus("Failed", item, _context);
                        await opBGJobs.UpdateBGJobs("Failed", identifier, _context);


                    }
                }


                await Task.Delay(1);
                return "";
            }
        }

        private async Task<bool> GenerateOuptFile()
        {
            await Task.Delay(1);

            Console.WriteLine("Generating output file");

            if (STFinalOutput.Count > 0)
            {
                foreach (var item in STFinalOutput)
                {
                    var LstData = STFinalOutput[item.Key];
                    var lstfinaout = LstData.Select(f => new
                    {
                        f.StatisticID
                    ,
                        f.BudgetVersion.Code
                    ,
                        f.TimePeriodID.TimePeriodCode
                    ,
                        f.DataScenarioDataID.DataScenarioCode
                    ,
                        f.DataScenarioTypeID.ItemTypeCode
                    ,
                        f.Entity.EntityCode
                    ,
                        f.Department.DepartmentCode
                    ,
                        f.StatisticsCodes.StatisticsCode
                    ,
                        f.January
                    ,
                        f.February
                    ,
                        f.March
                    ,
                        f.April
                    ,
                        f.May
                    ,
                        f.June
                    ,
                        f.July
                    ,
                        f.August
                    ,
                        f.September
                    ,
                        f.October
                    ,
                        f.November
                    ,
                        f.December

                    }).AsQueryable();



                    var csvstring = HelperFunctions.ConvertLINQResultsToCSV(lstfinaout, "|");
                    Console.WriteLine(csvstring);
                    reportData = csvstring;

                    var path = getfilepath();
                    if (!CreateoutputFile(csvstring, path))
                        { return false; }



                }
            }
            else { }
            if (GLFinalOutput.Count > 0)
            {
                foreach (var item in GLFinalOutput)
                {

                    var csvstring = HelperFunctions.ConvertLINQResultsToCSV(GLFinalOutput[item.Key].AsQueryable(), "|");
                    Console.WriteLine(csvstring);
                    reportData = csvstring;

                    var path = getfilepath();
                    if (!CreateoutputFile(csvstring, path))
                    { return false; }

                }
            }
            else { }
            if (SFFinalOUtput.Count > 0)
            {
                foreach (var item in SFFinalOUtput)
                {

                    var csvstring = HelperFunctions.ConvertLINQResultsToCSV(SFFinalOUtput[item.Key].AsQueryable(), "|");
                    Console.WriteLine(csvstring);
                    reportData = csvstring;

                    var path = getfilepath();
                    if (!CreateoutputFile(csvstring, path))
                    { return false; }

                }
            }
            else { }


            return true;

        }

        private string getfilepath()
        {
            if (!Directory.Exists("data")) { Directory.CreateDirectory("data"); }
            reportpath = @"data\" + "" + CurrentreportingDimensions.Code + "_" + DateTime.UtcNow.ToString("yyyyMMddhhmmss") + "" + ".csv";

            string path = Path.Combine(Environment.CurrentDirectory, reportpath);

            return path;
        }

        private bool CreateoutputFile(string csvstring, string path)
        {
            try
            {
                using FileStream fs = File.Create(reportpath);
                using var sr = new StreamWriter(fs);

                sr.WriteLine(csvstring);

                sr.Flush();
                sr.Close();
                sr.Dispose();
                //fs.Flush();
                fs.Close();
                fs.Dispose();
                return true;
            }
            catch (Exception)
            {
                Console.WriteLine("Error File Saving: ");
                return false;
            }
        }

        private async Task<bool> ExecuteDBQuery()
        {
            try
            {
                await Task.Delay(1);
                Console.WriteLine("Execute DB Query");
                foreach (var rc in repconf)
                {
                    var bvs = lstBV[rc.ReportingDimensionsID];
                    if (rc.scenarioType.ToUpper() == "ST")
                    {

                        var xdata = await _context.BudgetVersionStatistics

                            .Where(f =>
                        bvs.Contains(f.BudgetVersion.BudgetVersionID.ToString())
                        && f.IsActive == true
                        && f.IsDeleted == false
                        )
                            .Include(f => f.BudgetVersion)
                            .Include(f => f.Entity)
                            .Include(f => f.Department)
                            .Include(f => f.StatisticsCodes)
                            .Include(f => f.TimePeriodID)
                            .Include(f => f.DataScenarioDataID)
                            .Include(f => f.DataScenarioTypeID)
                            .ToListAsync();

                        lstAllSTBVData.Add(rc.ReportingDimensionsID, xdata);
                    }
                    else
                        if (rc.scenarioType.ToUpper() == "SF")
                    {
                        var xdata = await _context.BudgetVersionStaffing.Where(f =>
                           bvs.Contains(f.BudgetVersion.BudgetVersionID.ToString())
                           && f.IsActive == true
                           && f.IsDeleted == false
                           )
                            .Include(f => f.BudgetVersion)
                            .Include(f => f.Entity)
                            .Include(f => f.Department)
                            .Include(f => f.JobCode)
                            .Include(f => f.PayType)
                            .Include(f => f.TimePeriodID)
                            .Include(f => f.DataScenarioID)
                            .Include(f => f.DataScenarioTypeID)
                            .ToListAsync();

                        lstAllSFBVData.Add(rc.ReportingDimensionsID, xdata);
                    }
                    else
                        if (rc.scenarioType.ToUpper() == "GL")
                    {

                        var xdata = await _context.BudgetVersionGLAccounts.Where(f =>
                           bvs.Contains(f.BudgetVersion.BudgetVersionID.ToString())
                           && f.IsActive == true
                           && f.IsDeleted == false
                           )
                            .Include(f => f.BudgetVersion)
                            .Include(f => f.Entity)
                            .Include(f => f.Department)
                            .Include(f => f.GLAccount)
                            .Include(f => f.TimePeriodID)
                            .Include(f => f.DataScenarioDataID)
                            .Include(f => f.DataScenarioTypeID)
                            .ToListAsync();

                        lstAllGLBVData.Add(rc.ReportingDimensionsID, xdata);
                    }
                    else
                    { }

                }

                return true;

            }
            catch (Exception ex)
            {

                Console.WriteLine("ExecuteDBQuery : " + ex);
                return false;
            }


        }
        private async Task<bool> FilterQueryResults()
        {
            try
            {
                await Task.Delay(1);
                Console.WriteLine("Filter Query Results");

                foreach (var rc in repconf)
                {

                    if (rc.scenarioType == "ST")
                    {
                        var xdata = lstAllSTBVData[rc.ReportingDimensionsID];




                        if (rc.entity.ConfigOptionDetail.Count == 1 && rc.entity.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lstent.Add(rc.ReportingDimensionsID, rc.entity.ConfigOptionDetail.ToList());
                            xdata = xdata.Where(f => lstent[rc.ReportingDimensionsID].Contains(f.Entity.EntityID.ToString())).ToList();

                        }


                        if (rc.department.ConfigOptionDetail.Count == 1 && rc.department.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lstdept.Add(rc.ReportingDimensionsID, rc.department.ConfigOptionDetail.ToList());
                            xdata = xdata.Where(f => lstdept[rc.ReportingDimensionsID].Contains(f.Department.DepartmentID.ToString())).ToList();

                        }



                        if (rc.statistics.ConfigOptionDetail.Count == 1 && rc.statistics.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lststatcode.Add(rc.ReportingDimensionsID, rc.statistics.ConfigOptionDetail.ToList());


                            xdata = xdata.Where(f => lststatcode[rc.ReportingDimensionsID].Contains(f.StatisticsCodes.StatisticsCodeID.ToString())).ToList();

                        }
                        var periodsdata = await applyPeriods<BudgetVersionStatistics>(xdata, rc);
                        xdata = periodsdata;
                        var measuresdata = await applyMeasures<BudgetVersionStatistics>(xdata, rc);
                        xdata = measuresdata;
                        STFinalOutput.Add(rc.ReportingDimensionsID, xdata);
                    }
                    else
                     if (rc.scenarioType == "GL")
                    {
                        var xdata = lstAllGLBVData[rc.ReportingDimensionsID];

                        if (rc.entity.ConfigOptionDetail.Count == 1 && rc.entity.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lstent.Add(rc.ReportingDimensionsID, rc.entity.ConfigOptionDetail.ToList());
                            xdata = xdata.Where(f => lstent[rc.ReportingDimensionsID].Contains(f.Entity.EntityID.ToString())).ToList();

                        }


                        if (rc.department.ConfigOptionDetail.Count == 1 && rc.department.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lstdept.Add(rc.ReportingDimensionsID, rc.department.ConfigOptionDetail.ToList());
                            xdata = xdata.Where(f => lstdept[rc.ReportingDimensionsID].Contains(f.Department.DepartmentID.ToString())).ToList();

                        }


                        if (rc.glAccounts.ConfigOptionDetail.Count == 1 && rc.glAccounts.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lstGLAcc.Add(rc.ReportingDimensionsID, rc.glAccounts.ConfigOptionDetail.ToList());
                            xdata = xdata.Where(f => lstGLAcc[rc.ReportingDimensionsID].Contains(f.GLAccount.GLAccountID.ToString())).ToList();

                        }

                        var periodsdata = await applyPeriods<BudgetVersionGLAccounts>(xdata, rc);
                        xdata = periodsdata;
                        var measuresdata = await applyMeasures<BudgetVersionGLAccounts>(xdata, rc);
                        xdata = measuresdata;
                        GLFinalOutput.Add(rc.ReportingDimensionsID, xdata);
                    }
                    else
                     if (rc.scenarioType == "SF")
                    {
                        var xdata = lstAllSFBVData[rc.ReportingDimensionsID];

                        if (rc.entity.ConfigOptionDetail.Count == 1 && rc.entity.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lstent.Add(rc.ReportingDimensionsID, rc.entity.ConfigOptionDetail.ToList());
                            xdata = xdata.Where(f => lstent[rc.ReportingDimensionsID].Contains(f.Entity.EntityID.ToString())).ToList();

                        }

                        if (rc.department.ConfigOptionDetail.Count == 1 && rc.department.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lstdept.Add(rc.ReportingDimensionsID, rc.department.ConfigOptionDetail.ToList());
                            xdata = xdata.Where(f => lstdept[rc.ReportingDimensionsID].Contains(f.Department.DepartmentID.ToString())).ToList();

                        }

                        if (rc.jobCodes.ConfigOptionDetail.Count == 1 && rc.jobCodes.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lstJC.Add(rc.ReportingDimensionsID, rc.jobCodes.ConfigOptionDetail.ToList());
                            xdata = xdata.Where(f => lstJC[rc.ReportingDimensionsID].Contains(f.JobCode.JobCodeID.ToString())).ToList();

                        }
                        if (rc.payTypes.ConfigOptionDetail.Count == 1 && rc.payTypes.ConfigOptionDetail.Contains("all"))
                        { }
                        else
                        {
                            lstPT.Add(rc.ReportingDimensionsID, rc.payTypes.ConfigOptionDetail.ToList());
                            xdata = xdata.Where(f => lstPT[rc.ReportingDimensionsID].Contains(f.PayType.PayTypeID.ToString())).ToList();

                        }
                        var periodsdata = await applyPeriods<BudgetVersionStaffing>(xdata, rc);
                        xdata = periodsdata;
                        var measuresdata = await applyMeasures<BudgetVersionStaffing>(xdata, rc);
                        xdata = measuresdata;
                        SFFinalOUtput.Add(rc.ReportingDimensionsID, xdata);
                    }



                }



                return true;

            }
            catch (Exception ex)
            {

                Console.WriteLine("FilterQueryResults : " + ex);
                return false;
            }


        }

        private async Task<List<T>> applyMeasures<T>(List<T> xdata, ReportConfig rc)
        {
            await Task.Delay(1);
            Console.WriteLine("Applying Measures");
            var lstmeasures = rc.measureList.MeasureTypes;

            foreach (var item in lstmeasures)
            {
                if (item.Amount) { } else { }
                if (item.Volumerate) { } else { }

            }



            return xdata;
        }

        private async Task<List<T>> applyPeriods<T>(List<T> xdata, ReportConfig rc)
        {
            await Task.Delay(1);
            Console.WriteLine("Applying Period Filters");


            var lstperiods = rc.periods.PeriodTYpes;
            foreach (var item in lstperiods)
            {

                if (item.month.MonthLists.Count > 0) { } else { }

                if (item.monthsFYTotal) { } else { }
                if (item.currentMonth) { } else { }
                if (item.currentFYTD) { } else { }
                if (item.quartersFYTotal) { } else { }
                if (item.currentQuarter) { } else { }
                if (item.currentQuarterFYTD) { } else { }
                if (item.FYTotal) { } else { }
                if (item.quarter.QuarterList.Count > 0) { } else { }

            }

            return xdata;
        }

        private async Task<bool> GenerateQueryElements()
        {
            try
            {
                await Task.Delay(1);
                Console.WriteLine("Generate Query Elements");
                if (repconf.Count > 0)
                {
                    foreach (var rc in repconf)
                    {

                        lstBV.Add(rc.ReportingDimensionsID, rc.BudgetVersionID != null ? rc.BudgetVersionID.ConfigOptionDetail.ToList() : null);


                    }

                }







                return true;

            }
            catch (Exception ex)
            {

                Console.WriteLine("GEnerateQueryElements : " + ex);
                return false;
            }


        }

        private async Task<bool> ParseInputs(List<ReportOutputConfiguration> reportConfiguration)
        {
            try
            {
                Console.WriteLine("Parsing inputs");
                await Task.Delay(1);

                var lstRepIDs = reportConfiguration.Select(f => f.reportConfigurationID).ToList();

                var allReportingDimensions = await _context._ReportingDimensions
                    .Where(f =>
                lstRepIDs.Contains(f.ReportingDimensionID)

                && f.JsonConfig != null
                && f.JsonConfig != ""
                && f.IsActive == true && f.IsDeleted == false
                ).Select(f => new { f.ReportingDimensionID, f.JsonConfig })
                .ToListAsync();
                foreach (var item in allReportingDimensions)
                {
                    Console.WriteLine(" json config : " + item.JsonConfig);

                    try
                    {

                        var jsonformat = JsonConvert.DeserializeObject<ReportConfig>(item.JsonConfig.ToString());
                        jsonformat.ReportingDimensionsID = item.ReportingDimensionID;
                        repconf.Add(jsonformat);

                    }
                    catch (Exception)
                    {

                        Console.WriteLine("JSON Parsing error for individual item :  " + item.ToString());
                    }

                }


                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Parse Inputs - " + ex);
                return false;
            }
        }

        public static void Dummy(List<ReportOutputConfiguration> reportConfiguration, Guid identifier)
        {
            Console.WriteLine(" @#$%^&*(*&^%$%^&*(*&^%$%^&*(*&^%$ dummy");
        }

        private async static Task<ReportingDimensions> UPdateReportStatus(string status, ReportOutputConfiguration item, BudgetingContext _context, string path = "", string relativePath = "", string reportdata = "", bool updatepath = false)
        {

            await Task.Delay(1);

            var getRecord = await _context._ReportingDimensions
                .Where(f => f.ReportingDimensionID == item.reportConfigurationID)
                .FirstOrDefaultAsync();

            getRecord.ReportProcessingStatus = status;
            getRecord.UpdatedDate = DateTime.UtcNow;

            if (updatepath)
            {
                getRecord.Path = path;
                getRecord.RelatedPath = relativePath;
                getRecord.ReportPath = relativePath;
                getRecord.ReportData = reportdata;


            }


            _context.Entry(getRecord).State = EntityState.Modified;
            await _context.SaveChangesAsync();


            return getRecord;
        }
    }
}