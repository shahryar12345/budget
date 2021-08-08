using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using ABSDAL.Context;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using ABSDAL.Operations;
using System.Text.Json;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayTypeDistributionsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public PayTypeDistributionsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/PayTypeDistributions
        [HttpGet]
        public async Task<ActionResult<dynamic>> GetPayTypeDistribution()
        {
            return await Operations.opPayTypeDistribution.GetPayTypeDistributionData(_context,0);
        }

        // GET: api/PayTypeDistributions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<dynamic>> GetPayTypeDistribution(int id)
        {
            var payTypeDistribution = await Operations.opPayTypeDistribution.GetPayTypeDistributionData(_context, id);

            if (payTypeDistribution == null)
            {
                return NotFound();
            }

            return payTypeDistribution;
        }

        // PUT: api/PayTypeDistributions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PutPayTypeDistribution([FromBody] System.Text.Json.JsonElement rawText)
        {
            var _contxt = Operations.opPayTypeDistribution.getContext(_context);
            var res = await Operations.opPayTypeDistribution.PTDsBulkInsert(rawText, _contxt, "update");

            return Ok(res);
        }

        // POST: api/PayTypeDistributions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostPayTypeDistribution([FromBody] System.Text.Json.JsonElement rawText)
        {
            var _contxt = Operations.opPayTypeDistribution.getContext(_context);
            var res = await Operations.opPayTypeDistribution.PTDsBulkInsert(rawText, _contxt, "insert");
            return Ok(res);
        }

        // DELETE: api/PayTypeDistributions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PayTypeDistribution>> DeletePayTypeDistribution(int id)
        {
            var payTypeDistribution = await _context.PayTypeDistribution.FindAsync(id);
            if (payTypeDistribution == null)
            {
                return NotFound();
            }

            payTypeDistribution.IsActive = false;
            payTypeDistribution.IsDeleted = true;
            _context.Entry(payTypeDistribution).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return payTypeDistribution;
        }

        [Route("DeleteMultiplePTD")]
        [HttpPost]
        public async Task<ActionResult<string>> DeletePayTypeDistributions(string [] codes)
        {           
            int record_count = 0;
            foreach (string ptdCode in codes)
            {
                var payTypeDistributions = _context.PayTypeDistribution.Where(ptd => ptd.Code == ptdCode);
                if (payTypeDistributions != null)
                {
                    foreach (PayTypeDistribution payTypeDistribution in payTypeDistributions)
                    {
                        payTypeDistribution.IsActive = false;
                        payTypeDistribution.IsDeleted = true;
                        _context.Entry(payTypeDistribution).State = EntityState.Modified;
                    }
                    await _context.SaveChangesAsync();
                    record_count++;
                }
            }
            return record_count + " : Record deleted.";
        }

        private bool PayTypeDistributionExists(int id)
        {
            return _context.PayTypeDistribution.Any(e => e.PayTypeDistributionID == id);
        }
    }
}
