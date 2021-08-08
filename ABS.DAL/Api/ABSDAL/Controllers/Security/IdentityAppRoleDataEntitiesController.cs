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
    public class IdentityAppRoleDataEntitiesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleDataEntitiesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleDataEntities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleDataEntities>>> Get_IdentityAppRoleDataEntities()
        {
            return await _context._IdentityAppRoleDataEntities.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleDataEntities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataEntities>> GetIdentityAppRoleDataEntities(int id)
        {
            var identityAppRoleDataEntities = await _context._IdentityAppRoleDataEntities.FindAsync(id);

            if (identityAppRoleDataEntities == null)
            {
                return NotFound();
            }

            return identityAppRoleDataEntities;
        }

        // PUT: api/IdentityAppRoleDataEntities/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleDataEntities(int id, IdentityAppRoleDataEntities identityAppRoleDataEntities)
        {
            if (id != identityAppRoleDataEntities.IdentityAppRoleDataEntityID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleDataEntities).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleDataEntitiesExists(id))
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

        // POST: api/IdentityAppRoleDataEntities
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleDataEntities>> PostIdentityAppRoleDataEntities(List<IdentityAppRoleDataEntities> lstidentityAppRoleDataEntities)
        {
            string result = await Operations.opIdentityAppRoleDataEntities.InsertRecords(lstidentityAppRoleDataEntities, _context);

            return Ok(result);
             
        }

        // DELETE: api/IdentityAppRoleDataEntities/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataEntities>> DeleteIdentityAppRoleDataEntities(int id)
        {
            var identityAppRoleDataEntities = await _context._IdentityAppRoleDataEntities.FindAsync(id);
            if (identityAppRoleDataEntities == null)
            {
                return NotFound();
            }

            _context._IdentityAppRoleDataEntities.Remove(identityAppRoleDataEntities);
            await _context.SaveChangesAsync();

            return identityAppRoleDataEntities;
        }

        private bool IdentityAppRoleDataEntitiesExists(int id)
        {
            return _context._IdentityAppRoleDataEntities.Any(e => e.IdentityAppRoleDataEntityID == id);
        }
    }
}
