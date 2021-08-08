using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace ABSDAL.Test
{
    class ContextBuilder
    {
        public static Context.BudgetingContext GetDbContext ()
        {

            var TestDBContext = new DbContextOptionsBuilder<Context.BudgetingContext>()
                .EnableSensitiveDataLogging()
                .UseInMemoryDatabase(Guid.NewGuid().ToString());

            var cntxt = new Context.BudgetingContext(TestDBContext.Options);
            
            return cntxt;
            
        }
    }
}
