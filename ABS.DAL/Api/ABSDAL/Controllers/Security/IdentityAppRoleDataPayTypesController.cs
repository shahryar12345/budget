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
    public class IdentityAppRoleDataPayTypesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleDataPayTypesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleDataPayTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleDataPayTypes>>> Get_IdentityAppRoleDataPayTypes()
        {
            return await _context._IdentityAppRoleDataPayTypes.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleDataPayTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataPayTypes>> GetIdentityAppRoleDataPayTypes(int id)
        {
            var identityAppRoleDataPayTypes = await _context._IdentityAppRoleDataPayTypes.FindAsync(id);

            if (identityAppRoleDataPayTypes == null)
            {
                return NotFound();
            }

            return identityAppRoleDataPayTypes;
        }

        // PUT: api/IdentityAppRoleDataPayTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleDataPayTypes(int id, IdentityAppRoleDataPayTypes identityAppRoleDataPayTypes)
        {
            if (id != identityAppRoleDataPayTypes.IdentityAppRoleDataPayTypeID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleDataPayTypes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleDataPayTypesExists(id))
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

        // POST: api/IdentityAppRoleDataPayTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleDataPayTypes>> PostIdentityAppRoleDataPayTypes(List<IdentityAppRoleDataPayTypes> lstidentityAppRoleDataPayTypes)
        {
            string result = await Operations.opIdentityAppRoleDataPayTypes.InsertRecords(lstidentityAppRoleDataPayTypes, _context);

            return Ok(result);
          }

        // DELETE: api/IdentityAppRoleDataPayTypes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataPayTypes>> DeleteIdentityAppRoleDataPayTypes(int id)
        {
            var identityAppRoleDataPayTypes = await _context._IdentityAppRoleDataPayTypes.FindAsync(id);
            if (identityAppRoleDataPayTypes == null)
            {
                return NotFound();
            }

            _context._IdentityAppRoleDataPayTypes.Remove(identityAppRoleDataPayTypes);
            await _context.SaveChangesAsync();

            return identityAppRoleDataPayTypes;
        }

        private bool IdentityAppRoleDataPayTypesExists(int id)
        {
            return _context._IdentityAppRoleDataPayTypes.Any(e => e.IdentityAppRoleDataPayTypeID == id);
        }
    }
}
