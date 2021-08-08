using ABS.DBModels;
using ABS.DBModels.Models.SubAccounts;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ABSDAL.Operations
{
    internal class opSubaccounts
    {



        internal async static Task<List<SubAccountsDimensions>> ProcessSubAccountDimensions(int budgetVersionID, int entityID, int deptID, int statisticsCodeID, int gLAccountID, int jobCodeID, int payTypeID, BudgetingContext _context)
        {
            await Task.Delay(1);
            List<SubAccountsDimensions> lstSAD = new List<SubAccountsDimensions>();

            lstSAD = await _context._SubAccountsDimensions.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();

            if (budgetVersionID != 0)
            {

                lstSAD = lstSAD.Where(f => f.BudgetVersion.BudgetVersionID == budgetVersionID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (entityID != 0)
            {

                lstSAD = lstSAD.Where(f => f.Entity.EntityID == entityID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (deptID != 0)
            {

                lstSAD = lstSAD.Where(f => f.Department.DepartmentID == deptID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (statisticsCodeID != 0)
            {

                lstSAD = lstSAD.Where(f => f.StatisticsCodes.StatisticsCodeID == statisticsCodeID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (gLAccountID != 0)
            {

                lstSAD = lstSAD.Where(f => f.GLAccounts.GLAccountID == gLAccountID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (jobCodeID != 0)
            {

                lstSAD = lstSAD.Where(f => f.JobCode.JobCodeID == jobCodeID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (payTypeID != 0)
            {

                lstSAD = lstSAD.Where(f => f.PayType.PayTypeID == payTypeID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }


            return lstSAD;

        }
        internal async static Task<List<SubAccountsDimensions>> StoreSubAccountDimensions(SubAccountDetails accountDetails, int budgetVersionID, int entityID, int deptID, int statisticsCodeID, int gLAccountID, int jobCodeID, int payTypeID, BudgetingContext _context)
        {
            await Task.Delay(1);



            List<SubAccountsDimensions> SAD = MapSubAccountDetailtoData(accountDetails);













            List<SubAccountsDimensions> lstSAD = await _context._SubAccountsDimensions.Where(f => f.subAccountValue == accountDetails.bvRowId.ToString() && f.IsActive == true && f.IsDeleted == false).ToListAsync();

            if (budgetVersionID != 0)
            {

                lstSAD = lstSAD.Where(f => f.BudgetVersion.BudgetVersionID == budgetVersionID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (entityID != 0)
            {

                lstSAD = lstSAD.Where(f => f.Entity.EntityID == entityID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (deptID != 0)
            {

                lstSAD = lstSAD.Where(f => f.Department.DepartmentID == deptID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (statisticsCodeID != 0)
            {

                lstSAD = lstSAD.Where(f => f.StatisticsCodes.StatisticsCodeID == statisticsCodeID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (gLAccountID != 0)
            {

                lstSAD = lstSAD.Where(f => f.GLAccounts.GLAccountID == gLAccountID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (jobCodeID != 0)
            {

                lstSAD = lstSAD.Where(f => f.JobCode.JobCodeID == jobCodeID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }
            if (payTypeID != 0)
            {

                lstSAD = lstSAD.Where(f => f.PayType.PayTypeID == payTypeID
                && f.IsActive == true && f.IsDeleted == false).ToList();

            }


            return lstSAD;

        }

        private static List<SubAccountsDimensions> MapSubAccountDetailtoData(SubAccountDetails accountDetails)
        {
            List<SubAccountsDimensions> lstsad = new List<SubAccountsDimensions>();

            var bvrow = accountDetails.bvRowId;
            var bvtype = accountDetails.scenariotype;

            if (accountDetails.rows.Count > 0)
            {
                foreach (var rowdata in accountDetails.rows)
                {
                    SubAccountsDimensions sd = new SubAccountsDimensions();
                    sd.subAccountName = rowdata.subAccName;
                    sd.April = rowdata.April;
                    sd.August = rowdata.August;
                    sd.December = rowdata.December;
                    sd.February = rowdata.February;
                    sd.IsActive = true;
                    sd.IsDeleted = false;
                    sd.rowTotal = rowdata.total;
                    sd.March = rowdata.March;
                    sd.May = rowdata.May;
                    sd.July = rowdata.July;
                    sd.June = rowdata.June;
                    sd.October = rowdata.October;
                    sd.September = rowdata.September;
                    sd.November = rowdata.November;
                    sd.January = rowdata.January;
                    sd.CreationDate = DateTime.UtcNow;
                    sd.UpdatedDate = DateTime.UtcNow;


                    sd.subAccountValue = bvrow.ToString();
                    if (rowdata.isParentRow) { sd.subAccountCode = "ISPARENTROW"; } // else { sd.subAccountCode = ""; }
                    if (rowdata.isReconcilRow) { sd.subAccountCode = "ISRECONCILROW"; }  // else { sd.subAccountCode = ""; }
                    if (rowdata.isSubAccRow) { sd.subAccountCode = "ISSUBACCROW"; } // else { sd.subAccountCode = ""; }
                    if (rowdata.islock) { sd.subAccountTitle = "ISLOCK"; } else { sd.subAccountTitle = ""; }

                    lstsad.Add(sd);

                }



            }
            else
            {

            }

            return lstsad;
        }

        internal async static Task<List<SubAccountsDimensions>> ProcessSubAccountDimensionsList(List<int> budgetVersionID, List<int> entityID,
         List<int> deptID, List<int> statisticsCodeID, List<int> gLAccountID, List<int> jobCodeID, List<int> payTypeID, BudgetingContext _context)
        {
            await Task.Delay(1);
            List<SubAccountsDimensions> lstSAD = new List<SubAccountsDimensions>();

            lstSAD = await _context._SubAccountsDimensions.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();

            if (budgetVersionID != null)
            {
                if (budgetVersionID.Count > 0)
                {

                    lstSAD = lstSAD.Where(f => budgetVersionID.Contains(f.BudgetVersion.BudgetVersionID)
                        && f.IsActive == true && f.IsDeleted == false).ToList();

                }
            }

            if (entityID != null)
            {
                if (entityID.Count > 0)
                {

                    lstSAD = lstSAD.Where(f => entityID.Contains(f.Entity.EntityID)
                    && f.IsActive == true && f.IsDeleted == false).ToList();

                }
            }
            if (deptID != null)
            {
                if (deptID.Count > 0)
                {

                    lstSAD = lstSAD.Where(f => deptID.Contains(f.Department.DepartmentID)
                    && f.IsActive == true && f.IsDeleted == false).ToList();

                }
            }
            if (statisticsCodeID != null)
            {
                if (statisticsCodeID.Count > 0)
                {

                    lstSAD = lstSAD.Where(f => statisticsCodeID.Contains(f.StatisticsCodes.StatisticsCodeID)
                    && f.IsActive == true && f.IsDeleted == false).ToList();

                }
            }
            if (gLAccountID != null)
            {
                if (gLAccountID.Count > 0)
                {

                    lstSAD = lstSAD.Where(f => gLAccountID.Contains(f.GLAccounts.GLAccountID)
                    && f.IsActive == true && f.IsDeleted == false).ToList();

                }
            }
            if (jobCodeID != null)
            {
                if (jobCodeID.Count > 0)
                {

                    lstSAD = lstSAD.Where(f => jobCodeID.Contains(f.JobCode.JobCodeID)
                    && f.IsActive == true && f.IsDeleted == false).ToList();

                }
            }
            if (payTypeID != null)
            {
                if (payTypeID.Count > 0)
                {

                    lstSAD = lstSAD.Where(f => payTypeID.Contains(f.PayType.PayTypeID)
                    && f.IsActive == true && f.IsDeleted == false).ToList();

                }
            }


            return lstSAD;

        }

        internal async static Task<List<SubAccountsDimensions>> StoreSubAccountDetails(SubAccountDetails subAccountsList, BudgetingContext _context, int subaccountRowID = 0, int bvrowid = 0, bool isupdate = false)
        {
            List<SubAccountsDimensions> sr = new List<SubAccountsDimensions>();

            if (isupdate && subaccountRowID < 1 && bvrowid < 1) { return null; }
            else
            if (isupdate && subaccountRowID > 0 && bvrowid < 1)
            {

                var saddata = await _context._SubAccountsDimensions
                        .Where(f => f.SubAccountsDimensionID == subaccountRowID && f.IsActive == true && f.IsDeleted == false)
                        .Select(f => f)
                        .FirstOrDefaultAsync();

                if (subAccountsList.rows.Count == 1)
                {
                    var xrow = subAccountsList.rows;

                    foreach (var item in xrow)
                    {

                        SubAccountsDimensions sd = updateSubAccountDetails(item, saddata);

                        _context.Entry(sd).State = EntityState.Modified;

                        await _context.SaveChangesAsync();

                        sr.Add(sd);

                    }



                }
                else
                {
                    return null;

                }


            }
            else
            if (isupdate && subaccountRowID < 1 && bvrowid > 0)
            {




                var saddata = await _context._SubAccountsDimensions
                        .Where(f => f.subAccountValue == bvrowid.ToString() && f.IsActive == true && f.IsDeleted == false)
                        .Select(f => f)
                        .ToListAsync();

                _context.RemoveRange(saddata);
                await _context.SaveChangesAsync();

                await StoreSubAccountDetails(subAccountsList, _context, 0, 0, false);

                return sr;
            }
            else
             if (!isupdate && subaccountRowID < 1 && bvrowid < 1)
            {

                if (subAccountsList.scenariotype.ToUpper() == "ST")
                {
                    var bvdata = _context.BudgetVersionStatistics
                        .Include(f => f.BudgetVersion)
                        .Include(f => f.Entity)
                        .Include(f => f.Department)
                        .Include(f => f.StatisticsCodes)
                        .Include(f => f.TimePeriodID)
                        .Include(f => f.DataScenarioDataID)
                        .Include(f => f.DataScenarioTypeID)
                        .Include(f => f.DimensionsRowID)

                        .Where(f => f.StatisticID == subAccountsList.bvRowId && f.IsActive == true && f.IsDeleted == false)
                        .Select(f => f)
                        .FirstOrDefault();

                    sr = MapSubAccountDetailtoData(subAccountsList);
                    sr = MapSubAccountDetailtoDimensionsST(sr, bvdata);


                    //await StoreSubAccountDimensions(subAccountsList
                    //   , bvdata.BudgetVersion.BudgetVersionID
                    //    , bvdata.Entity.EntityID
                    //    , bvdata.Department.DepartmentID
                    //    , bvdata.StatisticsCodes.StatisticsCodeID
                    //    , 0, 0, 0, _context
                    //    );

                }
                else
                if (subAccountsList.scenariotype.ToUpper() == "GL")

                {
                    var bvdata = _context.BudgetVersionGLAccounts
                        .Include(f => f.BudgetVersion)
                        .Include(f => f.Entity)
                        .Include(f => f.Department)
                        .Include(f => f.GLAccount)
                        .Include(f => f.TimePeriodID)
                        .Include(f => f.DataScenarioDataID)
                        .Include(f => f.DataScenarioTypeID)
                        .Include(f => f.DimensionsRowID)

                        .Where(f => f.StatisticID == subAccountsList.bvRowId && f.IsActive == true && f.IsDeleted == false)
                        .Select(f => f)
                        .FirstOrDefault();
                    sr = MapSubAccountDetailtoData(subAccountsList);
                    sr = MapSubAccountDetailtoDimensionsGL(sr, bvdata);


                    //await StoreSubAccountDimensions(subAccountsList
                    //   ,
                    //    bvdata.BudgetVersion.BudgetVersionID
                    //  , bvdata.Entity.EntityID
                    //  , bvdata.Department.DepartmentID
                    //  , 0
                    //  , bvdata.GLAccount.GLAccountID
                    //  , 0, 0, _context
                    //  );

                }
                else
                if (subAccountsList.scenariotype.ToUpper() == "SF")

                {
                    var bvdata = _context.BudgetVersionStaffing
                        .Include(f => f.BudgetVersion)
                        .Include(f => f.Entity)
                        .Include(f => f.Department)
                        .Include(f => f.JobCode)
                        .Include(f => f.PayType)
                        .Include(f => f.TimePeriodID)
                        .Include(f => f.DataScenarioID)
                        .Include(f => f.DataScenarioTypeID)
                        .Include(f => f.DimensionsRowID)
                        .Where(f => f.BudgetVersionStaffingID == subAccountsList.bvRowId && f.IsActive == true && f.IsDeleted == false).FirstOrDefault();
                    sr = MapSubAccountDetailtoData(subAccountsList);
                    sr = MapSubAccountDetailtoDimensionsSF(sr, bvdata);

                }

                await DBOperations.SaveBulkDBObjectUpdates<SubAccountsDimensions>(sr, false, _context);
            }

            return sr;

        }

        private static SubAccountsDimensions updateSubAccountDetails(SubAccountData item, SubAccountsDimensions saddata)
        {

            saddata.UpdatedDate = DateTime.UtcNow;


            if (item.isParentRow) { saddata.subAccountCode = "ISPARENTROW"; } else { saddata.subAccountCode = ""; }
            if (item.isReconcilRow) { saddata.subAccountCode = "ISRECONCILROW"; } else { saddata.subAccountCode = ""; }
            if (item.isParentRow) { saddata.subAccountCode = "ISSUBACCROW"; } else { saddata.subAccountCode = ""; }
            if (item.islock) { saddata.subAccountTitle = "ISLOCK"; } else { saddata.subAccountTitle = ""; }

            saddata.subAccountName = item.subAccName;
            saddata.rowTotal = item.total;
            saddata.January = item.January;
            saddata.February = item.February;
            saddata.March = item.March;
            saddata.April = item.April;
            saddata.May = item.May;
            saddata.June = item.June;
            saddata.July = item.July;
            saddata.August = item.August;
            saddata.September = item.September;
            saddata.October = item.October;
            saddata.November = item.November;
            saddata.December = item.December;
            saddata.rowTotal = item.total;



            return saddata;
        }

        private static List<SubAccountsDimensions> MapSubAccountDetailtoDimensionsSF(List<SubAccountsDimensions> lstsad, BudgetVersionStaffing bvdata)
        {
            foreach (var item in lstsad)
            {
                item.BudgetVersion = bvdata.BudgetVersion;
                item.Entity = bvdata.Entity;
                item.Department = bvdata.Department;
                item.DimensionsRowID = bvdata.DimensionsRowID;
                item.JobCode = bvdata.JobCode;
                item.PayType = bvdata.PayType;
                item.TimePeriodID = bvdata.TimePeriodID;
                item.DataScenarioID = bvdata.DataScenarioID;
                item.DataScenarioTypeID = bvdata.DataScenarioTypeID;


            }
            return lstsad;
        }

        private static List<SubAccountsDimensions> MapSubAccountDetailtoDimensionsGL(List<SubAccountsDimensions> lstsad, BudgetVersionGLAccounts bvdata)
        {
            foreach (var item in lstsad)
            {
                item.BudgetVersion = bvdata.BudgetVersion;
                item.Entity = bvdata.Entity;
                item.Department = bvdata.Department;
                item.DimensionsRowID = bvdata.DimensionsRowID;
                item.GLAccounts = bvdata.GLAccount;
                item.TimePeriodID = bvdata.TimePeriodID;
                item.DataScenarioID = bvdata.DataScenarioDataID;
                item.DataScenarioTypeID = bvdata.DataScenarioTypeID;


            }
            return lstsad;
        }

        private static List<SubAccountsDimensions> MapSubAccountDetailtoDimensionsST(List<SubAccountsDimensions> lstsad, BudgetVersionStatistics bvdata)
        {


            foreach (var item in lstsad)
            {
                item.BudgetVersion = bvdata.BudgetVersion;
                item.Entity = bvdata.Entity;
                item.Department = bvdata.Department;
                item.DimensionsRowID = bvdata.DimensionsRowID;
                item.StatisticsCodes = bvdata.StatisticsCodes;
                item.TimePeriodID = bvdata.TimePeriodID;
                item.DataScenarioID = bvdata.DataScenarioDataID;
                item.DataScenarioTypeID = bvdata.DataScenarioTypeID;


            }
            return lstsad;
        }


        internal static bool getSubAccountExists(List<SubAccountsDimensions> subaccountList, int statisticID)
        {
            if (subaccountList == null) return false;

            if (subaccountList.Count < 1) return false;

            if (statisticID == 0) return false;

            var lstsubacc = subaccountList.Where(f => f.subAccountValue == statisticID.ToString()).ToList();

            if (lstsubacc == null) return false;
            if (lstsubacc.Count < 1)
            { 
                return false; 
            }
            else
            {
              return true;
            }


        }

    }
}