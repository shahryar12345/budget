using ABS.DBModels;
using ABSDAL.Context;
using System;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    internal class opAppRoleID
    {
        internal static IdentityAppRoles getAppRoleObjbyID(int AppRoleID , BudgetingContext _context)
        {
            ABS.DBModels.IdentityAppRoles ITUpdate = _context._IdentityRoles
                .Where(a => a.IdentityAppRoleID == AppRoleID
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }
    }
}