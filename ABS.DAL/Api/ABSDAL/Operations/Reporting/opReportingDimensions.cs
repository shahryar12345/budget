using ABS.DBModels;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ABSDAL.Operations.Reporting
{
    public class opReportingDimensions
    {

        public static BudgetingContext getReportingDimensionsContext(BudgetingContext _context)
        {
            var RD = _context._ReportingDimensions
                .Include(a => a.ReportStatus)
                .Include(a => a.ScenarioType)
                .ToList();

            return _context;                                                  
        }

        internal async static Task<APIResponse> GetReportingDimensionsPageData(string searchString, int pageNo, int itemsPerPage, string dataScenarioType, string sortColumn, bool sortDescending, int userID, BudgetingContext _context)
        {
       
            APIResponse xData = new APIResponse();



            DataCache.opRedisCache opCache = new DataCache.opRedisCache();

            IEnumerable<ReportingDimensions> ReportingDimensionsData = await opCache.refreshKeyData<ReportingDimensions>("ALLBUDGETVERSIONS", _context, 1000);
            IEnumerable<IdentityUserProfile> UserProfileData = await opCache.refreshKeyData<IdentityUserProfile>("ALLUSERPROFILE", _context, 1000);
            IEnumerable<ItemTypes> itemTypesData = await opCache.refreshKeyData<ItemTypes>("ALLITEMTYPES", _context, 1000);
             

            string username = UserProfileData.Where(s => s.UserProfileID == userID).Select(s => s.Username).FirstOrDefault();
            

            var data = ReportingDimensionsData
                .Where(x => x.IsActive == true && x.IsDeleted == false)
                .AsEnumerable();



            if (data == null)
            {

                xData.message = " NotFound";
                xData.code = "404";
                return xData;
            }


            if (dataScenarioType != "" && dataScenarioType != null)
            {
                Console.WriteLine(data);
                data = data.Where(x => x.ScenarioType != null).AsEnumerable();
                data = data.Where(x => x.ScenarioType.ItemTypeID == int.Parse(dataScenarioType)).AsEnumerable();

            }

            if (searchString != "" && searchString != null)
            {

                data = data.Where(x =>
                (x.Code != null && x.Code.ToLower().Contains(searchString.ToLower()))
                || (x.Description != null && x.Description.ToLower().Contains(searchString.ToLower()))
                || (x.Comments != null && x.Comments.ToLower().Contains(searchString.ToLower())))
                    .AsEnumerable();
            }

            xData.totalCount = data.Count();
            data = data.OrderBy(f => f.ReportingDimensionID);


            if (sortColumn != "" && sortColumn != null && sortDescending)

            {
                var propertyInfo = typeof(ReportingDimensions).GetProperty(sortColumn, System.Reflection.BindingFlags.IgnoreCase | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);

                //  data = data.OrderByDescending(a => a.Code).AsEnumerable();
                data = data.OrderByDescending(a => propertyInfo.GetValue(a, null)).AsEnumerable();
            }
            else
             if (sortColumn != "" && sortColumn != null && !sortDescending)

            {
                var propertyInfo = typeof(ReportingDimensions).GetProperty(sortColumn, System.Reflection.BindingFlags.IgnoreCase | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);

                //  data = data.OrderByDescending(a => a.Code).AsEnumerable();
                data = data.OrderBy(a => propertyInfo.GetValue(a, null)).AsEnumerable();

            }



            if (data.Count() < 1)
            {
                xData.Data = JsonSerializer.Serialize(data);
                xData.status = "sucess";
                xData.totalCount = data.Count();
                xData.message = "No Data Found";

                return xData;

            }

            if (data.Count() <= itemsPerPage)
            {

            }
            else
            {
                if (pageNo == 1)
                {
                    data = data.Skip(0).Take(itemsPerPage);

                }
                else
                if (pageNo > 1)
                {
                    int skipdata = (pageNo - 1) * itemsPerPage;
                    data = data.Skip(skipdata);
                    data = data.Take(itemsPerPage);

                }
            }




            var finaldata = data.Select(a => new
            {
                ReportingDimensionsID = a.ReportingDimensionID
                  ,
                code = a.Code ?? ""
                  ,
                comments = a.Comments ?? ""
                  ,
                name = a.Name ?? ""
                ,
                description = a.Description ?? ""
                ,
                JsonConfig = a.JsonConfig ?? ""
                ,
                ReportProcessingStatus = a.ReportProcessingStatus ?? ""
                ,
                ReportData = a.ReportData ?? ""
                ,
                ReportDetails = a.ReportDetails ?? ""
                  ,
                UserProfile = UserProfileData.Where(x => x.UserProfileID == a.UserProfileID).Select(d => d.Username).FirstOrDefault()
                //UserProfile =  GetUsernamefromList(a.UserProfileID, _userProfile)
                  ,

                createdby = a.CreatedBy == null ? "" : UserProfileData.Where(x => x.UserProfileID == a.CreatedBy).Select(d => d.Username).FirstOrDefault()
                  ,
                updatedby = a.UpdateBy == null ? "" : UserProfileData.Where(x => x.UserProfileID == a.UpdateBy).Select(d => d.Username).FirstOrDefault()
                  ,
               
                scenarioTypeID = a.ScenarioType != null ? itemTypesData.Where(x => x.ItemTypeID == a.ScenarioType.ItemTypeID).Select(d => d.ItemTypeID).FirstOrDefault() : 0
                ,
                scenarioTypeName = a.ScenarioType != null ? itemTypesData.Where(x => x.ItemTypeID == a.ScenarioType.ItemTypeID).FirstOrDefault().ItemTypeDisplayName : null
                ,
                scenarioTypeIDObj = a.ScenarioType != null ? itemTypesData.Where(x => x.ItemTypeID == a.ScenarioType.ItemTypeID).FirstOrDefault() : null
                
               ,
               
                creationDate = a.CreationDate != null ? a.CreationDate.ToString() : ""
                ,
                updateddate = a.UpdatedDate != null ? a.UpdatedDate.ToString() : ""
                ,
                ReportingStatusID = a.ReportStatus != null ? a.ReportStatus.ItemTypeID.ToString() : ""
               ,
                ReportingStatusOBJ = a.ReportStatus != null ? a.ReportStatus : null
               , ReportPath = a.ReportPath != null ? a.ReportPath: ""
            }).AsEnumerable();



            //  xData.Data = JsonSerializer.Serialize(finaldata);
            xData.Data = JsonSerializer.Serialize(finaldata);
            xData.status = "sucess";
            xData.ResponseDataCount = data.Count();




            return xData;
        }


    }
}
