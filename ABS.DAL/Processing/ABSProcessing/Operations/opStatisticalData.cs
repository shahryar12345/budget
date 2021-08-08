using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opStatisticalData
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context.StatisticalData.Include(a => a.Entity).ToList();
            _context.StatisticalData.Include(a => a.Department).ToList();
            _context.StatisticalData.Include(a => a.StatisticCode).ToList();
            _context.StatisticalData.Include(a => a.StatisticTimePeriod).ToList();
            _context.StatisticalData.Include(a => a.FiscalYearID).ToList();
            _context.StatisticalData.Include(a => a.FiscalYearMonthID).ToList();
            _context.StatisticalData.Include(a => a.DataSourcceID).ToList();
            



            return _context;






        }
    }
}
