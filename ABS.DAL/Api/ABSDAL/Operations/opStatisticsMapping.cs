using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Globalization;
using Newtonsoft.Json.Linq;

namespace ABSDAL.Operations
{
    public class opStatisticsMapping
    {
        public opStatisticsMapping()
        {

        }
        private readonly IDistributedCache _distributedCache;
        public opStatisticsMapping(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }
        public static BudgetingContext getStatisticsMappingContext(BudgetingContext _context)
        {





            _context.StatisticMappings.Include(a => a.Entity).ToList();
            _context.StatisticMappings.Include(a => a.Department).ToList();
            _context.StatisticMappings.Include(b => b.PrimaryStatisticMaster).ToList();
            _context.StatisticMappings.Include(b => b.PrimaryStatisticCode).ToList();
            _context.StatisticMappings.Include(b => b.SecondaryStatisticMaster).ToList();
            _context.StatisticMappings.Include(b => b.SecondaryStatisticCode).ToList();
            _context.StatisticMappings.Include(b => b.TertiaryStatisticMaster).ToList();
            _context.StatisticMappings.Include(b => b.TertiaryStatisticCode).ToList();




            return _context;






        }


        public static async Task<APIResponse> StatisticsMappingBulkInsert(JsonElement rawText, BudgetingContext _context)
        {
            try
            {
                var cntxt = opStatisticsCodes.getopStatisticsCodesContext(_context);
                var stmapcntxt = opStatisticsMapping.getStatisticsMappingContext(_context);

                APIResponse ITUpdate = new APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;

                var statisticcodes = await cntxt.StatisticsCodes.Where(k => k.IsDeleted == false && k.IsActive == true).ToListAsync();

                var existingtps = await stmapcntxt.StatisticMappings.Where(l => l.IsDeleted == false && l.IsActive == true).ToListAsync();

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {



                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    int stmapEntity = 0;
                    int stmapdepartmentid = 0;
                    int stmapstatprimaryid = 0;
                    int stmapstatsecondaryid = 0;
                    int stmapstattertiaryid = 0;
                    int stmapstatprimarymasterid = 0;
                    int stmapstatsecondarymasterid = 0;
                    int stmapstattertiarymasterid = 0;
                    string name = "";
                    string code = "";


                    if (HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString() == "")

                    {
                        errorones++;
                     //   continue;
                    }
                    else
                    {
                        name = arrval["name"].ToString();
                    }

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString() == "")

                    {
                        errorones++;
                       // continue;
                    }
                    else
                    {
                        code =arrval["code"].ToString();
                    }



                    if (HelperFunctions.CheckKeyValuePairs(arrval, "entityID").ToString() == "")

                    {
                        errorones++;
                        continue;
                    }
                    else
                    {
                        stmapEntity = int.Parse(arrval["entityID"].ToString());
                    }




                    if (HelperFunctions.CheckKeyValuePairs(arrval, "departmentID").ToString() == "")

                    {
                        errorones++;
                        continue;
                    }
                    else
                    {
                        stmapdepartmentid = int.Parse(arrval["departmentID"].ToString());

                    }




                    if (HelperFunctions.CheckKeyValuePairs(arrval, "primaryStatistics").ToString() == "")

                    {
                      //  errorones++;
                      //  continue;
                    }
                    else
                    {
                        stmapstatprimaryid = int.Parse(arrval["primaryStatistics"].ToString());

                    }

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "secondaryStatistics").ToString() == "")

