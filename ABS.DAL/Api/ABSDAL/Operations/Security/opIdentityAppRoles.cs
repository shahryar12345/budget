using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoles
    {
        public async static Task<string> InsertRecords(IdentityAppRoles identityRoles, BudgetingContext _context)
        {
            _context._IdentityRoles.Add(identityRoles);
            await _context.SaveChangesAsync();

            return ("Record(s) saved successfully with ID:" + identityRoles.IdentityAppRoleID);
        }

        internal async static Task<IdentityAppRoles> UpdateRecordbyRole(IdentityAppRoles roleProfile, BudgetingContext _context)
        {
            try
            {
                if (roleProfile != null)
                {

                    if (roleProfile.IdentityAppRoleID != 0)
                    {
                        var idroleprofile = await _context._IdentityRoles.Where(f => f.IdentityAppRoleID == roleProfile.IdentityAppRoleID
                        && f.IsActive == true
                        && f.IsDeleted == false).FirstOrDefaultAsync();


                        if (idroleprofile == null)
                        {

                        }
                        else
                        {

                            idroleprofile.Value = roleProfile.Value;
                            idroleprofile.Name = roleProfile.Name;
                            idroleprofile.Code = roleProfile.Code;
                            idroleprofile.Description = roleProfile.Description;
                            idroleprofile.IsActive = roleProfile.IsActive;
                            idroleprofile.IsDeleted = roleProfile.IsDeleted;
                            idroleprofile.UpdateBy = roleProfile.UpdateBy;
                            idroleprofile.UpdatedDate = DateTime.Now;

                            _context.Entry(idroleprofile).State = EntityState.Modified;
                            var x = await _context.SaveChangesAsync();

                            roleProfile = null;
                            roleProfile = idroleprofile;
                        }


                    }
                    else
                    {

                    }
                }
                else
                { }

                return roleProfile;
            }
            catch (Exception ex)
            {

                Console.WriteLine(" Update ROLE Profile : " + ex);
                return roleProfile;
            }
        }
    }
}