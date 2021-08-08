using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("IdentityScreenOperations")]
    public class IdentityScreenOperations : IModels
    {
        [Key]
        public int IdentityScreenOperationID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }

        public bool? Can_ReadOnly { get; set; }
        public bool? Can_Create { get; set; }
        public bool? Can_Update { get; set; }
        public bool? Can_Delete { get; set; }

        public virtual IdentityOperations IdentityOperation {get;set;}
        public virtual IdentityScreens IdentityScreens {get;set;}

        public string Description { get; set; }
        
        public DateTime? CreationDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdateBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public byte[] RowVersion { get; set; }
        public Guid? Identifier { get; set; }
    }
}
