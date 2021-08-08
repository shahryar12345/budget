using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using Newtonsoft.Json;
using ABS.ADSIntegrator.Operations;

namespace ABS.ADSIntegrator.Helper
{
    public class HTTPClientHelper
    {

        public IConfiguration Configuration;
        public HTTPClientHelper(IConfiguration _config)
        {
            Configuration = _config;
        }

        public List<APIEndpoint>  getHttpClientList ()
        {
            try
            {
                var getconfig = Configuration.GetValue<string>("APIListConfig");

                var jsonList = System.IO.File.ReadAllText(getconfig);

                List<APIEndpoint> data = JsonConvert.DeserializeObject<List<APIEndpoint>>(jsonList);

                return data;
            }
            catch (Exception ex)
            {
                Logger.LogMessage(ex);
               return null;
            }  
        }
        public    List<APIEndpoints>  getHttpClientListfromDB ()
        {
            try
            {
                var getconfig =   ApiEndpoints.FetchApiEndpoints(Configuration);

                return getconfig.Result;
            }
            catch (Exception ex)
            {
                Logger.LogMessage(ex);
               return null;
            }  
        }

        public string getHttpClienturl(string name)
        {
            try
            {
                var getconfig = Configuration.GetValue<string>("APIListConfig");

                var jsonList = System.IO.File.ReadAllText(getconfig);

                List<APIEndpoint> data = getHttpClientList();

                string url = data.Where(x => x.Name.ToUpper() == name.ToUpper()).FirstOrDefault().BaseAddress;

                url = url.Replace("\"", "");
                return url;
            }
            catch (Exception ex)
            {
                Logger.LogMessage(ex);
                return null;
            }
        }

        public string getHttpClienturl(string name, string environmentVariable)
        {
            try
            {
                    var getconfig = Configuration.GetValue<string>("APIListConfig");

                var jsonList = System.IO.File.ReadAllText(getconfig);

                string port = System.Environment.GetEnvironmentVariable(environmentVariable);
                string environmentName = System.Environment.GetEnvironmentVariable("ENVIRONMENT_NAME");


                List<APIEndpoint> data = getHttpClientList();
                //List<APIEndpoints> datafromDB =   getHttpClientListfromDB();

                string url = data.Where(x => x.Name.ToUpper() == name.ToUpper()).FirstOrDefault().BaseAddress;

                var envFilter = Configuration.GetValue<string>("ENV_FILTER_" + environmentName.ToUpper());
                if (envFilter =="")
                {
                    envFilter = "/abs";
                }

                url = url.Replace("\"", "");

                url = url.Contains("{port}") ? url.Replace("{port}", port): url;
                 url = url.Contains("{filter}") ? url.Replace("{filter}", envFilter): url;


                return url;
            }
            catch (Exception ex)
            {
                Logger.LogMessage(ex);
                return null;
            }
        }

    }
}
