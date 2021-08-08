using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace ABS.DBModels
{
    [Table("DepartmentCodeGroups")]
    public class DepartmentCodeGroups : IModels
    {
        [Key]
        public int DepartmentCodeGroupID { get; set; }
        public string DepartmentGroupName { get; set; }

        public Guid? Identifier { get ; set ; }
        public DateTime? CreationDate { get ; set ; }
        public DateTime? UpdatedDate { get ; set ; }
        public int? CreatedBy { get ; set ; }
        public int? UpdateBy { get ; set ; }
        public bool? IsActive { get ; set ; }
        public bool? IsDeleted { get ; set ; }
        public byte[] RowVersion { get ; set ; }
    }
}
