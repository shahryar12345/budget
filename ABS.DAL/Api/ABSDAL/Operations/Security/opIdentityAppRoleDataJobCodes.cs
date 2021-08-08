using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoleDataJobCodes
    {
        public async static Task<string> InsertRecords(List<IdentityAppRoleDataJobCodes> lstidentityAppRoleDataJobCodes, BudgetingContext _context)
        {
            _context._IdentityAppRoleDataJobCodes.Include(f => f.JobCodesID).ToList();
            _context._IdentityAppRoleDataJobCodes.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleDataJobCodes.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleDataJobCodes.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            var allExistingUsers = await opIdentityUserProfile.getAllIdentityUserProfile(_context);


            var allExistingJobCodes = await opJobCodes.getAllJobCodes(_context);

            var AllExistingRelations = await opRelationships.GetDimensionRelationData(_context, "JOBCODE");
            var enablestore = opItemTypes.SecurityStoreChildData(_context);

            Console.WriteLine(" TOTAL RECORDS RECEIVED : " + lstidentityAppRoleDataJobCodes.Count);
            List<IdentityAppRoleDataJobCodes> locallist = new List<IdentityAppRoleDataJobCodes>();
            List<IdentityAppRoleDataJobCodes> childlist = new List<IdentityAppRoleDataJobCodes>();
            List<IdentityAppRoleDataJobCodes> finallist = new List<IdentityAppRoleDataJobCodes>();


            foreach (var identityAppRoleDataJobCodes in lstidentityAppRoleDataJobCodes)
            {
                if (identityAppRoleDataJobCodes.AppRoleID != null)
                {
                    identityAppRoleDataJobCodes.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleDataJobCodes.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleDataJobCodes.UserID != null)
                {
                    identityAppRoleDataJobCodes.UserID = allExistingUsers.FirstOrDefault(f=>f.UserProfileID == 
                     identityAppRoleDataJobCodes.UserID.UserProfileID );
                    //identityAppRoleDataJobCodes.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleDataJobCodes.UserID.UserProfileID.ToString()), _context);
                }
                if (identityAppRoleDataJobCodes.JobCodesID != null)
                {
                    identityAppRoleDataJobCodes.JobCodesID = allExistingJobCodes.FirstOrDefault(f=> f.JobCodeID  == identityAppRoleDataJobCodes.JobCodesID.JobCodeID );
                    //identityAppRoleDataJobCodes.JobCodesID = Operations.opJobCodes.getJobCodessObjbyID(int.Parse(identityAppRoleDataJobCodes.JobCodesID.JobCodeID.ToString()), _context);
                }


                identityAppRoleDataJobCodes.CreationDate = DateTime.UtcNow;
                identityAppRoleDataJobCodes.UpdatedDate = DateTime.UtcNow;
                identityAppRoleDataJobCodes.IsActive = true;
                identityAppRoleDataJobCodes.IsDeleted = false;
                identityAppRoleDataJobCodes.Value = "true";


                locallist.Add(identityAppRoleDataJobCodes);
                //_context._IdentityAppRoleDataJobCodes.Add(identityAppRoleDataJobCodes);
                if (enablestore.ToUpper() == "TRUE")
                {
                    childlist.AddRange( await getChildRecords(identityAppRoleDataJobCodes, identityAppRoleDataJobCodes.JobCodesID,allExistingJobCodes,AllExistingRelations, _context));

                }//List<IdentityAppRoleDataDepartments> childlist = await getChildRecords(identityAppRoleDataDepartments.DepartmentID, allexistingDepartments,_context);
 

            }



            Console.WriteLine("Total Records to save : " + childlist.Count());
            if (locallist.Count > 0) { finallist = locallist; }

            if (childlist.Count > 0)
            {
                var x = childlist.GroupBy(f => new { f.AppRoleID, f.UserID, f.JobCodesID }).Select(grp => grp.FirstOrDefault()).ToList();
                finallist = locallist.Union(x).ToList();

                var y = finallist.GroupBy(f => new { f.AppRoleID, f.UserID, f.JobCodesID }).Select(grp => grp.FirstOrDefault()).ToList();

                finallist = y;
            }
            Console.WriteLine("Total DISTINCT Records to save : " + finallist.Count);

            if (finallist.Count > 0)
            {
                await DBOperations.SaveBulkDBObjectUpdates<IdentityAppRoleDataJobCodes>(finallist, true, _context);
            }


            //await _context.SaveChangesAsync();

            //return CreatedAtAction("Record(s) saved successfull", "");
            return  ("Record(s) saved successfully");


            //return CreatedAtAction("GetIdentityAppRoleDataJobCodes", new { id = identityAppRoleDataJobCodes.IdentityAppRoleDataJobCodesID }, identityAppRoleDataJobCodes);

        }

        private async static Task<List<IdentityAppRoleDataJobCodes>> getChildRecords(IdentityAppRoleDataJobCodes idrdd, JobCodes jobcodeID, List<JobCodes> allExistingJobCodes, List<Relationships> allExistingRelations, BudgetingContext _context)
        {

            await Task.Delay(1);

            List<IdentityAppRoleDataJobCodes> lstJobCodes = new List<IdentityAppRoleDataJobCodes>();

          
                List<int> alljobcodesIDs = new List<int>();
                alljobcodesIDs = await opRelationships.getParentStructure(jobcodeID.JobCodeID, alljobcodesIDs, "JOBCODE", _context,allExistingRelations);


                if (alljobcodesIDs.Count > 0)
                {
                    foreach (var item in alljobcodesIDs)
                    {
                        var iddnew = new IdentityAppRoleDataJobCodes();
                        iddnew.JobCodesID = allExistingJobCodes.FirstOrDefault(f => f.JobCodeID == item);
                        iddnew.Value = "false";
                        iddnew.CreationDate = DateTime.UtcNow;
                        iddnew.UpdatedDate = DateTime.UtcNow;
                        iddnew.IsActive = true;
                        iddnew.IsDeleted = false;
                        if (idrdd.UserID != null) iddnew.UserID = idrdd.UserID;
                        if (idrdd.AppRoleID != null) iddnew.AppRoleID = idrdd.AppRoleID;

                        lstJobCodes.Add(iddnew);

                    }

                }


            




            return lstJobCodes;


        }

        internal async static Task<bool> DeleteRecordsbyUser(int userid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleDataJobCodes.Where(f => f.UserID.UserProfileID == userid);
            _context._IdentityAppRoleDataJobCodes.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}