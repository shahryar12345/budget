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
    public class IdentityAppRoleDataJobCodesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleDataJobCodesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleDataJobCodes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleDataJobCodes>>> Get_IdentityAppRoleDataJobCodes()
        {
            return await _context._IdentityAppRoleDataJobCodes.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleDataJobCodes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataJobCodes>> GetIdentityAppRoleDataJobCodes(int id)
        {
            var identityAppRoleDataJobCodes = await _context._IdentityAppRoleDataJobCodes.FindAsync(id);

            if (identityAppRoleDataJobCodes == null)
            {
                return NotFound();
            }

            return identityAppRoleDataJobCodes;
        }

        // PUT: api/IdentityAppRoleDataJobCodes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleDataJobCodes(int id, IdentityAppRoleDataJobCodes identityAppRoleDataJobCodes)
        {
            if (id != identityAppRoleDataJobCodes.IdentityAppRoleDataJobCodesID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleDataJobCodes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleDataJobCodesExists(id))
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

        // POST: api/IdentityAppRoleDataJobCodes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleDataJobCodes>> PostIdentityAppRoleDataJobCodes(List<IdentityAppRoleDataJobCodes> lstidentityAppRoleDataJobCodes)
        {
            string result = await Operations.opIdentityAppRoleDataJobCodes.InsertRecords(lstidentityAppRoleDataJobCodes, _context);

            return Ok(result);
           }

        // DELETE: api/IdentityAppRoleDataJobCodes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataJobCodes>> DeleteIdentityAppRoleDataJobCodes(int id)
        {
            var identityAppRoleDataJobCodes = await _context._IdentityAppRoleDataJobCodes.FindAsync(id);
            if (identityAppRoleDataJobCodes == null)
            {
                return NotFound();
            }

            _context._IdentityAppRoleDataJobCodes.Remove(identityAppRoleDataJobCodes);
            await _context.SaveChangesAsync();

            return identityAppRoleDataJobCodes;
        }

        private bool IdentityAppRoleDataJobCodesExists(int id)
        {
            return _context._IdentityAppRoleDataJobCodes.Any(e => e.IdentityAppRoleDataJobCodesID == id);
        }
    }
}
