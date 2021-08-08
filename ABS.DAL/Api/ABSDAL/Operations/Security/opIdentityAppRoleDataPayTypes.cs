using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoleDataPayTypes
    {
        public async static Task<string> InsertRecords(List<IdentityAppRoleDataPayTypes> lstidentityAppRoleDataPayTypes, BudgetingContext _context)
        {
            _context._IdentityAppRoleDataPayTypes.Include(f => f.PayTypesID).ToList();
            _context._IdentityAppRoleDataPayTypes.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleDataPayTypes.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleDataPayTypes.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            var allExistingUsers = await opIdentityUserProfile.getAllIdentityUserProfile(_context);


            var allexistingpaytypes = await opPayTypes.getAllPayTypes(_context);

            var AllExistingRelations = await opRelationships.GetDimensionRelationData(_context, "PAYTYPE");
            var enablestore = opItemTypes.SecurityStoreChildData(_context);

            Console.WriteLine(" TOTAL RECORDS RECEIVED : " + lstidentityAppRoleDataPayTypes.Count);
            List<IdentityAppRoleDataPayTypes> locallist = new List<IdentityAppRoleDataPayTypes>();
            List<IdentityAppRoleDataPayTypes> childlist = new List<IdentityAppRoleDataPayTypes>();
            List<IdentityAppRoleDataPayTypes> finallist = new List<IdentityAppRoleDataPayTypes>();


            foreach (var identityAppRoleDataPayTypes in lstidentityAppRoleDataPayTypes)
            {
                if (identityAppRoleDataPayTypes.AppRoleID != null)
                {
                    identityAppRoleDataPayTypes.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleDataPayTypes.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }
                if (identityAppRoleDataPayTypes.UserID != null)
                {
                    identityAppRoleDataPayTypes.UserID = allExistingUsers.FirstOrDefault(f=>f.UserProfileID == 
                    identityAppRoleDataPayTypes.UserID.UserProfileID );
                    //identityAppRoleDataPayTypes.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleDataPayTypes.UserID.UserProfileID.ToString()), _context);
                }
                if (identityAppRoleDataPayTypes.PayTypesID != null)
                {
                    identityAppRoleDataPayTypes.PayTypesID = allexistingpaytypes.FirstOrDefault(f=>f.PayTypeID ==identityAppRoleDataPayTypes.PayTypesID.PayTypeID );
                    //identityAppRoleDataPayTypes.PayTypesID = Operations.opPayTypes.getPayTypessObjbyID(int.Parse(identityAppRoleDataPayTypes.PayTypesID.PayTypeID.ToString()), _context);
                }


                identityAppRoleDataPayTypes.CreationDate = DateTime.UtcNow;
                identityAppRoleDataPayTypes.UpdatedDate = DateTime.UtcNow;
                identityAppRoleDataPayTypes.IsActive = true;
                identityAppRoleDataPayTypes.IsDeleted = false;
                identityAppRoleDataPayTypes.Value = "true";


                locallist.Add(identityAppRoleDataPayTypes);
                //_context._IdentityAppRoleDataPayTypes.Add(identityAppRoleDataPayTypes);
                if (enablestore.ToUpper() == "TRUE")
                {


                     childlist.AddRange( await getChildRecords(identityAppRoleDataPayTypes, identityAppRoleDataPayTypes.PayTypesID,allexistingpaytypes, AllExistingRelations,  _context));
                    //List<IdentityAppRoleDataDepartments> childlist = await getChildRecords(identityAppRoleDataDepartments.DepartmentID, allexistingDepartments,_context);
                }
 
            }

            Console.WriteLine("Total Records to save : " + childlist.Count());
            if (locallist.Count > 0) { finallist = locallist; }

            if (childlist.Count > 0)
            {
                var x = childlist.GroupBy(f => new { f.AppRoleID, f.UserID, f.PayTypesID }).Select(grp => grp.FirstOrDefault()).ToList();
                finallist = locallist.Union(x).ToList();
                var y = finallist.GroupBy(f => new { f.AppRoleID, f.UserID, f.PayTypesID }).Select(grp => grp.FirstOrDefault()).ToList();

                finallist = y;
            }
            Console.WriteLine("Total DISTINCT Records to save : " + finallist.Count);

            if (finallist.Count > 0)
            {
                await DBOperations.SaveBulkDBObjectUpdates<IdentityAppRoleDataPayTypes>(finallist, true, _context);
            }




            //await _context.SaveChangesAsync();

            //return CreatedAtAction("Record(s) saved successfull", "");
            return ("Record(s) saved successfully");

            //return CreatedAtAction("GetIdentityAppRoleDataPayTypes", new { id = identityAppRoleDataPayTypes.IdentityAppRoleDataPayTypeID }, identityAppRoleDataPayTypes);

        }

        private async static Task<List<IdentityAppRoleDataPayTypes>> getChildRecords(IdentityAppRoleDataPayTypes idrdd, PayTypes paytypeID, List<PayTypes> allexistingpaytypes, List<Relationships> allExistingRelations, BudgetingContext _context)
        {

            await Task.Delay(1);

            List<IdentityAppRoleDataPayTypes> lstUsers = new List<IdentityAppRoleDataPayTypes>();

         
           
                List<int> allpaytypeIDs = new List<int>();
                allpaytypeIDs = await opRelationships.getParentStructure(paytypeID.PayTypeID, allpaytypeIDs, "PAYTYPE", _context,allExistingRelations);


                if (allpaytypeIDs.Count > 0)
                {
                    foreach (var item in allpaytypeIDs)
                    {
                        var iddnew = new IdentityAppRoleDataPayTypes();
                        iddnew.PayTypesID = allexistingpaytypes.FirstOrDefault(f => f.PayTypeID == item);
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
            var dataRange = _context._IdentityAppRoleDataPayTypes.Where(f => f.UserID.UserProfileID == userid);
            _context._IdentityAppRoleDataPayTypes.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}