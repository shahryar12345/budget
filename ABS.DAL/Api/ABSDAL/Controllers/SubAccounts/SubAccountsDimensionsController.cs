using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using ABSDAL.Context;
using ABS.DBModels.Models.SubAccounts;

namespace ABSDAL.Controllers.SubAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubAccountsDimensionsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public SubAccountsDimensionsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/SubAccountsDimensions
        //[HttpGet]
        private async Task<ActionResult<IEnumerable<SubAccountsDimensions>>> Get_SubAccountsDimensions()
        {
            return await _context._SubAccountsDimensions.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        //[HttpGet]
        //[Route("GetSubAccountbyBudgetVersion")]
        private async Task<ActionResult<IEnumerable<SubAccountsDimensions>>> GetSubAccountbyBudgetVersion(int BudgetVersionID)
        {
            return await _context._SubAccountsDimensions.Where(f => f.BudgetVersion.BudgetVersionID == BudgetVersionID && f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }
        [HttpGet]
        [Route("GetSubAccountbyRowID")]
        public async Task<ActionResult<IEnumerable<object>>> GetSubAccountbyRowID(int BudgetVersionRowID = 0, string BVType = "")
        {
            List<SubAccountsDimensions> SADList = new List<SubAccountsDimensions>();
            if (BudgetVersionRowID == 0)
            {
                return NotFound("Invalid RowID");
            }
            else
            if (BudgetVersionRowID < 0)
            {
                return NotFound("Invalid RowID");
            }
            else
                if (BudgetVersionRowID > 0 && BVType == "")
            {
                return NotFound("Invalid BV type");

            }
            else
                if (BudgetVersionRowID > 0 && BVType != "")
            {

                if (BVType.ToUpper() == "ST")
                {
                    // var bvdata = _context.BudgetVersionStatistics.Where(f => f.StatisticID == BudgetVersionRowID && f.IsActive == true && f.IsDeleted == false).FirstOrDefault();

                    return await _context._SubAccountsDimensions.Where(f => f.subAccountValue == BudgetVersionRowID.ToString()
                  && f.DataScenarioTypeID.ItemTypeCode == BVType.ToUpper() 
                  && f.IsActive == true
                  && f.IsDeleted == false)
                         .Select(
                         f => new
                         {
                             subAccid = f.SubAccountsDimensionID,
                             subAccName = f.subAccountName,

                             rowID = f.subAccountValue,
                             scenariotype = f.DataScenarioTypeID.ItemTypeCode,
                             f.April,
                             f.August,
                             f.BudgetVersion.BudgetVersionID,
                             f.December,
                             f.February,
                             f.January,
                             f.July,
                             f.June,
                             f.March,
                             f.May,
                             f.November,
                             f.October,
                             f.rowTotal,
                             f.September
                          ,
                             isParent = f.subAccountCode.ToUpper() == "ISPARENTROW" ? "true" : "false"
                         ,
                             isSubAccount = f.subAccountCode.ToUpper() == "ISSUBACCROW" ? "true" : "false"
                         ,
                             isReconcile = f.subAccountCode.ToUpper() == "ISRECONCILROW" ? "true" : "false"

                         ,
                             islock = f.subAccountTitle.ToUpper() == "ISLOCK" ? "true" : "false"

                         })

                        .ToListAsync();

                }
                else
                if (BVType == "GL")
                {
                    //var bvdata = _context.BudgetVersionGLAccounts.Where(f => f.StatisticID == BudgetVersionRowID && f.IsActive == true && f.IsDeleted == false).FirstOrDefault();

                    return await _context._SubAccountsDimensions.Where(f => f.subAccountValue == BudgetVersionRowID.ToString()
                  && f.DataScenarioTypeID.ItemTypeCode == BVType.ToUpper()
                     && f.IsActive == true
                     && f.IsDeleted == false)
                         .Select(
                          f => new
                          {
                              subAccid = f.SubAccountsDimensionID,
                              subAccName = f.subAccountName,
                              rowID = f.subAccountValue,
                              scenariotype = f.DataScenarioTypeID.ItemTypeCode,
                              f.April,
                              f.August,
                              f.BudgetVersion.BudgetVersionID,
                              f.December,
                              f.February,
                              f.January,
                              f.July,
                              f.June,
                              f.March,
                              f.May,
                              f.November,
                              f.October,
                              f.rowTotal,
                              f.September
                          ,
                              isParent = f.subAccountCode.ToUpper() == "ISPARENTROW" ? "true" : "false"
                         ,
                              isSubAccount = f.subAccountCode.ToUpper() == "ISSUBACCROW" ? "true" : "false"
                         ,
                              isReconcile = f.subAccountCode.ToUpper() == "ISRECONCILROW" ? "true" : "false"

                         ,
                              islock = f.subAccountTitle.ToUpper() == "ISLOCK" ? "true" : "false"

                          })
                         .ToListAsync();
                }
                else
                     if (BVType.ToUpper() == "SF")
                {
                  //  var bvdata = _context.BudgetVersionStaffing.Where(f => f.BudgetVersionStaffingID == BudgetVersionRowID && f.IsActive == true && f.IsDeleted == false).FirstOrDefault();

                    return await _context._SubAccountsDimensions.Where(f => f.subAccountValue == BudgetVersionRowID.ToString()
                  && f.DataScenarioTypeID.ItemTypeCode == BVType.ToUpper()
                  && f.IsActive == true
                  && f.IsDeleted == false)
                        .Select(
                         f => new
                         {
                             subAccid = f.SubAccountsDimensionID,
                             subAccName = f.subAccountName,

                             rowID = f.subAccountValue,
                             scenariotype = f.DataScenarioTypeID.ItemTypeCode,
                             f.April,
                             f.August,
                             f.BudgetVersion.BudgetVersionID,
                             f.December,
                             f.February,
                             f.January,
                             f.July,
                             f.June,
                             f.March,
                             f.May,
                             f.November,
                             f.October,
                             f.rowTotal,
                             f.September
                          ,
                             isParent = f.subAccountCode.ToUpper() == "ISPARENTROW" ? "true" : "false"
                         ,
                             isSubAccount = f.subAccountCode.ToUpper() == "ISSUBACCROW" ? "true" : "false"
                         ,
                             isReconcile = f.subAccountCode.ToUpper() == "ISRECONCILROW" ? "true" : "false"
                         
                         ,
                             islock = f.subAccountTitle.ToUpper() == "ISLOCK" ? "true" : "false"
                         }).ToListAsync();
                }
            }


            return SADList;
        }


        //[HttpGet]
        //[Route("GetSubAccountbyDimensions")]
        private async Task<ActionResult<IEnumerable<SubAccountsDimensions>>> GetSubAccountbyDimensions(int BudgetVersionID = 0, int EntityID = 0, int DeptID = 0, int StatisticsCodeID = 0, int GLAccountID = 0, int JobCodeID = 0, int PayTypeID = 0)
        {


            var res = await Operations.opSubaccounts.ProcessSubAccountDimensions(BudgetVersionID, EntityID, DeptID, StatisticsCodeID, GLAccountID, JobCodeID, PayTypeID, _context); ;

            return res;
        }
        //[HttpPost]
        //[Route("GetSubAccountbyDimensionsList")]
        private async Task<ActionResult<IEnumerable<SubAccountsDimensions>>> GetSubAccountbyDimensionsList(SubAccountsList subAccountsList)
        {
            List<SubAccountsDimensions> sads = new List<SubAccountsDimensions>();

            if (subAccountsList != null)
            {
                sads = await Operations.opSubaccounts.ProcessSubAccountDimensionsList(subAccountsList.BudgetVersionID, subAccountsList.EntityID, subAccountsList.DeptID, subAccountsList.StatisticsCodeID, subAccountsList.GLAccountID, subAccountsList.JobCodeID, subAccountsList.PayTypeID, _context); ;
            }
            return sads;
        }

        [HttpPost]
        [Route("SubAccountDetails")]
        public async Task<ActionResult<IEnumerable<Object>>> SubAccountDetails(SubAccountDetails subAccountsList)
        {
            List<SubAccountsDimensions> sads = new List<SubAccountsDimensions>();

            if (subAccountsList != null)
            {
                sads = await Operations.opSubaccounts.StoreSubAccountDetails(subAccountsList, _context);
            }
            else
            {
                return BadRequest();
            }
            if (sads != null)
            {
                return Ok("Records saved successfully");
            }
            else
            {
                return BadRequest("Invalid data");
            }
        }






        // GET: api/SubAccountsDimensions/5
      //  [HttpGet("{id}")]
        private async Task<ActionResult<SubAccountsDimensions>> GetSubAccountsDimensions(int id)
        {
            var subAccountsDimensions = await _context._SubAccountsDimensions.FindAsync(id);

            if (subAccountsDimensions == null)
            {
                return NotFound();
            }

            return subAccountsDimensions;
        }

        // PUT: api/SubAccountsDimensions/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<IActionResult> PutSubAccountsDimensions( SubAccountDetails subAccountsList, int SubAccountID = 0, int BVRowid = 0)
        {

            List<SubAccountsDimensions> sads = new List<SubAccountsDimensions>();

            if (subAccountsList != null)
            {
                sads = await Operations.opSubaccounts.StoreSubAccountDetails(subAccountsList, _context, SubAccountID, BVRowid, true) ;
            }
            else
            {
                return BadRequest();
            }
            if (sads != null)
            {
                return Ok("Records saved successfully");            }
            else
            {
                return BadRequest("Invalid data");
            }
         }

        // POST: api/SubAccountsDimensions
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
     //   [HttpPost]
        private async Task<ActionResult<APIResponse>> PostSubAccountsDimensions([FromBody]List<SubAccountsDimensions> subAccountsDimensionslist)
        {
            var res = new APIResponse();
            List<SubAccountsDimensions> lstSAD = new List<SubAccountsDimensions>();

            foreach (var item in subAccountsDimensionslist)
            {
                item.CreationDate = DateTime.UtcNow;
                item.UpdatedDate = DateTime.UtcNow;
                item.IsActive = true;
                item.IsDeleted = false;
                res.totalCount++;
            }

            await Operations.DBOperations.SaveBulkDBObjectUpdates<SubAccountsDimensions>(lstSAD, false, _context);

            res.message = "Successfully Saved";

            return res;

        }

        // DELETE: api/SubAccountsDimensions/5
        [HttpDelete]
        public async Task<ActionResult<string>> DeleteSubAccountsDimensions(List<int> ids)
        {
            string result = "";
            foreach (var id in ids)
            {
                var subaccountDimensions = await _context._SubAccountsDimensions.FindAsync(id);
                if (subaccountDimensions == null)
                {
                    // return NotFound();
                }

                _context.Entry(subaccountDimensions).State = EntityState.Modified;

                subaccountDimensions.UpdatedDate = DateTime.UtcNow;
                subaccountDimensions.IsDeleted = true;

                // _context._ReportingDimensions.Remove(reportingDimensions);
            }
            await _context.SaveChangesAsync();

            return result;

        }

        private bool SubAccountsDimensionsExists(int id)
        {
            return _context._SubAccountsDimensions.Any(e => e.SubAccountsDimensionID == id);
        }
    }
}
