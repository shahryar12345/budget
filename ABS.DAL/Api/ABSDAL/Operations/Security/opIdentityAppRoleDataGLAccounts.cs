using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoleDataGLAccounts
    {
        public async static Task<string> InsertRecords(List<IdentityAppRoleDataGLAccounts> lstidentityAppRoleDataGLAccounts, BudgetingContext _context)
        {
            _context._IdentityAppRoleDataGLAccounts.Include(f => f.GLAccountsID).ToList();
            _context._IdentityAppRoleDataGLAccounts.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleDataGLAccounts.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleDataGLAccounts.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            var allExistingUsers = await opIdentityUserProfile.getAllIdentityUserProfile(_context);


            var allexistingGLAccounts = await opsGLAccounts.getAllGLAccounts(_context);

            var AllExistingRelations = await opRelationships.GetDimensionRelationData(_context, "GLACCOUNT");
            var enablestore = opItemTypes.SecurityStoreChildData(_context);

            Console.WriteLine(" TOTAL RECORDS RECEIVED : " + lstidentityAppRoleDataGLAccounts.Count);
            List<IdentityAppRoleDataGLAccounts> locallist = new List<IdentityAppRoleDataGLAccounts>();
            List<IdentityAppRoleDataGLAccounts> childlist = new List<IdentityAppRoleDataGLAccounts>();
            List<IdentityAppRoleDataGLAccounts> finallist = new List<IdentityAppRoleDataGLAccounts>();



            foreach (var identityAppRoleDataGlAccounts in lstidentityAppRoleDataGLAccounts)
            {


                if (identityAppRoleDataGlAccounts.AppRoleID != null)
                {
                    identityAppRoleDataGlAccounts.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleDataGlAccounts.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleDataGlAccounts.UserID != null)
                {
                    identityAppRoleDataGlAccounts.UserID = allExistingUsers.FirstOrDefault(f => f.UserProfileID == identityAppRoleDataGlAccounts.UserID.UserProfileID);
                    //identityAppRoleDataGlAccounts.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleDataGlAccounts.UserID.UserProfileID.ToString()), _context);
                }
                if (identityAppRoleDataGlAccounts.GLAccountsID != null)
                {
                    //identityAppRoleDataGlAccounts.GLAccountsID = Operations.opsGLAccounts.getGLAccountsObjbyID(int.Parse(identityAppRoleDataGlAccounts.GLAccountsID.GLAccountID.ToString()), _context);
                    identityAppRoleDataGlAccounts.GLAccountsID = allexistingGLAccounts.FirstOrDefault(f => f.GLAccountID ==
                    identityAppRoleDataGlAccounts.GLAccountsID.GLAccountID);
                }



                identityAppRoleDataGlAccounts.CreationDate = DateTime.UtcNow;
                identityAppRoleDataGlAccounts.UpdatedDate = DateTime.UtcNow;
                identityAppRoleDataGlAccounts.IsActive = true;
                identityAppRoleDataGlAccounts.IsDeleted = false;
                identityAppRoleDataGlAccounts.Value = "true";


                locallist.Add(identityAppRoleDataGlAccounts);
                //_context._IdentityAppRoleDataGLAccounts.Add(identityAppRoleDataGlAccounts);

                if (enablestore.ToUpper() == "TRUE")
                {
                    childlist.AddRange(await getChildRecords(identityAppRoleDataGlAccounts, identityAppRoleDataGlAccounts.GLAccountsID, allexistingGLAccounts, AllExistingRelations, _context));
                    //List<IdentityAppRoleDataDepartments> childlist = await getChildRecords(identityAppRoleDataDepartments.DepartmentID, allexistingDepartments,_context);

                }
            }

            Console.WriteLine("Total Records to save : " + childlist.Count());
            if (locallist.Count > 0) { finallist = locallist; }

            if (childlist.Count > 0)
            {
                var x = childlist.GroupBy(f => new { f.AppRoleID, f.UserID, f.GLAccountsID }).Select(grp => grp.FirstOrDefault()).ToList();
                finallist = locallist.Union(x).ToList();
                var y = finallist.GroupBy(f => new { f.AppRoleID, f.UserID, f.GLAccountsID }).Select(grp => grp.FirstOrDefault()).ToList();

                finallist = y;
            }
            Console.WriteLine("Total DISTINCT Records to save : " + finallist.Count);

            if (finallist.Count > 0)
            {
                await DBOperations.SaveBulkDBObjectUpdates<IdentityAppRoleDataGLAccounts>(finallist, true, _context);
            }

            // await _context.SaveChangesAsync();
            return ("Record(s) saved successfully");

            //return CreatedAtAction("Record(s) saved successfull", "");

            // return CreatedAtAction("GetIdentityAppRoleDataGLAccounts", new { id = identityAppRoleDataGLAccounts.IdentityAppRoleDataGLAccountsID }, identityAppRoleDataGLAccounts);

        }

        private async static Task<List<IdentityAppRoleDataGLAccounts>> getChildRecords(IdentityAppRoleDataGLAccounts idrdd, GLAccounts glAccountID, List<GLAccounts> allexistingGLAccounts, List<Relationships> allExistingRelations, BudgetingContext _context)
        {

            await Task.Delay(1);

            List<IdentityAppRoleDataGLAccounts> lstUsers = new List<IdentityAppRoleDataGLAccounts>();

            List<int> allglaccountIDs = new List<int>();
            allglaccountIDs = await opRelationships.getParentStructure(glAccountID.GLAccountID, allglaccountIDs, "GLACCOUNT", _context, allExistingRelations);


            if (allglaccountIDs.Count > 0)
            {
                foreach (var item in allglaccountIDs)
                {
                    var iddnew = new IdentityAppRoleDataGLAccounts();
                    iddnew.GLAccountsID = allexistingGLAccounts.FirstOrDefault(f => f.GLAccountID == item);
                    iddnew.Value = "false";
                    iddnew.CreationDate = DateTime.UtcNow;
                    iddnew.UpdatedDate = DateTime.UtcNow;
                    iddnew.IsActive = true;
                    iddnew.IsDeleted = false;
                    if (idrdd.UserID != null) iddnew.UserID = idrdd.UserID;
                    if (idrdd.AppRoleID != null) iddnew.AppRoleID = idrdd.AppRoleID;

                    lstUsers.Add(iddnew);

                }

            }

            return lstUsers;
        }


        internal async static Task<bool> DeleteRecordsbyUser(int userid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleDataGLAccounts.Where(f => f.UserID.UserProfileID == userid);
            _context._IdentityAppRoleDataGLAccounts.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}