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
    public class IdentityAppRoleGroupsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleGroupsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleGroups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleGroup>>> GetidentityAppRoleGroups()
        {
            return await _context.identityAppRoleGroups.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleGroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleGroup>> GetIdentityAppRoleGroup(int id)
        {
            var identityAppRoleGroup = await _context.identityAppRoleGroups.FindAsync(id);

            if (identityAppRoleGroup == null)
            {
                return NotFound();
            }

            return identityAppRoleGroup;
        }

        // PUT: api/IdentityAppRoleGroups/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleGroup(int id, IdentityAppRoleGroup identityAppRoleGroup)
        {
            if (id != identityAppRoleGroup.IdentityRoleGroupID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleGroup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleGroupExists(id))
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

        // POST: api/IdentityAppRoleGroups
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleGroup>> PostIdentityAppRoleGroup(List<IdentityAppRoleGroup> lstidentityAppRoleGroup)
        {
            string result = await Operations.opidentityAppRoleGroups.InsertRecords(lstidentityAppRoleGroup, _context);

            return Ok(result);
           }

        // DELETE: api/IdentityAppRoleGroups/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleGroup>> DeleteIdentityAppRoleGroup(int id)
        {
            var identityAppRoleGroup = await _context.identityAppRoleGroups.FindAsync(id);
            if (identityAppRoleGroup == null)
            {
                return NotFound();
            }

            _context.identityAppRoleGroups.Remove(identityAppRoleGroup);
            await _context.SaveChangesAsync();

            return identityAppRoleGroup;
        }

        private bool IdentityAppRoleGroupExists(int id)
        {
            return _context.identityAppRoleGroups.Any(e => e.IdentityRoleGroupID == id);
        }
    }
}
