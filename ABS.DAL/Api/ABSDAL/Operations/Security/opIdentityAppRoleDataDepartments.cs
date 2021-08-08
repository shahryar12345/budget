using ABSDAL.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ABS.DBModels;
using EFCore.BulkExtensions;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoleDataDepartments
    {
        public async static Task<string> InsertRecords(List<ABS.DBModels.IdentityAppRoleDataDepartments> lstidentityAppRoleDataDepartments, BudgetingContext _context)
        {
            _context._IdentityAppRoleDataDepartments.Include(f => f.DepartmentID).ToList();
            _context._IdentityAppRoleDataDepartments.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleDataDepartments.Include(f => f.AppRoleID).ToList();
            
            var existingdata = _context._IdentityAppRoleDataDepartments.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            var allExistingUsers = await opIdentityUserProfile.getAllIdentityUserProfile(_context);


            var allexistingDepartments = await opDepartments.getAllDepartments(_context);

            var AllExistingRelations = await opRelationships.GetDimensionRelationData(_context, "DEPARTMENT");
            var enablestore = opItemTypes.SecurityStoreChildData(_context);

            Console.WriteLine(" TOTAL RECORDS RECEIVED : " + lstidentityAppRoleDataDepartments.Count);
            List<IdentityAppRoleDataDepartments> locallist = new List<IdentityAppRoleDataDepartments>();
            List<IdentityAppRoleDataDepartments> childlist = new List<IdentityAppRoleDataDepartments>();
            List<IdentityAppRoleDataDepartments> finallist = new List<IdentityAppRoleDataDepartments>();

            foreach (var identityAppRoleDataDepartments in lstidentityAppRoleDataDepartments)
            {


                if (identityAppRoleDataDepartments.AppRoleID != null)
                {
                    identityAppRoleDataDepartments.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleDataDepartments.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleDataDepartments.UserID != null)
                {
                   // identityAppRoleDataDepartments.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleDataDepartments.UserID.UserProfileID.ToString()), _context);
                    identityAppRoleDataDepartments.UserID = allExistingUsers.FirstOrDefault(f => f.UserProfileID == identityAppRoleDataDepartments.UserID.UserProfileID );
                }
                if (identityAppRoleDataDepartments.DepartmentID != null)
                {
                    identityAppRoleDataDepartments.DepartmentID = allexistingDepartments.FirstOrDefault(f=>f.DepartmentID ==  identityAppRoleDataDepartments.DepartmentID.DepartmentID) ;
                   //  identityAppRoleDataDepartments.DepartmentID = Operations.opDepartments.getDepartmentObjbyID(int.Parse(identityAppRoleDataDepartments.DepartmentID.DepartmentID.ToString()), _context);
                }



                identityAppRoleDataDepartments.CreationDate = DateTime.UtcNow;
                identityAppRoleDataDepartments.UpdatedDate = DateTime.UtcNow;
                identityAppRoleDataDepartments.IsActive = true;
                identityAppRoleDataDepartments.IsDeleted = false;
                identityAppRoleDataDepartments.Value = "true";


                locallist.Add(identityAppRoleDataDepartments);
                //_context._IdentityAppRoleDataDepartments.Add(identityAppRoleDataDepartments);

                if (enablestore.ToUpper() == "TRUE")
                {
 
                    childlist.AddRange(  await getChildRecords(identityAppRoleDataDepartments, identityAppRoleDataDepartments.DepartmentID, allexistingDepartments, AllExistingRelations, _context));
                    //List<IdentityAppRoleDataDepartments> childlist = await getChildRecords(identityAppRoleDataDepartments.DepartmentID, allexistingDepartments,_context);
                }
                
            }

            Console.WriteLine("Total Records to save : " + childlist.Count());
            if (locallist.Count > 0) { finallist = locallist; } 

            if (childlist.Count > 0)
            {
              
                var x = childlist.GroupBy(f=> new { f.AppRoleID, f.UserID,f.DepartmentID}).Select(grp => grp.FirstOrDefault()).ToList();
                  finallist = locallist.Union(x).ToList();

                var y =  finallist.GroupBy(f => new { f.AppRoleID, f.UserID, f.DepartmentID }).Select(grp => grp.FirstOrDefault()).ToList();

                finallist = y;
              }
            Console.WriteLine("Total DISTINCT Records to save : " + finallist.Count);

            if (finallist.Count > 0)
            {
                await DBOperations.SaveBulkDBObjectUpdates<IdentityAppRoleDataDepartments>(finallist, true, _context);
            }

            // await _context.SaveChangesAsync();
            return "Record(s) saved successfull";


        }

        private async static Task<List<IdentityAppRoleDataDepartments>> getChildRecords(IdentityAppRoleDataDepartments idrdd , Departments departmentID, List<Departments> allexistingDepartments, List<Relationships> allExistingRelations, BudgetingContext _context)
        {

            await Task.Delay(1);

             List<IdentityAppRoleDataDepartments> lstDeptUsers = new List<IdentityAppRoleDataDepartments>();


            

                List<int> allDeptIDs = new List<int>();
                allDeptIDs = await opRelationships.getParentStructure(departmentID.DepartmentID,allDeptIDs, "DEPARTMENT", _context, allExistingRelations); 


                if (allDeptIDs.Count > 0)
                {
                    foreach (var item in allDeptIDs)
                    {
                        var iddnew= new IdentityAppRoleDataDepartments();
                         iddnew.DepartmentID = allexistingDepartments.FirstOrDefault(f => f.DepartmentID == item);
                        iddnew.Value = "false";
                        iddnew.CreationDate = DateTime.UtcNow;
                        iddnew.UpdatedDate = DateTime.UtcNow;
                        iddnew.IsActive = true;
                        iddnew.IsDeleted = false;
                        if (idrdd.UserID != null) iddnew.UserID = idrdd.UserID;
                        if (idrdd.AppRoleID != null ) iddnew.AppRoleID = idrdd.AppRoleID;

                        lstDeptUsers.Add(iddnew);

                     

                }


            }
            else
            {

            }


            Console.WriteLine(" TOTAL OBJECTS GENERATED  : " + lstDeptUsers.Count);


            return lstDeptUsers;


        }

        internal static object DeleteRecords(int userid, BudgetingContext context)
        {
            throw new NotImplementedException();
        }

        internal async static Task<bool> DeleteRecordsbyUser(int userid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleDataDepartments.Where(f => f.UserID.UserProfileID == userid);
            _context._IdentityAppRoleDataDepartments.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}