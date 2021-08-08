using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("IdentityAppRoleDataPayTypes")]
    public class IdentityAppRoleDataPayTypes : IModels
    {
        [Key]
        public int IdentityAppRoleDataPayTypeID { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }

        public string Description { get; set; }
        public virtual PayTypes PayTypesID   {get;set;}
        public virtual IdentityAppRoles AppRoleID{get;set;}
        public virtual IdentityUserProfile UserID  { get; set; }



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
