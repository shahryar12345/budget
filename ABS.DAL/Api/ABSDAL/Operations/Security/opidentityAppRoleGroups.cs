using ABS.DBModels;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace ABSDAL.Operations
{
    public class opidentityAppRoleGroups
    {
        internal static IdentityGroups getidentityAppRoleGroupObjbyID(int AppRoleGroupID, BudgetingContext _context)
        {
            ABS.DBModels.IdentityGroups ITUpdate = _context._IdentityGroups
                         .Where(a => a.IdentityGroupID == AppRoleGroupID
                                     && a.IsDeleted == false && a.IsActive == true)
                                     .FirstOrDefault();

            return ITUpdate;
        }
        public async static Task<string> InsertRecords(List<IdentityAppRoleGroup> lstidentityAppRoleGroup, BudgetingContext _context)
        {
            _context.identityAppRoleGroups.Include(f => f.GroupsID).ToList();
            _context.identityAppRoleGroups.Include(f => f.UserID).ToList();
            _context.identityAppRoleGroups.Include(f => f.AppRoleID).ToList();
            var existingdata = _context.identityAppRoleGroups.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            foreach (var identityAppRoleGroup in lstidentityAppRoleGroup)
            {


                if (identityAppRoleGroup.AppRoleID != null)
                {
                    identityAppRoleGroup.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleGroup.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleGroup.UserID != null)
                {
                    identityAppRoleGroup.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleGroup.UserID.UserProfileID.ToString()), _context);
                }
                if (identityAppRoleGroup.GroupsID != null)
                {
                    identityAppRoleGroup.GroupsID = Operations.opidentityAppRoleGroups.getidentityAppRoleGroupObjbyID(int.Parse(identityAppRoleGroup.GroupsID.IdentityGroupID.ToString()), _context);
                }
                _context.identityAppRoleGroups.Add(identityAppRoleGroup);
            }
            await _context.SaveChangesAsync();

            // return CreatedAtAction("Record(s) saved successfull", "");
            return ("Record(s) saved successfully");


            //return CreatedAtAction("GetIdentityAppRoleGroup", new { id = identityAppRoleGroup.IdentityRoleGroupID }, identityAppRoleGroup);

        }

    }
}