using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABSDAL.Context;
using ABS.DBModels;
using ABSDAL.DataCache;
using ABSDAL.Operations;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimePeriodsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public TimePeriodsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/TimePeriods
        [HttpGet]
        [Cached(1000)]
        public async Task<ActionResult<IEnumerable<TimePeriods>>> GetTimePeriods()
        {
            var _contxt = opTimePeriods.getTimePeriodsContext(_context);
            var getAllData = await _contxt.TimePeriods.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();

            return  Ok(getAllData);
        }

        // GET: api/TimePeriods/5
        [HttpGet("{id}")]
        [Cached(1000)]
        public async Task<ActionResult<TimePeriods>> GetTimePeriods(int id)
        {
            var _contxt = opTimePeriods.getTimePeriodsContext(_context);

            var timePeriods = await _contxt.TimePeriods.FindAsync(id);

            if (timePeriods == null)
            {
                return NotFound();
            }

            return Ok(timePeriods);
        }

        // PUT: api/TimePeriods/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTimePeriods(int id, TimePeriods timePeriods)
        {
            if (id != timePeriods.TimePeriodID)
            {
                return BadRequest();
            }

            _context.Entry(timePeriods).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimePeriodsExists(id))
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

        // POST: api/TimePeriods
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostTimePeriods([FromBody] System.Text.Json.JsonElement rawText)


//        public async Task<ActionResult<TimePeriods>> PostTimePeriods(TimePeriods timePeriods)
        {
          var res =   await Operations.opTimePeriods.TimePeriodBulkInsert(rawText, _context);

            //_context.TimePeriods.Add(timePeriods);
            //await _context.SaveChangesAsync();
            return Ok(res);
           // return CreatedAtAction("GetTimePeriods", new { id = timePeriods.TimePeriodID }, timePeriods);
        }

        // DELETE: api/TimePeriods/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TimePeriods>> DeleteTimePeriods(int id)
        {
            var timePeriods = await _context.TimePeriods.FindAsync(id);
            if (timePeriods == null)
            {
                return NotFound();
            }

            _context.TimePeriods.Remove(timePeriods);
            await _context.SaveChangesAsync();

            return timePeriods;
        }

        private bool TimePeriodsExists(int id)
        {
            return _context.TimePeriods.Any(e => e.TimePeriodID == id);
        }
    }
}
