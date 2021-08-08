using ABS.DBModels;
using ABSDAL.Context;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Text;
using ABS.DBModels.Models.SecurityModels;

namespace ABSDAL.Operations
{
    public class opAuthentication
    {
        public async static Task<UserAuthResponse> UserSignIn(UserAuthRequest userObj, BudgetingContext _context)
        {
            await Task.Delay(1);
            var AuthMode = opItemTypes.getAuthenticationMode(_context);
            UserAuthResponse xres = new UserAuthResponse();

            if (AuthMode == "LDAP")
            {
                var authresult = await callLDAPAuthenticationService(userObj, _context);

                if (authresult == "")
                {
                    xres.status = "Authentication failed";
                    xres.userToken = "";
                    xres.UserProfile = null;
                }
                else
                  if (authresult.ToUpper().Contains("UNAUTHORIZED"))
                {
                    xres.status = "Authentication failed";
                    xres.userToken = "";
                    xres.UserProfile = null;
                }
                else
                {
                    xres.status = "Success";
                    xres.userToken = authresult;
                    var checkUser = _context._IdentityUserProfile.Where(f => f.Username == userObj.username && f.UserPassword == userObj.password).FirstOrDefault();
                    if (checkUser == null)
                    {
                        var newprof = opIdentityUserProfile.insertProfiler(userObj.username, userObj.password, true, _context);
                        xres.UserProfile = newprof;
                    }
                    else
                    {
                        xres.UserProfile = checkUser;
                    }

                }

            }
            else
            {
                var checkUser = _context._IdentityUserProfile.Where(f => f.Username == userObj.username && f.UserPassword == userObj.password).FirstOrDefault();

                if (checkUser == null)
                {
                    xres.status = "Authentication failed";
                    xres.userToken = "";
                    xres.UserProfile = null;
                }
                else
                {

                    xres.status = "Success";

                    var authresult = await callSecurityTokenService(userObj, _context);
                    xres.userToken = authresult;
                    xres.UserProfile = checkUser;

                }

            }

            return xres;



        }

        internal async static Task<string> UpdateRoleSetupDetails(RoleAuthenticationModel ramObj, BudgetingContext _context)
        {
            try
            {
                await Task.Delay(1);


                int roleid = 0;
                if (ramObj == null)
                {
                    return "Empty Object";
                }

                if (ramObj.RoleProfile.IdentityAppRoleID == 0)
                {
                    var result = await opIdentityAppRoles.InsertRecords(ramObj.RoleProfile, _context);
                    result = result.Replace("Record(s) saved successfully with ID:", "");
                    int.TryParse(result, out roleid);
                    ramObj.RoleProfile.IdentityAppRoleID = roleid;



                }
                else
                {
                    roleid = ramObj.RoleProfile.IdentityAppRoleID;

                    var _RoleProfile = await opIdentityAppRoles.UpdateRecordbyRole(ramObj.RoleProfile, _context);

                }
                if (roleid == 0)
                {
                    return "Error storing role profile Object";
                }
                else
                {
                    if (ramObj.AllUserRoles != null)
                    {
                        foreach (var item in ramObj.AllUserRoles)
                        {
                            item.AppRoleID.IdentityAppRoleID = roleid;
                        } 
                    }

                    if (ramObj.AllRoleScreens != null)
                    {
                        foreach (var item in ramObj.AllRoleScreens)
                        {
                            item.AppRoleID.IdentityAppRoleID = roleid;
                        } 
                    }

                    if (ramObj.AllRoleScreenOperations != null)
                    {
                        foreach (var item in ramObj.AllRoleScreenOperations)
                        {
                            item.AppRoleID.IdentityAppRoleID = roleid;
                        } 
                    }
                }
                /* Delete Existing Records */
                bool _DelAllUserRoles = await opIdentityAppRoleUsers.DeleteRecordsbyRole(roleid, _context);

                bool _DelAllRoleScreens = await opIdentityAppRoleScreens.DeleteRecordsbyRole(roleid, _context);

                bool _DelAllRoleScreenOperations = await opIdentityAppRoleScreenOperations.DeleteRecordsbyRole(roleid, _context);



                /* Insert New Records for each Role relation*/
                var _AllUserRoles = await opIdentityAppRoleUsers.InsertRecordsbyRole(ramObj.AllUserRoles, _context);

                var _AllRoleScreens = await opIdentityAppRoleScreens.InsertRecordsbyRole(ramObj.AllRoleScreens, _context);

                var _AllRoleScreenOperations = await opIdentityAppRoleScreenOperations.InsertRecordsbyRole(ramObj.AllRoleScreenOperations, _context);

                return "Record(s) saved successfully";

            }
            catch (Exception ex)
            {

                Console.WriteLine("UpdateRoleDetails: " + ex);
                return null;
            }
        }

