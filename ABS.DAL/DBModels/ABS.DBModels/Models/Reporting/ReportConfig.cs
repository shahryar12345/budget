using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.Reporting
{
    public class ReportConfig
    {
        public int ReportingDimensionsID { get; set; }
        public string scenarioType { get; set; }
        public ExtendedOptions BudgetVersionID { get; set; }
        public ExtendedOptions entity { get; set; }
        public ExtendedOptions department { get; set; }
        public ExtendedOptions statistics { get; set; }
        public ExtendedOptions glAccounts { get; set; }
        public ExtendedOptions jobCodes { get; set; }
        public ExtendedOptions payTypes { get; set; }
        public Measures measureList { get; set; }
        public Periods periods { get; set; }

    }

    public enum displaytype
    {
       none,
        reportHeader,
        row,
        column
    }


    public class displayoptions
    {
        public displaytype display { get; set; }
        public bool rowOrder { get; set; }
        public bool colOrder { get; set; }
        public int rowOrderSeq { get; set; }
        public int colOrderSeq { get; set; }

    }

    public class Measures
    {
        public List<measuresType> MeasureTypes { get; set; }
        public displayoptions display { get; set; }

    }
    public class measuresType
    {
        public bool Amount { get; set; }
        public bool Volumerate { get; set; }

        public displayoptions display { get; set; }


    }


    public class ExtendedOptions
    {
        public List<string> ConfigOptionDetail { get; set; }

        public displayoptions display { get; set; }

 
    }
    
    public class Periods
    {
        public List<PeriodTypes> PeriodTYpes { get; set; }

        public displayoptions display { get; set; }

 
    }


    
    public class PeriodTypes
    {

        public bool monthsFYTotal { get; set; }
        public bool currentMonth { get; set; }
        public bool currentFYTD { get; set; }
        public bool quartersFYTotal { get; set; }
        public bool currentQuarter { get; set; }
        public bool currentQuarterFYTD { get; set; }
        public bool FYTotal { get; set; }

        public MonthRange month { get; set; }

        public QuarterRange quarter { get; set; }

    }

    public class MonthRange
    {
        public List<string> MonthLists { get; set; }

        public string startMonth { get; set; }
        public string EndMonth { get; set; }
        public bool includeStartMonth { get; set; }
        public bool includeEndMonth { get; set; }
        public bool OrderByDescending { get; set; }
    }   

    public class QuarterRange
    {
        public List<string> QuarterList { get; set; }
        public string startQuarter { get; set; }
        public string EndQuarter { get; set; }
        public bool OrderByDescending { get; set; }

    }
}
