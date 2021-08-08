using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.SecurityModels
{
    public class MenuItems
    {
        public virtual IdentityScreens Screens { get; set; }
        public virtual List<IdentityOperations> actionsPermission { get; set; }
    }
}
