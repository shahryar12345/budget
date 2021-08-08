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
    public class PayTypesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public PayTypesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/PayTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PayTypes>>> GetPayTypes(int Userid = 0)
        {
            if (Userid == 0)
            {


                var _contxt = Operations.opPayTypes.getContext(_context);
                var xdata = await _contxt.PayTypes
                   .Where(n => n.IsActive == true && n.IsDeleted == false)
                   .Select(f => new
                   {
                       payTypeID = f.PayTypeID,
                       payTypeCode = f.PayTypeCode,
                       payTypeName = f.PayTypeName,
                       payTypeDescription = f.PayTypeDescription,
                       lowcode = f.Lowcode,
                       highCode = f.HighCode,
                       isMaster = f.IsMaster,
                       isGroup = f.IsGroup,
                       accumulateHours = f.AccumulateHours,
                       payTypeType = f.PayTypeType,
                       creationDate = f.CreationDate,
                       updatedDate = f.UpdatedDate

                   })
                   .ToListAsync();
                //var _contxt = Operations..getContext(_context);

                return Ok(xdata);
            }
            else
            {
                var getlst = await _context._IdentityAppRoleDataPayTypes
               .Where(f => f.UserID.UserProfileID == Userid
               && f.IsActive == true
               && f.IsDeleted == false)
               .Select(f => f.PayTypesID).Select(f => new
               {
                   payTypeID = f.PayTypeID,
                   payTypeCode = f.PayTypeCode,
                   payTypeName = f.PayTypeName,
                   payTypeDescription = f.PayTypeDescription,
                   lowcode = f.Lowcode,
                   highCode = f.HighCode,
                   isMaster = f.IsMaster,
                   isGroup = f.IsGroup,
                   accumulateHours = f.AccumulateHours,
                   payTypeType = f.PayTypeType,
                   creationDate = f.CreationDate,
                   updatedDate = f.UpdatedDate

               }).ToListAsync();


                if (getlst == null && await Operations.opIdentityAppRoleUsers.isAdminRole(Userid, _context))
                {

                    var _contxt = Operations.opPayTypes.getContext(_context);
                    var xdata = await _contxt.PayTypes
                       .Where(n => n.IsActive == true && n.IsDeleted == false)
                       .Select(f => new
                       {
                           payTypeID = f.PayTypeID,
                           payTypeCode = f.PayTypeCode,
                           payTypeName = f.PayTypeName,
                           payTypeDescription = f.PayTypeDescription,
                           lowcode = f.Lowcode,
                           highCode = f.HighCode,
                           isMaster = f.IsMaster,
                           isGroup = f.IsGroup,
                           accumulateHours = f.AccumulateHours,
                           payTypeType = f.PayTypeType,
                           creationDate = f.CreationDate,
                           updatedDate = f.UpdatedDate

                       })
                       .ToListAsync();
                    //var _contxt = Operations..getContext(_context);

                    return Ok(xdata);

                }
                return Ok(getlst);
            }


            //return Ok(await _contxt.PayTypes.Where(x => x.IsActive == true && x.IsDeleted == false).ToListAsync());
        }

        // GET: api/PayTypes/5
        [HttpGet("{id}")]
        [Route("PayTypesbyID")]

        public async Task<ActionResult<PayTypes>> PayTypesbyID(int id)
        {
            var payTypes = await _context.PayTypes.FindAsync(id);

            if (payTypes == null)
            {
                return NotFound();
            }

            return Ok(payTypes);
        }

        // PUT: api/PayTypes/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayTypes(int id, PayTypes payTypes)
        {
            if (id != payTypes.PayTypeID)
            {
                return BadRequest();
            }

            _context.Entry(payTypes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PayTypesExists(id))
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

        // POST: api/PayTypes
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<PayTypes>> PostPayTypes([FromBody] System.Text.Json.JsonElement rawText)
        {
            {
                var res = await Operations.opPayTypes.PayTypesBulkInsert(rawText, _context);

                return Ok(res);
            }
        }

        // DELETE: api/PayTypes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PayTypes>> DeletePayTypes(int id)
        {
            var payTypes = await _context.PayTypes.FindAsync(id);
            if (payTypes == null)
            {
                return NotFound();
            }

            _context.PayTypes.Remove(payTypes);
            await _context.SaveChangesAsync();

            return payTypes;
        }

        private bool PayTypesExists(int id)
        {
            return _context.PayTypes.Any(e => e.PayTypeID == id);
        }
    }
}
