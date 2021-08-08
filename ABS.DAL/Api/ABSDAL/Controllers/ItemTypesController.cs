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
    public class ItemTypesController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public ItemTypesController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/ItemTypes
        [HttpGet]
        [Cached(86400)]
        public async Task<ActionResult<IEnumerable<ItemTypes>>> GetAll_ItemTypes()
        {
            return Ok(await _context._ItemTypes
                   .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                  .ToListAsync());
        }


        [Route("GetADSGL")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetADSGeneralLedger()
        {
            var ADSGL = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "ADSGENERALLEDGER" && x.IsActive == true && x.IsDeleted == false)
              .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                    .ToListAsync();

            if (ADSGL == null)
            {
                return NotFound();
            }

            return Ok(ADSGL);
        }

        [Route("GetADSStaff")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetADSStaff()
        {
            var ADSStaff = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "ADSSTAFF" && x.IsActive == true && x.IsDeleted == false)
               .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                    .ToListAsync();

            if (ADSStaff == null)
            {
                return NotFound();
            }

            return Ok(ADSStaff);
        }

        [Route("GetADSStatistics")]
        [HttpGet]

        public async Task<ActionResult<IEnumerable<Object>>> GetADSStatistics()
        {
            var ADSStaff = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "ADSSTATISTICS" && x.IsActive == true && x.IsDeleted == false)
               .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                   .ToListAsync();

            if (ADSStaff == null)
            {
                return NotFound();
            }

            return Ok(ADSStaff);
        }

        [Route("GetMonths")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetItemTypesMonths()
        {
            var GetMonths = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "MONTHS" && x.IsActive == true && x.IsDeleted == false)
              .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                    .ToListAsync();

            if (GetMonths == null)
            {
                return NotFound();
            }

            return Ok(GetMonths);
        }

        [Route("GetDateFormats")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetDateFormats()
        {
            try
            {
                var GetDateFormats = await _context._ItemTypes
                    .Where(x => x.ItemTypeKeyword.ToUpper() == "DATEFORMATS" && x.IsActive == true && x.IsDeleted == false)
                  .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                    .ToListAsync();

                if (GetDateFormats == null)
                {
                    return NotFound();
                }

                return Ok(GetDateFormats);
            }
            catch (Exception ex)
            {
                Operations.Logger.LogError(ex, _context);
                return NotFound();
            }
        }

        [Route("GetDecimalPlaces")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetDecimalPlaces()
        {
            var GetDecimalPlaces = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "DECIMALPLACES" && x.IsActive == true && x.IsDeleted == false)
             .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                    .ToListAsync();

            if (GetDecimalPlaces == null)
            {
                return NotFound();
            }

            return Ok(GetDecimalPlaces);
        }


        [Route("GetScenariotype")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetScenariotype()
        {
            var GetScenariotype = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "SCENARIOTYPE" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetScenariotype == null)
            {
                return NotFound();
            }

            return Ok(GetScenariotype);
        }


        [Route("GetBudgetVersionType")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetBudgetVersionType()
        {
            var GetBudgetVersionType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "BUDGETVERSIONTYPE" && x.IsActive == true && x.IsDeleted == false)
              .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                    .ToListAsync();

            if (GetBudgetVersionType == null)
            {
                return NotFound();
            }

            return Ok(GetBudgetVersionType);
        }
        [Route("GetBudgetType")]
        [HttpGet]

        public async Task<ActionResult<IEnumerable<Object>>> GetBudgetType()
        {
            var GetBudgetType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "BUDGETTYPE" && x.IsActive == true && x.IsDeleted == false)
           .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                       .ToListAsync();

            if (GetBudgetType == null)
            {
                return NotFound();
            }

            return Ok(GetBudgetType);
        }

        [Route("GetForecastMethodType")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetForecastMethodType()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "FORECASTMETHODTYPE" && x.IsActive == true && x.IsDeleted == false)
           .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }


        [Route("GetFiscalYear")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetFiscalYear()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "FISCALYEAR" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }

        [Route("GetStatisticsData")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetStatisticsData()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "STATISTICSDATA" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemTypeDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }

        [Route("GetGeneralLedgerData")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetGeneralLedgerData()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "GENERALLEDGERDATA" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemTypeDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }

        [Route("GetStaffingData")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetStaffingData()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "STAFFINGDATA" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemTypeDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }


        [Route("GetStaffingDataType")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetStaffingDataType()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "STAFFINGDATATYPE" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemTypeDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }
        
        [Route("GetReportMeasures")]
        [HttpGet]
        [Cached(86400)]
        public async Task<ActionResult<IEnumerable<Object>>> GetReportMeasures()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "MEASURES" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemTypeDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }

        [Route("GetReportQuarters")]
        [HttpGet]
        [Cached(86400)]
        public async Task<ActionResult<IEnumerable<Object>>> GetReportQuarters()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "QUARTER" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemTypeDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }
       
        [Route("GetReportFileFormats")]
        [HttpGet]
        [Cached(86400)]
        public async Task<ActionResult<IEnumerable<Object>>> GetReportFileFormats()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "FILEFORMAT" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemTypeDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }
        
        [Route("GetReportPeriods")]
        [HttpGet]
        [Cached(86400)]
        public async Task<ActionResult<IEnumerable<Object>>> GetReportPeriods()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "PERIODS" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemTypeDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }

        [Route("GetReportDisplayOptions")]
        [HttpGet]
        [Cached(86400)]
        public async Task<ActionResult<IEnumerable<Object>>> GetReportDisplayOptions()
        {
            var GetForecastMethodType = await _context._ItemTypes
                .Where(x => x.ItemTypeKeyword.ToUpper() == "REPORTDISPLAY" && x.IsActive == true && x.IsDeleted == false)
            .Select(a => new { itemTypeID = a.ItemTypeID, itemTypeKeyword = a.ItemTypeKeyword, itemTypeCode = a.ItemTypeCode, itemTypeValue = a.ItemTypeValue, itemDataType = a.ItemDataType, itemTypeDisplayName = a.ItemTypeDisplayName })
                      .ToListAsync();

            if (GetForecastMethodType == null)
            {
                return NotFound();
            }

            return Ok(GetForecastMethodType);
        }


        // GET: api/ItemTypes/5
        [HttpGet("{id}")]
        [Cached(12000)]

        public async Task<ActionResult<ItemTypes>> GetItemTypes(int id)
        {
            var itemTypes = await _context._ItemTypes.FindAsync(id);

            if (itemTypes == null)
            {
                return NotFound();
            }

            return Ok(itemTypes);
        }

        // PUT: api/ItemTypes/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItemTypes(int id, ItemTypes itemTypes)
        {
            if (id != itemTypes.ItemTypeID)
            {
                return BadRequest();
            }

            _context.Entry(itemTypes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemTypesExists(id))
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

        // POST: api/ItemTypes
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        //[HttpPost]
        //public async Task<ActionResult<ItemTypes>> PostItemTypes(ItemTypes itemTypes)
        //{
        //    _context._ItemTypes.Add(itemTypes);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetItemTypes", new { id = itemTypes.ItemTypeID }, itemTypes);
        //}

        // POST: api/ItemTypes
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<string>> PostItemTypes([FromBody] System.Text.Json.JsonElement rawText)
        {
            if (await Operations.opItemTypes.UpdateItemTypesAsync(rawText, _context))
            {
                return rawText.ToString();
            }
            else
            {
                return "Operation Failed!!!";
            }
        }



        // DELETE: api/ItemTypes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ItemTypes>> DeleteItemTypes(int id)
        {
            var itemTypes = await _context._ItemTypes.FindAsync(id);
            if (itemTypes == null)
            {
                return NotFound();
            }

            _context._ItemTypes.Remove(itemTypes);
            await _context.SaveChangesAsync();

            return itemTypes;
        }

        private bool ItemTypesExists(int id)
        {
            return _context._ItemTypes.Any(e => e.ItemTypeID == id);
        }
    }
}
