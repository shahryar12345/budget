using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ABS.DBModels;

namespace ABSDAL.Operations
{
    public class opPayTypeDistribution
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {           
            return _context;
        }

        public static async Task<ABS.DBModels.APIResponse> PTDsBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context, string UpdateType)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());

                    //parameters
                    int payTypeDistributionID = 0;
                    int payTypeID = 0;
                    int DepartmentID = 0;
                    int EntityID = 0;
                    int JobCodeID = 0;
                    string code = "";
                    string name = "";
                    string description = "";
                    string userid = "";
                    string createdby = "";
                    string updateby = "";

                    decimal percentage = 0;
                    bool productive = false;
                    bool isGroup = false;
                    bool isActive = true;
                    bool isDeleted = false;

                    PayTypeDistribution existingPTD = null;
                    Entities entity = null;
                    Departments department = null;
                    JobCodes jobCode = null;
                    PayTypes payType = null;

                    userid = HelperFunctions.ParseValue(arrval, "UserID");
                    userid = userid == "" ? HelperFunctions.ParseValue(arrval, "userID"): userid;
                    createdby = HelperFunctions.ParseValue(arrval, "createdby");
                    updateby = HelperFunctions.ParseValue(arrval, "updatedby");

                    try
                    {
                        payTypeDistributionID = int.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "payTypeDistributionID").ToString());
                    }
                    catch
                    {
                        payTypeDistributionID = 0;
                    }

                    try
                    {
                        payTypeID = int.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "payTypeID").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        DepartmentID = int.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "departmentID").ToString());
                    }
                    catch
                    {
                        DepartmentID = 0;
                    }

                    try
                    {
                        EntityID = int.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "entityID").ToString());
                    }
                    catch
                    {
                        EntityID = 0;
                    }

                    try
                    {
                        JobCodeID = int.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "jobCodeID").ToString());
                    }
                    catch
                    {
                        JobCodeID = 0;
                    }

                    try
                    {
                        code = HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString();
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }
                    
                    try
                    {
                        name = HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString();
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        description = HelperFunctions.CheckKeyValuePairs(arrval, "description").ToString();
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        percentage = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "percentage").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        productive = bool.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "productive").ToString());
                    }
                    catch
                    {
                        productive = false;
                    }

                    try
                    {
                        isGroup = bool.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isGroup").ToString());
                    }
                    catch
                    {
                        isGroup = false;
                    }

                    try
                    {
                        isActive = bool.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isActive").ToString());
                    }
                    catch
                    {
                        isActive = true;
                    }

                    try
                    {
                        isDeleted = bool.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isDeleted").ToString());
                    }
                    catch
                    {
                        isDeleted = false;
                    }

                    try
                    {
                        entity = _context.Entities.Where(e => e.EntityID == EntityID).FirstOrDefault();
                    }
                    catch
                    {
                        entity = null;
                    }

                    try
                    {
                        department = _context.Departments.Where(d => d.DepartmentID == DepartmentID).FirstOrDefault();
                    }
                    catch
                    {
                        department = null;
                    }

                    try
                    {
                        jobCode = _context.JobCodes.Where(jc => jc.JobCodeID == JobCodeID).FirstOrDefault();
                    }
                    catch
                    { 
                        jobCode = null;
                    }

                    try
                    {
                        payType = _context.PayTypes.Where(jc => jc.PayTypeID == payTypeID).FirstOrDefault();
                    }
                    catch
                    {
                        payType = null;
                    }

                    if (payTypeDistributionID == 0)
                    {
                        existingPTD = _context.PayTypeDistribution.Where(ptd => ptd.Code == code && ptd.PayType.PayTypeID == payType.PayTypeID).FirstOrDefault();
                    }
                    else
                    {
                        existingPTD = _context.PayTypeDistribution.Where(ptd => ptd.PayTypeDistributionID == payTypeDistributionID).FirstOrDefault();
                    }



                    switch (UpdateType)
                    {
                        case "insert":
                            if (existingPTD != null)
                            {
                                //We don't want to recreate a record if a deleted/inactivated record already exists
                                if (existingPTD.IsActive == false || existingPTD.IsDeleted == true)
                                {
                                    existingPTD.Description = description;
                                    existingPTD.Percentage = percentage;
                                    existingPTD.Entity = entity;
                                    existingPTD.Department = department;
                                    existingPTD.JobCode = jobCode;
                                    existingPTD.PayType = payType;
                                    existingPTD.Productive = productive;
                                    existingPTD.IsGroup = isGroup;
                                    existingPTD.UpdatedDate = DateTime.UtcNow;
                                    existingPTD.IsActive = isActive;
                                    existingPTD.IsDeleted = isDeleted;
                                     existingPTD.UpdateBy = int.Parse(updateby) ; 

                                    _context.Entry(existingPTD).State = EntityState.Modified;
                                } else
                                {
                                    duplicates++;
                                    continue;
                                }
                            } else
                            {
                                PayTypeDistribution nPTD = new PayTypeDistribution();

                                nPTD.Name = name;
                                nPTD.Code = code;
                                nPTD.Description = description;
                                nPTD.Percentage = percentage;
                                nPTD.Entity = entity;
                                nPTD.Department = department;
                                nPTD.PayType = payType;
                                nPTD.JobCode = jobCode;
                                nPTD.Productive = productive;
                                nPTD.IsGroup = isGroup;
                                nPTD.Identifier = Guid.NewGuid();
                                nPTD.IsActive = isActive;
                                nPTD.IsDeleted = isDeleted;
                                nPTD.CreationDate = DateTime.UtcNow;
                                nPTD.UpdatedDate = DateTime.UtcNow;
                                //nPTD.CreatedBy = await _context._IdentityUserProfile.Where(f=> f.UserProfileID == int.Parse(createdby)).FirstOrDefaultAsync();
                                nPTD.CreatedBy =  int.Parse(createdby) ;
                                nPTD.UpdateBy =  int.Parse(createdby) ;


                                _context.PayTypeDistribution.Add(nPTD);
                            }
                            break;
                        case "update":

                            if (existingPTD == null)
                            {
                                errorones++;
                                continue;
                            } else
                            {
                                existingPTD.Name = name;
                                existingPTD.Code = code;
                                existingPTD.Description = description;
                                existingPTD.Percentage = percentage;
                                existingPTD.Entity = entity;
                                existingPTD.Department = department;
                                existingPTD.JobCode = jobCode;
                                existingPTD.PayType = payType;
                                existingPTD.Productive = productive;
                                existingPTD.IsGroup = isGroup;
                                existingPTD.UpdatedDate = DateTime.UtcNow;
                                existingPTD.IsActive = isActive;
                                existingPTD.IsDeleted = isDeleted;
                                existingPTD.UpdateBy = int.Parse(updateby);


                                _context.Entry(existingPTD).State = EntityState.Modified;
                            }

                            break;
                    }

                    await _context.SaveChangesAsync();
                    var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "PAYTYPE", "DISTRIBUTION", payTypeID, _context.PayTypeDistribution.Where(ptd => ptd.Code == code).FirstOrDefault().PayTypeDistributionID);
                    successones++;

                }

                string updateTypeMsg = ((UpdateType=="insert") ? "Inserted" : "Updated");

                ITUpdate.message += $"|| Total {updateTypeMsg} : " + successones;
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
    
        public static async Task<dynamic> GetPayTypeDistributionData(BudgetingContext _context, int id=0)
        {
            var _contxt = getContext(_context);

            List<ABS.DBModels.IdentityUserProfile> _userProfile = await Operations.opIdentityUserProfile.getAllIdentityUserProfile(_context);

            IQueryable<PayTypeDistribution> availablePTDs;

            if (id != 0)
            {
                availablePTDs = _context.PayTypeDistribution.Where(ptd => ptd.PayTypeDistributionID == id);
            } else
            {
                availablePTDs = _context.PayTypeDistribution.Where(ptd => ptd.IsActive == true && ptd.IsDeleted == false);
            }

            return await availablePTDs
                .Select(p => new {
                    ptdID = p.PayTypeDistributionID
                    ,
                    name = p.Name
                    ,
                    code = p.Code
                    ,
                    description = p.Description
                    ,
                    entityID = p.Entity.EntityID
                     ,
                    entitycode = p.Entity.EntityCode
                     ,
                    entityname = p.Entity.EntityName
                     ,
                    departmentID = p.Department.DepartmentID
                     ,
                    departmentcode = p.Department.DepartmentCode
                     ,
                    departmentname = p.Department.DepartmentName
                     ,
                    paytypeID = p.PayType.PayTypeID
                     ,
                    paytypecode = p.PayType.PayTypeCode
                     ,
                    paytypename = p.PayType.PayTypeName
                    ,
                    ptdisgroup = p.IsGroup
                    ,
                    percentagevalue = p.Percentage
                    ,
                    ptdproductive = p.Productive
                    ,
                    updateddate = p.UpdatedDate
                    ,
                    updatedby = p.UpdateBy
                    ,
                    createddate = p.CreationDate
                    ,
                    createdby = p.CreatedBy
                    ,
                    createdbyusername = p.CreatedBy != null ? opIdentityUserProfile.GetUsernamefromList(int.Parse(p.CreatedBy.ToString()), _userProfile) : ""
               ,
                    updatedbyusername = p.UpdateBy != null ? opIdentityUserProfile.GetUsernamefromList(int.Parse(p.UpdateBy.ToString()), _userProfile) : ""


                })
                .ToListAsync();
        }
    }
}