                    {
                      //  errorones++;
                       // continue;
                    }
                    else
                    {
                        stmapstatsecondaryid = int.Parse(arrval["secondaryStatistics"].ToString());

                    }

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "tertiaryStatistics").ToString() == "")

                    {
                     //   errorones++;
                    //    continue;
                    }
                    else
                    {
                        stmapstattertiaryid = int.Parse(arrval["tertiaryStatistics"].ToString());

                    }

                   
                    if (HelperFunctions.CheckKeyValuePairs(arrval, "primarymasterStatistics").ToString() == "")

                    {
                      //  errorones++;
                     //   continue;
                    }
                    else
                    {
                        stmapstatprimarymasterid = int.Parse(arrval["primarymasterStatistics"].ToString());

                    }

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "secondarymasterStatistics").ToString() == "")

                    {
                     //   errorones++;
                     //   continue;
                    }
                    else
                    {
                        stmapstatsecondarymasterid = int.Parse(arrval["secondarymasterStatistics"].ToString());

                    }

                    if (HelperFunctions.CheckKeyValuePairs(arrval, "tertiarymasterStatistics").ToString() == "")

                    {
                      //  errorones++;
                      //  continue;
                    }
                    else
                    {
                        stmapstattertiarymasterid = int.Parse(arrval["tertiarymasterStatistics"].ToString());

                    }

                   











                    StatisticMappings stMapping = new StatisticMappings();

                  

                    stMapping = existingtps.Where(g => g.Entity.EntityID == stmapEntity
                    && g.Department.DepartmentID == stmapdepartmentid
                    && g.IsActive == true && g.IsDeleted == false).FirstOrDefault();


                    if (stMapping == null )
                    {
                        stMapping = new StatisticMappings();
                    }

                    var entityobj = Operations.opEntities.getEntitiesObjbyID(stmapEntity, _context);

                    if (entityobj != null)
                    {
                        stMapping.Entity = entityobj;


                    } 
                    
                    var deptobj = opDepartments.getDepartmentObjbyID(stmapdepartmentid, _context);

                    if (deptobj != null)
                    {
                        stMapping.Department = deptobj;


                    }

                    stMapping.PrimaryStatisticCode = statisticcodes.Where( p => p.StatisticsCodeID == stmapstatprimaryid).FirstOrDefault() ;
                    stMapping.PrimaryStatisticCode = statisticcodes.Where(p => p.StatisticsCodeID == stmapstatprimaryid).FirstOrDefault();
                    stMapping.SecondaryStatisticCode = statisticcodes.Where(p => p.StatisticsCodeID == stmapstatsecondaryid).FirstOrDefault();
                    stMapping.TertiaryStatisticCode = statisticcodes.Where(p => p.StatisticsCodeID == stmapstattertiaryid).FirstOrDefault();
                    stMapping.PrimaryStatisticMaster = statisticcodes.Where(p => p.StatisticsCodeID == stmapstatprimarymasterid).FirstOrDefault();
                    stMapping.SecondaryStatisticMaster = statisticcodes.Where(p => p.StatisticsCodeID == stmapstatsecondarymasterid).FirstOrDefault();
                    stMapping.TertiaryStatisticMaster = statisticcodes.Where(p => p.StatisticsCodeID == stmapstattertiarymasterid).FirstOrDefault();
                    


                    
                    stMapping.StatisticMappingName = name;
                    stMapping.StatisticMappingCode = code;
                    stMapping.StatisticMappingDescription = name + "||" + code+ "||" + stmapEntity+ "||" + stmapdepartmentid+ "||" + stmapstatprimaryid+ "||" + stmapstatsecondaryid+ "||" + stmapstattertiaryid+ "||" + stmapstatprimarymasterid+ "||" + stmapstatsecondarymasterid+ "||" + stmapstattertiarymasterid;
                    stMapping.IsActive = true;
                    stMapping.IsDeleted = false;
                    stMapping.Identifier = Guid.NewGuid();




                    if (stMapping.StatisticMappingID != 0)
                    {
                        
                        stMapping.UpdatedDate = DateTime.UtcNow;
                        duplicates++;
                        _context.Entry(stMapping).State = EntityState.Modified;



                    }

                    else
                    {
                        stMapping.CreationDate = DateTime.UtcNow;
                        stMapping.UpdatedDate = DateTime.UtcNow;
                        _context.Add(stMapping);
                    }


                    await _context.SaveChangesAsync();


                    successones++;


                }
              
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

    }
}
