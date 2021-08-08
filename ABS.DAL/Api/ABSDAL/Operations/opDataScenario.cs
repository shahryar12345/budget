using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ABSDAL.Operations
{
    public class opDataScenario
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context.DataScenarios.Include(a => a.ScenarioType).ToList();
            _context.DataScenarios.Include(a => a.TimePeriod).ToList();
            



            return _context;



        }

        public static ABS.DBModels.DataScenario getDataScenarioObjbyCode(string value, BudgetingContext _context)
        {


            ABS.DBModels.DataScenario ITUpdate = _context.DataScenarios
                            .Where(a => a.DataScenarioCode.ToUpper() == value.ToString().ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
        public static ABS.DBModels.DataScenario getDataScenarioObjbyID(int value, BudgetingContext _context)
        {


            ABS.DBModels.DataScenario ITUpdate = _context.DataScenarios
                            .Where(a => a.DataScenarioID == value 


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
        public static async Task<ABS.DBModels.APIResponse> DataScenarioBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                //      var x = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string,object>>(rawText);

                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {
                    var existingDataScenarios = await _context.DataScenarios.Where(
                   f => f.IsActive == true && f.IsDeleted == false)
                  .ToListAsync();
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    string DataScenarioCode = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString() == "")

                    {
                        //errorones++;
                        //continue;
                       
                    }
                    else
                    {
                        DataScenarioCode = arrval["code"].ToString();
                    }
                    string name = HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString();

                     

                    string description = HelperFunctions.CheckKeyValuePairs(arrval, "description").ToString(); 
                    
                    if (description == "" && name == "")

                    {
                        errorones++;
                        continue;
                    }
                    
                    string Timeperiodname = HelperFunctions.CheckKeyValuePairs(arrval, "timePeriodName").ToString();

                    if (Timeperiodname =="")
                    {
                        Timeperiodname = HelperFunctions.CheckKeyValuePairs(arrval, "tmprdName").ToString();
                    }

                    if (Timeperiodname == "")
                    {
                        errorones++;
                        continue;
                    }


                    string DataScenarioType = HelperFunctions.CheckKeyValuePairs(arrval, "DataScenarioType").ToString();


                    if (DataScenarioType == "")
                    {
                        errorones++;
                        continue;
                    }
                    else
                    {

                    }
                    if (DataScenarioType =="ST")
                    {
                        description = description == "" ? name : description;
                    }
                    else
                    {

                    }
                    var itemTypesObj = _context._ItemTypes.
                        Where(a => a.IsActive == true && a.IsDeleted == false &&
                        a.ItemTypeKeyword.ToUpper() == "SCENARIOTYPE" && a.ItemTypeCode.ToUpper() == DataScenarioType.ToUpper()).FirstOrDefault();


                    
                    

                    /// Creating Object for JobCode to insert

                    ABS.DBModels.DataScenario DataScenarioNewObj = new ABS.DBModels.DataScenario();

                    
                   

 

                    DataScenarioNewObj.CreationDate = DateTime.UtcNow;
                    DataScenarioNewObj.UpdatedDate = DateTime.UtcNow;
                    DataScenarioNewObj.IsActive = true;
                    DataScenarioNewObj.IsDeleted = false;

                    DataScenarioNewObj.Identifier = Guid.NewGuid();


                    DataScenarioNewObj.DataScenarioCode = name != "" ?name : description;
                    DataScenarioNewObj.DataScenarioName = description != "" ? description: name ;
                    DataScenarioNewObj.Description =  name +"_" +description + "_" + Timeperiodname;
                    DataScenarioNewObj.ScenarioType = itemTypesObj;
                    DataScenarioNewObj.TimePeriod = opTimePeriods.getTimePeriodObjbyCode(Timeperiodname, _context);

             
 





                    var existingData = existingDataScenarios.Where(x => x.DataScenarioName.ToUpper() == description.ToUpper() 
                    && x.IsActive == true && x.IsDeleted == false).FirstOrDefault();
                    if (existingData != null)

                    {
                        duplicates++;

                     
                        existingData.Identifier = DataScenarioNewObj.Identifier;
                        existingData.IsActive = DataScenarioNewObj.IsActive;
                          existingData.IsDeleted = DataScenarioNewObj.IsDeleted;
                        existingData.DataScenarioName = DataScenarioNewObj.DataScenarioName;
                        existingData.Description = DataScenarioNewObj.Description;
                        existingData.DataScenarioCode = DataScenarioNewObj.DataScenarioCode;
                        existingData.DataScenarioName = DataScenarioNewObj.DataScenarioName;
                        existingData.Description = DataScenarioNewObj.Description;
                        existingData.TimePeriod = DataScenarioNewObj.TimePeriod;
                        existingData.ScenarioType = DataScenarioNewObj.ScenarioType;

                        existingData.UpdatedDate = DateTime.UtcNow;


                        _context.Entry(existingData).State = EntityState.Modified;


                    }
                    else
                    {


                        _context.Add(DataScenarioNewObj);


                        successones++;
                    }



                    await _context.SaveChangesAsync();

                    

                    successones++;


                }
                //  Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods> bulk = new Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods>();
                //await  bulk.BulkInsertAsync();
                ITUpdate.message += "|| Total Inserted: " + successones;
                ITUpdate.message += "|| Duplicate Record(s) : " + duplicates;
                ITUpdate.message += "|| Total Errors found:  " + errorones;




                return ITUpdate;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return null;
            }
        }


    }
}
