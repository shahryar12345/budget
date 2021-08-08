using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("TimePeriods")]
    public class TimePeriods : IModels
    {
        [Key]
        public int TimePeriodID { get; set; }
        public string TimePeriodName { get; set; }
        public string TimePeriodCode { get; set; }
        public string TimePeriodDescription { get; set; }

        public bool? FetchedFromADS { get; set; }

        //public DateTime? StartDate { get; set; }
        //public DateTime? EndDate { get; set; }
        public virtual ItemTypes FiscalYearID { get; set; }
        public virtual ItemTypes FiscalStartMonthID { get; set; }
        public virtual ItemTypes FiscalYearEndID { get; set; }
        public virtual ItemTypes FiscalEndMonthID { get; set; }
        


        public Guid? Identifier { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdateBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
