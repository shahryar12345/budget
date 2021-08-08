using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.ADSIntegrator.Helper
{
    public class IntegrationLogger
    {

        public async static void IntegrationLogs (IConfiguration Configuration, string SourceURL, 
            string TargetURL, string DataREceivedfromSource, string DataPushedtoTarget
            , string ResponsefromSource, string ResponsefromTarget)
        {

            try
            {
                string payload = "{";

                payload += "SourceURL" + ":" + SourceURL + "," + Environment.NewLine;
                payload += "TargetURL" + ":" + TargetURL + "," + Environment.NewLine;
                payload += "DataREceivedfromSource" + ":" + DataREceivedfromSource + "," + Environment.NewLine;
                payload += "DataPushedtoTarget" + ":" + DataPushedtoTarget + "," + Environment.NewLine;
                payload += "ResponsefromSource" + ":" + ResponsefromSource + "," + Environment.NewLine;
                payload += "ResponsefromTarget" + ":" + ResponsefromTarget + "" + Environment.NewLine;
               


                payload += "}";



                IntegrationLogs il = new IntegrationLogs();
                il.SourceURL = SourceURL;
                il.TargetURL = TargetURL;
                il.DataREceivedfromSource = DataREceivedfromSource;
                il.DataPushedtoTarget = DataPushedtoTarget;
                il.ResponsefromSource = ResponsefromSource;
                il.ResponsefromTarget = ResponsefromTarget;
                 
                
                var payloadjson = Newtonsoft.Json.JsonConvert.SerializeObject(payload);
                var payloadjsonil = Newtonsoft.Json.JsonConvert.SerializeObject(il);

                //var pas = Newtonsoft.Json.Linq.JObject.Parse(payloadjson);
                
                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ABSLogger = hTTPClientHelper.getHttpClienturl("BUDGETINGINTEGRATIONLOGS", "API_PORT");
             
                

                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(ABSLogger, payloadjsonil);

                if (getpostResponse != null)
                {
                   
                    Helper.Logger.LogMessage("LOGCREATION||INFO||", "POSTRESPONSE", getpostResponse);
                }
                else
                {
                    Helper.Logger.LogMessage("LOGCREATION||ERROR||", "POSTRESPONSE", "ERROR POSTING DATA");
                   
                }
            }
            catch (Exception ex)
            {

                Logger.LogMessage(ex);
            }
        }
    }

    public class IntegrationLogs
    {
      

        //[Required]
        public object SourceURL { get; set; }
        public object TargetURL { get; set; }
       
        public object DataREceivedfromSource { get; set; }
        
        public object DataPushedtoTarget { get; set; }
        public object ResponsefromSource { get; set; }
        public object ResponsefromTarget { get; set; }
       }



}
