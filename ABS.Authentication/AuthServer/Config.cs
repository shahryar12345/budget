using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4;
using IdentityServer4.Models;

namespace AuthServer
{
    public class Config
    {
        public static IEnumerable<IdentityResource> IdentityResources =>
            new List<IdentityResource>
            { 
                new IdentityResources.OpenId(),
                new IdentityResources.Email(),
                new IdentityResources.Profile(),
                new IdentityResources.Phone(),
                new IdentityResources.Address()
            };


        public static IEnumerable<ApiResource> ApiResources =>
            new List<ApiResource>
            {
                new ApiResource("ABSAuthenticationAPI", "ABSAuth"),
                new ApiResource("LDAP", "ABSAuth")
            };
        public static IEnumerable<ApiScope> ApiScopes =>
         new List<ApiScope>
         {
                new ApiScope("ABSAuthenticationAPI", "ABSAuth"),
                new ApiScope("LDAP", "LDAP")
            };
        
        public static IEnumerable<Client> Clients =>
            new List<Client>
            {
                // machine to machine client
                new Client
                {
                    ClientId = "client",
                    ClientSecrets = { new Secret("ABSAuthentication".Sha256()) },
                    
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    // scopes that client has access to
                    AllowedScopes = { "ABSAuthenticationAPI" }
                    
                },
                 // resource owner password grant client
                new Client
                {
                    ClientId = "ro.client",
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedScopes = { "ABSAuthenticationAPI" }
                }
                ,
                 // resource owner password grant client
                new Client
                {
                    Enabled = true,
                    ClientId = "ReactClient",
                    ClientName = "MyBackend Client",
                    AllowedScopes = { "LDAP"  },
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    AccessTokenType = AccessTokenType.Jwt,
                    AlwaysSendClientClaims = true,
                    UpdateAccessTokenClaimsOnRefresh = true,
                    AlwaysIncludeUserClaimsInIdToken = true,
                    AllowAccessTokensViaBrowser = true,
                    IncludeJwtId = true,
                    ClientSecrets = { new Secret("ReactClientSecret".Sha256()) },

                    AllowOfflineAccess = true,
                    AccessTokenLifetime = 3600,
               }
                //,
                // interactive ASP.NET Core MVC client
                //new Client
                //{
                //    ClientId = "mvc",
                //    ClientSecrets = { new Secret("secret".Sha256()) },

                //    AllowedGrantTypes = GrantTypes.Code,
                //    RequireConsent = false,
                //    RequirePkce = true,
                
                //    // where to redirect to after login
                //    RedirectUris = { "http://localhost:20250/signin-oidc" },

                //    // where to redirect to after logout
                //    PostLogoutRedirectUris = { "http://localhost:5002/signout-callback-oidc" },

                //    AllowedScopes = new List<string>
                //    {
                //        IdentityServerConstants.StandardScopes.OpenId,
                //        IdentityServerConstants.StandardScopes.Profile,
                //        "ABSAuthenticationAPI"
                //    },

                //    AllowOfflineAccess = true
                //}
            };
    }
}
