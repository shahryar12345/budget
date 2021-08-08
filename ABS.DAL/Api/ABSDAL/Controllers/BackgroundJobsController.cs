using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels.Models;
using ABSDAL.Context;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BackgroundJobsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public BackgroundJobsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/BackgroundJobs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BackgroundJobs>>> GetBackgroundJobs()
        {
            return await _context.BackgroundJobs.ToListAsync();
        }

        // GET: api/BackgroundJobs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BackgroundJobs>> GetBackgroundJobs(int id)
        {
            var backgroundJobs = await _context.BackgroundJobs.FindAsync(id);

            if (backgroundJobs == null)
            {
                return NotFound();
            }

            return backgroundJobs;
        }

        [HttpGet ]
        [Route("GetBGJobbyIdentifier")]

        public async Task<ActionResult<BackgroundJobs>> GetBGJobbyIdentifier(Guid identifier)
        {
            var backgroundJobs = await _context.BackgroundJobs.Where(f=> f.Identifier == identifier).FirstOrDefaultAsync();

            if (backgroundJobs == null)
            {
                return NotFound();
            }

            return backgroundJobs;
        }

        [HttpGet]
        [Route("GetBGJobbyHangfireId")]

        public async Task<ActionResult<BackgroundJobs>> GetBGJobbyHangfireId(Guid identifier)
        {
            var backgroundJobs = await _context.BackgroundJobs.Where(f => f.HangfireIdentifier == identifier).FirstOrDefaultAsync();

            if (backgroundJobs == null)
            {
                return NotFound();
            }

            return backgroundJobs;
        }

        [HttpGet]
        [Route("GetBGJobbyUserIdentifier")]

        public async Task<ActionResult<BackgroundJobs>> GetBGJobbyUserID(string Useridentifier)
        {
            var backgroundJobs = await _context.BackgroundJobs
                .Where(f => f.userIdentifier == Useridentifier)
                .FirstOrDefaultAsync();

            if (backgroundJobs == null)
            {
                return NotFound();
            }

            return backgroundJobs;
        }
        [HttpGet]
        [Route("Last24HoursforUser")]

        public async Task<ActionResult<List<BackgroundJobs>>> Last24HoursforUser(string Useridentifier)
        {

            DateTime yesterday = DateTime.UtcNow.AddDays(-1);
            var backgroundJobs = await _context.BackgroundJobs.Where(f => f.userIdentifier == Useridentifier 
            && f.CreatedAt > yesterday).ToListAsync();

            if (backgroundJobs == null)
            {
                return NotFound();
            }

            return backgroundJobs;
        }



        // PUT: api/BackgroundJobs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBackgroundJobs(int id, BackgroundJobs backgroundJobs)
        {
            if (id != backgroundJobs.BGJId)
            {
                return BadRequest();
            }

            _context.Entry(backgroundJobs).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BackgroundJobsExists(id))
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

        // POST: api/BackgroundJobs
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<BackgroundJobs>> PostBackgroundJobs(BackgroundJobs backgroundJobs)
        {
             _context.BackgroundJobs.Add(backgroundJobs);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBackgroundJobs", new { id = backgroundJobs.BGJId }, backgroundJobs);
        }

        // DELETE: api/BackgroundJobs/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<BackgroundJobs>> DeleteBackgroundJobs(int id)
        {
            var backgroundJobs = await _context.BackgroundJobs.FindAsync(id);
            if (backgroundJobs == null)
            {
                return NotFound();
            }

            _context.BackgroundJobs.Remove(backgroundJobs);
            await _context.SaveChangesAsync();

            return backgroundJobs;
        }

        private bool BackgroundJobsExists(int id)
        {
            return _context.BackgroundJobs.Any(e => e.BGJId == id);
        }
    }
}
