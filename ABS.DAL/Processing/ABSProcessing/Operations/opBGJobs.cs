using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Operations
{
    public class opBGJobs
    {
        
        public async static  Task<string> InsertBGJob(string jobname, string jobId, Guid identifier,   string userIdentifier,     BudgetingContext _context)
        {
            var bgjob = new ABS.DBModels.Models.BackgroundJobs();

            bgjob.Identifier = identifier;
            bgjob.CreatedAt = DateTime.UtcNow;
            bgjob.UpdatedAt = DateTime.UtcNow;
            bgjob.HangfireIdentifier = Guid.Parse(jobId);
            bgjob.userIdentifier = userIdentifier;
            bgjob.Arguments = jobname;
            bgjob.StateName= "PROCESSING";

            _context.Add(bgjob);
            await _context.SaveChangesAsync();

            await Task.Delay(1);
            return "";

        }
        public async static  Task<string> UpdateBGJobs(string Statusname, Guid identifier,    BudgetingContext _context)
        {
            var bgjob =   _context.BackgroundJobs.Where(f=> f.Identifier == identifier).FirstOrDefault();

            bgjob.Identifier = identifier;
            bgjob.UpdatedAt = DateTime.UtcNow;
            
            bgjob.StateName= Statusname;

            _context.Entry(bgjob).State = EntityState.Modified;
            await _context.SaveChangesAsync();


            await Task.Delay(1);
            return "";

        }
   
    
    }
}
