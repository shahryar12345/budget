using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Operations
{
    public class opBudgetVersionGLAccounts
    {
        public static BudgetingContext getContext(BudgetingContext _context)
        {



            _context.BudgetVersionGLAccounts.Include(a => a.Entity)
                .Include(a => a.Department)
                .Include(a => a.GLAccount)
                .Include(a => a.TimePeriodID)
                .Include(a => a.BudgetVersion)
                .Include(a => a.DataScenarioTypeID)
                .Include(a => a.DimensionsRowID).ToList();
            
            //_context.BudgetVersionGLAccounts.Include(a => a.Entity).ToList();
            //_context.BudgetVersionGLAccounts.Include(a => a.Department).ToList();
            //_context.BudgetVersionGLAccounts.Include(a => a.GLAccount).ToList();
            //_context.BudgetVersionGLAccounts.Include(a => a.TimePeriodID).ToList();
            //_context.BudgetVersionGLAccounts.Include(a => a.BudgetVersion).ToList();


            //_context.BudgetVersionGLAccounts.Include(a => a.DataScenarioTypeID).ToList();
            //_context.BudgetVersionGLAccounts.Include(a => a.DimensionsRowID).ToList();


            return _context;


        }

        public async Task<List<ABS.DBModels.BudgetVersionGLAccounts>> getGLAccounts(int budgetVersionID, string entity, string department, string glAccount, BudgetingContext context)
        {
            var _glAccounts = await context.BudgetVersionGLAccounts
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID && t.Entity.EntityID == int.Parse(entity) && t.Department.DepartmentID == int.Parse(department) && t.GLAccount.GLAccountID == int.Parse(glAccount) && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _glAccounts;
        }
        public async Task<List<ABS.DBModels.BudgetVersionGLAccounts>> getGLAccounts(int budgetVersionID, string entity, string department, string glAccount, List<ABS.DBModels.BudgetVersionGLAccounts> ALlBVSource)
        {
            await Task.Delay(1);
            var _glAccounts = ALlBVSource
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID 
                && t.Entity.EntityID == int.Parse(entity) 
                && t.Department.DepartmentID == int.Parse(department) 
                && t.GLAccount.GLAccountID == int.Parse(glAccount) 
                && t.IsActive == true 
                && t.IsDeleted == false)
                .ToList();
            return _glAccounts;
        }

        internal async Task<List<BudgetVersionGLAccounts>> getALlBVGL(List<int> list, BudgetingContext context)
        {
            await Task.Delay(1);
            var _glAccounts = await context.BudgetVersionGLAccounts
                .Where(t => list.Contains(t.BudgetVersion.BudgetVersionID)
                && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _glAccounts;
        }
    }
}
