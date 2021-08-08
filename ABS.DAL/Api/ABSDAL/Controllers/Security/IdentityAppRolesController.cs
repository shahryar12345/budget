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
    public class IdentityAppRolesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRolesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityRoles
        [HttpGet]
        public async Task<ActionResult<List<IdentityAppRoles>>> Get_IdentityRoles()
        {
            return await _context._IdentityRoles.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }
        // GET: api/IdentityRoles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoles>> GetIdentityRoles(int id)
        {

            var identityRoles = await _context._IdentityRoles.Where(f => f.IdentityAppRoleID == id && f.IsActive == true && f.IsDeleted == false).FirstOrDefaultAsync();

            if (identityRoles == null)
            {
                return NotFound();
            }

            return identityRoles;
        }
        [HttpGet]
        [Route("GetRoleBasedMenuitems")]
        public async Task<ActionResult<string>> GetRoleBasedMenuitems(int id = 0)
        {
            var getRolebasedMenu = await Operations.opIdentityAppRoleScreenOperations.GetRoleBasedMenuitems(id, _context);

            return getRolebasedMenu;
        }

        //[HttpGet]
        //[Route("GetIdentityRoleswithoutActions")]
        //public async Task<ActionResult<string>> GetIdentityRoleswithoutActions()
        //{
        //    var identityRoles = await Operations.opIdentityAppRoleScreenOperations.GetRoleBasedMenuitemswithoutActions(0, _context);

        //    if (identityRoles == null)
        //    {
        //        return NotFound();
        //    }

        //    return identityRoles;
        //}

        [HttpGet]
        [Route("GetRoleSpecificScreenswithoutActions")]
        public async Task<ActionResult<string>> GetRoleSpecificScreenswithoutActions(int id = 0)
        {

            var identityRoles = await Operations.opIdentityAppRoleScreenOperations.GetRoleBasedMenuitemswithoutActions(id, _context);

            if (identityRoles == null)
            {
                return NotFound();
            }

            return identityRoles;
        }
        // PUT: api/IdentityRoles/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityRoles(int id, IdentityAppRoles identityRoles)
        {
            if (id != identityRoles.IdentityAppRoleID)
            {
                return BadRequest();
            }

            _context.Entry(identityRoles).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityRolesExists(id))
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

        // POST: api/IdentityRoles
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoles>> PostIdentityRoles(IdentityAppRoles identityRoles)
        {
            string result = await Operations.opIdentityAppRoles.InsertRecords(identityRoles, _context);

            return Ok(result);
        }

        // DELETE: api/IdentityRoles/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoles>> DeleteIdentityRoles(int id)
        {
            var identityRoles = await _context._IdentityRoles.FindAsync(id);
            if (identityRoles == null)
            {
                return NotFound();
            }

            identityRoles.IsActive = false;
            identityRoles.IsDeleted = true;

            _context.Entry(identityRoles).State = EntityState.Modified;

            //_context._IdentityRoles.Remove(identityRoles);
           // _context._IdentityRoles.Remove(identityRoles);
            await _context.SaveChangesAsync();

            return identityRoles;
        }

        private bool IdentityRolesExists(int id)
        {
            return _context._IdentityRoles.Any(e => e.IdentityAppRoleID == id);
        }
    }
}