        internal async static Task<string> GenerateMenuData(string menuObj, BudgetingContext _context)
        {
            if (menuObj != "")
            {

                List<MenuItems> menuitems = JsonConvert.DeserializeObject<List<MenuItems>>(menuObj);

                foreach (var item in menuitems)
                {
                    // MenuItems menuitems = JsonConvert.DeserializeObject<MenuItems>(item.ToString());
                    IdentityScreens screenObj = new IdentityScreens();
                    List<IdentityOperations> lstOperation = new List<IdentityOperations>();


                    if (item.Screens != null)
                    {
                        screenObj = await opIdentityScreens.GetScreenbyName(item.Screens, true, _context);

                    }

                    if (item.actionsPermission != null)
                    {
                        foreach (var operationName in item.actionsPermission)
                        {
                            lstOperation.Add(await opIdentityOperations.GetOperationsObj(operationName, true, _context));

                        }
                    }

                    if (screenObj != null && lstOperation != null && lstOperation.Count > 0)
                    {
                        foreach (var op in lstOperation)
                        {

                            var screenop = await opIdentityScreenOperations.GetScreenOperations(screenObj, op, true, _context);

                        }
                    }



                }

            }
            return "Done";
        }

        internal async static Task<RoleAuthenticationModel> RoleSetupDetails(string ramObj, BudgetingContext _context)
        {
            try
            {


                await Task.Delay(1);




                if (ramObj == "")
                {
                    return null;
                }
                int ROleID = 0;
                var parseid = int.TryParse(ramObj, out ROleID);

                RoleAuthenticationModel ram = new RoleAuthenticationModel();


                ram.RoleProfile = _context._IdentityRoles.Where(f => f.IdentityAppRoleID == ROleID && f.IsActive == true && f.IsDeleted == false).FirstOrDefault();
                ram.AllUserRoles = _context._IdentityAppRoleUsers
                    .Where(f => f.AppRoleID == ram.RoleProfile
                    && f.IsActive == true
                    && f.IsDeleted == false)
                    //.Include(f=>f.AppRoleID)
                    .Include(f => f.UserID)
                    .Select(f => f)
                    .ToList();


                ram.AllRoleScreens = _context._IdentityAppRoleScreens.Where(f => f.AppRoleID == ram.RoleProfile
                && f.IsActive == true
                && f.IsDeleted == false)
                    //.Include(f=>f.UserID)
                    //.Include(f=>f.AppRoleID)
                    .Include(f => f.ScreenID)
                    .Select(f => f).ToList();


                ram.AllRoleScreenOperations = _context._IdentityAppRoleScreenOperations
                    .Where(f => f.AppRoleID == ram.RoleProfile
                    && f.IsActive == true
                    && f.IsDeleted == false)
                    //.Include(f => f.UserID)
                    //.Include(f => f.AppRoleID)
                    .Include(f => f.ScreenOperationID)
                    .Include(f => f.ScreenOperationID).ThenInclude(f => f.IdentityScreens)
                    .Include(f => f.ScreenOperationID).ThenInclude(f => f.IdentityOperation)


                    .Select(f => f)
                    .ToList();

                return ram;


            }
            catch (Exception ex)
            {

                Console.WriteLine("ROleDetails: " + ex);
                return null;
            }


        }



