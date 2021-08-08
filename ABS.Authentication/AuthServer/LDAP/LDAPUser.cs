using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AuthServer.LDAP
{
    public class LDAPUser
    
    {
        /// <summary>
        /// User name
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// User password
        /// </summary>
        public string Password { get; set; }
        public string ClientID { get; set; }
        public string ClientSecret { get; set; }
        public string ApiResource { get; set; }
        //public ClaimsIdentity ApiResource { get; internal set; }


    }
}
