using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using ABSDAL.Context;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForecastHistoryController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public ForecastHistoryController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/ForecastHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ForecastHistory>>> GetForecastHistory(int BudgetversionID = 0, string DataScenarioType = "")
        {
            List<ForecastHistory> Results = new List<ForecastHistory>();

            if (BudgetversionID > 0 && DataScenarioType != "")
            {
                Results = await _context.ForecastHistory.Where
                    (f => 
                    f.IsActive == true 
                    && f.IsDeleted == false
                    && f.budgetVersionID.BudgetVersionID == BudgetversionID
                    && f.DatascenarioType == DataScenarioType
                    )
                    .ToListAsync();

            }
            else
             if (BudgetversionID == 0 && DataScenarioType != "")

            {
                Results = await _context.ForecastHistory.Where
                    (f =>
                    f.IsActive == true
                    && f.IsDeleted == false
                    && f.DatascenarioType == DataScenarioType
                    )
                    .ToListAsync();
            }
            else
             if (BudgetversionID > 0 && DataScenarioType == "")

            {
                Results = await _context.ForecastHistory.Where
                    (f =>
                    f.IsActive == true
                    && f.IsDeleted == false
                    && f.budgetVersionID.BudgetVersionID == BudgetversionID
                    )
                    .ToListAsync();
            }
             else
              

            {
                Results = await _context.ForecastHistory.Where
                    (f =>
                    f.IsActive == true
                    && f.IsDeleted == false
                    )
                    .ToListAsync();
            }











            return Results;
        }

        // GET: api/ForecastHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ForecastHistory>> GetForecastHistory(int id)
        {
            var forecastHistory = await _context.ForecastHistory.FindAsync(id);

            if (forecastHistory == null)
            {
                return NotFound();
            }

            return forecastHistory;
        }

        // PUT: api/ForecastHistories/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutForecastHistory(int id, ForecastHistory forecastHistory)
        {
            if (id != forecastHistory.ForecastHistoryID)
            {
                return BadRequest();
            }

            _context.Entry(forecastHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ForecastHistoryExists(id))
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

        // POST: api/ForecastHistories
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<string>> PostForecastHistory(string forecastHistory)
        {
             
                var forecasthistoryresult = await Operations.opForecastHistory.InsertRecords(forecastHistory, _context);

                return Ok(forecasthistoryresult);
               
        }

        // DELETE: api/ForecastHistories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ForecastHistory>> DeleteForecastHistory(int id)
        {
            var forecastHistory = await _context.ForecastHistory.FindAsync(id);
            if (forecastHistory == null)
            {
                return NotFound();
            }

            _context.ForecastHistory.Remove(forecastHistory);
            await _context.SaveChangesAsync();

            return forecastHistory;
        }

        private bool ForecastHistoryExists(int id)
        {
            return _context.ForecastHistory.Any(e => e.ForecastHistoryID == id);
        }
    }
}
