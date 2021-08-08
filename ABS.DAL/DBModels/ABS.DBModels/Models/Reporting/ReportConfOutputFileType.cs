using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.Reporting
{
    public class ReportOutputConfiguration
    {
        public int reportConfigurationID { get; set; }
        public string reportConfigurationCode { get; set; }
        public int fileTypeID { get; set; }
        public string fileTypeName { get; set; }
        public string fileTypeExtension { get; set; }



    }

    public class ReportDocumentStructure
    {

        public string heading { get; set; }
        public string Subheading { get; set; }
        public string ColumnHeader { get; set; }
        public string ColumnFooter { get; set; }
        public string ColumnTotal { get; set; }
        public List<string> ReportHeaders { get; set; }
        public List<string> GroupHeaders { get; set; }
        public List<string> GroupFooter { get; set; }
        public List<string> GroupTotal { get; set; }


    }
}
