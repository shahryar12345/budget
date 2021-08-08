using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;


namespace ABS.DBModels
{

    [Table("Dimensions")]
    public class Dimensions : IModels
    {
        [Key]
        public int DimensionsID { get; set; }
        public virtual BudgetVersions BudgetVersion { get; set; }
        public virtual Entities Entity { get; set; }
        public virtual Departments Department { get; set; }
        public virtual StatisticsCodes StatisticsCode { get; set; }
        public virtual GLAccounts GLAccount { get; set; }
        public virtual JobCodes JobCode { get; set; }
        public virtual PayTypes PayType { get; set; }
        public decimal? Ratio { get; set; }
        public virtual ItemTypes ForecastType { get; set; }
        public bool Seasonality { get; set; }
        public virtual ItemTypes SourceStartDate { get; set; }
        public virtual ItemTypes SourceEndDate { get; set; }
        public virtual ItemTypes TargetStartDate { get; set; }
        public virtual ItemTypes TargetEndDate { get; set; }


        //iModel props
        public int? ParentID { get; set; }
        public string ChildID { get; set; }


        public virtual ItemTypes DataSourcceID { get; set; }
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
