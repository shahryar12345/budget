using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ABSDAL.Operations
{
    public class opChargeCodes
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context.ChargeCodes.Include(a => a.Department).ToList();
            



            return _context;






        }

        //internal static Task ChargeCodeBulkInsert(JsonElement rawText, string recordType, BudgetingContext context)
        //{
        //    throw new NotImplementedException();
        //}

        public static async Task<ABS.DBModels.APIResponse> ChargeCodeBulkInsert(System.Text.Json.JsonElement rawText
            ,  BudgetingContext _context)
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
                    var existingtps = await _context.ChargeCodes.Where(
                  f => f.IsActive == true && f.IsDeleted == false)
                 .ToListAsync();

                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    string cmCode = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString() == "")

                    {
                        errorones++;
                        continue;
                    }
                    else
                    {
                        cmCode = arrval["code"].ToString();
                    }

                  
                    string name = HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString();


                    if (name == "" || name == "null")

                    {
                        //errorones++;
                        //continue;
                    }
                      string deptname = HelperFunctions.CheckKeyValuePairs(arrval, "deptMastCode").ToString();


                    if (deptname == "" || deptname == "null")

                    {
                        //errorones++;
                        //continue;
                    }


                    ABS.DBModels.ChargeCodes ntimeperiod = new ABS.DBModels.ChargeCodes();


                    Boolean isMemberData = false;

                    try
                    {
                        isMemberData = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isMemberData").ToString());
                    }
                    catch
                    {
                        isMemberData = false;
                    }


                    Boolean isGroup = false;

                    try
                    {
                        isGroup = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isGroup").ToString());
                    }
                    catch
                    {
                        isGroup = false;
                    }
                    Boolean isMaster = false;

                    try
                    {
                        isMaster = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isMaster").ToString());
                    }
                    catch
                    {
                        isMaster = false;
                    }




                    ntimeperiod.CreationDate = DateTime.UtcNow;
                    ntimeperiod.UpdatedDate = DateTime.UtcNow;
                    ntimeperiod.IsActive = true;
                    ntimeperiod.IsDeleted = false;

                    ntimeperiod.Identifier = Guid.NewGuid();
                    ntimeperiod.ChargeCode = cmCode;
                    ntimeperiod.IsMaster = isMaster;
                    ntimeperiod.ChargeCodeName = name;
                    ntimeperiod.Department = opDepartments.getDepartmentObjbyCode(deptname, _context);


                    var existingChargeCode = existingtps.Where(x => x.ChargeCode == cmCode
                   && x.IsActive == true && x.IsDeleted == false).FirstOrDefault();




                    if (existingChargeCode != null)
                    {
                        duplicates++;




                        existingChargeCode.ChargeCodeName = ntimeperiod.ChargeCodeName;
                        existingChargeCode.UpdatedDate = DateTime.UtcNow;
                        existingChargeCode.Department = ntimeperiod.Department;
                        existingChargeCode.IsMaster = ntimeperiod.IsMaster;


                        _context.Entry(existingChargeCode).State = EntityState.Modified;

                        



                    }
                    else
                    {


                        _context.Add(ntimeperiod);
                      

                        successones++;
                    }

                    await _context.SaveChangesAsync();



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
