using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoleDataEntities
    {
        public async static Task<string> InsertRecords(List<IdentityAppRoleDataEntities> lstidentityAppRoleDataEntities, BudgetingContext _context)
        {

            _context._IdentityAppRoleDataEntities.Include(f => f.EntityID).ToList();
            _context._IdentityAppRoleDataEntities.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleDataEntities.Include(f => f.AppRoleID).ToList();

            var existingdata = _context._IdentityAppRoleDataEntities.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
            var allExistingUsers = await opIdentityUserProfile.getAllIdentityUserProfile(_context);


            var allexistingEntities = await opEntities.getAllEntities(_context);

            var AllExistingRelations = await opRelationships.GetDimensionRelationData(_context, "ENTITY");
            var enablestore = opItemTypes.SecurityStoreChildData(_context);

            Console.WriteLine(" TOTAL RECORDS RECEIVED : " + lstidentityAppRoleDataEntities.Count);
            List<IdentityAppRoleDataEntities> locallist = new List<IdentityAppRoleDataEntities>();
            List<IdentityAppRoleDataEntities> childlist = new List<IdentityAppRoleDataEntities>();
            List<IdentityAppRoleDataEntities> finallist = new List<IdentityAppRoleDataEntities>();



            foreach (var identityAppRoleDataEntities in lstidentityAppRoleDataEntities)
            {

                var edata = existingdata;

                if (identityAppRoleDataEntities.EntityID != null)
                {
                    edata = edata.Where(f => f.EntityID == identityAppRoleDataEntities.EntityID).ToList();

                    identityAppRoleDataEntities.EntityID = allexistingEntities.FirstOrDefault(f => f.EntityID == identityAppRoleDataEntities.EntityID.EntityID);
                    //identityAppRoleDataEntities.EntityID = Operations.opEntities.getEntitiesObjbyID(int.Parse(identityAppRoleDataEntities.EntityID.EntityID.ToString()), _context);
                    if (identityAppRoleDataEntities.EntityID == null) { continue; }
                }
                else
                {
                    continue;
                }

                if (identityAppRoleDataEntities.AppRoleID != null)
                {
                    identityAppRoleDataEntities.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleDataEntities.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleDataEntities.UserID != null)
                {

                    identityAppRoleDataEntities.UserID = allExistingUsers.FirstOrDefault(f=>f.UserProfileID ==  identityAppRoleDataEntities.UserID.UserProfileID );
                    //identityAppRoleDataEntities.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleDataEntities.UserID.UserProfileID.ToString()), _context);
                }

                //if (edata.Any(f=>f.UserID == identityAppRoleDataEntities.UserID && identityAppRoleDataEntities.UserID != null))
                //{ continue; }
                //if (edata.Any(f=>f.AppRoleID == identityAppRoleDataEntities.AppRoleID && identityAppRoleDataEntities.AppRoleID != null))
                //{ continue; }


                identityAppRoleDataEntities.CreationDate = DateTime.UtcNow;
                identityAppRoleDataEntities.UpdatedDate = DateTime.UtcNow;
                identityAppRoleDataEntities.IsActive = true;
                identityAppRoleDataEntities.IsDeleted = false;
                identityAppRoleDataEntities.Value = "true";


                //_context._IdentityAppRoleDataEntities.Add(identityAppRoleDataEntities);
                locallist.Add(identityAppRoleDataEntities);

                if (enablestore.ToUpper() == "TRUE")
                {
                    childlist.AddRange(await getChildRecords(identityAppRoleDataEntities, identityAppRoleDataEntities.EntityID,allexistingEntities , AllExistingRelations, _context));
                    //List<IdentityAppRoleDataDepartments> childlist = await getChildRecords(identityAppRoleDataDepartments.DepartmentID, allexistingDepartments,_context);
                }
                
            }

            Console.WriteLine("Total Records to save : " + childlist.Count());
            if (locallist.Count > 0) { finallist = locallist; }

            if (childlist.Count > 0)
            {

                var x = childlist.GroupBy(f => new { f.AppRoleID, f.UserID, f.EntityID }).Select(grp => grp.FirstOrDefault()).ToList();
                finallist = locallist.Union(x).ToList();

                var y = finallist.GroupBy(f => new { f.AppRoleID, f.UserID, f.EntityID }).Select(grp => grp.FirstOrDefault()).ToList();

                finallist = y;
            }
            Console.WriteLine("Total DISTINCT Records to save : " + finallist.Count);

            if (finallist.Count > 0)
            {
                await DBOperations.SaveBulkDBObjectUpdates<IdentityAppRoleDataEntities>(finallist, true, _context);
            }

            //await _context.SaveChangesAsync();

            //  return CreatedAtAction("Record(s) saved successfull",lstidentityAppRoleDataEntities);
            //return CreatedAtAction("GetIdentityAppRoleDataDepartments", new { id = identityAppRoleDataDepartments.IdentityAppRoleDataDepartmentID }, identityAppRoleDataDepartments);
            return "Record(s) saved successfully";
            // return CreatedAtAction("Record saved successfull", new { Guid = Guid.NewGuid()  }, lstidentityAppRoleDataEntities);

        }

        private async static Task<List<IdentityAppRoleDataEntities>> getChildRecords(IdentityAppRoleDataEntities idrdd, Entities EntityID, List<Entities> allexistingEntities, List<Relationships> allExistingRelations, BudgetingContext _context)
        {

            await Task.Delay(1);

            List<IdentityAppRoleDataEntities> lstDeptUsers = new List<IdentityAppRoleDataEntities>();

           
                List<int> allEntitiesIDs = new List<int>();
                allEntitiesIDs = await opRelationships.getParentStructure(EntityID.EntityID, allEntitiesIDs, "ENTITY", _context,allExistingRelations);


                if (allEntitiesIDs.Count > 0)
                {
                    foreach (var item in allEntitiesIDs)
                    {
                        var iddnew = new IdentityAppRoleDataEntities();
                        iddnew.EntityID = allexistingEntities.FirstOrDefault(f => f.EntityID == item);
                        iddnew.Value = "false";
                        iddnew.CreationDate = DateTime.UtcNow;
                        iddnew.UpdatedDate = DateTime.UtcNow;
                        iddnew.IsActive = true;
                        iddnew.IsDeleted = false;
                        if (idrdd.UserID != null) iddnew.UserID = idrdd.UserID;
                        if (idrdd.AppRoleID != null) iddnew.AppRoleID = idrdd.AppRoleID;

                        lstDeptUsers.Add(iddnew);

                    }

                }

                
            return lstDeptUsers;


        }


        internal async static Task<bool> DeleteRecordsbyUser(int userid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleDataEntities.Where(f => f.UserID.UserProfileID == userid);
            _context._IdentityAppRoleDataEntities.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}