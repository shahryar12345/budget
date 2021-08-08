using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace ABS.DBModels
{
    [Table("StatisticsCodes")]
    public class StatisticsCodes : IModels
    {
        [Key]
        public int StatisticsCodeID { get; set; }
        public string StatisticsCode { get; set; }
        public string StatisticsCodeName { get; set; }
        public string Description { get; set; }


        //ABS-43 - JAB 05/06/2020
        public bool? IsMaster { get; set; }
        public virtual ItemTypes StatisticCodeType { get; set; }
        public bool? Summable { get; set; }
        public string ColumnLabel { get; set; }
        //End ABS-43

        //ABS-176 - JAB 05/26/2020
        public bool? IsGroup { get; set; }
        //End ABS-176

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
