using System.Linq;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authorization;

namespace AuthServer.Controllers
{
    [Route("identity")]
    [Authorize]
    public class IdentityController : Controller
    {
        [HttpGet]

        public IActionResult Get()
        {
            return new JsonResult(from c in User.Claims select new { c.Type, c.Value });
        }


        [HttpGet]
        [Route("UserLogin")]

        public IActionResult UserLogin(string username, string password )
        {
            
            return new JsonResult(from c in User.Claims select new { c.Type, c.Value });
        }



        //  [HttpGet]
        //public async Task<string> Get()
        //{

        //    string AuthenticationToken = "";
        //    var client = new HttpClient();

        //    var disco = await client.GetDiscoveryDocumentAsync("http://localhost:20250");
        //    if (disco.IsError)
        //    {
        //        // Console.WriteLine(disco.Error);
        //        AuthenticationToken += ("\n\n");
        //        AuthenticationToken += " URL Not working";
        //        return AuthenticationToken;
        //    }

        //    var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
        //    {
        //        Address = disco.TokenEndpoint,
        //        ClientId = "client",
        //        ClientSecret = "ABSAuthentication",

        //        Scope = "ABSAuthenticationAPI"
        //    });

        //    if (tokenResponse.IsError)
        //    {
        //        //Console.WriteLine(tokenResponse.Error);
        //        AuthenticationToken += ("\n\n");
        //        AuthenticationToken += " Token Error";
        //        return AuthenticationToken;
        //    }
        //    AuthenticationToken += ("\n\n");
        //    AuthenticationToken += tokenResponse.Json.ToString();
        //    AuthenticationToken += ("\n\n");

        //    // call api
        //    var apiClient = new HttpClient();
        //    apiClient.SetBearerToken(tokenResponse.AccessToken);

        //    var response = await apiClient.GetAsync("http://localhost:20250/connect/token");
        //    if (!response.IsSuccessStatusCode)
        //    {
        //        //Console.WriteLine(response.StatusCode);

        //        AuthenticationToken += ("\n\n");
        //        AuthenticationToken += "Error getting token : " + response.StatusCode;
        //        return AuthenticationToken;
        //    }
        //    else
        //    {
        //        var content = await response.Content.ReadAsStringAsync();
        //        //  Console.WriteLine(JArray.Parse(content));


        //        AuthenticationToken += ("\n\n");
        //        AuthenticationToken += JArray.Parse(content).ToString();
        //        return AuthenticationToken;

        //    }












        //    //var rng = new Random();
        //    //return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    //{
        //    //    Date = DateTime.Now.AddDays(index),
        //    //    TemperatureC = rng.Next(-20, 55),
        //    //    Summary = Summaries[rng.Next(Summaries.Length)]
        //    //})
        //    //.ToArray();
        //}
    }
}