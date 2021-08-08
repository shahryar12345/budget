using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using ABSDAL.Context;

namespace ABSDAL.Controllers.Security
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityOperationsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityOperationsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityOperations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityOperations>>> GetIdentityOperations()
        {
            return await _context._IdentityOperations.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityOperations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityOperations>> GetIdentityOperations(int id)
        {
            var identityOperations = await _context._IdentityOperations.FindAsync(id);

            if (identityOperations == null)
            {
                return NotFound();
            }

            return identityOperations;
        }

        // PUT: api/IdentityOperations/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityOperations(int id, IdentityOperations identityOperations)
        {
            if (id != identityOperations.IdentityOperationID)
            {
                return BadRequest();
            }

            _context.Entry(identityOperations).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityOperationsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/IdentityOperations
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityOperations>> PostIdentityOperations(List<IdentityOperations> lstidentityOperations)
        {
            string result = "";
            if (lstidentityOperations != null && lstidentityOperations.Count > 0)
            {
                foreach (var identityOperations in lstidentityOperations)
                {
                    result += Environment.NewLine +  await Operations.opIdentityOperations.InsertRecords(identityOperations, _context);
                }
            }
            return Ok(result);
            //_context._IdentityOperations.Add(identityOperations);
            //await _context.SaveChangesAsync();

            //return CreatedAtAction("GetIdentityOperations", new { id = identityOperations.IdentityOperationsID }, identityOperations);
        }

        // DELETE: api/IdentityOperations/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityOperations>> DeleteIdentityOperations(int id)
        {
            var identityOperations = await _context._IdentityOperations.FindAsync(id);
            if (identityOperations == null)
            {
                return NotFound();
            }

            _context._IdentityOperations.Remove(identityOperations);
            await _context.SaveChangesAsync();

            return identityOperations;
        }

        private bool IdentityOperationsExists(int id)
        {
            return _context._IdentityOperations.Any(e => e.IdentityOperationID == id);
        }
    }
}
