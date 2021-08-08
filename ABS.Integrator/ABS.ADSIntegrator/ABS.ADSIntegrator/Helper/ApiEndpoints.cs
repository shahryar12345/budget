using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.ADSIntegrator.Helper
{
    public class ApiEndpoints
    {

        public async static Task<List<APIEndpoints>> FetchApiEndpoints (IConfiguration Configuration )
        { 
            try
            {
                await Task.Delay(1);
                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

               // List<APIEndpoint> data = hTTPClientHelper.getHttpClientList();
                //List<APIEndpoints> datafromDB =   getHttpClientListfromDB();

               // string url = data.Where(x => x.Name.ToUpper() == name.ToUpper()).FirstOrDefault().BaseAddress;


                string ABSLogger = hTTPClientHelper.getHttpClienturl("BUDGETINGAPIEndpoints", "API_PORT");
               



                var getResponse = await Operations.opHttpClientRestSharp.GetADSAPIData(ABSLogger);

                List<APIEndpoints> lstEndPoints = JsonConvert.DeserializeObject<List<APIEndpoints>>(getResponse);

                return lstEndPoints;
            }
            catch (Exception ex)
            {

                Logger.LogMessage(ex);
                return null;
            }
        }
    }

    public class APIEndpoints
    {
         
        public int APIEndpointID { get; set; }

        public string Name { get; set; }
        public string BaseAddress { get; set; }
        public string RequestHeaders { get; set; }
        public string Function { get; set; }
        public int? Interval { get; set; }
        public string cronstring { get; set; }
        public string APICode { get; set; }
        public string EnvironmentName { get; set; }

        public Guid? Identifier { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdateBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public byte[] RowVersion { get; set; }
    }




}
