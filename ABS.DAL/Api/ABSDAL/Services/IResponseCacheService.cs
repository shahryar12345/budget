using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSDAL.Services
{
    public interface IResponseCacheService
    {
        public  Task CacheResponseAsync(string key, object cachedResponse, TimeSpan timetoliveseconds);

        public  Task<string> GetCacheResponseAsync(string key);

        //public Task SaveToCache<T>(string key, T item, int expirationinSeconds);
        //public void SaveAllDataToCache<T>(string key, Context.BudgetingContext _budgetingContext, int expirationinSeconds);
        //public Task<T> RetrieveFromCache<T>(string key);
        //     public Task<IEnumerable<T>> RetrieveListFromCache<T>(string key);
        //public  Task<int> CheckKeyExists(string keyName);

        //public Task<bool> setExpiry(string keyName, int expirationinSeconds);


        //public Task<bool> refreshKeyData<T>(string keyName, ABSDAL.Context.BudgetingContext _budgetContext, int expirationinSeconds);

    }
}