        private async static Task<string> callLDAPAuthenticationService(UserAuthRequest userObj, BudgetingContext _context)
        {
            await Task.Delay(1);
            var AuthURL = opItemTypes.getAuthenticationSignInURL(_context);

            var hostport = Environment.GetEnvironmentVariable("AUTH_PORT");
            // hostport = "20200";
            var httpurl = AuthURL.Replace("{AUTH_PORT}", hostport);
            string jJson = JsonConvert.SerializeObject(userObj);

            var getpostResponse = await Operations.opHttpClientRestSharp.PostABSAPIData(httpurl, jJson);

            if (getpostResponse == "")
            {
                return "";
            }
            else
            {
                //{
                //                  "type": "https://tools.ietf.org/html/rfc7235#section-3.1",
                //"title": "Unauthorized",
                //"status": 401,
                //"traceId": "|49224791-4160075c4da37813."
                //}
                if (getpostResponse.Contains("status"))
                {

                    dynamic resdata = JsonConvert.DeserializeObject(getpostResponse);

                    if (resdata.status == "401") { return ""; } else { return getpostResponse; }
                }
                else
                {
                    return getpostResponse;
                }

            }


            // return "";
        }
        private async static Task<string> callSecurityTokenService(UserAuthRequest userObj, BudgetingContext _context)
        {
            await Task.Delay(1);
            var AuthURL = opItemTypes.getSecurityTokenURL(_context);

            var hostport = Environment.GetEnvironmentVariable("AUTH_PORT");
            // hostport = "20200";

            var httpurl = AuthURL.Replace("{AUTH_PORT}", hostport);

            var getpostResponse = await Operations.opHttpClientRestSharp.GetADSAPIData(httpurl);


            if (getpostResponse == "")
            {
                return "";
            }
            else
            {
                   dynamic rawdata = JsonConvert.DeserializeObject<dynamic>(getpostResponse);
                dynamic ResponseToken = JsonConvert.DeserializeObject<AuthenticationToken>(rawdata);
                return ResponseToken.access_token;

            }


            //  return "";
        }

