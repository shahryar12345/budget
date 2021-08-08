using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opStatisticsCodes
    {

        public static BudgetingContext getopStatisticsCodesContext(BudgetingContext _context)
        {
      


            _context.StatisticsCodes.Include(a => a.DataSourcceID).ToList();
            _context.StatisticsCodes.Include(a => a.StatisticCodeType).ToList();
            


            return _context;






        }

        public async Task<List<ABS.DBModels.StatisticsCodes>> getGroupList(string childID, BudgetingContext context)
        {       
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _statisticsCodes = await context.StatisticsCodes
                .Where(e => groupMemberIdsList.Contains(e.StatisticsCodeID) && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _statisticsCodes;
        }
           public  List<ABS.DBModels.StatisticsCodes> getGroupList(string childID, List<ABS.DBModels.StatisticsCodes> AllStatisticsCodes)
        {       
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _statisticsCodes = AllStatisticsCodes
                .Where(e => groupMemberIdsList.Contains(e.StatisticsCodeID) && e.IsActive == true && e.IsDeleted == false)
                .ToList();
            return _statisticsCodes;
        }

        public async Task<List<ABS.DBModels.StatisticsCodes>> GetAllNonGroupStatistics(BudgetingContext context)
        {       
            var _statisticsCodes = await context.StatisticsCodes
                .Where(e => e.IsGroup == false && e.IsMaster == false && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _statisticsCodes;
        }

        public  async static Task<List<StatisticsCodes>> GetAllStatisticsCodes(BudgetingContext context)
        {
            var _statisticsCodes = await context.StatisticsCodes
               .Where(e => e.IsActive == true && e.IsDeleted == false)
               .ToListAsync();
            return _statisticsCodes;
        }
    }
}
