using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using ABSDAL.Context;
using ABSDAL.DataCache;
using System.Text.Json;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticMappingsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public StatisticMappingsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/StatisticMappings
        [HttpGet]
        [Cached(1000)]
        public async Task<ActionResult<IEnumerable<StatisticMappings>>> GetStatisticMappings()
        {
            var cntxt = Operations.opStatisticsMapping.getStatisticsMappingContext(_context);

            return await cntxt.StatisticMappings.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/StatisticMappings/5
        [HttpGet("{id}")]
        [Cached(1000)]
        public async Task<ActionResult<StatisticMappings>> GetStatisticMappings(int id)
        {

            var cntxt = Operations.opStatisticsMapping.getStatisticsMappingContext(_context);

            var statisticMappings = await cntxt.StatisticMappings.FindAsync(id);

            if (statisticMappings == null)
            {
                return NotFound();
            }

            return statisticMappings;
        }

        [HttpGet]
        [Route("GetEntityMappings")]
        [Cached(1000)]
        public async Task<List<StatisticMappings>> GetEntityMapping(int EntityID)
        {
            var cntxt = Operations.opStatisticsMapping.getStatisticsMappingContext(_context);

            var statisticMappings = await cntxt.StatisticMappings.Where (x => x.Entity.EntityID == EntityID).ToListAsync();

            if (statisticMappings == null)
            {
                return null;
            }

            return statisticMappings;
        }


        [HttpGet]
        [Route("GetDepartmentMappings")]
        [Cached(1000)]
        public async Task<List<StatisticMappings>> GetDepartmentMappings(int DepartmentID)
        {
            var cntxt = Operations.opStatisticsMapping.getStatisticsMappingContext(_context);

            var statisticMappings = await cntxt.StatisticMappings.Where(x => x.Department.DepartmentID == DepartmentID).ToListAsync();

            if (statisticMappings == null)
            {
                return null;
            }

            return statisticMappings;
        }

         [HttpGet]
        [Route("GetEntityDepartmentMappings")]
        [Cached(1000)]
        public async Task<List<StatisticMappings>> GetEntityDepartmentMappings(int EntityID, int DepartmentID)
        {
            var cntxt = Operations.opStatisticsMapping.getStatisticsMappingContext(_context);

            var statisticMappings = await cntxt.StatisticMappings.Where(x => x.Entity.EntityID == EntityID && x.Department.DepartmentID == DepartmentID).ToListAsync();

            if (statisticMappings == null)
            {
                return null;
            }

            return statisticMappings;
        }





        // PUT: api/StatisticMappings/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStatisticMappings(int id, StatisticMappings statisticMappings)
        {
            if (id != statisticMappings.StatisticMappingID)
            {
                return BadRequest();
            }

            _context.Entry(statisticMappings).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StatisticMappingsExists(id))
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

        // POST: api/StatisticMappings
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<APIResponse>> PostStatisticMappings([FromBody] JsonElement rawText)
        {

            return await Operations.opStatisticsMapping.StatisticsMappingBulkInsert(rawText, _context);

            //_context.StatisticMappings.Add(statisticMappings);
            //await _context.SaveChangesAsync();

            //return CreatedAtAction("GetStatisticMappings", new { id = statisticMappings.StatisticMappingID }, statisticMappings);
        }

        // DELETE: api/StatisticMappings/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<StatisticMappings>> DeleteStatisticMappings(int id)
        {
            var statisticMappings = await _context.StatisticMappings.FindAsync(id);
            if (statisticMappings == null)
            {
                return NotFound();
            }

            _context.StatisticMappings.Remove(statisticMappings);
            await _context.SaveChangesAsync();

            return statisticMappings;
        }

        private bool StatisticMappingsExists(int id)
        {
            return _context.StatisticMappings.Any(e => e.StatisticMappingID == id);
        }
    }
}
