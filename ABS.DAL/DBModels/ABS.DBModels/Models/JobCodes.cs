using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("JobCodes")]
    public class JobCodes: IModels
    {
        [Key]
        public int JobCodeID { get; set; }
        public string JobCodeCode { get; set; }
        public string JobCodeName { get; set; }
        public string JobCodeDescription { get; set; }
        public string Lowcode { get; set; }
        public string HighCode { get; set; }
        public bool? IsMaster { get; set; }
        public bool? IsGroup { get; set; }
      
        [JsonIgnore]
        public virtual JobCodes JobCodeMaster { get; set; }
        public string JobCodeObjectReferenceID { get; set; }
        public string Comments { get; set; }




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
