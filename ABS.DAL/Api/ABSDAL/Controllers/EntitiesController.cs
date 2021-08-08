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
    public class EntitiesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public EntitiesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/Entities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Entities>>> GetEntities(int Userid = 0)
        {
            if (Userid == 0)
            {
                var _contxt = Operations.opEntities.getContext(_context);
                return Ok(await _contxt.Entities
                                    .Where(f => f.IsActive == true && f.IsDeleted == false)
                    .ToListAsync());
            }
            else
            {
                var getlst = await _context._IdentityAppRoleDataEntities
                  .Where(f => f.UserID.UserProfileID == Userid
                  && f.IsActive == true
                  && f.IsDeleted == false)
                  .Select(f => f.EntityID).ToListAsync();
                if (getlst == null  && await Operations.opIdentityAppRoleUsers.isAdminRole (Userid,_context))
                {
                   
                        var _contxt = Operations.opEntities.getContext(_context);
                        return Ok(await _contxt.Entities
                                            .Where(f => f.IsActive == true && f.IsDeleted == false)
                            .ToListAsync());
                   

                }
                //var _contxt = Operations.opDepartments.getContext(_context);

                return Ok(getlst);
            }
        }

        // GET: api/Entities/5
        [HttpGet("{id}")]
        [Route("EntitybyID")]
        public async Task<ActionResult<Entities>> EntitybyID(int id)
        {
            var _contxt = Operations.opEntities.getContext(_context);

            var entities = await _contxt.Entities.FindAsync(id);

            if (entities == null)
            {
                return NotFound();
            }

            return Ok(entities);
        }

        // PUT: api/Entities/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEntities(int id, Entities entities)
        {
            if (id != entities.EntityID)
            {
                return BadRequest();
            }

            _context.Entry(entities).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EntitiesExists(id))
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

        // POST: api/Entities
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Route("PostADSEntities")]
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostEntities([FromBody] System.Text.Json.JsonElement rawText)
        {
            var _contxt = Operations.opEntities.getContext(_context);
            var res = await Operations.opEntities.EntitiesBulkInsert(rawText, _context);
            return Ok(res);
        }

        // POST: api/Departments
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Route("PostADSEntityRelationshipData")]
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostEntityRelationships([FromBody] System.Text.Json.JsonElement rawText)
        {
            var _contxt = Operations.opEntities.getContext(_context);
            var res = await Operations.opEntities.EntityRelationshipsBulkInsert(rawText, _contxt);
            return Ok(res);
        }

        // DELETE: api/Entities/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Entities>> DeleteEntities(int id)
        {
            var entities = await _context.Entities.FindAsync(id);
            if (entities == null)
            {
                return NotFound();
            }

            _context.Entities.Remove(entities);
            await _context.SaveChangesAsync();

            return entities;
        }

        private bool EntitiesExists(int id)
        {
            return _context.Entities.Any(e => e.EntityID == id);
        }
    }
}
