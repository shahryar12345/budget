using ABS.DBModels;
using ABSProcessing.Context;
using ABSProcessing.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Operations
{
    public class opStatisticsFormula
    {
        public ApplyForecastMethod ForecastObjectResult { get; set; }

        public BudgetingContext _context;

        List<BudgetVersionStatistics> SourceData = new List<BudgetVersionStatistics>();
        List<BudgetVersionStatistics> TargetData = new List<BudgetVersionStatistics>();
        List<BudgetVersionStatistics> ForecastOutputNew = new List<BudgetVersionStatistics>();
        List<BudgetVersionStatistics> ForecastOutputUpdate = new List<BudgetVersionStatistics>();


        //bool AutoUpdateThisSection = bool.Parse(forecastSection.automaticallyUpdate.ToString());
        //decimal PercentChange = decimal.Parse(forecastSection.percentChange.ToString());
        //string spreadMethods = forecastSection.spreadMethod.ToString();

        //decimal percentChangeMultiplier = GetPercentChangeMultiplier(PercentChange);

        //var srcdim = ForecastObjectResult.AllSourceDimensionRows[forecastSection];
        //var srcdata = ForecastObjectResult.AllSourceDataRows[forecastSection];
        //var targetdata = ForecastObjectResult.AllTargetDataRows[forecastSection];
        //var targetdim = ForecastObjectResult.AllTargetDimensionRows[forecastSection];

        //bool UseGroupTotalEntity = srcdim.entityGroup.GetValueOrDefault();
        //bool UseGroupTotalDepartment = srcdim.departmentsGroup.GetValueOrDefault();
        //bool UseGroupTotalStatisticsCode = srcdim.statisticsGroup.GetValueOrDefault();



        public async Task<bool> ParseSTSectionsValues()
        {
            await Task.Delay(1);
            Console.WriteLine("Scenario Type : STATISTICS");


            foreach (var item in ForecastObjectResult.AllforecastSections)
            {
                bool IncludeThisSectioninProcessing = bool.Parse(item.included.ToString());

                if (!IncludeThisSectioninProcessing)
                {
                    continue;
                }

                var forecasttype = new Dictionary<string, Func<ABS.DBModels.Processing.ForecastSection, Task<bool>>>()

                {
                    { "copy",   StatsCopyFOrmula},
                    { "annualization", StatsAnnualizationFOrmula},
                    { "ratio", StatsRatioFOrmula}

                };

                if (forecasttype.ContainsKey(item.forecastType))
                { await forecasttype[item.forecastType].Invoke(item); }

            }

            return true;
        }


        public async Task<bool> StatsRatioFOrmula(ABS.DBModels.Processing.ForecastSection forecastSection)
        {
            await Task.Delay(1);
            Console.WriteLine("Formula: Statistics Ratio Formuala");
            bool AutoUpdateThisSection = bool.Parse(forecastSection.automaticallyUpdate.ToString());
            double PercentChange = double.Parse(forecastSection.percentChange.ToString());
            string spreadMethods = forecastSection.spreadMethod.ToString();




            return false;
        }

        public async Task<bool> StatsAnnualizationFOrmula(ABS.DBModels.Processing.ForecastSection forecastSection)
        {
            await Task.Delay(1);
            Console.WriteLine("Formula: Statistics Annualization Formuala");
            bool AutoUpdateThisSection = bool.Parse(forecastSection.automaticallyUpdate.ToString());
            double PercentChange = double.Parse(forecastSection.percentChange.ToString());
            string spreadMethods = forecastSection.spreadMethod.ToString();

            return false;
        }

        public async Task<bool> StatsCopyFOrmula(ABS.DBModels.Processing.ForecastSection forecastSection)
        {
            // await Task.Delay(1);
            Console.WriteLine("Formula: Statistics Copy Formuala");
            bool AutoUpdateThisSection = bool.Parse(forecastSection.automaticallyUpdate.ToString());
            decimal PercentChange = decimal.Parse(forecastSection.percentChange.ToString());
            string spreadMethods = forecastSection.spreadMethod.ToString();

            decimal percentChangeMultiplier = GetPercentChangeMultiplier(PercentChange);

            var srcdim = ForecastObjectResult.AllSourceDimensionRows[forecastSection];
            var srcdata = ForecastObjectResult.AllSourceDataRows[forecastSection];
            if (SourceData.Count > 0) { SourceData = new List<BudgetVersionStatistics>(); }
     //       var targetdata = ForecastObjectResult.AllTargetDataRows.ContainsKey( forecastSection) ? ForecastObjectResult.AllTargetDataRows[forecastSection] :  ;
            var targetdim = ForecastObjectResult.AllTargetDimensionRows[forecastSection];

            FillTargetDimensions(targetdim, forecastSection);

            bool UseGroupTotalEntity = srcdim.entityGroup.GetValueOrDefault();
            bool UseGroupTotalDepartment = srcdim.departmentsGroup.GetValueOrDefault();
            bool UseGroupTotalStatisticsCode = srcdim.statisticsGroup.GetValueOrDefault();
            
            foreach (var actdata in ForecastObjectResult.BVSTSource)
            {
                foreach (var item in srcdata)
                {
                    var lstMonths = getMonthstoProcess(item.budgetversion_code, item.startMonth, item.endMonth);
                    var bvid = ForecastObjectResult.AllBV.Where(f => f.Code == item.budgetversion_code).FirstOrDefault();

                    var actualdata = actdata.Where(f => f.BudgetVersion == bvid).ToList();

                    var actualEntities = actualdata.Where(x => ForecastObjectResult.SourceEntities[forecastSection].Contains(x.Entity)).ToList();
                    var actualDepartments = actualEntities.Where(x => ForecastObjectResult.SourceDepartments[forecastSection].Contains(x.Department)).ToList();
                    SourceData = actualDepartments.Where(x => ForecastObjectResult.SourceStatisticsCode[forecastSection].Contains(x.StatisticsCodes)).ToList();
                    Console.WriteLine("Source Data Count: " + SourceData.Count());

                    
                     
                      
                    if (percentChangeMultiplier != 1)
                    {
                        ApplySpreadMethod(lstMonths, percentChangeMultiplier);
                    }

                    //Check Autoupdate
                    if (AutoUpdateThisSection)
                    {

                        ProcessAutoUpdateStatistics();
                    }
                    //check group total
                    ProcessGroupTotal();

                    //check if exists (Insert New)
                    await DBOperations.SaveDBObjectUpdates<BudgetVersionStatistics>(TargetData, false, _context);

                    //check if exists (apply updates)

                }
            }
            return true;
        }

        private void ApplySpreadMethod(List<string> lstMonths, decimal percentChangeMultiplier)
        {

            foreach (var bvstrow in TargetData)
            {
                Console.WriteLine("Applying Spread: " + SourceData.Count());

                foreach (var monthfield in lstMonths)
                {
                    //Check Spread percentage

                    var propval = HelperFunctions.TryGetProperty(bvstrow, monthfield);

                    var x = decimal.Parse(propval.ToString()) * percentChangeMultiplier;

                    var setval = HelperFunctions.TrySetProperty(bvstrow, monthfield, x);
                }

            }
        }

        private   void FillTargetDimensions(List<ABS.DBModels.Processing.DimensionRow> targetdim, ABS.DBModels.Processing.ForecastSection forecastSection)
        {
            //var sdr = ForecastObjectResult.AllSourceDataRows[forecastSection];
            //var sdr =sdr.;

            if (TargetData.Count > 0) { TargetData = new List<BudgetVersionStatistics>(); }
            foreach (var item in targetdim)
            {

               var targetrecord =  new BudgetVersionStatistics();

                targetrecord.Entity = ForecastObjectResult.AllEnt.Where(f=> f.EntityID == int.Parse(item.entity)).FirstOrDefault() ;
                targetrecord.Department = ForecastObjectResult.AllDept.Where(f=> f.DepartmentID == int.Parse(item.department)).FirstOrDefault() ;
                targetrecord.StatisticsCodes = ForecastObjectResult.AllStatsCodes.Where(f=> f.StatisticsCodeID == int.Parse(item.statistic)).FirstOrDefault() ;
                targetrecord.IsActive = true;
                targetrecord.IsDeleted = true;
                targetrecord.CreationDate = DateTime.UtcNow;
                targetrecord.UpdatedDate = DateTime.UtcNow;
                targetrecord.BudgetVersion = ForecastObjectResult.AllBV.Where( f=> f.Code.ToUpper() == ForecastObjectResult.ForecastObject.Forecast_budgetversion_code.ToUpper()).FirstOrDefault();
                targetrecord.TimePeriodID = ForecastObjectResult.AllTimePeriods.Where( f=> f.TimePeriodID  == targetrecord.BudgetVersion.TimePeriodID.TimePeriodID ).FirstOrDefault();
                targetrecord.DataScenarioTypeID = ForecastObjectResult.AllIT.Where( f=> f.ItemTypeCode.ToUpper() == ForecastObjectResult.ForecastObject.forecast_budgetversion_scenario_type_Code.ToUpper()).FirstOrDefault();
                //targetrecord.DataScenarioDataID = ForecastObjectResult.AllDatascenario.Where( f=> f.DataScenarioCode.ToUpper() == ForecastObjectResult.ForecastObject.forecast_budgetversion_scenario_type_Code.ToUpper()).FirstOrDefault();

                TargetData.Add(targetrecord);
            }

         }

        private void ProcessGroupTotal()
        {
            Console.WriteLine("Applying  Group Total ENTITY ");
            Console.WriteLine("Applying  Group Total DEPARTMENT ");
            Console.WriteLine("Applying  Group Total STATISTICS ");

        }

        private void ProcessAutoUpdateStatistics()
        {
            Console.WriteLine("Applying AutoUpdate ");

        }

        private List<string> getMonthstoProcess(string budgetversion_code, string startMonth, string endMonth)
        {
            var bvid = ForecastObjectResult.AllBV.Where(f => f.Code == budgetversion_code).FirstOrDefault();
            var startmonth = ForecastObjectResult.AllIT.Where(f => f.ItemTypeValue == startMonth).FirstOrDefault();
            var endmonth = ForecastObjectResult.AllIT.Where(f => f.ItemTypeValue == endMonth).FirstOrDefault();
            var timeperiod = bvid.TimePeriodID;
            var startYear = timeperiod.FiscalYearID.ItemTypeValue;
            var endyear = timeperiod.FiscalYearEndID.ItemTypeValue;
            var getstartmonthNumber = getMonthNumber(startmonth);
            var getendmonthNumber = getMonthNumber(endmonth);

            var startDate = new DateTime(int.Parse(startYear), getstartmonthNumber, 1);
            var endDate = new DateTime(int.Parse(endyear), getendmonthNumber, 1);
            var totalmonths = CountMonths(startDate, endDate);


            return totalmonths;
        }

        private List<string> CountMonths(DateTime startDate, DateTime endDate)
        {
            List<string> monthnames = new List<string>();
            DateTime setstartdate = startDate;
            var diffMonths = (endDate.Month + endDate.Year * 12) - (startDate.Month + startDate.Year * 12) + 1;
            for (int i = 0; i < diffMonths; i++)
            {
                monthnames.Add(DateTimeFormatInfo.CurrentInfo.GetMonthName(setstartdate.Month));
                setstartdate = setstartdate.AddMonths(1);
            }

            return monthnames;
        }

        private int getMonthNumber(ItemTypes monthdata)
        {
            int monthnumber = DateTime.ParseExact(monthdata.ItemTypeCode, "MMM", CultureInfo.CurrentCulture).Month;
            return monthnumber;
        }

        private decimal GetPercentChangeMultiplier(decimal value)
        {
            var x = value / 100;
            var y = 1 + x;
            return y;

        }


    }
}
