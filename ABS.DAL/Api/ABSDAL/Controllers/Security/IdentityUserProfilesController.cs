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
    public class IdentityUserProfilesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IdentityUserProfilesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/IdentityUserProfiles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityUserProfile>>> GetIdentityUserProfile()
        {
            return await _context._IdentityUserProfile.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/IdentityUserProfiles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityUserProfile>> GetIdentityUserProfile(int id)
        {
            var identityUserProfile = await _context._IdentityUserProfile.FindAsync(id);

            if (identityUserProfile == null)
            {
                return NotFound();
            }

            return identityUserProfile;
        }

        // PUT: api/IdentityUserProfiles/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIdentityUserProfile(int id, IdentityUserProfile identityUserProfile)
        {
            if (id != identityUserProfile.UserProfileID)
            {
                return BadRequest();
            }

            _context.Entry(identityUserProfile).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IdentityUserProfileExists(id))
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

        // POST: api/IdentityUserProfiles
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<IdentityUserProfile>> PostIdentityUserProfile(IdentityUserProfile identityUserProfile)
        {
            string result = await Operations.opIdentityUserProfile.InsertRecords(identityUserProfile, _context);

            return Ok(result);
           } 
        
        [HttpPost]
        [Route("UpdatePassword")]
        public async Task<ActionResult<IdentityUserProfile>> UpdatePassword(IdentityUserProfile identityUserProfile)
        {
            var result = await Operations.opIdentityUserProfile.UpdateUserPassword(identityUserProfile, _context);

            return Ok(result);
           }

        // DELETE: api/IdentityUserProfiles/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<IdentityUserProfile>> DeleteIdentityUserProfile(int id)
        {
            var identityUserProfile = await _context._IdentityUserProfile.FindAsync(id);
            if (identityUserProfile == null)
            {
                return NotFound();
            }


            identityUserProfile.IsActive = false;
            identityUserProfile.IsDeleted = true;

            _context.Entry(identityUserProfile).State = EntityState.Modified;

            // _context._IdentityUserProfile.Remove(identityUserProfile);
            await _context.SaveChangesAsync();

            return identityUserProfile;
        }

        private bool IdentityUserProfileExists(int id)
        {
            return _context._IdentityUserProfile.Any(e => e.UserProfileID == id);
        }
    }
}
