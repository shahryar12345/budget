using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.ADSIntegrator.Operations
{
    public class APIEndpoint
    {
        public string Name { get; set; }
        public string BaseAddress { get; set; }
        public Dictionary<string, string>  RequestHeaders { get; set; }
        public string Function { get; set; }
        public int? Interval { get; set; }
        public string cronstring { get; set; }

        
    }
}
