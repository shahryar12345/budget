using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Hangfire.Dashboard.BasicAuthorization;

namespace ABS.ADSIntegrator.HangfireHelper
{
    public class HangfireDashboard
    {
        public static DashboardOptions getHangfileDashboardOptions (string _username, string _password)
        {

            var options = new DashboardOptions
            {
                Authorization = new[] { new BasicAuthAuthorizationFilter(new BasicAuthAuthorizationFilterOptions
                {
                    RequireSsl = false,
                    SslRedirect = false,
                    LoginCaseSensitive = true,
                    Users = new []
                    {
                        new BasicAuthAuthorizationUser
                        {
                            Login = _username,
                            PasswordClear =  _password
                        }
                    }

                }) }
            };

            return options;
        }

    }
}