        public async static Task<UserAuthenticationModel> UserDetails(string userObj, BudgetingContext _context)
        {
            try
            {
                await Task.Delay(1);
                //_context._IdentityAppRoleDataEntities.Include(f => f.EntityID).ToList();
                //_context._IdentityAppRoleDataDepartments.Include(f => f.DepartmentID).ToList();
                //_context._IdentityAppRoleDataStatistics.Include(f => f.StatsCodeID).ToList();
                //_context._IdentityAppRoleDataGLAccounts.Include(f => f.GLAccountsID).ToList();
                //_context._IdentityAppRoleDataPayTypes.Include(f => f.PayTypesID).ToList();
                //_context._IdentityAppRoleDataJobCodes.Include(f => f.JobCodesID).ToList();




                if (userObj == "")
                {
                    return null;
                }
                int userid = 0;
                var parseid = int.TryParse(userObj, out userid);

                UserAuthenticationModel uam = new UserAuthenticationModel();


                uam.UserProfile = _context._IdentityUserProfile.Where(f => f.UserProfileID == userid && f.IsActive == true && f.IsDeleted == false).FirstOrDefault();

                uam.AllUserRoles = _context._IdentityAppRoleUsers
                    .Include(f=>f.UserID)
                    .Where(f => f.UserID.UserProfileID == uam.UserProfile.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)
                     .Include(f => f.AppRoleID)
                    .Select(f => f).ToList();


                uam.AllRoleScreens = _context._IdentityAppRoleScreens
                    .Include(f => f.UserID)

                    .Where(f => f.UserID.UserProfileID == uam.UserProfile.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)
                    .Include(f => f.ScreenID)
                    .Select(f => f)
                    .ToList();

                uam.AllRoleScreenOperations = _context._IdentityAppRoleScreenOperations
                    .Include(f => f.UserID)

                    .Where(f => f.UserID.UserProfileID == uam.UserProfile.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)
                    .Include(f => f.ScreenOperationID).ThenInclude(f => f.IdentityScreens)
                    .Include(f => f.ScreenOperationID).ThenInclude(f => f.IdentityOperation)
                     .Select(f => f)
                    .ToList();


                uam.AllRoleEntities = _context._IdentityAppRoleDataEntities
                    .Include(f => f.UserID)

                    .Where(f => f.UserID.UserProfileID == uam.UserProfile.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)
                    .Include(f => f.EntityID)
                    .Select(f => f)
                    .ToList();

                uam.AllRoleDepartments = _context._IdentityAppRoleDataDepartments
                    .Include(f => f.UserID)

                    .Where(f => f.UserID.UserProfileID == uam.UserProfile.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)
                    .Include(f => f.DepartmentID)

                    .Select(f => f)
                    .ToList();

                uam.AllRoleStatisticCodes = _context._IdentityAppRoleDataStatistics
                    .Include(f => f.UserID)
                    .Include(f => f.StatsCodeID)
                    .Where(f => f.UserID.UserProfileID == uam.UserProfile.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)
                    .Select(f => f)
                    .ToList();


                uam.AllRoleGLAccounts = _context._IdentityAppRoleDataGLAccounts
                    .Include(f => f.UserID)
                    .Include(f => f.GLAccountsID)

                    .Where(f => f.UserID.UserProfileID == uam.UserProfile.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)
                   
                    .Select(f => f)
                    .ToList();

                uam.AllRolePayTypes = _context._IdentityAppRoleDataPayTypes
                    .Include(f => f.UserID)
                                        .Include(f => f.PayTypesID)

                    .Where(f => f.UserID.UserProfileID == uam.UserProfile.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)

                    .Select(f => f)
                    .ToList();


                uam.AllRoleJobCodes = _context._IdentityAppRoleDataJobCodes
                    .Include(f => f.UserID)

                    .Where(f => f.UserID.UserProfileID == uam.UserProfile.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)
                    .Include(f => f.JobCodesID)

                    .Select(f => f)
                    .ToList();

                return uam;


            }
            catch (Exception ex)
            {

                Console.WriteLine("UserDetails: " + ex);
                return null;
            }

        }
        public async static Task<string> UpdateUserDetails(UserAuthenticationModel userObj, BudgetingContext _context)
        {
            try
            {
                await Task.Delay(1);
                _context._IdentityAppRoleDataEntities.Include(f => f.EntityID).ToList();
                _context._IdentityAppRoleDataDepartments.Include(f => f.DepartmentID).ToList();
                _context._IdentityAppRoleDataStatistics.Include(f => f.StatsCodeID).ToList();
                _context._IdentityAppRoleDataGLAccounts.Include(f => f.GLAccountsID).ToList();
                _context._IdentityAppRoleDataPayTypes.Include(f => f.PayTypesID).ToList();
                _context._IdentityAppRoleDataJobCodes.Include(f => f.JobCodesID).ToList();



                int userid = 0;
                if (userObj == null)
                {
                    return "Empty Object";
                }

                if (userObj.UserProfile.UserProfileID == 0)
                {
                    var result = await opIdentityUserProfile.InsertRecords(userObj.UserProfile, _context);
                    result = result.Replace("Record(s) saved successfully with ID:", "");
                    int.TryParse(result, out userid);

                    userObj.UserProfile.UserProfileID = userid;

                }
                else
                {
                    userid = userObj.UserProfile.UserProfileID;
                    var _UserProfile = await opIdentityUserProfile.UpdateIdentityUserProfile(userObj.UserProfile, _context);


                }

                if (userid == 0)
                {
                    return "Error storing user profile Object";
                }
                else
                {
                    if (userObj.AllRoleDepartments != null)
                    {
                        foreach (var item in userObj.AllRoleDepartments)
                        {
                            item.UserID = userObj.UserProfile;

                        }
                    }
                    if (userObj.AllRoleEntities != null)
                    {
                        foreach (var item in userObj.AllRoleEntities)
                        {
                            item.UserID = userObj.UserProfile;

                        } 
                    }
                    if (userObj.AllRoleStatisticCodes != null)
                    {
                        foreach (var item in userObj.AllRoleStatisticCodes)
                        {
                            item.UserID = userObj.UserProfile;

                        } 
                    }
                    if (userObj.AllRoleGLAccounts != null)
                    {
                        foreach (var item in userObj.AllRoleGLAccounts)
                        {
                            item.UserID = userObj.UserProfile;

                        } 
                    }

                    if (userObj.AllRoleJobCodes != null)
                    {
                        foreach (var item in userObj.AllRoleJobCodes)
                        {
                            item.UserID = userObj.UserProfile;

                        } 
                    }
                    if (userObj.AllRolePayTypes != null)
                    {
                        foreach (var item in userObj.AllRolePayTypes)
                        {
                            item.UserID = userObj.UserProfile;

                        } 
                    }
                    if (userObj.AllRoleScreenOperations != null)
                    {
                        foreach (var item in userObj.AllRoleScreenOperations)
                        {
                            item.UserID = userObj.UserProfile;

                        } 
                    }
                    if (userObj.AllRoleScreens != null)
                    {
                        foreach (var item in userObj.AllRoleScreens)
                        {
                            item.UserID = userObj.UserProfile;

                        } 
                    }

                    if (userObj.AllUserRoles != null)
                    {
                        foreach (var item in userObj.AllUserRoles)
                        {
                            item.UserID = userObj.UserProfile;

                        } 
                    }

                }



                bool _DelAllUserRoles = await opIdentityAppRoleUsers.DeleteRecordsbyUser(userid, _context);

                bool _DelAllRoleScreens = await opIdentityAppRoleScreens.DeleteRecordsbyUser(userid, _context);

                bool _DelAllRoleScreenOperations = await opIdentityAppRoleScreenOperations.DeleteRecordsbyUser(userid, _context);

                bool _DelAllRoleEntities = await opIdentityAppRoleDataEntities.DeleteRecordsbyUser(userid, _context);

                bool _DelAllRoleDepartments = await opIdentityAppRoleDataDepartments.DeleteRecordsbyUser(userid, _context);

                bool _DelAllRoleStatisticCodes = await opIdentityAppRoleDataStatistics.DeleteRecordsbyUser(userid, _context);

                bool _DeAllRoleGLAccounts = await opIdentityAppRoleDataGLAccounts.DeleteRecordsbyUser(userid, _context);

                bool _DelAllRolePayTypes = await opIdentityAppRoleDataPayTypes.DeleteRecordsbyUser(userid, _context);

                bool _DelAllRoleJobCodes = await opIdentityAppRoleDataJobCodes.DeleteRecordsbyUser(userid, _context);



                if (userObj.AllUserRoles != null)
                {
                    var _AllUserRoles = await opIdentityAppRoleUsers.InsertRecords(userObj.AllUserRoles, _context);
                }
                if (userObj.AllRoleScreens != null)
                {
                    var _AllRoleScreens = await opIdentityAppRoleScreens.InsertRecords(userObj.AllRoleScreens, _context);
                }
                if (userObj.AllRoleScreenOperations != null)
                {
                    var _AllRoleScreenOperations = await opIdentityAppRoleScreenOperations.InsertRecords(userObj.AllRoleScreenOperations, _context);

                }
                if (userObj.AllRoleEntities != null)
                {
                    var _AllRoleEntities = await opIdentityAppRoleDataEntities.InsertRecords(userObj.AllRoleEntities, _context);

                }
                if (userObj.AllRoleDepartments != null)
                {
                    var _AllRoleDepartments = await opIdentityAppRoleDataDepartments.InsertRecords(userObj.AllRoleDepartments, _context);

                }
                if (userObj.AllRoleStatisticCodes != null)
                {
                    var _AllRoleStatisticCodes = await opIdentityAppRoleDataStatistics.InsertRecords(userObj.AllRoleStatisticCodes, _context);

                }

                if (userObj.AllRoleGLAccounts != null)
                {
                    var _AllRoleGLAccounts = await opIdentityAppRoleDataGLAccounts.InsertRecords(userObj.AllRoleGLAccounts, _context);

                }
                if (userObj.AllRolePayTypes != null)
                {
                    var _AllRolePayTypes = await opIdentityAppRoleDataPayTypes.InsertRecords(userObj.AllRolePayTypes, _context);

                }
                if (userObj.AllRoleJobCodes != null)
                {
                    var _AllRoleJobCodes = await opIdentityAppRoleDataJobCodes.InsertRecords(userObj.AllRoleJobCodes, _context);

                }



                return "Successful";


            }
            catch (Exception ex)
            {

                Console.WriteLine("UserDetails: " + ex);
                return null;
            }

        }


