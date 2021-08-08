using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using RestSharp;

namespace ABS.ADSIntegrator.ABSClient
{
    public class ADSData
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public IConfiguration Configuration;
        public string stringResponse = "";

        public ADSData(IHttpClientFactory _ihttpfactory, IConfiguration _config)
        {
            _httpClientFactory = _ihttpfactory;
            Configuration = _config;
        }

        // Environment Variable
        //  -> ADS_REST_PORT
        //  -> API_PORT

        public async Task<string> GetADSTimePeriodData()
        {

            try
            {
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

                Helper.Logger.LogMessage("INFO", "GetADSTimePeriodData", "Start Recieving Data...");



                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ADSURL = hTTPClientHelper.getHttpClienturl("ADSTIMEPERIOD", "ADS_REST_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;



                var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);
                Helper.Logger.LogMessage("INFO", "GetADSTimePeriodData", " Record(s) recieved. Start sending data to ABS");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

                string ABSURL = hTTPClientHelper.getHttpClienturl("BUDGETINGTIMEPERIOD", "API_PORT");

                stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(ABSURL, getData);



                if (getpostResponse != null)
                {

                    Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

                }
                else
                {
                    Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";


                }
                Helper.IntegrationLogger.IntegrationLogs(
                     Configuration,
                     ADSURL,
                     ABSURL,
                     getData,
                     "",
                     "",
                     getpostResponse
                     );
                return stringResponse;
            }
            catch (Exception ex)
            {

                Helper.Logger.LogMessage(ex);
                return ex.Message;
            }

        }

        public async Task<object> GetADSChargeCodeMasterData()
        {
            try
            {
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

                Helper.Logger.LogMessage("INFO", "GetADSChargeCodeMasterData", "Start Recieving Data...");



                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ADSURL = hTTPClientHelper.getHttpClienturl("ADSCHARGECODEMASTER", "ADS_REST_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;



                var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);

                Helper.Logger.LogMessage("INFO", "GetADSChargeCodeMasterData", " Record(s) recieved. Start sending data to ABS");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

                string ABSURL = hTTPClientHelper.getHttpClienturl("BUDGETINGCHARGECODEMASTER", "API_PORT");

                stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

                Dictionary<string, object> paramlist = new Dictionary<string, object>();
                paramlist.Add("rawText", getData);
                paramlist.Add("recordType", "MASTER");


                var body = new
                {
                    rawText = getData,
                    recordType = "MASTER"
                };

                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIDatawithParams(ABSURL, body.ToString(), paramlist);



                if (getpostResponse != null)
                {

                    Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

                }
                else
                {
                    Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";


                }
                Helper.IntegrationLogger.IntegrationLogs(
                     Configuration,
                     ADSURL,
                     ABSURL,
                     getData,
                     "",
                     "",
                     getpostResponse
                     );
                return stringResponse;
            }
            catch (Exception ex)
            {

                Helper.Logger.LogMessage(ex);
                return ex.Message;
            }
        }

        public async Task<object> GetStatisticsActivityData()
        {
            try
            {
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

                Helper.Logger.LogMessage("INFO", "GetStatisticsActivityData", "Start Recieving Data...");



                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ADSURL = hTTPClientHelper.getHttpClienturl("ADSSTATISTICSACTIVITY", "ADS_REST_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;



                var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);

                Helper.Logger.LogMessage("INFO", "GetStatisticsActivityData", " Record(s) recieved. Start sending data to ABS");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

                string ABSURL = hTTPClientHelper.getHttpClienturl("BUDGETINGSTATISTICSACTIVITY", "API_PORT");

                stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

                //Dictionary<string, object> paramlist = new Dictionary<string, object>();
                //paramlist.Add("rawText", getData);
                //paramlist.Add("recordType", "MASTER");


                //var body = new
                //{
                //    rawText = getData,
                //    recordType = "MASTER"
                //};

                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(ABSURL, getData);



                if (getpostResponse != null)
                {

                    Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

                }
                else
                {
                    Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";


                }
                Helper.IntegrationLogger.IntegrationLogs(
                     Configuration,
                     ADSURL,
                     ABSURL,
                     getData,
                     "",
                     "",
                     getpostResponse
                     );
                return stringResponse;
            }
            catch (Exception ex)
            {

                Helper.Logger.LogMessage(ex);
                return ex.Message;
            }
        }

        public async Task<object> GetGLAccountData()
        {
            try
            {
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

                Helper.Logger.LogMessage("INFO", "GetGLAccountData", "Start Recieving Data...");



                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ADSURL = hTTPClientHelper.getHttpClienturl("ADSGLACCOUNTS", "ADS_REST_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;



                var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);

                Helper.Logger.LogMessage("INFO", "GetGLAccountData", " Record(s) recieved. Start sending data to ABS");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

                string ABSURL = hTTPClientHelper.getHttpClienturl("BUDGETINGGLACCOUNTS", "API_PORT");

                stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

                //Dictionary<string, object> paramlist = new Dictionary<string, object>();
                //paramlist.Add("rawText", getData);
                //paramlist.Add("recordType", "MASTER");


                //var body = new
                //{
                //    rawText = getData,
                //    recordType = "MASTER"
                //};

                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(ABSURL, getData);



                if (getpostResponse != null)
                {

                    Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

                }
                else
                {
                    Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";


                }
                Helper.IntegrationLogger.IntegrationLogs(
                 Configuration,
                 ADSURL,
                 ABSURL,
                 getData,
                 "",
                 "",
                 getpostResponse
                 );

                return stringResponse;
            }
            catch (Exception ex)
            {

                Helper.Logger.LogMessage(ex);
                return ex.Message;
            }
        }


