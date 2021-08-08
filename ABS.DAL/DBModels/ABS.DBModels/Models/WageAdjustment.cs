using System;

namespace ABS.DBModels
{
    public class WageAdjustment
    {
        public string WageAdjustment_budgetversion_id { get; set; }
        public string WageAdjustment_budgetversion_timePeriod_ID { get; set; }


        public WageAdjustmentSection[] WageAdjustmentsections { get; set; }
    }

    public class WageAdjustmentSection
    {
        public DimensionRow dimensionRow { get; set; }
        public decimal percentChange { get; set; }
        public string startMonth { get; set; }
        public string endMonth { get; set; }
    }
}
