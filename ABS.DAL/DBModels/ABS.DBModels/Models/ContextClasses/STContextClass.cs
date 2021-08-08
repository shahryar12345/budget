using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABS.DBModels.Models.ContextClasses
{
     

    public class STContextClass
    {
        public decimal? April { get; }
        public decimal? August { get; }
        public BudgetVersions BudgetVersion { get; }
        public int StatisticID { get; }
        public DataScenario DataScenarioDataID { get; }
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
        public StatisticsCodes StatisticsCodes { get; }
        public decimal? July { get; }
        public decimal? June { get; }
        public decimal? March { get; }
        public decimal? May { get; }
        public decimal? November { get; }
        public decimal? October { get; }
        public decimal? RowTotal { get; }
        public byte[] RowVersion { get; }
        public decimal? September { get; }
        public TimePeriods TimePeriodID { get; }
        public int? UpdateBy { get; }
        public DateTime? UpdatedDate { get; }
        public int? CreatedBy { get; }
        public DateTime? CreationDate { get; }

        public STContextClass(decimal? april, decimal? august, BudgetVersions budgetVersion, int statisticID, DataScenario dataScenarioDataID, ItemTypes dataScenarioTypeID, decimal? december, Departments department, Entities entity, Dimensions dimensionsRowID, decimal? february, Guid? identifier, bool? isActive, bool? isDeleted, decimal? january, StatisticsCodes statisticsCodes, decimal? july, decimal? june, decimal? march, decimal? may, decimal? november, decimal? october, decimal? rowTotal, byte[] rowVersion, decimal? september, TimePeriods timePeriodID, int? updateBy, DateTime? updatedDate, int? createdBy, DateTime? creationDate)
        {
            April = april;
            August = august;
            BudgetVersion = budgetVersion;
            StatisticID = statisticID;
            DataScenarioDataID = dataScenarioDataID;
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
            StatisticsCodes = statisticsCodes;
            July = july;
            June = june;
            March = march;
            May = may;
            November = november;
            October = october;
            RowTotal = rowTotal;
            RowVersion = rowVersion;
            September = september;
            TimePeriodID = timePeriodID;
            UpdateBy = updateBy;
            UpdatedDate = updatedDate;
            CreatedBy = createdBy;
            CreationDate = creationDate;
        }

        public override bool Equals(object obj)
        {
            return obj is STContextClass other &&
                   April == other.April &&
                   August == other.August &&
                   EqualityComparer<BudgetVersions>.Default.Equals(BudgetVersion, other.BudgetVersion) &&
                   StatisticID == other.StatisticID &&
                   EqualityComparer<DataScenario>.Default.Equals(DataScenarioDataID, other.DataScenarioDataID) &&
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
                   EqualityComparer<StatisticsCodes>.Default.Equals(StatisticsCodes, other.StatisticsCodes) &&
                   July == other.July &&
                   June == other.June &&
                   March == other.March &&
                   May == other.May &&
                   November == other.November &&
                   October == other.October &&
                   RowTotal == other.RowTotal &&
                   EqualityComparer<byte[]>.Default.Equals(RowVersion, other.RowVersion) &&
                   September == other.September &&
                   EqualityComparer<TimePeriods>.Default.Equals(TimePeriodID, other.TimePeriodID) &&
                   UpdateBy == other.UpdateBy &&
                   UpdatedDate == other.UpdatedDate &&
                   CreatedBy == other.CreatedBy &&
                   CreationDate == other.CreationDate;
        }

        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(April);
            hash.Add(August);
            hash.Add(BudgetVersion);
            hash.Add(StatisticID);
            hash.Add(DataScenarioDataID);
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
            hash.Add(StatisticsCodes);
            hash.Add(July);
            hash.Add(June);
            hash.Add(March);
            hash.Add(May);
            hash.Add(November);
            hash.Add(October);
            hash.Add(RowTotal);
            hash.Add(RowVersion);
            hash.Add(September);
            hash.Add(TimePeriodID);
            hash.Add(UpdateBy);
            hash.Add(UpdatedDate);
            hash.Add(CreatedBy);
            hash.Add(CreationDate);
            return hash.ToHashCode();
        }
    }


}
