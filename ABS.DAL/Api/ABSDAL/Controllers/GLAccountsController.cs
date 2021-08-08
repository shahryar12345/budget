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
    public class GLAccountsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public GLAccountsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/GLAccounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GLAccounts>>> GetGLAccounts(int Userid = 0)
        {

            if (Userid == 0)
            {
                return await _context.GLAccounts.
                    Where(f => f.IsActive == true && f.IsDeleted == false)
                    .ToListAsync();
            }
            else
            {
                var getlst = await _context._IdentityAppRoleDataGLAccounts
                .Where(f => f.UserID.UserProfileID == Userid
                && f.IsActive == true
                && f.IsDeleted == false)
                .Select(f => f.GLAccountsID).ToListAsync();

                if (getlst == null && await Operations.opIdentityAppRoleUsers.isAdminRole(Userid, _context))
                {

                    return await _context.GLAccounts.
                     Where(f => f.IsActive == true && f.IsDeleted == false)
                     .ToListAsync();

                }

                return Ok(getlst);
            }
        }

        // GET: api/GLAccounts/5
        [HttpGet("{id}")]
        [Route("GLAccountCodebyID")]

        public async Task<ActionResult<GLAccounts>> GLAccountCodebyID(int id)
        {
            var gLAccounts = await _context.GLAccounts.FindAsync(id);

            if (gLAccounts == null)
            {
                return NotFound();
            }

            return gLAccounts;
        }

        // PUT: api/GLAccounts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGLAccounts(int id, GLAccounts gLAccounts)
        {
            if (id != gLAccounts.GLAccountID)
            {
                return BadRequest();
            }

            _context.Entry(gLAccounts).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GLAccountsExists(id))
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

        // POST: api/GLAccounts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<GLAccounts>> PostGLAccounts([FromBody] System.Text.Json.JsonElement rawText)
        {
            {
                var res = await Operations.opsGLAccounts.GLAcctsBulkInsert(rawText, _context);

                return Ok(res);
            }
        }

        // DELETE: api/GLAccounts/5           
        [HttpDelete("{id}")]
        public async Task<ActionResult<GLAccounts>> DeleteGLAccounts(int id)
        {
            var gLAccounts = await _context.GLAccounts.FindAsync(id);
            if (gLAccounts == null)
            {
                return NotFound();
            }

            _context.GLAccounts.Remove(gLAccounts);
            await _context.SaveChangesAsync();

            return gLAccounts;
        }

        private bool GLAccountsExists(int id)
        {
            return _context.GLAccounts.Any(e => e.GLAccountID == id);
        }
    }
}
