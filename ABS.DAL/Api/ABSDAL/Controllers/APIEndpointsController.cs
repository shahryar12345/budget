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
    public class APIEndpointsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public APIEndpointsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/APIEndpoints
        [HttpGet]
        public async Task<ActionResult<IEnumerable<APIEndpoint>>> Get_APIEndpoints()
        {
            return await _context._APIEndpoints.Where(f=> f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }
        [HttpGet]
        [Route("GetEndpointsbyEnvironment")]
        public async Task<ActionResult<IEnumerable<APIEndpoint>>> GetEndpointsbyEnvironment(string EnvironmentName)
        {
            return await _context._APIEndpoints.Where(
                f => f.EnvironmentName.ToUpper() ==  EnvironmentName.ToUpper()
                && f.IsActive == true 
                && f.IsDeleted == false)
                .ToListAsync();
        }

        // GET: api/APIEndpoints/5
        [HttpGet("{id}")]
        public async Task<ActionResult<APIEndpoint>> GetAPIEndpoint(int id)
        {
            var aPIEndpoint = await _context._APIEndpoints.FindAsync(id);

            if (aPIEndpoint == null)
            {
                return NotFound();
            }

            return aPIEndpoint;
        }

        // PUT: api/APIEndpoints/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAPIEndpoint(int id, APIEndpoint aPIEndpoint)
        {
            if (id != aPIEndpoint.APIEndpointID)
            {
                return BadRequest();
            }

            _context.Entry(aPIEndpoint).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!APIEndpointExists(id))
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

        // POST: api/APIEndpoints
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<APIEndpoint>> PostAPIEndpoint(APIEndpoint aPIEndpoint)
        {
            _context._APIEndpoints.Add(aPIEndpoint);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAPIEndpoint", new { id = aPIEndpoint.APIEndpointID }, aPIEndpoint);
        }

        // DELETE: api/APIEndpoints/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<APIEndpoint>> DeleteAPIEndpoint(int id)
        {
            var aPIEndpoint = await _context._APIEndpoints.FindAsync(id);
            if (aPIEndpoint == null)
            {
                return NotFound();
            }

            _context._APIEndpoints.Remove(aPIEndpoint);
            await _context.SaveChangesAsync();

            return aPIEndpoint;
        }

        private bool APIEndpointExists(int id)
        {
            return _context._APIEndpoints.Any(e => e.APIEndpointID == id);
        }
    }
}
