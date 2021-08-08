using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Services
{
    public interface IServiceInitializer

    {
        public void AddInitializer(IConfiguration iconfiguration, IServiceCollection iServiceCollection);
      
    }
}
