using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("SystemSettings")]
    public class SystemSettings :IModels
    {
        [Key]
        public int SettingID { get; set; }
        public string SettingKey { get; set; }
        public string SettingValue { get; set; }
        public int UserProfileID { get; set; }
        public virtual ItemTypes ItemDataType { get; set; }

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
