using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSDAL.Operations
{
    public class opForecastSteps
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context.forecastSteps.Include(a => a.ForecastModel).ToList();
            _context.forecastSteps.Include(a => a.SourceBudgetVersion).ToList();
            _context.forecastSteps.Include(a => a.SourceDepartment).ToList();
            _context.forecastSteps.Include(a => a.SourceEntity).ToList();
            _context.forecastSteps.Include(a => a.SourceScenarioType).ToList();
            _context.forecastSteps.Include(a => a.SourceStatisticCode).ToList();
            _context.forecastSteps.Include(a => a.ForecastStepType).ToList();
            _context.forecastSteps.Include(a => a.TargetBudgetVersion).ToList();
            _context.forecastSteps.Include(a => a.TargetDepartment).ToList();
            _context.forecastSteps.Include(a => a.TargetEntity).ToList();
            _context.forecastSteps.Include(a => a.TargetScenarioType).ToList();
            _context.forecastSteps.Include(a => a.TargetStatisticCode).ToList();
          
            



            return _context;






        }

    }
}
