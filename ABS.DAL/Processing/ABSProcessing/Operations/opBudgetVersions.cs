using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using Microsoft.Extensions.Caching.Distributed;

namespace ABSProcessing.Operations
{
    public class opBudgetVersions
    {
        public opBudgetVersions()
        {

        }
        private readonly IDistributedCache _distributedCache;
        public opBudgetVersions(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }
        public static BudgetingContext getBudgetVersionContext(BudgetingContext _context)
        {
              _context._BudgetVersions
                .Include(a => a.TimePeriodID)
                .Include(b => b.fiscalYearID)
                .Include(b => b.budgetVersionTypeID)
                .Include(b => b.fiscalStartMonthID)
                .Include(b => b.scenarioTypeID)
                .Include(b => b.ADSstatisticsID)
                .Include(b => b.ADSstaffingID)
                .Include(b => b.ADSgeneralLedgerID)
                .Include(b => b.ADSscenarioTypeID)
                .Include(b => b.ADSbudgetVersionID)
                .ToList();




            //_context._BudgetVersions.Include(a => a.TimePeriodID);
            //_context._BudgetVersions.Include(a => a.fiscalYearID).ToList();
            //_context._BudgetVersions.Include(b => b.budgetVersionTypeID).ToList();
            //_context._BudgetVersions.Include(b => b.fiscalStartMonthID).ToList();
            //_context._BudgetVersions.Include(b => b.scenarioTypeID).ToList();
            //_context._BudgetVersions.Include(b => b.ADSstatisticsID).ToList();
            //_context._BudgetVersions.Include(b => b.ADSstaffingID).ToList();
            //_context._BudgetVersions.Include(b => b.ADSgeneralLedgerID).ToList();
            //_context._BudgetVersions.Include(b => b.ADSscenarioTypeID).ToList();
            //_context._BudgetVersions.Include(b => b.ADSbudgetVersionID).ToList();



            return _context;






        }
        public async Task<BudgetVersions> GetBudgetVersionByCode(string code, BudgetingContext context){
                
            APIResponse xData = new APIResponse();
            DataCache.opRedisCache opCache = new DataCache.opRedisCache();

            IEnumerable<BudgetVersions> budgetVersionsData = await opCache.refreshKeyData<BudgetVersions>("ALLBUDGETVERSIONS", context, 1000);
            BudgetVersions data = budgetVersionsData
                .Where(x => x.Code.ToLower() == code.ToLower() && x.IsActive == true && x.IsDeleted == false)
                .FirstOrDefault();
            
            if (data == null)
            {
                return null;
            }
            else
            {
                return data;
            }
        }
        public async static  Task<List<BudgetVersions>> GetAllBudgetVersions( BudgetingContext context)
        {

            var cntxt = getBudgetVersionContext(context);
                var getData =  await cntxt._BudgetVersions.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
            return getData;
        
        }

