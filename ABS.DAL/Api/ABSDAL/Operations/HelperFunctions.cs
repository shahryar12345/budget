using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using ABS.DBModels;
using System.IO;

using System.Text;

using System.Runtime.Serialization.Json;

namespace ABSDAL.Operations
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
        public static string ParseValue(Dictionary<string, object> DataObj, string keyName)
        {

            try
            {
                string ParsingResult = "";
                if (HelperFunctions.CheckKeyValuePairs(DataObj, keyName).ToString() == "")

                {
                    //return string.Empty;
                }
                else
                {
                    ParsingResult = DataObj[keyName].ToString();
                }

                return ParsingResult;
            }
            catch (Exception ex)
            {

                Logger.LogError(ex);
                return null;
            }
        }

        public static Dictionary<string, decimal> PopulateDictionary(Dictionary<string, decimal> NewDataObj, Dictionary<string, object> SourceData, string _keyname, string _keyvalue)
        {

            try
            {

                string checkkey = CheckKeyValuePairs(SourceData, _keyname).ToString();




                if (checkkey == "")
                {

                }
                else
                {
                    string MonthName = GetMonthName(checkkey);

                    string checkvalue = CheckKeyValuePairs(SourceData, _keyvalue).ToString();

                    decimal monthvalue = decimal.Zero;
                    decimal.TryParse(checkvalue, out monthvalue);



                    NewDataObj.Add(MonthName, monthvalue);

                }
                return NewDataObj;

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
        public static decimal GetNotNullValue(object objA, object objB)
        {

            if (objA == null && objB == null)
            {
                return decimal.Zero;
            }
            if (objA != null && objB == null)
            {
                return decimal.Parse(objA.ToString());
            }
            if (objA == null && objB != null)
            {
                return decimal.Parse(objB.ToString());
            }
            if (objA != null && objB != null)
            {
                return decimal.Parse(objB.ToString());
            }

            return decimal.Zero;


        }


        public static bool CompareAllMonthValuesSF(BudgetVersionStaffing objA, BudgetVersionStaffing objB)
        {
            bool allTrue = true;

            if (objA.January != null && objB.January != null && objA.January != objB.January)
            {
                return false;
            }
            if (objA.February != null && objB.February != null && objA.February != objB.February)
            {
                return false;
            }
            if (objA.March != null && objB.March != null && objA.March != objB.March)
            {
                return false;
            }
            if (objA.April != null && objB.April != null && objA.April != objB.April)
            {
                return false;
            }
            if (objA.May != null && objB.May != null && objA.May != objB.May)
            {
                return false;
            }
            if (objA.June != null && objB.June != null && objA.June != objB.June)
            {
                return false;
            }
            if (objA.July != null && objB.July != null && objA.July != objB.July)
            {
                return false;
            }
            if (objA.August != null && objB.August != null && objA.August != objB.August)
            {
                return false;
            }
            if (objA.September != null && objB.September != null && objA.September != objB.September)
            {
                return false;
            }
            if (objA.October != null && objB.October != null && objA.October != objB.October)
            {
                return false;
            }
            if (objA.November != null && objB.November != null && objA.November != objB.November)
            {
                return false;
            }
            if (objA.December != null && objB.December != null && objA.December != objB.December)
            {
                return false;
            }
            if (objA.rowTotal != null && objB.rowTotal != null && objA.rowTotal != objB.rowTotal)
            {
                return false;
            }



            return allTrue;
        }
        public static bool CompareAllMonthValuesActualSF(StaffingData objA, StaffingData objB)
        {
            bool allTrue = true;

            if (objA.January != null && objB.January != null && objA.January != objB.January)
            {
                return false;
            }
            if (objA.February != null && objB.February != null && objA.February != objB.February)
            {
                return false;
            }
            if (objA.March != null && objB.March != null && objA.March != objB.March)
            {
                return false;
            }
            if (objA.April != null && objB.April != null && objA.April != objB.April)
            {
                return false;
            }
            if (objA.May != null && objB.May != null && objA.May != objB.May)
            {
                return false;
            }
            if (objA.June != null && objB.June != null && objA.June != objB.June)
            {
                return false;
            }
            if (objA.July != null && objB.July != null && objA.July != objB.July)
            {
                return false;
            }
            if (objA.August != null && objB.August != null && objA.August != objB.August)
            {
                return false;
            }
            if (objA.September != null && objB.September != null && objA.September != objB.September)
            {
                return false;
            }
            if (objA.October != null && objB.October != null && objA.October != objB.October)
            {
                return false;
            }
            if (objA.November != null && objB.November != null && objA.November != objB.November)
            {
                return false;
            }
            if (objA.December != null && objB.December != null && objA.December != objB.December)
            {
                return false;
            }
            if (objA.Value != null && objB.Value != null && objA.Value != objB.Value)
            {
                return false;
            }



            return allTrue;
        }

        public static bool CompareAllMonthValuesST(BudgetVersionStatistics objA, BudgetVersionStatistics objB)
        {
            bool allTrue = true;

            if (objA.January != null && objB.January != null && objA.January != objB.January)
            {
                return false;
            }
            if (objA.February != null && objB.February != null && objA.February != objB.February)
            {
                return false;
            }
            if (objA.March != null && objB.March != null && objA.March != objB.March)
            {
                return false;
            }
            if (objA.April != null && objB.April != null && objA.April != objB.April)
            {
                return false;
            }
            if (objA.May != null && objB.May != null && objA.May != objB.May)
            {
                return false;
            }
            if (objA.June != null && objB.June != null && objA.June != objB.June)
            {
                return false;
            }
            if (objA.July != null && objB.July != null && objA.July != objB.July)
            {
                return false;
            }
            if (objA.August != null && objB.August != null && objA.August != objB.August)
            {
                return false;
            }
            if (objA.September != null && objB.September != null && objA.September != objB.September)
            {
                return false;
            }
            if (objA.October != null && objB.October != null && objA.October != objB.October)
            {
                return false;
            }
            if (objA.November != null && objB.November != null && objA.November != objB.November)
            {
                return false;
            }
            if (objA.December != null && objB.December != null && objA.December != objB.December)
            {
                return false;
            }
            if (objA.rowTotal != null && objB.rowTotal != null && objA.rowTotal != objB.rowTotal)
            {
                return false;
            }



            return allTrue;
        }
        public static bool CompareAllMonthValuesActualST(StatisticalData objA, StatisticalData objB)
        {

            bool allTrue = true;

            if (objA.January != null && objB.January != null && objA.January != objB.January)
            {
                return false;
            }
            if (objA.February != null && objB.February != null && objA.February != objB.February)
            {
                return false;
            }
            if (objA.March != null && objB.March != null && objA.March != objB.March)
            {
                return false;
            }
            if (objA.April != null && objB.April != null && objA.April != objB.April)
            {
                return false;
            }
            if (objA.May != null && objB.May != null && objA.May != objB.May)
            {
                return false;
            }
            if (objA.June != null && objB.June != null && objA.June != objB.June)
            {
                return false;
            }
            if (objA.July != null && objB.July != null && objA.July != objB.July)
            {
                return false;
            }
            if (objA.August != null && objB.August != null && objA.August != objB.August)
            {
                return false;
            }
            if (objA.September != null && objB.September != null && objA.September != objB.September)
            {
                return false;
            }
            if (objA.October != null && objB.October != null && objA.October != objB.October)
            {
                return false;
            }
            if (objA.November != null && objB.November != null && objA.November != objB.November)
            {
                return false;
            }
            if (objA.December != null && objB.December != null && objA.December != objB.December)
            {
                return false;
            }
            if (objA.Value != null && objB.Value != null && objA.Value != objB.Value)
            {
                return false;
            }



            return allTrue;
        }
        public static bool CompareAllMonthValuesGL(BudgetVersionGLAccounts objA, BudgetVersionGLAccounts objB)
        {
            bool allTrue = true;

            if (objA.January != null && objB.January != null && objA.January != objB.January)
            {
                return false;
            }
            if (objA.February != null && objB.February != null && objA.February != objB.February)
            {
                return false;
            }
            if (objA.March != null && objB.March != null && objA.March != objB.March)
            {
                return false;
            }
            if (objA.April != null && objB.April != null && objA.April != objB.April)
            {
                return false;
            }
            if (objA.May != null && objB.May != null && objA.May != objB.May)
            {
                return false;
            }
            if (objA.June != null && objB.June != null && objA.June != objB.June)
            {
                return false;
            }
            if (objA.July != null && objB.July != null && objA.July != objB.July)
            {
                return false;
            }
            if (objA.August != null && objB.August != null && objA.August != objB.August)
            {
                return false;
            }
            if (objA.September != null && objB.September != null && objA.September != objB.September)
            {
                return false;
            }
            if (objA.October != null && objB.October != null && objA.October != objB.October)
            {
                return false;
            }
            if (objA.November != null && objB.November != null && objA.November != objB.November)
            {
                return false;
            }
            if (objA.December != null && objB.December != null && objA.December != objB.December)
            {
                return false;
            }
            if (objA.rowTotal != null && objB.rowTotal != null && objA.rowTotal != objB.rowTotal)
            {
                return false;
            }



            return allTrue;
        }
        public static bool CompareAllMonthValuesActualGL(StatisticalData objA, StatisticalData objB)
        {
            bool allTrue = true;

            if (objA.January != null && objB.January != null && objA.January != objB.January)
            {
                return false;
            }
            if (objA.February != null && objB.February != null && objA.February != objB.February)
            {
                return false;
            }
            if (objA.March != null && objB.March != null && objA.March != objB.March)
            {
                return false;
            }
            if (objA.April != null && objB.April != null && objA.April != objB.April)
            {
                return false;
            }
            if (objA.May != null && objB.May != null && objA.May != objB.May)
            {
                return false;
            }
            if (objA.June != null && objB.June != null && objA.June != objB.June)
            {
                return false;
            }
            if (objA.July != null && objB.July != null && objA.July != objB.July)
            {
                return false;
            }
            if (objA.August != null && objB.August != null && objA.August != objB.August)
            {
                return false;
            }
            if (objA.September != null && objB.September != null && objA.September != objB.September)
            {
                return false;
            }
            if (objA.October != null && objB.October != null && objA.October != objB.October)
            {
                return false;
            }
            if (objA.November != null && objB.November != null && objA.November != objB.November)
            {
                return false;
            }
            if (objA.December != null && objB.December != null && objA.December != objB.December)
            {
                return false;
            }
            if (objA.Value != null && objB.Value != null && objA.Value != objB.Value)
            {
                return false;
            }



            return allTrue;
        }

        public static string GetMonthName(string dateobj)
        {
            DateTime valueperiod = DateTime.Now;

            valueperiod = DateTime.Parse(dateobj);

            string Monthname = valueperiod.ToString("MMMM");

            return Monthname;
        }

        public static IEnumerable<IEnumerable<T>> Splitdata<T>(IEnumerable<T> items,
                                                    int numOfParts)
        {
            int i = 0;
            return items.GroupBy(x => i++ % numOfParts);
        }


        public static IEnumerable<int> DistributeInteger(int total, int divider)
        {
            if (divider == 0)
            {
                yield return 0;
            }
            else
            {
                int rest = total % divider;
                double result = total / (double)divider;

                for (int i = 0; i < divider; i++)
                {
                    if (rest-- > 0)
                        yield return (int)Math.Ceiling(result);
                    else
                        yield return (int)Math.Floor(result);
                }
            }
        }


        public static object ToType<T>(object obj, T type)
        {

            //create instance of T type object:
            var tmp = Activator.CreateInstance(Type.GetType(type.ToString()));

            //loop through the properties of the object you want to covert:          
            foreach (PropertyInfo pi in obj.GetType().GetProperties())
            {
                try
                {

                    //get the value of property and try 
                    //to assign it to the property of T type object:
                    tmp.GetType().GetProperty(pi.Name).SetValue(tmp,
                                              pi.GetValue(obj, null), null);
                }
                catch { }
            }

            //return the T type object:         
            return tmp;
        }



        public static string SerializeJson<T>(T obj)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());
            MemoryStream ms = new MemoryStream();
            serializer.WriteObject(ms, obj);
            string retVal = Encoding.UTF8.GetString(ms.ToArray());
            return retVal;
        }

        public static T DeserializeJson<T>(string json)
        {
            T obj = Activator.CreateInstance<T>();
            MemoryStream ms = new MemoryStream(Encoding.Unicode.GetBytes(json));
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());
            obj = (T)serializer.ReadObject(ms);
            ms.Close();
            return obj;
        }

    }
    public class relationsFormat
    {
        public object parent { get; set; }
        public List<object> child { get; set; }
    }

    public class JsonFormat
    {

        public JsonElement rawText { get; set; }
        public string recordType { get; set; }
    }

    public class ParamObj
    {
        public string ID { get; set; }
    }
    public class SingleJsonObj
    {
        public string strkey { get; set; }
        public string strvalue { get; set; }
    }
}
