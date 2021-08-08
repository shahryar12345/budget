using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ABSDAL.Operations
{
    public class opFileImport
    {

        static void FIlePRocess(string[] args)
        {
            Console.WriteLine("Hello World!");

            ParseSTData();
            //ParseSFData();
            //ParseGLData();



            Console.ReadLine();

        }

        private static void ParseGLData()
        {
            string[] csvlines = File.ReadAllLines(@"C:\\Users\\shaikfaz\\Downloads\\FY19STAT.csv");
            //string[] csvlines = File.ReadAllLines(@"C:\\Users\\shaikfaz\\Downloads\\hosp19staffingPVHcsv_dollars.csv");
            //select the indices of the columns we want
            var cols = csvlines[0].Split(',').ToList();
            ////now go through the remaining lines
            ///

            string FilePath = @"C:\\Users\\shaikfaz\\Downloads\\FY19STAT.csv";
            var csv = new StringBuilder();


            List<string> query = new List<string>();
            //List<sfdata> flst = new List<sfdata>();   
            List<glstat> flst = new List<glstat>();
            foreach (var line in csvlines.Skip(1))
            {
                var line_values = line.Split(',').ToList();



                var f = new glstat();






                //var f = new sfdata();

                //f.Account = line_values[0];
                //f.StatMaster = line_values[1];
                //f.DEPT = line_values[2];
                //f.DeptMstr = line_values[3];
                //f.GLDataScenario = line_values[4];
                //f.FiscalYear = line_values[5];
                //f.Entity = line_values[6];
                //f.Month = line_values[7];
                //f.Amount = line_values[8];

                f.GLDataScenario = line_values[0];
                f.Entity = line_values[1];

                f.DEPT = line_values[2];



                // f.FiscalYear = line_values[3];
                // f.DeptMstr = line_values[5];


                //f.StatMaster = line_values[6];
                //f.AT = line_values[7];

                f.Month = line_values[8];
                f.Amount = line_values[9];


                var tt = flst.Where(
                    q => q.GLDataScenario == f.GLDataScenario
                    // && q.FiscalYear == f.FiscalYear
                    && q.Account == f.Account
                    && q.Entity == f.Entity
                    && q.DEPT == f.DEPT


                    ).FirstOrDefault();


                DateTime ax = DateTime.Parse(f.Month);

                string monname = ax.Month.ToString("MMMM");
                string monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(ax.Month);



                string a = "";
                if (tt == null)

                {
                    a = " insert into [StatisticalData] (entityID, departmentid,  [GlAccoutnIDGLAccountID],StatisticTimePeriodTimePeriodID , DataScenarioDataIDDataScenarioID , isactive, isdeleted, " + monthName + " ) values (" + Environment.NewLine +
                    "  (select entityid from entities where entitycode = '" + f.Entity + "')" + Environment.NewLine +
                    " ,  (select departmentid from departments where departmentcode = '" + f.DEPT + "')" + Environment.NewLine +
                    " ,   (select GLAccountID from GLAccounts where GLAccountCode = '" + f.Account + "')" + Environment.NewLine +
                    " ,  (select timeperiodid from TimePeriods where TimePeriodCode = '" + f.FiscalYear + "')" + Environment.NewLine +
                    " ,  (select DataScenarioID from DataScenario where DataScenarioCode = '" + f.GLDataScenario + "')" +
                    ", 1 " +
                    ", 0 " +
                    ", " + f.Amount + ") " + Environment.NewLine + "GO" + Environment.NewLine;


                    ;

                }
                else
                {


                    a = " update [StatisticalData] set " + monthName + " = " + f.Amount + " where " + Environment.NewLine +
                      "entityid = (select entityid from entities where entitycode = '" + f.Entity + "')" + Environment.NewLine +
                      " and departmentid = (select departmentid from departments where departmentcode = '" + f.DEPT + "')" + Environment.NewLine +
                      " and GlAccoutnIDGLAccountID = (select GLAccountID from GLAccounts where GLAccountCode = '" + f.Account + "')" + Environment.NewLine +
                      " and StatisticTimePeriodTimePeriodID = (select timeperiodid from TimePeriods where TimePeriodCode = '" + f.FiscalYear + "')" + Environment.NewLine +
                      " and DataScenarioDataIDDataScenarioID = (select DataScenarioID from DataScenario where DataScenarioCode = '" + f.GLDataScenario + "')"
                      + Environment.NewLine + "GO" + Environment.NewLine;

                    ;


                }
                query.Add(a);
                flst.Add(f);


                csv.Append(a);

                Console.WriteLine(a);

            }
            File.WriteAllText(FilePath, csv.ToString());

        }

        private static void ParseSFData()
        {
            string[] csvlines = File.ReadAllLines(@"C:\\Users\\shaikfaz\\Downloads\\FY19STAT.csv");
            //string[] csvlines = File.ReadAllLines(@"C:\\Users\\shaikfaz\\Downloads\\hosp19staffingPVHcsv_dollars.csv");
            //select the indices of the columns we want
            var cols = csvlines[0].Split(',').ToList();
            ////now go through the remaining lines
            ///

            string FilePath = @"C:\\Users\\shaikfaz\\Downloads\\FY19STAT.csv";
            var csv = new StringBuilder();


            List<string> query = new List<string>();
            //List<sfdata> flst = new List<sfdata>();   
            List<sfdata> flst = new List<sfdata>();
            foreach (var line in csvlines.Skip(1))
            {
                var line_values = line.Split(',').ToList();








                var f = new sfdata();

                f.DEPT = line_values[2];
                f.DeptMstr = line_values[3];
                f.FiscalYear = line_values[5];
                f.Entity = line_values[6];
                f.Month = line_values[7];
                f.Amount = line_values[8];

                f.StatDataScenario = line_values[0];
                f.Entity = line_values[1];

                f.DEPT = line_values[2];

                f.JC = line_values[4];
                f.PT = line_values[6];

                // f.FiscalYear = line_values[3];
                // f.DeptMstr = line_values[5];


                //f.StatMaster = line_values[6];
                //f.AT = line_values[7];

                f.Month = line_values[8];
                f.Amount = line_values[9];


                var tt = flst.Where(
                    q => q.StatDataScenario == f.StatDataScenario
                    // && q.FiscalYear == f.FiscalYear
                    && q.JC == f.JC
                    && q.PT == f.PT
                    && q.Entity == f.Entity
                    && q.DEPT == f.DEPT


                    ).FirstOrDefault();


                DateTime ax = DateTime.Parse(f.Month);

                string monname = ax.Month.ToString("MMMM");
                string monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(ax.Month);



                string a = "";
                if (tt == null)

                {
                    //a = " insert into [StatisticalData] (entityID, departmentid,  [GlAccoutnIDGLAccountID],StatisticTimePeriodTimePeriodID , DataScenarioDataIDDataScenarioID , isactive, isdeleted, " + monthName + " ) values (" + Environment.NewLine +
                    //"  (select entityid from entities where entitycode = '" + f.Entity + "')" + Environment.NewLine +
                    //" ,  (select departmentid from departments where departmentcode = '" + f.DEPT + "')" + Environment.NewLine +
                    //" ,   (select GLAccountID from GLAccounts where GLAccountCode = '" + f.Account + "')" + Environment.NewLine +
                    //" ,  (select timeperiodid from TimePeriods where TimePeriodCode = '" + f.FiscalYear + "')" + Environment.NewLine +
                    //" ,  (select DataScenarioID from DataScenario where DataScenarioCode = '" + f.GLDataScenario + "')" +
                    //", 1 " +
                    //", 0 " +
                    //", "+ f.Amount +") "+ Environment.NewLine + "GO" + Environment.NewLine;


                    //;
                    a = " insert into [StaffingData] (entityID, departmentid,  [JobCodeID],[PayTypeID] ,[StaffingTimePeriodTimePeriodID] , [DataScenarioID1], isactive, isdeleted, " + monthName + " ) values (" + Environment.NewLine +
                    "  (select entityid from entities where entitycode = '" + f.Entity + "')" + Environment.NewLine +
                    " ,  (select departmentid from departments where departmentcode = '" + f.DEPT + "')" + Environment.NewLine +
                    " ,   (select JOBCODEID from JobCodes where jobcodecode = '" + f.JC + "')" + Environment.NewLine +
                    " ,   (select PAYTYPEID from PayTypes where paytypecode = '" + f.PT + "')" + Environment.NewLine +
                    " ,  (select timeperiodid from TimePeriods where TimePeriodCode = 'FY19')" + Environment.NewLine +
                    " ,  (select DataScenarioID from DataScenario where DataScenarioCode = '" + f.StatDataScenario + "')" +
                    ", 1 " +
                    ", 0 " +
                    ", " + f.Amount + ") " + Environment.NewLine + "GO" + Environment.NewLine;


                    ;
                }
                else
                {


                    //a = " update [StatisticalData] set " + monthName + " = " + f.Amount + " where " + Environment.NewLine +
                    //  "entityid = (select entityid from entities where entitycode = '" + f.Entity + "')" + Environment.NewLine +
                    //  " and departmentid = (select departmentid from departments where departmentcode = '" + f.DEPT + "')" + Environment.NewLine +
                    //  " and GlAccoutnIDGLAccountID = (select GLAccountID from GLAccounts where GLAccountCode = '" + f.Account + "')" + Environment.NewLine +
                    //  " and StatisticTimePeriodTimePeriodID = (select timeperiodid from TimePeriods where TimePeriodCode = '" + f.FiscalYear + "')" + Environment.NewLine +
                    //  " and DataScenarioDataIDDataScenarioID = (select DataScenarioID from DataScenario where DataScenarioCode = '" + f.GLDataScenario + "')"
                    //  + Environment.NewLine + "GO" + Environment.NewLine;

                    //; 

                    a = " update [StaffingData] set " + monthName + " = " + f.Amount + " where " + Environment.NewLine +
                      "entityid = (select entityid from entities where entitycode = '" + f.Entity + "')" + Environment.NewLine +
                      " and departmentid = (select departmentid from departments where departmentcode = '" + f.DEPT + "')" + Environment.NewLine +
                      " and JOBCODEID = (select JOBCODEID from JobCodes where jobcodecode = '" + f.JC + "')" + Environment.NewLine +
                      " and PAYTYPEID = (select PAYTYPEID from PayTypes where paytypecode = '" + f.PT + "')" + Environment.NewLine +
                      " and StaffingTimePeriodTimePeriodID = (select timeperiodid from TimePeriods where TimePeriodCode = 'FY19')" + Environment.NewLine +
                      " and [DataScenarioID1] = (select DataScenarioID from DataScenario where DataScenarioCode = '" + f.StatDataScenario + "')"
                      + " and StaffingAccountTypeID <> 108 "
                      + Environment.NewLine + "GO" + Environment.NewLine;

                    ;
                }
                query.Add(a);
                flst.Add(f);


                csv.Append(a);

                Console.WriteLine(a);

            }
            File.WriteAllText(FilePath, csv.ToString());

        }

        private static void ParseSTData()
        {
            string[] csvlines = File.ReadAllLines(@"C:\\Users\\shaikfaz\\Downloads\\FY19STAT.csv");
            //string[] csvlines = File.ReadAllLines(@"C:\\Users\\shaikfaz\\Downloads\\hosp19staffingPVHcsv_dollars.csv");
            //select the indices of the columns we want
            var cols = csvlines[0].Split(',').ToList();
            ////now go through the remaining lines
            ///

            string FilePath = @"C:\\Users\\shaikfaz\\Downloads\\FY19STAT_output.csv";
            var csv = new StringBuilder();


            List<string> query = new List<string>();
            List<statsdata> flst = new List<statsdata>();
            foreach (var line in csvlines.Skip(1))
            {
                var line_values = line.Split(',').ToList();



                var f = new statsdata();

                f.StatCode = line_values[0];
                f.StatMaster = line_values[1];
                f.DEPT = line_values[2];
                f.DeptMstr = line_values[3];
                f.StatDataScenario = line_values[4];
                f.FiscalYear = line_values[5];
                f.Entity = line_values[6];
                f.Month = line_values[7];
                f.Amount = line_values[8];





                var tt = flst.Where(
                    q => q.StatDataScenario == f.StatDataScenario
                      && q.FiscalYear == f.FiscalYear
                    && q.StatCode == f.StatCode
                    && q.Entity == f.Entity
                    && q.DEPT == f.DEPT


                    ).FirstOrDefault();


                DateTime ax = DateTime.Parse(f.Month);

                string monname = ax.Month.ToString("MMMM");
                string monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(ax.Month);



                string a = "";
                if (tt == null)

                {
                    a = " insert into [StatisticalData] (entityID, departmentid,  [StatisticCodeStatisticsCodeID],StatisticTimePeriodTimePeriodID , DataScenarioDataIDDataScenarioID , isactive, isdeleted, " + monthName + " ) values (" + Environment.NewLine +
                    "  (select entityid from entities where entitycode = '" + f.Entity + "')" + Environment.NewLine +
                    " ,  (select departmentid from departments where departmentcode = '" + f.DEPT + "')" + Environment.NewLine +
                    " ,   (select StatisticsCodeID from statisticscodes where statisticscode = '" + f.StatCode + "')" + Environment.NewLine +
                    " ,  (select timeperiodid from TimePeriods where TimePeriodCode = '" + f.FiscalYear + "')" + Environment.NewLine +
                    " ,  (select DataScenarioID from DataScenario where DataScenarioCode = '" + f.StatDataScenario + "')" +
                    ", 1 " +
                    ", 0 " +
                    ", " + f.Amount + ") " + Environment.NewLine + "GO" + Environment.NewLine;


                    ;

                }
                else
                {


                    a = " update [StatisticalData] set " + monthName + " = " + f.Amount + " where " + Environment.NewLine +
                      "entityid = (select entityid from entities where entitycode = '" + f.Entity + "')" + Environment.NewLine +
                      " and departmentid = (select departmentid from departments where departmentcode = '" + f.DEPT + "')" + Environment.NewLine +
                      " and StatisticCodeStatisticsCodeID = (select StatisticsCodeID from statisticscodes where statisticscode = '" + f.StatCode + "')" + Environment.NewLine +
                      " and StatisticTimePeriodTimePeriodID = (select timeperiodid from TimePeriods where TimePeriodCode = '" + f.FiscalYear + "')" + Environment.NewLine +
                      " and DataScenarioDataIDDataScenarioID = (select DataScenarioID from DataScenario where DataScenarioCode = '" + f.StatDataScenario + "')"
                      + Environment.NewLine + "GO" + Environment.NewLine;

                    ;


                }
                query.Add(a);
                flst.Add(f);


                csv.Append(a);

                Console.WriteLine(a);

            }
            File.WriteAllText(FilePath, csv.ToString());

        }





        public class sfdata
        {
            public string JC { get; set; }
            public string JCM { get; set; }
            public string PT { get; set; }
            public string PTM { get; set; }
            public string DEPT { get; set; }
            public string DeptMstr { get; set; }
            public string StatDataScenario { get; set; }
            public string FiscalYear { get; set; }
            public string Entity { get; set; }
            public string Month { get; set; }
            public string Amount { get; set; }
        }
        class glstat
        {
            public string Account { get; set; }
            public string StatMaster { get; set; }
            public string DEPT { get; set; }
            public string DeptMstr { get; set; }
            public string GLDataScenario { get; set; }
            public string FiscalYear { get; set; }
            public string Entity { get; set; }
            public string AT { get; set; }
            public string Month { get; set; }
            public string Amount { get; set; }
        }

        public class statsdata
        {
            public string StatCode { get; set; }
            public string StatMaster { get; set; }
            public string DEPT { get; set; }
            public string DeptMstr { get; set; }
            public string StatDataScenario { get; set; }
            public string FiscalYear { get; set; }
            public string Entity { get; set; }
            public string Month { get; set; }
            public string Amount { get; set; }
        }
    }
}
