using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSDAL.Operations
{
    public class Logger
    {
      //  private readonly ILogger _logger;

      //  private static ILogger logger;

        public static void Loginfo(  string message,string messagekey = "")
        {
            Console.WriteLine(messagekey+"||"+message);
          //  logger.Information(message);
            
        } 
        
        public static void Loginfo(string message, Context.BudgetingContext _bgtC, string messagekey = "" )
        {

            var x = new ABS.DBModels.ApplicationLogging();
            x.ApplicationName = "BUDGETING";
            x.AppPath =   messagekey;
            x.ErrorLevel = "Information" ;
              
            x.MaintenanceLogDetails = message;
            x.Status = message  ;
            x.CreatedDate = DateTime.UtcNow;


            _bgtC._applicationLoggings.AddAsync(x);
            _bgtC.SaveChangesAsync();



            Console.WriteLine(message);
           // logger.Information(message);
            
        }
         public static void LogError(string message)
        {
            Console.WriteLine(message);
            //logger.Error(message);
        } 
        
        public static void LogError(Exception ex , string messagekey = "")
        {
            string errordetails = ""+messagekey+"||";
            errordetails += errordetails + ex ?? "" + "||";
            errordetails += errordetails + ex.Message ?? "" + "||";
            errordetails += errordetails + ex.TargetSite ?? "" + "||";
            errordetails += errordetails + ex.InnerException ?? ex.InnerException.ToString() ?? "" + "||";
            errordetails += errordetails + ex.StackTrace.ToString() ?? "" + "||";
            errordetails += errordetails + ex.Data.ToString() ?? "" + "||";
            errordetails += errordetails + ex.Source ?? "" + "||";
            Console.WriteLine(errordetails);
            //logger.Error(ex, "");
        } 
        public static void LogError(Exception ex,Context.BudgetingContext _bgtC, string messagekey = "" )
        {

            string errordetails = ""+messagekey+"||";
            errordetails += errordetails + ex != null ? ex.ToString() :  ""+ "||";
            errordetails += errordetails + ex.Message != null ? ex.Message.ToString() : "" + "||";
            errordetails += errordetails + ex.TargetSite != null ? ex.TargetSite.ToString() : "" + "||";
            if (ex.InnerException != null)
            {
                errordetails += errordetails +  ex.InnerException.ToString() + "" + "||";
            }
            errordetails += errordetails + ex.StackTrace != null ? ex.StackTrace.ToString() : "" + "||";
            errordetails += errordetails + ex.Data != null ? ex.Data.ToString() : "" + "||";
            errordetails += errordetails + ex.Source != null ? ex.Source.ToString() : "" + "||";

            var x = new ABS.DBModels.ApplicationLogging();
            x.ApplicationName = "BUDGETING";
            x.AppPath = ex.TargetSite != null ? ex.TargetSite.ToString() : "" + "||";
            x.ErrorLevel = "exception" + ex.Source != null ? ex.Source.ToString() : "" + "||";
            x.ErrorDetails = ex.InnerException != null ? ex.InnerException.ToString() : "" + "||";
            x.MaintenanceLogDetails = ex.StackTrace != null ? ex.StackTrace.ToString() : "" + "||";
            x.Status = ex.Data != null ? ex.Data.ToString() : "" + "||";



            _bgtC._applicationLoggings.AddAsync(x);
            _bgtC.SaveChangesAsync();

            
            Console.WriteLine(errordetails);
             
        }

    }
}
