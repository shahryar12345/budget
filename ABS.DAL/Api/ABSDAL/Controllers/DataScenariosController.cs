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
    public class DataScenariosController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public DataScenariosController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/DataScenarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DataScenario>>> GetDataScenarios()
        {
            var _contxt = Operations.opDataScenario.getContext(_context);
            return Ok(await _contxt.DataScenarios.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync());
        }

        // GET: api/DataScenarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DataScenario>> GetDataScenario(int id)
        {
            var _contxt = Operations.opDataScenario.getContext(_context);
            var dataScenario = await _contxt.DataScenarios.FindAsync(id);

            if (dataScenario == null)
            {
                return NotFound();
            }

            return Ok(dataScenario);
        }

        // PUT: api/DataScenarios/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDataScenario(int id, DataScenario dataScenario)
        {
            if (id != dataScenario.DataScenarioID)
            {
                return BadRequest();
            }

            _context.Entry(dataScenario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DataScenarioExists(id))
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

        // POST: api/DataScenarios
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostStaffingData([FromBody] System.Text.Json.JsonElement rawText)

        {
            var res = await Operations.opDataScenario.DataScenarioBulkInsert(rawText, _context);

            return Ok(res);

            //_context.StaffingData.Add(StaffingData);
            //await _context.SaveChangesAsync();

            //return CreatedAtAction("GetStaffingData", new { id = StaffingData.StaffingDataID }, StaffingData);
        }


        // DELETE: api/DataScenarios/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<DataScenario>> DeleteDataScenario(int id)
        {
            var dataScenario = await _context.DataScenarios.FindAsync(id);
            if (dataScenario == null)
            {
                return NotFound();
            }

            _context.DataScenarios.Remove(dataScenario);
            await _context.SaveChangesAsync();

            return dataScenario;
        }

        private bool DataScenarioExists(int id)
        {
            return _context.DataScenarios.Any(e => e.DataScenarioID == id);
        }
    }
}
