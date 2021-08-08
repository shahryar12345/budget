using ABS.DBModels;
using ABSDAL.Context;
using ABSDAL.Operations;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSDAL.Services
{
    public class RequestValidationProcess<T> where T : class
    {

        APIResponse APIResponse { get; set; } = new APIResponse();

        List<Dictionary<string, object>> parsedValues { get; set; } = new List<Dictionary<string, object>>();

        ConcurrentBag<T> TObjListAsync { get; set; } = new ConcurrentBag<T>();

        ConcurrentBag<T> NewData { get; set; }
        ConcurrentBag<T> UpdatedData { get; set; }



        int Jerrorones { get; set; } = 0;
        int Jsuccessones { get; set; } = 0;
        
        int Merrorones { get; set; } = 0;
        int Msuccessones { get; set; } = 0;
        
        public IBackgroundTaskQueue Queue { get; }

        public BudgetingContext _context = null;


        public RequestValidationProcess(ABSDAL.Context.BudgetingContext _contxt, IBackgroundTaskQueue queue)
        {
            this._context = _contxt;
            Queue = queue;

        }
        public async Task<ABS.DBModels.APIResponse> JSONValidationProcess(System.Text.Json.JsonElement rawText, bool deleteOldRecords)

        {

            /*
             
             
             Get Json
            Uncompress JSON 
            Parse Json

            Get list of Objects

            Load Master Data (needed for Model/JSON data)

            Each Item
            parse Dictionary object
            Parse JSON to Model
    


            Return with validation message.
            Delete if Required
            If NEW - Insert
            If Existing - Update

             
             
             */

            try
            {

                await Task.Delay(1);

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);
                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);


                APIResponse.message += "|| Total Records: " + values.Count();

                string ProcessingMethod = getProcessingMethod();

                if (ProcessingMethod == "VALIDATIONPARALLEL")
                {

                    Parallel.ForEach(values, (item, state, index) =>
                    {
                        Logger.Loginfo ("RQV_Current Index: " + index,"RQV_PL");
                        if (ValidateJSON(item))
                        {
                            Jsuccessones++;


                        }
                        else
                        {
                            Jerrorones++;
                           // return;
                        }
                        if (ValidateModel(item))
                        {
                            Msuccessones++;


                        }
                        else
                        {
                            Merrorones++;
                            return;
                        }

                    });

                }
                else
               if (ProcessingMethod == "VALIDATIONNORMAL")
                {
                    int loopindex = 0;
                    foreach (var item in values)
                    {
                        loopindex++;
                        Console.WriteLine("RQV_Current Index: " + loopindex,"RQV_Norm");

                        if (ValidateJSON(item))
                        {

                            Jsuccessones++;

                        }
                        else
                        {
                            Jerrorones++;
                          //  continue;
                        }
                        if (ValidateModel(item))
                        {

                            Msuccessones++;

                        }
                        else
                        {
                            Merrorones++;
                            continue;
                        }

                    }

                }
                APIResponse.message += "|| JSON Validation Success(s) : " + Jsuccessones;
                APIResponse.message += "|| JSON Validation Error(s) found:  " + Jerrorones;
             
         
               
                APIResponse.message += "|| Model Validation Success:" + Msuccessones;
                APIResponse.message += "|| Model Validation Errors:" + Merrorones;

                if (Merrorones > 0 && Msuccessones > 0)
                {
                    APIResponse.message += "||Some Records parsed Successfully";
                    APIResponse.error = "Some records not parsed correctly. ";
                }
                else if (Merrorones > 0 && Msuccessones == 0)
                {
                    APIResponse.error = "Error Parsing Records. ";
                }
                else if (Merrorones == 0 && Msuccessones > 0)
                {
                    APIResponse.message += Environment.NewLine + "||All Records parsed Successfully";
                }


                return APIResponse;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                throw;
            }
            finally
            {

            }
        }

        private void RunBGJob()
        {
            for (int i = 0; i < 2000; i++)
            {
                Console.WriteLine(i);
                Task.Delay(1000);
            }
        }

        public string getProcessingMethod()
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "PROCESSMETHOD", _context);


            return ProcessingMethod.ItemTypeValue;
        }




        private bool ValidateJSON(object item)
        {
            try
            {
                var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                //  parsedValues.Add(arrval);
 
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return false;
            }

        }
        private bool ValidateModel(object item)
        {
            try
            { 

                var itemObj = JsonConvert.DeserializeObject<T>(item.ToString());

                // TObjListAsync.Add(itemObj);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return false;
            }

        }





    }
}
