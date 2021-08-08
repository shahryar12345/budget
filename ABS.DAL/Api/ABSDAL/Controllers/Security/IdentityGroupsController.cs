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
    public class IdentityGroupsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityGroupsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityGroups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityGroups>>> Get_IdentityGroups()
        {
            return await _context._IdentityGroups.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityGroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityGroups>> GetIdentityGroups(int id)
        {
            var identityGroups = await _context._IdentityGroups.FindAsync(id);

            if (identityGroups == null)
            {
                return NotFound();
            }

            return identityGroups;
        }

        // PUT: api/IdentityGroups/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityGroups(int id, IdentityGroups identityGroups)
        {
            if (id != identityGroups.IdentityGroupID)
            {
                return BadRequest();
            }

            _context.Entry(identityGroups).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityGroupsExists(id))
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

        // POST: api/IdentityGroups
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityGroups>> PostIdentityGroups(IdentityGroups identityGroups)
        {
            string result = await Operations.opIdentityGroups.InsertRecords(identityGroups, _context);

            return Ok(result);
           }

        // DELETE: api/IdentityGroups/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityGroups>> DeleteIdentityGroups(int id)
        {
            var identityGroups = await _context._IdentityGroups.FindAsync(id);
            if (identityGroups == null)
            {
                return NotFound();
            }

            _context._IdentityGroups.Remove(identityGroups);
            await _context.SaveChangesAsync();

            return identityGroups;
        }

        private bool IdentityGroupsExists(int id)
        {
            return _context._IdentityGroups.Any(e => e.IdentityGroupID == id);
        }
    }
}
