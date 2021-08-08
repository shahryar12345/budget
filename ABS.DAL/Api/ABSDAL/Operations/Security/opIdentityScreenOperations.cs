using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    public class opIdentityScreenOperations
    {
        public async static Task<string> InsertRecords(IdentityScreenOperations identityScreenOperations, BudgetingContext _context)
        {
            var screenobj = _context._IdentityScreens.Where(f => f.IdentityScreenID == identityScreenOperations.IdentityScreens.IdentityScreenID).FirstOrDefault();
            if (screenobj == null)
            {
                return "Screen Object is not valid";
            }
            var operationobj = _context._IdentityOperations.Where(f => f.IdentityOperationID == identityScreenOperations.IdentityOperation.IdentityOperationID).FirstOrDefault();
            if (screenobj == null)
            {
                return "Operation Object is not valid";
            }

            identityScreenOperations.IdentityScreens = screenobj;
            identityScreenOperations.IdentityOperation = operationobj;

            _context._IdentityScreenOperations.Add(identityScreenOperations);
            await _context.SaveChangesAsync();

            return ("Record(s) saved successfully");

        }

        internal async  static Task<IdentityScreenOperations> GetScreenOperations(IdentityScreens screenObj, IdentityOperations operationObj, bool createNew, BudgetingContext _context)
        {
            var screenoperation = await _context._IdentityScreenOperations
                .Include(f => f.IdentityScreens)
                .Include(f => f.IdentityOperation)
                .Where(f => f.IsActive == true && f.IsDeleted == false
            && f.IdentityScreens.IdentityScreenID == screenObj.IdentityScreenID
            && f.IdentityOperation.IdentityOperationID == operationObj.IdentityOperationID)
                .FirstOrDefaultAsync();

            if (screenoperation == null && createNew) 
            {
               var  screenoperationObj = new IdentityScreenOperations();
                screenoperationObj.IdentityOperation = operationObj;
                screenoperationObj.IdentityScreens = screenObj;
                screenoperationObj.Name = screenObj.Name + "_" +operationObj.Name;
                screenoperationObj.Code = screenObj.Code + "_" +operationObj.Code;
                screenoperationObj.Description = screenObj.Description + "_" +operationObj.Description;
                screenoperationObj.CreationDate = DateTime.UtcNow;
                screenoperationObj.UpdatedDate = DateTime.UtcNow;
                screenoperationObj.IsActive = true;
                screenoperationObj.IsDeleted = false;

                _context._IdentityScreenOperations.Add(screenoperationObj);
                await _context.SaveChangesAsync();

            }
            else
            {
            }
            return screenoperation;

        }
    }
}