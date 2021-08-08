using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABSDAL.Context;
using ABS.DBModels;
using System.Reflection;
using ABSDAL.Services;
using Microsoft.Extensions.DependencyInjection;
using Hangfire;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetVersionStaffingController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IBackgroundTaskQueue Queue { get; }
        public IServiceScopeFactory ServiceScopeFactory { get; }

        public BudgetVersionStaffingController(BudgetingContext context, IBackgroundTaskQueue queue, IServiceScopeFactory serviceScopeFactory)
        {
            _context = context;
            Queue = queue;
            ServiceScopeFactory = serviceScopeFactory;
        }

        // GET: api/BudgetVersionStaffing
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetVersionStaffing>>> GetBudgetVersionStaffing()
        {

          //  var _contxt = Operations.opBudgetVersionStaffing.getContext(_context);

            var datalist = await _context.BudgetVersionStaffing.Where(f => f.IsActive == true && f.IsDeleted == false)
                .Select(p => new {
                    dataid = p.BudgetVersionStaffingID
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
                    paytypename = p.PayType.PayTypeType
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
                    staffingdatatypeID = p.StaffingDataType.ItemTypeID
                     ,
                    staffingdatatype = p.StaffingDataType.ItemTypeDisplayName
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
                    datascenarioid = p.DataScenarioID.DataScenarioID
                    ,
                    datascenariocode = p.DataScenarioID.DataScenarioCode
                     ,
                    datascenarioname = p.DataScenarioID.DataScenarioName


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
        public async Task<ActionResult<IEnumerable<BudgetVersionStaffing>>> GetBudgetVersionsData(int budgetVersionID, string userID = "")
        {
            var subaccountList = await _context._SubAccountsDimensions
               .Include(f => f.BudgetVersion)
               .Include(f => f.DataScenarioTypeID)
               .Where(f =>
                       f.BudgetVersion.BudgetVersionID == budgetVersionID
                       && f.DataScenarioTypeID.ItemTypeCode == "SF"
                       && f.IsActive == true
                       && f.IsDeleted == false)
               .ToListAsync();

            // var _contxt = Operations.opBudgetVersionStaffing.getContext(_context);

            var datalist = await _context.BudgetVersionStaffing.Where(f => f.BudgetVersion.BudgetVersionID == budgetVersionID && f.IsActive == true && f.IsDeleted == false)
                .Select(p => new {
                    dataid = p.BudgetVersionStaffingID
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
                    jobcodecode = p.JobCode.JobCodeCode
                     ,
                    jobcodename = p.JobCode.JobCodeName
                     ,
                    paytypeid = p.PayType.PayTypeID
                     ,
                    paytypecode = p.PayType.PayTypeCode
                     ,
                    paytypename = p.PayType.PayTypeName
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
                    staffingdatatypeID = p.StaffingDataType.ItemTypeID
                     ,
                    staffingdatatype = p.StaffingDataType.ItemTypeDisplayName
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
                    rowtotal = p.rowTotal
                      ,
                    wagerateoverride = p.wageRateOverride
                      ,
                    dimensionsrow = p.DimensionsRowID
                    ,
                    datascenarioid = p.DataScenarioID.DataScenarioID
                    ,
                    datascenariocode = p.DataScenarioID.DataScenarioCode
                     ,
                    datascenarioname = p.DataScenarioID.DataScenarioName
                    ,
                    isSubAccExist = Operations.opSubaccounts.getSubAccountExists(subaccountList, p.BudgetVersionStaffingID)


                })
                .ToListAsync();
            List<string> Entities = new List<string>();
            List<string> Depts = new List<string>();
             List<string> Paytypes = new List<string>();
            List<string> Jobcodes = new List<string>();

            UserAuthenticationModel usermodeldata = new UserAuthenticationModel();
            if (userID != "")
            {
                usermodeldata = await Operations.opAuthentication.UserDetails(userID, _context);
                Entities = usermodeldata.AllRoleEntities.Where(f => f.EntityID != null).Select(f => f.EntityID.EntityID.ToString()).ToList();
                Depts = usermodeldata.AllRoleDepartments.Where(f => f.DepartmentID != null).Select(f => f.DepartmentID.DepartmentID.ToString()).ToList();
                Paytypes = usermodeldata.AllRolePayTypes.Where(f => f.PayTypesID != null).Select(f => f.PayTypesID.PayTypeID.ToString()).ToList();
                Jobcodes = usermodeldata.AllRoleJobCodes.Where(f => f.JobCodesID != null).Select(f => f.JobCodesID.JobCodeID.ToString()).ToList();

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
            if (Paytypes.Count > 0)
            {
                datalist = datalist.Where(f =>
                Paytypes.Contains(f.paytypeid.ToString())
            ).ToList();
            } 
            if (Jobcodes.Count > 0)
            {
                datalist = datalist.Where(f =>
                Jobcodes.Contains(f.jobcodeid.ToString())
            ).ToList();
            }
           


            return Ok(datalist);
        }


        [Route("GetBudgetVersionsStaffingData")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetVersionStaffing>>> GetBudgetVersionsStaffingData(int TimeperiodID, int DataScenarioID)
        {

          //  var _contxt = Operations.opBudgetVersionStaffing.getContext(_context);

            var datalist = await _context.BudgetVersionStaffing.Where(f => f.TimePeriodID.TimePeriodID == TimeperiodID && f.DataScenarioTypeID.ItemTypeID == DataScenarioID && f.IsActive == true && f.IsDeleted == false)
                .Select(p => new {
                    dataid = p.BudgetVersionStaffingID
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
                    jobcodecode = p.JobCode.JobCodeCode
                     ,
                    jobcodename = p.JobCode.JobCodeName
                     ,
                    paytypeid = p.PayType.PayTypeID
                     ,
                    paytypecode = p.PayType.PayTypeCode
                     ,
                    paytypename = p.PayType.PayTypeName
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
                    staffingdatatypeID = p.StaffingDataType.ItemTypeID
                     ,
                    staffingdatatype = p.StaffingDataType.ItemTypeDisplayName
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
                    datascenarioid = p.DataScenarioID.DataScenarioID
                    ,
                    datascenariocode = p.DataScenarioID.DataScenarioCode
                     ,
                    datascenarioname = p.DataScenarioID.DataScenarioName


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

        // GET: api/BudgetVersionStaffing/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BudgetVersionStaffing>> GetBudgetVersionStaffing(int id)
        {
            var _contxt = Operations.opBudgetVersionStaffing.getContext(_context);
            var BudgetVersionStaffing = await _contxt.BudgetVersionStaffing.FindAsync(id);

            if (BudgetVersionStaffing == null)
            {
                return NotFound();
            }

            return BudgetVersionStaffing;
        }

        // PUT: api/BudgetVersionStaffing/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ActionResult<BudgetVersionStaffing>> PutBudgetVersionStaffing([FromBody] System.Text.Json.JsonElement rawText)

        {
            var UPdateBVSF = await Operations.opBudgetVersionStaffing.UpdateBudgetVersionStaffing(rawText, _context);

            Queue.QueueBackgroundWorkItem(async bg =>
            {
                Console.WriteLine("ITEM QUEUED PROCESS IT!!");

                await Operations.opBudgetVersionStaffing.UPdateAssociatedSFValues(UPdateBVSF.payload, ServiceScopeFactory);

            });


            return Ok();
         }

        // POST: api/BudgetVersionStaffing
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
       // public async Task<ActionResult<BudgetVersionStaffing>> PostBudgetVersionStaffing(List< BudgetVersionStaffing> BudgetVersionStaffing)
        public async Task<ActionResult<BudgetVersionStaffing>> PostBudgetVersionStaffing([FromBody] System.Text.Json.JsonElement  rawText)
        {
            RequestValidationProcess<BudgetVersionStaffing> ValidationProcess = new RequestValidationProcess<BudgetVersionStaffing>(_context, Queue);

            var response = await ValidationProcess.JSONValidationProcess(rawText, false);

            Guid bgguid = Guid.NewGuid();
            await Operations.opBGJobs.InsertBGJob("SaveBudgetVersionStaffing_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Guid.Empty.ToString(), bgguid, bgguid.ToString(), _context);
            response.message += response.message + Environment.NewLine + "Background Job started with ID: " + bgguid.ToString();

            Queue.QueueBackgroundWorkItem(async bg =>
            {
                Console.WriteLine("ITEM QUEUED PROCESS IT!!");

                DBProcess<BudgetVersionStaffing> dBProcess = new DBProcess<BudgetVersionStaffing>(Queue, ServiceScopeFactory);
                // dBProcess.RunBGJob();
                dBProcess.Jobguid = bgguid.ToString();

                await dBProcess.ProcessDBObjects(rawText, true);
                //   await RunDBProcess(false, _context);
            });
           
            return Ok(response);

            //return  Ok(await Operations.opBudgetVersionStaffing.AddBudgetVersionsStaffing(rawText, _context));
            
           // return CreatedAtAction("GetBudgetVersionStaffing", new { id = BudgetVersionStaffing.StatisticID }, BudgetVersionStaffing);
        }

        // DELETE: api/BudgetVersionStaffing/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<BudgetVersionStaffing>> DeleteBudgetVersionStaffing(int id)
        {
            var BudgetVersionStaffing = await _context.BudgetVersionStaffing.FindAsync(id);
            if (BudgetVersionStaffing == null)
            {
                return NotFound();
            }

            _context.BudgetVersionStaffing.Remove(BudgetVersionStaffing);
            await _context.SaveChangesAsync();

            return BudgetVersionStaffing;
        }

        [Route("Delete")]
        [HttpPut]
        public void BulkDeleteBudgetVersionStaffing([FromBody] List<int> ids)
        {
            IQueryable<BudgetVersionStaffing> budgetVersionStatsData = _context.BudgetVersionStaffing.Where(bvs => ids.Contains(bvs.BudgetVersionStaffingID));
            foreach (var bvStats in budgetVersionStatsData)
            {
                bvStats.IsDeleted = true;
                bvStats.IsActive = false;
            }
            _context.SaveChanges();
        }

        private bool BudgetVersionStaffingExists(int id)
        {
            return _context.BudgetVersionStaffing.Any(e => e.BudgetVersionStaffingID == id);
        }

        [Route("GetBudgetVersionsStaffingFTEData")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetVersionStaffing>>> GetBudgetVersionsStaffingFTEData(int budgetVersionID, int timePeriodID)
        {
            var _contxt = Operations.opBudgetVersionStaffing.getContext(_context);

            _contxt.TimePeriods.Include("FiscalYearID").ToList();
            _contxt.TimePeriods.Include("FiscalYearEndID").ToList();
            _contxt.TimePeriods.Include("FiscalStartMonthID").ToList();
            _contxt.TimePeriods.Include("FiscalEndMonthID").ToList();

            // get the staffing hours entires for the budget version
            List<BudgetVersionStaffing> datalist = await _contxt.BudgetVersionStaffing.Where(f => f.BudgetVersion.BudgetVersionID == budgetVersionID && f.StaffingDataType.ItemTypeValue == "Hours" && f.IsActive == true && f.IsDeleted == false).ToListAsync();

            // get all of the FTE Divisors for the budget's time period
            Operations.opFullTimeEquivalent opFullTimeEquivalent = new Operations.opFullTimeEquivalent();
            List<FullTimeEquivalent> fteDivisors = await opFullTimeEquivalent.getFTEDivisors(timePeriodID, _contxt);

            Dictionary<int, string> monthDictionary = new Dictionary<int, string>()
            {
                {1, "January"},
                {2, "February"},
                {3, "March"},
                {4, "April"},
                {5, "May"},
                {6, "June"},
                {7, "July"},
                {8, "August"},
                {9, "September"},
                {10, "October"},
                {11, "November"},
                {12, "December"},
            };

            Dictionary<int,decimal> rowTotals = new Dictionary<int, decimal>();
            foreach (BudgetVersionStaffing data in datalist)
            {
              // if FTE Divisors exist for the row's dimensions get those values otherwise continue to the next row
              FullTimeEquivalent fte = fteDivisors.Where(fte => fte.Entity == data.Entity && fte.Department == data.Department && fte.JobCode == data.JobCode).FirstOrDefault();
              if (fte == null)
              {
                continue;
              }

              // total FTE is a separate calculation not just the 12 month FTEs added together so the totals need to be tracked
              decimal fteTotal = 0;
              decimal datalistTotal = 0;
              foreach (string month in monthDictionary.Values)
              {
                // check the budget version row for that month's data
                PropertyInfo datalistPropertyInfo = data.GetType().GetProperty(month);
                decimal? datalistMonthValue = (decimal?)datalistPropertyInfo.GetValue(data);

                // check the FTE divisor for that month's data
                PropertyInfo ftePropertyInfo = fte.GetType().GetProperty(month);
                decimal? fteMonthValue = (decimal?)ftePropertyInfo.GetValue(fte);

                // add to the FTE total if it is not null
                if (fteMonthValue != null)
                {
                  fteTotal += (decimal)fteMonthValue;
                }

                // add to the datalistTotal and calculate the FTE if it is not null
                if (datalistMonthValue != null)
                {
                  datalistTotal += (decimal)datalistMonthValue;
                  // if fteMonthValue is null or 0 set the value to 0 to prevent errors
                  if (fteMonthValue == null || fteMonthValue == 0)
                  {
                    datalistPropertyInfo.SetValue(data, 0, null);
                  }
                  else
                  {
                    datalistPropertyInfo.SetValue(data, datalistMonthValue / fteMonthValue, null);
                  }
                }
              }
              // calculate the rowTotals value and add it to a dictionary to be pulled out in the following select
              rowTotals.Add(data.BudgetVersionStaffingID, datalistTotal / fteTotal);
            }
            //datalist = datalist.ToList();

            var datalistReturn = datalist.Where(p => rowTotals.ContainsKey(p.BudgetVersionStaffingID)).Select(p => new {
                    dataid = p.BudgetVersionStaffingID
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
                    jobcodecode = p.JobCode.JobCodeCode
                     ,
                    jobcodename = p.JobCode.JobCodeName
                     ,
                    paytypeid = p.PayType.PayTypeID
                     ,
                    paytypecode = p.PayType.PayTypeCode
                     ,
                    paytypename = p.PayType.PayTypeName
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
                    rowtotal = rowTotals[p.BudgetVersionStaffingID]
                     ,
                    scenariotypeID = p.DataScenarioTypeID.ItemTypeID
                     ,
                    scenariotype = p.DataScenarioTypeID.ItemTypeDisplayName
                     ,
                    staffingdatatypeID = p.StaffingDataType.ItemTypeID
                     ,
                    staffingdatatype = p.StaffingDataType.ItemTypeDisplayName
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

        }).ToList();

            return Ok(datalistReturn);
        }
    }
}
