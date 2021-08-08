using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Serilog;
using StackExchange.Redis;
using ABSDAL.Services;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;

namespace ABSDAL
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddControllers();
            //services.AddSingleton<BackgroundTaskExecutor>();
            services.AddHostedService<BackgroundTaskExecutor>();
            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();



            // Grab the connection string provided by the host / container through environment variables
            // IE: set by the docker-compose file
            var user = Environment.GetEnvironmentVariable("DB_USER");
            var pass = Environment.GetEnvironmentVariable("DB_PASSWORD");
            var server = Environment.GetEnvironmentVariable("DB_SERVER");
            var database = Environment.GetEnvironmentVariable("DB_DATABASE");

            string dbConnectionString = "Server=" + server + ";Database=" + database + ";User Id=" + user + ";password=" + pass + ";Trusted_Connection=false;MultipleActiveResultSets=true";

            Console.WriteLine("dbConnectionString: " + dbConnectionString);

            dbConnectionString = "Server=localhost;Database=BUDGET_DB;User Id=sa;password=admin123456......;Trusted_Connection=false;MultipleActiveResultSets=true";

            services.AddDbContext<Context.BudgetingContext>(
                opt =>
                opt.UseSqlServer(dbConnectionString)
                    , ServiceLifetime.Transient
            );

            services.AddSwaggerDocument(a => a.Title = "BUDGETING");

            var serviceinitializer = typeof(Startup).Assembly.ExportedTypes.Where(i => typeof(IServiceInitializer).IsAssignableFrom(i)
            && !i.IsAbstract && !i.IsInterface)
                .Select(Activator.CreateInstance)
                .Cast<IServiceInitializer>()
                .ToList();

            serviceinitializer.ForEach(init => init.AddInitializer(Configuration, services));

            if (bool.Parse(Configuration.GetValue<string>("RedisConfiguration:UseRedis")))
            {
                var redis = ConnectionMultiplexer.Connect(Configuration.GetValue<string>("RedisConfiguration:ServerAddress"));
                services.AddScoped(x => redis.GetDatabase());
            }

            //services.AddMvcCore().AddNewtonsoftJson();
            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
                options.Providers.Add<GzipCompressionProvider>();
            });

            //  services.AddResponseCaching();


        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            app.UseHttpsRedirection();
            app.UseSerilogRequestLogging();
            app.UseRouting();
            app.UseOpenApi();
            app.UseSwaggerUi3();
            app.UseAuthorization();
            app.UseResponseCompression();
            //   app.UseResponseCaching();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });
        }
    }
}
