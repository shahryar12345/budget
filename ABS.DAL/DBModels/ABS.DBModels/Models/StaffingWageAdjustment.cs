using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ABS.DBModels
{
    [Table("StaffingWageAdjustment")]
    public class StaffingWageAdjustment : IModels
    {
        [Key]
        public int StaffingWageAdjustmentID { get; set; }
        public virtual BudgetVersions BudgetVersion { get; set; }
        public virtual TimePeriods TimePeriodID { get; set; }
        public virtual Entities Entity { get; set; }
        public virtual Departments Department { get; set; }
        public virtual JobCodes JobCode { get; set; }
        public virtual PayTypes PayType { get; set; }
        public decimal? WageAdjustmentPercent { get; set; }
        public virtual ItemTypes StartMonth { get; set; }
        public virtual ItemTypes EndMonth { get; set; }

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


