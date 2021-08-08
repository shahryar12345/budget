using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opItemTypes
    {





        public async static Task<bool> UpdateItemTypesAsync(JsonElement jsonString, BudgetingContext _context)
        {

            try
            {


                Console.WriteLine(jsonString.ToString());
                var ITObj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(jsonString.ToString());
                ITObj = ITObj.ToDictionary(x => x.Key.ToUpper(), x => x.Value == null ? "" : x.Value);
                if (ITObj["ITEMTYPECODE"] == null || ITObj["ITEMTYPEKEYWORD"] == null)
                { }
                else
                {


                    #region Check if Item Types exists


                    string _UserProfileID = ITObj["USERID"] != null ? ITObj["USERID"].ToString() : "";
                    int useridParsed;




                    var ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeKeyword.ToUpper() == ITObj["ITEMTYPEKEYWORD"].ToString().ToUpper()
                            && a.ItemTypeCode.ToUpper() == ITObj["ITEMTYPECODE"].ToString().ToUpper()
                            //&& a.ItemTypeValue.ToUpper() == ITObj["ITEMTYPEVALUE"].ToString().ToUpper() 
                            //&& a.ItemDataType.ToUpper() == ITObj["ITEMDATATYPE"].ToString().ToUpper() 

                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();


                    //int ifexists = _context._ItemTypes
                    //      .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                    //      .Count();

                    if (ITUpdate == null)
                    {


                        ITUpdate = new ABS.DBModels.ItemTypes();
                        ITUpdate.CreatedBy = int.TryParse(_UserProfileID, out useridParsed) ? useridParsed : 0;

                        ITUpdate.IsActive = true;
                        ITUpdate.IsDeleted = false;
                        ITUpdate.Identifier = Guid.NewGuid();
                        ITUpdate.ItemTypeKeyword = ITObj["ITEMTYPEKEYWORD"].ToString();
                        ITUpdate.ItemTypeCode = ITObj["ITEMTYPECODE"].ToString();
                        ITUpdate.ItemTypeValue = ITObj["ITEMTYPEVALUE"] == null ? "" : ITObj["ITEMTYPEVALUE"].ToString();
                        ITUpdate.ItemDataType = ITObj["ITEMDATATYPE"] == null ? "" : ITObj["ITEMDATATYPE"].ToString();
                        ITUpdate.ItemTypeDisplayName = ITObj["ITEMTYPEDISPLAYNAME"] == null ? "" : ITObj["ITEMDATATYPE"].ToString();
                        ITUpdate.ItemTypeDescription = ITObj["ITEMTYPEDESCRIPTION"] == null ? "" : ITObj["ITEMDATATYPE"].ToString();

                        ITUpdate.CreationDate = DateTime.UtcNow;
                        _context.Add(ITUpdate);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {


                        if (ITObj["ITEMDATATYPE"] == null && ITObj["ITEMTYPEVALUE"] == null)
                        {
                        }
                        else

                        {

                            _context.Entry(ITUpdate).State = EntityState.Modified;
                            //ITUpdate.ItemTypeKeyword = ITObj["ITEMTYPEKEYWORD"].ToString();
                            //ITUpdate.ItemTypeCode = ITObj["ITEMTYPECODE"].ToString();
                            ITUpdate.ItemTypeValue = ITObj["ITEMTYPEVALUE"].ToString();
                            ITUpdate.ItemDataType = ITObj["ITEMDATATYPE"].ToString();
                            ITUpdate.ItemTypeDisplayName = ITObj["ITEMTYPEDISPLAYNAME"] == null ? "" : ITObj["ITEMDATATYPE"].ToString();
                            ITUpdate.ItemTypeDescription = ITObj["ITEMTYPEDESCRIPTION"] == null ? "" : ITObj["ITEMDATATYPE"].ToString();

                            ITUpdate.Identifier = Guid.NewGuid();
                            ITUpdate.UpdateBy = int.TryParse(_UserProfileID, out useridParsed) ? useridParsed : 0;
                            ITUpdate.UpdatedDate = DateTime.UtcNow;
                            await _context.SaveChangesAsync();
                        }

                    }

                }
                #endregion
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }

        }

        internal async static Task<List<ABS.DBModels.ItemTypes>> getAllItemTypes(BudgetingContext context)
        {
            var _itemTypes = await context._ItemTypes
                .Where(t => t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _itemTypes;
        }

        public static int getItemTypeIDbyValue(string value, BudgetingContext _context)
        {

            int itemTypeID = 0;
            ABS.DBModels.ItemTypes ITUpdate = _context._ItemTypes
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
        public static ABS.DBModels.ItemTypes getItemTypeObjbyID(int itemTypeID, BudgetingContext _context)
        {


            ABS.DBModels.ItemTypes ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeID == itemTypeID


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
         public static ABS.DBModels.ItemTypes getItemTypeObjbyValue(string value, BudgetingContext _context)
        {


            ABS.DBModels.ItemTypes ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeValue.ToUpper() == value.ToString().ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
        public static ABS.DBModels.ItemTypes getItemTypeObjbyCode(string value, BudgetingContext _context)
        {


            ABS.DBModels.ItemTypes ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeCode.ToUpper() == value.ToString().ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
        public async Task<List<ABS.DBModels.ItemTypes>> getItemTypeObjbyKeyword(string keyword, BudgetingContext context)
        {
            var _itemTypes = await context._ItemTypes
                .Where(t => t.ItemTypeKeyword.ToUpper() == keyword.ToUpper() && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _itemTypes;
        }

        public static ABS.DBModels.ItemTypes getItemTypeObjbyKeywordCode(string keyword, string code, BudgetingContext _context)
        {


            ABS.DBModels.ItemTypes ITUpdate = _context._ItemTypes
                            .Where(a => a.ItemTypeCode.ToUpper() == code.ToString().ToUpper()
                            && a.ItemTypeKeyword.ToUpper() == keyword.ToUpper()

                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }


    }
}
