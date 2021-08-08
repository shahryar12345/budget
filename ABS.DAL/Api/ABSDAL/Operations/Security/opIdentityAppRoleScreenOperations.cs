using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using System.Text;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoleScreenOperations
    {
        internal static IdentityScreenOperations getIdentityAppRoleScreenOperationsObjbyID(int IdentityScreenOperationsID, BudgetingContext _context)
        {
            ABS.DBModels.IdentityScreenOperations ITUpdate = _context._IdentityScreenOperations
                .Where(a => a.IdentityScreenOperationID == IdentityScreenOperationsID
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }
        internal static IdentityScreenOperations getIdentityAppRoleScreenOperationsObjbyScreennOperation(int screenID, int operationID, BudgetingContext _context)
        {
            ABS.DBModels.IdentityScreenOperations ITUpdate = _context._IdentityScreenOperations
                .Where(a => a.IdentityScreens.IdentityScreenID == screenID
                            && a.IdentityOperation.IdentityOperationID == operationID
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }

        public async static Task<string> InsertRecords(List<IdentityAppRoleScreenOperations> lstidentityAppRoleScreenOperations, BudgetingContext _context)
        {

            _context._IdentityAppRoleScreenOperations
                            .Include(f => f.ScreenOperationID)
                            .ThenInclude(f => f.IdentityOperation)
                            .Include(f => f.ScreenOperationID)
                            .ThenInclude(f => f.IdentityScreens)
                             .ToList();
            _context._IdentityAppRoleScreenOperations.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleScreenOperations.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleScreenOperations.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            foreach (var identityAppRoleScreenOperations in lstidentityAppRoleScreenOperations)
            {


                if (identityAppRoleScreenOperations.AppRoleID != null)
                {
                    identityAppRoleScreenOperations.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleScreenOperations.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleScreenOperations.UserID != null)
                {
                    identityAppRoleScreenOperations.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleScreenOperations.UserID.UserProfileID.ToString()), _context);
                }
                if (identityAppRoleScreenOperations.ScreenOperationID != null)
                {
                    if (identityAppRoleScreenOperations.ScreenOperationID.IdentityScreenOperationID != 0)
                    {
                        identityAppRoleScreenOperations.ScreenOperationID = opIdentityAppRoleScreenOperations.getIdentityAppRoleScreenOperationsObjbyID
                        (int.Parse(identityAppRoleScreenOperations.ScreenOperationID.IdentityScreenOperationID.ToString()), _context);

                    }
                    else
                         if (identityAppRoleScreenOperations.ScreenOperationID.IdentityOperation.IdentityOperationID != 0 && identityAppRoleScreenOperations.ScreenOperationID.IdentityScreens.IdentityScreenID != 0)
                    {
                        int operationid = (identityAppRoleScreenOperations.ScreenOperationID.IdentityOperation.IdentityOperationID);
                        int screenid = identityAppRoleScreenOperations.ScreenOperationID.IdentityScreens.IdentityScreenID;
                        identityAppRoleScreenOperations.ScreenOperationID = opIdentityAppRoleScreenOperations.getIdentityAppRoleScreenOperationsObjbyScreennOperation
                        (screenid, operationid, _context);

                    }
                }


                identityAppRoleScreenOperations.CreationDate = DateTime.UtcNow;
                identityAppRoleScreenOperations.UpdatedDate = DateTime.UtcNow;
                identityAppRoleScreenOperations.IsActive = true;
                identityAppRoleScreenOperations.IsDeleted = false;

                _context._IdentityAppRoleScreenOperations.Add(identityAppRoleScreenOperations);
            }
            await _context.SaveChangesAsync();
            //return CreatedAtAction("Record(s) saved successfull", "");
            return ("Record(s) saved successfully");

            //return CreatedAtAction("GetIdentityAppRoleScreenOperations", new { id = identityAppRoleScreenOperations.IdentityAppRoleScreenOperationID }, identityAppRoleScreenOperations);

        }



        internal async static Task<bool> DeleteRecordsbyUser(int userid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleScreenOperations.Where(f => f.UserID.UserProfileID == userid);
            _context._IdentityAppRoleScreenOperations.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }

        internal async static Task<bool> DeleteRecordsbyRole(int roleid, BudgetingContext _context)
        {
            var dataRange = _context._IdentityAppRoleScreenOperations.Where(f => f.AppRoleID.IdentityAppRoleID == roleid);
            _context._IdentityAppRoleScreenOperations.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }

        internal async static Task<string> InsertRecordsbyRole(List<IdentityAppRoleScreenOperations> allRoleScreenOperations, BudgetingContext _context)
        {

            _context._IdentityAppRoleScreenOperations
                .Include(f => f.ScreenOperationID)
                .ThenInclude(f => f.IdentityOperation)
                .Include(f => f.ScreenOperationID)
                .ThenInclude(f => f.IdentityScreens)
                 .ToList();

            _context._IdentityAppRoleScreenOperations.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleScreenOperations.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleScreenOperations.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();

            foreach (var identityAppRoleScreenOperations in allRoleScreenOperations)
            {


                if (identityAppRoleScreenOperations.AppRoleID != null)
                {
                    identityAppRoleScreenOperations.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleScreenOperations.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleScreenOperations.UserID != null)
                {
                    identityAppRoleScreenOperations.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleScreenOperations.UserID.UserProfileID.ToString()), _context);
                }
                if (identityAppRoleScreenOperations.ScreenOperationID != null)
                {
                    if (identityAppRoleScreenOperations.ScreenOperationID.IdentityScreenOperationID != 0)
                    {
                        identityAppRoleScreenOperations.ScreenOperationID = opIdentityAppRoleScreenOperations.getIdentityAppRoleScreenOperationsObjbyID
                        (int.Parse(identityAppRoleScreenOperations.ScreenOperationID.IdentityScreenOperationID.ToString()), _context);

                    }
                    else
                         if (identityAppRoleScreenOperations.ScreenOperationID.IdentityOperation.IdentityOperationID != 0 && identityAppRoleScreenOperations.ScreenOperationID.IdentityScreens.IdentityScreenID != 0)
                    {
                        int operationid = (identityAppRoleScreenOperations.ScreenOperationID.IdentityOperation.IdentityOperationID);
                        int screenid = identityAppRoleScreenOperations.ScreenOperationID.IdentityScreens.IdentityScreenID;
                        identityAppRoleScreenOperations.ScreenOperationID = opIdentityAppRoleScreenOperations.getIdentityAppRoleScreenOperationsObjbyScreennOperation
                        (screenid, operationid, _context);

                    }






                }

                identityAppRoleScreenOperations.CreationDate = DateTime.UtcNow;
                identityAppRoleScreenOperations.UpdatedDate = DateTime.UtcNow ;
                identityAppRoleScreenOperations.IsActive = true;
                identityAppRoleScreenOperations.IsDeleted = false;


                _context._IdentityAppRoleScreenOperations.Add(identityAppRoleScreenOperations);
            }
            await _context.SaveChangesAsync();
            //return CreatedAtAction("Record(s) saved successfull", "");
            return ("Record(s) saved successfully");

            //return CreatedAtAction("GetIdentityAppRoleScreenOperations", new { id = identityAppRoleScreenOperations.IdentityAppRoleScreenOperationID }, identityAppRoleScreenOperations);

        }

        internal async static Task<string> GetRoleBasedMenuitems(int RoleID, BudgetingContext _context)
        {
            try
            {
                await Task.Delay(1);
                StringBuilder finalOutput = new StringBuilder();
                List<ABS.DBModels.IdentityAppRoleScreenOperations> AllROles = new List<IdentityAppRoleScreenOperations>();
                if (RoleID == 0)
                {

                    AllROles = await _context._IdentityAppRoleScreenOperations
                       .Include(f => f.AppRoleID)
                       .Include(f => f.ScreenOperationID)
                       .ThenInclude(f => f.IdentityOperation)
                       .Include(f => f.ScreenOperationID)
                       .ThenInclude(f => f.IdentityScreens)
                   .Where(f => f.ScreenOperationID != null && f.AppRoleID != null && f.IsActive == true && f.IsDeleted == false)
                   .ToListAsync();


                }
                else
                {
                    AllROles = await _context._IdentityAppRoleScreenOperations
                        .Include(f => f.AppRoleID)
                        .Include(f => f.ScreenOperationID)
                        .ThenInclude(f => f.IdentityOperation)
                        .Include(f => f.ScreenOperationID)
                        .ThenInclude(f => f.IdentityScreens)
                    .Where(f => f.AppRoleID.IdentityAppRoleID == RoleID && f.ScreenOperationID != null && f.AppRoleID != null && f.IsActive == true && f.IsDeleted == false)
                    .ToListAsync();
                }

                var rolegroupby = AllROles.Where(d => d.IsActive == true
                && d.IsDeleted == false
                && d.AppRoleID.IsDeleted == false
                && d.AppRoleID.IsActive == true
                && d.ScreenOperationID.IsActive == true
                && d.ScreenOperationID.IsDeleted == false
                )
                    .GroupBy(f => f.AppRoleID, (itim, lsttop) => new
                    {
                        identityAppRoleID = itim.IdentityAppRoleID
                     ,
                        name = itim.Name
                     ,
                        value = itim.Value
                     ,
                        description = itim.Description
                     ,
                        creationDate = itim.CreationDate
                     ,
                        roleScreens = lsttop.Where(p => p.ScreenOperationID.IdentityScreens != null
                        && p.ScreenOperationID.IdentityOperation != null
                        && p.IsActive == true
                        && p.IsDeleted == false)
                     .Select(x => x.ScreenOperationID)
                     .ToList()
                     .GroupBy(z => z.IdentityScreens, (key, value) => new
                     {
                         id = key.IdentityScreenID
                        ,
                         name = key.Name
                        ,
                         value = key.Value
                        ,
                         description = key.Description
                        ,
                         parentId = key.ParentID
                        ,
                         actionsPermission = value.ToList().Select(s => new
                         {
                             id = s.IdentityOperation.IdentityOperationID
                        ,
                             name = s.IdentityOperation.Name
                        ,
                             value = s.IdentityOperation.Value
                        ,
                             description = s.IdentityOperation.Description
                         }
                        )
                     })
                    })
                      .ToList();

                var ser = Newtonsoft.Json.JsonConvert.SerializeObject(rolegroupby);
                finalOutput.Append(ser);

                return finalOutput.ToString();

            }
            catch (Exception ex)
            {

                Console.WriteLine("GetRoleMenuitems" + ex);
                return "";
            }
        }
        internal async static Task<string> GetMenuitemsWithoutRole(int RoleID, BudgetingContext _context)
        {
            try
            {
                await Task.Delay(1);
                StringBuilder finalOutput = new StringBuilder();
                List<ABS.DBModels.IdentityAppRoleScreenOperations> AllROles = new List<IdentityAppRoleScreenOperations>();
                if (RoleID == 0)
                {

                    AllROles = await _context._IdentityAppRoleScreenOperations
                       .Include(f => f.AppRoleID)
                       .Include(f => f.ScreenOperationID)
                       .ThenInclude(f => f.IdentityOperation)
                       .Include(f => f.ScreenOperationID)
                       .ThenInclude(f => f.IdentityScreens)
                   .Where(f => f.ScreenOperationID != null && f.AppRoleID != null && f.IsActive == true && f.IsDeleted == false)
                   .ToListAsync();


                }
                else
                {
                    AllROles = await _context._IdentityAppRoleScreenOperations
                        .Include(f => f.AppRoleID)
                        .Include(f => f.ScreenOperationID)
                        .ThenInclude(f => f.IdentityOperation)
                        .Include(f => f.ScreenOperationID)
                        .ThenInclude(f => f.IdentityScreens)
                    .Where(f => f.AppRoleID.IdentityAppRoleID == RoleID && f.ScreenOperationID != null && f.AppRoleID != null && f.IsActive == true && f.IsDeleted == false)
                    .ToListAsync();
                }

                var rolegroupby = AllROles.Where(d => d.IsActive == true
                && d.IsDeleted == false
                && d.AppRoleID.IsDeleted == false
                && d.AppRoleID.IsActive == true
                && d.ScreenOperationID.IsActive == true
                && d.ScreenOperationID.IsDeleted == false
                )
                    .GroupBy(f => f.AppRoleID, (itim, lsttop) => new
                    {

                        roleScreens = lsttop.Where(p => p.ScreenOperationID.IdentityScreens != null
                        && p.ScreenOperationID.IdentityOperation != null
                        && p.IsActive == true
                        && p.IsDeleted == false)
                     .Select(x => new { x.ScreenOperationID , x.Value})
                     .ToList()
                     .GroupBy(z => z.ScreenOperationID.IdentityScreens, (key, value) => new
                     {
                         id = key.IdentityScreenID
                        ,
                         name = key.Name
                        ,
                         value = key.Value
                        ,
                         description = key.Description
                        ,
                         parentId = key.ParentID
                        ,
                         actionsPermission = value.ToList().Select(s => new
                         {
                             id = s.ScreenOperationID.IdentityOperation.IdentityOperationID
                        ,
                             name = s.ScreenOperationID.IdentityOperation.Name
                        ,
                             valueScreenOperation = s.ScreenOperationID.IdentityOperation.Value
                             , value = s.Value
                        ,
                             description = s.ScreenOperationID.IdentityOperation.Description
                         }
                        )
                     })
                    })
                       .ToList();

                var ser = Newtonsoft.Json.JsonConvert.SerializeObject(rolegroupby);
                finalOutput.Append(ser);

                return finalOutput.ToString();

            }
            catch (Exception ex)
            {

                Console.WriteLine("GetRoleMenuitems" + ex);
                return "";
            }
        }
        internal async static Task<string> GetRoleBasedMenuitemswithoutActions(int RoleID, BudgetingContext _context)
        {
            try
            {
                await Task.Delay(1);
                StringBuilder finalOutput = new StringBuilder();
                List<ABS.DBModels.IdentityAppRoleScreenOperations> AllROles = new List<IdentityAppRoleScreenOperations>();
                if (RoleID == 0)
                {

                    AllROles = await _context._IdentityAppRoleScreenOperations
                       .Include(f => f.AppRoleID)
                       .Include(f => f.ScreenOperationID)
                       .ThenInclude(f => f.IdentityOperation)
                       .Include(f => f.ScreenOperationID)
                       .ThenInclude(f => f.IdentityScreens)
                   .Where(f => f.ScreenOperationID != null && f.AppRoleID != null && f.IsActive == true && f.IsDeleted == false)
                   .ToListAsync();
                }
                else
                {
                    AllROles = await _context._IdentityAppRoleScreenOperations
                        .Include(f => f.AppRoleID)
                        .Include(f => f.ScreenOperationID)
                        .ThenInclude(f => f.IdentityOperation)
                        .Include(f => f.ScreenOperationID)
                        .ThenInclude(f => f.IdentityScreens)
                    .Where(f => f.AppRoleID.IdentityAppRoleID == RoleID && f.IsActive == true && f.IsDeleted == false)
                    .ToListAsync();
                }

                var rolegroupby = AllROles.Where(d => d.IsActive == true
                                && d.IsDeleted == false
                                && d.AppRoleID.IsDeleted == false
                                && d.AppRoleID.IsActive == true
                                && d.ScreenOperationID.IsActive == true
                                && d.ScreenOperationID.IsDeleted == false
                                )
                    .GroupBy(f => f.AppRoleID, (itim, lsttop) => new
                    {
                        identityAppRoleID = itim.IdentityAppRoleID
                     ,
                        name = itim.Name
                     ,
                        value = itim.Value
                     ,
                        description = itim.Description
                     ,
                        creationDate = itim.CreationDate
                     ,
                        roleScreens = lsttop.Where(p => p.ScreenOperationID.IdentityScreens != null
                        && p.ScreenOperationID.IdentityOperation != null
                        && p.IsActive == true
                        && p.IsDeleted == false)
                     .Select(x => x.ScreenOperationID)
                     .ToList()
                     .GroupBy(z => z.IdentityScreens, (key, value) => new
                     {
                         id = key.IdentityScreenID
                        ,
                         name = key.Name
                        ,
                         value = key.Value
                        ,
                         description = key.Description
                        ,
                         parentId = key.ParentID

                     })
                    })
                      .ToList();

                var ser = Newtonsoft.Json.JsonConvert.SerializeObject(rolegroupby);
                finalOutput.Append(ser);

                return finalOutput.ToString();

            }
            catch (Exception ex)
            {

                Console.WriteLine("GetRoleMenuitems" + ex);
                return "";
            }
        }




    }
}