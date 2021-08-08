using IdentityModel.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace AuthServer.IdentityServerOperations
{
    public class opIdentityServer

    {
 
        internal async static Task<TokenResponse> GenerateAuthenticationToken(string authServiceURL, string ClientID, string CLientSecret, string ClientScope)
        {
            try
            {
                var client = new HttpClient();

                var discoveryDocumentResponse = await client.GetDiscoveryDocumentAsync(authServiceURL); // Need to be updated with IOptions


                var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
                {
                    Address = discoveryDocumentResponse.TokenEndpoint,
                    ClientId = ClientID,
                    ClientSecret = CLientSecret,

                    Scope = ClientScope
                });

                return tokenResponse;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                return null;
            }
        }
    }
}
