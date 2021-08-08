using ABSProcessing.Context;
using ABSProcessing.Operations;
using EFCore.BulkExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Services
{
    public class DBOperations
    {

        public async static Task<bool> ProcessData<T>(T dataobj, BudgetingContext _context) where T : class
        {
            //int thresholdpercent = Services.ProcessingMethods.getProcessingThreshold(_context);
            await Task.Delay(1);



            return true;
        }

        public static int getProcessingThreshold(BudgetingContext _context)
        {
            var ProcessingMethod = opItemTypes.getItemTypeObjbyKeywordCode("CONFIGURATION", "DATABASEPROCESSINGTHRESHOLD", _context);


            return int.Parse(ProcessingMethod.ItemTypeValue);
        }
        public async static  Task SaveDBObjectUpdates<T>(List<T> dataobj, bool isUpdate, BudgetingContext _context)
        {
            try
            {


                if (dataobj.Count > 0 && !isUpdate)
                {
                    int dbthreshold = getProcessingThreshold(_context);
                    int totalitems = dataobj.Count();


                    if (totalitems < dbthreshold)
                    {
                        dbthreshold = totalitems;
                    }
                    else
                    {


                    }

                    int counter = 0;
                    int remainingRecords = totalitems;
                    _context.ChangeTracker.AutoDetectChangesEnabled = false;

                   // Console.WriteLine ($"Objects need to insert:  {dataobj.Count() }");
                    foreach (var newdataitem in dataobj)

                    {
                        _context.Add(newdataitem);
                        counter++;
                        remainingRecords--;
                        Console.WriteLine  ($"%%%% Remaining Records : " + remainingRecords);




                        if (counter < dbthreshold && remainingRecords > dbthreshold)
                        {


                        }
                        else
                        {
                            await _context.SaveChangesAsync();
                            counter = 0;
                        }


                    }
                }
                if (dataobj.Count > 0 && isUpdate)
                {
                    int dbthreshold = getProcessingThreshold(_context);
                    int counter = 0;
                    int totalitems = dataobj.Count();
                    int currentcount = 0;
                    _context.ChangeTracker.AutoDetectChangesEnabled = false;

                   // Console.WriteLine  ($"Objects need to Update:  {dataobj.Count() }");
                    foreach (var item in dataobj)

                    {
                        if (currentcount < dbthreshold)
                        { dbthreshold = currentcount * (25 / 100); }
                        Console.WriteLine  ($"%%%% Remaining Records : " + currentcount);

                        counter++;
                        if (counter < dbthreshold)
                        {


                        }
                        else
                        {
                            lock (_context)
                            {
                                _context.Entry(item).State = EntityState.Modified;

                                _context.SaveChangesAsync();
                            }
                            counter = 0;
                        }

                    }

                }

                await Task.Delay(1);
            }
            catch (Exception ex)
            {
                Console.WriteLine  (ex);
                throw;
            }
            finally
            {
                _context.ChangeTracker.AutoDetectChangesEnabled = true;
            }
        }

        public static async Task SaveBulkDBObjectUpdates<T>(List<T> dataobj, bool isUpdate, BudgetingContext _context) where T : class
        {
            try
            {
                Console.WriteLine("BULK INSERT OPERATION");
                _context.Set<T>();
                _context.BulkInsertOrUpdate(dataobj);
                await Task.Delay(1);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                throw;
            }
            finally
            {
                // _context.ChangeTracker.AutoDetectChangesEnabled = true;
            }
        }
    }
}
