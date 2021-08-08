using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ABSDAL.Operations
{
    public class opPayTypes
    {
        public static BudgetingContext getContext(BudgetingContext _context)
        {
            _context.PayTypes.Include(a => a.PayTypeMaster).ToList();
            _context.PayTypes.Include(a => a.PayTypeType).ToList();
              

            return _context;
        }

        public static async Task<ABS.DBModels.APIResponse> PayTypesBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);
                var importdatamethod = opItemTypes.getImportDataBy(_context);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {
                    var existingPayTypes = await _context.PayTypes.Where(
                   f => f.IsActive == true && f.IsDeleted == false)
                  .ToListAsync();

                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    string objectid = HelperFunctions.ParseValue(arrval, "objectId");
                    string payTypesCode = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString() == "")

                    {
                        errorones++;
                        //continue;
                        if (HelperFunctions.CheckKeyValuePairs(arrval, "objectId").ToString() == "")

                        {
                            
                        }
                        else
                        {
                            payTypesCode = arrval["objectId"].ToString();
                        }
                    }
                    else
                    {
                        payTypesCode = arrval["code"].ToString();
                    }


                    string description = HelperFunctions.CheckKeyValuePairs(arrval, "description").ToString();
                    string name = HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString();


                    if (name == "")
                    {
                        name = HelperFunctions.CheckKeyValuePairs(arrval, "groupName").ToString();
                    }

                    string columnlabel = HelperFunctions.CheckKeyValuePairs(arrval, "columnLabel").ToString();

                    /// Creating Object for PAYTYPE to insert

                    ABS.DBModels.PayTypes payTypeObj = new ABS.DBModels.PayTypes();

                    var itemTypesList = _context._ItemTypes.ToList();

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
                    Boolean accumlate = false;

                    try
                    {
                        accumlate = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "accumulateHours").ToString());
                    }
                    catch
                    {
                        accumlate = false;
                    }
                    string highcode = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "highcode").ToString() == "")

                    {

                    }
                    else
                    {
                        highcode = arrval["highcode"].ToString();
                    }


                    string lowcode = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "lowCode").ToString() == "")

                    {

                    }
                    else
                    {
                        lowcode = arrval["lowcode"].ToString();
                    }
                    string paytypeMasterid = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "payTypeMasterId").ToString() == "")

                    {

                    }
                    else
                    {
                        paytypeMasterid = arrval["payTypeMasterId"].ToString();
                    }
                     string paytypeMastercode = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "payTypeMasterCode").ToString() == "")

                    {

                    }
                    else
                    {
                        paytypeMastercode = arrval["payTypeMasterCode"].ToString();
                    }


                    string paytypeMasterCodebyID = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "masterCodeId").ToString() == "")
                    {

                    }
                    else
                    {
                        paytypeMasterCodebyID = arrval["masterCodeId"].ToString();
                    }
                    
                    string payTypeTypeCode = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "payTypeTypeCode").ToString() == "")
                    {

                    }
                    else
                    {
                        payTypeTypeCode = arrval["payTypeTypeCode"].ToString();
                    }

                    var paytypemasterobj = existingPayTypes.Where(a => a.PayTypeCode == paytypeMastercode).FirstOrDefault();

                    if (isMemberData)
                    {
                        // IF IT IS MEMBERDATA than Need to add Relationship Data only for Group and Master not PayTYpe

                        if (name != "")
                        {
                            var groupID = existingPayTypes.Where(a => a.PayTypeName == name).FirstOrDefault().PayTypeID;
                            var groupMembercodeID = existingPayTypes.Where(a => a.PayTypeCode == payTypesCode).FirstOrDefault().PayTypeID;

                          var x =   await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "PAYTYPE", "GROUP", groupID, groupMembercodeID);
                        }

                        continue;



                    }
                    else
                    {

                    }



                    payTypeObj.CreationDate = DateTime.UtcNow;
                    payTypeObj.UpdatedDate = DateTime.UtcNow;
                    payTypeObj.IsActive = true;
                    payTypeObj.IsDeleted = false;

                    payTypeObj.Identifier = Guid.NewGuid();


                    payTypeObj.PayTypeCode = payTypesCode;
                    payTypeObj.PayTypeName = name != "" ? name : description != "" ? description : columnlabel;
                    payTypeObj.PayTypeDescription = description != "" ? description : objectid;

                    payTypeObj.IsGroup = isGroup;
                    payTypeObj.IsMaster = isMaster;
                    payTypeObj.Lowcode = lowcode;
                    payTypeObj.HighCode = highcode;
                    payTypeObj.AccumulateHours = accumlate;

                  
                    if (paytypemasterobj == null)
                    {
                        paytypemasterobj = existingPayTypes.Where(a => a.PayTypeCode == paytypeMastercode).FirstOrDefault();

                    }

                    if (paytypemasterobj != null)
                    {
                        payTypeObj.PayTypeMaster = paytypemasterobj;
                    }
                    if (paytypemasterobj == null && importdatamethod == "MASTER"   && isMaster == false && isGroup == false && isMemberData == false)
                    {
                        continue;
                    }
                    //if (paytypemasterobj == null && importdatamethod == "GROUP")
                    //{
                    //    continue;
                    //}




                    payTypeObj.PayTypeType = itemTypesList.Where(f => f.ItemTypeKeyword == "PAYTYPETYPE" && f.ItemTypeCode.ToUpper() == payTypeTypeCode).FirstOrDefault();


                    var existingData = existingPayTypes.Where(x => x.PayTypeCode.ToUpper() == payTypesCode.ToUpper()).FirstOrDefault();
                    if (existingData != null)

                    {
                        duplicates++;

                        //var dtrep = new Repository.GenericRepository<ABS.DBModels.PayTypes>(_context);
                        //var existingData = dtrep.Get(existingPayTypes.Where(s => s. .ToUpper() == tpname.ToUpper()).FirstOrDefault().Key);



                        existingData.AccumulateHours = payTypeObj.AccumulateHours;
                        existingData.HighCode = payTypeObj.HighCode;
                        existingData.Identifier = payTypeObj.Identifier;
                        existingData.IsActive = payTypeObj.IsActive;
                        existingData.IsGroup = payTypeObj.IsGroup;
                        existingData.IsDeleted = payTypeObj.IsDeleted;
                        existingData.IsMaster = payTypeObj.IsMaster;
                        existingData.Lowcode = payTypeObj.Lowcode;
                        existingData.PayTypeCode = payTypeObj.PayTypeCode;
                        existingData.PayTypeDescription = payTypeObj.PayTypeDescription;
                        existingData.PayTypeMaster = payTypeObj.PayTypeMaster;
                        existingData.PayTypeName = payTypeObj.PayTypeName;
                        existingData.PayTypeType = payTypeObj.PayTypeType;
                        existingData.UpdatedDate = DateTime.UtcNow;


                        _context.Entry(existingData).State = EntityState.Modified;


                    }
                    else
                    {


                        _context.Add(payTypeObj);


                        successones++;
                    }



                     await _context.SaveChangesAsync();

                    var insertedID = payTypeObj.PayTypeID;
                    if (!isMemberData && !isGroup && !isMaster && payTypeObj.PayTypeMaster != null)
                    {
                        var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "PAYTYPE", "MASTER", payTypeObj.PayTypeMaster.PayTypeID, insertedID);

                    }

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

        internal async static Task<List<PayTypes>> getAllPayTypes(BudgetingContext _context)
        {
            List<PayTypes> ITUpdate = await _context.PayTypes
                            .Where(a =>
                            a.IsDeleted == false && a.IsActive == true)
                            .ToListAsync();
            return ITUpdate;
        }

        public static ABS.DBModels.PayTypes getPayTypessObjbyID(int PayTypesID, BudgetingContext _context)
        {
            ABS.DBModels.PayTypes ITUpdate = _context.PayTypes
                            .Where(a => a.PayTypeID == PayTypesID
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }        

        public static ABS.DBModels.PayTypes getPayTypessObjbyCode(string PayTypeCode, BudgetingContext _context)
        {
            ABS.DBModels.PayTypes ITUpdate = _context.PayTypes
                            .Where(a => a.PayTypeCode.ToUpper() == PayTypeCode.ToUpper()
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }
    }
}
