using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ABSProcessing.Operations
{
    public class opDataScenario
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context._DataScenario.Include(a => a.ScenarioType)
            .Include(a => a.TimePeriod).ToList();
            //_context._DataScenario.Include(a => a.ScenarioType).ToList();
            //_context._DataScenario.Include(a => a.TimePeriod).ToList();
            



            return _context;



        }

        public static ABS.DBModels.DataScenario getDataScenarioObjbyCode(string value, BudgetingContext _context)
        {


            ABS.DBModels.DataScenario ITUpdate = _context._DataScenario
                            .Where(a => a.DataScenarioCode.ToUpper() == value.ToString().ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
        public static ABS.DBModels.DataScenario getDataScenarioObjbyID(int value, BudgetingContext _context)
        {


            ABS.DBModels.DataScenario ITUpdate = _context._DataScenario
                            .Where(a => a.DataScenarioID == value 


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }

        public async static Task<List<DataScenario>> GetAllDataScenarios(BudgetingContext context)
        {

            var cntxt = getContext(context);
            var ITUpdate = await cntxt._DataScenario
                           .Where(a =>  a.IsDeleted == false && a.IsActive == true)
                           .ToListAsync();





            return ITUpdate;
        }
    }
}
