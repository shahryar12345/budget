using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSDAL.Operations
{
    public class opSystemSettings
    {



        public static bool UpdateSystemSettings(JsonElement jsonString, BudgetingContext _context)
        {

            try
            {


                Console.WriteLine(jsonString.ToString());
                var SSObj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(jsonString.ToString());
                SSObj = SSObj.ToDictionary(x => x.Key.ToUpper(), x => x.Value == null ? "" : x.Value);
                Console.WriteLine(SSObj.ContainsKey("USERID"));

                #region Check if user settings exists

                if (SSObj.ContainsKey("USERID"))
                {
                    string _UserProfileID = SSObj["USERID"] != null ? SSObj["USERID"].ToString() : "";
                    if (_UserProfileID != "")
                    {



                        foreach (var item in SSObj)
                        {
                            if (item.Key.ToUpper() != "USERID")
                            {
                                var SSUpdate = _context._SystemSettings
                                        .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                                        .FirstOrDefault();


                                //int ifexists = _context._SystemSettings
                                //      .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                                //      .Count();
                                ABS.DBModels.ItemTypes itemTypesID = opItemTypes.getItemTypeObjbyValue(item.Value.ToString(), _context);

                                if (SSUpdate == null)
                                {
                                    Console.WriteLine(item.Key);
                                    Console.WriteLine(item.Value);
                                    SSUpdate = new ABS.DBModels.SystemSettings();
                                    SSUpdate.CreatedBy = int.Parse(_UserProfileID);
                                    SSUpdate.UserProfileID = int.Parse(_UserProfileID);

                                    SSUpdate.IsActive = true;
                                    SSUpdate.IsDeleted = false;
                                    SSUpdate.Identifier = Guid.NewGuid();
                                    SSUpdate.SettingKey = item.Key;
                                    SSUpdate.SettingValue = item.Value.ToString();
                                    SSUpdate.ItemDataType = itemTypesID == null ? null : itemTypesID;
                                    SSUpdate.CreationDate = DateTime.UtcNow;
                                    _context.Add(SSUpdate);
                                    _context.SaveChanges();
                                }
                                else
                                {


                                    if (SSUpdate.SettingValue.ToUpper() != item.Value.ToString().ToUpper())
                                    {
                                        Console.WriteLine("UPdates for : " + item.Key);
                                        Console.WriteLine("UPdates for : " + item.Value);

                                        _context.Entry(SSUpdate).State = EntityState.Modified;
                                        SSUpdate.SettingValue = item.Value.ToString();
                                        SSUpdate.ItemDataType = itemTypesID == null ? null : itemTypesID;

                                        SSUpdate.UpdateBy = int.Parse(_UserProfileID);
                                        SSUpdate.UpdatedDate = DateTime.UtcNow;
                                        _context.SaveChanges();
                                    }

                                }

                            }
                        }
                    }
                    else
                    {
                        return false;
                    }

                }
                else
                {
                    return false;
                }

                #endregion
                return true;
            }
            catch (Exception)
            {

                return false;
            }

        }

        public async static Task<ABS.DBModels.APIResponse> UpdateSystemSettingsAsync(JsonElement jsonString, BudgetingContext _context)
        {
            ABS.DBModels.APIResponse apiRes = new ABS.DBModels.APIResponse();

            try
            {



                Console.WriteLine(jsonString.ToString());
                var SSObj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(jsonString.ToString());

                Console.WriteLine(SSObj.ContainsKey("UserID"));

                #region Check if user settings exists
                int userid = 0;
                if (HelperFunctions.CheckKeyValuePairs(SSObj, "UserID") != null
                    && int.TryParse(SSObj["UserID"].ToString(), out userid))
                {
                    string _UserProfileID = userid.ToString();


                   // Parallel.ForEach(SSObj, async item =>

                       foreach (var item in SSObj)
                    {
                        if (item.Key.ToUpper() != "USERID")
                        {
                            var SSUpdate = _context._SystemSettings
                                    .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                                    .FirstOrDefault();


                            //int ifexists = _context._SystemSettings
                            //      .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                            //      .Count();

                            if (SSUpdate == null)
                            {
                                Console.WriteLine(item.Key);
                                Console.WriteLine(item.Value);
                                SSUpdate = new ABS.DBModels.SystemSettings();
                                SSUpdate.CreatedBy = int.Parse(_UserProfileID);
                                SSUpdate.UserProfileID = int.Parse(_UserProfileID);
                                SSUpdate.IsActive = true;
                                SSUpdate.IsDeleted = false;
                                SSUpdate.Identifier = Guid.NewGuid();
                                SSUpdate.SettingKey = item.Key;
                                SSUpdate.SettingValue = item.Value.ToString();
                                SSUpdate.CreationDate = DateTime.UtcNow;
                                _context.Add(SSUpdate);
                                await _context.SaveChangesAsync();
                            }
                            else
                            {


                                if (SSUpdate.SettingValue.ToUpper() != item.Value.ToString().ToUpper())
                                {
                                    Console.WriteLine("UPdates for : " + item.Key);
                                    Console.WriteLine("UPdates for : " + item.Value);

                                    _context.Entry(SSUpdate).State = EntityState.Modified;
                                    SSUpdate.SettingValue = item.Value.ToString();
                                    SSUpdate.UpdateBy = int.Parse(_UserProfileID);
                                    SSUpdate.UpdatedDate = DateTime.UtcNow;
                                    await _context.SaveChangesAsync();
                                }

                            }

                        }
                    }
//);

                }
                else
                {
                    apiRes.status = "failed";

                    apiRes.error = "user does not exists";
                    apiRes.message = "Please provide valid user details ";

                    return apiRes;
                }

                #endregion
                apiRes.status = "success";
                apiRes.payload = jsonString.ToString();
                apiRes.message = "record updated successfully ";
                return apiRes;
            }
            catch (Exception ex)
            {
                apiRes.status = "failed";

                apiRes.error = "Error Occured";
                apiRes.message = ex.Message + Environment.NewLine + ex.StackTrace;
                return apiRes;
            }

        }

        public static string getDateTimeFormatbyUserId(int UserID, BudgetingContext _context)
        {
            string trueFormat = "dd/mm/yyyy hh:mm:ss";
            ABS.DBModels.SystemSettings ITUpdate = _context._SystemSettings
                     .Where(a => a.UserProfileID == UserID
                     && a.SettingKey == "fiscalStartMonthDateFormat"


                     && a.IsDeleted == false && a.IsActive == true)
                     .FirstOrDefault();


            string format = opItemTypes.getItemTypeObjbyID(int.Parse(ITUpdate.SettingValue.ToString()), _context).ItemTypeCode;


            trueFormat = format;

            return trueFormat;
        }
    }
}
