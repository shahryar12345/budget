using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ABS.DBModels
{
    [Table("PayTypes")]
    public class PayTypes : IModels
    {
        [Key]
        public int PayTypeID { get; set; }
        public string PayTypeCode { get; set; }
        public string PayTypeName { get; set; }
        public string PayTypeDescription { get; set; }
        public string Lowcode { get; set; }
        public string HighCode { get; set; }
        public bool? IsMaster { get; set; }
        public bool? IsGroup { get; set; }
        public bool? AccumulateHours { get; set; }

        [JsonIgnore]
        public virtual PayTypes PayTypeMaster { get; set; }
        public virtual ItemTypes PayTypeType { get; set; }



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
