using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSDAL.Context
{
    public class GenerateNewContext
    {
        public IServiceScopeFactory ServiceScopeFactory { get; }

        public GenerateNewContext(IServiceScopeFactory serviceScopeFactory)
        {
            ServiceScopeFactory = serviceScopeFactory;
        }
        public   DbContext GetNewContext()
        {
            using (var scope = ServiceScopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetService<BudgetingContext>();
                return dbContext;
            }
        }
    }
}
