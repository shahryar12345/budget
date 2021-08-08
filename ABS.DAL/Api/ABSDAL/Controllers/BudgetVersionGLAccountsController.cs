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
using EFCore.BulkExtensions;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetVersionGLAccountsController : ControllerBase
    {
        private readonly BudgetingContext _context;
        public IBackgroundTaskQueue Queue { get; }
        public IServiceScopeFactory ServiceScopeFactory { get; }

        public BudgetVersionGLAccountsController(BudgetingContext context,  IBackgroundTaskQueue queue, IServiceScopeFactory serviceScopeFactory)
        {
            _context = context;
            Queue = queue;
            ServiceScopeFactory = serviceScopeFactory;
        }

        // GET: api/BudgetVersionGLAccounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetVersionGLAccounts>>> GetBudgetVersionGLAccounts()
        {

           // var _contxt = Operations.opBudgetVersionGLAccounts.getContext(_context);

            var datalist = await _context.BudgetVersionGLAccounts.Where(f => f.IsActive == true && f.IsDeleted == false)
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
                    glaccountid = p.GLAccount.GLAccountID
                     ,
                    glaccountcode = p.GLAccount.GLAccountCode
                     ,
                    glaccountname = p.GLAccount.GLAccountName
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

            return Ok(datalist);
        }

        [Route("GetBudgetVersionsData")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetVersionGLAccounts>>> GetBudgetVersionsData(int budgetVersionID, string userID="")
        {

            var subaccountList = await _context._SubAccountsDimensions
                .Include(f => f.BudgetVersion)
                .Include(f => f.DataScenarioTypeID)
                .Where(f =>
                        f.BudgetVersion.BudgetVersionID == budgetVersionID
                        && f.DataScenarioTypeID.ItemTypeCode == "GL"
                        && f.IsActive == true
                        && f.IsDeleted == false)
                .ToListAsync();
            //  var _contxt = Operations.opBudgetVersionGLAccounts.getContext(_context);

          

            var datalist = await _context.BudgetVersionGLAccounts.Where(f => f.BudgetVersion.BudgetVersionID == budgetVersionID && f.IsActive == true && f.IsDeleted == false)
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
                    glaccountid = p.GLAccount.GLAccountID
                     ,
                    glaccountcode = p.GLAccount.GLAccountCode
                     ,
                    glaccountname = p.GLAccount.GLAccountName
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
                    dimensions = p.DimensionsRowID

                  ,
                    isSubAccExist = Operations.opSubaccounts.getSubAccountExists(subaccountList, p.StatisticID)


                })
                .ToListAsync();
            List<string> Entities = new List<string>();
            List<string> Depts = new List<string>();
            List<string> GlAccs = new List<string>();

            UserAuthenticationModel usermodeldata = new UserAuthenticationModel();
            if (userID != "")
            {
                usermodeldata = await Operations.opAuthentication.UserDetails(userID, _context);
                Entities = usermodeldata.AllRoleEntities.Where(f => f.EntityID != null).Select(f => f.EntityID.EntityID.ToString()).ToList();
                Depts = usermodeldata.AllRoleDepartments.Where(f => f.DepartmentID != null).Select(f => f.DepartmentID.DepartmentID.ToString()).ToList();
                GlAccs = usermodeldata.AllRoleGLAccounts.Where(f => f.GLAccountsID != null).Select(f => f.GLAccountsID.GLAccountID.ToString()).ToList();

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
            if (GlAccs.Count > 0)
            {
                datalist = datalist.Where(f =>
                GlAccs.Contains(f.glaccountid.ToString())
            ).ToList();
            }

            return Ok(datalist);
        }


        [Route("GetBudgetVersionsGLAccountsData")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetVersionGLAccounts>>> GetBudgetVersionsGLAccountsData(int TimeperiodID, int DataScenarioID)
        {

          //  var _contxt = Operations.opBudgetVersionGLAccounts.getContext(_context);

          

            var datalist = await _context.BudgetVersionGLAccounts.Where(f => f.TimePeriodID.TimePeriodID == TimeperiodID && f.DataScenarioTypeID.ItemTypeID == DataScenarioID && f.IsActive == true && f.IsDeleted == false)
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
                    glaccountid = p.GLAccount.GLAccountID
                     ,
                    glaccountcode = p.GLAccount.GLAccountCode
                     ,
                    glaccountname = p.GLAccount.GLAccountName
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

            return Ok(datalist);
        }

        // GET: api/BudgetVersionGLAccounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BudgetVersionGLAccounts>> GetBudgetVersionGLAccounts(int id)
        {
            var _contxt = Operations.opBudgetVersionGLAccounts.getContext(_context);
            var BudgetVersionGLAccounts = await _contxt.BudgetVersionGLAccounts.FindAsync(id);

            if (BudgetVersionGLAccounts == null)
            {
                return NotFound();
            }

            return BudgetVersionGLAccounts;
        }

        // PUT: api/BudgetVersionGLAccounts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<ActionResult<BudgetVersionGLAccounts>> PutBudgetVersionGLAccounts([FromBody] System.Text.Json.JsonElement rawText)
        {

            var UpdateBVGL = await Operations.opBudgetVersionGLAccounts.UpdateBudgetVersionsGLAccounts(rawText, _context);
            Queue.QueueBackgroundWorkItem(async bg =>
            {
                Console.WriteLine("ITEM QUEUED PROCESS IT!!");

                await Operations.opBudgetVersionGLAccounts.UPdateAssociatedGLValues(UpdateBVGL.payload, ServiceScopeFactory);

            });



            return Ok(UpdateBVGL);
        }

        // POST: api/BudgetVersionGLAccounts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<BudgetVersionGLAccounts>> PostBudgetVersionGLAccounts([FromBody] System.Text.Json.JsonElement  rawText)
        {
            RequestValidationProcess<BudgetVersionGLAccounts> ValidationProcess = new RequestValidationProcess<BudgetVersionGLAccounts>(_context, Queue);

            var response = await ValidationProcess.JSONValidationProcess(rawText, false);
            Guid bgguid = Guid.NewGuid();
            await Operations.opBGJobs.InsertBGJob("SaveBudgetVersionGLAccounts_"+ DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Guid.Empty.ToString(), bgguid, bgguid.ToString(), _context);
            response.message += response.message + Environment.NewLine + "Background Job started with ID: " + bgguid.ToString();

            Queue.QueueBackgroundWorkItem(async bg =>
            {
                Console.WriteLine("ITEM QUEUED PROCESS IT!!");
                DBProcess <BudgetVersionGLAccounts> dBProcess = new DBProcess<BudgetVersionGLAccounts>(Queue, ServiceScopeFactory);
                // dBProcess.RunBGJob();
                dBProcess.Jobguid = bgguid.ToString();
                await dBProcess.ProcessDBObjects(rawText, true);

                //   await RunDBProcess(false, _context);
            });
            return Ok(response);

            // return  Ok(await Operations.opBudgetVersionGLAccounts.AddBudgetVersionsGLAccounts(rawText, _context));
        }

        // DELETE: api/BudgetVersionGLAccounts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<BudgetVersionGLAccounts>> DeleteBudgetVersionGLAccounts(int id)
        {
            var BudgetVersionGLAccounts = await _context.BudgetVersionGLAccounts.FindAsync(id);
            if (BudgetVersionGLAccounts == null)
            {
                return NotFound();
            }

            _context.BudgetVersionGLAccounts.Remove(BudgetVersionGLAccounts);
            await _context.SaveChangesAsync();

            return BudgetVersionGLAccounts;
        }

        [Route("Delete")]
        [HttpPut]
        public void BulkDeleteBudgetVersionGLAccounts([FromBody] List<int> ids)
        {
            IQueryable<BudgetVersionGLAccounts> budgetVersionGLAccountsData = _context.BudgetVersionGLAccounts.Where(bvs => ids.Contains(bvs.StatisticID));
            foreach (var bvGLAccounts in budgetVersionGLAccountsData)
            {
                bvGLAccounts.IsDeleted = true;
                bvGLAccounts.IsActive = false;
            }
            _context.SaveChanges();
        }

        private bool BudgetVersionGLAccountsExists(int id)
        {
            return _context.BudgetVersionGLAccounts.Any(e => e.StatisticID == id);
        }
    }
}
