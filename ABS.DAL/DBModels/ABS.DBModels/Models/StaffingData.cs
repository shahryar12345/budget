using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ABS.DBModels
{
    [Table("StaffingData")]
    public class StaffingData : IModels
    {
        [Key]
        public int StaffingDataID { get; set; }
        public virtual Entities Entity { get; set; }
        public virtual Departments Department { get; set; }
        public virtual JobCodes JobCode { get; set; }
        public virtual PayTypes PayType { get; set; }
        public virtual TimePeriods StaffingTimePeriod { get; set; }
        public virtual ItemTypes FiscalYear { get; set; }
        public virtual ItemTypes FiscalMonth { get; set; }
         public int? Value { get; set; }
        public virtual ItemTypes DataScenarioTypeID { get; set; }
        public virtual DataScenario DataScenarioID1 { get; set; }


        public int? StaffingAccountID { get; set; }
        public int? StaffingMasterID { get; set; }
        public int? StaffingAccountTypeID { get; set; }
        public decimal? January { get; set; }
        public decimal? February { get; set; }
        public decimal? March { get; set; }
        public decimal? April { get; set; }
        public decimal? May { get; set; }
        public decimal? June { get; set; }
        public decimal? July { get; set; }
        public decimal? August { get; set; }
        public decimal? September { get; set; }
        public decimal? October { get; set; }
        public decimal? November { get; set; }
        public decimal? December { get; set; }
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
