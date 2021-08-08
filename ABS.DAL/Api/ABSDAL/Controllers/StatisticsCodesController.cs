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
    public class StatisticsCodesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public StatisticsCodesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/StatisticsCodes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StatisticsCodes>>> GetStatisticsCodes(int Userid = 0)
        {
            if (Userid == 0)
            {
                var _contxt = Operations.opStatisticsCodes.getopStatisticsCodesContext(_context);

                return Ok(await _contxt.StatisticsCodes.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync());
            }
            else
            {
                var getlst = await _context._IdentityAppRoleDataStatistics
                 .Where(f => f.UserID.UserProfileID == Userid
                 && f.IsActive == true
                 && f.IsDeleted == false)
                 .Select(f => f.StatsCodeID).ToListAsync();
                if (getlst == null && await Operations.opIdentityAppRoleUsers.isAdminRole(Userid, _context))
                {

                    var _contxt = Operations.opStatisticsCodes.getopStatisticsCodesContext(_context);

                    return Ok(await _contxt.StatisticsCodes.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync());


                }

                return Ok(getlst);
            }
        }

        // GET: api/StatisticsCodes/5
        [HttpGet("{id}")]
        [Route("StatisticsCodebyID")]
        public async Task<ActionResult<StatisticsCodes>> StatisticsCodebyID(int id)
        {
            var _contxt = Operations.opStatisticsCodes.getopStatisticsCodesContext(_context);
            var statisticsCodes = await _contxt.StatisticsCodes.FindAsync(id);

            if (statisticsCodes == null)
            {
                return NotFound();
            }

            return Ok(statisticsCodes);
        }

        // PUT: api/StatisticsCodes/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStatisticsCodes(int id, StatisticsCodes statisticsCodes)
        {
            if (id != statisticsCodes.StatisticsCodeID)
            {
                return BadRequest();
            }

            _context.Entry(statisticsCodes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StatisticsCodesExists(id))
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

        // POST: api/StatisticsCodes
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]

        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostEntities([FromBody] System.Text.Json.JsonElement rawText)


        //    public async Task<ActionResult<StatisticsCodes>> PostStatisticsCodes(StatisticsCodes statisticsCodes)
        {
            var res = await Operations.opStatisticsCodes.StatisticsCodeBulkInsert(rawText, _context);

            //_context.TimePeriods.Add(timePeriods);
            //await _context.SaveChangesAsync();
            return Ok(res);
            //_context.StatisticsCodes.Add(statisticsCodes);
            //await _context.SaveChangesAsync();

            //return CreatedAtAction("GetStatisticsCodes", new { id = statisticsCodes.StatisticsCodeID }, statisticsCodes);
        }

        // DELETE: api/StatisticsCodes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<StatisticsCodes>> DeleteStatisticsCodes(int id)
        {
            var statisticsCodes = await _context.StatisticsCodes.FindAsync(id);
            if (statisticsCodes == null)
            {
                return NotFound();
            }

            _context.StatisticsCodes.Remove(statisticsCodes);
            await _context.SaveChangesAsync();

            return statisticsCodes;
        }

        private bool StatisticsCodesExists(int id)
        {
            return _context.StatisticsCodes.Any(e => e.StatisticsCodeID == id);
        }
    }
}
