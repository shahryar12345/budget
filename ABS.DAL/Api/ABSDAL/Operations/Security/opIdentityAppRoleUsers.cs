using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoleUsers
    {
        public async static Task<string> InsertRecords(List<IdentityAppRoleUsers> lstidentityAppRoleUsers, BudgetingContext _context)
        {
            _context._IdentityAppRoleUsers.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleUsers.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleUsers.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            foreach (var identityAppRoleUsers in lstidentityAppRoleUsers)
            {


                if (identityAppRoleUsers.AppRoleID != null)
                {
                    identityAppRoleUsers.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleUsers.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleUsers.UserID != null)
                {
                    identityAppRoleUsers.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleUsers.UserID.UserProfileID.ToString()), _context);
                }



                identityAppRoleUsers.CreationDate = DateTime.UtcNow;
                identityAppRoleUsers.UpdatedDate = DateTime.UtcNow;
                identityAppRoleUsers.IsActive = true;
                identityAppRoleUsers.IsDeleted = false;

                _context._IdentityAppRoleUsers.Add(identityAppRoleUsers);
            }
            await _context.SaveChangesAsync();
            return ("Record(s) saved successfully");

            //return CreatedAtAction("Record(s) saved successfull", "");

            // return CreatedAtAction("GetIdentityAppRoleUsers", new { id = identityAppRoleUsers.IdentityAppRoleUserID }, identityAppRoleUsers);
        }

        internal async static Task<bool> isAdminRole(int userid, BudgetingContext _context)
        {
            var x = await _context._IdentityAppRoleUsers
                              .Where(f => f.UserID.UserProfileID == userid
                              && f.AppRoleID.Code == "SUPERADMIN"

                              && f.IsActive == true
                              && f.IsDeleted == false)
                               .ToListAsync();

            if (x == null)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        internal async static Task<bool> DeleteRecordsbyUser(int userid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleUsers.Where(f => f.UserID.UserProfileID == userid);
            _context._IdentityAppRoleUsers.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }

        internal async static Task<bool> DeleteRecordsbyRole(int roleid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleUsers.Where(f => f.AppRoleID.IdentityAppRoleID== roleid);
            _context._IdentityAppRoleUsers.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }

        internal async static Task<string> InsertRecordsbyRole(List<IdentityAppRoleUsers> allUserRoles, BudgetingContext _context)
        {
            _context._IdentityAppRoleUsers.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleUsers.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleUsers.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            foreach (var identityAppRoleUsers in allUserRoles)
            {


                if (identityAppRoleUsers.AppRoleID != null)
                {
                    identityAppRoleUsers.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleUsers.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleUsers.UserID != null)
                {
                    identityAppRoleUsers.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleUsers.UserID.UserProfileID.ToString()), _context);
                }

                identityAppRoleUsers.CreationDate = DateTime.UtcNow;
                identityAppRoleUsers.UpdatedDate = DateTime.UtcNow;
                identityAppRoleUsers.IsActive = true;
                identityAppRoleUsers.IsDeleted = false;
                _context._IdentityAppRoleUsers.Add(identityAppRoleUsers);
            }
            await _context.SaveChangesAsync();
            return ("Record(s) saved successfully");
        }


    }
}