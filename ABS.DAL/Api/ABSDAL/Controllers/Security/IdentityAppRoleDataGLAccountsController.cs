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
    public class IdentityAppRoleDataGLAccountsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleDataGLAccountsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleDataGLAccounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleDataGLAccounts>>> Get_IdentityAppRoleDataGLAccounts()
        {
            return await _context._IdentityAppRoleDataGLAccounts.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleDataGLAccounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataGLAccounts>> GetIdentityAppRoleDataGLAccounts(int id)
        {
            var identityAppRoleDataGLAccounts = await _context._IdentityAppRoleDataGLAccounts.FindAsync(id);

            if (identityAppRoleDataGLAccounts == null)
            {
                return NotFound();
            }

            return identityAppRoleDataGLAccounts;
        }

        // PUT: api/IdentityAppRoleDataGLAccounts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleDataGLAccounts(int id, IdentityAppRoleDataGLAccounts identityAppRoleDataGLAccounts)
        {
            if (id != identityAppRoleDataGLAccounts.IdentityAppRoleDataGLAccountsID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleDataGLAccounts).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleDataGLAccountsExists(id))
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

        // POST: api/IdentityAppRoleDataGLAccounts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleDataGLAccounts>> PostIdentityAppRoleDataGLAccounts(List<IdentityAppRoleDataGLAccounts> lstidentityAppRoleDataGLAccounts)
        {
            string result = await Operations.opIdentityAppRoleDataGLAccounts.InsertRecords(lstidentityAppRoleDataGLAccounts, _context);

            return Ok(result);
          }

        // DELETE: api/IdentityAppRoleDataGLAccounts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataGLAccounts>> DeleteIdentityAppRoleDataGLAccounts(int id)
        {
            var identityAppRoleDataGLAccounts = await _context._IdentityAppRoleDataGLAccounts.FindAsync(id);
            if (identityAppRoleDataGLAccounts == null)
            {
                return NotFound();
            }

            _context._IdentityAppRoleDataGLAccounts.Remove(identityAppRoleDataGLAccounts);
            await _context.SaveChangesAsync();

            return identityAppRoleDataGLAccounts;
        }

        private bool IdentityAppRoleDataGLAccountsExists(int id)
        {
            return _context._IdentityAppRoleDataGLAccounts.Any(e => e.IdentityAppRoleDataGLAccountsID == id);
        }
    }
}
