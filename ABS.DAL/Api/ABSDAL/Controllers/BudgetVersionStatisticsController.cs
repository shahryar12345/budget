using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABSDAL.Context;
using ABS.DBModels;
using ABSDAL.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetVersionStatisticsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IBackgroundTaskQueue Queue { get; }
        public IServiceScopeFactory ServiceScopeFactory { get; }
        public BudgetVersionStatisticsController(BudgetingContext context, IBackgroundTaskQueue queue, IServiceScopeFactory serviceScopeFactory)
        {
            _context = context;
            Queue = queue;
            ServiceScopeFactory = serviceScopeFactory;

        }

        // GET: api/BudgetVersionStatistics
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetVersionStatistics>>> GetBudgetVersionStatistics()
        {

          //  var _contxt = Operations.opBudgetVersionStatistics.getContext(_context);

            var datalist = await _context.BudgetVersionStatistics.Where(f => f.IsActive == true && f.IsDeleted == false)
                .Select(p => new {
                    dataid = p.StatisticID
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
                    statisticsid = p.StatisticsCodes.StatisticsCodeID
                     ,
                    statisticscode = p.StatisticsCodes.StatisticsCode
                     ,
                    statisticsname = p.StatisticsCodes.StatisticsCodeName
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
                    startyearid = p.TimePeriodID.FiscalYearID.ItemTypeID
                      ,
                    startyear = p.TimePeriodID.FiscalYearID.ItemTypeDisplayName
                      ,
                    endyearid = p.TimePeriodID.FiscalYearEndID.ItemTypeID
                      ,
                    endyear = p.TimePeriodID.FiscalYearEndID.ItemTypeDisplayName
                      ,
                    startmonthid = p.TimePeriodID.FiscalStartMonthID.ItemTypeID
                      ,
                    startmonth = p.TimePeriodID.FiscalStartMonthID.ItemTypeDisplayName
                      ,
                    endmonthid = p.TimePeriodID.FiscalEndMonthID.ItemTypeID
                      ,
                    endmonth = p.TimePeriodID.FiscalEndMonthID.ItemTypeDisplayName
                    ,
                    datascenarioid = p.DataScenarioDataID.DataScenarioID
                    ,
                    datascenariocode = p.DataScenarioDataID.DataScenarioCode
                     ,
                    datascenarioname = p.DataScenarioDataID.DataScenarioName


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

        [Route("GetBudgetVersionsData")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetVersionStatistics>>> GetBudgetVersionsData(int budgetVersionID, string userID = "")
        {

            // var _contxt = Operations.opBudgetVersionStatistics.getContext(_context);

            var subaccountList = await _context._SubAccountsDimensions
                .Include(f=>f.BudgetVersion)
                .Include(f=>f.DataScenarioTypeID)
                .Where(f => 
                        f.BudgetVersion.BudgetVersionID == budgetVersionID
                        && f.DataScenarioTypeID.ItemTypeCode == "ST"
                        && f.IsActive == true
                        && f.IsDeleted == false)
                .ToListAsync();


            var datalist = await _context.BudgetVersionStatistics.Where(f => f.BudgetVersion.BudgetVersionID == budgetVersionID && f.IsActive == true && f.IsDeleted == false)
                .Select(p => new {
                    dataid = p.StatisticID
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
                    statisticsid = p.StatisticsCodes.StatisticsCodeID
                     ,
                    statisticscode = p.StatisticsCodes.StatisticsCode
                     ,
                    statisticsname = p.StatisticsCodes.StatisticsCodeName
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
                    startyearid = p.TimePeriodID.FiscalYearID.ItemTypeID
                      ,
                    startyear = p.TimePeriodID.FiscalYearID.ItemTypeDisplayName
                      ,
                    endyearid = p.TimePeriodID.FiscalYearEndID.ItemTypeID
                      ,
                    endyear = p.TimePeriodID.FiscalYearEndID.ItemTypeDisplayName
                      ,
                    startmonthid = p.TimePeriodID.FiscalStartMonthID.ItemTypeID
                      ,
                    startmonth = p.TimePeriodID.FiscalStartMonthID.ItemTypeDisplayName
                      ,
                    endmonthid = p.TimePeriodID.FiscalEndMonthID.ItemTypeID
                      ,
                    endmonth = p.TimePeriodID.FiscalEndMonthID.ItemTypeDisplayName
                    ,
                    datascenarioid = p.DataScenarioDataID.DataScenarioID
                    ,
                    datascenariocode = p.DataScenarioDataID.DataScenarioCode
                     ,
                    datascenarioname = p.DataScenarioDataID.DataScenarioName
                    ,
                    isSubAccExist =   Operations.opSubaccounts.getSubAccountExists(subaccountList, p.StatisticID)

                })
                .ToListAsync();
           

            List<string> Entities = new List<string>();
            List<string> Depts = new List<string>();
            List<string> StCodes = new List<string>();
           
            UserAuthenticationModel usermodeldata = new UserAuthenticationModel();
            if (userID != "")
            {
                usermodeldata = await Operations.opAuthentication.UserDetails(userID, _context);
                Entities = usermodeldata.AllRoleEntities.Where(f => f.EntityID != null).Select(f => f.EntityID.EntityID.ToString()).ToList();
                Depts = usermodeldata.AllRoleDepartments.Where(f => f.DepartmentID != null).Select(f => f.DepartmentID.DepartmentID.ToString()).ToList();
                StCodes = usermodeldata.AllRoleStatisticCodes.Where(f => f.StatsCodeID != null).Select(f =>  f.StatsCodeID.StatisticsCodeID.ToString()).ToList();
              
            }
            else
            {

            }
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

      
        [Route("GetBudgetVersionsStatisticalData")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetVersionStatistics>>> GetBudgetVersionsStatisticalData(int TimeperiodID, int DataScenarioID)
        {

           // var _contxt = Operations.opBudgetVersionStatistics.getContext(_context);

            var datalist = await _context.BudgetVersionStatistics.Where(f => f.TimePeriodID.TimePeriodID == TimeperiodID && f.DataScenarioTypeID.ItemTypeID == DataScenarioID && f.IsActive == true && f.IsDeleted == false)
                .Select(p => new {
                    dataid = p.StatisticID
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
                    statisticsid = p.StatisticsCodes.StatisticsCodeID
                     ,
                    statisticscode = p.StatisticsCodes.StatisticsCode
                     ,
                    statisticsname = p.StatisticsCodes.StatisticsCodeName
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
                    startyearid = p.TimePeriodID.FiscalYearID.ItemTypeID
                      ,
                    startyear = p.TimePeriodID.FiscalYearID.ItemTypeDisplayName
                      ,
                    endyearid = p.TimePeriodID.FiscalYearEndID.ItemTypeID
                      ,
                    endyear = p.TimePeriodID.FiscalYearEndID.ItemTypeDisplayName
                      ,
                    startmonthid = p.TimePeriodID.FiscalStartMonthID.ItemTypeID
                      ,
                    startmonth = p.TimePeriodID.FiscalStartMonthID.ItemTypeDisplayName
                      ,
                    endmonthid = p.TimePeriodID.FiscalEndMonthID.ItemTypeID
                      ,
                    endmonth = p.TimePeriodID.FiscalEndMonthID.ItemTypeDisplayName
                    ,
                    datascenarioid = p.DataScenarioDataID.DataScenarioID
                    ,
                    datascenariocode = p.DataScenarioDataID.DataScenarioCode
                     ,
                    datascenarioname = p.DataScenarioDataID.DataScenarioName


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

        // GET: api/BudgetVersionStatistics/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BudgetVersionStatistics>> GetBudgetVersionStatistics(int id)
        {
            var _contxt = Operations.opBudgetVersionStatistics.getContext(_context);
            var budgetVersionStatistics = await _contxt.BudgetVersionStatistics.FindAsync(id);

            if (budgetVersionStatistics == null)
            {
                return NotFound();
            }

            return budgetVersionStatistics;
        }

        // PUT: api/BudgetVersionStatistics/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ActionResult<BudgetVersionStatistics>> PutBudgetVersionStatistics([FromBody] System.Text.Json.JsonElement rawText)

        {

            var UPdateBVST = await Operations.opBudgetVersionStatistics.UpdateBudgetVersionsStatistics(rawText, _context);

             Queue.QueueBackgroundWorkItem(async bg =>
            {
                Console.WriteLine("ITEM QUEUED PROCESS IT!!");

                await   Operations.opBudgetVersionStatistics.UPdateAssociatedSTValues(UPdateBVST.payload, ServiceScopeFactory);

            });


            return Ok(UPdateBVST);

            //    if (id != budgetVersionStatistics.StatisticID)
            //    {
            //        return BadRequest();
            //    }

            //    _context.Entry(budgetVersionStatistics).State = EntityState.Modified;

            //    try
            //    {
            //        await _context.SaveChangesAsync();
            //    }
            //    catch (DbUpdateConcurrencyException)
            //    {
            //        if (!BudgetVersionStatisticsExists(id))
            //        {
            //            return NotFound();
            //        }
            //        else
            //        {
            //            throw;
            //        }
            //    }

            //    return NoContent();
        }

        // POST: api/BudgetVersionStatistics
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
       // public async Task<ActionResult<BudgetVersionStatistics>> PostBudgetVersionStatistics(List< BudgetVersionStatistics> budgetVersionStatistics)
        public async Task<ActionResult<BudgetVersionStatistics>> PostBudgetVersionStatistics([FromBody] System.Text.Json.JsonElement  rawText)
        {
            RequestValidationProcess<BudgetVersionStatistics> ValidationProcess = new RequestValidationProcess<BudgetVersionStatistics>(_context, Queue);

            var response = await ValidationProcess.JSONValidationProcess(rawText, false);
            Guid bgguid = Guid.NewGuid();
            await Operations.opBGJobs.InsertBGJob("SaveBudgetVersionStatistics_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Guid.Empty.ToString(), bgguid, bgguid.ToString(), _context);
            response.message += response.message + Environment.NewLine + "Background Job started with ID: " + bgguid.ToString();

            Queue.QueueBackgroundWorkItem(async bg =>
            {
                Console.WriteLine("ITEM QUEUED PROCESS IT!!");

                DBProcess<BudgetVersionStatistics> dBProcess = new DBProcess<BudgetVersionStatistics>(Queue, ServiceScopeFactory);
                // dBProcess.RunBGJob();
                dBProcess.Jobguid = bgguid.ToString();

                await dBProcess.ProcessDBObjects(rawText, true);
                //   await RunDBProcess(false, _context);
            });
            return Ok(response);
            //return  Ok(await Operations.opBudgetVersionStatistics.AddBudgetVersionsStatistics(rawText, _context));

            // return CreatedAtAction("GetBudgetVersionStatistics", new { id = budgetVersionStatistics.StatisticID }, budgetVersionStatistics);
        }


        //[HttpPost]
        //public async Task<ActionResultABS.DBModels..APIResponse>> BudgetVersionStatistics([FromBody] System.Text.Json.JsonElement rawText)
        //{
        //    return await Operations.opBudgetVersions.ProcessBudgetVersionsAsync(rawText, _context);

        //    //if (await Operations.opBudgetVersions.UpdateBudgetVersionsAsync(rawText, _context))
        //    //{
        //    //    return rawText.ToString();
        //    //}
        //    //else
        //    //{
        //    //    return "Operation Failed!!!";
        //    //}
        //}


        // DELETE: api/BudgetVersionStatistics/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<BudgetVersionStatistics>> DeleteBudgetVersionStatistics(int id)
        {
            var budgetVersionStatistics = await _context.BudgetVersionStatistics.FindAsync(id);
            if (budgetVersionStatistics == null)
            {
                return NotFound();
            }

            _context.BudgetVersionStatistics.Remove(budgetVersionStatistics);
            await _context.SaveChangesAsync();

            return budgetVersionStatistics;
        }

        [Route("Delete")]
        [HttpPut]
        public void BulkDeleteBudgetVersionStatistics([FromBody] List<int> ids)
        {
            IQueryable<BudgetVersionStatistics> budgetVersionStatsData = _context.BudgetVersionStatistics.Where(bvs => ids.Contains(bvs.StatisticID));
            foreach (var bvStats in budgetVersionStatsData)
            {
                bvStats.IsDeleted = true;
                bvStats.IsActive = false;
            }
            _context.SaveChanges();
        }

        private bool BudgetVersionStatisticsExists(int id)
        {
            return _context.BudgetVersionStatistics.Any(e => e.StatisticID == id);
        }
    }
}
