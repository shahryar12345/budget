using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace ABS.ADSIntegrator
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





            services.AddControllers();

            services.AddSwaggerGen(c =>
          {
              c.SwaggerDoc("v1", new OpenApiInfo { Title = "Budgeting Integrator", Version = "v1" });


              c.TagActionsBy(api =>
              {
                  if (api.GroupName != null)
                  {
                      return new[] { api.GroupName };
                  }

                  var controllerActionDescriptor = api.ActionDescriptor as ControllerActionDescriptor;
                  if (controllerActionDescriptor != null)
                  {
                      return new[] { controllerActionDescriptor.ControllerName };
                  }

                  throw new InvalidOperationException("Unable to determine tag for endpoint.");
              });
              c.DocInclusionPredicate((name, api) => true);
          });


            services.AddHttpClient();

            if (bool.Parse(Configuration.GetValue<string>("HangfireConfig:EnableHangfire")))
            {

                // Grab the connection string provided by the host / container through environment variables
                // IE: set by the docker-compose file
                var user = Environment.GetEnvironmentVariable("DB_USER");
                var pass = Environment.GetEnvironmentVariable("DB_PASSWORD");
                var server = Environment.GetEnvironmentVariable("DB_SERVER");
                var database = Environment.GetEnvironmentVariable("DB_DATABASE");

                 string dbConnectionString = "Server=" + server + ";Database=" + database + ";User Id=" + user + ";password=" + pass + ";Trusted_Connection=false;MultipleActiveResultSets=true";
               
                Helper.Logger.LogMessage("INFO", "Integrator: Startup: DBConnectionString : ", dbConnectionString);
              
              try {
                    services.AddHangfire(x =>
                        x.UseSqlServerStorage(dbConnectionString
                        ,
                    new SqlServerStorageOptions
                    {
                        SlidingInvisibilityTimeout =  TimeSpan.FromMinutes(5),
                        PrepareSchemaIfNecessary = true,
                        CommandBatchMaxTimeout = TimeSpan.FromMinutes(15),
                        QueuePollInterval = TimeSpan.FromMinutes(1),
                        UseRecommendedIsolationLevel = true,
                        UsePageLocksOnDequeue = true,
                        DisableGlobalLocks = true
                    }));
                    //x.UseSqlServerStorage(dbConnectionString, new SqlServerStorageOptions
                    //{
                    //    CommandBatchMaxTimeout = TimeSpan.FromMinutes(30),
                    //    SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                    //    QueuePollInterval = TimeSpan.Zero,
                    //    UseRecommendedIsolationLevel = true,
                    //    UsePageLocksOnDequeue = true,
                    //    DisableGlobalLocks = true
                    //}));
                } catch (Exception exception) {
                  // Force container to close if no connection is successful
                  // This allows it to restart on failure via docker-compose config
                  Environment.Exit(1);
              }
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP requestrs pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            if (bool.Parse(Configuration.GetValue<string>("HangfireConfig:EnableHangfire")))
            {
                app.UseHangfireServer();
                string username = Configuration.GetValue<string>("HangfireConfig:DashboardUsername");
                string pwd = Configuration.GetValue<string>("HangfireConfig:DashboardPassword");

                var options = HangfireHelper.HangfireDashboard.getHangfileDashboardOptions(username, pwd);


                app.UseHangfireDashboard("/hangfire", options);

                HangfireHelper.JobScheduler.SchedulenRunJobs(Configuration);

            }
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();


            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
           

        }
    }
}
