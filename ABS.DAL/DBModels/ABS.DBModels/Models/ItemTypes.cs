using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;


namespace ABS.DBModels
{
    [Table("ItemTypes")]
    public class ItemTypes : IModels
    {
        [Key]
        public int ItemTypeID { get; set; }
        public string ItemTypeKeyword { get; set; }
        public string ItemTypeCode { get; set; }
        public string ItemDataType { get; set; }
        public string ItemTypeValue { get; set; }
        public string ItemTypeDisplayName { get; set; }
        public string ItemTypeDescription { get; set; }

        
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
