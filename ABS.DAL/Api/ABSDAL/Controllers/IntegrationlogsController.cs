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

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IntegrationlogsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IntegrationlogsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/Integrationlogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Integrationlogs>>> GetIntegrationlogs()
        {
            return await _context.Integrationlogs.ToListAsync();
        }

        // GET: api/Integrationlogs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Integrationlogs>> GetIntegrationlogs(int id)
        {
            var integrationlogs = await _context.Integrationlogs.FindAsync(id);

            if (integrationlogs == null)
            {
                return NotFound();
            }

            return integrationlogs;
        }

        // PUT: api/Integrationlogs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIntegrationlogs(int id, Integrationlogs integrationlogs)
        {
            if (id != integrationlogs.MLogID)
            {
                return BadRequest();
            }

            _context.Entry(integrationlogs).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IntegrationlogsExists(id))
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

        // POST: api/Integrationlogs
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Integrationlogs>> PostIntegrationlogs([FromBody] System.Text.Json.JsonElement integrationlogs)
        //public async Task<ActionResult<Integrationlogs>> PostIntegrationlogs(Integrationlogs integrationlogs)
        {
            string uncompressedData = Services.CompressionHelper.GetUncompressedData(integrationlogs);
            if (uncompressedData =="")
            { uncompressedData = integrationlogs.ToString(); }  
            var ilObj = JsonConvert.DeserializeObject(uncompressedData.ToString());
            var iLog = JsonConvert.DeserializeObject<ABS.DBModels.Integrationlogs>(ilObj.ToString());
            dynamic intLog = JsonConvert.DeserializeObject<dynamic>(ilObj.ToString());
            _context.Integrationlogs.Add(iLog);
            await _context.SaveChangesAsync();

            return Ok("Log generated");
            //return CreatedAtAction("GetIntegrationlogs", ilObj);
        }

        // DELETE: api/Integrationlogs/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Integrationlogs>> DeleteIntegrationlogs(int id)
        {
            var integrationlogs = await _context.Integrationlogs.FindAsync(id);
            if (integrationlogs == null)
            {
                return NotFound();
            }

            _context.Integrationlogs.Remove(integrationlogs);
            await _context.SaveChangesAsync();

            return integrationlogs;
        }

        private bool IntegrationlogsExists(int id)
        {
            return _context.Integrationlogs.Any(e => e.MLogID == id);
        }
    }
}
