using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

using ABSProcessing.Services;
//using StackExchange.Redis;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;


namespace ABSProcessing.DataCache
{
    public class opRedisCache
    {
        //private readonly IDatabase _idb;
        //  private readonly IServiceProvider isp;
        private readonly IDistributedCache _distributedCache;

        public opRedisCache()
        {

        }

        public opRedisCache( IDistributedCache distributedCache)

        {
          
            _distributedCache = distributedCache;
        }



        public async Task SaveToCache<T>(string key, T item, int expirationinSeconds)
        {

            try
            {

              //  var json =  System.Text.Json.JsonSerializer.Serialize(item);
                var json =  Newtonsoft.Json.JsonConvert.SerializeObject(item);
                RedisCacheService redisCacheService = new RedisCacheService(_distributedCache);

                await redisCacheService.CacheResponseAsync(key, json, TimeSpan.FromSeconds(expirationinSeconds));
                //  await _distributedCache.SetStringAsync((key, json, TimeSpan.FromSeconds(expirationinSeconds));

            }
            catch (Exception ex)
            {
                Operations.Logger.LogError(ex);
            }


        }





        public async Task SaveAllDataToCache<T>(string key, ABSProcessing.Context.BudgetingContext _budgetingContext, int expirationinSeconds) where T : class
        {

            try
            {


                var _items = _budgetingContext.Set<T>().ToList();



              //  var json = JsonSerializer.Serialize(_items.ToList());
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(_items.ToList());


                RedisCacheService redisCacheService = new RedisCacheService(_distributedCache);

                await redisCacheService.CacheResponseAsync(key, json, TimeSpan.FromSeconds(expirationinSeconds));
                //  await _distributedCache.SetStringAsync(key, json, TimeSpan.FromSeconds(expirationinSeconds));

            }
            catch (Exception ex)
            {
                Operations.Logger.LogError(ex);
            }


        }
        public async Task<IEnumerable<T>> LoadDataFromDB<T>( ABSProcessing.Context.BudgetingContext _budgetingContext) where T : class
        {

            try
            {


                var _items =  await _budgetingContext.Set<T>().ToListAsync();

                return  _items;


            }
            catch (Exception ex)
            {
                Operations.Logger.LogError(ex);
                return null;
            }


        }

        public async Task<T> RetrieveFromCache<T>(string key)
        {



            // var json = await _distributedCache.GetStringAsync(key);
            RedisCacheService redisCacheService = new RedisCacheService(_distributedCache);

            var json = await redisCacheService.GetCacheResponseAsync(key);
            //  json = System.Web.HttpUtility.JavaScriptStringEncode(json);

          //  json.Replace("\\u0022", "\"");

            if (json != null  && json.Contains("\\u0022"))
            {
               json =  json.Replace("\\u0022", "\"");

            }

            return json != null ? System.Text.Json.JsonSerializer.Deserialize<T>(json) :  default(T);

        }



        public async Task<IEnumerable<T>> RetrieveListFromCache<T>(string key)
        {
            // var json = await _distributedCache.GetStringAsync(key);

            RedisCacheService redisCacheService = new RedisCacheService(_distributedCache);

            var json = await redisCacheService.GetCacheResponseAsync(key);

           //  var deserializeObject = JsonConvert.DeserializeObject(json);


            //if (json != null && json.Contains("\\u0022"))
            //{
            //    json = json.Replace("\\u0022", "\"");

            //}

            if (json != "" && json != null)
            {

                var xdynamic = JsonConvert.DeserializeObject<dynamic>(json);

                var xList = JsonConvert.DeserializeObject<IList<T>>(xdynamic);

                return xList;
            }
            else
            {
                return null;
            }
        }


        //public async Task<int> CheckKeyExists(string keyName)
        //{

        //    var getKeyTTL = await _distributedCache.KeyTimeToLiveAsync(keyName);



        //    if (getKeyTTL == null)
        //    {
        //        return -2;
        //    }

        //    TimeSpan tSeconds = getKeyTTL.Value;
        //    return int.Parse(getKeyTTL.Value.Seconds.ToString());

        //}

        //public async Task<bool> setExpiry(string keyName, int expirationinSeconds)
        //{

        //    var getKeyTTL = await _distributedCache..KeyExpireAsync(keyName, TimeSpan.FromSeconds(expirationinSeconds));



        //    return bool.Parse(getKeyTTL.ToString());

        //}


        public async Task<IEnumerable<T>> refreshKeyData<T>(string keyName, ABSProcessing.Context.BudgetingContext _budgetContext, int expirationinSeconds ) where T : class
        {
            if (_distributedCache == null)
            {

             return await   LoadDataFromDB<T>(_budgetContext);
            }
            else
            {



                var x = await RetrieveListFromCache<T>(keyName);

                if (x != null)
                {
                    return x;
                }
                else
                {
                    await SaveAllDataToCache<T>(keyName, _budgetContext, expirationinSeconds);
                    x = await RetrieveListFromCache<T>(keyName);
                    return x;
                }


            }

            // SaveAllDataToCache<T>(keyName, _budgetContext, expirationinSeconds);

            //int ttl = await CheckKeyExists(keyName);

            //if (ttl == -1)
            //{
            //    await setExpiry(keyName, 0);
            //   //await  SaveAllDataToCache<T>(keyName, _budgetContext, expirationinSeconds);


            //}
            //else
            //    if (ttl == -2)
            //{
            //    SaveAllDataToCache<T>(keyName, _budgetContext, expirationinSeconds);

            //}
            //else
            //if (ttl > 10)
            //{

            //}
            //return true;
        }

    }
}
