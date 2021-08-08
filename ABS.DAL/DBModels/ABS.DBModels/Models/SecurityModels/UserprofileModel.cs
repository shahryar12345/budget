using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.SecurityModels
{
    public class UserprofileModel
    {

        public string UserProfile { get; set; }
        public virtual IdentityUserProfile UserID { get; set; }
        public List<MenuItems> MenuItems { get; set; }

        public string MenuItemsList { get; set; }
    }
}
