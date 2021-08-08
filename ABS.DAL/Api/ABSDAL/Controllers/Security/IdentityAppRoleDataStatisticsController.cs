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
    public class IdentityAppRoleDataStatisticsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityAppRoleDataStatisticsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityAppRoleDataStatistics
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityAppRoleDataStatistics>>> Get_IdentityAppRoleDataStatistics()
        {
            return await _context._IdentityAppRoleDataStatistics.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityAppRoleDataStatistics/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataStatistics>> GetIdentityAppRoleDataStatistics(int id)
        {
            var identityAppRoleDataStatistics = await _context._IdentityAppRoleDataStatistics.FindAsync(id);

            if (identityAppRoleDataStatistics == null)
            {
                return NotFound();
            }

            return identityAppRoleDataStatistics;
        }

        // PUT: api/IdentityAppRoleDataStatistics/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityAppRoleDataStatistics(int id, IdentityAppRoleDataStatistics identityAppRoleDataStatistics)
        {
            if (id != identityAppRoleDataStatistics.IdentityAppRoleDataStatisticsID)
            {
                return BadRequest();
            }

            _context.Entry(identityAppRoleDataStatistics).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityAppRoleDataStatisticsExists(id))
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

        // POST: api/IdentityAppRoleDataStatistics
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<IdentityAppRoleDataStatistics>> PostIdentityAppRoleDataStatistics(List<IdentityAppRoleDataStatistics> lstidentityAppRoleDataStatistics)
        {
            string result = await Operations.opIdentityAppRoleDataStatistics.InsertRecords(lstidentityAppRoleDataStatistics, _context);

            return Ok(result);
           }

        // DELETE: api/IdentityAppRoleDataStatistics/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityAppRoleDataStatistics>> DeleteIdentityAppRoleDataStatistics(int id)
        {
            var identityAppRoleDataStatistics = await _context._IdentityAppRoleDataStatistics.FindAsync(id);
            if (identityAppRoleDataStatistics == null)
            {
                return NotFound();
            }

            _context._IdentityAppRoleDataStatistics.Remove(identityAppRoleDataStatistics);
            await _context.SaveChangesAsync();

            return identityAppRoleDataStatistics;
        }

        private bool IdentityAppRoleDataStatisticsExists(int id)
        {
            return _context._IdentityAppRoleDataStatistics.Any(e => e.IdentityAppRoleDataStatisticsID == id);
        }
    }
}
