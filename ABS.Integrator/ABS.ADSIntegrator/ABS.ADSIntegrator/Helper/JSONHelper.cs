using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.ADSIntegrator.Helper
{
    public class JSONHelper
    {


        public static string AddFieldToJsonArrary(string jsonText, string fieldname, string fieldvalue)
        {
            var jsonarray = JArray.Parse(jsonText);

      //      var jObj = JObject.Parse(jsonText);
            foreach (var item in jsonarray )
            {
                item[fieldname] = fieldvalue;
            }
            var newjson = jsonarray.ToString(Newtonsoft.Json.Formatting.Indented);

            return newjson;
        }
    }
}
