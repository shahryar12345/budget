using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using ABSDAL.Context;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityScreenOperationsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityScreenOperationsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityScreenOperations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityScreenOperations>>> Get_IdentityScreenOperations()
        {
            return await _context._IdentityScreenOperations.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityScreenOperations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityScreenOperations>> GetIdentityScreenOperations(int id)
        {
            var identityScreenOperations = await _context._IdentityScreenOperations.FindAsync(id);

            if (identityScreenOperations == null)
            {
                return NotFound();
            }

            return identityScreenOperations;
        }

        // PUT: api/IdentityScreenOperations/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityScreenOperations(int id, IdentityScreenOperations identityScreenOperations)
        {
            if (id != identityScreenOperations.IdentityScreenOperationID)
            {
                return BadRequest();
            }

            _context.Entry(identityScreenOperations).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityScreenOperationsExists(id))
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

        // POST: api/IdentityScreenOperations
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityScreenOperations>> PostIdentityScreenOperations(List<IdentityScreenOperations> identityScreenOperations)
        {
            string result = "";

            foreach (var item in identityScreenOperations)
            {
             result += Environment.NewLine +  await Operations.opIdentityScreenOperations.InsertRecords(item, _context);

            }
           
            return Ok(result);
             }

        // DELETE: api/IdentityScreenOperations/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityScreenOperations>> DeleteIdentityScreenOperations(int id)
        {
            var identityScreenOperations = await _context._IdentityScreenOperations.FindAsync(id);
            if (identityScreenOperations == null)
            {
                return NotFound();
            }

            _context._IdentityScreenOperations.Remove(identityScreenOperations);
            await _context.SaveChangesAsync();

            return identityScreenOperations;
        }

        private bool IdentityScreenOperationsExists(int id)
        {
            return _context._IdentityScreenOperations.Any(e => e.IdentityScreenOperationID == id);
        }
    }
}
