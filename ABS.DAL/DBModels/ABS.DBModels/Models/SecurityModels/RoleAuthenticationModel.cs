using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels 
{
    public class RoleAuthenticationModel
    {

     
        public IdentityAppRoles RoleProfile { get; set; }
        public List<IdentityAppRoleUsers> AllUserRoles { get; set; }
        public List<IdentityAppRoleScreens> AllRoleScreens { get; set; }
        public List<IdentityAppRoleScreenOperations> AllRoleScreenOperations { get; set; }
        
        

    }
}
