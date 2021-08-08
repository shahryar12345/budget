using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opGLAccounts
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
      


            _context.GLAccounts.Include(a => a.DataSourcceID)
            .Include(a => a.GLAccountType).ToList();
            //_context.GLAccounts.Include(a => a.DataSourcceID).ToList();
            //_context.GLAccounts.Include(a => a.GLAccountType).ToList();
            



            return _context;






        }

        public async Task<List<ABS.DBModels.GLAccounts>> getGroupList(string childID, BudgetingContext context)
        {       
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _glAccounts = await context.GLAccounts
                .Where(e => groupMemberIdsList.Contains(e.GLAccountID) && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _glAccounts;
        }
        public List<ABS.DBModels.GLAccounts> getGroupList(string childID, List<GLAccounts> AllGLAccounts)
        {       
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _glAccounts = AllGLAccounts
                .Where(e => groupMemberIdsList.Contains(e.GLAccountID) && e.IsActive == true && e.IsDeleted == false)
                .ToList();
            return _glAccounts;
        }

        public async Task<List<ABS.DBModels.GLAccounts>> GetAllNonGroupGLAccounts(BudgetingContext context)
        {       
            var _glAccounts = await context.GLAccounts
                .Where(e => e.IsGroup == false && e.IsMaster == false && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _glAccounts;
        }

        public async static Task<List<GLAccounts>> GetAllGLAccounts(BudgetingContext context)
        {
            var cntxt = getContext(context);
            var _departments = await cntxt.GLAccounts
               .Where(e =>  e.IsActive == true && e.IsDeleted == false)
               .ToListAsync();
            return _departments;
        }
    }
}
