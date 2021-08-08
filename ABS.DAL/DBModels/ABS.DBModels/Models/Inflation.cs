using System;

namespace ABS.DBModels
{
    public class Inflation
    {
        public string Inflation_budgetversion_id { get; set; }
        public string Inflation_budgetversion_timePeriod_ID { get; set; }


        public InflationSection[] Inflationsections { get; set; }
    }

    public class InflationSection
    {
        public DimensionRow dimensionRow { get; set; }
        public decimal percentChange { get; set; }
        public string startMonth { get; set; }
        public string endMonth { get; set; }
    }
}
