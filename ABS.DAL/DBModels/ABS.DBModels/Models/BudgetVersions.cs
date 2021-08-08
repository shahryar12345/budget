using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("BudgetVersions")]
    public class BudgetVersions : IModels
    {
        [Key]
        public int BudgetVersionID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Comments { get; set; }

        public string CalculationStatus { get; set; }
        
        public int?  UserProfileID { get; set; }

        public virtual TimePeriods TimePeriodID { get; set; }
        public virtual ItemTypes fiscalYearID { get; set; }
        public virtual ItemTypes fiscalStartMonthID { get; set; }
        public virtual ItemTypes budgetVersionTypeID { get; set; }
        public virtual ItemTypes scenarioTypeID { get; set; }
        
        //Actua
        public virtual DataScenario ADSstatisticsID { get; set; }
        public virtual DataScenario ADSgeneralLedgerID { get; set; }
        public virtual DataScenario ADSstaffingID { get; set; }

        //Forecast
        public virtual ItemTypes ADSscenarioTypeID { get; set; }
        public virtual ItemTypes ADSbudgetVersionID { get; set; }


        public Guid? Identifier { get ; set ; }
        public DateTime? CreationDate { get ; set ; }
        public DateTime? UpdatedDate { get ; set ; }
        public int? CreatedBy { get ; set ; }
        public int? UpdateBy { get ; set ; }
        public bool? IsActive { get ; set ; }
        public bool? IsDeleted { get ; set ; }
        public byte[] RowVersion { get ; set ; }
    }
}
