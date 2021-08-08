using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace ABS.DBModels
{
    [Table("GLAccounts")]
    public class GLAccounts : IModels
    {
        [Key]
        public int GLAccountID { get; set; }
        public string GLAccountCode { get; set; }
        public string GLAccountName { get; set; }
        public string Description { get; set; }

        public bool? IsMaster { get; set; }
        public virtual ItemTypes GLAccountType { get; set; }
        public bool? Summable { get; set; }
        public string ColumnLabel { get; set; }
        public bool? IsGroup { get; set; }
        public bool? IsHierarchy { get; set; }

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
