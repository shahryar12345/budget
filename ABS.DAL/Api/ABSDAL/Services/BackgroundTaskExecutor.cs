using ABSDAL.Context;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ABSDAL.Services
{
    public class BackgroundTaskExecutor : BackgroundService
    {
        public IBackgroundTaskQueue TaskQueue { get; }

        public BackgroundTaskExecutor(IBackgroundTaskQueue taskQueue)
        {
            TaskQueue = taskQueue;
        }


        protected async override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                Console.WriteLine  ("Queued Hosted Service is starting.");
                #region backgrountask

                await BackgroundProcessing(stoppingToken);
                #endregion
                Console.WriteLine   ("Queued Hosted Service is stopping.");

            }
            catch (Exception)
            {

                throw;
            }
            return;
        }

        private async Task BackgroundProcessing(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                
                var workItem =
                    await TaskQueue.DequeueAsync(stoppingToken);

                try
                {
                    Console.WriteLine("FS_BACKGROUNJOB_EXECUTING_WORKITEM");
                    await workItem(stoppingToken);
                }
                catch (Exception ex)
                {
                    Console.WriteLine  (ex+ Environment.NewLine+
                        "Error occurred executing {WorkItem}."+ Environment.NewLine +nameof(workItem));
                }
            }
        }

    }
}
