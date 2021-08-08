using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Operations
{
    public class opGeneralLedgeFormula
    {

        public static void ParseGLSectionsValues(List<ABS.DBModels.Processing.ForecastSection> allforecastSections)
        {

            Console.WriteLine("Scenario Type : General Ledger");

            
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
                    { "copy", opGeneralLedgeFormula.GLCopyFOrmula},
                    { "annualization", opGeneralLedgeFormula.GLAnnualizationFOrmula},
                    { "ratio", opGeneralLedgeFormula.GLRatioFOrmula},
                    { "ratioGL_Statistics", opGeneralLedgeFormula.GLRatio_StatisticsFormula}

                };

                if (forecasttype.ContainsKey(item.forecastType))
                    forecasttype[item.forecastType].Invoke();

            }


        }

        public static  string GLRatio_StatisticsFormula()
        {

            Console.WriteLine("Formula: GL Ratio Statistics Formuala");
            return "";
        }
        public static  string GLRatioFOrmula()
        {

            Console.WriteLine("Formula: GL Ratio Formuala");
            return "";
        }

        public static  string GLAnnualizationFOrmula()
        {
            Console.WriteLine("Formula: GL Annualization Formuala");
            return "";
        }

        public static  string GLCopyFOrmula()
        {
            // await Task.Delay(1);
            Console.WriteLine("Formula: GL Copy Formuala");

            return "";
        }


      
    }
}
