using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;

namespace ABSProcessing.Context
{

    public class BudgetingContext : DbContext
    {

        public BudgetingContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<ItemTypes> _ItemTypes { get; set; }

        public DbSet<Entities> Entities { get; set; }

        public DbSet<Departments> Departments { get; set; }

        public DbSet<IdentityUserProfile> _IdentityUserProfile { get; set; }

        public DbSet<BudgetVersions> _BudgetVersions { get; set; }

        public DbSet<ApplicationLogging> _applicationLoggings { get; set; }

        public DbSet<TimePeriods> TimePeriods { get; set; }  
        public DbSet<Statistics> Statistics { get; set; }
        public DbSet<StatisticsCodes> StatisticsCodes { get; set; }
        public DbSet<StatisticalData> StatisticalData { get; set; }
        public DbSet<ForecastModels> ForecastModels { get; set; }
        public DbSet<ForecastSteps> forecastSteps { get; set; } 

        public DbSet<ChargeCodes> ChargeCodes { get; set; }

        public DbSet<Accounts> Accounts { get; set; }
        public DbSet<Addresses> Addresses { get; set; }

        public DbSet<JobCodes> JobCodes { get; set; }

        public DbSet<PayTypes> PayTypes { get; set; }

        public DbSet<BudgetVersionStatistics> BudgetVersionStatistics { get; set; }
        public DbSet<Dimensions> Dimensions { get; set; }
        public DbSet<BudgetVersionGLAccounts> BudgetVersionGLAccounts { get; set; }
        public DbSet<GLAccounts> GLAccounts { get; set; }
        public DbSet<ABS.DBModels.BudgetVersionStaffing> BudgetVersionStaffing { get; set; }
        public DbSet<ABS.DBModels.Relationships> Relationships { get; set; }
        public DbSet<StatisticMappings> StatisticMappings { get; set; }
        public DbSet<DataScenario> _DataScenario { get; set; }
        public DbSet<StaffingGLMappings> StaffingGLMappings { get; set; }
        public DbSet<ABS.DBModels.Models.BackgroundJobs> BackgroundJobs { get; set; }

        public DbSet<ABS.DBModels.ReportingDimensions> _ReportingDimensions { get; set; }

    }
}