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
    public class InflationController : ControllerBase
    {
        private readonly BudgetingContext _context;
        private readonly ILogger<InflationController> _logger;

        public InflationController(BudgetingContext context, ILogger<InflationController> logger)
        {

            // Need to move to specific endpoint function as it will load data only on need basis.
            Operations.opBudgetVersions opBudgetVersions = new Operations.opBudgetVersions();
            _context = opBudgetVersions.getBudgetVersionContext(context);
            _logger = logger;
        }

        static HttpClient client = new HttpClient();

        [HttpPost]
        [Route("")]
        public async Task<ActionResult<string>> Inflation(Inflation inflation)
        {
            Operations.opBudgetVersions opBudgetVersions = new Operations.opBudgetVersions();
            Operations.opItemTypes _opItemTypes = new Operations.opItemTypes();

            // get the budget
            BudgetVersions budget = await _context._BudgetVersions.FindAsync(int.Parse(inflation.Inflation_budgetversion_id));

            if (budget == null)
            {
                throw new ArgumentException("Budget version does not exist.");
            }

            var allExisting = GetInflationsByBudgetVersionID(budget.BudgetVersionID);
            List<InflationSection> allinflationsection = inflation.Inflationsections.ToList();

            List<ItemTypes> months = await _opItemTypes.getItemTypeObjbyKeyword("MONTHS", _context);

            List<int> inflationIDs = new List<int>();

            // for each section save the inflation data
            foreach (InflationSection section in inflation.Inflationsections)
            {
                inflationIDs.Add(SaveInflation(budget, section, months));
                _context.SaveChanges();
            }
            
            // if a row previously existed and was deleted it will not be included in the data            
            if (DeleteUnusedInflationRows(budget.BudgetVersionID, inflationIDs))
            {
                return "Processing complete";
            }
            else
            {
                throw new ArgumentException("Error deleting unused inflation rows: " + string.Join(",", inflationIDs));
            }

        }

        // GET: api/Inflation/5
        [HttpGet("{glAccountsInflationid}")]
        public async Task<ActionResult<GLAccountsInflation>> GetInflation(int glAccountsInflationid)
        {
            var _contextInclude = Operations.opGLAccountsInflation.getopGLAccountsInflationContext(_context);

            var glAccountsInflation = await _contextInclude.GLAccountsInflation.FindAsync(glAccountsInflationid);

            if (glAccountsInflation == null)
            {
                return NotFound();
            }

            return Ok(glAccountsInflation);
        }

        [Route("GetInflationsByBudgetVersionID")]
        [HttpGet]
        public async Task<ActionResult<List<GLAccountsInflation>>> GetInflationsByBudgetVersionID(int budgetVersionid)
        {
            var _contextInclude = Operations.opGLAccountsInflation.getopGLAccountsInflationContext(_context);

            var glAccountInflations = await _contextInclude.GLAccountsInflation
                            .Where(a => a.BudgetVersion.BudgetVersionID == budgetVersionid
                            && a.IsDeleted == false && a.IsActive == true).ToListAsync();

            if (glAccountInflations == null)
            {
                return NotFound();
            }

            return Ok(glAccountInflations);
        }

        private int SaveInflation(BudgetVersions budget, InflationSection section, List<ItemTypes> months)
        {
            // get the startMonth and endMonth
            ItemTypes startMonth = months.Where(m => m.ItemTypeValue == section.startMonth).FirstOrDefault();
            ItemTypes endMonth = months.Where(m => m.ItemTypeValue == section.endMonth).FirstOrDefault();

            // find a GLAccountsInflation for this budget combination if it exists
            GLAccountsInflation glAccountsInflation = _context.GLAccountsInflation.FirstOrDefault(glInf =>
            glInf.BudgetVersion.BudgetVersionID == budget.BudgetVersionID &&
            glInf.Entity.EntityID == int.Parse(section.dimensionRow.entity) &&
            glInf.Department.DepartmentID == int.Parse(section.dimensionRow.department) &&
            glInf.GLAccount.GLAccountID == int.Parse(section.dimensionRow.generalLedger) &&
            glInf.StartMonth == startMonth &&
            glInf.EndMonth == endMonth);

            // if not found, create a new GLAccountsInflation
            if (glAccountsInflation == null)
            {
                glAccountsInflation = new GLAccountsInflation();
                glAccountsInflation.BudgetVersion = budget;
                glAccountsInflation.TimePeriodID = budget.TimePeriodID;
                glAccountsInflation.Entity = _context.Entities.FirstOrDefault(entity => entity.EntityID == int.Parse(section.dimensionRow.entity));
                glAccountsInflation.Department = _context.Departments.FirstOrDefault(department => department.DepartmentID == int.Parse(section.dimensionRow.department));
                glAccountsInflation.GLAccount = _context.GLAccounts.FirstOrDefault(generalLedger => generalLedger.GLAccountID == int.Parse(section.dimensionRow.generalLedger));
                glAccountsInflation.StartMonth = startMonth;
                glAccountsInflation.EndMonth = endMonth;

                glAccountsInflation.IsActive = true;
                glAccountsInflation.IsDeleted = false;
                glAccountsInflation.CreationDate = DateTime.UtcNow;
                glAccountsInflation.UpdatedDate = DateTime.UtcNow;

                glAccountsInflation.InflationPercent = section.percentChange;

                // add the new GLAccountsInflation
                _context.GLAccountsInflation.Add(glAccountsInflation);
            }
            else
            {
                glAccountsInflation.InflationPercent = section.percentChange;
                glAccountsInflation.UpdatedDate = DateTime.UtcNow;
            }


            // save all changes
            _context.SaveChanges();

            return glAccountsInflation.GLAccountsInflationID;
        }

        private bool DeleteUnusedInflationRows(int budgetVersionID, List<int> inflationIDs)
        {
            // delete any rows for that budget version not in the list
            _context.GLAccountsInflation.RemoveRange(_context.GLAccountsInflation.Where(glInf => glInf.BudgetVersion.BudgetVersionID == budgetVersionID && !inflationIDs.Contains(glInf.GLAccountsInflationID)));
            _context.SaveChanges();

            return true;
        }
    }
}