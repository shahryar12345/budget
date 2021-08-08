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
    public class JobCodesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public JobCodesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/JobCodes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobCodes>>> GetJobCodes(int Userid = 0)
        {
            if (Userid == 0)
            {
                var xdata = await _context.JobCodes
                    .Where(n => n.IsActive == true && n.IsDeleted == false)
                    .Select(f => new
                    {
                        jobCodeID = f.JobCodeID,
                        jobCodeCode = f.JobCodeCode,
                        jobCodeName = f.JobCodeName,
                        jobCodeDescription = f.JobCodeDescription,
                        lowcode = f.Lowcode,
                        highCode = f.HighCode,
                        isMaster = f.IsMaster,
                        isGroup = f.IsGroup,
                        jobCodeObjectReferenceID = f.JobCodeObjectReferenceID,
                        comments = f.Comments,
                        creationDate = f.CreationDate,
                        updatedDate = f.UpdatedDate
                    })
                    .ToListAsync();
                //var _contxt = Operations..getContext(_context);

                return Ok(xdata);
            }
            else
            {
                var getlst = await _context._IdentityAppRoleDataJobCodes
              .Where(f => f.UserID.UserProfileID == Userid
              && f.IsActive == true
              && f.IsDeleted == false)
              .Select(f => f.JobCodesID)
              .Select(f => new
              {
                  jobCodeID = f.JobCodeID,
                  jobCodeCode = f.JobCodeCode,
                  jobCodeName = f.JobCodeName,
                  jobCodeDescription = f.JobCodeDescription,
                  lowcode = f.Lowcode,
                  highCode = f.HighCode,
                  isMaster = f.IsMaster,
                  isGroup = f.IsGroup,
                  jobCodeObjectReferenceID = f.JobCodeObjectReferenceID,
                  comments = f.Comments,
                  creationDate = f.CreationDate,
                  updatedDate = f.UpdatedDate
              })
              .ToListAsync();

                if (getlst == null && await Operations.opIdentityAppRoleUsers.isAdminRole(Userid, _context))
                {

                    var xdata = await _context.JobCodes
                    .Where(n => n.IsActive == true && n.IsDeleted == false)
                    .Select(f => new
                    {
                        jobCodeID = f.JobCodeID,
                        jobCodeCode = f.JobCodeCode,
                        jobCodeName = f.JobCodeName,
                        jobCodeDescription = f.JobCodeDescription,
                        lowcode = f.Lowcode,
                        highCode = f.HighCode,
                        isMaster = f.IsMaster,
                        isGroup = f.IsGroup,
                        jobCodeObjectReferenceID = f.JobCodeObjectReferenceID,
                        comments = f.Comments,
                        creationDate = f.CreationDate,
                        updatedDate = f.UpdatedDate
                    })
                    .ToListAsync();
                    //var _contxt = Operations..getContext(_context);

                    return Ok(xdata);

                }

                return Ok(getlst);
            }
        }

        // GET: api/JobCodes/5
        [HttpGet("{id}")]
        [Route("JobCodebyID")]

        public async Task<ActionResult<JobCodes>> JobCodebyID(int id)
        {
            var jobCodes = await _context.JobCodes.FindAsync(id);

            if (jobCodes == null)
            {
                return NotFound();
            }

            return Ok(jobCodes);
        }

        // PUT: api/JobCodes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJobCodes(int id, JobCodes jobCodes)
        {
            if (id != jobCodes.JobCodeID)
            {
                return BadRequest();
            }

            _context.Entry(jobCodes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobCodesExists(id))
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

        // POST: api/JobCodes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<JobCodes>> PostJobCodes([FromBody] System.Text.Json.JsonElement rawText)
        {
            {
                var res = await Operations.opJobCodes.JobCodeBulkInsert(rawText, _context);

                return Ok(res);
            }
        }


        // DELETE: api/JobCodes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<JobCodes>> DeleteJobCodes(int id)
        {
            var jobCodes = await _context.JobCodes.FindAsync(id);
            if (jobCodes == null)
            {
                return NotFound();
            }

            _context.JobCodes.Remove(jobCodes);
            await _context.SaveChangesAsync();

            return jobCodes;
        }

        private bool JobCodesExists(int id)
        {
            return _context.JobCodes.Any(e => e.JobCodeID == id);
        }
    }
}
