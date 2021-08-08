using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;

namespace ABSDAL.Operations
{
    public class opIdentityUserProfile
    {


        public static ABS.DBModels.IdentityUserProfile insertProfiler(string username, string pwd, bool isldap, BudgetingContext _context)
        {
            try
            {
                IdentityUserProfile idp = new IdentityUserProfile();
                idp.Username = username;
                idp.UserPassword = pwd;
                idp.IsActive = true;
                idp.IsDeleted = false;
                idp.isLDAPUser = isldap;
                idp.CreationDate = DateTime.UtcNow;
                idp.UpdatedDate = DateTime.UtcNow;
                idp.Identifier = Guid.NewGuid();

                _context._IdentityUserProfile.Add(idp);
                var insertedid = _context.SaveChanges();

                return idp;
            }
            catch (Exception)
            {

                Console.WriteLine("Error inserting profile data");
                return null;
            }

        }
        public async static Task<IdentityUserProfile> UpdateIdentityUserProfile(IdentityUserProfile userProfile, BudgetingContext _context)
        {

            try
            {
                if (userProfile!= null)
                {

                    if (userProfile.UserProfileID != 0)
                    {
                        var iduserProfile= await _context._IdentityUserProfile.Where(f => f.UserProfileID == userProfile.UserProfileID
                        && f.IsActive == true
                        && f.IsDeleted == false).FirstOrDefaultAsync();


                        if (iduserProfile== null)
                        {

                        }
                        else
                        {

                            iduserProfile.UserEntities = userProfile.UserEntities;
                            iduserProfile.UserDepartments = userProfile.UserDepartments;
                            iduserProfile.UserStatisticCodes = userProfile.UserStatisticCodes;
                            iduserProfile.UserGLAccounts = userProfile.UserGLAccounts;
                            iduserProfile.UserPayTypes = userProfile.UserPayTypes;
                            iduserProfile.UserJobCodes = userProfile.UserJobCodes;
                            iduserProfile.FirstName = userProfile.FirstName;
                            iduserProfile.MiddleName = userProfile.MiddleName;
                            iduserProfile.LastName = userProfile.LastName;
                            iduserProfile.DOB = userProfile.DOB;
                            iduserProfile.ContactNumber = userProfile.ContactNumber;
                            iduserProfile.Address = userProfile.Address;
                            iduserProfile.Username = userProfile.Username;
                            iduserProfile.UserPassword = userProfile.UserPassword;
                            iduserProfile.Initials = userProfile.Initials;
                            iduserProfile.JobFunction = userProfile.JobFunction;
                            iduserProfile.isLDAPUser = userProfile.isLDAPUser;
                            iduserProfile.IsActive = userProfile.IsActive;
                            iduserProfile.IsDeleted = userProfile.IsDeleted;
                            iduserProfile.UpdateBy = userProfile.UpdateBy;
                            iduserProfile.UpdatedDate = DateTime.Now;



                            _context.Entry(iduserProfile).State = EntityState.Modified;
                            var x = await _context.SaveChangesAsync();

                            userProfile= null;
                            userProfile= iduserProfile;
                        }


                    }
                    else
                    {

                    }
                }
                else
                { }

                return userProfile;
            }
            catch (Exception ex)
            {

                Console.WriteLine(" Update USER Profile : " + ex);
                return userProfile;
            }

        }
        public async static Task<IdentityUserProfile> UpdateUserPassword(IdentityUserProfile userProfile, BudgetingContext _context)
        {

            try
            {
                if (userProfile!= null)
                {

                    if (userProfile.UserProfileID != 0)
                    {
                        var iduserProfile= await _context._IdentityUserProfile.Where(f => f.UserProfileID == userProfile.UserProfileID

                        && f.Username == userProfile.Username
                        && f.IsActive == true
                        && f.IsDeleted == false).FirstOrDefaultAsync();


                        if (iduserProfile== null)
                        {
                            return null;
                        }
                        else
                        {

                            
                            iduserProfile.UserPassword = userProfile.UserPassword;
                            iduserProfile.UpdateBy = userProfile.UpdateBy;
                            iduserProfile.UpdatedDate = DateTime.Now;

                            _context.Entry(iduserProfile).State = EntityState.Modified;
                            var x = await _context.SaveChangesAsync();

                            userProfile= null;
                            userProfile= iduserProfile;
                        }
                    }
                    else
                    {

                    }
                }
                else
                { }

                return userProfile;
            }
            catch (Exception ex)
            {
                Console.WriteLine(" ERROR in Updating USER Profile : " + ex);
                return userProfile;
            }

        }

        public async static Task<string> InsertRecords(IdentityUserProfile identityUserProfile, BudgetingContext _context)
        {
            _context._IdentityUserProfile.Add(identityUserProfile);
            await _context.SaveChangesAsync();

            return ("Record(s) saved successfully with ID:" + identityUserProfile.UserProfileID);
        }

 
        public static IdentityUserProfile getIdentityUserProfileObjbyValue(int id, BudgetingContext _context)
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
        public async static Task<List<IdentityUserProfile>> getAllIdentityUserProfile(BudgetingContext _context)
        {


            var ITUpdate = await _context._IdentityUserProfile
                            .Where(a => a.IsDeleted == false && a.IsActive == true)
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

        public static string GetUsernamefromList(int userProfileID, List<IdentityUserProfile> userProfile)
        {
            if (userProfileID == 0)
            {
                return "";
            }
            else

            {

                var userNameObj = userProfile.Where(t => t.UserProfileID == userProfileID).FirstOrDefault();

                if (userNameObj == null)
                {
                    return "";
                }
                else
                {
                    return userNameObj.Username;
                }

            }
        }

    }
}
