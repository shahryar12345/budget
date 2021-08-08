using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models
{
    [Table("BackgroundJobs")]
    public class BackgroundJobs
    {
        [Key]
        public int BGJId { get; set; }
        public int StateId { get; set; }
        public string StateName { get; set; }
        public string InvocationData { get; set; }
        public string Arguments { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpireAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Guid Identifier { get; set; }
        public Guid HangfireIdentifier { get; set; }
        public string userIdentifier { get; set; }
        
 

    }
}
