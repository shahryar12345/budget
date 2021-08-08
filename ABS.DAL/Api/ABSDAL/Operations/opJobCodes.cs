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
    public class opJobCodes
    {
        public static BudgetingContext getContext(BudgetingContext _context)
        {
            _context.JobCodes.Include(a => a.JobCodeMaster).ToList();



            return _context;
        }

        public static async Task<ABS.DBModels.APIResponse> JobCodeBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);
                var importdatamethod = opItemTypes.getImportDataBy(_context);
                
                Console.WriteLine("importdatamethod: -- " + importdatamethod);
                
                var itemTypesList = _context._ItemTypes.ToList();
                var existingJobCodes = await _context.JobCodes.Where(
                  f => f.IsActive == true && f.IsDeleted == false)
                 .ToListAsync();
                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {

                    /*Parse Values*/
                    /* Generate DB Object */
                    /* Push DB Updates*/
                    /* Create Relationships */
                   
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    string objectId = HelperFunctions.ParseValue(arrval, "objectId");
                    string JobCodesCode = HelperFunctions.ParseValue(arrval,"code");
                    JobCodesCode = JobCodesCode != "" ? JobCodesCode : objectId;  
                    string description = HelperFunctions.ParseValue(arrval, "description").ToString();
                    string name = HelperFunctions.ParseValue(arrval, "name").ToString();
                    string groupname = HelperFunctions.ParseValue(arrval, "groupName").ToString();
                    string columnlabel = HelperFunctions.ParseValue(arrval, "columnLabel").ToString();
                    string ismember = HelperFunctions.ParseValue(arrval, "isMemberData").ToString();
                    string isgroup = HelperFunctions.ParseValue(arrval, "isGroup").ToString();
                    string ismaster = HelperFunctions.ParseValue(arrval, "isMaster").ToString();
                    string highcode = HelperFunctions.ParseValue(arrval, "highcode").ToString();
                    string lowcode = HelperFunctions.ParseValue(arrval, "lowCode").ToString();
                    string JobCodeMasterid = HelperFunctions.ParseValue(arrval, "JobCodeMasterId").ToString();
                    string JobCodeMastercode = HelperFunctions.ParseValue(arrval, "jobCodeMasterCode").ToString();
                    string JobCodeMasterCodebyID = HelperFunctions.ParseValue(arrval, "masterCodeId").ToString();



                    Boolean isMemberData = false;
                    Boolean isGroupdata = false;
                    Boolean isMasterdata = false;

                    try
                    {
                        isMemberData = Boolean.Parse(ismember);
                    }
                    catch
                    {
                        isMemberData = false;
                    }
                     
                    try
                    {
                        isGroupdata = Boolean.Parse(isgroup);
                    }
                    catch
                    {
                        isGroupdata = false;
                    }
                   
                    try
                    {
                        isMasterdata = Boolean.Parse(ismaster);
                    }
                    catch
                    {
                        isMasterdata = false;
                    }
                     
                    if (isMemberData)
                    {
                        // IF IT IS MEMBERDATA than Need to add Relationship Data only for Group and Master not JobCode

                        if (groupname != "")
                        {
                            var groupMembercodeID = existingJobCodes.Where(a => a.JobCodeCode == JobCodesCode).FirstOrDefault().JobCodeID;

                            var groupobj = existingJobCodes.Where(a => a.JobCodeName == groupname).FirstOrDefault();

                            if (groupobj != null)
                            {
                                var groupID = existingJobCodes.Where(a => a.JobCodeName == groupname).FirstOrDefault().JobCodeID;

                                var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "JOBCODE", "GROUP", groupID, groupMembercodeID);

                            }
                        }
                    }
                    else
                    {

                    }

                    /// Creating Object for JobCode to insert

                    ABS.DBModels.JobCodes JobCodeObj = new ABS.DBModels.JobCodes();
                    
                    JobCodeObj.CreationDate = DateTime.UtcNow;
                    JobCodeObj.UpdatedDate = DateTime.UtcNow;
                    JobCodeObj.IsActive = true;
                    JobCodeObj.IsDeleted = false;
                    JobCodeObj.Identifier = Guid.NewGuid();
                    JobCodeObj.JobCodeCode = JobCodesCode;
                    JobCodeObj.JobCodeName = name != "" ? name : description;
                    JobCodeObj.JobCodeDescription = description != "" ? description : name;
                    JobCodeObj.IsGroup = isGroupdata;
                    JobCodeObj.IsMaster = isMasterdata;
                    JobCodeObj.Lowcode = lowcode;
                    JobCodeObj.HighCode = highcode;

                    var JobCodemasterobj = existingJobCodes.Where(a => a.JobCodeCode == JobCodeMastercode).FirstOrDefault();
                    var groupDataobj = existingJobCodes.Where(a => a.JobCodeName == groupname).FirstOrDefault();

                    if (JobCodemasterobj == null)
                    {   
                        JobCodemasterobj = existingJobCodes.Where(a => a.JobCodeCode == JobCodeMastercode).FirstOrDefault();
                    } 
                    
                    if (JobCodemasterobj != null)
                    {
                        JobCodeObj.JobCodeMaster = JobCodemasterobj;
                    }
                    if (JobCodemasterobj == null && !isMasterdata && !isGroupdata && !isMemberData && importdatamethod == "MASTER")
                    {  
                        continue;
                    }

                    if (groupDataobj == null && !isMasterdata && !isGroupdata && isMemberData && importdatamethod == "GROUP")
                    {
                        continue;
                    }

                    var existingData = existingJobCodes.Where(x => x.JobCodeCode.ToUpper() == JobCodesCode.ToUpper()).FirstOrDefault();
                    if (existingData != null)
                    {
                        duplicates++;

                        existingData.HighCode = JobCodeObj.HighCode;
                        existingData.Identifier = JobCodeObj.Identifier;
                        existingData.IsActive = JobCodeObj.IsActive;
                        existingData.IsGroup = JobCodeObj.IsGroup;
                        existingData.IsDeleted = JobCodeObj.IsDeleted;
                        existingData.IsMaster = JobCodeObj.IsMaster;
                        existingData.Lowcode = JobCodeObj.Lowcode;
                        if (JobCodeObj.JobCodeCode != "")
                        {
                            existingData.JobCodeCode = JobCodeObj.JobCodeCode;
                        }
                        if (JobCodeObj.JobCodeDescription != "")
                        {
                            existingData.JobCodeDescription = JobCodeObj.JobCodeDescription;
                        }
                        existingData.JobCodeMaster = JobCodeObj.JobCodeMaster;
                        if (JobCodeObj.JobCodeName != "")
                        {
                            existingData.JobCodeName = JobCodeObj.JobCodeName;
                        }
                        existingData.UpdatedDate = DateTime.UtcNow;

                        _context.Entry(existingData).State = EntityState.Modified;
                    }
                    else
                    {
                        _context.Add(JobCodeObj);
                        existingJobCodes.Add(JobCodeObj);

                        successones++;
                    }

                    await _context.SaveChangesAsync();

                    var insertedID = JobCodeObj.JobCodeID;
                    if (!isMemberData && !isGroupdata && !isMasterdata && JobCodeObj.JobCodeMaster != null && insertedID != 0)
                    {
                        var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "JOBCODE", "MASTER", JobCodeObj.JobCodeMaster.JobCodeID, insertedID);

                    }

                    if (isGroupdata && JobCodeObj.JobCodeMaster != null && insertedID != 0)
                    {
                        var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "JOBCODE", "MASTER", JobCodeObj.JobCodeMaster.JobCodeID, insertedID);

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

        internal async static Task<List<JobCodes>> getAllJobCodes(BudgetingContext _context)
        {
List<JobCodes> ITUpdate = await _context.JobCodes
                            .Where(a => 
                            
                            a.IsDeleted == false && a.IsActive == true)
                            .ToListAsync();
            return ITUpdate;
        }

        public static ABS.DBModels.JobCodes getJobCodessObjbyID(int JobCodesID, BudgetingContext _context)
        {
            ABS.DBModels.JobCodes ITUpdate = _context.JobCodes
                            .Where(a => a.JobCodeID == JobCodesID
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }

        public static ABS.DBModels.JobCodes getjobCodeObjbyCode(string JobCode, BudgetingContext _context)
        {
            ABS.DBModels.JobCodes ITUpdate = _context.JobCodes
                            .Where(a => a.JobCodeCode.ToUpper() == JobCode.ToUpper()


                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();

            return ITUpdate;
        }
    }
}
