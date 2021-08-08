using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    interface IModels
    {
       
        public DateTime? CreationDate  { get; set; }
        public DateTime? UpdatedDate{ get; set; }
        public int? CreatedBy { get; set; }

        public int? UpdateBy{ get; set; }

        public bool? IsActive { get; set; } 
        public bool? IsDeleted{ get; set; }
        [Timestamp]
        public Byte[] RowVersion { get; set; }
        public Guid? Identifier { get; set; }
    }
}
