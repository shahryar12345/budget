using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.ContextClasses
{
    public class SFContextClass
    {
        public decimal? April { get; }
        public decimal? August { get; }
        public BudgetVersions BudgetVersion { get; }
        public int BudgetVersionStaffingID { get; }
        public DataScenario DataScenarioID { get; }
        public ItemTypes DataScenarioTypeID { get; }
        public decimal? December { get; }
        public Departments Department { get; }
        public Entities Entity { get; }
        public Dimensions DimensionsRowID { get; }
        public decimal? February { get; }
        public Guid? Identifier { get; }
        public bool? IsActive { get; }
        public bool? IsDeleted { get; }
        public decimal? January { get; }
        public JobCodes JobCode { get; }
        public decimal? July { get; }
        public decimal? June { get; }
        public decimal? March { get; }
        public decimal? May { get; }
        public decimal? November { get; }
        public decimal? October { get; }
        public PayTypes PayType { get; }
        public decimal? RowTotal { get; }
        public byte[] RowVersion { get; }
        public decimal? September { get; }
        public ItemTypes StaffingDataType { get; }
        public TimePeriods TimePeriodID { get; }
        public int? UpdateBy { get; }
        public DateTime? UpdatedDate { get; }
        public decimal? WageRateOverride { get; }

        public SFContextClass(decimal? april, decimal? august, BudgetVersions budgetVersion, int budgetVersionStaffingID, DataScenario dataScenarioID, ItemTypes dataScenarioTypeID, decimal? december, Departments department, Entities entity, Dimensions dimensionsRowID, decimal? february, Guid? identifier, bool? isActive, bool? isDeleted, decimal? january, JobCodes jobCode, decimal? july, decimal? june, decimal? march, decimal? may, decimal? november, decimal? october, PayTypes payType, decimal? rowTotal, byte[] rowVersion, decimal? september, ItemTypes staffingDataType, TimePeriods timePeriodID, int? updateBy, DateTime? updatedDate, decimal? wageRateOverride, DateTime? creationDate, int? createdBy)
        {
            April = april;
            August = august;
            BudgetVersion = budgetVersion;
            BudgetVersionStaffingID = budgetVersionStaffingID;
            DataScenarioID = dataScenarioID;
            DataScenarioTypeID = dataScenarioTypeID;
            December = december;
            Department = department;
            Entity = entity;
            DimensionsRowID = dimensionsRowID;
            February = february;
            Identifier = identifier;
            IsActive = isActive;
            IsDeleted = isDeleted;
            January = january;
            JobCode = jobCode;
            July = july;
            June = june;
            March = march;
            May = may;
            November = november;
            October = october;
            PayType = payType;
            RowTotal = rowTotal;
            RowVersion = rowVersion;
            September = september;
            StaffingDataType = staffingDataType;
            TimePeriodID = timePeriodID;
            UpdateBy = updateBy;
            UpdatedDate = updatedDate;
            WageRateOverride = wageRateOverride;
        }

        public override bool Equals(object obj)
        {
            return obj is SFContextClass other &&
                   April == other.April &&
                   August == other.August &&
                   EqualityComparer<BudgetVersions>.Default.Equals(BudgetVersion, other.BudgetVersion) &&
                   BudgetVersionStaffingID == other.BudgetVersionStaffingID &&
                   EqualityComparer<DataScenario>.Default.Equals(DataScenarioID, other.DataScenarioID) &&
                   EqualityComparer<ItemTypes>.Default.Equals(DataScenarioTypeID, other.DataScenarioTypeID) &&
                   December == other.December &&
                   EqualityComparer<Departments>.Default.Equals(Department, other.Department) &&
                   EqualityComparer<Entities>.Default.Equals(Entity, other.Entity) &&
                   EqualityComparer<Dimensions>.Default.Equals(DimensionsRowID, other.DimensionsRowID) &&
                   February == other.February &&
                   EqualityComparer<Guid?>.Default.Equals(Identifier, other.Identifier) &&
                   IsActive == other.IsActive &&
                   IsDeleted == other.IsDeleted &&
                   January == other.January &&
                   EqualityComparer<JobCodes>.Default.Equals(JobCode, other.JobCode) &&
                   July == other.July &&
                   June == other.June &&
                   March == other.March &&
                   May == other.May &&
                   November == other.November &&
                   October == other.October &&
                   EqualityComparer<PayTypes>.Default.Equals(PayType, other.PayType) &&
                   RowTotal == other.RowTotal &&
                   EqualityComparer<byte[]>.Default.Equals(RowVersion, other.RowVersion) &&
                   September == other.September &&
                   EqualityComparer<ItemTypes>.Default.Equals(StaffingDataType, other.StaffingDataType) &&
                   EqualityComparer<TimePeriods>.Default.Equals(TimePeriodID, other.TimePeriodID) &&
                   UpdateBy == other.UpdateBy &&
                   UpdatedDate == other.UpdatedDate &&
                   WageRateOverride == other.WageRateOverride;
        }

        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(April);
            hash.Add(August);
            hash.Add(BudgetVersion);
            hash.Add(BudgetVersionStaffingID);
            hash.Add(DataScenarioID);
            hash.Add(DataScenarioTypeID);
            hash.Add(December);
            hash.Add(Department);
            hash.Add(Entity);
            hash.Add(DimensionsRowID);
            hash.Add(February);
            hash.Add(Identifier);
            hash.Add(IsActive);
            hash.Add(IsDeleted);
            hash.Add(January);
            hash.Add(JobCode);
            hash.Add(July);
            hash.Add(June);
            hash.Add(March);
            hash.Add(May);
            hash.Add(November);
            hash.Add(October);
            hash.Add(PayType);
            hash.Add(RowTotal);
            hash.Add(RowVersion);
            hash.Add(September);
            hash.Add(StaffingDataType);
            hash.Add(TimePeriodID);
            hash.Add(UpdateBy);
            hash.Add(UpdatedDate);
            hash.Add(WageRateOverride);
            return hash.ToHashCode();
        }
    }
}
