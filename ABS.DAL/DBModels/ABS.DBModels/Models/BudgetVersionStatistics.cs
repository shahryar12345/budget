using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ABS.DBModels
{
    [Table("BudgetVersionStatistics")]
    public class BudgetVersionStatistics : IModels
    {
        [Key]
        public int StatisticID { get; set; }
        public virtual BudgetVersions BudgetVersion { get; set; }
        public virtual Entities Entity { get; set; }
        public virtual Departments Department { get; set; }
        public virtual StatisticsCodes StatisticsCodes { get; set; }
        public virtual TimePeriods TimePeriodID { get; set; }

        public virtual ItemTypes DataScenarioTypeID { get; set; }
        public virtual DataScenario DataScenarioDataID { get; set; }

        //ABS-340 - JAB 06/03/2020
        public virtual Dimensions DimensionsRowID { get; set; }
        //End ABS-340

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

        public decimal? rowTotal { get; set; }

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


