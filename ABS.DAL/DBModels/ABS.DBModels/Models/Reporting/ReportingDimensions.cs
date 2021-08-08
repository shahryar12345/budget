using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("ReportingDimensions")]
    public class ReportingDimensions : IModels
    {
        [Key]
        public int ReportingDimensionID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Comments { get; set; }
        public string Name { get; set; }
        public string value { get; set; }
        public string ReportProcessingStatus { get; set; }
        public string ReportDetails { get; set; }
        public string ReportData { get; set; }
        public string Path { get; set; }
        public string RelatedPath { get; set; }
        public string ReportPath { get; set; }
        public virtual ItemTypes ReportStatus { get; set; }
        public virtual ItemTypes ScenarioType { get; set; }
        public string JsonConfig { get; set; }
        public int?  UserProfileID { get; set; }

         

        public Guid? Identifier { get ; set ; }
        public DateTime? CreationDate { get ; set ; }
        public DateTime? UpdatedDate { get ; set ; }
        public int? CreatedBy { get ; set ; }
        public int? UpdateBy { get ; set ; }
        public bool? IsActive { get ; set ; }
        public bool? IsDeleted { get ; set ; }
        public byte[] RowVersion { get ; set ; }
    }
}
