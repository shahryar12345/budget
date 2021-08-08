using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABSDAL.Context;
using ABS.DBModels;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForecastStepsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public ForecastStepsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/ForecastSteps

        [HttpGet]

        public async Task<ActionResult<IEnumerable<ForecastSteps>>> GetforecastSteps()
        {

            var _contxt = Operations.opForecastSteps.getContext(_context);

            return Ok(await _contxt.forecastSteps.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync());
        }

        // GET: api/ForecastSteps/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ForecastSteps>> GetForecastSteps(int id)
        {
            var _contxt = Operations.opForecastSteps.getContext(_context);

            var forecastSteps = await _contxt.forecastSteps.FindAsync(id);

            if (forecastSteps == null)
            {
                return NotFound();
            }

            return Ok(forecastSteps);
        }

        // PUT: api/ForecastSteps/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutForecastSteps(int id, ForecastSteps forecastSteps)
        {
            if (id != forecastSteps.ForecastStepID)
            {
                return BadRequest();
            }

            _context.Entry(forecastSteps).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ForecastStepsExists(id))
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

        // POST: api/ForecastSteps
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ForecastSteps>> PostForecastSteps(ForecastSteps forecastSteps)
        {
            _context.forecastSteps.Add(forecastSteps);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetForecastSteps", new { id = forecastSteps.ForecastStepID }, forecastSteps);
        }

        // DELETE: api/ForecastSteps/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ForecastSteps>> DeleteForecastSteps(int id)
        {
            var forecastSteps = await _context.forecastSteps.FindAsync(id);
            if (forecastSteps == null)
            {
                return NotFound();
            }

            _context.forecastSteps.Remove(forecastSteps);
            await _context.SaveChangesAsync();

            return forecastSteps;
        }

        private bool ForecastStepsExists(int id)
        {
            return _context.forecastSteps.Any(e => e.ForecastStepID == id);
        }
    }
}
