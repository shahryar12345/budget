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
    public class IdentityScreensController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityScreensController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityScreens
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityScreens>>> Get_IdentityScreens()
        {
            return await _context._IdentityScreens.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityScreens/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityScreens>> GetIdentityScreens(int id)
        {
            var identityScreens = await _context._IdentityScreens.FindAsync(id);

            if (identityScreens == null)
            {
                return NotFound();
            }

            return identityScreens;
        }

        // PUT: api/IdentityScreens/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityScreens(int id, IdentityScreens identityScreens)
        {
            if (id != identityScreens.IdentityScreenID)
            {
                return BadRequest();
            }

            _context.Entry(identityScreens).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityScreensExists(id))
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

        // POST: api/IdentityScreens
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<List<IdentityScreens>>> PostIdentityScreens(List<IdentityScreens> lstidentityScreens)
        {
            string result = "";
            if (lstidentityScreens != null && lstidentityScreens.Count > 0)
            {
                foreach (var identityScreens in lstidentityScreens)
                {
                    result += Environment.NewLine + await Operations.opIdentityScreens.InsertRecords(identityScreens, _context);
                }
            }
            return Ok(result);
        }

        // DELETE: api/IdentityScreens/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityScreens>> DeleteIdentityScreens(int id)
        {
            var identityScreens = await _context._IdentityScreens.FindAsync(id);
            if (identityScreens == null)
            {
                return NotFound();
            }

            _context._IdentityScreens.Remove(identityScreens);
            await _context.SaveChangesAsync();

            return identityScreens;
        }

        private bool IdentityScreensExists(int id)
        {
            return _context._IdentityScreens.Any(e => e.IdentityScreenID == id);
        }
    }
}
