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
    public class StaffingDataController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public StaffingDataController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/StaffingDatas
        [HttpGet]
        [Cached(1000)]
        //[ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any, VaryByQueryKeys = new[] { "impactlevel", "pii" })]
        public async Task<ActionResult<IEnumerable<StaffingData>>> GetStaffingData()
        {
            var _contxt = Operations.opStaffingData.getContext(_context);

            var datalist = await _contxt.StaffingData.Where(f => f.IsActive == true && f.IsDeleted == false)
                .Select (p => new {
                    dataid = p.StaffingDataID
                    ,
                    entityid = p.Entity.EntityID
                      ,entitycode = p.Entity.EntityCode
                      ,entityname = p.Entity.EntityName
                      ,departmentid = p.Department.DepartmentID
                      ,departmentcode = p.Department.DepartmentCode
                      ,departmentname = p.Department.DepartmentName
                      ,jobcodeid = p.JobCode.JobCodeID
                      ,jobcode = p.JobCode.JobCodeCode
                      ,jobcodename = p.JobCode.JobCodeName                      
                      ,paytypeid = p.PayType.PayTypeID
                      ,paytypecode = p.PayType.PayTypeCode
                      ,paytypename = p.PayType.PayTypeName
                      ,staffingid = p.StaffingAccountID
                      ,staffingcode = p.StaffingMasterID
                      ,staffingname = p.StaffingAccountTypeID
                      ,january = p.January
                      ,february = p.February
                      ,march = p.March
                      ,april = p.April
                      ,may = p.May
                      ,june = p.June
                      ,july = p.July
                      ,august = p.August
                      ,september = p.September
                      ,october = p.October
                      ,november = p.November
                      ,december = p.December
                      ,scenariotypeID = p.DataScenarioTypeID.ItemTypeID
                      ,scenariotype = p.DataScenarioTypeID.ItemTypeDisplayName
                      ,timeperiodid = p.StaffingTimePeriod.TimePeriodID
                      ,startyearid = p.StaffingTimePeriod.FiscalYearID.ItemTypeID
                      ,startyear = p.StaffingTimePeriod.FiscalYearID.ItemTypeDisplayName
                      ,endyearid = p.StaffingTimePeriod.FiscalYearEndID.ItemTypeID
                      ,endyear = p.StaffingTimePeriod.FiscalYearEndID.ItemTypeDisplayName
                      ,startmonthid = p.StaffingTimePeriod.FiscalStartMonthID.ItemTypeID
                      ,startmonth = p.StaffingTimePeriod.FiscalStartMonthID.ItemTypeDisplayName
                      ,endmonthid = p.StaffingTimePeriod.FiscalEndMonthID.ItemTypeID
                      ,endmonth = p.StaffingTimePeriod.FiscalEndMonthID.ItemTypeDisplayName
                      ,fiscalyearid = p.FiscalYear.ItemTypeID
                      ,fiscalyear = p.FiscalYear.ItemTypeDisplayName
                      ,fiscalyearmonthid = p.FiscalMonth.ItemTypeID
                      ,fiscalyearmonth = p.FiscalMonth.ItemTypeDisplayName


                })
                .ToListAsync();
            //var groupby = datalist.GroupBy(g => new { g.Entity, g.Department, g.StatisticCode })
            //    .Select( p => new { 
            //        entitycode = p.Key.Entity.EntityCode
            //        ,entityname = p.Key.Entity.EntityName
            //        , departmentcode =  p.Key.Department.DepartmentCode
            //        , departmentname =  p.Key.Department.DepartmentName
            //        , statisticscode = p.Key.StatisticCode.StatisticsCode
            //        , statisticscodename = p.Key.StatisticCode.StatisticsCodeName
            //        , data = p.Select(x => x.FiscalYearMonthID.ItemTypeDisplayName + ":" + x.Value)
            //       // , data = p.Select(x => "fiscalYear:" +x.FiscalYearID.ItemTypeDisplayName + ",fiscalMonth:" +  x.FiscalYearMonthID.ItemTypeDisplayName + ",value:" + x.Value)
                    
            //    }               
            //    ).ToList();
            


            return Ok (datalist);
        }

        [Route("GetStaffingData")]
        [HttpGet]
        [Cached(1000)]
        // [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any, VaryByQueryKeys = new[] { "impactlevel", "pii" })]
        public async Task<ActionResult<IEnumerable<StaffingData>>> GetStaffingData(int TImePeriodID, int DataScenarioTypeID)
        {
            var _contxt = Operations.opStaffingData.getContext(_context);

            var datalist = await _contxt.StaffingData.Where( f => f.DataScenarioTypeID.ItemTypeID == DataScenarioTypeID && f.StaffingTimePeriod.TimePeriodID == TImePeriodID && f.IsActive == true && f.IsDeleted ==false)
                .Select(p => new {
                    dataid = p.StaffingDataID
                    ,
                    entityid = p.Entity.EntityID
                     ,
                    entitycode = p.Entity.EntityCode
                     ,
                    entityname = p.Entity.EntityName
                     ,
                    departmentid = p.Department.DepartmentID
                     ,
                    departmentcode = p.Department.DepartmentCode
                     ,
                    departmentname = p.Department.DepartmentName
                     ,
                    jobcodeid = p.JobCode.JobCodeID 
                     ,
                    jobcode = p.JobCode.JobCodeCode
                     ,
                    jobcodename = p.JobCode.JobCodeName
                     ,
                    paytypeid = p.PayType.PayTypeID
                     ,
                    paytypecode = p.PayType.PayTypeCode
                     ,
                    paytypename = p.PayType.PayTypeName
                    ,
                    staffingid = p.StaffingAccountID
                      ,
                    staffingcode = p.StaffingMasterID
                      ,
                    staffingname = p.StaffingAccountTypeID
                    ,
                    january = p.January
                     ,
                    february = p.February
                     ,
                    march = p.March
                     ,
                    april = p.April
                     ,
                    may = p.May
                     ,
                    june = p.June
                     ,
                    july = p.July
                     ,
                    august = p.August
                     ,
                    september = p.September
                     ,
                    october = p.October
                     ,
                    november = p.November
                     ,
                    december = p.December
                     ,
                    scenariotypeID = p.DataScenarioTypeID.ItemTypeID
                     ,
                    scenariotype = p.DataScenarioTypeID.ItemTypeDisplayName
                     ,
                    timeperiodid = p.StaffingTimePeriod.TimePeriodID
                     ,
                    startyearid = p.StaffingTimePeriod.FiscalYearID.ItemTypeID
                     ,
                    startyear = p.StaffingTimePeriod.FiscalYearID.ItemTypeDisplayName
                     ,
                    endyearid = p.StaffingTimePeriod.FiscalYearEndID.ItemTypeID
                     ,
                    endyear = p.StaffingTimePeriod.FiscalYearEndID.ItemTypeDisplayName
                     ,
                    startmonthid = p.StaffingTimePeriod.FiscalStartMonthID.ItemTypeID
                     ,
                    startmonth = p.StaffingTimePeriod.FiscalStartMonthID.ItemTypeDisplayName
                     ,
                    endmonthid = p.StaffingTimePeriod.FiscalEndMonthID.ItemTypeID
                     ,
                    endmonth = p.StaffingTimePeriod.FiscalEndMonthID.ItemTypeDisplayName
                     ,
                    fiscalyearid = p.FiscalYear.ItemTypeID
                     ,
                    fiscalyear = p.FiscalYear.ItemTypeDisplayName
                     ,
                    fiscalyearmonthid = p.FiscalMonth.ItemTypeID
                     ,
                    fiscalyearmonth = p.FiscalMonth.ItemTypeDisplayName


                })
                .ToListAsync();
            //var groupby = datalist.GroupBy(g => new { g.Entity, g.Department, g.StatisticCode })
            //    .Select( p => new { 
            //        entitycode = p.Key.Entity.EntityCode
            //        ,entityname = p.Key.Entity.EntityName
            //        , departmentcode =  p.Key.Department.DepartmentCode
            //        , departmentname =  p.Key.Department.DepartmentName
            //        , statisticscode = p.Key.StatisticCode.StatisticsCode
            //        , statisticscodename = p.Key.StatisticCode.StatisticsCodeName
            //        , data = p.Select(x => x.FiscalYearMonthID.ItemTypeDisplayName + ":" + x.Value)
            //       // , data = p.Select(x => "fiscalYear:" +x.FiscalYearID.ItemTypeDisplayName + ",fiscalMonth:" +  x.FiscalYearMonthID.ItemTypeDisplayName + ",value:" + x.Value)

            //    }               
            //    ).ToList();



            return Ok(datalist);
        }

        // GET: api/StaffingDatas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffingData>> GetStaffingData(int id)
        {
            var _contxt = Operations.opStaffingData.getContext(_context);
            var StaffingData = await _contxt.StaffingData.FindAsync(id);

            if (StaffingData == null)
            {
                return NotFound();
            }

            return Ok(StaffingData);
        }

        // PUT: api/StaffingDatas/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStaffingData(int id, StaffingData StaffingData)
        {
            if (id != StaffingData.StaffingDataID)
            {
                return BadRequest();
            }

            _context.Entry(StaffingData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffingDataExists(id))
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

        // POST: api/StaffingDatas
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostStaffingData([FromBody] System.Text.Json.JsonElement rawText)

        {
           // var res = await Operations.opStaffingData.StaffingDataBulkInsert(rawText, _context);
            var res = await Operations.opStaffingData.CombinedStaffingDataBulkInsert(rawText, _context);

            return Ok(res);

            //_context.StaffingData.Add(StaffingData);
            //await _context.SaveChangesAsync();

            //return CreatedAtAction("GetStaffingData", new { id = StaffingData.StaffingDataID }, StaffingData);
        }

        // DELETE: api/StaffingDatas/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<StaffingData>> DeleteStaffingData(int id)
        {
            var StaffingData = await _context.StaffingData.FindAsync(id);
            if (StaffingData == null)
            {
                return NotFound();
            }

            _context.StaffingData.Remove(StaffingData);
            await _context.SaveChangesAsync();

            return StaffingData;
        }

        private bool StaffingDataExists(int id)
        {
            return _context.StaffingData.Any(e => e.StaffingDataID == id);
        }
    }
}
