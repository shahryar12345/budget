using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opPayTypes
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
            _context.PayTypes.Include(a => a.PayTypeMaster)
            .Include(a => a.PayTypeType).ToList();
            // _context.PayTypes.Include(a => a.PayTypeMaster).ToList();
            //_context.PayTypes.Include(a => a.PayTypeType).ToList();

            return _context;
        }

        public async Task<List<ABS.DBModels.PayTypes>> getGroupList(string childID, BudgetingContext context)
        {       
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _payTypes = await context.PayTypes
                .Where(e => groupMemberIdsList.Contains(e.PayTypeID) && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _payTypes;
        } 
        public List<ABS.DBModels.PayTypes> getGroupList(string childID, List<PayTypes> AllPayTypes)
        {       
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _payTypes = AllPayTypes
                .Where(e => groupMemberIdsList.Contains(e.PayTypeID) && e.IsActive == true && e.IsDeleted == false)
                .ToList();
            return _payTypes;
        }

        public async Task<List<ABS.DBModels.PayTypes>> GetAllNonGroupPayTypes(BudgetingContext context)
        {       
            var _payTypes = await context.PayTypes
                .Where(e => e.IsGroup == false && e.IsMaster == false && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _payTypes;
        }

        public async static Task<List<PayTypes>> GetAllPayTypes(BudgetingContext context)
        {
            var cntxt = getContext(context);
            var _payTypes = await cntxt.PayTypes
               .Where(e => e.IsActive == true && e.IsDeleted == false)
               .ToListAsync();
            return _payTypes;
        }
    }
}
