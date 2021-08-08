using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.ADSIntegrator.Helper
{
    public class Logger
    {
        public static void LogMessage (string errorType,string methodname , string message)
        {

            Console.WriteLine(DateTime.UtcNow + "||" + Guid.NewGuid() + "||" + errorType.ToUpper()+"||" + methodname +"||" + message);
        }
        
        public static void LogMessage (Exception ex)
        {

            Console.WriteLine(DateTime.UtcNow + "||" + Guid.NewGuid() + "|| ERROR ||" + ex.Message +"||" + ex.StackTrace + "||"+ ex.InnerException  + "||" + ex.HelpLink + "||" + ex.Source + "||" + ex.Data + "||" + ex.HResult  + "||" + ex.TargetSite);
        }
    }
}
