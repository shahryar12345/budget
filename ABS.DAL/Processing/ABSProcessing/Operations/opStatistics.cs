using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opStatistics
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context.Statistics.Include(a => a.Entity).ToList();
            _context.Statistics.Include(a => a.Department).ToList();
            _context.Statistics.Include(a => a.StatisticsCodes).ToList();
            



            return _context;






        }
        public async Task<List<ABS.DBModels.Statistics>> getStatistics(int budgetVersionID, string entity, string department, string statisticsCode, BudgetingContext context)
        {
            var _statistics = await context.Statistics
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID && t.Entity.EntityCode.ToUpper() == entity.ToUpper() && t.Department.DepartmentCode.ToUpper() == department.ToUpper() && t.StatisticsCodes.StatisticsCode.ToUpper() == statisticsCode.ToUpper() && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _statistics;
        }
    }
}

        