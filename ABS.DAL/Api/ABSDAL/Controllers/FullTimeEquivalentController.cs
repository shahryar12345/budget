using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABSDAL.Context;
using ABS.DBModels;
using ABSDAL.DataCache;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FullTimeEquivalentController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public FullTimeEquivalentController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/FullTimeEquivalents
        [HttpGet]
        [Cached(1000)]
        //[ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any, VaryByQueryKeys = new[] { "impactlevel", "pii" })]
        public async Task<ActionResult<IEnumerable<FullTimeEquivalent>>> GetFullTimeEquivalent()
        {
            var _contxt = Operations.opFullTimeEquivalent.getContext(_context);

            var datalist = await _contxt.FullTimeEquivalent.Where(f => f.IsActive == true && f.IsDeleted == false)
                .Select (fte => new {
                    dataid = fte.FullTimeEquivalentID
                    ,
                    entityid = fte.Entity.EntityID
                      ,entitycode = fte.Entity.EntityCode
                      ,entityname = fte.Entity.EntityName
                      ,departmentid = fte.Department.DepartmentID
                      ,departmentcode = fte.Department.DepartmentCode
                      ,departmentname = fte.Department.DepartmentName
                      ,jobcodeid = fte.JobCode.JobCodeID
                      ,jobcode = fte.JobCode.JobCodeCode
                      ,jobcodename = fte.JobCode.JobCodeName                      
                      ,january = fte.January
                      ,february = fte.February
                      ,march = fte.March
                      ,april = fte.April
                      ,may = fte.May
                      ,june = fte.June
                      ,july = fte.July
                      ,august = fte.August
                      ,september = fte.September
                      ,october = fte.October
                      ,november = fte.November
                      ,december = fte.December
                      ,timeperiodid = fte.TimePeriod.TimePeriodID
                      ,startyearid = fte.TimePeriod.FiscalYearID.ItemTypeID
                      ,startyear = fte.TimePeriod.FiscalYearID.ItemTypeDisplayName
                      ,endyearid = fte.TimePeriod.FiscalYearEndID.ItemTypeID
                      ,endyear = fte.TimePeriod.FiscalYearEndID.ItemTypeDisplayName
                      ,startmonthid = fte.TimePeriod.FiscalStartMonthID.ItemTypeID
                      ,startmonth = fte.TimePeriod.FiscalStartMonthID.ItemTypeDisplayName
                      ,endmonthid = fte.TimePeriod.FiscalEndMonthID.ItemTypeID
                      ,endmonth = fte.TimePeriod.FiscalEndMonthID.ItemTypeDisplayName
                })
                .ToListAsync();

            return Ok (datalist);
        }

        [Route("GetFullTimeEquivalentByTimePeriod")]
        [HttpGet]
        [Cached(1000)]
        // [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any, VaryByQueryKeys = new[] { "impactlevel", "pii" })]
        public async Task<ActionResult<IEnumerable<FullTimeEquivalent>>> GetFullTimeEquivalentByTimePeriod(int TImePeriodID)
        {
            var _contxt = Operations.opFullTimeEquivalent.getContext(_context);

            var datalist = await _contxt.FullTimeEquivalent.Where( fte => fte.TimePeriod.TimePeriodID == TImePeriodID && fte.IsActive == true && fte.IsDeleted ==false)
                .Select(fte => new {
                    dataid = fte.FullTimeEquivalentID
                    ,
                    entityid = fte.Entity.EntityID
                     ,
                    entitycode = fte.Entity.EntityCode
                     ,
                    entityname = fte.Entity.EntityName
                     ,
                    departmentid = fte.Department.DepartmentID
                     ,
                    departmentcode = fte.Department.DepartmentCode
                     ,
                    departmentname = fte.Department.DepartmentName
                     ,
                    jobcodeid = fte.JobCode.JobCodeID 
                     ,
                    jobcode = fte.JobCode.JobCodeCode
                     ,
                    jobcodename = fte.JobCode.JobCodeName
                    ,
                    january = fte.January
                     ,
                    february = fte.February
                     ,
                    march = fte.March
                     ,
                    april = fte.April
                     ,
                    may = fte.May
                     ,
                    june = fte.June
                     ,
                    july = fte.July
                     ,
                    august = fte.August
                     ,
                    september = fte.September
                     ,
                    october = fte.October
                     ,
                    november = fte.November
                     ,
                    december = fte.December
                     ,
                    timeperiodid = fte.TimePeriod.TimePeriodID
                     ,
                    startyearid = fte.TimePeriod.FiscalYearID.ItemTypeID
                     ,
                    startyear = fte.TimePeriod.FiscalYearID.ItemTypeDisplayName
                     ,
                    endyearid = fte.TimePeriod.FiscalYearEndID.ItemTypeID
                     ,
                    endyear = fte.TimePeriod.FiscalYearEndID.ItemTypeDisplayName
                     ,
                    startmonthid = fte.TimePeriod.FiscalStartMonthID.ItemTypeID
                     ,
                    startmonth = fte.TimePeriod.FiscalStartMonthID.ItemTypeDisplayName
                     ,
                    endmonthid = fte.TimePeriod.FiscalEndMonthID.ItemTypeID
                     ,
                    endmonth = fte.TimePeriod.FiscalEndMonthID.ItemTypeDisplayName

                })
                .ToListAsync();

            return Ok(datalist);
        }

        // GET: api/FullTimeEquivalents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FullTimeEquivalent>> GetFullTimeEquivalent(int id)
        {
            var _contxt = Operations.opFullTimeEquivalent.getContext(_context);
            var FullTimeEquivalent = await _contxt.FullTimeEquivalent.FindAsync(id);

            if (FullTimeEquivalent == null)
            {
                return NotFound();
            }

            return Ok(FullTimeEquivalent);
        }

        // PUT: api/FullTimeEquivalents/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PutFullTimeEquivalent([FromBody] System.Text.Json.JsonElement rawText)
        {
            var _contxt = Operations.opFullTimeEquivalent.getContext(_context);
            var res = await Operations.opFullTimeEquivalent.FTEsBulkInsert(rawText.GetProperty("FTEPUT"), _contxt, "update");
            return Ok(res);
        }

        // POST: api/FullTimeEquivalents
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostFullTimeEquivalent([FromBody] System.Text.Json.JsonElement rawText)
        {
            var _contxt = Operations.opFullTimeEquivalent.getContext(_context);
            var res = await Operations.opFullTimeEquivalent.FTEsBulkInsert(rawText, _contxt, "insert");
            return Ok(res);
        }


        // DELETE: api/FullTimeEquivalents/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FullTimeEquivalent>> DeleteFullTimeEquivalent(int id)
        {
            var FullTimeEquivalent = await _context.FullTimeEquivalent.FindAsync(id);
            if (FullTimeEquivalent == null)
            {
                return NotFound();
            }

            //_context.FullTimeEquivalent.Remove(FullTimeEquivalent);
            FullTimeEquivalent.IsDeleted = true;
            FullTimeEquivalent.IsActive = false;

            _context.Entry(FullTimeEquivalent).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return FullTimeEquivalent;
        }

        private bool FullTimeEquivalentExists(int id)
        {
            return _context.FullTimeEquivalent.Any(e => e.FullTimeEquivalentID == id);
        }
    }
}
