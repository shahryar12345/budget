using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("ForecastSteps")]
    public class ForecastSteps : IModels
    {
        [Key]
        public int ForecastStepID { get; set; }
        public int ForecastStepOrder { get; set; }
        public virtual ForecastModels ForecastModel { get; set; }
        public virtual ItemTypes ForecastStepType { get; set; }
        public virtual ItemTypes SourceScenarioType { get; set; }
        public virtual BudgetVersions SourceBudgetVersion { get; set; }
        public virtual Entities SourceEntity { get; set; }
        public bool? UseEntityGroupTotal { get; set; }
        public virtual Departments SourceDepartment { get; set; }
        public bool? UseDepartmentGroupTotal { get; set; }
        public virtual StatisticsCodes SourceStatisticCode { get; set; }
        public bool? UseStatisticGroupTotal { get; set; }
        public virtual Entities TargetEntity { get; set; }        
        public virtual Departments TargetDepartment { get; set; }
        public virtual StatisticsCodes TargetStatisticCode { get; set; }
        public virtual ItemTypes TargetScenarioType { get; set; }
        public virtual BudgetVersions TargetBudgetVersion { get; set; }
        public decimal? PercentageChangeValue { get; set; }
        public string SpreadMethod { get; set; }
        public int? NumberOfMonths { get; set; }
        public bool? MaintainSeasonality { get; set; }

        public Guid? Identifier { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdateBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public byte[] RowVersion { get; set; }
    }
}
