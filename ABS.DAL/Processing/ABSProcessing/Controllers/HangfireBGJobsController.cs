using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Hangfire.Storage;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ABSProcessing.Controllers
{
    [Route("/processing/[controller]")]
    [ApiController]
    public class HangfireBGJobsController : ControllerBase
    {
        // GET: api/HangfireBGJobs
        [HttpGet("GetJobStatus")]
        public IEnumerable<string> GetJobStatus(string JobID)
        {
            //var monitoringApi = JobStorage.Current.GetMonitoringApi();
            //var x = monitoringApi.GetStatistics();


            IStorageConnection connection = JobStorage.Current.GetConnection();
            JobData jobData = connection.GetJobData(JobID);
            string stateName = jobData.State;
             
            return new string[] { "ID:"+JobID,"status:"+stateName, "CreatedAt:"+jobData.CreatedAt.ToString() };
        }

        [HttpGet("TestBGJob")]
        public string  TestBGJob()
        {
            try
            {
                for (int i = 0; i < 2; i++)
                {
                    BackgroundJob.Enqueue(() => Console.WriteLine("Job started with   id :  " + i));
                   
                }
                 return "worked" ;
            }
            catch (Exception)
            {

                 return  "failed"  ;
            }
           
        }


    }
}
