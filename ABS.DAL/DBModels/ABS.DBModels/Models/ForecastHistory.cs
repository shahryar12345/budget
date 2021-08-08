using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("ForecastHistory")]
    public class ForecastHistory : IModels
    {
        [Key]
        public int ForecastHistoryID { get; set; }
        public string ForecastHistoryName { get; set; }
        public string ForecastHistoryCode { get; set; }
        public string ForecastHistoryDescription { get; set; }
        public string formulaMethod { get; set; }
        public string DatascenarioType { get; set; }
        public virtual ItemTypes DatascenarioTypeId { get; set; }
        public virtual BudgetVersions budgetVersionID { get; set; }
        public virtual IdentityUserProfile UserID { get; set; }

        public Guid? Identifier { get; set; }
        public DateTime? CreationDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; } = DateTime.UtcNow;
        public int? CreatedBy { get; set; }
        public int? UpdateBy { get; set; }
        public bool? IsActive { get; set; } = true;
        public bool? IsDeleted { get; set; } = false;

        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
