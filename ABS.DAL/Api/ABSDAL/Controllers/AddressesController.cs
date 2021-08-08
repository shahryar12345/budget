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
    public class AddressesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public AddressesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/Addresses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Addresses>>> GetAddresses()
        {
            var _contxt = Operations.opAddresses.getContext(_context);
            return Ok(await _contxt.Addresses.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync());
        }

        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Addresses>> GetAddresses(int id)
        {

            var _contxt = Operations.opAddresses.getContext(_context);
            var addresses = await _contxt.Addresses.FindAsync(id);

            if (addresses == null)
            {
                return NotFound();
            }

            return Ok(addresses);
        }

        // PUT: api/Addresses/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAddresses(int id, Addresses addresses)
        {
            if (id != addresses.AddressID)
            {
                return BadRequest();
            }

            _context.Entry(addresses).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddressesExists(id))
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

        // POST: api/Addresses
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Addresses>> PostAddresses(Addresses addresses)
        {
            _context.Addresses.Add(addresses);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAddresses", new { id = addresses.AddressID }, addresses);
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Addresses>> DeleteAddresses(int id)
        {
            var addresses = await _context.Addresses.FindAsync(id);
            if (addresses == null)
            {
                return NotFound();
            }

            _context.Addresses.Remove(addresses);
            await _context.SaveChangesAsync();

            return addresses;
        }

        private bool AddressesExists(int id)
        {
            return _context.Addresses.Any(e => e.AddressID == id);
        }
    }
}
