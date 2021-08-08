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
    public class IdentityAppRoleScreensController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleScreensController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleScreens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleScreens>>> Get_IdentityAppRoleScreens()
        {
            return await _context._IdentityAppRoleScreens.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleScreens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleScreens>> GetIdentityAppRoleScreens(int id)
        {
            var identityAppRoleScreens = await _context._IdentityAppRoleScreens.FindAsync(id);

            if (identityAppRoleScreens == null)
            {
                return NotFound();
            }

            return identityAppRoleScreens;
        }

        // PUT: api/IdentityAppRoleScreens/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleScreens(int id, IdentityAppRoleScreens identityAppRoleScreens)
        {
            if (id != identityAppRoleScreens.IdentityAppRoleScreenID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleScreens).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleScreensExists(id))
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

        // POST: api/IdentityAppRoleScreens
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleScreens>> PostIdentityAppRoleScreens(List<IdentityAppRoleScreens> lstidentityAppRoleScreens)
        {
            string result = await Operations.opIdentityAppRoleScreens.InsertRecords(lstidentityAppRoleScreens, _context);

            return Ok(result);
            }

        // DELETE: api/IdentityAppRoleScreens/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleScreens>> DeleteIdentityAppRoleScreens(int id)
        {
            var identityAppRoleScreens = await _context._IdentityAppRoleScreens.FindAsync(id);
            if (identityAppRoleScreens == null)
            {
                return NotFound();
            }

            _context._IdentityAppRoleScreens.Remove(identityAppRoleScreens);
            await _context.SaveChangesAsync();

            return identityAppRoleScreens;
        }

        private bool IdentityAppRoleScreensExists(int id)
        {
            return _context._IdentityAppRoleScreens.Any(e => e.IdentityAppRoleScreenID == id);
        }
    }
}
