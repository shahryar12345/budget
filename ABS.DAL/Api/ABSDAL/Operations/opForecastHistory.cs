using ABS.DBModels;
using ABSDAL.Context;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ABSDAL.Operations
{
    public class opForecastHistory
    {
        public static async Task<string> InsertRecords(string forecastHistory, BudgetingContext _context)
        {
            try
            {
                var jar = JArray.Parse(forecastHistory);

                foreach (var jToken in jar)
                {
                    var forecastHistoriesdict = JsonConvert.DeserializeObject<Dictionary<string, object>>(jToken.ToString());

                    string budgetVersionId = HelperFunctions.ParseValue(forecastHistoriesdict, "budgetVersionId");
                    string datascenarioType = HelperFunctions.ParseValue(forecastHistoriesdict, "datascenarioType");
                    string formulaMethod = HelperFunctions.ParseValue(forecastHistoriesdict, "formulaMethod");
                    string userId = HelperFunctions.ParseValue(forecastHistoriesdict, "userId");
                    string datascenarioTypeId = HelperFunctions.ParseValue(forecastHistoriesdict, "datascenarioTypeId");


                    var item = new ForecastHistory();

                    item.budgetVersionID = opBudgetVersions.getBudgetVersionsObjbyID(int.Parse(budgetVersionId), _context);
                    item.DatascenarioTypeId = opItemTypes.getItemTypeObjbyKeywordCode("SCENARIOTYPE", datascenarioType.ToUpper(), _context);
                    item.UserID = opIdentityUserProfile.getIdentityUserProfileObjbyValue(int.Parse(userId), _context);
                    item.formulaMethod = formulaMethod;
                    item.DatascenarioType = datascenarioType;
                    item.IsActive = true;
                    item.IsDeleted = false;

                    _context.ForecastHistory.Add(item);

                }
                await _context.SaveChangesAsync();
                return ("Record(s) saves successfully.");

            }
            catch (Exception ex)
            {
                Console.WriteLine(" ERROR STORING FORECAST HISTORY :: " + ex);
                return "";
            }
        }
    }
}