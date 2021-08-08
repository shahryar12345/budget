using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using ABS.DBModels;

using ABSDAL.Context;
using System.Net.Http;
using ABSDAL.Operations;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace ABSDAL.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class StaffingWageAdjustmentController : ControllerBase
    {
        private readonly BudgetingContext _context;
        private readonly ILogger<StaffingWageAdjustmentController> _logger;

        public StaffingWageAdjustmentController(BudgetingContext context, ILogger<StaffingWageAdjustmentController> logger)
        {

            // Need to move to specific endpoint function as it will load data only on need basis.
            Operations.opBudgetVersions opBudgetVersions = new Operations.opBudgetVersions();
            _context = opBudgetVersions.getBudgetVersionContext(context);
            _logger = logger;
        }
        public Dictionary<int, string> monthDictionary = new Dictionary<int, string>()
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
        static HttpClient client = new HttpClient();

        [HttpPost]
        [Route("")]
        public async Task<ActionResult<string>> WageAdjustment(WageAdjustment wageAdjustment)
        {
            Operations.opBudgetVersions opBudgetVersions = new Operations.opBudgetVersions();
            Operations.opItemTypes _opItemTypes = new Operations.opItemTypes();

            // get the budget
            BudgetVersions budget = await _context._BudgetVersions.FindAsync(int.Parse(wageAdjustment.WageAdjustment_budgetversion_id));

            if (budget == null)
            {
                throw new ArgumentException("Budget version does not exist.");
            }

            List<ItemTypes> months = await _opItemTypes.getItemTypeObjbyKeyword("MONTHS", _context);

            List<int> wageAdjustmentIDs = new List<int>();

            // for each section save the wageAdjustment data
            foreach (WageAdjustmentSection section in wageAdjustment.WageAdjustmentsections)
            {
                wageAdjustmentIDs.Add(SaveWageAdjustment(budget, section, months));
                _context.SaveChanges();
            }

            // if a row previously existed and was deleted it will not be included in the data            
            if (DeleteUnusedWageAdjustmentRows(budget.BudgetVersionID, wageAdjustmentIDs))
            {
                return "Processing complete";
            }
            else
            {
                throw new ArgumentException("Error deleting unused wageAdjustment rows: " + string.Join(",", wageAdjustmentIDs));
            }

        }

        // GET: api/StaffingWageAdjustment/5
        [HttpGet("{staffingWageAdjustmentID}")]
        public async Task<ActionResult<StaffingWageAdjustment>> GetStaffingWageAdjustment(int staffingWageAdjustmentID)
        {
            var _contextInclude = Operations.opStaffingWageAdjustment.getopStaffingWageAdjustmentContext(_context);

            var staffingWageAdjustment = await _contextInclude.StaffingWageAdjustment.FindAsync(staffingWageAdjustmentID);

            if (staffingWageAdjustment == null)
            {
                return NotFound();
            }

            return Ok(staffingWageAdjustment);
        }

        [Route("GetStaffingWageAdjustmentsByBudgetVersionID")]
        [HttpGet]
        public async Task<ActionResult<List<StaffingWageAdjustment>>> GetStaffingWageAdjustmentsByBudgetVersionID(int budgetVersionid)
        {
            var _contextInclude = Operations.opStaffingWageAdjustment.getopStaffingWageAdjustmentContext(_context);

            var staffingWageAdjustments = await _contextInclude.StaffingWageAdjustment
                            .Where(a => a.BudgetVersion.BudgetVersionID == budgetVersionid
                            && a.IsDeleted == false && a.IsActive == true).ToListAsync();

            if (staffingWageAdjustments == null)
            {
                return NotFound();
            }

            return Ok(staffingWageAdjustments);
        }

        private int SaveWageAdjustment(BudgetVersions budget, WageAdjustmentSection section, List<ItemTypes> months)
        {
            // get the startMonth and endMonth
            ItemTypes startMonth = months.Where(m => m.ItemTypeValue == section.startMonth).FirstOrDefault();
            ItemTypes endMonth = months.Where(m => m.ItemTypeValue == section.endMonth).FirstOrDefault();

            // find a StaffingWageAdjustment for this budget combination if it exists
            StaffingWageAdjustment staffingWageAdjustment = _context.StaffingWageAdjustment.FirstOrDefault(sWA =>
            sWA.BudgetVersion.BudgetVersionID == budget.BudgetVersionID &&
            sWA.Entity.EntityID == int.Parse(section.dimensionRow.entity) &&
            sWA.Department.DepartmentID == int.Parse(section.dimensionRow.department) &&
            sWA.JobCode.JobCodeID == int.Parse(section.dimensionRow.jobCode) &&
            sWA.PayType.PayTypeID == int.Parse(section.dimensionRow.payType) &&
            sWA.StartMonth == startMonth &&
            sWA.EndMonth == endMonth);

            // if not found, create a new StaffingWageAdjustment
            if (staffingWageAdjustment == null)
            {
                staffingWageAdjustment = new StaffingWageAdjustment();
                staffingWageAdjustment.BudgetVersion = budget;
                staffingWageAdjustment.TimePeriodID = budget.TimePeriodID;
                staffingWageAdjustment.Entity = _context.Entities.FirstOrDefault(entity => entity.EntityID == int.Parse(section.dimensionRow.entity));
                staffingWageAdjustment.Department = _context.Departments.FirstOrDefault(department => department.DepartmentID == int.Parse(section.dimensionRow.department));
                staffingWageAdjustment.JobCode = _context.JobCodes.FirstOrDefault(jobCode => jobCode.JobCodeID == int.Parse(section.dimensionRow.jobCode));
                staffingWageAdjustment.PayType = _context.PayTypes.FirstOrDefault(payType => payType.PayTypeID == int.Parse(section.dimensionRow.payType));
                staffingWageAdjustment.StartMonth = startMonth;
                staffingWageAdjustment.EndMonth = endMonth;

                staffingWageAdjustment.IsActive = true;
                staffingWageAdjustment.IsDeleted = false;

                // add the new StaffingWageAdjustment
                _context.StaffingWageAdjustment.Add(staffingWageAdjustment);
            }

            staffingWageAdjustment.WageAdjustmentPercent = section.percentChange;

            // save all changes
            _context.SaveChanges();

            return staffingWageAdjustment.StaffingWageAdjustmentID;
        }

        private bool DeleteUnusedWageAdjustmentRows(int budgetVersionID, List<int> wageAdjustmentIDs)
        {
            // delete any rows for that budget version not in the list
            _context.StaffingWageAdjustment.RemoveRange(_context.StaffingWageAdjustment.Where(sWA => sWA.BudgetVersion.BudgetVersionID == budgetVersionID && !wageAdjustmentIDs.Contains(sWA.StaffingWageAdjustmentID)));
            _context.SaveChanges();

            return true;
        }
    }
}
