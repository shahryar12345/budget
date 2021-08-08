using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ABS.DBModels
{[Table("NotificationTemplates")]
    public class NotificationTemplates
    {
        
        
            [Key]
            public int TemplateID { get; set; }
            public string TemplateType { get; set; }

            public string Category { get; set; }
            public string EmailSubject { get; set; }

            public string EmailBody { get; set; }


            //public ICollection<Payers> Payers_FK { get; set; }


            public string CreatedBy { get; set; }
            public DateTime? CreationDate { get; set; } = DateTime.Now;
            public string UpdatedBy { get; set; }
            public DateTime? UpdateDate { get; set; }

            [Timestamp]
            public Byte[] TimeStamp { get; set; }
        }

    }

