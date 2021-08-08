using System;

namespace ABSDAL
{
    public class Forecast
    {
        public DateTime Date { get; set; }

        public int Values { get; set; }

        public int Formula { get; set; }

        public string Summary { get; set; }
    }
}
