using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ABSDAL.Operations
{
    public class opStatisticsCodes
    {

        public static BudgetingContext getopStatisticsCodesContext(BudgetingContext _context)
        {



            _context.StatisticsCodes.Include(a => a.DataSourcceID).ToList();
            _context.StatisticsCodes.Include(a => a.StatisticCodeType).ToList();



            return _context;






        }


        public static ABS.DBModels.StatisticsCodes getstatisticsCodeObjbyID(int statisticscodeID, BudgetingContext _context)
        {


            ABS.DBModels.StatisticsCodes ITUpdate = _context.StatisticsCodes
                            .Where(a => a.StatisticsCodeID == statisticscodeID


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();

            return ITUpdate;
        }
        public static string getstatisticsDatabyID(int statisticscodeID, BudgetingContext _context)
        {


            var ITUpdate = _context.StatisticsCodes
                            .Where(a => a.StatisticsCodeID == statisticscodeID


                            && a.IsDeleted == false && a.IsActive == true)
                            .Select(p => new { statisticscodeid = p.StatisticsCodeID, statisticscode = p.StatisticsCode, statisticscodename = p.StatisticsCodeName })
                            .FirstOrDefault();





            return ITUpdate.ToString();
        }

        public static ABS.DBModels.StatisticsCodes getstatisticsCodeObjbyCode(string StatisticsCode, BudgetingContext _context)
        {


            ABS.DBModels.StatisticsCodes ITUpdate = _context.StatisticsCodes
                            .Where(a => a.StatisticsCode.ToUpper() == StatisticsCode.ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();





            return ITUpdate;
        }



        public static async Task<ABS.DBModels.APIResponse> StatisticsCodeBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;

                var existingtps = await _context.StatisticsCodes.Where(f => f.IsActive == true && f.IsDeleted == false).ToListAsync();
                //   .ToDictionaryAsync(f => f.StatisticsCodeID, f => f.StatisticsCode);

                var importdatamethod = opItemTypes.getImportDataBy(_context);

                //var existingtps = await _context.StatisticsCodes
                //    .ToDictionaryAsync(f => f.StatisticsCodeID, f => f.StatisticsCode);
                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {

                    /*Parse Values*/
                    /* Generate DB Object */
                    /* Push DB Updates*/
                    /* Create Relationships */

                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    string tpname = "";
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString() == "")

                    {
                        errorones++;
                        //continue;
                    }
                    else
                    {
                        tpname = arrval["code"].ToString();
                    }



                    string groupName = HelperFunctions.CheckKeyValuePairs(arrval, "groupName").ToString();
                    string isGroupMember = HelperFunctions.CheckKeyValuePairs(arrval, "isGroupMember").ToString();
                    string isStatsCode = HelperFunctions.CheckKeyValuePairs(arrval, "isStatsCode").ToString();
                    string description = HelperFunctions.CheckKeyValuePairs(arrval, "description").ToString();
                    string columnLabel = HelperFunctions.CheckKeyValuePairs(arrval, "columnLabel").ToString();
                    string statsName = HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString();
                    string activityMasterId = HelperFunctions.CheckKeyValuePairs(arrval, "activityMasterId").ToString();
                    string masterCodeId = HelperFunctions.CheckKeyValuePairs(arrval, "masterCodeId").ToString();
                    string type = HelperFunctions.CheckKeyValuePairs(arrval, "type").ToString();
                    string totalby = HelperFunctions.CheckKeyValuePairs(arrval, "totalby").ToString();
                    string ismaster = HelperFunctions.CheckKeyValuePairs(arrval, "isMaster").ToString();
                    string isGroup = HelperFunctions.CheckKeyValuePairs(arrval, "isGroup").ToString();
                    string codesetid = HelperFunctions.CheckKeyValuePairs(arrval, "codeSetId").ToString();
                    string objectid = HelperFunctions.CheckKeyValuePairs(arrval, "objectId").ToString();
                    string lowCode = HelperFunctions.CheckKeyValuePairs(arrval, "lowCode").ToString();
                    string highCode = HelperFunctions.CheckKeyValuePairs(arrval, "highCode").ToString();

                    var stcode = existingtps.Where(f => f.StatisticsCode == tpname).FirstOrDefault();
                    var stcodename = existingtps.Where(f => f.StatisticsCode == statsName).FirstOrDefault();
                    var isgroupcode = isGroup == "" ? false : bool.Parse(isGroup);
                    var isMastercode = ismaster == "" ? false : bool.Parse(ismaster);

                    var isgroupmembercode = isGroupMember == "" ? false : bool.Parse(isGroupMember);
                    var isstatscodedata = isStatsCode == "" ? false : bool.Parse(isStatsCode);
                    var Mastergroupexists = existingtps.Where(f => f.Description == activityMasterId).FirstOrDefault();
                    var GroupRecordExisits = existingtps.Where(f => f.StatisticsCode == groupName).FirstOrDefault();



                    if (importdatamethod.ToUpper() == "MASTER" && Mastergroupexists == null && !isgroupcode && !isMastercode && isstatscodedata)
                    {
                        continue;
                    }
                    else
                    if (importdatamethod.ToUpper() == "GROUP" && GroupRecordExisits == null && !isgroupcode && !isMastercode)
                    {
                        continue;
                    }


                    if (stcode != null)
                    {
                        duplicates++;
                        //  continue;
                    }
                    else
                    if (isgroupcode && stcodename != null)
                    {
                        duplicates++;
                        //  continue;
                    }
                    else
                    {

                        ABS.DBModels.StatisticsCodes ntimeperiod = new ABS.DBModels.StatisticsCodes();

                        ntimeperiod.CreationDate = DateTime.UtcNow;
                        ntimeperiod.UpdatedDate = DateTime.UtcNow;
                        ntimeperiod.IsActive = true;
                        ntimeperiod.IsDeleted = false;

                        ntimeperiod.Identifier = Guid.NewGuid();
                        ntimeperiod.StatisticsCode = tpname != "" ? tpname : statsName != "" ? statsName : description;
                        ntimeperiod.StatisticsCodeName = statsName != "" ? statsName : description;
                        ntimeperiod.Description = description != "" ? description : objectid;

                        ntimeperiod.ColumnLabel = columnLabel != "" ? columnLabel : totalby;
                        ntimeperiod.Summable = HelperFunctions.CheckKeyValuePairs(arrval, "summable").ToString() == "" ? false : arrval["summable"].ToString() == "F" ? false : true;
                        ntimeperiod.IsGroup = isgroupcode;
                        ntimeperiod.IsMaster = isMastercode;

                        ntimeperiod.StatisticCodeType = opItemTypes.getItemTypeObjbyKeywordCode("STATISTICSCODE", type, _context);

                        ntimeperiod.ChildID = codesetid != "" ? codesetid : activityMasterId;



                        _context.Add(ntimeperiod);
                        existingtps.Add(ntimeperiod);
                        await _context.SaveChangesAsync();
                    }
                    if (isgroupmembercode)
                    {
                        var masterid = existingtps.Where(f => f.StatisticsCode == masterCodeId).FirstOrDefault();
                        var groupid = existingtps.Where(f => f.StatisticsCode == groupName).FirstOrDefault();

                        var codeid = existingtps.Where(f => f.StatisticsCode == tpname).FirstOrDefault();

                        if (groupid != null && codeid != null)
                        {
                            var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "STATISTICSCODE", "GROUP", groupid.StatisticsCodeID, codeid.StatisticsCodeID);

                        }
                        if (masterid != null && codeid != null)
                        {
                            var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "STATISTICSCODE", "MASTER", groupid.StatisticsCodeID, codeid.StatisticsCodeID);

                        }

                    }
                    else
                     if (isstatscodedata)

                    {
                        var groupid = existingtps.Where(f => f.Description == activityMasterId).FirstOrDefault();

                        var codeid = existingtps.Where(f => f.StatisticsCode == tpname).FirstOrDefault();

                        if (groupid != null && codeid != null)
                        {
                            var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "STATISTICSCODE", "MASTER", groupid.StatisticsCodeID, codeid.StatisticsCodeID);

                        }

                    }






                    successones++;


                }
                //  Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods> bulk = new Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods>();
                //await  bulk.BulkInsertAsync();
                ITUpdate.message += "|| Total Inserted: " + successones;
                ITUpdate.message += "|| Duplicate Record(s) : " + duplicates;
                ITUpdate.message += "|| Total Errors found:  " + errorones;




                return ITUpdate;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return null;
            }
        }

        internal async static Task<List<StatisticsCodes>> getAllStatisticsCodes(BudgetingContext _context)
        {
            List<StatisticsCodes> ITUpdate =  await _context.StatisticsCodes
                          .Where(a => a.IsDeleted == false && a.IsActive == true)
                          .ToListAsync();

            return ITUpdate;
        }
    }
}
