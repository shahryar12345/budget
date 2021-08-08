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
    public class UserBackupsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public UserBackupsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/UserBackups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserBackups>>> GetUserBackups()
        {
            return await _context.UserBackups.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/UserBackups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserBackups>> GetUserBackups(int id)
        {
            var userBackups = await _context.UserBackups.FindAsync(id);

            if (userBackups == null)
            {
                return NotFound();
            }

            return userBackups;
        }

        // PUT: api/UserBackups/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserBackups(int id, UserBackups userBackups)
        {
            if (id != userBackups.UserBackupID)
            {
                return BadRequest();
            }

            _context.Entry(userBackups).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserBackupsExists(id))
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

        // POST: api/UserBackups
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<UserBackups>> PostUserBackups(UserBackups userBackups)
        {
            _context.UserBackups.Add(userBackups);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserBackups", new { id = userBackups.UserBackupID }, userBackups);
        }

        // DELETE: api/UserBackups/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserBackups>> DeleteUserBackups(int id)
        {
            var userBackups = await _context.UserBackups.FindAsync(id);
            if (userBackups == null)
            {
                return NotFound();
            }

            _context.UserBackups.Remove(userBackups);
            await _context.SaveChangesAsync();

            return userBackups;
        }

        private bool UserBackupsExists(int id)
        {
            return _context.UserBackups.Any(e => e.UserBackupID == id);
        }
    }
}