        public async Task<object> GetADSChargeCodeData()
        {
            try
            {
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

                Helper.Logger.LogMessage("INFO", "GetADSChargeCodeData", "Start Recieving Data...");



                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ADSURL = hTTPClientHelper.getHttpClienturl("ADSCHARGECODE", "ADS_REST_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;



                var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);

                Helper.Logger.LogMessage("INFO", "GetADSChargeCodeData", " Record(s) recieved. Start sending data to ABS");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

                string ABSURL = hTTPClientHelper.getHttpClienturl("BUDGETINGCHARGECODE", "API_PORT");

                stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

                Dictionary<string, object> paramlist = new Dictionary<string, object>();
                paramlist.Add("recordType", "");


                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIDatawithParams(ABSURL, getData, paramlist);



                if (getpostResponse != null)
                {

                    Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

                }
                else
                {
                    Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";


                }
                Helper.IntegrationLogger.IntegrationLogs(
                     Configuration,
                     ADSURL,
                     ABSURL,
                     getData,
                     "",
                     "",
                     getpostResponse
                     );
                return stringResponse;
            }
            catch (Exception ex)
            {

                Helper.Logger.LogMessage(ex);
                return ex.Message;
            }
        }

        public async Task<string> GetADSStatisticsCodeData()
        {
            try
            {
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

                //API_PORT
                //ADS_REST_PORT
                Helper.Logger.LogMessage("INFO", "GetADSStatisticsCodeData", "Start Recieving Data...");

                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ADSURL = hTTPClientHelper.getHttpClienturl("ADSSTATISTICSCODE", "ADS_REST_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;

                var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);
                Helper.Logger.LogMessage("INFO", "GetADSStatisticsCodeData", " Record(s) recieved. Start sending data to ABS");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

                string ABSURL = hTTPClientHelper.getHttpClienturl("BUDGETINGSTATISTICSCODE", "API_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(ABSURL, getData);

                if (getpostResponse != null)
                {
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

                    Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
                }
                else
                {
                    Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";

                }
                Helper.IntegrationLogger.IntegrationLogs(
                     Configuration,
                     ADSURL,
                     ABSURL,
                     getData,
                     "",
                     "",
                     getpostResponse
                     );
                return stringResponse;


            }
            catch (Exception ex)
            {

                Helper.Logger.LogMessage(ex);
                return ex.Message;
            }

        }

        //public async Task<string> GetADSStatisticsCodesData()
        //{
        //    try
        //    {
        //        stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

        //        //API_PORT
        //        //ADS_REST_PORT
        //        Helper.Logger.LogMessage("INFO", "GetADSStatisticsData", "Start Recieving Data...");

        //        Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

        //        string ADSURL = hTTPClientHelper.getHttpClienturl("ADSSTATISTICSDATA", "ADS_REST_PORT");
        //        stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;

        //        var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);
        //        Helper.Logger.LogMessage("INFO", "GetADSStatisticsData", " Record(s) recieved. Start sending data to ABS");
        //        stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

        //        string ABSURL = hTTPClientHelper.getHttpClienturl("BUDGETINGSTATISTICSDATA", "API_PORT");
        //        stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

        //        var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(ABSURL, getData);

        //        if (getpostResponse != null)
        //        {
        //            stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

        //            Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
        //        }
        //        else
        //        {
        //            Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
        //            stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";

        //        }

        //        Helper.IntegrationLogger.IntegrationLogs(
        //             Configuration,
        //             ADSURL,
        //             ABSURL,
        //             getData,
        //             "",
        //             "",
        //             getpostResponse
        //             );
        //        return stringResponse;


        //    }
        //    catch (Exception ex)
        //    {

        //        Helper.Logger.LogMessage(ex);
        //        return ex.Message;
        //    }

        //}

        public async Task<object> GetPayTypesCodeGroupData()
        {
            try
            {
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

                Helper.Logger.LogMessage("INFO", "GetPayTypesCodeGroupData", "Start Recieving Data...");



                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ADSURL = hTTPClientHelper.getHttpClienturl("ADSPAYTYPESCODEGROUPS", "ADS_REST_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;



                var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);

                getData = Helper.JSONHelper.AddFieldToJsonArrary(getData, "isGroup", "true");

                Helper.Logger.LogMessage("INFO", "GetPayTypesCodeGroupData", " Record(s) recieved. Start sending data to ABS");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

                string ABSURL = hTTPClientHelper.getHttpClienturl("BUDGETINGPAYTYPESCODEGROUPS", "API_PORT");

                stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

                //Dictionary<string, object> paramlist = new Dictionary<string, object>();
                //paramlist.Add("rawText", getData);
                //paramlist.Add("recordType", "MASTER");


                //var body = new
                //{
                //    rawText = getData,
                //    recordType = "MASTER"
                //};

                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(ABSURL, getData);



                if (getpostResponse != null)
                {

                    Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

                }
                else
                {
                    Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";


                }
                Helper.IntegrationLogger.IntegrationLogs(
                 Configuration,
                 ADSURL,
                 ABSURL,
                 getData,
                 "",
                 "",
                 getpostResponse
                 );

                return stringResponse;
            }
            catch (Exception ex)
            {

                Helper.Logger.LogMessage(ex);
                return ex.Message;
            }
        }



        public async Task<object> ADSImportData(string ImportName, string SourceAPIName, string TargetApiName)
        {
            try
            {
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

                Helper.Logger.LogMessage("INFO", "" + ImportName, "Start Recieving Data...");



                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ADSURL = hTTPClientHelper.getHttpClienturl(SourceAPIName, "ADS_REST_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;



                var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);

                Helper.Logger.LogMessage("INFO", "" + ImportName, " Record(s) recieved. Start sending data to ABS");
               
                if (getData != null && getData.Length>5000)
                {
                    string substringgetdata = getData.Substring(0, 5000);
                     stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload:(First 5000 Characters||) " + substringgetdata;

                }
                else
                {
                     stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

                }

                string ABSURL = hTTPClientHelper.getHttpClienturl(TargetApiName, "API_PORT");

                stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

                //Dictionary<string, object> paramlist = new Dictionary<string, object>();
                //paramlist.Add("rawText", getData);
                //paramlist.Add("recordType", "MASTER");


                //var body = new
                //{
                //    rawText = getData,
                //    recordType = "MASTER"
                //};

                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(ABSURL, getData);



                if (getpostResponse != null)
                {

                    Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

                }
                else
                {
                    Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";


                }
                Helper.IntegrationLogger.IntegrationLogs(
                 Configuration,
                 ADSURL,
                 ABSURL,
                 getData,
                 "",
                 "",
                 getpostResponse
                 );

                return stringResponse;
            }
            catch (Exception ex)
            {

                Helper.Logger.LogMessage(ex);
                return ex.Message;
            }
        }
        public async Task<object> ADSImportData(string ImportName, string SourceAPIName, string TargetApiName, string fieldname, string fieldvalue)
        {
            try
            {
                stringResponse += Environment.NewLine + DateTime.UtcNow + "||Start Recieving Data...";

                Helper.Logger.LogMessage("INFO", "" + ImportName, "Start Recieving Data...");



                Helper.HTTPClientHelper hTTPClientHelper = new Helper.HTTPClientHelper(Configuration);

                string ADSURL = hTTPClientHelper.getHttpClienturl(SourceAPIName, "ADS_REST_PORT");
                stringResponse += Environment.NewLine + DateTime.UtcNow + "|| SourceURL : " + ADSURL;



                var getData = await Operations.opHttpClientRestSharp.GetADSAPIData(ADSURL);
                getData = Helper.JSONHelper.AddFieldToJsonArrary(getData, fieldname, fieldvalue);

                Helper.Logger.LogMessage("INFO", "" + ImportName, " Record(s) recieved. Start sending data to ABS");
                if (getData.Length > 5000)
                {
                    string substringgetdata = getData.Substring(0, 5000);
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload:(First 5000 Characters||) " + substringgetdata;

                }
                else
                {
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Recieved Payload: " + getData;

                }
                string ABSURL = hTTPClientHelper.getHttpClienturl(TargetApiName, "API_PORT");

                stringResponse += Environment.NewLine + DateTime.UtcNow + "||TargetURL: " + ABSURL;

                //Dictionary<string, object> paramlist = new Dictionary<string, object>();
                //paramlist.Add("rawText", getData);
                //paramlist.Add("recordType", "MASTER");


                //var body = new
                //{
                //    rawText = getData,
                //    recordType = "MASTER"
                //};

                var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(ABSURL, getData);



                if (getpostResponse != null)
                {

                    Helper.Logger.LogMessage("INFO", "POSTRESPONSE", getpostResponse);
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||Post Response Payload: " + getpostResponse;

                }
                else
                {
                    Helper.Logger.LogMessage("ERROR", "POSTRESPONSE", "ERROR POSTING DATA");
                    stringResponse += Environment.NewLine + DateTime.UtcNow + "||ERROR Sending Data to TargetURL ";


                }
                Helper.IntegrationLogger.IntegrationLogs(
                 Configuration,
                 ADSURL,
                 ABSURL,
                 getData,
                 "",
                 "",
                 getpostResponse
                 );

                return stringResponse;
            }
            catch (Exception ex)
            {

                Helper.Logger.LogMessage(ex);
                return ex.Message;
            }
        }



    }
}
