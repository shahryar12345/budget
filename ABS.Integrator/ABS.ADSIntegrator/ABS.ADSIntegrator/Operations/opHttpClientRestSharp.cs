using ABS.ADSIntegrator.Helper;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ABS.ADSIntegrator.Operations
{
    public class opHttpClientRestSharp
    {
        public async static Task<string> PostABSAPIData(string URLName, string postData)
        {
            try
            {

                decimal megabyteSize = ((decimal)Encoding.Unicode.GetByteCount(postData) / 1048576);
                if (megabyteSize > decimal.Parse("0.5"))
                {

                    Console.WriteLine("************** TOOO MUCH DATA ********* Size in MB: " + megabyteSize.ToString());

                    var compressedData = Helper.CompressionHelper.CompressString(postData);
                    megabyteSize = ((decimal)Encoding.Unicode.GetByteCount(compressedData) / 1048576);
                    Console.WriteLine("************** Compressing ********* Compressed Size in MB: " + megabyteSize.ToString());

                    CompressedRequest newCompressedRequest = new CompressedRequest();
                    newCompressedRequest.compressedData = compressedData;
                    newCompressedRequest.isCompressed = true;

                    string compressedJson = JsonConvert.SerializeObject(newCompressedRequest);

                    postData = compressedJson;

                }

 



                RestClient restClient = new RestClient(URLName);
                RestRequest postrequest = new RestRequest("", Method.POST);
                restClient.UseJson();
                postrequest.AddJsonBody(postData);


                var postResponse = await restClient.ExecuteAsync(postrequest);
                if (postResponse.StatusCode != System.Net.HttpStatusCode.OK)
                {

                    string x = postResponse.StatusCode.ToString() + "||"; 
                      x += "||";
                    x += postResponse.StatusDescription != null ? postResponse.StatusDescription : "";
                    x += "||";
                        x += postResponse.ErrorException !=  null  ? postResponse.ErrorException.ToString() : "";
                    x += "||";
                    x += postResponse.ErrorMessage !=  null  ?postResponse.ErrorMessage.ToString(): "";


                    return x;

                }

                return postResponse.Content.ToString();
            }





            catch (Exception ex)
            {
                Helper.Logger.LogMessage(ex);
                return null;
            }

        }
        public async static Task<string> PostABSAPIDatawithParams(string URLName, string postData, Dictionary<string, object> paramsList)
        {
            try
            {

                var x = JsonConvert.SerializeObject(postData);

                RestClient restClient = new RestClient(URLName);
                RestRequest postrequest = new RestRequest("", Method.POST);
                restClient.UseJson();
                postrequest.AddJsonBody(x);
                //foreach (var item in paramsList)
                //{
                //  //  postrequest.AddParameter("" + item.Key+":"+ item.Value);
                //    // postrequest.AddParameter("application/json", "{\""+item.Key+"\":\""+item.Value\"}", ParameterType.RequestBody);
                //     //postrequest.AddJsonBody( ""+item.Key+":"+item.Value+"");

                //} 
                var postResponse = await restClient.ExecuteAsync(postrequest);
                if (postResponse.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    return postResponse.StatusCode.ToString() + "||" + postResponse.StatusDescription + "||" + postResponse.ErrorException.ToString() + "||" + postResponse.ErrorMessage + "||" + "";

                }

                return postResponse.Content.ToString();

            }
            catch (Exception ex)
            {
                Helper.Logger.LogMessage(ex);
                return null;
            }

        }





        public async static Task<string> GetADSAPIData(string URLName)
        {
            try
            {
                RestClient restClient = new RestClient(URLName);
                RestRequest request = new RestRequest("", Method.GET);
                restClient.UseJson();

                IRestResponse<List<string>> response = await restClient.ExecuteAsync<List<string>>(request);

                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    return response.StatusCode.ToString() + "||" + response.StatusDescription + "||" + response.ErrorException.ToString() + "||" + response.ErrorMessage + "||" + "";

                }

                return response.Content.ToString();

            }
            catch (Exception ex)
            {
                Helper.Logger.LogMessage(ex);
                return null;
            }

        }
    }
}
