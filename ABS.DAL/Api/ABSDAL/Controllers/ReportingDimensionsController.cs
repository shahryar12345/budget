using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using ABSDAL.Context;
using ABSDAL.DataCache;
using ABSDAL.Operations.Reporting;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportingDimensionsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public ReportingDimensionsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/ReportingDimensions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportingDimensions>>> Get_ReportingDimensions()
        {
            return await _context._ReportingDimensions.Include(r => r.ScenarioType).Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/ReportingDimensions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReportingDimensions>> GetReportingDimensions(int id)
        {
            var reportingDimensions = await _context._ReportingDimensions.Include(r => r.ScenarioType).FirstOrDefaultAsync(r => r.ReportingDimensionID == id);

            if (reportingDimensions == null)
            {
                return NotFound();
            }

            return reportingDimensions;
        }


        [Route("GetReportingDimensionsPage")]
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
        public async Task<ActionResult<APIResponse>> GetReportDimensionsPage(
          string searchString, int PageNo, int itemsPerPage, string DataScenarioType, string sortColumn, bool sortDescending, int userID)
        {


            APIResponse xData = new APIResponse();

            Operations.Reporting.opReportingDimensions opBudgetVersions = new Operations.Reporting.opReportingDimensions();

            xData = await opReportingDimensions.GetReportingDimensionsPageData(searchString, PageNo, itemsPerPage, DataScenarioType, sortColumn, sortDescending, userID, _context);

            return Ok(xData);
        }


        [Route("GetReportsCodes")]
        [HttpGet]
        public async Task<ActionResult<string>> GetReportsCodes()
        {

            var reportsCode = await _context._ReportingDimensions.Where(x => x.IsActive == true && x.IsDeleted == false).Select(r => r.Code).ToListAsync();
            if (reportsCode == null)
            {
                return NotFound();
            }
            return Ok(reportsCode);

        }

        // PUT: api/ReportingDimensions/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReportingDimensions(int id, ReportingDimensions reportingDimensions)
        {
            if (id != reportingDimensions.ReportingDimensionID)
            {
                return BadRequest();
            }

            _context.Entry(reportingDimensions).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportingDimensionsExists(id))
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




        // POST: api/ReportingDimensions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<APIResponse>> PostReportingDimensions([FromBody] System.Text.Json.JsonElement rawText)
        {
            var response = await Operations.opReportingDimensions.ProcessReportingDimensions(rawText, _context);

            return response;
        }

        [HttpPost]
        [Route("RenameReportingDimensions")]
        public async Task<ActionResult<APIResponse>> RenameReportingDimensions([FromBody] System.Text.Json.JsonElement rawText)
        {
            var response = await Operations.opReportingDimensions.ProcessReportingDimensions(rawText, _context);

            return response;
        }
        [HttpPost]
        [Route("CopyReportingDimensions")]
        public async Task<ActionResult<APIResponse>> CopyReportingDimensions([FromBody] System.Text.Json.JsonElement rawText)
        {
            var response = await Operations.opReportingDimensions.ProcessReportingDimensions(rawText, _context);

            return response;
        }

        
        [Route("DeleteReportingDimensions")]
        [HttpPost]
        public async Task<ActionResult<string>> DeleteReportingDimensions([FromBody] List<int> ids)
        {
            string result = "";
            foreach (var id in ids)
            {


                var reportingDimensions = await _context._ReportingDimensions.FindAsync(id);
                if (reportingDimensions == null)
                {
                    // return NotFound();
                }

                _context.Entry(reportingDimensions).State = EntityState.Modified;

                reportingDimensions.UpdatedDate = DateTime.UtcNow;
                reportingDimensions.IsDeleted = true;

                // _context._ReportingDimensions.Remove(reportingDimensions);
            }
            await _context.SaveChangesAsync();

            return result;

        }

        private bool ReportingDimensionsExists(int id)
        {
            return _context._ReportingDimensions.Any(e => e.ReportingDimensionID == id);
        }
    }
}
