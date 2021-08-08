using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.ADSImport
{
    public class NodeDepartmentData
    {
        public int? objectId { get; set; }
        public string deptCode { get; set; }
        public string deptMastCode { get; set; }
        public string relationshipType { get; set; }
        public string depth { get; set; }
        public string ordering { get; set; }
        public int? hierarchyId { get; set; }
        public int? parentId { get; set; }
        public NodeDepartmentData departmentNodeChildIdentifier { get; set; }

    }
}
