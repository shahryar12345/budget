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
    public class AccountsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public AccountsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/Accounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Accounts>>> GetAccounts()
        {
            var _contxt = Operations.opAccounts.getContext(_context);
            return Ok ( await _contxt.Accounts.ToListAsync());
        }

        // GET: api/Accounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Accounts>> GetAccounts(int id)
        {
            var _contxt = Operations.opAccounts.getContext(_context);
            var accounts = await _contxt.Accounts.FindAsync(id);

            if (accounts == null)
            {
                return NotFound();
            }

            return Ok ( accounts) ;
        }

        // PUT: api/Accounts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccounts(int id, Accounts accounts)
        {
            if (id != accounts.AccountID)
            {
                return BadRequest();
            }

            _context.Entry(accounts).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountsExists(id))
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

        // POST: api/Accounts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Accounts>> PostAccounts(Accounts accounts)
        {
            _context.Accounts.Add(accounts);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAccounts", new { id = accounts.AccountID }, accounts);
        }

        // DELETE: api/Accounts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Accounts>> DeleteAccounts(int id)
        {
            var accounts = await _context.Accounts.FindAsync(id);
            if (accounts == null)
            {
                return NotFound();
            }

            _context.Accounts.Remove(accounts);
            await _context.SaveChangesAsync();

            return accounts;
        }

        private bool AccountsExists(int id)
        {
            return _context.Accounts.Any(e => e.AccountID == id);
        }
    }
}
