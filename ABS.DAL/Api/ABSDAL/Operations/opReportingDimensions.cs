using ABSDAL.Context;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using ABS.DBModels;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using EFCore.BulkExtensions;

namespace ABSDAL.Operations
{
    internal class opReportingDimensions
    {
        internal async static Task<APIResponse> ProcessReportingDimensions(JsonElement rawText, BudgetingContext _context)
        {

            try
            {
                await Task.Delay(1);
                APIResponse apires = new APIResponse();
                var SSObj = HelperFunctions.getJSONArrayObject(rawText);

                if (HelperFunctions.CheckKeyValuePairs(SSObj, "actionType").ToString().ToUpper() == "ADD")
                {

                    apires = await AddReportingDimensions(SSObj, _context);

                }
                else
               if (SSObj["actionType"].ToString().ToUpper() == "UPDATE")
                {


                    apires = await UpdateReportingDimensions(SSObj, _context);


                }

                else
               if (SSObj["actionType"].ToString().ToUpper() == "RENAME")
                {
                    apires = await RenameReportingDimensions(SSObj, _context);


                }
                else
               if (SSObj["actionType"].ToString().ToUpper() == "COPY")
                {

                    apires = await CopyReportingDimensions(SSObj, _context);

                }





                return apires;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                Logger.LogError(ex);
                return null;
            }
        }

        private async static Task<APIResponse> CopyReportingDimensions(Dictionary<string, object> sSObj, BudgetingContext _context)
        {
            var x = new APIResponse();

            try
            {
                List<ReportingDimensions> lstrd = new List<ReportingDimensions>();
                var rdobj = await getNewUpdatedRDObj(sSObj, _context);
                if (rdobj.ReportingDimensionID > 0)
                {
                    string newCode = HelperFunctions.ParseValue(sSObj, "newCode");

                    var newObj = new ReportingDimensions();
                    newObj = rdobj;
                    newObj.Code = newCode;
                    newObj.ReportingDimensionID = 0;
                    newObj.CreationDate = DateTime.UtcNow;
                    newObj.UpdatedDate = DateTime.UtcNow;

                    _context._ReportingDimensions.Add(newObj);
                    await _context.SaveChangesAsync();
                     x.message = "Record copied successfully";
                }
                else
                {
                    x.payload = "";
                    x.message = "Source record does not exists";
                }

                x.status = "success";

                return x;
            }
            catch (Exception ex)
            {

                x.status = "failed";
                x.error = ex.StackTrace;
                x.message = ex.Message;
                return x;
            }
        }

        private async static Task<APIResponse> RenameReportingDimensions(Dictionary<string, object> sSObj, BudgetingContext _context)
        {
            var x = new APIResponse();

            try
            {
                 var rdobj = await getNewUpdatedRDObj(sSObj, _context);
                if (rdobj.ReportingDimensionID > 0)
                {
                    rdobj.Code = HelperFunctions.ParseValue(sSObj, "newCode");
                    _context.Entry(rdobj).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    x.message = "Record renamed successfully";
                }
                else
                {
                    x.payload = "";

                    x.message = "Record does not exists to rename";

                }

                x.status = "success";

                return x;
            }
            catch (Exception ex)
            {

                x.status = "failed";
                x.error = ex.StackTrace;
                x.message = ex.Message;
                return x;
            }
        }



        private async static Task<APIResponse> UpdateReportingDimensions(Dictionary<string, object> sSObj, BudgetingContext _context)
        {
            var x = new APIResponse();

            try
            {
                 var rdobj = await getNewUpdatedRDObj(sSObj, _context);
                if (rdobj.ReportingDimensionID > 0)
                {
                    _context.Entry(rdobj).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                    x.message = "Record updated successfully";
                }
                else
                {
                    x.payload = "";

                    x.message = "Record does not exists";

                }

                x.status = "success";

                return x;
            }
            catch (Exception ex)
            {

                x.status = "failed";
                x.error = ex.StackTrace;
                x.message = ex.Message;
                return x;
            }
        }

