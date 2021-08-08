using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABSDAL.Context;
using ABS.DBModels;
using System.IO;
using System.Text;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SystemSettingsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public SystemSettingsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/SystemSettings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SystemSettings>>> GetAll_SystemSettings()
        {
            return await _context._SystemSettings.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
        }

        // GET: api/SystemSettings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SystemSettings>> GetSystemSettings(int id)
        {
            var systemSettings = await _context._SystemSettings.FindAsync(id);

            if (systemSettings == null)
            {
                return NotFound();
            }

            return systemSettings;
        }


        [Route("SystemSettingsbyUser")]
        [HttpGet("{UserProfileID}")]
        public async Task<ActionResult<IEnumerable<Object>>> SystemSettingsbyUser(int UserID)
        {
            var systemSettings = await _context._SystemSettings
                .Where( x => x.UserProfileID == UserID)
                .Select( d => new  { id = d.SettingID, SettingKey = d.SettingKey, SettingValue = d.SettingValue, UserID  = d.UserProfileID})
                .ToListAsync();

            if (systemSettings == null)
            {
                return NotFound();
            }

            return systemSettings;
        }



        // PUT: api/SystemSettings/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSystemSettings(int id, SystemSettings systemSettings)
        {
            if (id != systemSettings.SettingID)
            {
                return BadRequest();
            }

            _context.Entry(systemSettings).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SystemSettingsExists(id))
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

        // POST: api/SystemSettings
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        //[HttpPost]
        //public async Task<ActionResult<SystemSettings>> PostSystemSettings(SystemSettings systemSettings)
        //{

        //    _context._SystemSettings.Add(systemSettings);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetSystemSettings", new { id = systemSettings.SettingID }, systemSettings);
        //}

        // POST: api/SystemSettings
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<ABS.DBModels.APIResponse>> PostSystemSettings([FromBody] System.Text.Json.JsonElement  rawText)
        {

            //using (System.IO.StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
            //{
            //    //return await reader.ReadToEndAsync();
            //    Console.WriteLine(reader.ReadToEnd().ToString());
            //}
            //if (await Operations.opSystemSettings.UpdateSystemSettingsAsync(rawText, _context))
            //{
            //    return rawText.ToString();
            //}
            //else
            //{
            //    return "Operation Failed!!!";
            //}
            //Console.WriteLine(rawText.EnumerateArray().ToString());

            //Console.WriteLine(Request.HttpContext.Request.Body);
            return await Operations.opSystemSettings.UpdateSystemSettingsAsync(rawText, _context);
        }

        //public string PostSystemSettings([FromBody] System.Text.Json.JsonElement rawText)
        //{

        //    //using (System.IO.StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
        //    //{
        //    //    //return await reader.ReadToEndAsync();
        //    //    Console.WriteLine(reader.ReadToEnd().ToString());
        //    //}
        //    if (Operations.opSystemSettings.UpdateSystemSettings(rawText, _context))
        //    {
        //        return rawText.ToString();
        //    }
        //    else
        //    {
        //        return "Operation Failed!!!";
        //    }
        //    //Console.WriteLine(rawText.EnumerateArray().ToString());

        //    //Console.WriteLine(Request.HttpContext.Request.Body);

        //}

        // DELETE: api/SystemSettings/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SystemSettings>> DeleteSystemSettings(int id)
        {
            var systemSettings = await _context._SystemSettings.FindAsync(id);
            if (systemSettings == null)
            {
                return NotFound();
            }

            _context._SystemSettings.Remove(systemSettings);
            await _context.SaveChangesAsync();

            return systemSettings;
        }

        private bool SystemSettingsExists(int id)
        {
            return _context._SystemSettings.Any(e => e.SettingID == id);
        }
    }
}
