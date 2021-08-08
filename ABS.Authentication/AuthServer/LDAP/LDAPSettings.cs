using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthServer.LDAP
{
    public class LDAPSettings
    {
        public string Url { get; set; }
        public string BindDn { get; set; }
        public string BindCredentials { get; set; }
        public string SearchBase { get; set; }
        public string searchFilter { get; set; }
        public int port { get; set; }
        public bool ssl { get; set; }
    }
}
