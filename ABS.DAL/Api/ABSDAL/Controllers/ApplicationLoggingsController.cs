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
    public class ApplicationLoggingsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public ApplicationLoggingsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/ApplicationLoggings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApplicationLogging>>> Get_applicationLoggings()
        {
            return await _context._applicationLoggings.ToListAsync();
        }

        // GET: api/ApplicationLoggings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationLogging>> GetApplicationLogging(int id)
        {
            var applicationLogging = await _context._applicationLoggings.FindAsync(id);

            if (applicationLogging == null)
            {
                return NotFound();
            }

            return applicationLogging;
        }

        // PUT: api/ApplicationLoggings/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutApplicationLogging(int id, ApplicationLogging applicationLogging)
        {
            if (id != applicationLogging.MLogID)
            {
                return BadRequest();
            }

            _context.Entry(applicationLogging).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApplicationLoggingExists(id))
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

        // POST: api/ApplicationLoggings
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ApplicationLogging>> PostApplicationLogging(ApplicationLogging applicationLogging)
        {
            _context._applicationLoggings.Add(applicationLogging);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetApplicationLogging", new { id = applicationLogging.MLogID }, applicationLogging);
        }

        // DELETE: api/ApplicationLoggings/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApplicationLogging>> DeleteApplicationLogging(int id)
        {
            var applicationLogging = await _context._applicationLoggings.FindAsync(id);
            if (applicationLogging == null)
            {
                return NotFound();
            }

            _context._applicationLoggings.Remove(applicationLogging);
            await _context.SaveChangesAsync();

            return applicationLogging;
        }

        private bool ApplicationLoggingExists(int id)
        {
            return _context._applicationLoggings.Any(e => e.MLogID == id);
        }
    }
}
