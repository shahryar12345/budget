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
    public class ForecastModelsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public ForecastModelsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/ForecastModels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ForecastModels>>> GetForecastModels()
        {
            
            return await _context.ForecastModels.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/ForecastModels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ForecastModels>> GetForecastModels(int id)
        {
            var forecastModels = await _context.ForecastModels.FindAsync(id);

            if (forecastModels == null)
            {
                return NotFound();
            }

            return forecastModels;
        }

        // PUT: api/ForecastModels/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutForecastModels(int id, ForecastModels forecastModels)
        {
            if (id != forecastModels.ForecastModelID)
            {
                return BadRequest();
            }

            _context.Entry(forecastModels).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ForecastModelsExists(id))
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

        // POST: api/ForecastModels
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ForecastModels>> PostForecastModels(ForecastModels forecastModels)
        {
            _context.ForecastModels.Add(forecastModels);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetForecastModels", new { id = forecastModels.ForecastModelID }, forecastModels);
        }

        // DELETE: api/ForecastModels/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ForecastModels>> DeleteForecastModels(int id)
        {
            var forecastModels = await _context.ForecastModels.FindAsync(id);
            if (forecastModels == null)
            {
                return NotFound();
            }

            _context.ForecastModels.Remove(forecastModels);
            await _context.SaveChangesAsync();

            return forecastModels;
        }

        private bool ForecastModelsExists(int id)
        {
            return _context.ForecastModels.Any(e => e.ForecastModelID == id);
        }
    }
}
