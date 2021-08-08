using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("ChargeCodes")]
    public class ChargeCodes : IModels
    {
        [Key]
        public int ChargeCodeID { get; set; }
        public string ChargeCode { get; set; }
        public virtual Departments Department { get; set; }
        public string ChargeCodeName { get; set; }
        public bool? IsMaster { get; set; }

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
