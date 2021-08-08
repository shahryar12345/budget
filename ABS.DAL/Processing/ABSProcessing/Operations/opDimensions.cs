using ABS.DBModels;
using ABSProcessing.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opDimensions
    {
        
        public async static Task<List<Dimensions>> GetAllDimensionsData(BudgetingContext context)
        {
            var Dimensions = await context.Dimensions
               .Where(e => e.IsActive == true && e.IsDeleted == false)
               .ToListAsync();
            return Dimensions;
        }

    }
}
