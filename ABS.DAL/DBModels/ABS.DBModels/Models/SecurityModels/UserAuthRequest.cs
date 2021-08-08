using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels 
{
    public class UserAuthRequest
    {
         
    public string username { get; set; }
    public string password { get; set; }
    public string apiResource { get; set; }
    public string clientID { get; set; }
    public string clientSecret { get; set; }

    }
}
