using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABSDAL.Context;
using ABS.DBModels;
using ABSDAL.Operations;

//using Microsoft.Extensions.Caching.Distributed;

//using StackExchange.Redis;
using System.Text.Json;
using ABSDAL.DataCache;
using ABSDAL.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetVersionsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public IBackgroundTaskQueue Queue { get; }
        public IServiceScopeFactory ServiceScopeFactory { get; }

        //   private readonly IDistributedCache _idb;

        public BudgetVersionsController(BudgetingContext context,   IBackgroundTaskQueue queue, IServiceScopeFactory serviceScopeFactory)
        {
            _context = context;
            Queue = queue;
            ServiceScopeFactory = serviceScopeFactory;
            //_idb = distributedCache;
        }

        // GET: api/BudgetVersions
        [HttpGet]
        [Cached(1000)]
        public async Task<ActionResult<IEnumerable<BudgetVersions>>> GetBudgetVersions()
        {

            var _contextInclude = Operations.opBudgetVersions.getBudgetVersionContext(_context);
            var budgetVersionsData = await _contextInclude._BudgetVersions
                  .Where(p => p.IsDeleted == false && p.IsActive == true).ToListAsync();
            if (budgetVersionsData == null)
            {
                return NotFound();
            }

            return Ok(budgetVersionsData);

            // return budgetVersionsData;

            //DataCache.opRedisCache opCache = new DataCache.opRedisCache(_idb);

            //IEnumerable<BudgetVersions> budgetVersionsData;


            //var budgetVersionsCachedData = opCache.RetrieveListFromCache<BudgetVersions>("ALLBUDGETVERSIONS");

            //if (budgetVersionsCachedData.Result == null)
            //{
            //     
            //    budgetVersionsData = await _contextInclude._BudgetVersions
            //        .ToListAsync();
            //    await opCache.SaveToCache("ALLBUDGETVERSIONS", budgetVersionsData, 10000);
            //    return budgetVersionsData.ToList();
            //}
            //else
            //{
            //    if (budgetVersionsCachedData.Result.Count() > 0)

            //    {
            //        var xlist = budgetVersionsCachedData.Result.ToList();

            //        return (xlist);
            //    }
            //    else
            //    {
            //        return NotFound();
            //    }
            //}



        }

        // GET: api/BudgetVersions/5
        [HttpGet("{id}")]
        [Cached(1000)]
        public async Task<ActionResult<BudgetVersions>> GetBudgetVersions(int id)
        {
            var _contextInclude = Operations.opBudgetVersions.getBudgetVersionContext(_context);

            var budgetVersions = await _contextInclude._BudgetVersions.FindAsync(id);

            if (budgetVersions == null)
            {
                return NotFound();
            }

            return Ok(budgetVersions);
        }


        [HttpGet]
        [Route("GetBudgetVersionCodes")]
        //        [Cached(1000)]

        public async Task<ActionResult<IEnumerable<string>>> GetBudgetVersionCodes()
        {

            var bvCOdes = await _context._BudgetVersions.Where(a => a.IsActive == true && a.IsDeleted == false).Select(bv => bv.Code).ToListAsync();

            if (bvCOdes == null)
            {
                return NotFound();
            }

            return bvCOdes;
        }


        [Route("GetBudgetVersion")]
        [HttpGet]
        [Cached(1000)]
        public async Task<ActionResult<IEnumerable<Object>>> GetBudgetVersion(int userID)
        {
            APIResponse aPIResponse = new APIResponse();
            List<ABS.DBModels.IdentityUserProfile> _userProfile = await Operations.opIdentityUserProfile.getAllIdentityUserProfile(_context);
           // List<ABS.DBModels.ItemTypes> _itemTypes = Operations.opItemTypes.getAllItemTypes(_context).Result;


            //if (_userProfile == null )
            //{
            //    return NotFound("User Not FOund");
            //}


            //string username = _userProfile.Username;
            var _contextInclude = Operations.opBudgetVersions.getBudgetVersionContext(_context);

            var getBVList = await _contextInclude._BudgetVersions
                .Where(x => x.IsActive == true && x.IsDeleted == false).ToListAsync();
            var GetBudgetVersion = getBVList
                .Select(a => new
                {
                    budgetVersionsID = a.BudgetVersionID
                ,
                    code = a.Code
                ,
                   comments = a.Comments
                ,
                   description =  a.Description
                ,

                    UserProfile =   opIdentityUserProfile.GetUsernamefromList(a.UserProfileID.GetValueOrDefault(), _userProfile)
               ,
                    createdby = a.CreatedBy != null ? opIdentityUserProfile.GetUsernamefromList(int.Parse(a.CreatedBy.ToString()), _userProfile) : ""
               ,
                    updatedby = a.UpdateBy != null ? opIdentityUserProfile.GetUsernamefromList(int.Parse(a.UpdateBy.ToString()), _userProfile) :""
                ,
                    fiscalYearID = a.TimePeriodID != null ? a.TimePeriodID.FiscalYearID.ItemTypeDisplayName + "-" + a.TimePeriodID.FiscalYearEndID.ItemTypeDisplayName : "" 
                    
                ,
                    fiscalYearIDObj = a.fiscalYearID != null ? a.fiscalYearID : null  //+ "-" + a.fiscalYearID.ItemTypeValue
                ,
                    //  budgetVersionTypeID = a.budgetVersionTypeID.ItemTypeCode + "-" + a.budgetVersionTypeID.ItemTypeValue
                    budgetVersionTypeID = a.budgetVersionTypeID != null ? a.budgetVersionTypeID.ItemTypeDisplayName : ""
                ,
                    budgetVersionTypeIDOBj = a.budgetVersionTypeID != null ? a.budgetVersionTypeID : null
                ,
                    scenarioTypeID = a.scenarioTypeID != null ? a.scenarioTypeID.ItemTypeCode : "" //+ "-" + a.scenarioTypeID.ItemTypeValue
                ,
                    scenarioTypeIDObj = a.scenarioTypeID != null ? a.scenarioTypeID : null //+ "-" + a.scenarioTypeID.ItemTypeValue
                ,
                    fiscalStartMonthID = a.TimePeriodID != null ? a.TimePeriodID.FiscalStartMonthID.ItemTypeDisplayName : "" //+ "-" + a.fiscalStartMonthID.ItemTypeValue
                  ,
                    fiscalStartMonthIDObj = a.fiscalStartMonthID != null ? a.fiscalStartMonthID : null//+ "-" + a.fiscalStartMonthID.ItemTypeValue
                 ,
                    ADSbudgetVersionID = a.ADSbudgetVersionID != null ? a.ADSbudgetVersionID : null//+ "-" + a.fiscalStartMonthID.ItemTypeValue
                 ,
                    ADSgeneralLedgerID = a.ADSgeneralLedgerID != null ? a.ADSgeneralLedgerID : null//+ "-" + a.fiscalStartMonthID.ItemTypeValue
                 ,
                    ADSscenarioTypeID = a.ADSscenarioTypeID != null ? a.ADSscenarioTypeID : null//+ "-" + a.fiscalStartMonthID.ItemTypeValue
                 ,
                    ADSstaffingID = a.ADSstaffingID != null ? a.ADSstaffingID : null//+ "-" + a.fiscalStartMonthID.ItemTypeValue
                 ,
                    ADSstatisticsID = a.ADSstatisticsID != null ? a.ADSstatisticsID : null//+ "-" + a.fiscalStartMonthID.ItemTypeValue
                 ,

                    timeperiodobj = a.TimePeriodID != null ? a.TimePeriodID : null//+ "-" + a.fiscalStartMonthID.ItemTypeValue
                 ,



                    creationDate = a.CreationDate != null ? a.CreationDate.ToString() : ""
                    ,
                    updateddate = a.UpdatedDate != null ? a.UpdatedDate.ToString() : ""
                    ,
                    calculationStatus = a.CalculationStatus != null ? a.CalculationStatus : ""
                })
                .ToList();

            if (GetBudgetVersion == null)
            {
                return NotFound();
            }

            return Ok(GetBudgetVersion);
        }
        [Route("UpdateActualBudgetVersion")]
        [HttpGet]
 
        public async Task<ActionResult<IEnumerable<Object>>> UpdateActualBudgetVersion(int BudgetVersionID = 0)
        {

            Guid bgguid = Guid.NewGuid();
            await Operations.opBGJobs.InsertBGJob("UpdateActualBudgetVersion_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Guid.Empty.ToString(), bgguid, bgguid.ToString(), _context);
            string message = Environment.NewLine + "Background Job started with ID: " + bgguid.ToString();

            Queue.QueueBackgroundWorkItem(async bg =>
            {
                Console.WriteLine("ITEM QUEUED PROCESS IT!!");
                await  Operations.opBudgetVersions.UpdateActualBudgetVersion(BudgetVersionID,bgguid,Queue ,ServiceScopeFactory);

                //await Operations.opBudgetVersions.CopyBudgetVersionsData(SourceBudgetversion, TargetBudgetversion, bgguid, Queue, ServiceScopeFactory);
                //   await RunDBProcess(false, _context);
            });


            return Ok(message);

            //await  Operations.opBudgetVersions.UpdateActualBudgetVersion(BudgetVersionID,_context);


            //return Ok( "Process Started ");
        }


        [Route("CopyBudgetVersionData")]
        [HttpGet]

        public async Task<ActionResult<IEnumerable<Object>>> CopyBudgetVersionData(int SourceBudgetversion = 0,int TargetBudgetversion = 0)
        {
            Guid bgguid = Guid.NewGuid();
            await Operations.opBGJobs.InsertBGJob("CopyBudgetVersionData_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Guid.Empty.ToString(), bgguid, bgguid.ToString(), _context);
            string  message = Environment.NewLine + "Background Job started with ID: " + bgguid.ToString();

            Queue.QueueBackgroundWorkItem(async bg =>
            {
                Console.WriteLine("ITEM QUEUED PROCESS IT!!");

                await Operations.opBudgetVersions.CopyBudgetVersionsData(  SourceBudgetversion,   TargetBudgetversion, bgguid,Queue, ServiceScopeFactory);
                //   await RunDBProcess(false, _context);
            });
          

            return Ok(message);
        }

        

        [Route("GetBudgetVersionPage")]
        [HttpGet]
        [Cached(10000)]


        //        Input query params: 
        //searchString='',
        //pageNo=1,
        //itemsPerPage=10,
        //budgetVersionTypeId=1/2, // depending on schema
        //sortType='',
        //sortColumn=''

        //Output: 
        //budgetVersion=[].
        //totalCount= 20
        public async Task<ActionResult<APIResponse>> GetBudgetVersionPage(
           string searchString, int PageNo, int itemsPerPage, string budgetVersionType, string sortColumn, bool sortDescending, int userID)
        {


            APIResponse xData = new APIResponse();

            Operations.opBudgetVersions opBudgetVersions = new Operations.opBudgetVersions();

            xData = await opBudgetVersions.GetBudgetVersionPageData(searchString, PageNo, itemsPerPage, budgetVersionType, sortColumn, sortDescending, userID, _context);

            return Ok(xData);
        }




        // PUT: api/BudgetVersions/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBudgetVersions(int id, BudgetVersions budgetVersions)
        {
            if (id != budgetVersions.BudgetVersionID)
            {
                return BadRequest();
            }

            _context.Entry(budgetVersions).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BudgetVersionsExists(id))
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

        // POST: api/BudgetVersions
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostBudgetVersions([FromBody] System.Text.Json.JsonElement rawText)
        {
            var res = await Operations.opBudgetVersions.ProcessBudgetVersionsAsync(rawText, _context);

            if (res.payload != "" && res.payload.ToUpper().Contains("COPY"))
            {
                string[] lstids = res.payload.Split("||");
                if (lstids.Length == 3)
                {
                  await   CopyBudgetVersionData(int.Parse(lstids[1]), int.Parse(lstids[2]));
                }

            }
            else
            {

            }
            return res;
            //if (await Operations.opBudgetVersions.UpdateBudgetVersionsAsync(rawText, _context))
            //{
            //    return rawText.ToString();
            //}
            //else
            //{
            //    return "Operation Failed!!!";
            //}
        }

        // DELETE: api/BudgetVersions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<BudgetVersions>> DeleteBudgetVersions(int id)
        {
            var budgetVersions = await _context._BudgetVersions.FindAsync(id);
            if (budgetVersions == null)
            {
                return NotFound();
            }

            _context._BudgetVersions.Remove(budgetVersions);
            await _context.SaveChangesAsync();

            return budgetVersions;
        }

        private bool BudgetVersionsExists(int id)
        {
            return _context._BudgetVersions.Any(e => e.BudgetVersionID == id);
        }
    }
}
