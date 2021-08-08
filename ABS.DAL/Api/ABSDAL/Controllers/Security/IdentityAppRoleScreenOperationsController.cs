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
    public class IdentityAppRoleScreenOperationsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleScreenOperationsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleScreenOperations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleScreenOperations>>> Get_IdentityAppRoleScreenOperations()
        {
            return await _context._IdentityAppRoleScreenOperations.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleScreenOperations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleScreenOperations>> GetIdentityAppRoleScreenOperations(int id)
        {
            var identityAppRoleScreenOperations = await _context._IdentityAppRoleScreenOperations.FindAsync(id);

            if (identityAppRoleScreenOperations == null)
            {
                return NotFound();
            }

            return identityAppRoleScreenOperations;
        }

        // PUT: api/IdentityAppRoleScreenOperations/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleScreenOperations(int id, IdentityAppRoleScreenOperations identityAppRoleScreenOperations)
        {
            if (id != identityAppRoleScreenOperations.IdentityAppRoleScreenOperationID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleScreenOperations).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleScreenOperationsExists(id))
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

        [HttpGet]
        [Route("GetRoleBasedMenuitems")]
        public async Task<ActionResult<string>> GetRoleBasedMenuitems(int Roleid = 0)
        {
            var identityAppRoleScreenOperations = await  Operations.opIdentityAppRoleScreenOperations.GetRoleBasedMenuitems(Roleid, _context);

            if (identityAppRoleScreenOperations == "")
            {
                return NotFound();
            }

            return identityAppRoleScreenOperations;
        }

        // POST: api/IdentityAppRoleScreenOperations
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleScreenOperations>> PostIdentityAppRoleScreenOperations(List<IdentityAppRoleScreenOperations> lstidentityAppRoleScreenOperations)
        {
            string result = await Operations.opIdentityAppRoleScreenOperations.InsertRecords(lstidentityAppRoleScreenOperations, _context);

            return Ok(result);
}

        // DELETE: api/IdentityAppRoleScreenOperations/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleScreenOperations>> DeleteIdentityAppRoleScreenOperations(int id)
        {
            var identityAppRoleScreenOperations = await _context._IdentityAppRoleScreenOperations.FindAsync(id);
            if (identityAppRoleScreenOperations == null)
            {
                return NotFound();
            }

            _context._IdentityAppRoleScreenOperations.Remove(identityAppRoleScreenOperations);
            await _context.SaveChangesAsync();

            return identityAppRoleScreenOperations;
        }

        private bool IdentityAppRoleScreenOperationsExists(int id)
        {
            return _context._IdentityAppRoleScreenOperations.Any(e => e.IdentityAppRoleScreenOperationID == id);
        }
    }
}
