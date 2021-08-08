using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Globalization;
using Newtonsoft.Json.Linq;

namespace ABSDAL.Operations
{
    public class opStaffingGLMapping
    {
        public opStaffingGLMapping()
        {

        }
        private readonly IDistributedCache _distributedCache;
        public opStaffingGLMapping(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }
        public static BudgetingContext getStaffingGLMappingContext(BudgetingContext _context)
        {

            _context.StaffingGLMappings.Include(a => a.Entity).ToList();
            _context.StaffingGLMappings.Include(a => a.Department).ToList();
            _context.StaffingGLMappings.Include(a => a.JobCode).ToList();
            _context.StaffingGLMappings.Include(a => a.PayType).ToList();
            _context.StaffingGLMappings.Include(a => a.GLAccount).ToList();

            return _context;

        }

    }
}
