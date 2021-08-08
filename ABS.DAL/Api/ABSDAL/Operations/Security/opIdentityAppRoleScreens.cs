using ABS.DBModels;
using ABSDAL.Context;
using System;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoleScreens
    {
        internal static IdentityScreens getIdentityAppRoleScreensObjbyID(int IdentityScreensID , BudgetingContext _context)
        {
            ABS.DBModels.IdentityScreens ITUpdate = _context._IdentityScreens
                .Where(a => a.IdentityScreenID == IdentityScreensID
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }

        public async static Task<string> InsertRecords(List<IdentityAppRoleScreens> lstidentityAppRoleScreens, BudgetingContext _context)
        {
            _context._IdentityAppRoleScreens.Include(f => f.ScreenID).ToList();
            _context._IdentityAppRoleScreens.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleScreens.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleScreens.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
            if (lstidentityAppRoleScreens == null )
            {
                Console.WriteLine( "Error inserting IdentityAppRoleScreens"); 
            return "Error inserting IdentityAppRoleScreens"; }
            foreach (var identityAppRoleScreens in lstidentityAppRoleScreens)
            {

                if (identityAppRoleScreens.AppRoleID != null)
                {
                    identityAppRoleScreens.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleScreens.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleScreens.UserID != null)
                {
                    identityAppRoleScreens.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleScreens.UserID.UserProfileID.ToString()), _context);
                }
                if (identityAppRoleScreens.ScreenID != null)
                {
                    identityAppRoleScreens.ScreenID = Operations.opIdentityAppRoleScreens.getIdentityAppRoleScreensObjbyID(int.Parse(identityAppRoleScreens.ScreenID.IdentityScreenID.ToString()), _context);
                }


                identityAppRoleScreens.CreationDate = DateTime.UtcNow;
                identityAppRoleScreens.UpdatedDate = DateTime.UtcNow;
                identityAppRoleScreens.IsActive = true;
                identityAppRoleScreens.IsDeleted = false;

                _context._IdentityAppRoleScreens.Add(identityAppRoleScreens);
            }
            await _context.SaveChangesAsync();
            //return CreatedAtAction("Record(s) saved successfull", "");
            return  ("Record(s) saved successfully");

            // return CreatedAtAction("GetIdentityAppRoleScreens", new { id = identityAppRoleScreens.IdentityAppRoleScreenID }, identityAppRoleScreens);

        }

        internal async static Task<bool> DeleteRecordsbyUser(int userid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleScreens.Where(f => f.UserID.UserProfileID == userid);
            _context._IdentityAppRoleScreens.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }

        internal async static Task<bool> DeleteRecordsbyRole(int roleid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleScreens.Where(f => f.AppRoleID.IdentityAppRoleID== roleid);
            _context._IdentityAppRoleScreens.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }

        internal async static Task<string> InsertRecordsbyRole(List<IdentityAppRoleScreens> allRoleScreens, BudgetingContext _context)
        {
            _context._IdentityAppRoleScreens.Include(f => f.ScreenID).ToList();
            _context._IdentityAppRoleScreens.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleScreens.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleScreens.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            foreach (var identityAppRoleScreens in allRoleScreens)
            {

                if (identityAppRoleScreens.AppRoleID != null)
                {
                    identityAppRoleScreens.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleScreens.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleScreens.UserID != null)
                {
                    identityAppRoleScreens.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleScreens.UserID.UserProfileID.ToString()), _context);
                }
                if (identityAppRoleScreens.ScreenID != null)
                {
                    identityAppRoleScreens.ScreenID = Operations.opIdentityAppRoleScreens.getIdentityAppRoleScreensObjbyID(int.Parse(identityAppRoleScreens.ScreenID.IdentityScreenID.ToString()), _context);
                }

                identityAppRoleScreens.CreationDate = DateTime.UtcNow;
                identityAppRoleScreens.UpdatedDate = DateTime.UtcNow;
                identityAppRoleScreens.IsActive = true;
                identityAppRoleScreens.IsDeleted = false;
                _context._IdentityAppRoleScreens.Add(identityAppRoleScreens);
            }

          
            await _context.SaveChangesAsync();
            //return CreatedAtAction("Record(s) saved successfull", "");
            return ("Record(s) saved successfully");

            // return CreatedAtAction("GetIdentityAppRoleScreens", new { id = identityAppRoleScreens.IdentityAppRoleScreenID }, identityAppRoleScreens);


        }
    }
}