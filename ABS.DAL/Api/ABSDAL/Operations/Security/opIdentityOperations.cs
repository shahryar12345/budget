using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;


namespace ABSDAL.Operations
{
    public class opIdentityOperations
    {
        internal async static Task<string> InsertRecords(IdentityOperations identityOperations, BudgetingContext _context)
        {

            _context._IdentityOperations.Add(identityOperations);
            await _context.SaveChangesAsync();
            return ("Record(s) saved successfully");

            // return CreatedAtAction("GetIdentityOperations", new { id = identityOperations.IdentityOperationsID }, identityOperations);

        }

        public async static Task<IdentityOperations> GetOperationsObj(IdentityOperations  operationName, bool CreateNew, BudgetingContext _context)
        {
            var AllOperations = await _context._IdentityOperations.Where 
               (f =>
               f.Name.ToUpper() == operationName.Name.ToUpper()
               &&
               f.IsActive == true 
               && f.IsDeleted == false
               )
               .FirstOrDefaultAsync();

             
           

            if (AllOperations == null && CreateNew)
            {


                var operationrecord = new IdentityOperations();
                operationrecord.Name = operationName.Name;
                operationrecord.Code = operationName.Name;
                operationrecord.Description = operationName.Name;
                operationrecord.Value = operationName.Value;
                operationrecord.CreationDate = DateTime.UtcNow;
                operationrecord.UpdatedDate = DateTime.UtcNow;
                operationrecord.IsActive = operationName.IsActive ?? true;
                operationrecord.IsDeleted = operationName.IsDeleted ?? false;
 
                _context._IdentityOperations.Add(operationrecord);
                await _context.SaveChangesAsync();

                return operationrecord;
            }
            else
            {
                return AllOperations;
            }
        }
    }
    
}