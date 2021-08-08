using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using Newtonsoft.Json;

namespace ABSDAL.Operations
{
    public class opItemTypes
    {

        public async static Task<bool> UpdateItemTypesAsync(JsonElement jsonString, BudgetingContext _context)
        {

            try
            {


                Console.WriteLine(jsonString.ToString());
                string uncompressedData = Services.CompressionHelper.GetUncompressedData(jsonString);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);
                var ITUpdate = _context._ItemTypes.Where(a =>

                            a.IsDeleted == false && a.IsActive == true).ToList();

                foreach (var item in values)
                {
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());


                    //var ITObj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(item.ToString());

                    string ITEMTYPEKEYWORD = HelperFunctions.CheckKeyValuePairs(arrval, "ITEMTYPEKEYWORD").ToString();
                    string ITEMTYPECODE = HelperFunctions.CheckKeyValuePairs(arrval, "ITEMTYPECODE").ToString();
                    string ITEMTYPEVALUE = HelperFunctions.CheckKeyValuePairs(arrval, "ITEMTYPEVALUE").ToString();
                    string ITEMTYPEDISPLAYNAME = HelperFunctions.CheckKeyValuePairs(arrval, "ITEMTYPEDISPLAYNAME").ToString();
                    string ITEMTYPEDESCRIPTION = HelperFunctions.CheckKeyValuePairs(arrval, "ITEMTYPEDESCRIPTION").ToString();
                    string ITEMTYPEDATATYPE = HelperFunctions.CheckKeyValuePairs(arrval, "ITEMDATATYPE").ToString();

                    if (ITEMTYPECODE == "")
                    {
                        if (HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString() == "")
                        {

                        }
                        else
                        {
                            ITEMTYPECODE = arrval["code"].ToString();
                        }


                    }

                    if (ITEMTYPEVALUE == "")
                    {
                        if (HelperFunctions.CheckKeyValuePairs(arrval, "objectId").ToString() == "")
                        {

                        }
                        else
                        {
                            ITEMTYPEVALUE = arrval["objectId"].ToString();
                        }


                    }

                    if (ITEMTYPEDISPLAYNAME == "")
                    {
                        if (HelperFunctions.CheckKeyValuePairs(arrval, "columnLabel").ToString() == "")
                        {

                        }
                        else
                        {
                            ITEMTYPEDISPLAYNAME = arrval["columnLabel"].ToString();
                        }


                    }

                    if (ITEMTYPEDESCRIPTION == "")
                    {
                        if (HelperFunctions.CheckKeyValuePairs(arrval, "description").ToString() == "")
                        {

                        }
                        else
                        {
                            ITEMTYPEDESCRIPTION = arrval["description"].ToString();
                        }


                    }


                    var existingcheck = ITUpdate
                          .Where(a => a.ItemTypeKeyword.ToUpper() == ITEMTYPEKEYWORD.ToUpper()
                          && a.ItemTypeCode.ToUpper() == ITEMTYPECODE.ToUpper()
                          //&& a.ItemTypeValue.ToUpper() == ITObj["ITEMTYPEVALUE"].ToString().ToUpper() 
                          //&& a.ItemDataType.ToUpper() == ITObj["ITEMDATATYPE"].ToString().ToUpper() 

                          && a.IsDeleted == false && a.IsActive == true)
                          .FirstOrDefault();



                    var newItemType = new ItemTypes();



                    newItemType.ItemTypeKeyword = ITEMTYPEKEYWORD;
                    newItemType.ItemTypeCode = ITEMTYPECODE;
                    newItemType.ItemTypeValue = ITEMTYPEVALUE;
                    newItemType.ItemDataType = ITEMTYPEDATATYPE;
                    newItemType.ItemTypeDisplayName = ITEMTYPEDISPLAYNAME;
                    newItemType.ItemTypeDescription = ITEMTYPEDESCRIPTION;


                    newItemType.IsActive = true;
                    newItemType.IsDeleted = false;
                    newItemType.Identifier = Guid.NewGuid();



                    if (existingcheck == null)
                    {

                        newItemType.CreationDate = DateTime.UtcNow;
                        newItemType.UpdatedDate = DateTime.UtcNow;

                        _context.Add(newItemType);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        _context.Entry(existingcheck).State = EntityState.Modified;
                        existingcheck.UpdatedDate = DateTime.UtcNow;

                        existingcheck.ItemTypeKeyword = ITEMTYPEKEYWORD;
                        existingcheck.ItemTypeCode = ITEMTYPECODE;
                        existingcheck.ItemTypeValue = ITEMTYPEVALUE;
                        existingcheck.ItemDataType = ITEMTYPEDATATYPE;
                        existingcheck.ItemTypeDisplayName = ITEMTYPEDISPLAYNAME;
                        existingcheck.ItemTypeDescription = ITEMTYPEDESCRIPTION;


                        existingcheck.IsActive = true;
                        existingcheck.IsDeleted = false;
                        existingcheck.Identifier = Guid.NewGuid();
                        await _context.SaveChangesAsync();

                    }





                }



                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }

        }

        internal static string getAuthenticationSignInURL(BudgetingContext _context)
        {
            var Authenticationmode = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "AUTHENTICATIONSERVERLDAPURL", _context);


            return Authenticationmode.ItemTypeValue;
        } 
        
        internal static string getSecurityTokenURL(BudgetingContext _context)
        {
            var Authenticationmode = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "AUTHENTICATIONSERVERTOKENURL", _context);


            return Authenticationmode.ItemTypeValue;
        }

        internal static string getAuthenticationMode(BudgetingContext _context)
        {
            var Authenticationmode = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "AUTHENTICATIONMODE", _context);


            return Authenticationmode.ItemTypeValue;
        }

        internal async static Task<List<ItemTypes>> getAllItemTypes(BudgetingContext context)
        {
            var _itemTypes = await context._ItemTypes
                .Where(t => t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _itemTypes;
        }

        public static int getItemTypeIDbyValue(string value, BudgetingContext _context)
        {

            int itemTypeID = 0;
            ItemTypes ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeValue.ToUpper() == value.ToString().ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();




            if (ITUpdate == null)
            {
                itemTypeID = 0;

            }
            else
            {
                itemTypeID = ITUpdate.ItemTypeID;
            }
            return itemTypeID;
        }
        public static ItemTypes getItemTypeObjbyID(int itemTypeID, BudgetingContext _context)
        {


            ItemTypes ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeID == itemTypeID


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
        public static ItemTypes getItemTypeObjbyValue(string value, BudgetingContext _context)
        {


            ItemTypes ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeValue.ToUpper() == value.ToString().ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
        public static ItemTypes getItemTypeObjbyCode(string value, BudgetingContext _context)
        {


            ItemTypes ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeCode.ToUpper() == value.ToString().ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
        public static ItemTypes getItemTypeObjbyKeywordCode(string keyword, string code, BudgetingContext _context)
        {


            ItemTypes ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeCode.ToUpper() == code.ToString().ToUpper()
                            && a.ItemTypeKeyword.ToUpper() == keyword.ToUpper()

                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
        public async static Task<ItemTypes> getItemTypeObjbyKeywordCodeAsync(string keyword, string code, BudgetingContext _context)
        {


            ItemTypes ITUpdate = await _context._ItemTypes
                            .Where(a => a.ItemTypeCode.ToUpper() == code.ToString().ToUpper()
                            && a.ItemTypeKeyword.ToUpper() == keyword.ToUpper()

                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefaultAsync();





            return ITUpdate;
        }


        public async Task<List<ItemTypes>> getItemTypeObjbyKeyword(string keyword, BudgetingContext context)
        {
            var _itemTypes = await context._ItemTypes
                .Where(t => t.ItemTypeKeyword.ToUpper() == keyword.ToUpper() && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _itemTypes;
        }
        public async Task<List<ItemTypes>> getAllItemType(  BudgetingContext context)
        {
            var _itemTypes = await context._ItemTypes
                .Where(t =>   t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _itemTypes;
        }


        public static string getProcessingMethod(BudgetingContext _context)
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "PROCESSMETHOD", _context);


            return ProcessingMethod.ItemTypeValue;
        }
        public static string getDBProcessingMethod(BudgetingContext _context)
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "DBPROCESSMETHOD", _context);


            return ProcessingMethod.ItemTypeValue;
        }


        public static int getProcessingThreshold(BudgetingContext _context)
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "DATABASEPROCESSINGTHRESHOLD", _context);


            return int.Parse(ProcessingMethod.ItemTypeValue);
        }

        public static bool getUpdateAllActualBV(BudgetingContext _context)
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "UPDATEALLACTUALBV", _context);


            return bool.Parse(ProcessingMethod.ItemTypeValue);
        }
        public static string getImportDataBy(BudgetingContext _context)
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode
                ("CONFIGURATION", "IMPORTDATABY", _context);


            return  ProcessingMethod.ItemTypeValue;
        }
        public static string SecurityStoreChildData(BudgetingContext _context)
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode
                ("CONFIGURATION", "STOREPARENTCHILDDATA", _context);

            if (ProcessingMethod == null )
            { return ""; }
            return  ProcessingMethod.ItemTypeValue;
        }
         public static string getFilterUserDataRoles(BudgetingContext _context)
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode
                ("CONFIGURATION", "FILTERUSERDATAASROLES", _context);


            return  ProcessingMethod.ItemTypeValue;
        }

    }
}
