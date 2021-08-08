using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace ABSDAL.Operations
{
    public class StaffingDataMapper
    {
        public List<DepartmentWithJobCodePayType> departmentWithJobCodePayType { get; set; }
        public string entityCode { get; set; }
        public string staffingDataScenarioDescription { get; set; }
        public string staffingDataScenarioTimePeriodName { get; set; }


    }



    public class DepartmentWithJobCodePayType
    {
        public string deptCode { get; set; }
        public List<JobCodeWithPayTypeAbbreviatedIdentifier> jobCodeWithPayTypeAbbreviatedIdentifier { get; set; }
    }


    public class JobCodeWithPayTypeAbbreviatedIdentifier
    {
        public string jobCodeCode { get; set; }
        public string jobCodeColumnLabel { get; set; }
        public string jobCodeDescription { get; set; }
        public List<PayTypeAbbreviatedIdentifier> payTypeAbbreviatedIdentifier { get; set; }
    }

    public class PayTypeAbbreviatedIdentifier
    {
        public List<DataItemValueCombinedIdentifier> dataItemValueCombinedIdentifier { get; set; }
        public string payTypeAccumulateHours { get; set; }
        public string payTypeCode { get; set; }
        public string payTypeColumnLabel { get; set; }
        public string payTypeDescription { get; set; }
    }


    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse); 
    public class DataItemValueCombinedIdentifier
    {
        public string periodValue { get; set; }
        public decimal? timeIncrement { get; set; }
        public decimal? totalHours { get; set; }
        public decimal? totalSalary { get; set; }
    }


   

   
}