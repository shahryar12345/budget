using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels
{
    [Table("Entities")]
    public class Entities : IModels
    {
        [Key]
        public int EntityID { get; set; }
        public string EntityCode { get; set; }
        public string EntityName { get; set; }
        public string Description { get; set; }

        //ABS-44 - JAB 04/30/2020
        public virtual ChargeCodes ChargeCode { get; set; }
        public virtual Departments Department { get; set; }
        public virtual Accounts Account { get; set; }
        public virtual JobCodes JobCode { get; set; }
        public virtual PayTypes PayType { get; set; }
        public virtual Addresses Address { get; set; }

  
       // public bool? isMaster { get; set; }
        
        //ABS-231 - 05/28/2020
        public bool? isGroup { get; set; }
        //ABS-231




        public bool? Clinical { get; set; }
        public bool? CostAccounting { get; set; }
        public bool? InsuranceCarrier { get; set; }
        public bool? SellerOfServices { get; set; }
        public bool? BuyerOfService { get; set; }
        public bool? CareDeliverFacility { get; set; }
        public string PayPeriodCalendarId { get; set; }
        public string FiscalYearCalendarId { get; set; }
        public string CurrentMonth { get; set; }
        public string CurrentDay { get; set; }
        public string EffectiveDate { get; set; }
        public string CostModelId { get; set; }
        public string EntityTypeId { get; set; }
        public string npiEntity { get; set; }

        //End ABS-44

        public int? ParentID { get; set; }
        public string ChildID { get; set; }

        public virtual ItemTypes DataSourceID { get; set; }

        public Guid? Identifier { get; set; }
        public DateTime? CreationDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdateBy { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
