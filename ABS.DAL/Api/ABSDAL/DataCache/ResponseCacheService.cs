using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
using StackExchange.Redis;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Caching.Distributed;
using ABSDAL.Services;

namespace ABSDAL.DataCache
{
    public class RedisCacheService : IResponseCacheService
    {
     

        private readonly IDistributedCache _iDistributedCache;

        public RedisCacheService(  IDistributedCache distributedCache)
        {
            
            _iDistributedCache = distributedCache;
        }

        public async Task CacheResponseAsync(string key, object cachedResponse, TimeSpan timetoliveseconds)
        {
            if (cachedResponse == null)
            {
                return;

            }
            var serializeObject = JsonSerializer.Serialize(cachedResponse);

            await _iDistributedCache.SetStringAsync(key, serializeObject, new DistributedCacheEntryOptions
                {
                AbsoluteExpirationRelativeToNow = timetoliveseconds
            });

        }


        
        public async Task<string> GetCacheResponseAsync(string key)
        {

            var cachedResponse = await _iDistributedCache.GetStringAsync(key);

            return string.IsNullOrEmpty(cachedResponse) ? null : cachedResponse; 


        }



    }
}
