using ABS.ADSIntegrator.Operations;
using Hangfire;
using Hangfire.Common;
using Hangfire.Storage;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ABS.ADSIntegrator.HangfireHelper
{
    public class JobScheduler
    {

        public static void SchedulenRunJobs (IConfiguration Configuration)
        {


            // get the endpoint list and create or update schedulers for any that have an endpoint and interval set
            Helper.HTTPClientHelper httpClientHelper = new Helper.HTTPClientHelper(Configuration);
            List<APIEndpoint> endpointList = httpClientHelper.getHttpClientList();
            var manager = new RecurringJobManager();
            List<string> currentJobs = new List<string>();
            string integrationJobPrefix = "IntegrationJob_";

            ABSClient.ADSData adsData = new ABSClient.ADSData(null, Configuration);
            ADSIntegrator.Controllers.ADSDataImport adsDatactr = new Controllers.ADSDataImport(Configuration,null);

            foreach (APIEndpoint endpoint in endpointList)
            {
                if (endpoint.Function != null && endpoint.Function != "" && (endpoint.Interval != null || endpoint.cronstring != ""))
                {
                    // use reflection to get the method to execute and verify it is a real method
                    MethodInfo endpointMethod = adsData.GetType().GetMethod(endpoint.Function);
                    if (endpointMethod != null)
                    {
                        // create or update the job and add it to the currentJobs list which will be used to delete unused jobs later
                        Job job = new Job(adsData.GetType(), endpointMethod);
                        string jobname = integrationJobPrefix + endpoint.Function;
                        
                        manager.RemoveIfExists(jobname);
                        manager.AddOrUpdate(jobname, job, endpoint.cronstring, TimeZoneInfo.Utc);
                        currentJobs.Add(jobname);
                        
                    }
                    else
                    {
                        MethodInfo endpointMethod2 = adsDatactr.GetType().GetMethod(endpoint.Function);
                        if (endpointMethod2 != null )
                        {

                            Job job = new Job(adsDatactr.GetType(), endpointMethod2);
                            //manager.AddOrUpdate(integrationJobPrefix + endpoint.Function, job, "*/" + (int)endpoint.Interval + " * * * *", TimeZoneInfo.Utc);
                            //currentJobs.Add(integrationJobPrefix + endpoint.Function);
                            string jobname = integrationJobPrefix + endpoint.Function;

                            manager.RemoveIfExists(jobname);
                            manager.AddOrUpdate(jobname, job, endpoint.cronstring, TimeZoneInfo.Utc);
                            currentJobs.Add(jobname);

                        }
                    }
                }
            }

            // collect active jobs, make sure integration jobs are still valid (were just found in endpoints and added/updated)
            List<RecurringJobDto> recurringJobs = Hangfire.JobStorage.Current.GetConnection().GetRecurringJobs();
            foreach (RecurringJobDto recurringJob in recurringJobs)
            {
                // startswith is in case hangfire gets used for other purposes this will only delete unneeded integration jobs
                if (recurringJob.Id.StartsWith(integrationJobPrefix) && !currentJobs.Contains(recurringJob.Id))
                {
                    manager.RemoveIfExists(recurringJob.Id);
                }
            }

            // if you need to see the current recurring jobs
            // List<RecurringJobDto> recurringJobs = Hangfire.JobStorage.Current.GetConnection().GetRecurringJobs();

            // job runs once
            //var jobId = BackgroundJob.Enqueue(() => Console.WriteLine("Fire-and-forget!"));

            // job runs daily (minutly, hourly, monthly, weekly, yearly) (interval functions are going to be removed in an update so use cron strings instead "*/5 * * * *")
            // RecurringJob.AddOrUpdate(() => Console.WriteLine("Recurring!"), Cron.Daily);

            // job runs one time 7 days from now
            // var jobId = BackgroundJob.Schedule(() => Console.WriteLine("Delayed!"), TimeSpan.FromDays(7));

            // execute a job after another job has finished
            // BackgroundJob.ContinueJobWith(jobId,() => Console.WriteLine("Continuation!"));
        }
    }
}
