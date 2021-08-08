using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ABS.DBModels
{


    [Table("Notification")]
    public class Notification
    {

        [Key]
        public int NotificationID { get; set; }

        public string Comments { get; set; }

        public int TicketInformationID { get; set; }

        public int SentByID { get; set; }
        public virtual IdentityUserProfile IdentityUserProfile_SEntBy_FK { get; set; }

        public int? RecipientID { get; set; }
        public virtual IdentityUserProfile IdentityUserProfile_Recipient_FK { get; set; }



        public string Subject { get; set; }
        public string Body { get; set; }
        public string EventCategory { get; set; }
        public string ToAddress { get; set; }
        public string CCAddress { get; set; }
        public int EmailTemplateID { get; set; }

        public int NotificationTypeID { get; set; }
        public virtual ItemTypes NotificationItemTypeIDs_FK { get; set; }


        public virtual ItemTypes Statuses_FK { get; set; }

        public bool isExternal { get; set; }


        public string CreatedBy { get; set; }
        public DateTime? CreationDate { get; set; } = DateTime.Now;
        public string UpdatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }

        [Timestamp]
        public Byte[] TimeStamp { get; set; }


    }
}