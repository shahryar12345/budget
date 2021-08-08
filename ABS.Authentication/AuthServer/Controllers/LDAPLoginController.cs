using System.Security.Claims;
using System.Threading.Tasks;
using AuthServer.LDAP;
using IdentityModel;
using IdentityServer.LdapExtension.UserModel;
using IdentityServer.LdapExtension.UserStore;
using IdentityServer4;
using IdentityServer4.Events;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Novell.Directory.Ldap;

namespace AuthServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LDAPLoginController : ControllerBase
    {

        private readonly ILdapUserStore userStore = null;
        private readonly IEventService events = null;
        private readonly IdentityServerTools tools = null;
        private readonly IConfiguration _Config = null;


        public LDAPLoginController(
            ILdapUserStore userStore,
            IEventService events,
            IdentityServerTools tools, IConfiguration _Conf )
        {
            this.userStore = userStore;
            this.events = events;
            this.tools = tools;
            _Config  = _Conf ;
        }

 

        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn([FromBody]LDAPUser model)
        {
            // validate username/password against Ldap
            var ldapuser = this.userStore.ValidateCredentials(model.Username, model.Password);

            if (ldapuser != default(IAppUser))
            {
                //var accessToken = await tools.IssueJwtAsync(3600,
                //new Claim[] { new Claim(JwtClaimTypes.Audience, model.ApiResource) });

                string getAUthServerURL = _Config["AuthServerURL"];


               var derivedTOken =  await IdentityServerOperations.opIdentityServer.GenerateAuthenticationToken(
                    getAUthServerURL,
                    model.ClientID,
                    model.ClientSecret,
                    model.ApiResource
                    );
                
                if (derivedTOken.IsError)
                {
                    return Unauthorized(derivedTOken.Error);
                }

                

                return this.Ok(derivedTOken.AccessToken);
            }
            else
            {
                return this.Unauthorized();
            }
        }


        [HttpPost("Validate")]
        public async Task<IActionResult> Validate([FromBody]LDAPUser user)
        {
            var isAuthorized = await this.ExecLdapAuthAsync(user.Username, user.Password);

            if (isAuthorized)
            {
                return this.Ok("User Authenticated");
            }
            else
            {
                return this.Unauthorized();
            }
        }

        private async Task<bool> ExecLdapAuthAsync(string username, string password)
        {
            var host = "192.168.214.245"; // Host
            var bindDN = "cn=allianceLDAPAdmin,ou=DSS,o=alliance";
            var bindPassword = "decision support";
            var baseDC = "o=alliance";
            bool isAuthorized = false;

            try
            {
                isAuthorized = await Task.Run(() =>
                {
                    using (var connection = new LdapConnection())
                    {
                        connection.Connect(host, LdapConnection.DefaultPort);
                        connection.Bind(bindDN, bindPassword);

                        var searchFilter = $"(&(objectClass=person)(uid={username}))";
                        var entities = connection.Search(
                            baseDC,
                            LdapConnection.ScopeSub,
                            searchFilter,
                            new string[] { "uid", "cn", "mail" },
                            false);

                        string userDn = null;

                        while (entities.HasMore())
                        {
                            var entity = entities.Next();
                            var account = entity.GetAttribute("uid");
                            if (account != null && account.StringValue == username)
                            {
                                userDn = entity.Dn;
                                break;
                            }
                        }

                        if (string.IsNullOrWhiteSpace(userDn))
                        {
                            return false;
                        }

                        try
                        {
                            connection.Bind(userDn, password);
                            return connection.Bound;
                        }
                        catch (System.Exception)
                        {
                            return false;
                        }
                    }
                });

                return isAuthorized;
            }
            catch (LdapException e)
            {
                throw e;
            }
        }
    }
}
