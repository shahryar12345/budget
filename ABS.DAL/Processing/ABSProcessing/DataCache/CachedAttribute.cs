using System;

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ABSProcessing.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace ABSProcessing.DataCache
{
    [AttributeUsage(AttributeTargets.Class| AttributeTargets.Method)]
    public class CachedAttribute : Attribute, IAsyncActionFilter
    {
        private readonly int _TTLinSeconds;

        public CachedAttribute(int timetoliveinseconds)
        {
            _TTLinSeconds = timetoliveinseconds;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {

            var cacheEnabled = context.HttpContext.RequestServices.GetRequiredService<RedisConfiguration>();

            if(!cacheEnabled.UseRedis)
            {
                await next();
                return;
            }

            var RedisService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();


            var cacheKey = GenerateKeyName(context.HttpContext.Request);

            var getResponsefromCache = await RedisService.GetCacheResponseAsync(cacheKey);

            if (!string.IsNullOrEmpty(getResponsefromCache))
            {
                var contentresult = new ContentResult
                {
                    Content = getResponsefromCache
                    ,
                    StatusCode = 200
                    ,
                    ContentType = "application/json"

                };

                context.Result = contentresult;
                return;
            }



            var apiResponse = await next();
          
            if (apiResponse.Result is OkObjectResult okObjectResult)
            {
                await RedisService.CacheResponseAsync(cacheKey, okObjectResult.Value, TimeSpan.FromSeconds(_TTLinSeconds));

            }


        }

        private static string GenerateKeyName(HttpRequest request)
        {
            var keyGenerator = new StringBuilder();


            keyGenerator.Append($"{request.Path}");

            foreach (var (key,value) in request.Query.OrderBy(s => s.Key))
            {
                keyGenerator.Append($"|{key}_{value}");
            }


            return keyGenerator.ToString();

        }
    }
}
