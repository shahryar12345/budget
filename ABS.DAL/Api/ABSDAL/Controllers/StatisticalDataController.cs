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
    public class StatisticalDataController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public StatisticalDataController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/StatisticalDatas
        [HttpGet]
        [Cached(1000)]
        //[ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any, VaryByQueryKeys = new[] { "impactlevel", "pii" })]
        public async Task<ActionResult<IEnumerable<StatisticalData>>> GetStatisticalData()
        {
            var _contxt = Operations.opStatisticalData.getContext(_context);

            var datalist = await _contxt.StatisticalData.Where(f => f.IsActive == true && f.IsDeleted == false)
                .Select(p => new
                {
                    dataid = p.StatisticalDataID
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
                    statisticsid = p.StatisticCode.StatisticsCodeID
                     ,
                    statisticscode = p.StatisticCode.StatisticsCode
                     ,
                    statisticsname = p.StatisticCode.StatisticsCodeName
                      ,
                    glaccountid = p.GlAccoutnID.GLAccountID
                     ,
                    glaccountcode = p.GlAccoutnID.GLAccountCode
                     ,
                    glaccountname = p.GlAccoutnID.GLAccountName
                     ,
                    staffingid = p.StaffingAccountID
                     ,
                    staffingcode = p.StaffingMasterID
                     ,
                    staffingname = p.StaffingAccoutTypeID
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
                    timeperiodid = p.StatisticTimePeriod.TimePeriodID
                     ,
                    startyearid = p.StatisticTimePeriod.FiscalYearID.ItemTypeID
                     ,
                    startyear = p.StatisticTimePeriod.FiscalYearID.ItemTypeDisplayName
                     ,
                    endyearid = p.StatisticTimePeriod.FiscalYearEndID.ItemTypeID
                     ,
                    endyear = p.StatisticTimePeriod.FiscalYearEndID.ItemTypeDisplayName
                     ,
                    startmonthid = p.StatisticTimePeriod.FiscalStartMonthID.ItemTypeID
                     ,
                    startmonth = p.StatisticTimePeriod.FiscalStartMonthID.ItemTypeDisplayName
                     ,
                    endmonthid = p.StatisticTimePeriod.FiscalEndMonthID.ItemTypeID
                     ,
                    endmonth = p.StatisticTimePeriod.FiscalEndMonthID.ItemTypeDisplayName
                     ,
                    fiscalyearid = p.FiscalYearID.ItemTypeID
                     ,
                    fiscalyear = p.FiscalYearID.ItemTypeDisplayName
                     ,
                    fiscalyearmonthid = p.FiscalYearMonthID.ItemTypeID
                     ,
                    fiscalyearmonth = p.FiscalYearMonthID.ItemTypeDisplayName


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

        [Route("GetStatisticalData")]
        [HttpGet]
        [Cached(1000)]
        // [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any, VaryByQueryKeys = new[] { "impactlevel", "pii" })]
        public async Task<ActionResult<IEnumerable<StatisticalData>>> GetStatisticalData(int TImePeriodID, int DataScenarioTypeID)
        {
            var _contxt = Operations.opStatisticalData.getContext(_context);

            var datalist = await _contxt.StatisticalData.Where(f => f.DataScenarioTypeID.ItemTypeID == DataScenarioTypeID && f.StatisticTimePeriod.TimePeriodID == TImePeriodID && f.IsActive == true && f.IsDeleted == false)
                .Select(p => new
                {
                    dataid = p.StatisticalDataID
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
                    statisticsid = p.StatisticCode.StatisticsCodeID
                     ,
                    statisticscode = p.StatisticCode.StatisticsCode
                     ,
                    statisticsname = p.StatisticCode.StatisticsCodeName

                    ,
                    glaccountid = p.GlAccoutnID.GLAccountID
                      ,
                    glaccountcode = p.GlAccoutnID.GLAccountCode
                      ,
                    glaccountname = p.GlAccoutnID.GLAccountName
                      ,
                    staffingid = p.StaffingAccountID
                      ,
                    staffingcode = p.StaffingMasterID
                      ,
                    staffingname = p.StaffingAccoutTypeID

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
                    timeperiodid = p.StatisticTimePeriod.TimePeriodID
                     ,
                    startyearid = p.StatisticTimePeriod.FiscalYearID.ItemTypeID
                     ,
                    startyear = p.StatisticTimePeriod.FiscalYearID.ItemTypeDisplayName
                     ,
                    endyearid = p.StatisticTimePeriod.FiscalYearEndID.ItemTypeID
                     ,
                    endyear = p.StatisticTimePeriod.FiscalYearEndID.ItemTypeDisplayName
                     ,
                    startmonthid = p.StatisticTimePeriod.FiscalStartMonthID.ItemTypeID
                     ,
                    startmonth = p.StatisticTimePeriod.FiscalStartMonthID.ItemTypeDisplayName
                     ,
                    endmonthid = p.StatisticTimePeriod.FiscalEndMonthID.ItemTypeID
                     ,
                    endmonth = p.StatisticTimePeriod.FiscalEndMonthID.ItemTypeDisplayName
                     ,
                    fiscalyearid = p.FiscalYearID.ItemTypeID
                     ,
                    fiscalyear = p.FiscalYearID.ItemTypeDisplayName
                     ,
                    fiscalyearmonthid = p.FiscalYearMonthID.ItemTypeID
                     ,
                    fiscalyearmonth = p.FiscalYearMonthID.ItemTypeDisplayName


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



        [Route("GetADSSourceData")]
        [HttpGet]
        [Cached(1000)]
        // [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any, VaryByQueryKeys = new[] { "impactlevel", "pii" })]
        public async Task<ActionResult<IEnumerable<StatisticalData>>> GetADSSourceData(int TImePeriodID, int DataScenarioTypeID, int? DataScenarioID, string userid = "")
        {
            var datascenario = Operations.opItemTypes.getItemTypeObjbyID(DataScenarioTypeID, _context);
            List<string> Entities = new List<string>();
            List<string> Depts = new List<string>();
            List<string> StCodes = new List<string>();
            List<string> GlAccs = new List<string>();
            List<string> Paytypes = new List<string>();
            List<string> Jobcodes = new List<string>();

            UserAuthenticationModel usermodeldata = new UserAuthenticationModel();
            if (userid != "")
            {
                usermodeldata = await Operations.opAuthentication.UserDetails(userid, _context);
                Entities = usermodeldata.AllRoleEntities.Where(f => f.EntityID != null).Select(f => f.EntityID.EntityID.ToString()).ToList();
                Depts = usermodeldata.AllRoleDepartments.Where(f => f.DepartmentID != null).Select(f => f.DepartmentID.DepartmentID.ToString()).ToList();
                StCodes = usermodeldata.AllRoleStatisticCodes.Where(f => f.StatsCodeID != null).Select(f => f.StatsCodeID.StatisticsCodeID.ToString()).ToList();
                GlAccs = usermodeldata.AllRoleGLAccounts.Where(f => f.GLAccountsID != null).Select(f => f.GLAccountsID.GLAccountID.ToString()).ToList();
                Paytypes = usermodeldata.AllRolePayTypes.Where(f => f.PayTypesID != null).Select(f => f.PayTypesID.PayTypeID.ToString()).ToList();
                Jobcodes = usermodeldata.AllRoleJobCodes.Where(f => f.JobCodesID != null).Select(f => f.JobCodesID.JobCodeID.ToString()).ToList();

            }
            else
            {

            }


            if (datascenario.ItemTypeCode == "ST")
            {
                // var _contxt = Operations.opStatisticalData.getContext(_context);

                var datalist = await _context.StatisticalData.Where(f => f.DataScenarioTypeID.ItemTypeID == DataScenarioTypeID
               && f.StatisticTimePeriod.TimePeriodID == TImePeriodID
               && f.DataScenarioDataID.DataScenarioID == DataScenarioID
               && f.IsActive == true && f.IsDeleted == false).Select(p => new
               {
                   dataid = p.StatisticalDataID
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
                   statisticsid = p.StatisticCode.StatisticsCodeID
                      ,
                   statisticscode = p.StatisticCode.StatisticsCode
                      ,
                   statisticsname = p.StatisticCode.StatisticsCodeName

                     ,
                   glaccountid = p.GlAccoutnID.GLAccountID
                       ,
                   glaccountcode = p.GlAccoutnID.GLAccountCode
                       ,
                   glaccountname = p.GlAccoutnID.GLAccountName
                       ,
                   staffingid = p.StaffingAccountID
                       ,
                   staffingcode = p.StaffingMasterID
                       ,
                   staffingname = p.StaffingAccoutTypeID

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
                   timeperiodid = p.StatisticTimePeriod.TimePeriodID
                      ,
                   startyearid = p.StatisticTimePeriod.FiscalYearID.ItemTypeID
                      ,
                   startyear = p.StatisticTimePeriod.FiscalYearID.ItemTypeDisplayName
                      ,
                   endyearid = p.StatisticTimePeriod.FiscalYearEndID.ItemTypeID
                      ,
                   endyear = p.StatisticTimePeriod.FiscalYearEndID.ItemTypeDisplayName
                      ,
                   startmonthid = p.StatisticTimePeriod.FiscalStartMonthID.ItemTypeID
                      ,
                   startmonth = p.StatisticTimePeriod.FiscalStartMonthID.ItemTypeDisplayName
                      ,
                   endmonthid = p.StatisticTimePeriod.FiscalEndMonthID.ItemTypeID
                      ,
                   endmonth = p.StatisticTimePeriod.FiscalEndMonthID.ItemTypeDisplayName
                      ,
                   fiscalyearid = p.FiscalYearID.ItemTypeID
                      ,
                   fiscalyear = p.FiscalYearID.ItemTypeDisplayName
                      ,
                   fiscalyearmonthid = p.FiscalYearMonthID.ItemTypeID
                      ,
                   fiscalyearmonth = p.FiscalYearMonthID.ItemTypeDisplayName


               })
                    .ToListAsync();


                if (Entities.Count > 0)
                {
                    datalist = datalist.Where(f =>
                    Entities.Contains(f.entityid.ToString()))
                        .ToList();
                }

                if (Depts.Count > 0)
                {
                    datalist = datalist.Where(f =>
                  Depts.Contains(f.departmentid.ToString())
                )
                        .ToList();
                }
                if (StCodes.Count > 0)
                {
                    datalist = datalist.Where(f =>
                    StCodes.Contains(f.statisticsid.ToString())
                ).ToList();
                }




                return Ok(datalist);
            }
            else
                 if (datascenario.ItemTypeCode == "GL")
            {


                //  var _contxt = Operations.opStatisticalData.getContext(_context);

                var datalist = await _context.StatisticalData.Where(f => f.DataScenarioTypeID.ItemTypeID == DataScenarioTypeID
                && f.StatisticTimePeriod.TimePeriodID == TImePeriodID
                && f.DataScenarioDataID.DataScenarioID == DataScenarioID

                && f.IsActive == true && f.IsDeleted == false)
                    .Select(p => new
                    {
                        dataid = p.StatisticalDataID
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
                        statisticsid = p.StatisticCode.StatisticsCodeID
                         ,
                        statisticscode = p.StatisticCode.StatisticsCode
                         ,
                        statisticsname = p.StatisticCode.StatisticsCodeName

                        ,
                        glaccountid = p.GlAccoutnID.GLAccountID
                          ,
                        glaccountcode = p.GlAccoutnID.GLAccountCode
                          ,
                        glaccountname = p.GlAccoutnID.GLAccountName
                          ,
                        staffingid = p.StaffingAccountID
                          ,
                        staffingcode = p.StaffingMasterID
                          ,
                        staffingname = p.StaffingAccoutTypeID

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
                        timeperiodid = p.StatisticTimePeriod.TimePeriodID
                         ,
                        startyearid = p.StatisticTimePeriod.FiscalYearID.ItemTypeID
                         ,
                        startyear = p.StatisticTimePeriod.FiscalYearID.ItemTypeDisplayName
                         ,
                        endyearid = p.StatisticTimePeriod.FiscalYearEndID.ItemTypeID
                         ,
                        endyear = p.StatisticTimePeriod.FiscalYearEndID.ItemTypeDisplayName
                         ,
                        startmonthid = p.StatisticTimePeriod.FiscalStartMonthID.ItemTypeID
                         ,
                        startmonth = p.StatisticTimePeriod.FiscalStartMonthID.ItemTypeDisplayName
                         ,
                        endmonthid = p.StatisticTimePeriod.FiscalEndMonthID.ItemTypeID
                         ,
                        endmonth = p.StatisticTimePeriod.FiscalEndMonthID.ItemTypeDisplayName
                         ,
                        fiscalyearid = p.FiscalYearID.ItemTypeID
                         ,
                        fiscalyear = p.FiscalYearID.ItemTypeDisplayName
                         ,
                        fiscalyearmonthid = p.FiscalYearMonthID.ItemTypeID
                         ,
                        fiscalyearmonth = p.FiscalYearMonthID.ItemTypeDisplayName


                    })
                    .ToListAsync();


                if (Entities.Count > 0)
                {
                    datalist = datalist.Where(f =>
                    Entities.Contains(f.entityid.ToString()))
                        .ToList();
                }

                if (Depts.Count > 0)
                {
                    datalist = datalist.Where(f =>
                  Depts.Contains(f.departmentid.ToString())
                )
                        .ToList();
                }
                if (GlAccs.Count > 0)
                {
                    datalist = datalist.Where(f =>
                    GlAccs.Contains(f.glaccountid.ToString())
                ).ToList();
                }

                return Ok(datalist);
            }
            else
                 if (datascenario.ItemTypeCode == "SF")
            {


                //var _contxt = Operations.opStatisticalData.getSourceDataContext(_context);

                var datalist = await _context.StaffingData.Where(f => f.DataScenarioTypeID.ItemTypeID == DataScenarioTypeID
                && f.DataScenarioID1.DataScenarioID == DataScenarioID
                && f.StaffingTimePeriod.TimePeriodID == TImePeriodID

                && f.IsActive == true
                && f.IsDeleted == false)
                    .Select(p => new
                    {
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
                        paytypeid = p.PayType.PayTypeID
                         ,
                        paytypecode = p.PayType.PayTypeCode
                         ,
                        paytypename = p.PayType.PayTypeName != "" ? p.PayType.PayTypeName : p.PayType.PayTypeDescription

                        ,
                        jobcodeid = p.JobCode.JobCodeID
                          ,
                        jobcodecode = p.JobCode.JobCodeCode
                          ,
                        jobcodename = p.JobCode.JobCodeName
                          ,
                        staffingid = p.StaffingAccountID
                          ,
                        staffingcode = p.StaffingMasterID
                          ,
                        staffingaccounttypeid = p.StaffingAccountTypeID

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

                if (Entities.Count > 0)
                {
                    datalist = datalist.Where(f =>
                    Entities.Contains(f.entityid.ToString()))
                        .ToList();
                }

                if (Depts.Count > 0)
                {
                    datalist = datalist.Where(f =>
                  Depts.Contains(f.departmentid.ToString())
                )
                        .ToList();
                }
                if (Paytypes.Count > 0)
                {
                    datalist = datalist.Where(f =>
                    Paytypes.Contains(f.paytypeid.ToString())
                ).ToList();
                } if (Jobcodes.Count > 0)
                {
                    datalist = datalist.Where(f =>
                    Jobcodes.Contains(f.jobcodeid.ToString())
                ).ToList();
                }


                return Ok(datalist);
            }


            return Ok("No Data Found");
        }


        // GET: api/StatisticalDatas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StatisticalData>> GetStatisticalData(int id)
        {
            var _contxt = Operations.opStatisticalData.getContext(_context);
            var statisticalData = await _contxt.StatisticalData.FindAsync(id);

            if (statisticalData == null)
            {
                return NotFound();
            }

            return Ok(statisticalData);
        }

        // PUT: api/StatisticalDatas/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStatisticalData(int id, StatisticalData statisticalData)
        {
            if (id != statisticalData.StatisticalDataID)
            {
                return BadRequest();
            }

            _context.Entry(statisticalData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StatisticalDataExists(id))
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

        // POST: api/StatisticalDatas
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostEntities([FromBody] System.Text.Json.JsonElement rawText)

        {
            var res = await Operations.opStatisticalData.StatisticsDataBulkInsert(rawText, _context);

            return Ok(res);

            //_context.StatisticalData.Add(statisticalData);
            //await _context.SaveChangesAsync();

            //return CreatedAtAction("GetStatisticalData", new { id = statisticalData.StatisticalDataID }, statisticalData);
        }

        // DELETE: api/StatisticalDatas/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<StatisticalData>> DeleteStatisticalData(int id)
        {
            var statisticalData = await _context.StatisticalData.FindAsync(id);
            if (statisticalData == null)
            {
                return NotFound();
            }

            _context.StatisticalData.Remove(statisticalData);
            await _context.SaveChangesAsync();

            return statisticalData;
        }

        private bool StatisticalDataExists(int id)
        {
            return _context.StatisticalData.Any(e => e.StatisticalDataID == id);
        }
    }
}
