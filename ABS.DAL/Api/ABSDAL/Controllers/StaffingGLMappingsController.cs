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
    public class StaffingGLMappingsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public StaffingGLMappingsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/StaffingGLMappings
        [HttpGet]
        [Cached(1000)]
        public async Task<ActionResult<IEnumerable<StaffingGLMappings>>> GetStaffingGLMappings()
        {
            var cntxt = Operations.opStaffingGLMapping.getStaffingGLMappingContext(_context);

            return await cntxt.StaffingGLMappings.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/StaffingGLMappings/5
        [HttpGet("{id}")]
        [Cached(1000)]
        public async Task<ActionResult<StaffingGLMappings>> GetStaffingGLMappings(int id)
        {

            var cntxt = Operations.opStaffingGLMapping.getStaffingGLMappingContext(_context);

            var StaffingGLMappings = await cntxt.StaffingGLMappings.FindAsync(id);

            if (StaffingGLMappings == null)
            {
                return NotFound();
            }

            return StaffingGLMappings;
        }

        [HttpGet]
        [Route("GetEntityMappings")]
        [Cached(1000)]
        public async Task<List<StaffingGLMappings>> GetEntityMapping(int EntityID)
        {
            var cntxt = Operations.opStaffingGLMapping.getStaffingGLMappingContext(_context);

            var StaffingGLMappings = await cntxt.StaffingGLMappings.Where (x => x.Entity.EntityID == EntityID).ToListAsync();

            if (StaffingGLMappings == null)
            {
                return null;
            }

            return StaffingGLMappings;
        }


        [HttpGet]
        [Route("GetDepartmentMappings")]
        [Cached(1000)]
        public async Task<List<StaffingGLMappings>> GetDepartmentMappings(int DepartmentID)
        {
            var cntxt = Operations.opStaffingGLMapping.getStaffingGLMappingContext(_context);

            var StaffingGLMappings = await cntxt.StaffingGLMappings.Where(x => x.Department.DepartmentID == DepartmentID).ToListAsync();

            if (StaffingGLMappings == null)
            {
                return null;
            }

            return StaffingGLMappings;
        }

         [HttpGet]
        [Route("GetEntityDepartmentMappings")]
        [Cached(1000)]
        public async Task<List<StaffingGLMappings>> GetEntityDepartmentMappings(int EntityID, int DepartmentID)
        {
            var cntxt = Operations.opStaffingGLMapping.getStaffingGLMappingContext(_context);

            var StaffingGLMappings = await cntxt.StaffingGLMappings.Where(x => x.Entity.EntityID == EntityID && x.Department.DepartmentID == DepartmentID).ToListAsync();

            if (StaffingGLMappings == null)
            {
                return null;
            }

            return StaffingGLMappings;
        }





        // PUT: api/StaffingGLMappings/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaffingGLMappings(int id, StaffingGLMappings StaffingGLMappings)
        {
            if (id != StaffingGLMappings.StaffingGLMappingID)
            {
                return BadRequest();
            }

            _context.Entry(StaffingGLMappings).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffingGLMappingsExists(id))
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

        // POST: api/StaffingGLMappings
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<FullTimeEquivalent>> PostStaffingGLMappings(int EntityID, int DepartmentID, int JobCodeID, int PayTypeID, int GLAccountID, int Index)
        {

            StaffingGLMappings StaffingGLMapping = _context.StaffingGLMappings.Where(sgl => sgl.Department.DepartmentID == DepartmentID && sgl.Entity.EntityID == EntityID 
                                                                                     && sgl.JobCode.JobCodeID == JobCodeID && sgl.PayType.PayTypeID == PayTypeID 
                                                                                     && sgl.GLAccount.GLAccountID == GLAccountID).FirstOrDefault();

            if (StaffingGLMapping == null)
            {

                Departments Dept = _context.Departments.Where(d => d.DepartmentID == DepartmentID).FirstOrDefault();
                Entities Entity = _context.Entities.Where(e => e.EntityID == EntityID).FirstOrDefault();
                JobCodes JobCode = _context.JobCodes.Where(jc => jc.JobCodeID == JobCodeID).FirstOrDefault();
                PayTypes PayType = _context.PayTypes.Where(pt => pt.PayTypeID == PayTypeID).FirstOrDefault();
                GLAccounts GLAccount = _context.GLAccounts.Where(ga => ga.GLAccountID == GLAccountID).FirstOrDefault();

                StaffingGLMapping = new StaffingGLMappings();

                StaffingGLMapping.Entity = Entity;
                StaffingGLMapping.Department = Dept;
                StaffingGLMapping.JobCode = JobCode;
                StaffingGLMapping.PayType = PayType;
                StaffingGLMapping.GLAccount = GLAccount;
                StaffingGLMapping.Index = Index;
                StaffingGLMapping.Identifier = Guid.NewGuid();
                StaffingGLMapping.CreationDate = DateTime.UtcNow;
                StaffingGLMapping.UpdatedDate = DateTime.UtcNow;
                StaffingGLMapping.IsActive = true;
                StaffingGLMapping.IsDeleted = false;


                _context.StaffingGLMappings.Add(StaffingGLMapping);
            } else
            {
                StaffingGLMapping.Index = Index;
                _context.Entry(StaffingGLMapping).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStaffingGLMappings", new { id = StaffingGLMapping.StaffingGLMappingID }, StaffingGLMapping);
        }  

        // DELETE: api/StaffingGLMappings/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<StaffingGLMappings>> DeleteStaffingGLMappings(int id)
        {
            var StaffingGLMappings = await _context.StaffingGLMappings.FindAsync(id);
            if (StaffingGLMappings == null)
            {
                return NotFound();
            }

            _context.StaffingGLMappings.Remove(StaffingGLMappings);
            await _context.SaveChangesAsync();

            return StaffingGLMappings;
        }

        private bool StaffingGLMappingsExists(int id)
        {
            return _context.StaffingGLMappings.Any(e => e.StaffingGLMappingID == id);
        }
    }
}
