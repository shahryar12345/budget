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
    public class IdentityAppRoleUsersController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleUsersController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleUsers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleUsers>>> Get_IdentityAppRoleUsers()
        {
            return await _context._IdentityAppRoleUsers.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleUsers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleUsers>> GetIdentityAppRoleUsers(int id)
        {
            var identityAppRoleUsers = await _context._IdentityAppRoleUsers.FindAsync(id);

            if (identityAppRoleUsers == null)
            {
                return NotFound();
            }

            return identityAppRoleUsers;
        }

        // PUT: api/IdentityAppRoleUsers/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleUsers(int id, IdentityAppRoleUsers identityAppRoleUsers)
        {
            if (id != identityAppRoleUsers.IdentityAppRoleUserID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleUsers).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleUsersExists(id))
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

        // POST: api/IdentityAppRoleUsers
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleUsers>> PostIdentityAppRoleUsers(List<IdentityAppRoleUsers> lstidentityAppRoleUsers)
        {
            string result = await Operations.opIdentityAppRoleUsers.InsertRecords(lstidentityAppRoleUsers, _context);

            return Ok(result);
            }

        // DELETE: api/IdentityAppRoleUsers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleUsers>> DeleteIdentityAppRoleUsers(int id)
        {
            var identityAppRoleUsers = await _context._IdentityAppRoleUsers.FindAsync(id);
            if (identityAppRoleUsers == null)
            {
                return NotFound();
            }

            _context._IdentityAppRoleUsers.Remove(identityAppRoleUsers);
            await _context.SaveChangesAsync();

            return identityAppRoleUsers;
        }

        private bool IdentityAppRoleUsersExists(int id)
        {
            return _context._IdentityAppRoleUsers.Any(e => e.IdentityAppRoleUserID == id);
        }
    }
}
