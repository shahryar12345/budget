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
using Microsoft.IdentityModel;
using IdentityServer4;
using IdentityServer.LdapExtension.Extensions;
using IdentityServer.LdapExtension.UserModel;
 

namespace AuthServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        //    readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();


            //services.AddControllers().AddJsonOptions(options =>
            //{
            //    // Use the default property (Pascal) casing.
            //    options.JsonSerializerOptions.PropertyNamingPolicy = null;

            //    // Configure a custom converter.
            //    //options.JsonSerializerOptions.Converters.Add(new MyCustomJsonConverter());
            //});
            services.AddSwaggerDocument(a => a.Title = "ABS AUTHENTICATION");

            services.AddCors();

            var IDS = services.AddIdentityServer(opt => { });


            IDS.AddDeveloperSigningCredential(); /// Need to be updated as per Production Certificate
            IDS.AddInMemoryIdentityResources(Config.IdentityResources);
            IDS.AddInMemoryApiScopes(Config.ApiScopes);
            IDS.AddInMemoryApiResources(Config.ApiResources);
            IDS.AddInMemoryClients(Config.Clients);
            IDS.AddLdapUsers<OpenLdapAppUser>(this.Configuration.GetSection("LDAPServer"), UserStore.InMemory);
                // .AddTestUsers(TestUsers.Users);
                
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseIdentityServer();

            app.UseCors(options => options.AllowAnyOrigin());

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseOpenApi();
            app.UseSwaggerUi3();
            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
