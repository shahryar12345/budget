using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    public class opIdentityAppRoleDataStatistics
    {
        public async static Task<string> InsertRecords(List<IdentityAppRoleDataStatistics> lstidentityAppRoleDataStatistics, BudgetingContext _context)
        {
            _context._IdentityAppRoleDataStatistics.Include(f => f.StatsCodeID).ToList();
            _context._IdentityAppRoleDataStatistics.Include(f => f.UserID).ToList();
            _context._IdentityAppRoleDataStatistics.Include(f => f.AppRoleID).ToList();
            var existingdata = _context._IdentityAppRoleDataStatistics.Where(f => f.IsActive == true && f.IsDeleted == false).ToList();
            var allExistingUsers = await opIdentityUserProfile.getAllIdentityUserProfile(_context);


            var allexistingStatisticscodes = await opStatisticsCodes.getAllStatisticsCodes(_context);

            var AllExistingRelations = await opRelationships.GetDimensionRelationData(_context, "STATISTICSCODE");
            var enablestore = opItemTypes.SecurityStoreChildData(_context);

            Console.WriteLine(" TOTAL RECORDS RECEIVED : " + lstidentityAppRoleDataStatistics.Count);
            List<IdentityAppRoleDataStatistics> locallist = new List<IdentityAppRoleDataStatistics>();
            List<IdentityAppRoleDataStatistics> childlist = new List<IdentityAppRoleDataStatistics>();
            List<IdentityAppRoleDataStatistics> finallist = new List<IdentityAppRoleDataStatistics>();


            foreach (var identityAppRoleDataStatistics in lstidentityAppRoleDataStatistics)
            {


                if (identityAppRoleDataStatistics.AppRoleID != null)
                {
                    identityAppRoleDataStatistics.AppRoleID = Operations.opAppRoleID.getAppRoleObjbyID(int.Parse(identityAppRoleDataStatistics.AppRoleID.IdentityAppRoleID.ToString()), _context);
                }

                if (identityAppRoleDataStatistics.UserID != null)
                {
                    identityAppRoleDataStatistics.UserID = allExistingUsers.FirstOrDefault(f=> f.UserProfileID == 
                    identityAppRoleDataStatistics.UserID.UserProfileID );
                    //identityAppRoleDataStatistics.UserID = Operations.opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(identityAppRoleDataStatistics.UserID.UserProfileID.ToString()), _context);
                }
                if (identityAppRoleDataStatistics.StatsCodeID != null)
                {
                    identityAppRoleDataStatistics.StatsCodeID = allexistingStatisticscodes.FirstOrDefault(f=>f.StatisticsCodeID == 
                     identityAppRoleDataStatistics.StatsCodeID.StatisticsCodeID );
                    //identityAppRoleDataStatistics.StatsCodeID = Operations.opStatisticsCodes.getstatisticsCodeObjbyID(int.Parse(identityAppRoleDataStatistics.StatsCodeID.StatisticsCodeID.ToString()), _context);
                }


                identityAppRoleDataStatistics.CreationDate = DateTime.UtcNow;
                identityAppRoleDataStatistics.UpdatedDate = DateTime.UtcNow;
                identityAppRoleDataStatistics.IsActive = true;
                identityAppRoleDataStatistics.IsDeleted = false;
                identityAppRoleDataStatistics.Value = "true";


                locallist.Add(identityAppRoleDataStatistics);
                //_context._IdentityAppRoleDataStatistics.Add(identityAppRoleDataStatistics);

                if (enablestore.ToUpper() == "TRUE")
                {
                    childlist.AddRange(await getChildRecords(identityAppRoleDataStatistics, identityAppRoleDataStatistics.StatsCodeID, allexistingStatisticscodes , AllExistingRelations,  _context));
                    //List<IdentityAppRoleDataDepartments> childlist = await getChildRecords(identityAppRoleDataDepartments.DepartmentID, allexistingDepartments,_context);
                }

            }


            Console.WriteLine("Total Records to save : " + childlist.Count());
            if (locallist.Count > 0) { finallist = locallist; }

            if (childlist.Count > 0)
            {

                var x = childlist.GroupBy(f => new { f.AppRoleID, f.UserID, f.StatsCodeID }).Select(grp => grp.FirstOrDefault()).ToList();
                finallist = locallist.Union(x).ToList();
                var y = finallist.GroupBy(f => new { f.AppRoleID, f.UserID, f.StatsCodeID }).Select(grp => grp.FirstOrDefault()).ToList();

                finallist = y;

            }
            Console.WriteLine("Total DISTINCT Records to save : " + finallist.Count);

            if (finallist.Count > 0)
            {
                await DBOperations.SaveBulkDBObjectUpdates<IdentityAppRoleDataStatistics>(finallist, true, _context);
            }

           // await _context.SaveChangesAsync();

            //return CreatedAtAction("Record(s) saved successfull", "");
            return  ("Record(s) saved successfully");

            //return CreatedAtAction("GetIdentityAppRoleDataStatistics", new { id = identityAppRoleDataStatistics.IdentityAppRoleDataStatisticsID }, identityAppRoleDataStatistics);

        }

        private async static Task<List<IdentityAppRoleDataStatistics>> getChildRecords(IdentityAppRoleDataStatistics idrdd, StatisticsCodes statisticscodeID, List<StatisticsCodes> allexistingStatisticscodes, List<Relationships> allExistingRelations, BudgetingContext _context)
        {

            await Task.Delay(1);

            List<IdentityAppRoleDataStatistics> lstDeptUsers = new List<IdentityAppRoleDataStatistics>();

           
                List<int> allStatscodesIDs = new List<int>();
                allStatscodesIDs = await opRelationships.getParentStructure(statisticscodeID.StatisticsCodeID, allStatscodesIDs, "STATISTICSCODE", _context, allExistingRelations);


                if (allStatscodesIDs.Count > 0)
                {
                    foreach (var item in allStatscodesIDs)
                    {
                        var iddnew = new IdentityAppRoleDataStatistics();
                        iddnew.StatsCodeID = allexistingStatisticscodes.FirstOrDefault(f => f.StatisticsCodeID == item);
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
            var dataRange = _context._IdentityAppRoleDataStatistics.Where(f => f.UserID.UserProfileID == userid);
            _context._IdentityAppRoleDataStatistics.RemoveRange(dataRange);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}