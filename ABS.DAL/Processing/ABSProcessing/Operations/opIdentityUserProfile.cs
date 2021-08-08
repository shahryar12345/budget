using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opIdentityUserProfile
    {



        public static bool UpdateIdentityUserProfile(JsonElement jsonString, BudgetingContext _context)
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
                                var SSUpdate = _context._BudgetVersions
                                        .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.Code.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                                        .FirstOrDefault();


                                //int ifexists = _context._SystemSettings
                                //      .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                                //      .Count();
                                ABS.DBModels.ItemTypes itemTypesID = opItemTypes.getItemTypeObjbyValue(item.Value.ToString(), _context);

                                if (SSUpdate == null)
                                {
                                    Console.WriteLine(item.Key);
                                    Console.WriteLine(item.Value);
                                    SSUpdate = new ABS.DBModels.BudgetVersions();
                                    SSUpdate.CreatedBy = int.Parse(_UserProfileID);
                                    SSUpdate.UserProfileID = int.Parse(_UserProfileID);

                                    SSUpdate.IsActive = true;
                                    SSUpdate.IsDeleted = false;
                                    SSUpdate.Identifier = Guid.NewGuid();
                                    //SSUpdate.SettingKey = item.Key;
                                    //SSUpdate.SettingValue = item.Value.ToString();
                                    //SSUpdate.ItemDataType = itemTypesID==null ? null : itemTypesID ;
                                    SSUpdate.CreationDate = DateTime.UtcNow;
                                    _context.Add(SSUpdate);
                                    _context.SaveChanges();
                                }
                                else
                                {


                                    //if (SSUpdate.SettingValue.ToUpper() != item.Value.ToString().ToUpper())
                                    //{
                                    //    Console.WriteLine("UPdates for : " + item.Key);
                                    //    Console.WriteLine("UPdates for : " + item.Value);

                                    //    _context.Entry(SSUpdate).State = EntityState.Modified;
                                    //    SSUpdate.SettingValue = item.Value.ToString();
                                    //    SSUpdate.ItemDataType = itemTypesID == null ? null : itemTypesID;

                                    //    SSUpdate.UpdateBy = int.Parse(_UserProfileID);
                                    //    SSUpdate.UpdatedDate = DateTime.UtcNow;
                                    //    _context.SaveChanges();
                                    //}

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

        public async static Task<bool> UpdateIdentityUserProfileAsync(JsonElement jsonString, BudgetingContext _context)
        {

            try
            {

                Console.WriteLine(jsonString.ToString());
                var SSObj = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(jsonString.ToString());

                Console.WriteLine(SSObj.ContainsKey("UserID"));

                #region Check if user settings exists

                if (SSObj.ContainsKey("UserID"))
                {
                    string _UserProfileID = SSObj["UserID"] != null ? SSObj["UserID"].ToString() : "";
                    if (_UserProfileID != "")
                    {

                        string xcode = SSObj.ContainsKey("Code") ? SSObj["Code"].ToString() : "";
                        string fiscalYearID = SSObj.ContainsKey("fiscalYearID") ? SSObj["fiscalYearID"].ToString() : "";


                        var SSUpdate = _context._BudgetVersions
                                .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.Code.ToUpper() == xcode.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                                .FirstOrDefault();


                        //int ifexists = _context._SystemSettings
                        //      .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                        //      .Count();

                        if (SSUpdate == null)
                        {

                            SSUpdate = new ABS.DBModels.BudgetVersions();
                            SSUpdate.CreatedBy = int.Parse(_UserProfileID);
                            SSUpdate.UserProfileID = int.Parse(_UserProfileID);
                            SSUpdate.IsActive = true;
                            SSUpdate.IsDeleted = false;
                            SSUpdate.Identifier = Guid.NewGuid();
                            SSUpdate.Code = xcode;
                            SSUpdate.Description = SSObj.ContainsKey("Description") ? SSObj["Description"].ToString() : "";
                            SSUpdate.Comments = SSObj.ContainsKey("Comments") ? SSObj["Comments"].ToString() : "";
                            SSUpdate.fiscalStartMonthID = SSObj.ContainsKey("fiscalStartMonthID") ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["fiscalStartMonthID"].ToString()), _context) : null;
                            SSUpdate.fiscalYearID = SSObj.ContainsKey("fiscalYearID") ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["fiscalYearID"].ToString()), _context) : null;
                            SSUpdate.scenarioTypeID = SSObj.ContainsKey("scenarioTypeID") ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["scenarioTypeID"].ToString()), _context) : null;
                            SSUpdate.budgetVersionTypeID = SSObj.ContainsKey("budgetVersionTypeID") ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["budgetVersionTypeID"].ToString()), _context) : null;
                            SSUpdate.CreationDate = DateTime.UtcNow;
                            _context.Add(SSUpdate);
                            await _context.SaveChangesAsync();
                        }
                        else
                        {



                            _context.Entry(SSUpdate).State = EntityState.Modified;


                            SSUpdate.Description = SSObj.ContainsKey("Description") ? SSObj["Description"].ToString() : "";
                            SSUpdate.Comments = SSObj.ContainsKey("Comments") ? SSObj["Comments"].ToString() : "";
                            SSUpdate.fiscalStartMonthID = SSObj.ContainsKey("fiscalStartMonthID") ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["fiscalStartMonthID"].ToString()), _context) : null;
                            SSUpdate.fiscalYearID = SSObj.ContainsKey("fiscalYearID") ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["fiscalYearID"].ToString()), _context) : null;
                            SSUpdate.scenarioTypeID = SSObj.ContainsKey("scenarioTypeID") ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["scenarioTypeID"].ToString()), _context) : null;



                            SSUpdate.UpdateBy = int.Parse(_UserProfileID);
                            SSUpdate.UpdatedDate = DateTime.UtcNow;



                            await _context.SaveChangesAsync();


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

        public static ABS.DBModels.IdentityUserProfile getIdentityUserProfileObjbyValue(int id, BudgetingContext _context)
        {


            ABS.DBModels.IdentityUserProfile ITUpdate = _context._IdentityUserProfile
                            .Where(a => a.UserProfileID == id


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            if (ITUpdate != null)
            {
                return ITUpdate;
            }
            else
            {
                return null;
            }




        }
          public async static Task<List<ABS.DBModels.IdentityUserProfile>> getAllIdentityUserProfile( BudgetingContext _context)
        {


            var ITUpdate =  await _context._IdentityUserProfile
                            .Where(a =>  a.IsDeleted == false && a.IsActive == true)
                            .ToListAsync();
            if (ITUpdate != null)
            {
                return ITUpdate;
            }
            else
            {
                return null;
            }




        }

         public static ABS.DBModels.IdentityUserProfile getIdentityUserProfileObjbyUsername(string _username, BudgetingContext _context)
        {


            ABS.DBModels.IdentityUserProfile ITUpdate = _context._IdentityUserProfile
                            .Where(a => a.Username == _username


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            if (ITUpdate != null)
            {
                return ITUpdate;
            }
            else
            {
                return null;
            }




        }



    }
}
