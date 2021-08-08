using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Newtonsoft.Json;
using ABS.DBModels;

namespace ABSProcessing.Operations
{
    public class opTimePeriods
    {

        public static BudgetingContext getTimePeriodsContext(BudgetingContext _context)
        {
      


            _context.TimePeriods.Include(a => a.FiscalYearID)
            .Include(a => a.FiscalStartMonthID)
            .Include(a => a.FiscalEndMonthID)
            .Include(a => a.FiscalYearEndID).ToList();
           
            //_context.TimePeriods.Include(a => a.FiscalYearID).ToList();
            //_context.TimePeriods.Include(a => a.FiscalStartMonthID).ToList();
            //_context.TimePeriods.Include(a => a.FiscalEndMonthID).ToList();
            //_context.TimePeriods.Include(a => a.FiscalYearEndID).ToList();
            


            return _context;






        }



        public static ABS.DBModels.TimePeriods getTimePeriodObjbyID(int timeperiodID, BudgetingContext _context)
        {


            ABS.DBModels.TimePeriods ITUpdate = _context.TimePeriods
                            .Where(a => a.TimePeriodID == timeperiodID


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        } 
        
        public static ABS.DBModels.TimePeriods getTimePeriodObjbyCode(string timeperiodCode, BudgetingContext _context)
        {


            ABS.DBModels.TimePeriods ITUpdate = _context.TimePeriods
                            .Where(a => a.TimePeriodCode == timeperiodCode


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }
  public static async Task<ABS.DBModels.APIResponse> TimePeriodBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;

                var existingtps = await _context.TimePeriods
                    .ToDictionaryAsync(f => f.TimePeriodID, f => f.TimePeriodName);
                //    .Where(d => d.IsActive == true && d.IsDeleted == false)
                //.Select(a => new { a.TimePeriodID ,  a.TimePeriodName } ).ToListAsync();
                //var SSObj = HelperFunctions.getJSONArrayObject(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(rawText.ToString());

                //      var x = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string,object>>(rawText);

                ITUpdate.totalCount =  values.Count();
                foreach (var item in values)
                {
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    string tpname = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString() == "")

                    {
                        errorones++;
                        continue;
                    }
                    else
                    {
                        tpname = arrval["name"].ToString();
                    }

                    if (existingtps.Values.Contains(tpname)) {
                        duplicates++;
                      //var ToDelete =   _context.TimePeriods.Where(x => x.TimePeriodName.ToUpper() == tpname.ToUpper()).FirstOrDefault();
                      //  _context.TimePeriods.Remove(ToDelete);
                        continue; }

                    string startyear = "";
                    string startmonth = "";
                    string endmonth = "";
                    string endyear = "";


                    if (HelperFunctions.CheckKeyValuePairs(arrval, "startDate").ToString() != "")

                    {
                        DateTime sy = DateTime.Parse(arrval["startDate"].ToString());
                        startyear = sy.Year.ToString();
                        startmonth = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(sy.Month);

                    }

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "endDate").ToString() != "")

                    {
                        DateTime sy = DateTime.Parse(arrval["endDate"].ToString());
                        endyear = sy.Year.ToString();
                        endmonth = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(sy.Month);

                    }



                    ABS.DBModels.TimePeriods ntimeperiod = new ABS.DBModels.TimePeriods();

                    ntimeperiod.CreationDate = DateTime.UtcNow;
                    ntimeperiod.UpdatedDate = DateTime.UtcNow;
                    ntimeperiod.TimePeriodName = tpname;
                    ntimeperiod.TimePeriodCode = tpname;
                    ntimeperiod.TimePeriodDescription = tpname + "||" + startyear + "||" + startmonth + "||" + endyear + "||" + endmonth;
                    ntimeperiod.IsActive = true;
                    ntimeperiod.IsDeleted = false;
                    ntimeperiod.FetchedFromADS = true;
                    ntimeperiod.Identifier = Guid.NewGuid();
                    ntimeperiod.FiscalYearID = opItemTypes.getItemTypeObjbyCode(startyear, _context);
                    ntimeperiod.FiscalStartMonthID = opItemTypes.getItemTypeObjbyCode(startmonth, _context);
                    ntimeperiod.FiscalEndMonthID = opItemTypes.getItemTypeObjbyCode(endmonth, _context);
                    ntimeperiod.FiscalYearEndID = opItemTypes.getItemTypeObjbyCode(endyear, _context);




                    _context.Add(ntimeperiod);
                    await _context.SaveChangesAsync();


                    successones++;


                }
                //  Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods> bulk = new Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods>();
                //await  bulk.BulkInsertAsync();
                ITUpdate.message  += "|| Total Inserted: " + successones;
                ITUpdate.message  += "|| Duplicate Record(s) : " + duplicates;
                ITUpdate.message  += "|| Total Errors found:  " + errorones;




                return ITUpdate;
            }
            catch  (Exception ex)
            {
                Logger.LogError(ex);
                return null;
            }
        }

        public async static Task<List<TimePeriods>> GetAllTimePeriods(BudgetingContext _context)
        {

            var cntxt = getTimePeriodsContext(_context);
            var ITUpdate = await cntxt.TimePeriods
                                       .Where(a =>  a.IsDeleted == false && a.IsActive == true)
                                       .ToListAsync();





            return ITUpdate;
        }
    }
}
