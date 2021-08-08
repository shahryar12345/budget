using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Globalization;
using Newtonsoft.Json.Linq;

namespace ABSProcessing.Operations
{
    public class opStatisticsMapping
    {
        public opStatisticsMapping()
        {

        }
        private readonly IDistributedCache _distributedCache;
        public opStatisticsMapping(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }
        public static BudgetingContext getStatisticsMappingContext(BudgetingContext _context)
        {
            _context.StatisticMappings.Include(a => a.Entity).ToList();
            _context.StatisticMappings.Include(a => a.Department).ToList();
            _context.StatisticMappings.Include(b => b.PrimaryStatisticMaster).ToList();
            _context.StatisticMappings.Include(b => b.PrimaryStatisticCode).ToList();
            _context.StatisticMappings.Include(b => b.SecondaryStatisticMaster).ToList();
            _context.StatisticMappings.Include(b => b.SecondaryStatisticCode).ToList();
            _context.StatisticMappings.Include(b => b.TertiaryStatisticMaster).ToList();
            _context.StatisticMappings.Include(b => b.TertiaryStatisticCode).ToList();

            return _context;
        }
        public StatisticsCodes GetStatisticsMapping(string entityID, string departmentID, string statistic, BudgetingContext context)
        {
            StatisticsCodes statisticCode = null;
            context = getStatisticsMappingContext(context);
            var _statisticMapping = context.StatisticMappings
                .Where(t => t.Entity.EntityID == int.Parse(entityID) && t.Department.DepartmentID == int.Parse(departmentID) && t.IsActive == true && t.IsDeleted == false)
                .FirstOrDefault();
            
            if (_statisticMapping != null)
            {
                switch (statistic)
                {
                    case "primary":
                        statisticCode = _statisticMapping.PrimaryStatisticCode;
                        break;
                    case "secondary":
                        statisticCode = _statisticMapping.SecondaryStatisticCode;
                        break;
                    case "tertiary":
                        statisticCode = _statisticMapping.TertiaryStatisticCode;
                        break;
                }
            }

            return statisticCode;
        }
    }
}
