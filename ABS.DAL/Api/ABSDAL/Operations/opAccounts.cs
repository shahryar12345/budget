using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSDAL.Operations
{
    public class opAccounts
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context.Accounts.Include(a => a.Department).ToList();
            



            return _context;






        }

    }
}
