using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSDAL.Operations
{
    public class opAddresses
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context.Addresses.Include(a => a.AddressType).ToList();
            



            return _context;






        }

    }
}
