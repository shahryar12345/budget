using ABSDAL.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSDAL.DataCache
{
    public class CacheInitializer : IServiceInitializer
    {
        public void AddInitializer(IConfiguration iconfiguration, IServiceCollection iServiceCollection)
        {


            var redisCacheSetting = new RedisConfiguration();
            iconfiguration.GetSection(nameof(RedisConfiguration)).Bind(redisCacheSetting);
            iServiceCollection.AddSingleton(redisCacheSetting);


            if(!redisCacheSetting.UseRedis)
            {
                return;
            }



            //var redis = StackExchange.Redis.ConnectionMultiplexer.Connect(redisCacheSetting.ServerAddress+":"+redisCacheSetting.port);

            //iServiceCollection.AddScoped(x => redis.GetDatabase());


            iServiceCollection.AddDistributedRedisCache(opt => opt.Configuration = redisCacheSetting.connectionString);
            iServiceCollection.AddSingleton<IResponseCacheService, RedisCacheService>();

        }
    }
}
