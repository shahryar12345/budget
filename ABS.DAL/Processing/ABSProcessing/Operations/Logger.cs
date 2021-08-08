using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Operations
{
    public class Logger
    {
      //  private readonly ILogger _logger;

        private static ILogger logger;

        public static void Loginfo(string message)
        {
            Console.WriteLine(message);
            logger.Information(message);
        }
         public static void LogError(string message)
        {
           // Console.WriteLine(message);
            logger.Error(message);
        } public static void LogError(Exception ex)
        {
           // Console.WriteLine(message);
            logger.Error(ex, "");
        }

    }
}