        private async static Task<APIResponse> AddReportingDimensions(Dictionary<string, object> sSObj, BudgetingContext _context)
        {
            var x = new APIResponse();

            try
            {
                 var rdobj = await getNewUpdatedRDObj(sSObj, _context);
                if (rdobj.ReportingDimensionID > 0)
                {
                    //lstrd.Add(rdobj);
                    //_context.BulkUpdate<ReportingDimensions>(lstrd);
                    x.message = "Record already exists";
                }
                else
                {
                    _context._ReportingDimensions.Add(rdobj);
                    await _context.SaveChangesAsync();
                    x.message = "Record added successfully";

                }

                x.status = "success";
                x.payload = rdobj.ReportingDimensionID.ToString();

                return x;
            }
            catch (Exception ex)
            {

                x.status = "failed";
                x.error = ex.StackTrace;
                x.message = ex.Message;
                return x;
            }

        }

        private async static Task<ReportingDimensions> getNewUpdatedRDObj(Dictionary<string, object> sSObj, BudgetingContext _context)
        {
            string code = HelperFunctions.ParseValue(sSObj, "code");
            string value = HelperFunctions.ParseValue(sSObj, "value");
            string description = HelperFunctions.ParseValue(sSObj, "description");
            string comments = HelperFunctions.ParseValue(sSObj, "comments");
            string name = HelperFunctions.ParseValue(sSObj, "name");
            string reportProcessingStatus = HelperFunctions.ParseValue(sSObj, "reportProcessingStatus");
            string reportDetails = HelperFunctions.ParseValue(sSObj, "reportDetails");
            string reportData = HelperFunctions.ParseValue(sSObj, "reportData");
            string relatedPath = HelperFunctions.ParseValue(sSObj, "relatedPath");
            string reportPath = HelperFunctions.ParseValue(sSObj, "reportPath");
            string reportStatus = HelperFunctions.ParseValue(sSObj, "reportStatus");
            string scenarioType = HelperFunctions.ParseValue(sSObj, "scenarioType");
            string jsonConfig = HelperFunctions.ParseValue(sSObj, "jsonConfig");
            string userProfileID = HelperFunctions.ParseValue(sSObj, "userProfileID");


            var existingRD = await _context._ReportingDimensions.Where(f => f.Code == code
          && f.IsActive == true
          && f.IsDeleted == false).FirstOrDefaultAsync();

            var newRD = new ReportingDimensions();


            if (existingRD == null)
            {
                newRD.IsActive = true;
                newRD.IsDeleted = false;
                newRD.CreationDate = DateTime.UtcNow;
                newRD.UpdatedDate = DateTime.UtcNow;
                newRD.Identifier = Guid.NewGuid();

                //Domain Fields
                newRD.Code = code;
                newRD.value = value;
                newRD.Description = description;
                newRD.Comments = comments;
                newRD.Name = name;
                newRD.ReportProcessingStatus = reportProcessingStatus;
                newRD.ReportDetails = reportDetails;
                newRD.ReportData = reportData;
                newRD.RelatedPath = relatedPath;
                newRD.ReportPath = reportPath;
                newRD.ReportStatus = opItemTypes.getItemTypeObjbyKeywordCode("REPORTSTATUS", reportStatus, _context);
                newRD.ScenarioType = opItemTypes.getItemTypeObjbyKeywordCode("SCENARIOTYPE", scenarioType, _context);
                newRD.JsonConfig = jsonConfig;
                newRD.UserProfileID = int.Parse(userProfileID);


            }
            else
            {
                existingRD.IsActive = true;
                existingRD.IsDeleted = false;
                existingRD.UpdatedDate = DateTime.UtcNow;

                //Domain Fields
                // if (code != "") existingRD.Code = code;
                if (value != "") existingRD.value = value;
                if (description != "") existingRD.Description = description;
                if (comments != "") existingRD.Comments = comments;
                if (name != "") existingRD.Name = name;
                if (reportProcessingStatus != "") existingRD.ReportProcessingStatus = reportProcessingStatus;
                if (reportDetails != "") existingRD.ReportDetails = reportDetails;
                if (reportData != "") existingRD.ReportData = reportData;
                if (relatedPath != "") existingRD.RelatedPath = relatedPath;
                if (reportPath != "") existingRD.ReportPath = reportPath;
                if (reportStatus != "") existingRD.ReportStatus = opItemTypes.getItemTypeObjbyKeywordCode("REPORTSTATUS", reportStatus, _context);
                if (scenarioType != "") existingRD.ScenarioType = opItemTypes.getItemTypeObjbyKeywordCode("SCENARIOTYPE", scenarioType, _context);
                if (jsonConfig != "") existingRD.JsonConfig = jsonConfig;
                if (userProfileID != "") existingRD.UserProfileID = int.Parse(userProfileID);

                newRD = existingRD;

            }
            return newRD;
        }
    }
}