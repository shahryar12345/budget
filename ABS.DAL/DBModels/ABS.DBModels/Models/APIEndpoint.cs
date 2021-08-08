using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("APIEndpoints")]
    public class APIEndpoint
    {
        [Key]
        public int APIEndpointID { get; set; }

        public string Name { get; set; }
        public string BaseAddress { get; set; }
        public string RequestHeaders { get; set; }
        public string Function { get; set; }
        public int? Interval { get; set; }
        public string cronstring { get; set; }
        public string APICode { get; set; }
        public string EnvironmentName { get; set; }

        public Guid? Identifier { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdateBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public byte[] RowVersion { get; set; }
    }
}
