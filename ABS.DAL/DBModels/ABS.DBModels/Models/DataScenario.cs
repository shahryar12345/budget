using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ABS.DBModels
{
    [Table("DataScenario")]
    public class DataScenario : IModels
    {
        [Key]
        public int DataScenarioID { get; set; }
        public string DataScenarioCode { get; set; }
        public string DataScenarioName { get; set; }
        public string Description { get; set; }
        public virtual ItemTypes ScenarioType { get; set; }
        public virtual TimePeriods TimePeriod { get; set; }

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
        public byte[] RowVersion { get; set; }
    }
}
