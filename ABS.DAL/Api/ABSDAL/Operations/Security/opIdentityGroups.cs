using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace ABSDAL.Operations
{
    public class opIdentityGroups
    {
        public async static Task<string> InsertRecords(IdentityGroups identityGroups, BudgetingContext _context)
        {
            _context._IdentityGroups.Add(identityGroups);
            await _context.SaveChangesAsync();

            return ("Record(s) saved successfully");
        }
    }
}