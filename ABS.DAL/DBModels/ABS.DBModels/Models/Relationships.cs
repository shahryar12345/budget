using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace ABS.DBModels
{
    [Table("Relationships")]
    public class Relationships : IModels
    {
        [Key]
         public int RelationshipID { get; set; }
         public int? ParentID { get; set; }
         public int? ChildID { get; set; }
        public virtual ItemTypes RelationshipType { get; set; }
        public virtual ItemTypes ModelType { get; set; }
        public string Depth { get; set; }
        public string ordering { get; set; }
        //iModel Properties
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
