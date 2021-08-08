using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ABS.DBModels
{
    //[NotMapped]

    [Table("Integrationlogs")]
    public class Integrationlogs
    {
        [Key]
        public int MLogID { get; set; }

        //[Required]
        public string SourceURL { get; set; }
        public string TargetURL { get; set; }
        [Column(TypeName = "text")]
        public string DataREceivedfromSource { get; set; }
        [Column(TypeName = "text")]
        public string DataPushedtoTarget { get; set; }
        public string ResponsefromSource { get; set; }
        public string ResponsefromTarget { get; set; }
        //[NotMapped]
        //public Exception Exception { get; set; }

        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; } = DateTime.Now;


        [Timestamp]
        public Byte[] TimeStamp { get; set; }


    }
}
