using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABSDAL.Context;
using ABS.DBModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ABSDAL.Operations;
using System.Text.Json;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChargeCodesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public ChargeCodesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/ChargeCodes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChargeCodes>>> GetChargeCodes()
        {
            var _contxt = Operations.opChargeCodes.getContext(_context);
            return Ok(await _contxt.ChargeCodes.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync());
        }

        // GET: api/ChargeCodes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ChargeCodes>> GetChargeCodes(int id)
        {
            var _contxt = Operations.opChargeCodes.getContext(_context);
            var chargeCodes = await _contxt.ChargeCodes.FindAsync(id);

            if (chargeCodes == null)
            {
                return NotFound();
            }

            return Ok(chargeCodes);
        }

        // PUT: api/ChargeCodes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChargeCodes(int id, ChargeCodes chargeCodes)
        {
            if (id != chargeCodes.ChargeCodeID)
            {
                return BadRequest();
            }

            _context.Entry(chargeCodes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChargeCodesExists(id))
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

        // POST: api/ChargeCodes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        //[HttpPost]
        //public async Task<ActionResult<ChargeCodes>> PostChargeCodes(ChargeCodes chargeCodes)
        //{
        //    _context.ChargeCodes.Add(chargeCodes);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetChargeCodes", new { id = chargeCodes.ChargeCodeID }, chargeCodes);
        //}


        [HttpPost]
        public async Task<ActionResult<ChargeCodes>> PostChargeCodes([FromBody] JsonElement rawText)
        //  public string PostChargeCodes([FromBody]  System.Text.Json.JsonElement rawText, string recordType)

        {
            var res = await Operations.opChargeCodes.ChargeCodeBulkInsert(rawText, _context);

            return Ok(res);
        }








        // DELETE: api/ChargeCodes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ChargeCodes>> DeleteChargeCodes(int id)
        {
            var chargeCodes = await _context.ChargeCodes.FindAsync(id);
            if (chargeCodes == null)
            {
                return NotFound();
            }

            _context.ChargeCodes.Remove(chargeCodes);
            await _context.SaveChangesAsync();

            return chargeCodes;
        }

        private bool ChargeCodesExists(int id)
        {
            return _context.ChargeCodes.Any(e => e.ChargeCodeID == id);
        }
    }
}
