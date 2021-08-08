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
    public class opStaffingWageAdjustment
    {
        public opStaffingWageAdjustment()
        {
            //All OK 
        }
        private readonly IDistributedCache _distributedCache;
        public opStaffingWageAdjustment(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }
        public static BudgetingContext getopStaffingWageAdjustmentContext(BudgetingContext _context)
        {
            _context.StaffingWageAdjustment.Include(a => a.Entity).ToList();
            _context.StaffingWageAdjustment.Include(a => a.Department).ToList();
            _context.StaffingWageAdjustment.Include(a => a.JobCode).ToList();
            _context.StaffingWageAdjustment.Include(a => a.PayType).ToList();
            _context.StaffingWageAdjustment.Include(a => a.BudgetVersion).ToList();
            _context.StaffingWageAdjustment.Include(a => a.StartMonth).ToList();
            _context.StaffingWageAdjustment.Include(a => a.EndMonth).ToList();

            return _context;
        }
    }
}

