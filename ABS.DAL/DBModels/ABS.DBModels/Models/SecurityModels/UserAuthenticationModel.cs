using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels 
{
    public class UserAuthenticationModel
    {

     
        public IdentityUserProfile UserProfile { get; set; }
        public List<IdentityAppRoleUsers> AllUserRoles { get; set; }
        public List<IdentityAppRoleScreens> AllRoleScreens { get; set; }
        public List<IdentityAppRoleScreenOperations> AllRoleScreenOperations { get; set; }
        public List<IdentityAppRoleDataEntities> AllRoleEntities { get; set; }
        public List<IdentityAppRoleDataDepartments> AllRoleDepartments { get; set; }
        public List<IdentityAppRoleDataStatistics> AllRoleStatisticCodes { get; set; }
        public List<IdentityAppRoleDataGLAccounts> AllRoleGLAccounts { get; set; }
        public List<IdentityAppRoleDataPayTypes> AllRolePayTypes { get; set; }
        public List<IdentityAppRoleDataJobCodes> AllRoleJobCodes { get; set; }

        

    }
}
