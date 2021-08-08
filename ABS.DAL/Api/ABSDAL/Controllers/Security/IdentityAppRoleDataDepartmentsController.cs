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
    public class IdentityAppRoleDataDepartmentsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleDataDepartmentsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleDataDepartments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleDataDepartments>>> Get_IdentityAppRoleDataDepartments()
        {
            return await _context._IdentityAppRoleDataDepartments.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleDataDepartments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataDepartments>> GetIdentityAppRoleDataDepartments(int id)
        {
            var identityAppRoleDataDepartments = await _context._IdentityAppRoleDataDepartments.FindAsync(id);

            if (identityAppRoleDataDepartments == null)
            {
                return NotFound();
            }

            return identityAppRoleDataDepartments;
        }

        // PUT: api/IdentityAppRoleDataDepartments/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleDataDepartments(int id, IdentityAppRoleDataDepartments identityAppRoleDataDepartments)
        {
            if (id != identityAppRoleDataDepartments.IdentityAppRoleDataDepartmentID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleDataDepartments).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleDataDepartmentsExists(id))
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

        // POST: api/IdentityAppRoleDataDepartments
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleDataDepartments>> PostIdentityAppRoleDataDepartments(List<IdentityAppRoleDataDepartments> lstidentityAppRoleDataDepartments)
        {
            string result = await  Operations.opIdentityAppRoleDataDepartments.InsertRecords(lstidentityAppRoleDataDepartments, _context);

            return Ok(result);


            //return CreatedAtAction("GetIdentityAppRoleDataDepartments", new { id = identityAppRoleDataDepartments.IdentityAppRoleDataDepartmentID }, identityAppRoleDataDepartments);
        }

        // DELETE: api/IdentityAppRoleDataDepartments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataDepartments>> DeleteIdentityAppRoleDataDepartments(int id)
        {
            var identityAppRoleDataDepartments = await _context._IdentityAppRoleDataDepartments.FindAsync(id);
            if (identityAppRoleDataDepartments == null)
            {
                return NotFound();
            }

            _context._IdentityAppRoleDataDepartments.Remove(identityAppRoleDataDepartments);
            await _context.SaveChangesAsync();

            return identityAppRoleDataDepartments;
        }

        private bool IdentityAppRoleDataDepartmentsExists(int id)
        {
            return _context._IdentityAppRoleDataDepartments.Any(e => e.IdentityAppRoleDataDepartmentID == id);
        }
    }
}
