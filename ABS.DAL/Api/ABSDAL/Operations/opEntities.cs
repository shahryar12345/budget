using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ABSDAL.Operations
{
    public class opEntities
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context.Entities.Include(a => a.ChargeCode).ToList();
            _context.Entities.Include(a => a.Department).ToList();
            _context.Entities.Include(a => a.Account).ToList();
            _context.Entities.Include(a => a.JobCode).ToList();
            _context.Entities.Include(a => a.PayType).ToList();
            _context.Entities.Include(a => a.Address).ToList();
            _context.Entities.Include(a => a.DataSourceID).ToList();
            



            return _context;






        }

        public static ABS.DBModels.Entities getEntitiesObjbyID(int entityID, BudgetingContext _context)
        {


            ABS.DBModels.Entities ITUpdate = _context.Entities
                            .Where(a => a.EntityID == entityID


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
         public static ABS.DBModels.Entities getEntitiesObjbyCode(string entityCode, BudgetingContext _context)
        {


            ABS.DBModels.Entities ITUpdate = _context.Entities
                            .Where(a => a.EntityCode.ToUpper() == entityCode.ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }

        public static async Task<ABS.DBModels.APIResponse> EntitiesBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;
                //var importdatamethod = opItemTypes.getImportDataBy(_context);

                var existingEntities = await _context.Entities
                     .Where(d => d.IsActive == true && d.IsDeleted == false)
                     .ToListAsync(); 
                
                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                //      var x = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string,object>>(rawText);

                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {
                    Console.WriteLine(  "remaining records " + ITUpdate.totalCount--);
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    bool isGroup = false;

                    try
                    {
                        isGroup = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isGroup").ToString());
                    }
                    catch
                    {
                        isGroup = false;
                    }

                    string entityName = "";
                    string entityCode = "";
                    string entityDescription = "";
                    bool sellerOfServices = false;
                    bool buyerOfServices = false;
                    bool careDeliverFacility = false;
                    bool clinical = false;
                    bool costAccounting = false;
                    bool insuranceCarrier = false;
                    string entityTypeID = "";
                    string npiEntity = "";
                    string payPeriodCalendarID = "";
                    string fiscalYearCalendarID = "";
                    string currentMonth = "";
                    string currentDay = "";
                    string effectiveDate = "";
                    string costModelID = "";

                    if (isGroup)
                    {

                        if (HelperFunctions.CheckKeyValuePairs(arrval, "objectId").ToString() == "")

                        {
                            errorones++;
                            continue;
                        }
                        else
                        {
                            entityCode = arrval["objectId"].ToString();
                        }

                        entityName = HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString();
                        entityDescription = HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString();

                    } else
                    {

                        if (HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString() == "")

                        {
                            errorones++;
                            continue;
                        }
                        else
                        {
                            entityCode = arrval["code"].ToString();
                        }

                        entityName = HelperFunctions.CheckKeyValuePairs(arrval, "description").ToString();
                        entityDescription = HelperFunctions.CheckKeyValuePairs(arrval, "description").ToString();
                    }

                    try
                    {
                        sellerOfServices = HelperFunctions.CheckKeyValuePairs(arrval, "sellerOfServices").ToString() == "" ? false : arrval["sellerOfServices"].ToString() == "F" ? false : true;
                    }
                    catch 
                    {
                        sellerOfServices = false;
                    }
                    
                    try
                    {
                        buyerOfServices = HelperFunctions.CheckKeyValuePairs(arrval, "buyerOfServices").ToString() == "" ? false : arrval["buyerOfServices"].ToString() == "F" ? false : true;
                    }
                    catch 
                    {
                        buyerOfServices = false;
                    }

                    try
                    {
                        careDeliverFacility = HelperFunctions.CheckKeyValuePairs(arrval, "careDeliveryFacility").ToString() == "" ? false : arrval["careDeliveryFacility"].ToString() == "F" ? false : true;
                    }
                    catch
                    {
                        careDeliverFacility = false;
                    }

                    try
                    {
                        clinical = HelperFunctions.CheckKeyValuePairs(arrval, "clinical").ToString() == "" ? false : arrval["clinical"].ToString() == "F" ? false : true;
                    }
                    catch
                    {
                        clinical = false;
                    }

                    try
                    {
                        costAccounting = HelperFunctions.CheckKeyValuePairs(arrval, "costAccounting").ToString() == "" ? false : arrval["costAccounting"].ToString() == "F" ? false : true;
                    }
                    catch
                    {
                        costAccounting = false;
                    }

                    try
                    {
                        insuranceCarrier = HelperFunctions.CheckKeyValuePairs(arrval, "insuranceCarrier").ToString() == "" ? false : arrval["insuranceCarrier"].ToString() == "F" ? false : true;
                    }
                    catch
                    {
                        insuranceCarrier = false;
                    }

                    try
                    {
                        entityTypeID = HelperFunctions.CheckKeyValuePairs(arrval, "entityTypeId").ToString();
                    }
                    catch
                    {
                        entityTypeID = "";
                    }

                    try
                    {
                        npiEntity = HelperFunctions.CheckKeyValuePairs(arrval, "npiEntity").ToString();
                    }
                    catch
                    {
                        npiEntity = "";
                    }

                    try
                    {
                        payPeriodCalendarID = HelperFunctions.CheckKeyValuePairs(arrval, "payPeriodCalendarId").ToString();
                    }
                    catch
                    {
                        payPeriodCalendarID = "";
                    }

                    try
                    {
                        fiscalYearCalendarID = HelperFunctions.CheckKeyValuePairs(arrval, "fiscalYearCalendarId").ToString();
                    }
                    catch
                    {
                        fiscalYearCalendarID = "";
                    }

                    try
                    {
                        currentMonth = HelperFunctions.CheckKeyValuePairs(arrval, "currentMonth").ToString();
                    }
                    catch
                    {
                        currentMonth = "";
                    }

                    try
                    {
                        currentDay = HelperFunctions.CheckKeyValuePairs(arrval, "currentDay").ToString();
                    }
                    catch
                    {
                        currentDay = "";
                    }

                    try
                    {
                        effectiveDate = HelperFunctions.CheckKeyValuePairs(arrval, "effectiveDate").ToString();
                    }
                    catch
                    {
                        effectiveDate = "";
                    }

                    try
                    {
                        costModelID = HelperFunctions.CheckKeyValuePairs(arrval, "costModelId").ToString();
                    }
                    catch
                    {
                        costModelID = "";
                    }

                    


                     var existingEntityRecord = existingEntities.Where(f => f.EntityCode == entityCode).FirstOrDefault();


                    if (existingEntityRecord != null )
                    {
                        duplicates++;
                        //var ToDelete =   _context.TimePeriods.Where(x => x.TimePeriodName.ToUpper() == tpname.ToUpper()).FirstOrDefault();
                        //  _context.TimePeriods.Remove(ToDelete);

                        ABS.DBModels.Entities existingEntity = existingEntityRecord;

                        existingEntity.Description = entityDescription;
                        existingEntity.EntityName = entityName;
                        existingEntity.SellerOfServices = sellerOfServices;
                        existingEntity.BuyerOfService = buyerOfServices;
                        existingEntity.CareDeliverFacility = careDeliverFacility;
                        existingEntity.Clinical = clinical;
                        existingEntity.CostAccounting = costAccounting;
                        existingEntity.InsuranceCarrier = insuranceCarrier;
                        existingEntity.EntityTypeId = entityTypeID;
                        existingEntity.npiEntity = npiEntity;
                        existingEntity.PayPeriodCalendarId = payPeriodCalendarID;
                        existingEntity.FiscalYearCalendarId = fiscalYearCalendarID;
                        existingEntity.CurrentMonth = currentMonth;
                        existingEntity.CurrentDay = currentDay;
                        existingEntity.EffectiveDate = effectiveDate;
                        existingEntity.CostModelId = costModelID;
                        existingEntity.isGroup = isGroup;

                        _context.Entry(existingEntity).State = EntityState.Modified;
                    } 
                        else
                    {
                        ABS.DBModels.Entities nEntity = new ABS.DBModels.Entities();

                        nEntity.CreationDate = DateTime.UtcNow;
                        nEntity.UpdatedDate = DateTime.UtcNow;
                        nEntity.IsActive = true;
                        nEntity.IsDeleted = false;

                        nEntity.Identifier = Guid.NewGuid();
                        nEntity.EntityCode = entityCode;
                        nEntity.Description = entityDescription;

                        nEntity.EntityName = entityName;
                        nEntity.SellerOfServices = sellerOfServices;
                        nEntity.BuyerOfService = buyerOfServices;
                        nEntity.CareDeliverFacility = careDeliverFacility;
                        nEntity.Clinical = clinical;
                        nEntity.CostAccounting = costAccounting;
                        nEntity.InsuranceCarrier = insuranceCarrier;

                        nEntity.EntityTypeId = entityTypeID;
                        nEntity.npiEntity = npiEntity;
                        nEntity.PayPeriodCalendarId = payPeriodCalendarID;
                        nEntity.FiscalYearCalendarId = fiscalYearCalendarID;
                        nEntity.CurrentMonth = currentMonth;
                        nEntity.CurrentDay = currentDay;
                        nEntity.EffectiveDate = effectiveDate;
                        nEntity.CostModelId = costModelID;
                        nEntity.isGroup = isGroup;

                        _context.Add(nEntity);
                        existingEntities.Add(nEntity);
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

        internal async static Task<List<Entities>> getAllEntities(BudgetingContext _context)
        {
            List<Entities> ITUpdate = await _context.Entities
                          .Where(a => 
                           a.IsDeleted == false && a.IsActive == true)
                          .ToListAsync();





            return ITUpdate;
        }

        public static async Task<ABS.DBModels.APIResponse> EntityRelationshipsBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
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
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    string relationshipType = "";

                    try
                    {
                        relationshipType = HelperFunctions.CheckKeyValuePairs(arrval, "relationshipType").ToString();
                    }
                    catch
                    {
                        relationshipType = "";
                    }

                    switch (relationshipType)
                    {
                        case "Group":

                            var entityGroup = _context.Entities.Where(eg => eg.isGroup == true && eg.EntityCode == HelperFunctions.CheckKeyValuePairs(arrval, "entityCodeGroupObjectId").ToString()).FirstOrDefault();

                            if (entityGroup == null)
                            {
                                entityGroup = _context.Entities.Where(eg => eg.isGroup == true && eg.EntityName == HelperFunctions.CheckKeyValuePairs(arrval, "groupName").ToString()).FirstOrDefault();

                            }

                            var entity = _context.Entities.Where(eg => eg.EntityCode == HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString()).FirstOrDefault();

                            var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "ENTITY", "GROUP", entityGroup.EntityID, entity.EntityID);
                            successones++;
                            break;
                        default:
                            errorones++;
                            break;
                    }

 

                    

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
                Logger.LogError(ex);
                return null;
            }
        }
    }
}
