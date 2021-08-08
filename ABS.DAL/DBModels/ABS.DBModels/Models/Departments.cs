using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace ABS.DBModels
{
    [Table("Departments")]
    public class Departments : IModels
    {
        [Key]
        public int DepartmentID { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentName { get; set; }
        public string Description { get; set; }
        public bool? IsGroup { get; set; }
        public bool? IsMaster { get; set; }
        public virtual ItemTypes GroupPolicy { get; set; }
        public virtual ItemTypes DepartmentTypeID { get; set; }
        public bool? IsHierarchy { get; set; }
        public virtual Departments DepartmentMasterID { get; set; }

        public int? ParentID { get; set; }
        public string ChildID { get; set; }
        public virtual ItemTypes DataSourcceID { get; set; }
        public Guid? Identifier { get ; set ; }
        public DateTime? CreationDate { get ; set ; }
        public DateTime? UpdatedDate { get ; set ; }
        public int? CreatedBy { get ; set ; }
        public int? UpdateBy { get ; set ; }
        public bool? IsActive { get ; set ; }
        public bool? IsDeleted { get ; set ; }
        [Timestamp]
        public byte[] RowVersion { get ; set ; }
    }
}
