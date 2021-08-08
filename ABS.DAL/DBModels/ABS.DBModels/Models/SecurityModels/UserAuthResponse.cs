using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels 
{
    public class UserAuthResponse
    {


        public IdentityUserProfile UserProfile { get; set; }
        public string status { get; set; }
        public string userToken { get; set; }

    }
}