        public static ABS.DBModels.BudgetVersions getBudgetVersionsObjbyID(int BudgetVersionsID, BudgetingContext _context)
        {


            ABS.DBModels.BudgetVersions ITUpdate = _context._BudgetVersions
                            .Where(a => a.BudgetVersionID == BudgetVersionsID


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
 //       public async Task<APIResponse> GetBudgetVersionPageData(
 //           string searchString,
 //           int PageNo, int itemsPerPage, string budgetVersionType, string sortColumn, bool sortDescending, int userID, BudgetingContext _context)
 //       {
 //           APIResponse xData = new APIResponse();



 //           DataCache.opRedisCache opCache = new DataCache.opRedisCache();

 //           IEnumerable<BudgetVersions> budgetVersionsData = await opCache.refreshKeyData<BudgetVersions>("ALLBUDGETVERSIONS", _context, 1000);
 //           IEnumerable<IdentityUserProfile> UserProfileData = await opCache.refreshKeyData<IdentityUserProfile>("ALLUSERPROFILE", _context, 1000);
 //           IEnumerable<ItemTypes> itemTypesData = await opCache.refreshKeyData<ItemTypes>("ALLITEMTYPES", _context, 1000);
 //           IEnumerable<TimePeriods> timePeriodslst = await opCache.refreshKeyData<TimePeriods>("ALLTIMEPERIODS", _context, 1000);


 //           //var budgetVersionsCachedData = opCache.RetrieveListFromCache<BudgetVersions>("ALLBUDGETVERSIONS");
 //           //IEnumerable<IdentityUserProfile> UserProfileData = opCache.RetrieveListFromCache<IdentityUserProfile>("ALLUSERPROFILE").Result.ToList();
 //           //IEnumerable<ItemTypes> itemTypesData = opCache.RetrieveListFromCache<ItemTypes>("ALLITEMTYPES").Result.ToList();


 //           string username = UserProfileData.Where(s => s.UserProfileID == userID).Select(s => s.Username).FirstOrDefault();
 //           //string username = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(userID, _context).Username;


 //           //  budgetVersionsData = budgetVersionsCachedData.Result.ToList();


 //           var data = budgetVersionsData
 //               .Where(x => x.IsActive == true && x.IsDeleted == false)
 //               .AsEnumerable();



 //           if (data == null)
 //           {

 //               xData.message = " NotFound";
 //               xData.code = "404";
 //               return xData;
 //           }

 //           xData.totalCount = data.Count();






 //           if (budgetVersionType != "" && budgetVersionType != null)
 //           {
 //               Console.WriteLine(data);
 //               data = data.Where(x => x.budgetVersionTypeID != null).AsEnumerable();
 //               data = data.Where(x => x.budgetVersionTypeID.ItemTypeID == int.Parse(budgetVersionType)).AsEnumerable();

 //           }






 //           if (searchString != "" && searchString != null)
 //           {


 //               data = data.Where(x =>
 //               (x.Code != null && x.Code.ToLower().Contains(searchString.ToLower()))
 //               || (x.Description != null && x.Description.ToLower().Contains(searchString.ToLower()))
 //               || (x.Comments != null && x.Comments.ToLower().Contains(searchString.ToLower())))
 //                   .AsEnumerable();
 //           }

 //           data = data.OrderBy(f => f.BudgetVersionID);


 //           if (sortColumn != "" && sortColumn != null && sortDescending)

 //           {
 //               var propertyInfo = typeof(BudgetVersions).GetProperty(sortColumn, System.Reflection.BindingFlags.IgnoreCase | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);

 //               //  data = data.OrderByDescending(a => a.Code).AsEnumerable();
 //               data = data.OrderByDescending(a => propertyInfo.GetValue(a, null)).AsEnumerable();
 //           }
 //           else
 //            if (sortColumn != "" && sortColumn != null && !sortDescending)

 //           {
 //               var propertyInfo = typeof(BudgetVersions).GetProperty(sortColumn, System.Reflection.BindingFlags.IgnoreCase | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);

 //               //  data = data.OrderByDescending(a => a.Code).AsEnumerable();
 //               data = data.OrderBy(a => propertyInfo.GetValue(a, null)).AsEnumerable();

 //           }



 //           if (data.Count() < 1)
 //           {
 //               xData.Data = JsonSerializer.Serialize(data);
 //               xData.status = "sucess";
 //               xData.totalCount = data.Count();
 //               xData.message = "No Data Found";

 //               return xData;

 //           }

 //           if (data.Count() <= itemsPerPage)
 //           {

 //           }
 //           else
 //           {
 //               if (PageNo == 1)
 //               {
 //                   data = data.Skip(0).Take(itemsPerPage);

 //               }
 //               else
 //               if (PageNo > 1)
 //               {
 //                   int skipdata = (PageNo - 1) * itemsPerPage;
 //                   data = data.Skip(skipdata);
 //                   data = data.Take(itemsPerPage);

 //               }
 //           }




 //           var finaldata = data.Select(a => new
 //           {
 //               BudgetVersionsID = a.BudgetVersionID
 //                 ,
 //               code = a.Code
 //                 ,
 //               comments = a.Comments
 //                     ,
 //               description = a.Description
 //                 ,
 //               UserProfile = UserProfileData.Where(x => x.UserProfileID == a.UserProfileID).Select(d => d.Username).FirstOrDefault()
 //               //UserProfile =  GetUsernamefromList(a.UserProfileID, _userProfile)
 //                 ,

 //               createdby =  a.CreatedBy == null ? "" :     UserProfileData.Where(x => x.UserProfileID == a.CreatedBy).Select(d => d.Username).FirstOrDefault()
 //                 ,
 //               updatedby = a.UpdateBy == null ? "" : UserProfileData.Where(x => x.UserProfileID == a.UpdateBy).Select(d => d.Username).FirstOrDefault()
 //                 ,
 //               fiscalYearID = a.TimePeriodID != null ? timePeriodslst.Where(x => x.TimePeriodID == a.TimePeriodID.TimePeriodID).Select(d => d.FiscalYearID.ItemTypeDisplayName + "-" + d.FiscalYearEndID.ItemTypeDisplayName).FirstOrDefault() : ""
 //               ,
 //               fiscalYearIDObj = a.fiscalYearID != null ? itemTypesData.Where(x => x.ItemTypeID == a.fiscalYearID.ItemTypeID).FirstOrDefault() : null  //+ "-" + a.fiscalYearID.ItemTypeValue
                
 //                 ,
 //               budgetVersionTypeID = a.budgetVersionTypeID != null ? itemTypesData.Where(x => x.ItemTypeID == a.budgetVersionTypeID.ItemTypeID).Select(d => d.ItemTypeDisplayName).FirstOrDefault() : ""
 //               //  budgetVersionTypeID = a.budgetVersionTypeID.ItemTypeID
 //               ,
 //               budgetVersionTypeIDOBj = a.budgetVersionTypeID != null ? itemTypesData.Where(x => x.ItemTypeID == a.budgetVersionTypeID.ItemTypeID).FirstOrDefault() : null
 //                 ,
 //               scenarioTypeID = a.scenarioTypeID != null ? itemTypesData.Where(x => x.ItemTypeID == a.scenarioTypeID.ItemTypeID).Select(d => d.ItemTypeID).FirstOrDefault() : 0
 //                ,
 //               scenarioTypeIDObj = a.scenarioTypeID != null ? itemTypesData.Where(x => x.ItemTypeID == a.scenarioTypeID.ItemTypeID).FirstOrDefault() : null

 //                 ,
 //               fiscalStartMonthID = a.TimePeriodID != null ? timePeriodslst.Where(x => x.TimePeriodID == a.TimePeriodID.TimePeriodID).Select(d => d.FiscalEndMonthID.ItemTypeDisplayName).FirstOrDefault() : ""

 //                ,
 //               fiscalStartMonthIDObj = a.fiscalStartMonthID != null ? itemTypesData.Where(x => x.ItemTypeID == a.fiscalStartMonthID.ItemTypeID).FirstOrDefault() : null//+ "-" + a.fiscalStartMonthID.ItemTypeValue

 //               ,
 //               ADSstatisticsID = a.ADSstatisticsID != null ? itemTypesData.Where(x => x.ItemTypeID == a.ADSstatisticsID.ItemTypeID).Select(d => d.ItemTypeID).FirstOrDefault() : 0
 //               ,
 //               ADSstaffingID = a.ADSstaffingID != null ? itemTypesData.Where(x => x.ItemTypeID == a.ADSstaffingID.DataScenarioID).Select(d => d.ItemTypeID).FirstOrDefault() : 0
 //               ,
 //               ADSgeneralLedgerID = a.ADSgeneralLedgerID != null ? itemTypesData.Where(x => x.ItemTypeID == a.ADSgeneralLedgerID.ItemTypeID).Select(d => d.ItemTypeID).FirstOrDefault() : 0
 //  ,
 //               ADSscenarioTypeID = a.ADSscenarioTypeID != null ? itemTypesData.Where(x => x.ItemTypeID == a.ADSscenarioTypeID.ItemTypeID).Select(d => d.ItemTypeID).FirstOrDefault() : 0
 //  ,
 //               ADSbudgetVersionID = a.ADSbudgetVersionID != null ? itemTypesData.Where(x => x.ItemTypeID == a.ADSbudgetVersionID.ItemTypeID).Select(d => d.ItemTypeID).FirstOrDefault() : 0

 //                  ,
 //               timeperiodobj = a.TimePeriodID != null ? timePeriodslst.Where(x => x.TimePeriodID == a.TimePeriodID.TimePeriodID).FirstOrDefault() : null
 //,
 //               creationDate = a.CreationDate != null ? a.CreationDate.ToString()  : ""
 //               ,
 //               updateddate = a.UpdatedDate != null ? a.UpdatedDate.ToString(): ""
 //           }).AsEnumerable();



 //           //  xData.Data = JsonSerializer.Serialize(finaldata);
 //           xData.Data = JsonSerializer.Serialize(finaldata);
 //           xData.status = "sucess";
 //           xData.ResponseDataCount = data.Count();




 //           return xData;
 //       }

        public static bool ProcessBudgetVersions(JsonElement jsonString, BudgetingContext _context)
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

        public async static Task<ABS.DBModels.APIResponse> ProcessBudgetVersionsAsync(JsonElement jsonString, BudgetingContext _context)
        {
           ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();

            try
            {

                // Console.WriteLine(jsonString.ToString());
                var SSObj = HelperFunctions.getJSONArrayObject(jsonString);

                // string _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj,"UserID").ToString();

                //  Console.WriteLine(SSObj.ContainsKey("UserID"));
                //if (SSObj.ContainsKey("UserID"))
                //{
                //    _UserProfileID = SSObj["UserID"] != null ? SSObj["UserID"].ToString() : "";
                //}
                //else
                //{
                //    _UserProfileID = "0";
                //}
                if (HelperFunctions.CheckKeyValuePairs(SSObj, "actionType").ToString().ToUpper() == "ADD")
                {

                    aPIResponse = await AddBudgetVersions(SSObj, _context);

                }




                else
                if (SSObj["actionType"].ToString().ToUpper() == "UPDATE")
                {


                    aPIResponse = await UpdateBudgetVersions(SSObj, _context);


                }
                else
                if (SSObj["actionType"].ToString().ToUpper() == "DELETE")
                {
                    aPIResponse = await DeleteBudgetVersions(SSObj, _context);
                }
                else
                if (SSObj["actionType"].ToString().ToUpper() == "RENAME")
                {
                    aPIResponse = await RenameBudgetVersions(SSObj, _context);


                }
                else
                if (SSObj["actionType"].ToString().ToUpper() == "COPY")
                {

                    aPIResponse = await CopyBudgetVersions(SSObj, _context);

                }


                return aPIResponse;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                aPIResponse.status = "failed";
                aPIResponse.error = ex.StackTrace;
                aPIResponse.message = ex.Message;
                return aPIResponse;
            }

        }


        public async static Task<ABS.DBModels.APIResponse> AddBudgetVersions(Dictionary<string, object> SSObj, BudgetingContext _context)
        {
           ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();
            try
            {

                string _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "UserID").ToString();




                string xcode = SSObj.ContainsKey("code") ? SSObj["code"].ToString() : "";
                //     string fiscalYearID = SSObj.ContainsKey("fiscalYearID") && SSObj["fiscalYearID"] != null ? SSObj["fiscalYearID"].ToString() : "";


                var SSUpdate = _context._BudgetVersions
                        .Where(a => a.UserProfileID == int.Parse(_UserProfileID)
                        && a.Code.ToUpper() == xcode.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                        .FirstOrDefault();


                //int ifexists = _context._SystemSettings
                //      .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                //      .Count();

                if (SSUpdate == null)
                {

                    SSUpdate = new ABS.DBModels.BudgetVersions();
                    SSUpdate.CreatedBy = int.Parse(_UserProfileID);
                    SSUpdate.UpdateBy = int.Parse(_UserProfileID);
                    SSUpdate.UserProfileID = int.Parse(_UserProfileID);
                    SSUpdate.IsActive = true;
                    SSUpdate.IsDeleted = false;
                    SSUpdate.Identifier = Guid.NewGuid();
                    SSUpdate.Code = xcode;
                    SSUpdate.Description = SSObj.ContainsKey("description") && SSObj["description"] != null ? SSObj["description"].ToString() : "";
                    SSUpdate.Comments = SSObj.ContainsKey("comments") && SSObj["comments"] != null ? SSObj["comments"].ToString() : "";
                    SSUpdate.fiscalStartMonthID = SSObj.ContainsKey("fiscalStartMonthID") && SSObj["fiscalStartMonthID"] != null ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["fiscalStartMonthID"].ToString()), _context) : null;
                    SSUpdate.fiscalYearID = SSObj.ContainsKey("fiscalYearID") && SSObj["fiscalYearID"] != null ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["fiscalYearID"].ToString()), _context) : null;
                    SSUpdate.TimePeriodID = SSObj.ContainsKey("timePeriodID") && SSObj["timePeriodID"] != null ? opTimePeriods.getTimePeriodObjbyID(int.Parse(SSObj["timePeriodID"].ToString()), _context) : null;
                    









                    int result = 0;

                    if (SSObj.ContainsKey("scenarioTypeID") && SSObj["scenarioTypeID"] != null)
                    {
                        if (int.TryParse(SSObj["scenarioTypeID"].ToString(), out result))
                        {
                            SSUpdate.scenarioTypeID = Operations.opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["scenarioTypeID"].ToString()), _context);
                        }
                        else
                        {
                            //   SSUpdate.scenarioTypeID = Operations.opItemTypes.getItemTypeObjbyCode(SSObj["scenarioTypeID"].ToString(), _context);
                        }
                    }
                    else
                    {
                        //SSUpdate.scenarioTypeID = SSObj.ContainsKey("scenarioTypeID") && SSObj["scenarioTypeID"] != null ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["scenarioTypeID"].ToString()), _context) : null;

                    }


