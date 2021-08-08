using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opEntities
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {


            _context.Entities.Include(a => a.ChargeCode)
             .Include(a => a.Department).
             Include(a => a.Account). 
            Include(a => a.JobCode). 
            Include(a => a.PayType). 
            Include(a => a.Address). 
            Include(a => a.DataSourceID).ToList();


            //_context.Entities.Include(a => a.  a.ChargeCode).ToList();
            //_context.Entities.Include(a => a.Department).ToList();
            //_context.Entities.Include(a => a.Account).ToList();
            //_context.Entities.Include(a => a.JobCode).ToList();
            //_context.Entities.Include(a => a.PayType).ToList();
            //_context.Entities.Include(a => a.Address).ToList();
            //_context.Entities.Include(a => a.DataSourceID).ToList();



            return _context;






        }

        public async Task<List<ABS.DBModels.Entities>> getGroupList(string childID, BudgetingContext context)
        {       
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _entities = await context.Entities
                .Where(e => groupMemberIdsList.Contains(e.EntityID) && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _entities;
        } 
        
        public async Task<List<ABS.DBModels.Entities>> getGroupList(string childID, List<Entities> ExistingRecords)
        {
            await Task.Delay(1);
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();;
            var _entities = ExistingRecords
                .Where(e => groupMemberIdsList.Contains(e.EntityID) && e.IsActive == true && e.IsDeleted == false)
                .ToList();
            return _entities;
        }

        public async Task<List<ABS.DBModels.Entities>> GetAllNonGroupEntities(BudgetingContext context)
        {       
            var _entities = await context.Entities
                .Where(e => e.isGroup == false && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _entities;
        } 
        public static async Task<List<ABS.DBModels.Entities>> GetAllEntities(BudgetingContext context)
        {
            var cntxt = getContext(context);
            var _entities = await cntxt.Entities
                .Where(e =>  e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _entities;
        }

        internal async static Task<Entities> getEntity(int entityID , BudgetingContext _context)
        {
            var cntxt = getContext(_context);
            var _entities = await cntxt.Entities
                .Where(e => 
                e.EntityID == entityID &&
                e.IsActive == true && e.IsDeleted == false)
                .FirstOrDefaultAsync();
            return _entities;
        }
    }
}
