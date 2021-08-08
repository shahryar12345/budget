using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
using StackExchange.Redis;
using Microsoft.EntityFrameworkCore;

namespace ABSDAL.DataCache
{
    public class opCache
    {
        private readonly IDatabase _idb;

        public opCache(IDatabase  database             )
        {
            _idb = database;
        }
        public async Task SaveToCache<T>(string key, T item, int expirationinSeconds)
        {

            try
            {
            var json =  JsonSerializer.Serialize(item);

            await _idb.StringSetAsync(key, json, TimeSpan.FromSeconds(expirationinSeconds)) ;

            }
            catch (Exception ex)
            {
                Operations.Logger.LogError(ex);
            }
           
            
        }
         public async void SaveAllDataToCache<T>(string key, ABSDAL.Context.BudgetingContext _budgetingContext, int expirationinSeconds)  where T : class
        {

            try
            {

                    
                var _items = _budgetingContext.Set<T>().ToList();
                


            var json =  JsonSerializer.Serialize(_items.ToList());

            await _idb.StringSetAsync(key, json, TimeSpan.FromSeconds(expirationinSeconds)) ;

            }
            catch (Exception ex)
            {
                Operations.Logger.LogError(ex, _budgetingContext);
            }
           
            
        }

        public async Task<T> RetrieveFromCache<T>(string key)
        {
            var json = await _idb.StringGetAsync(key);

           

            return JsonSerializer.Deserialize<T>(json);
          
        } 
        
        
        
        public async Task<IEnumerable<T>> RetrieveListFromCache<T>(string key)
        {
            var json = await _idb.StringGetAsync(key);
            if (json.HasValue)
            {

                List<T> xList = JsonSerializer.Deserialize<List<T>>(json);

                return xList;
            }
            else
            {
                return null;
            }
        }


        public async Task<int> CheckKeyExists (string keyName)
        {

            var getKeyTTL = await _idb.KeyTimeToLiveAsync(keyName);

           

            if (getKeyTTL == null )
            {
                return  -2;
            }

            TimeSpan tSeconds = getKeyTTL.Value;
            return  int.Parse(getKeyTTL.Value.Seconds.ToString());

        } 
        
        public async Task<bool> setExpiry (string keyName, int expirationinSeconds)
        {

            var getKeyTTL = await _idb.KeyExpireAsync(keyName, TimeSpan.FromSeconds(expirationinSeconds));



            return  bool.Parse(getKeyTTL.ToString());

        }


        public async Task<bool> refreshKeyData <T>(string keyName , ABSDAL.Context.BudgetingContext  _budgetContext, int expirationinSeconds) where T:class
        {
           int ttl = await CheckKeyExists(keyName);

            if (ttl == -1)
            {
              await  setExpiry(keyName, 0);
                SaveAllDataToCache<T>(keyName, _budgetContext, expirationinSeconds);


            }
            else
                if (ttl == -2)
            {
                SaveAllDataToCache<T>(keyName, _budgetContext, expirationinSeconds);

            }
            else
            if (ttl > 10)
            {

            }
            return true;
        }
    }
}
