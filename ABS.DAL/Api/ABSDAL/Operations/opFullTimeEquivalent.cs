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
    public class opFullTimeEquivalent
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
            
            _context.FullTimeEquivalent.Include(a => a.Entity).ToList();
            _context.FullTimeEquivalent.Include(a => a.Department).ToList();
            _context.FullTimeEquivalent.Include(a => a.JobCode).ToList();
            _context.FullTimeEquivalent.Include(a => a.TimePeriod).ToList();

            return _context;

        }

        public async Task<List<FullTimeEquivalent>> getFTEDivisors(int timePeriodID, BudgetingContext context)
        {
            var _ftes = await context.FullTimeEquivalent
                .Where(e => e.TimePeriod.TimePeriodID == timePeriodID && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _ftes;
        }

        public static async Task<ABS.DBModels.APIResponse> FTEsBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context, string UpdateType)
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
                    int FullTimeEquivalentID = 0;
                    int TimePeriodID = 0;
                    int EntityID = 0;
                    int DepartmentID = 0;
                    int JobCodeID = 0;
                    decimal January = 0;
                    decimal February = 0;
                    decimal March = 0;
                    decimal April = 0;
                    decimal May = 0;
                    decimal June = 0;
                    decimal July = 0;
                    decimal August = 0;
                    decimal September = 0;
                    decimal October = 0;
                    decimal November = 0;
                    decimal December = 0;
                    bool isActive = true;
                    bool isDeleted = false;

                    FullTimeEquivalent existingFTE = null;

                    try
                    {
                        FullTimeEquivalentID = int.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "fullTimeEquivalentID").ToString());
                    }
                    catch
                    {
                        FullTimeEquivalentID = 0;
                    }

                    try
                    {
                        TimePeriodID = int.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "timePeriodID").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        EntityID = int.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "entityID").ToString());
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
                        errorones++;
                        continue;
                    }

                    try
                    {
                        JobCodeID = int.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "jobCodeID").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        January = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "january").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        February = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "february").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        March = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "march").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        April = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "april").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        May = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "may").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        June = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "june").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        July = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "july").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        August = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "august").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        September = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "september").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        October = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "october").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        November = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "november").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
                    }

                    try
                    {
                        December = decimal.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "december").ToString());
                    }
                    catch
                    {
                        errorones++;
                        continue;
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

                    Entities fTEEntity = _context.Entities.Where(e => e.EntityID == EntityID).FirstOrDefault();
                    Departments fTEDept = _context.Departments.Where(d => d.DepartmentID == DepartmentID).FirstOrDefault();
                    JobCodes fTEJobCode = _context.JobCodes.Where(jc => jc.JobCodeID == JobCodeID).FirstOrDefault();
                    TimePeriods fTETimePeriod = _context.TimePeriods.Where(t => t.TimePeriodID == TimePeriodID).FirstOrDefault();

                    if (FullTimeEquivalentID == 0)
                    {
                        existingFTE = _context.FullTimeEquivalent.Where(fte => fte.Entity == fTEEntity
                                                                              && fte.Department == fTEDept
                                                                              && fte.JobCode == fTEJobCode
                                                                              && fte.TimePeriod == fTETimePeriod).FirstOrDefault();
                    } else
                    {
                        existingFTE = _context.FullTimeEquivalent.Where(fte => fte.FullTimeEquivalentID == FullTimeEquivalentID).FirstOrDefault();
                    }

                    switch (UpdateType)
                    {
                        case "insert":
                            if (existingFTE != null)
                            {
                                //We don't want to recreate a record if a deleted/inactivated record already exists
                                if (existingFTE.IsActive == false || existingFTE.IsDeleted == true)
                                {
                                    existingFTE.Entity = fTEEntity;
                                    existingFTE.Department = fTEDept;
                                    existingFTE.TimePeriod = fTETimePeriod;
                                    existingFTE.JobCode = fTEJobCode;
                                    existingFTE.January = January;
                                    existingFTE.February = February;
                                    existingFTE.March = March;
                                    existingFTE.April = April;
                                    existingFTE.May = May;
                                    existingFTE.June = June;
                                    existingFTE.July = July;
                                    existingFTE.August = August;
                                    existingFTE.September = September;
                                    existingFTE.October = October;
                                    existingFTE.November = November;
                                    existingFTE.December = December;
                                    existingFTE.UpdatedDate = DateTime.UtcNow;
                                    existingFTE.IsActive = isActive;
                                    existingFTE.IsDeleted = isDeleted;

                                    _context.Entry(existingFTE).State = EntityState.Modified;
                                } else
                                {
                                    duplicates++;
                                    continue;
                                }
                            } else
                            {
                                FullTimeEquivalent nFTE = new FullTimeEquivalent();

                                nFTE.Entity = fTEEntity;
                                nFTE.Department = fTEDept;
                                nFTE.JobCode = fTEJobCode;
                                nFTE.TimePeriod = fTETimePeriod;
                                nFTE.January = January;
                                nFTE.February = February;
                                nFTE.March = March;
                                nFTE.April = April;
                                nFTE.May = May;
                                nFTE.June = June;
                                nFTE.July = July;
                                nFTE.August = August;
                                nFTE.September = September;
                                nFTE.October = October;
                                nFTE.November = November;
                                nFTE.December = December;
                                nFTE.Identifier = Guid.NewGuid();
                                nFTE.IsActive = isActive;
                                nFTE.IsDeleted = isDeleted;
                                nFTE.CreationDate = DateTime.UtcNow;
                                nFTE.UpdatedDate = DateTime.UtcNow;

                                _context.FullTimeEquivalent.Add(nFTE);
                            }
                            break;
                        case "update":

                            if (existingFTE == null)
                            {
                                errorones++;
                                continue;
                            } else
                            {
                                existingFTE.Entity = fTEEntity;
                                existingFTE.Department = fTEDept;
                                existingFTE.TimePeriod = fTETimePeriod;
                                existingFTE.JobCode = fTEJobCode;
                                existingFTE.January = January;
                                existingFTE.February = February;
                                existingFTE.March = March;
                                existingFTE.April = April;
                                existingFTE.May = May;
                                existingFTE.June = June;
                                existingFTE.July = July;
                                existingFTE.August = August;
                                existingFTE.September = September;
                                existingFTE.October = October;
                                existingFTE.November = November;
                                existingFTE.December = December;
                                existingFTE.UpdatedDate = DateTime.UtcNow;
                                existingFTE.IsActive = isActive;
                                existingFTE.IsDeleted = isDeleted;

                                _context.Entry(existingFTE).State = EntityState.Modified;
                            }

                            break;
                    }

                    await _context.SaveChangesAsync();
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
    }
}
