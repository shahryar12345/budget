using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    public class APIResponse
    {
        public string status { get; set; }
        public string payload { get; set; }

        public string code { get; set; }
        public string error { get; set; }
        public string errorCode { get; set; }
        public string message { get; set; }
        public string Data { get; set; }
        public int  totalCount { get; set; }
        public int  ResponseDataCount { get; set; }

        
    }
}