        public async static Task<string> GetUserAuthorization(string userObj, BudgetingContext _context)
        {
            try
            {
                await Task.Delay(1);
                //_context._IdentityAppRoleDataEntities.Include(f => f.EntityID).ToList();
                //_context._IdentityAppRoleDataDepartments.Include(f => f.DepartmentID).ToList();
                //_context._IdentityAppRoleDataStatistics.Include(f => f.StatsCodeID).ToList();
                //_context._IdentityAppRoleDataGLAccounts.Include(f => f.GLAccountsID).ToList();
                //_context._IdentityAppRoleDataPayTypes.Include(f => f.PayTypesID).ToList();
                //_context._IdentityAppRoleDataJobCodes.Include(f => f.JobCodesID).ToList();




                if (userObj == "")
                {
                    return null;
                }
                int userid = 0;
                var parseid = int.TryParse(userObj, out userid);

                UserprofileModel UserProfileDetails = new UserprofileModel();


                UserProfileDetails.UserID = _context._IdentityUserProfile
                    .Where(f => f.UserProfileID == userid 
                    && f.IsActive == true 
                    && f.IsDeleted == false)
                    .FirstOrDefault();

                if (UserProfileDetails.UserID == null)
                {
                    return "User does not exists";
                }
                 

                var  AllUserRoles = _context._IdentityAppRoleUsers
                    .Include(f => f.UserID)
                    .Where(f => f.UserID.UserProfileID == UserProfileDetails.UserID.UserProfileID
                    && f.IsActive == true
                    && f.IsDeleted == false)
                     .Include(f => f.AppRoleID)
                    .Select(f => f).ToList();


                StringBuilder AllMenuItems = new StringBuilder();
                foreach (var item in AllUserRoles)
                {
                     AllMenuItems.Append(await opIdentityAppRoleScreenOperations.GetMenuitemsWithoutRole(item.AppRoleID.IdentityAppRoleID, _context));
                }

                UserProfileDetails.MenuItemsList = AllMenuItems.ToString();

                string jsonformat = JsonConvert.SerializeObject(UserProfileDetails);
                //var AllUserSpecificRoles = _context._IdentityAppRoleUsers
                //  .Include(f => f.UserID)
                //  .Where(f => f.UserID.UserProfileID == UserProfileDetails.UserID.UserProfileID
                //  && f.IsActive == true
                //  && f.IsDeleted == false)
                //   .Include(f => f.AppRoleID)
                //  .Select(f => f).ToList();





                //var allROleIDs = AllUserSpecificRoles.Select(f => f.AppRoleID).ToList();

                //var AllRoleScreenOperations = _context._IdentityAppRoleScreenOperations
                //   .Include(f => f.UserID)
                //   .Include(f => f.ScreenOperationID).ThenInclude(f => f.IdentityScreens)
                //   .Include(f => f.ScreenOperationID).ThenInclude(f => f.IdentityOperation)
                //   .Where(f =>  allROleIDs.Contains( f.AppRoleID)
                //   && f.IsActive == true
                //   && f.IsDeleted == false)
                //    .Select(f => f)
                //   .ToList();




                return jsonformat;


            }
            catch (Exception ex)
            {

                Console.WriteLine("GetUserAuthorization: " + ex);
                return "GetUserAuthorization: Error Please check with administrator";
            }

        }


    }

    public class AuthenticationToken
    {
        public string access_token { get; set; }
        public int expires_in { get; set; }
        public string token_type { get; set; }
        public string scope { get; set; }
    }
}
