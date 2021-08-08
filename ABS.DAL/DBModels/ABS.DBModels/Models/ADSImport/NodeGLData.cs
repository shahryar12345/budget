using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.ADSImport
{
    public class NodeGLData
    {

        public int? objectId { get; set; }
        public bool? isNode { get; set; }
        public int? parentId { get; set; }
        public int? hierarchyId { get; set; }
        public string acctMastCode { get; set; }
        public string glAcctCode { get; set; }
        public string depth { get; set; }
        public string ordering { get; set; }
        public string accountTypeCode { get; set; }


    }
}
