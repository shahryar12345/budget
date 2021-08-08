using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IdentityModel.Client;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Cors;

namespace AuthServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IdentityServer : ControllerBase
    {

        private readonly ILogger<IdentityServer> _logger;
        private readonly IConfiguration _Configuration;

        public IdentityServer(ILogger<IdentityServer> logger, IConfiguration _config)
        {
            _logger = logger;
            _Configuration = _config;
        }
      
        [HttpGet]
        public async Task<string> Get()
        {

            string AuthenticationToken = "";
            var client = new HttpClient();
            string getAUthServerURL = _Configuration["AuthServerURL"];
            
            var AuthServiceURL = await client.GetDiscoveryDocumentAsync(getAUthServerURL); // Need to be updated with IOptions
            if (AuthServiceURL.IsError)
            {
                AuthenticationToken += ("\n\n");
                AuthenticationToken += " URL Not working with error: " + AuthServiceURL.Error;
                return AuthenticationToken;
            }

            var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
            {
                Address = AuthServiceURL.TokenEndpoint,
                ClientId = "client",
                ClientSecret = "ABSAuthentication",

                Scope = "ABSAuthenticationAPI"
            });

            var token = await IdentityServerOperations.opIdentityServer.GenerateAuthenticationToken(getAUthServerURL, "client", "ABSAuthentication", "ABSAuthenticationAPI");



            if (tokenResponse.IsError)
            {

                AuthenticationToken += ("\n\n");
                AuthenticationToken += " Error getting Token with Error : " + tokenResponse.Error;
                return AuthenticationToken;
            }
            else
            {


                AuthenticationToken += tokenResponse.Json.ToString();
       

                return AuthenticationToken;

            }




        }



    }
}
