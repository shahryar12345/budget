using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Reflection;
using ABSProcessing.Context;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.IO;

namespace ABSProcessing.Operations
{
    public class HelperFunctions
    {


        public static Dictionary<string, object> getJSONArrayObject(JsonElement jsonString)
        {

            try
            {
                var SSObj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(jsonString.ToString());
                return SSObj;

            }
            catch (Exception ex)
            {

                Logger.LogError(ex);
                return null;
            }
        }  
        
        

        public static object CheckKeyValuePairs(Dictionary<string, object> DataObj, string keyName)
        {

            try
            {
                if (DataObj.ContainsKey(keyName))
                {
                    if (DataObj[keyName] != null)
                    {
                        if (DataObj[keyName].ToString().Length > 0)
                        {
                            object keyvaluepair = DataObj[keyName];
                            return keyvaluepair;
                        }
                        else
                        {
                            return "";
                        }
                    }
                    else
                    {
                        return "";
                    }

                }
                else
                {
                    return "";

                }






            }
            catch (Exception ex)
            {

                Logger.LogError(ex);
                return null;
            }
        }


        public static bool TrySetProperty(object obj, string property, object value)
        {
            var prop = obj.GetType().GetProperty(property, BindingFlags.Public | BindingFlags.Instance);
            if (prop != null && prop.CanWrite)
            {

                prop.SetValue(obj, value, null);

                return true;
            }
            return false;
        }

        public static object TryGetProperty(object obj, string property)
        {
            var prop = obj.GetType().GetProperty(property, BindingFlags.Public | BindingFlags.Instance);
            if (prop != null && prop.CanWrite)
            {

              var propval =   prop.GetValue( obj,   null);

                return propval;
                
            }
            return false;
        }

        public async static Task<T> GetItembyPredicate<T>(Expression<Func<T, bool>> exp, BudgetingContext _context) where T : class
        {
            try
            {
                await Task.Delay(1);

                var cntxt = _context.Set<T>();

                var res = await cntxt.Where(exp).FirstOrDefaultAsync();
                //  Console.WriteLine("GetItembyPredicate Count: "+  res.Count());

                return res;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                //Helper.Logger.LogError(ex, _context);
                return null;
            }
        }

        public async static Task<T> GetDynmaicLinqExpression<T>(Expression<Func<T, bool>> exp, BudgetingContext _context) where T : class
        {
            try
            {
                await Task.Delay(1);

                var cntxt = _context.Set<T>();

                var res = await cntxt.Where(exp).FirstOrDefaultAsync();
                //  Console.WriteLine("GetItembyPredicate Count: "+  res.Count());

                return res;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                //Helper.Logger.LogError(ex, _context);
                return null;
            }
        }

        public static string ConvertLINQResultsToCSV(IQueryable query, string replacementDelimiter)
        {

            // Create the csv by looping through each row and then each field in each row
            // seperating the columns by commas

            // String builder for our header row
            StringBuilder header = new StringBuilder();

            // Get the properties (aka columns) to set in the header row
            PropertyInfo[] rowPropertyInfos = null;
            rowPropertyInfos = query.ElementType.GetProperties();

            // Setup header row 
            foreach (PropertyInfo info in rowPropertyInfos)
            {
                if (info.CanRead)
                {
                    header.Append(info.Name + ",");
                }
            }

            // New row
            header.Append("\r\n");

            // String builder for our data rows
            StringBuilder data = new StringBuilder();

            // Setup data rows
            foreach (var myObject in query)
            {

                // Loop through fields in each row seperating each by commas and replacing 
                // any commas in each field name with replacement delimiter
                foreach (PropertyInfo info in rowPropertyInfos)
                {
                    if (info.CanRead)
                    {

                        // Get the fields value and then replace any commas with the replacement delimeter
                        string tmp = Convert.ToString(info.GetValue(myObject, null));
                        if (!String.IsNullOrEmpty(tmp))
                        {
                            tmp.Replace(",", replacementDelimiter);
                        }
                        data.Append(tmp + ",");
                    }
                }

                // New row
                data.Append("\r\n");
            }

            // Check the data results... if they are empty then return an empty string
            // otherwise append the data to the header
            string result = data.ToString();
            if (string.IsNullOrEmpty(result) == false)
            {
                header.Append(result);
                return header.ToString();
            }
            else
            {
                return string.Empty;
            }
        }

        public static string getfilepath(string directoryName, string reportcode)
        {
            if (!Directory.Exists(directoryName)) { Directory.CreateDirectory(directoryName); }
           var reportpath = directoryName +@"\" + "" + reportcode+ "_" + DateTime.UtcNow.ToString("yyyyMMddhhmmss") + "" + ".csv";

            string path = Path.Combine(Environment.CurrentDirectory, reportpath);

            return path;
        }

        public static bool CreateoutputFile(string csvstring, string path)
        {
            try
            {
                using FileStream fs = File.Create(path);
                using var sr = new StreamWriter(fs);

                sr.WriteLine(csvstring);

                sr.Flush();
                sr.Close();
                sr.Dispose();
                //fs.Flush();
                fs.Close();
                fs.Dispose();
                return true;
            }
            catch (Exception)
            {
                Console.WriteLine("Error File Saving: ");
                return false;
            }
        }


    }
}
