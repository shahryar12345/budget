using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("IdentityUserProfile")]
    public class IdentityUserProfile : IModels
    {
        [Key]
        public int UserProfileID { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string JobFunction { get; set; }
        public string UserEntities { get; set; }
        public string UserDepartments { get; set; }
        public string UserStatisticCodes { get; set; }
        public string UserGLAccounts { get; set; }
        public string UserJobCodes { get; set; }
        public string UserPayTypes { get; set; }
        public DateTime? DOB { get; set; }
        public bool? isLDAPUser { get; set; }

        public string ContactNumber { get; set; }
        public string Address { get; set; }
        public string Username { get; set; }
        public string UserPassword { get; set; }
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
