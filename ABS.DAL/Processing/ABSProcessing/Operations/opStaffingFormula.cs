using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Operations
{
    public class opStaffingFormula
    {
        public static void ParseSFSectionsValues(List<ABS.DBModels.Processing.ForecastSection> allforecastSections)
        {
            Console.WriteLine("Scenario Type : STAFFING");

             
            foreach (var item in allforecastSections)
            {
                bool IncludeThisSectioninProcessing = bool.Parse(item.included.ToString());
                bool AutoUpdateThisSection = bool.Parse(item.automaticallyUpdate.ToString());
                double PercentChange = double.Parse(item.percentChange.ToString());
                string spreadMethods = item.spreadMethod.ToString();

                if (!IncludeThisSectioninProcessing)
                {
                    continue;
                }

                var forecasttype = new Dictionary<string, Func<string>>()

                {
                    { "copy_staffing_hours", opStaffingFormula.SFHoursCopyFOrmula},
                    { "copy_staffing_dollars", opStaffingFormula.SFDollarsCopyFOrmula},
                    { "annualize_staffing_hours", opStaffingFormula.SFAnnualizationHoursFOrmula},
                    { "annualize_staffing_dollars", opStaffingFormula.SFAnnualizationDollarsFOrmula},
                    { "ratio_staffing_hours_statistics", opStaffingFormula.SFRatioStatisticsStaffingFOrmula},
                    { "staffing_average_wage_rate", opStaffingFormula.SFWageRateFOrmula},
                    { "staffing_pay_type_distribution", opStaffingFormula.SFPayTypeDistributionFOrmula}

                };

                if (forecasttype.ContainsKey(item.forecastType))
                    forecasttype[item.forecastType].Invoke();

            }

        }
        public static string SFPayTypeDistributionFOrmula()
        {

            Console.WriteLine("Formula: Staffing Pay Type Distribution Formuala");
            return "";
        }

        public static string SFWageRateFOrmula()
        {

            Console.WriteLine("Formula: Staffing Wage Rate Formuala");
            return "";
        }
        public static  string SFRatioStatisticsStaffingFOrmula()
        {

            Console.WriteLine("Formula: Staffing Statistics Staffing Formuala");
            return "";
        }

        public static string SFAnnualizationHoursFOrmula()
        {
            Console.WriteLine("Formula: Staffing Annualization Hours Formuala");
            return "";
        }
        public static string SFAnnualizationDollarsFOrmula()
        {
            Console.WriteLine("Formula: Staffing Annualization Dollars Formuala");
            return "";
        }

        public static string SFHoursCopyFOrmula()
        {
            // await Task.Delay(1);
            Console.WriteLine("Formula: Staffing Hours Copy Formuala");

            return "";
        }
        public static string SFDollarsCopyFOrmula()
        {
            // await Task.Delay(1);
            Console.WriteLine("Formula: Staffing Hours Copy Formuala");

            return "";
        }

        
    }
}
