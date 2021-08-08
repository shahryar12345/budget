using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Operations
{
    public class opBudgetVersionStatistics
    {
        public static BudgetingContext getContext(BudgetingContext _context)
        {



            _context.BudgetVersionStatistics.Include(a => a.Entity).ToList();
            _context.BudgetVersionStatistics.Include(a => a.Department).ToList();
            _context.BudgetVersionStatistics.Include(a => a.StatisticsCodes).ToList();
            _context.BudgetVersionStatistics.Include(a => a.TimePeriodID).ToList();
            _context.BudgetVersionStatistics.Include(a => a.BudgetVersion).ToList();


            _context.BudgetVersionStatistics.Include(a => a.DataScenarioTypeID).ToList();
            _context.BudgetVersionStatistics.Include(a => a.DimensionsRowID).ToList();


            return _context;


        }

        public async Task<List<ABS.DBModels.BudgetVersionStatistics>> getStatistics(int budgetVersionID, string entity, string department, string statisticsCode, BudgetingContext context)
        {
            var _statistics = await context.BudgetVersionStatistics
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID && t.Entity.EntityID == int.Parse(entity) && t.Department.DepartmentID == int.Parse(department) && t.StatisticsCodes.StatisticsCodeID == int.Parse(statisticsCode) && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _statistics;
        }
        public async Task<List<ABS.DBModels.BudgetVersionStatistics>> getStatistics(int budgetVersionID, string entity, string department, string statisticsCode, List<ABS.DBModels.BudgetVersionStatistics> ExistingRecords)
        {
            await Task.Delay(1);
            var _statistics = ExistingRecords
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID && t.Entity.EntityID == int.Parse(entity) && t.Department.DepartmentID == int.Parse(department) && t.StatisticsCodes.StatisticsCodeID == int.Parse(statisticsCode) && t.IsActive == true && t.IsDeleted == false)
                .ToList();
            return _statistics;
        }
         public async Task<List<ABS.DBModels.BudgetVersionStatistics>> getAllBVStatistics(List<int> budgetVersionID, BudgetingContext context)
        {
            var _statistics = await context.BudgetVersionStatistics
                .Where(t => budgetVersionID.Contains(t.BudgetVersion.BudgetVersionID) 
                &&t.IsActive == true 
                && t.IsDeleted == false)
                .ToListAsync();
            return _statistics;
        }

    }
}