                    SSUpdate.budgetVersionTypeID = SSObj.ContainsKey("budgetVersionTypeID") && SSObj["budgetVersionTypeID"] != null ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["budgetVersionTypeID"].ToString()), _context) : null;
                    SSUpdate.CreationDate = DateTime.UtcNow;
                    SSUpdate.UpdatedDate = DateTime.UtcNow;




                    /*ACTUAL TYPES FIELDS*/



                    SSUpdate.ADSstatisticsID = SSObj.ContainsKey("ADSstatisticsID") && SSObj["ADSstatisticsID"] != null ? opDataScenario.getDataScenarioObjbyID(int.Parse(SSObj["ADSstatisticsID"].ToString()), _context) : null;
                    SSUpdate.ADSstaffingID = SSObj.ContainsKey("ADSstaffingID") && SSObj["ADSstaffingID"] != null ? opDataScenario.getDataScenarioObjbyID(int.Parse(SSObj["ADSstaffingID"].ToString()), _context) : null;
                    //SSUpdate.ADSstaffingID = SSObj.ContainsKey("ADSstaffingID") && SSObj["ADSstaffingID"] != null ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["ADSstaffingID"].ToString()), _context) : null;
                    SSUpdate.ADSgeneralLedgerID = SSObj.ContainsKey("ADSgeneralLedgerID") && SSObj["ADSgeneralLedgerID"] != null ? opDataScenario.getDataScenarioObjbyID(int.Parse(SSObj["ADSgeneralLedgerID"].ToString()), _context) : null;



                    /*FORECAST TYPE FIELDS*/


                    SSUpdate.ADSscenarioTypeID = SSObj.ContainsKey("ADSscenarioTypeID") && SSObj["ADSscenarioTypeID"] != null ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["ADSscenarioTypeID"].ToString()), _context) : null;
                    SSUpdate.ADSbudgetVersionID = SSObj.ContainsKey("ADSbudgetVersionID") && SSObj["ADSbudgetVersionID"] != null ? opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["ADSbudgetVersionID"].ToString()), _context) : null;



                    _context.Add(SSUpdate);
                    //await _context.SaveChangesAsync();
                    await _context.SaveChangesAsync();

                    aPIResponse.status = "success";
                    aPIResponse.payload = SSUpdate.BudgetVersionID.ToString();
                    aPIResponse.message = "record saved successfully ";

                }
                else
                {

                    aPIResponse.status = "failed";
                    aPIResponse.payload = SSUpdate.BudgetVersionID.ToString();
                    aPIResponse.message = "record already exist";


                }






                return aPIResponse;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                aPIResponse.status = "failed";
                aPIResponse.error = ex.StackTrace;
                aPIResponse.message = ex.Message;
                return aPIResponse;
            }
        }
        public async static Task<ABS.DBModels.APIResponse> UpdateBudgetVersions(Dictionary<string, object> SSObj, BudgetingContext _context)
        {
            ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();
            try
            {

                string _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "UserID").ToString();

                if (_UserProfileID == null)
                {

                    _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "userProfile").ToString();
                    if (_UserProfileID == null)
                    {

                        aPIResponse.status = "failed";
                        aPIResponse.payload = "";
                        aPIResponse.message = "user does not exist";
                        return aPIResponse;
                    }
                    else
                    {
                        _UserProfileID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyUsername(_UserProfileID, _context).UserProfileID.ToString();

                    }
                }
                else
                {




                    string xcode = HelperFunctions.CheckKeyValuePairs(SSObj, "code").ToString();

                    if (xcode == "")
                    {
                        aPIResponse.status = "failed";
                        aPIResponse.payload = "";
                        aPIResponse.message = "record does not exist to update";
                        return aPIResponse;
                    }




                    var SSUpdate = _context._BudgetVersions
                            .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.Code.ToUpper() == xcode.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();



                    if (SSUpdate == null)
                    {
                        aPIResponse.status = "failed";
                        aPIResponse.payload = "";
                        aPIResponse.message = "record does not exist";
                        return aPIResponse;

                    }
                    else
                    {


                        _context.Entry(SSUpdate).State = EntityState.Modified;


                        int result = 0;

                        if (SSObj.ContainsKey("fiscalStartMonthID") && SSObj["fiscalStartMonthID"] != null)
                        {
                            if (int.TryParse(SSObj["fiscalStartMonthID"].ToString(), out result))
                            {
                                SSUpdate.fiscalStartMonthID = Operations.opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["fiscalStartMonthID"].ToString()), _context);
                            }
                            else
                            {
                                SSUpdate.fiscalStartMonthID = Operations.opItemTypes.getItemTypeObjbyCode(SSObj["fiscalStartMonthID"].ToString(), _context);
                            }
                        }
                        else
                        {

                        }



                        result = 0;

                        if (SSObj.ContainsKey("fiscalYearID") && SSObj["fiscalYearID"] != null)
                        {
                            if (int.TryParse(SSObj["fiscalYearID"].ToString(), out result))
                            {
                                SSUpdate.fiscalYearID = Operations.opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["fiscalYearID"].ToString()), _context);
                            }
                            else
                            {
                                SSUpdate.fiscalYearID = Operations.opItemTypes.getItemTypeObjbyValue(SSObj["fiscalYearID"].ToString(), _context);
                            }
                        }
                        else
                        {

                        }

                        result = 0;

                        if (SSObj.ContainsKey("scenarioTypeID") && SSObj["scenarioTypeID"] != null)
                        {
                            if (int.TryParse(SSObj["scenarioTypeID"].ToString(), out result))
                            {
                                SSUpdate.scenarioTypeID = Operations.opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["scenarioTypeID"].ToString()), _context);
                            }
                            else
                            {
                                SSUpdate.scenarioTypeID = Operations.opItemTypes.getItemTypeObjbyCode(SSObj["scenarioTypeID"].ToString(), _context);
                            }
                        }
                        else
                        {

                        }


                        result = 0;

                        if (SSObj.ContainsKey("budgetVersionTypeID") && SSObj["budgetVersionTypeID"] != null)
                        {
                            if (int.TryParse(SSObj["budgetVersionTypeID"].ToString(), out result))
                            {
                                SSUpdate.budgetVersionTypeID = Operations.opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["budgetVersionTypeID"].ToString()), _context);
                            }
                            else
                            {
                                SSUpdate.budgetVersionTypeID = Operations.opItemTypes.getItemTypeObjbyValue(SSObj["budgetVersionTypeID"].ToString(), _context);
                            }
                        }
                        else
                        {

                        }





                        //ACtual Data Update

                        result = 0;

                        if (SSObj.ContainsKey("ADSbudgetVersionID") && SSObj["ADSbudgetVersionID"] != null)
                        {
                            if (int.TryParse(SSObj["ADSbudgetVersionID"].ToString(), out result))
                            {
                                SSUpdate.ADSbudgetVersionID = Operations.opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["ADSbudgetVersionID"].ToString()), _context);
                            }
                            else
                            {
                                SSUpdate.ADSbudgetVersionID = Operations.opItemTypes.getItemTypeObjbyValue(SSObj["ADSbudgetVersionID"].ToString(), _context);
                            }
                        }
                        else
                        {

                        }
                         result = 0;

                        if (SSObj.ContainsKey("ADSgeneralLedgerID") && SSObj["ADSgeneralLedgerID"] != null)
                        {
                            if (int.TryParse(SSObj["ADSgeneralLedgerID"].ToString(), out result))
                            {
                                SSUpdate.ADSgeneralLedgerID = Operations.opDataScenario.getDataScenarioObjbyID(int.Parse(SSObj["ADSgeneralLedgerID"].ToString()), _context);
                            }
                            else
                            {
                                SSUpdate.ADSgeneralLedgerID = Operations.opDataScenario.getDataScenarioObjbyCode(SSObj["ADSgeneralLedgerID"].ToString(), _context);
                            }
                        }
                        else
                        {

                        }

                          result = 0;

                        if (SSObj.ContainsKey("ADSscenarioTypeID") && SSObj["ADSscenarioTypeID"] != null)
                        {
                            if (int.TryParse(SSObj["ADSscenarioTypeID"].ToString(), out result))
                            {
                                SSUpdate.ADSscenarioTypeID = Operations.opItemTypes.getItemTypeObjbyID(int.Parse(SSObj["ADSscenarioTypeID"].ToString()), _context);
                            }
                            else
                            {
                                SSUpdate.ADSscenarioTypeID = Operations.opItemTypes.getItemTypeObjbyValue(SSObj["ADSscenarioTypeID"].ToString(), _context);
                            }
                        }
                        else
                        {

                        }

                           result = 0;

                        if (SSObj.ContainsKey("ADSstaffingID") && SSObj["ADSstaffingID"] != null)
                        {
                            if (int.TryParse(SSObj["ADSstaffingID"].ToString(), out result))
                            {
                                SSUpdate.ADSstaffingID = Operations.opDataScenario.getDataScenarioObjbyID(int.Parse(SSObj["ADSstaffingID"].ToString()), _context);
                            }
                            else
                            {
                                SSUpdate.ADSstaffingID = Operations.opDataScenario.getDataScenarioObjbyCode(SSObj["ADSstaffingID"].ToString(), _context);
                            }
                        }
                        else
                        {

                        }
                          result = 0;

                        if (SSObj.ContainsKey("ADSstatisticsID") && SSObj["ADSstatisticsID"] != null)
                        {
                            if (int.TryParse(SSObj["ADSstatisticsID"].ToString(), out result))
                            {
                                SSUpdate.ADSstatisticsID = Operations.opDataScenario.getDataScenarioObjbyID(int.Parse(SSObj["ADSstatisticsID"].ToString()), _context);
                            }
                            else
                            {
                                SSUpdate.ADSstatisticsID = Operations.opDataScenario.getDataScenarioObjbyCode(SSObj["ADSstatisticsID"].ToString(), _context);
                            }
                        }
                        else
                        {

                        }










                        SSUpdate.TimePeriodID = SSObj.ContainsKey("timePeriodID") && SSObj["timePeriodID"] != null ? opTimePeriods.getTimePeriodObjbyID(int.Parse(SSObj["timePeriodID"].ToString()), _context) : null;
                        SSUpdate.Description = SSObj.ContainsKey("description") && SSObj["description"] != null ? SSObj["description"].ToString() : SSUpdate.Description;
                        SSUpdate.Comments = SSObj.ContainsKey("comments") && SSObj["comments"] != null ? SSObj["comments"].ToString() : SSUpdate.Comments;


                        SSUpdate.UpdateBy = int.Parse(_UserProfileID);
                        SSUpdate.UpdatedDate = DateTime.UtcNow;



                        await _context.SaveChangesAsync();

                        aPIResponse.status = "success";
                        aPIResponse.payload = SSUpdate.ToString();
                        aPIResponse.message = "record updated successfully ";

                    }

                }
                return aPIResponse;

            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                aPIResponse.status = "failed";
                aPIResponse.error = ex.StackTrace;
                aPIResponse.message = ex.Message;
                return aPIResponse;
            }
        }


        public async static Task<ABS.DBModels.APIResponse> DeleteBudgetVersions(Dictionary<string, object> SSObj, BudgetingContext _context)
        {
            ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();
            try
            {

                string _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "UserID").ToString();

                if (_UserProfileID == null)
                {

                    _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "userProfile").ToString();
                    if (_UserProfileID == null)
                    {

                        aPIResponse.status = "failed";
                        aPIResponse.payload = "";
                        aPIResponse.message = "user does not exist";
                        return aPIResponse;
                    }
                    else
                    {
                        _UserProfileID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyUsername(_UserProfileID, _context).UserProfileID.ToString();

                    }
                }
                else
                {

                    string successfullydeletedIDs = "Successfully deleted IDs: ";
                    string faileddeletedIDs = "Failed deletion IDs: ";


                    if (HelperFunctions.CheckKeyValuePairs(SSObj, "DeleteIDs").ToString() != null)
                    {

                        string delIDs = HelperFunctions.CheckKeyValuePairs(SSObj, "DeleteIDs").ToString();
                        delIDs = delIDs.Replace("[", "");
                        delIDs = delIDs.Replace("]", "");
                        string[] deletionIDs = delIDs.Split(',');


                        foreach (var item in deletionIDs)
                        {
                            if (item != null)
                            {
                                int delID = int.Parse(item);
                                var SSUpdate = _context._BudgetVersions
                                  .Where(a => a.BudgetVersionID == int.Parse(item) && a.IsDeleted == false && a.IsActive == true)
                                  .FirstOrDefault();

                                if (SSUpdate != null)
                                {
                                    _context.Entry(SSUpdate).State = EntityState.Modified;


                                    SSUpdate.IsActive = false;
                                    SSUpdate.IsDeleted = true;




                                    SSUpdate.UpdateBy = int.Parse(_UserProfileID);
                                    SSUpdate.UpdatedDate = DateTime.UtcNow;


                                    successfullydeletedIDs = successfullydeletedIDs + SSUpdate.BudgetVersionID.ToString() + ",";

                                    await _context.SaveChangesAsync();
                                }
                                else
                                {

                                    faileddeletedIDs = faileddeletedIDs + "," + SSUpdate.BudgetVersionID.ToString();

                                }



                            }
                        }

                        aPIResponse.status = "success";
                        aPIResponse.payload = successfullydeletedIDs + Environment.NewLine + faileddeletedIDs;
                        aPIResponse.message = "record deleted successfully ";

                    }
                    else
                    {
                        aPIResponse.status = "failed";
                        aPIResponse.payload = "";
                        aPIResponse.message = "record does not exist to delete";
                        return aPIResponse;
                    }
                }

                return aPIResponse;



            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                aPIResponse.status = "failed";
                aPIResponse.error = ex.StackTrace;
                aPIResponse.message = ex.Message;
                return aPIResponse;
            }
        }
        public async static Task<ABS.DBModels.APIResponse> RenameBudgetVersions(Dictionary<string, object> SSObj, BudgetingContext _context)
        {
            ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();
            try
            {

                string _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "UserID").ToString();

                if (_UserProfileID == "")
                {

                    _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "userProfile").ToString();
                    if (_UserProfileID == "")
                    {

                        aPIResponse.status = "failed";
                        aPIResponse.payload = "";
                        aPIResponse.message = "user does not exist";
                        return aPIResponse;
                    }
                    else
                    {
                        _UserProfileID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyUsername(_UserProfileID, _context).UserProfileID.ToString();

                    }
                }
                else
                {


                    string budgetVersionID = HelperFunctions.CheckKeyValuePairs(SSObj, "budgetVersionsData").ToString();

                    if (budgetVersionID == "")
                    {
                        aPIResponse.status = "failed";
                        aPIResponse.error = "";
                        aPIResponse.message = "Error getting data for this record";
                        return aPIResponse;
                    }


                    string xCode = HelperFunctions.CheckKeyValuePairs(SSObj, "code").ToString();

                    if (xCode != "")
                    {
                        var SSExists = _context._BudgetVersions
                            .Where(a => a.Code == xCode && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
                        if (SSExists != null && SSExists.BudgetVersionID.ToString() != budgetVersionID)
                        {

                            aPIResponse.status = "failed";
                            aPIResponse.error = "";
                            aPIResponse.message = "Code already exist. Please choose another code";
                            return aPIResponse;
                        }

                    }
                    else
                    {
                        aPIResponse.status = "failed";
                        aPIResponse.error = "";
                        aPIResponse.message = "Error getting data for this record";
                        return aPIResponse;
                    }


                    var SSUpdate = _context._BudgetVersions
                            .Where(a => a.BudgetVersionID == int.Parse(budgetVersionID) && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();


                    //int ifexists = _context._SystemSettings
                    //      .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                    //      .Count();

                    if (SSUpdate == null)
                    {

                        aPIResponse.status = "failed";
                        aPIResponse.error = "";
                        aPIResponse.message = "Error getting data for this record";
                        return aPIResponse;
                    }
                    else
                    {





                        _context.Entry(SSUpdate).State = EntityState.Modified;


                        SSUpdate.Code = SSObj.ContainsKey("code") && SSObj["code"] != null ? SSObj["code"].ToString() : SSUpdate.Code;

                        SSUpdate.Description = SSObj.ContainsKey("description") && SSObj["description"] != null ? SSObj["description"].ToString() : SSUpdate.Description;
                        SSUpdate.Comments = SSObj.ContainsKey("comments") && SSObj["comments"] != null ? SSObj["comments"].ToString() : SSUpdate.Comments;


                        SSUpdate.UpdateBy = int.Parse(_UserProfileID);
                        SSUpdate.UpdatedDate = DateTime.UtcNow;



                        await _context.SaveChangesAsync();

                        aPIResponse.status = "success";
                        aPIResponse.payload = SSUpdate.ToString();
                        aPIResponse.message = "record renamed successfully ";

                    }






                }

                return aPIResponse;



            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                aPIResponse.status = "failed";
                aPIResponse.error = ex.StackTrace;
                aPIResponse.message = ex.Message;
                return aPIResponse;
            }
        }

        public async static Task<ABS.DBModels.APIResponse> CopyBudgetVersions(Dictionary<string, object> SSObj, BudgetingContext _context)
        {
            ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();
            try
            {

                string _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "UserID").ToString();

                if (_UserProfileID == "")
                {

                    _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "userProfile").ToString();
                    if (_UserProfileID == null)
                    {

                        aPIResponse.status = "failed";
                        aPIResponse.payload = "";
                        aPIResponse.message = "user does not exist";
                        return aPIResponse;
                    }
                    else
                    {
                        _UserProfileID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyUsername(_UserProfileID, _context).UserProfileID.ToString();

                    }
                }
                else
                {


                    string budgetVersionID = HelperFunctions.CheckKeyValuePairs(SSObj, "budgetVersionsData").ToString();

                    budgetVersionID = budgetVersionID.Replace("[", "");
                    budgetVersionID = budgetVersionID.Replace("]", "");

                    if (budgetVersionID == "")
                    {
                        aPIResponse.status = "failed";
                        aPIResponse.error = "";
                        aPIResponse.message = "Error getting data for this record";
                        return aPIResponse;
                    }


                    var _contxt = getBudgetVersionContext(_context);

                    var SSUpdate = _contxt._BudgetVersions
                            .Where(a => a.BudgetVersionID == int.Parse(budgetVersionID) && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();

                    if (SSUpdate == null)
                    {

                        aPIResponse.status = "failed";
                        aPIResponse.error = "";
                        aPIResponse.message = "Error getting data for this record";
                        return aPIResponse;
                    }
                    else
                    {
                        string description = HelperFunctions.CheckKeyValuePairs(SSObj, "description").ToString();
                        string comments = HelperFunctions.CheckKeyValuePairs(SSObj, "comments").ToString();
                        string code = HelperFunctions.CheckKeyValuePairs(SSObj, "code").ToString();
                        string timePeriodID = HelperFunctions.CheckKeyValuePairs(SSObj, "timePeriodID").ToString();
                        string budgetVersionTypeID = HelperFunctions.CheckKeyValuePairs(SSObj, "budgetVersionTypeID").ToString();

                        ABS.DBModels.BudgetVersions copyBudgetVersion = new ABS.DBModels.BudgetVersions();

                        // validate incoming code 
                        var ifBVCodeExists = _context._BudgetVersions
                            .Any(a => a.Code == code && a.IsDeleted == false && a.IsActive == true)
                             ;
                        if (ifBVCodeExists)
                        {
                            aPIResponse.status = "failed";
                            aPIResponse.error = "";
                            aPIResponse.message = "Target Code already exists for Copy";
                            return aPIResponse;
                        }

                        DataCache.opRedisCache opCache = new DataCache.opRedisCache();
                        IEnumerable<ItemTypes> itemTypesData = await opCache.refreshKeyData<ItemTypes>("ALLITEMTYPES", _context, 1000);
                        var _ctxTimePeriods = opTimePeriods.getTimePeriodsContext(_context);

                        copyBudgetVersion.Code = code;
                        copyBudgetVersion.Description = description;
                        copyBudgetVersion.Comments = comments;
                        copyBudgetVersion.TimePeriodID = _ctxTimePeriods.TimePeriods.Find(int.Parse(timePeriodID));
                        copyBudgetVersion.budgetVersionTypeID = itemTypesData.Where(x => x.ItemTypeID == int.Parse(budgetVersionTypeID)).FirstOrDefault();

                        if (SSUpdate.scenarioTypeID != null && SSUpdate.scenarioTypeID.ToString().Length > 0)
                        {
                            copyBudgetVersion.scenarioTypeID = SSUpdate.scenarioTypeID;
                        }
                        

                        if (SSUpdate.ADSbudgetVersionID != null && SSUpdate.ADSbudgetVersionID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSbudgetVersionID = SSUpdate.ADSbudgetVersionID;
                        }
                        
                        if (SSUpdate.ADSgeneralLedgerID != null && SSUpdate.ADSgeneralLedgerID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSgeneralLedgerID = SSUpdate.ADSgeneralLedgerID;
                        }

                        if (SSUpdate.ADSscenarioTypeID != null && SSUpdate.ADSscenarioTypeID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSscenarioTypeID = SSUpdate.ADSscenarioTypeID;
                        }

                        if (SSUpdate.ADSstaffingID != null && SSUpdate.ADSstaffingID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSstaffingID = SSUpdate.ADSstaffingID;
                        }

                        if (SSUpdate.ADSstatisticsID != null && SSUpdate.ADSstatisticsID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSstatisticsID = SSUpdate.ADSstatisticsID;
                        }
                         
                        copyBudgetVersion.Identifier = Guid.NewGuid();
                        copyBudgetVersion.CreationDate = DateTime.UtcNow;

                        copyBudgetVersion.UpdatedDate = DateTime.UtcNow;
                        
                        copyBudgetVersion.CreatedBy = int.Parse(_UserProfileID);
                        copyBudgetVersion.UpdateBy = int.Parse(_UserProfileID);

                        copyBudgetVersion.UserProfileID = int.Parse(_UserProfileID);
                        copyBudgetVersion.IsActive = true;

                        copyBudgetVersion.IsDeleted = false;



                        _context.Add(copyBudgetVersion);


                        await _context.SaveChangesAsync();

                        aPIResponse.status = "success";
                        aPIResponse.payload = copyBudgetVersion.BudgetVersionID.ToString();
                        aPIResponse.message = "record copied successfully ";

                    }






                }

                return aPIResponse;



            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                aPIResponse.status = "failed";
                aPIResponse.error = ex.StackTrace;
                aPIResponse.message = ex.Message;
                return aPIResponse;
            }
        }

        public async static Task<ABS.DBModels.APIResponse> CopyBudgetVersionsOriginal(Dictionary<string, object> SSObj, BudgetingContext _context)
        {
            ABS.DBModels.APIResponse aPIResponse = new ABS.DBModels.APIResponse();
            try
            {

                string _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "UserID").ToString();

                if (_UserProfileID == "")
                {

                    _UserProfileID = HelperFunctions.CheckKeyValuePairs(SSObj, "userProfile").ToString();
                    if (_UserProfileID == null)
                    {

                        aPIResponse.status = "failed";
                        aPIResponse.payload = "";
                        aPIResponse.message = "user does not exist";
                        return aPIResponse;
                    }
                    else
                    {
                        _UserProfileID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyUsername(_UserProfileID, _context).UserProfileID.ToString();

                    }
                }
                else
                {


                    string budgetVersionID = HelperFunctions.CheckKeyValuePairs(SSObj, "budgetVersionsData").ToString();

                    budgetVersionID = budgetVersionID.Replace("[", "");
                    budgetVersionID = budgetVersionID.Replace("]", "");

                    if (budgetVersionID == "")
                    {
                        aPIResponse.status = "failed";
                        aPIResponse.error = "";
                        aPIResponse.message = "Error getting data for this record";
                        return aPIResponse;
                    }


                    var _contxt = getBudgetVersionContext(_context);

                    var SSUpdate = _contxt._BudgetVersions
                            .Where(a => a.BudgetVersionID == int.Parse(budgetVersionID) && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();


                    //int ifexists = _context._SystemSettings
                    //      .Where(a => a.UserProfileID == int.Parse(_UserProfileID) && a.SettingKey.ToUpper() == item.Key.ToUpper() && a.IsDeleted == false && a.IsActive == true)
                    //      .Count();

                    if (SSUpdate == null)
                    {

                        aPIResponse.status = "failed";
                        aPIResponse.error = "";
                        aPIResponse.message = "Error getting data for this record";
                        return aPIResponse;
                    }
                    else
                    {


                     




                        ABS.DBModels.BudgetVersions copyBudgetVersion = new ABS.DBModels.BudgetVersions();

                        if (SSUpdate.budgetVersionTypeID != null && SSUpdate.budgetVersionTypeID.ToString().Length > 0)
                        {
                            copyBudgetVersion.budgetVersionTypeID = SSUpdate.budgetVersionTypeID;
                        }



                        if (SSUpdate.Code != null && SSUpdate.Code.ToString().Length > 0)
                        {
                           

                            copyBudgetVersion.Code = SSUpdate.Code + " - COPY";

                        }
                        else
                        {
                            copyBudgetVersion.Code = " - COPY";
                        }


                        var ifBVCodeExists = _context._BudgetVersions
                            .Any(a => a.Code == copyBudgetVersion.Code && a.IsDeleted == false && a.IsActive == true)
                             ;
                        if (ifBVCodeExists)
                        {
                            aPIResponse.status = "failed";
                            aPIResponse.error = "";
                            aPIResponse.message = "Target Code already exists for Copy";
                            return aPIResponse;
                        }

                        if (SSUpdate.Description != null && SSUpdate.Description.ToString().Length > 0)
                        {
                            copyBudgetVersion.Description = SSUpdate.Description;
                        }


                        if (SSUpdate.Comments != null && SSUpdate.Comments.ToString().Length > 0)
                        {
                            copyBudgetVersion.Comments = SSUpdate.Comments;
                        }


                        if (SSUpdate.fiscalStartMonthID != null && SSUpdate.fiscalStartMonthID.ToString().Length > 0)
                        {
                            copyBudgetVersion.fiscalStartMonthID = SSUpdate.fiscalStartMonthID;
                        }


                        if (SSUpdate.fiscalYearID != null && SSUpdate.fiscalYearID.ToString().Length > 0)
                        {
                            copyBudgetVersion.fiscalYearID = SSUpdate.fiscalYearID;
                        }


                        if (SSUpdate.scenarioTypeID != null && SSUpdate.scenarioTypeID.ToString().Length > 0)
                        {
                            copyBudgetVersion.scenarioTypeID = SSUpdate.scenarioTypeID;
                        }
                        
                        if (SSUpdate.TimePeriodID != null && SSUpdate.TimePeriodID.ToString().Length > 0)
                        {
                            copyBudgetVersion.TimePeriodID = SSUpdate.TimePeriodID;
                        }
                        if (SSUpdate.ADSbudgetVersionID != null && SSUpdate.ADSbudgetVersionID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSbudgetVersionID = SSUpdate.ADSbudgetVersionID;
                        }
                        
                        if (SSUpdate.ADSgeneralLedgerID != null && SSUpdate.ADSgeneralLedgerID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSgeneralLedgerID = SSUpdate.ADSgeneralLedgerID;
                        }
                        if (SSUpdate.ADSscenarioTypeID != null && SSUpdate.ADSscenarioTypeID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSscenarioTypeID = SSUpdate.ADSscenarioTypeID;
                        }
                        if (SSUpdate.ADSstaffingID != null && SSUpdate.ADSstaffingID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSstaffingID = SSUpdate.ADSstaffingID;
                        }
                        if (SSUpdate.ADSstatisticsID != null && SSUpdate.ADSstatisticsID.ToString().Length > 0)
                        {
                            copyBudgetVersion.ADSstatisticsID = SSUpdate.ADSstatisticsID;
                        }
                         


                       




                        copyBudgetVersion.Identifier = Guid.NewGuid();
                        copyBudgetVersion.CreationDate = DateTime.UtcNow;

                        copyBudgetVersion.UpdatedDate = DateTime.UtcNow;
                        
                        copyBudgetVersion.CreatedBy = int.Parse(_UserProfileID);
                        copyBudgetVersion.UpdateBy = int.Parse(_UserProfileID);

                        copyBudgetVersion.UserProfileID = int.Parse(_UserProfileID);
                        copyBudgetVersion.IsActive = true;

                        copyBudgetVersion.IsDeleted = false;



                        _context.Add(copyBudgetVersion);


                        await _context.SaveChangesAsync();

                        aPIResponse.status = "success";
                        aPIResponse.payload = copyBudgetVersion.BudgetVersionID.ToString();
                        aPIResponse.message = "record copied successfully ";

                    }






                }

                return aPIResponse;



            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                aPIResponse.status = "failed";
                aPIResponse.error = ex.StackTrace;
                aPIResponse.message = ex.Message;
                return aPIResponse;
            }
        }

        public async static Task<bool>  UpdateBudgetVersionCalculationStatus(string status, BudgetVersions bv, BudgetingContext _context)
        {
            Console.WriteLine("Target Budgetversion Status Updated to: " + status);

            await Task.Delay(1);
             
            if (bv != null)
            {
                _context.Entry(bv).State = EntityState.Modified;

                bv.CalculationStatus = status;
                bv.UpdatedDate = DateTime.UtcNow;

                 _context.SaveChanges();
            }
            return true;
        }

    }
}
