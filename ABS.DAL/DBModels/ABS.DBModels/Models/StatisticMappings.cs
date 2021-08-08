using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ABS.DBModels
{
    [Table("StatisticMappings")]
    public class StatisticMappings : IModels
    {
        [Key]
        public int StatisticMappingID { get; set; }
        public string StatisticMappingName { get; set; }
        public string StatisticMappingCode { get; set; }
        public string StatisticMappingDescription { get; set; }
        public virtual Entities Entity { get; set; }
        public string ColumnLabels { get; set; }
        public virtual Departments Department { get; set; }
        public virtual StatisticsCodes PrimaryStatisticMaster { get; set; }
        public virtual StatisticsCodes PrimaryStatisticCode { get; set; }
        public virtual StatisticsCodes SecondaryStatisticMaster { get; set; }
        public virtual StatisticsCodes SecondaryStatisticCode { get; set; }
        public virtual StatisticsCodes TertiaryStatisticMaster { get; set; }
        public virtual StatisticsCodes TertiaryStatisticCode { get; set; }

        //IModel Props
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
