using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opJobCodes
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
            _context.JobCodes.Include(a => a.JobCodeMaster).ToList();
            
            return _context;
        }

        public async Task<List<ABS.DBModels.JobCodes>> getGroupList(string childID, BudgetingContext context)
        {       
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _jobCodes = await context.JobCodes
                .Where(e => groupMemberIdsList.Contains(e.JobCodeID) && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _jobCodes;
        } 
        
        public    List<ABS.DBModels.JobCodes> getGroupList(string childID, List<JobCodes> AllJobCodes)
        {       
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _jobCodes = AllJobCodes
                .Where(e => groupMemberIdsList.Contains(e.JobCodeID) && e.IsActive == true && e.IsDeleted == false)
                .ToList();
            return _jobCodes;
        }

        public async Task<List<ABS.DBModels.JobCodes>> GetAllNonGroupJobCodes(BudgetingContext context)
        {       
            var _jobCodes = await context.JobCodes
                .Where(e => e.IsGroup == false && e.IsMaster == false && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _jobCodes;
        }

        public async static Task<List<JobCodes>> GetAllJobCodes(BudgetingContext context)
        {
            var cntxt = getContext(context);
            var _jobCodes = await cntxt.JobCodes
               .Where(e => e.IsActive == true && e.IsDeleted == false)
               .ToListAsync();
            return _jobCodes;
        }
    }
}
