using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ABS.DBModels.Processing;
using Hangfire;
using Newtonsoft.Json;
using ABSProcessing.Services;
using Microsoft.Extensions.DependencyInjection;
using ABS.DBModels;

namespace ABSProcessing.Controllers
{
   
    [Route("/processing/[controller]")]
    [ApiController]
    public class CalculationsController : ControllerBase
    {

         public IServiceScopeFactory ServiceScopeFactory { get; }

        public CalculationsController(          IServiceScopeFactory _ServiceScopeFactory ) {
            this.ServiceScopeFactory = _ServiceScopeFactory;
        }
        // GET: api/Calculations
        [HttpPost("ForecastMethods")]
        //  public async Task<ActionResult<string>> RunForecastMethods(Forecast forecast)
        public async Task<ActionResult<string>> RunForecastMethods(ForecastMethods FMObj)
        {

            /*
             
             1. JSON Parse
             2. Deserialize JSON Object
             3. Validate JSON
             4. Do the CALCULATIONS -  
             5. SEnd Response back with Validation Successful/failed and Summary Message

            

            Background JOB
            1. JSON Parse
             2. Deserialize JSON Object
             3. Validate JSON
             4. Do the CALCULATIONS 
                    a. Load ALL Data
                    b. Load BV Data
                    c. 
             5. Store the calculated values in DB
             6. Send Background job status.

             */
            try
            {

                Console.WriteLine("----- RunForecastMethods ------");

                Forecast FrcstObj = new Forecast();

                await Task.Delay(1);

                try
                {

                    //  FrcstObj = JsonConvert.DeserializeObject<Forecast>(FMObj.ToString());

                }
                catch (Exception ex)
                {

                }
                var jobId = BackgroundJob.Enqueue(() => BGJobProcess(Guid.NewGuid().ToString(), FMObj));

                Guid Identifier = Guid.NewGuid();

                return "Background job started with JobID: " + jobId + ", Identifier:" + Identifier;

            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                return "Error parsing Forecase Object";
            }


        }
        [AutomaticRetry(Attempts = 1)]

        public async Task BGJobProcess(string userid, ForecastMethods FrcstObj)
        {
            await Task.Delay(1);

            Console.WriteLine("Allah|o|Akbar");
            var process = new ApplyForecastMethod(ServiceScopeFactory);
            process.ForecastObject = FrcstObj;
            await process.BeginProcess(userid);


        }


      

    }
}
