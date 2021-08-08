using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels.Models.Reporting;
using ABSProcessing.Context;
using ABSProcessing.Operations;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ABSProcessing.Controllers
{
    [Route("/processing/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        public IServiceScopeFactory ServiceScopeFactory { get; }

        private readonly BudgetingContext _context;
        private readonly ILogger<ReportsController> _logger;

        public ReportsController(BudgetingContext context, ILogger<ReportsController> logger, IServiceScopeFactory _ServiceScopeFactory)
        {
            this.ServiceScopeFactory = _ServiceScopeFactory;

            _context = context;
            _logger = logger;
        }


        // POST: api/Reports
        [HttpPost]
        [Route("GenerateReport")]
        public async Task<string> GenerateReport([FromBody]List<ReportOutputConfiguration> ReportConfiguration)
        {

            await Task.Delay(1);

            Guid Identifier = Guid.NewGuid();
            var jobId = BackgroundJob.Enqueue(() => InitiateReportProcessing(ReportConfiguration, Identifier));
            await Operations.opBGJobs.InsertBGJob("REPORT_GENERATION_" + DateTime.UtcNow.ToString("yyyyMMddHHmmss"), Identifier.ToString(), Identifier, Identifier.ToString(), _context);

            return "Background job started with JobID: " + jobId + ", Identifier:" + Identifier;


        }



        [ApiExplorerSettings(IgnoreApi = true)]
        [NonAction]
        [AutomaticRetry(Attempts = 1)]
        public async Task InitiateReportProcessing(List<ReportOutputConfiguration> ReportConfiguration, Guid identifier)
        {
            await Task.Delay(1);


            var oprep = new Operations.opReports(ServiceScopeFactory);

            await oprep.ProcessReports(ReportConfiguration, identifier);

        }
        [HttpPost]
        [Route("ReportConfig")]
        public async Task<ReportConfig> ReportConfig([FromBody] ReportConfig ReportConfigJson)
        {
            await Task.Delay(1);


            return ReportConfigJson;
        }

        [HttpPost]
        [Route("DownloadReport")]
        public async Task<IActionResult> DownloadReport([FromBody]List<ReportOutputConfiguration> ReportConfiguration)
        {
            await Task.Delay(1);

            if (ReportConfiguration == null) { return BadRequest(); }
            else
            if (ReportConfiguration.Count < 1) { return BadRequest(); }
            else
            if (ReportConfiguration.Count > 0)
            {


                foreach (var item in ReportConfiguration)
                {

                    var reportdim = _context._ReportingDimensions.Where(f => f.ReportingDimensionID == item.reportConfigurationID
                    && f.IsActive == true
                    && f.IsDeleted == false).FirstOrDefault();


                    if (reportdim == null)
                    { return NotFound(); }
                    else
                    {

                        if (reportdim.ReportPath == null || reportdim.ReportPath == "")
                        {
                            if (reportdim.ReportData == null || reportdim.ReportData == "")
                            { return Content("file/data  not available"); }
                            else
                            {
                                var path= HelperFunctions.getfilepath("data", reportdim.Code);
                                var createfile = HelperFunctions.CreateoutputFile(reportdim.ReportData, path);

                                if (!createfile) { return Content("Error in file creation."); }
                                else
                                {
                                    var memory = new MemoryStream();
                                    using (var stream = new FileStream(path, FileMode.Open))
                                    {
                                        await stream.CopyToAsync(memory);
                                    }
                                    memory.Position = 0;
                                    return File(memory, GetContentType(path), Path.GetFileName(path));

                                }
                            }
                        }
                        else
                        {
                            var path = Path.Combine(
                                           Directory.GetCurrentDirectory(),
                                           "", reportdim.ReportPath);

                            if (!System.IO.File.Exists(path))
                            {
                                if (reportdim.ReportData == null || reportdim.ReportData == "")
                                { return Content("file  not available"); }
                                else
                                {
                                    //var filepath = HelperFunctions.getfilepath("data", reportdim.Code);
                                    var createfile = HelperFunctions.CreateoutputFile(reportdim.ReportData, path);

                                    if (!createfile) { return Content("Error in file creation."); }
                                }
                            }
                             



                            

                            
                            var memory = new MemoryStream();
                            using (var stream = new FileStream(path, FileMode.Open))
                            {
                                await stream.CopyToAsync(memory);
                            }
                            memory.Position = 0;
                            return File(memory, GetContentType(path), Path.GetFileName(path));
                        }
                    }
                }
            }
             
            
            
            return NotFound("file  not available");
            
        }

        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
    }
}
