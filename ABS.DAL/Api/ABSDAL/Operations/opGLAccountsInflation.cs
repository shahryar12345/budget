using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using Microsoft.Extensions.Caching.Distributed;

namespace ABSDAL.Operations
{
    public class opGLAccountsInflation
    {
        public opGLAccountsInflation()
        {
            //All OK 
        }
        private readonly IDistributedCache _distributedCache;
        public opGLAccountsInflation(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }
        public static BudgetingContext getopGLAccountsInflationContext(BudgetingContext _context)
        {
            _context.GLAccountsInflation.Include(a => a.Entity).ToList();
            _context.GLAccountsInflation.Include(a => a.Department).ToList();
            _context.GLAccountsInflation.Include(a => a.GLAccount).ToList();
            _context.GLAccountsInflation.Include(a => a.BudgetVersion).ToList();
            _context.GLAccountsInflation.Include(a => a.StartMonth).ToList();
            _context.GLAccountsInflation.Include(a => a.EndMonth).ToList();

            return _context;
        }
    }
}
