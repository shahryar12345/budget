using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ABS.DBModels
{
    [Table("StaffingGLMappings")]
    public class StaffingGLMappings : IModels
    {
        [Key]
        public int StaffingGLMappingID { get; set; }
        public virtual Entities Entity { get; set; }
        public virtual Departments Department { get; set; }
        public virtual JobCodes JobCode { get; set; }
        public virtual PayTypes PayType { get; set; }
        public virtual GLAccounts GLAccount { get; set; }
        public int Index { get; set; }

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
