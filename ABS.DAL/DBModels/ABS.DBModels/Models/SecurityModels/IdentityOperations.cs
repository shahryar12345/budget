using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("IdentityOperations")]
    public class IdentityOperations : IModels
    {
        [Key]
        public int IdentityOperationID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }

        public bool? IsView { get; set; }
        public bool? IsCreate { get; set; }
        public bool? IsUPdate  { get; set; }
        public bool? IsDelete  { get; set; }
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
