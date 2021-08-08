using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("UserPreference")]
    public class UserPreference : IModels
    {
        [Key]
        public int UserPreferenceID { get; set; }
        public string UserPreferenceKey { get; set; }
        public string UserPreferenceValue { get; set; }
        public int UserProfileID { get; set; }



        public virtual ItemTypes ItemTypeID { get; set; }
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
