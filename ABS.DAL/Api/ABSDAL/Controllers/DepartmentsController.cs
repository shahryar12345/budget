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
    public class DepartmentsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public DepartmentsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/Departments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Departments>>> GetDepartments(int Userid = 0)
        {
            if (Userid == 0)
            {
                var _contxt = Operations.opDepartments.getContext(_context);

                return Ok(await _contxt.Departments.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync());
            }
            else
            {
                var getlstDept = await _context._IdentityAppRoleDataDepartments
                    .Where(f => f.UserID.UserProfileID == Userid
                    && f.IsActive == true
                    && f.IsDeleted == false)
                    .Select(f => f.DepartmentID).ToListAsync();


                if (getlstDept == null && await Operations.opIdentityAppRoleUsers.isAdminRole(Userid, _context))
                {

                    var _contxt = Operations.opDepartments.getContext(_context);

                    return Ok(await _contxt.Departments.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync());


                }
                //var _contxt = Operations.opDepartments.getContext(_context);

                return Ok(getlstDept);

            }
        }

        // GET: api/Departments/5
        [HttpGet("{id}")]
        [Route("DepartmentbyID")]
        public async Task<ActionResult<Departments>> DepartmentbyID(int id)
        {
            var departments = await _context.Departments.FindAsync(id);

            if (departments == null)
            {
                return NotFound();
            }

            return Ok(departments);
        }
        [Route("GetAllDepartmentMasters")]
        [HttpGet]
        public async Task<ActionResult<Departments>> GetDepartmentMasters()
        {
            var _contxt = Operations.opDepartments.getContext(_context);


            var departments = await _contxt.Departments.Where(a => a.IsMaster == true).ToListAsync();


            if (departments == null)
            {
                return NotFound();
            }

            return Ok(departments);
        }
        [Route("GetDepartmentbyCode")]
        [HttpGet]
        public async Task<ActionResult<Departments>> GetDepartmentbyCode(string deptCOde)
        {
            var _contxt = Operations.opDepartments.getContext(_context);


            var departments = await _contxt.Departments.Where(a => a.DepartmentCode == deptCOde).ToListAsync();


            if (departments == null)
            {
                return NotFound();
            }

            return Ok(departments);
        }

        [Route("GetDepartmentMasterbyCode")]
        [HttpGet]
        public async Task<ActionResult<Departments>> GetDepartmentMasterbyCode(string deptCOde)
        {
            var _contxt = Operations.opDepartments.getContext(_context);


            var departments = await _contxt.Departments.Where(a => a.DepartmentCode == deptCOde && a.IsMaster == true).ToListAsync();


            if (departments == null)
            {
                return NotFound();
            }

            return Ok(departments);
        }

        // PUT: api/Departments/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartments(int id, Departments departments)
        {
            if (id != departments.DepartmentID)
            {
                return BadRequest();
            }

            _context.Entry(departments).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentsExists(id))
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

        // POST: api/Departments
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Route("PostADSDepartmentData")]
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostDepartments([FromBody] System.Text.Json.JsonElement rawText)
        {
            var _contxt = Operations.opDepartments.getContext(_context);
            var res = await Operations.opDepartments.DeptsBulkInsert(rawText, _contxt);
            return Ok(res);
        }

        // POST: api/Departments
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Route("PostADSDepartmentRelationshipData")]
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostDepartmentRelationships([FromBody] System.Text.Json.JsonElement rawText)
        {
            var _contxt = Operations.opDepartments.getContext(_context);
            var res = await Operations.opDepartments.DeptRelationshipsBulkInsert(rawText, _contxt);
            return Ok(res);
        }

        // DELETE: api/Departments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Departments>> DeleteDepartments(int id)
        {
            var departments = await _context.Departments.FindAsync(id);
            if (departments == null)
            {
                return NotFound();
            }

            _context.Departments.Remove(departments);
            await _context.SaveChangesAsync();

            return departments;
        }

        private bool DepartmentsExists(int id)
        {
            return _context.Departments.Any(e => e.DepartmentID == id);
        }
    }
}
