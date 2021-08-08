using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using ABS.DBModels.Models;

namespace ABSDAL.Context
{

    public class BudgetingContext : DbContext
    {

        public BudgetingContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<ItemTypes> _ItemTypes { get; set; }
        public DbSet<APIEndpoint> _APIEndpoints { get; set; }

        public DbSet<SystemSettings> _SystemSettings { get; set; }

        public DbSet<ABS.DBModels.Entities> Entities { get; set; }

        public DbSet<ABS.DBModels.Departments> Departments { get; set; }


        public DbSet<ABS.DBModels.UserBackups> UserBackups { get; set; }

        public DbSet<ABS.DBModels.BudgetVersions> _BudgetVersions { get; set; }

        public DbSet<ABS.DBModels.Notification> _Notifications { get; set; }

        public DbSet<ABS.DBModels.NotificationTemplates> _NotificationTemplates { get; set; }

        public DbSet<ABS.DBModels.ApplicationLogging> _applicationLoggings { get; set; }

        public DbSet<ABS.DBModels.TimePeriods> TimePeriods { get; set; }        

        public DbSet<ABS.DBModels.StatisticsCodes> StatisticsCodes { get; set; }

        public DbSet<ABS.DBModels.ChargeCodes> ChargeCodes { get; set; }

        public DbSet<ABS.DBModels.Accounts> Accounts { get; set; }
        public DbSet<ABS.DBModels.Addresses> Addresses { get; set; }

        public DbSet<ABS.DBModels.JobCodes> JobCodes { get; set; }

        public DbSet<ABS.DBModels.PayTypes> PayTypes { get; set; }

        public DbSet<ABS.DBModels.DataScenario> DataScenarios { get; set; }

        public DbSet<ABS.DBModels.StatisticalData> StatisticalData { get; set; }
        public DbSet<ABS.DBModels.ForecastModels> ForecastModels { get; set; }
        public DbSet<ABS.DBModels.ForecastSteps> forecastSteps { get; set; }
        public DbSet<ABS.DBModels.BudgetVersionStatistics> BudgetVersionStatistics { get; set; }
        public DbSet<ABS.DBModels.Dimensions> Dimensions { get; set; }
        public DbSet<ABS.DBModels.Relationships> Relationships { get; set; }
        public DbSet<ABS.DBModels.BudgetVersionGLAccounts> BudgetVersionGLAccounts { get; set; }
        public DbSet<ABS.DBModels.GLAccounts> GLAccounts { get; set; }
        public DbSet<ABS.DBModels.StatisticMappings> StatisticMappings { get; set; }
		public DbSet<ABS.DBModels.Integrationlogs> Integrationlogs { get; set; }
        public DbSet<ABS.DBModels.GLAccountsInflation> GLAccountsInflation { get; set; }
        public DbSet<ABS.DBModels.BudgetVersionStaffing> BudgetVersionStaffing { get; set; }
        public DbSet<ABS.DBModels.StaffingWageAdjustment> StaffingWageAdjustment { get; set; }
        public DbSet<ABS.DBModels.StaffingData> StaffingData { get; set; }
        public DbSet<ABS.DBModels.FullTimeEquivalent> FullTimeEquivalent { get; set; }
        public DbSet<ABS.DBModels.StaffingGLMappings> StaffingGLMappings { get; set; }
        public DbSet<ABS.DBModels.PayTypeDistribution> PayTypeDistribution { get; set; }
        public DbSet<ABS.DBModels.Models.BackgroundJobs> BackgroundJobs { get; set; }
        public DbSet<ABS.DBModels.ForecastHistory> ForecastHistory { get; set; }

        public DbSet<ABS.DBModels.IdentityUserProfile> _IdentityUserProfile { get; set; }
        public DbSet<ABS.DBModels.IdentityGroups> _IdentityGroups { get; set; }
        public DbSet<ABS.DBModels.IdentityAppRoles> _IdentityRoles { get; set; }
        public DbSet<ABS.DBModels.IdentityScreenOperations> _IdentityScreenOperations { get; set; }
        public DbSet<ABS.DBModels.IdentityScreens> _IdentityScreens { get; set; }

       /// <summary>
       /// //
       /// </summary>
        public DbSet<ABS.DBModels.IdentityAppRoleScreenOperations> _IdentityAppRoleScreenOperations { get; set; }
        public DbSet<ABS.DBModels.IdentityAppRoleScreens> _IdentityAppRoleScreens { get; set; }
        public DbSet<ABS.DBModels.IdentityAppRoleUsers> _IdentityAppRoleUsers { get; set; }
        public DbSet<ABS.DBModels.IdentityAppRoleGroup> identityAppRoleGroups { get; set; }
        
        /// <summary>
        /// data
        /// </summary>
        public DbSet<ABS.DBModels.IdentityAppRoleDataEntities> _IdentityAppRoleDataEntities { get; set; }
        public DbSet<ABS.DBModels.IdentityAppRoleDataDepartments> _IdentityAppRoleDataDepartments { get; set; }
        public DbSet<ABS.DBModels.IdentityAppRoleDataGLAccounts> _IdentityAppRoleDataGLAccounts { get; set; }
        public DbSet<ABS.DBModels.IdentityAppRoleDataStatistics> _IdentityAppRoleDataStatistics { get; set; }
        public DbSet<ABS.DBModels.IdentityAppRoleDataJobCodes> _IdentityAppRoleDataJobCodes { get; set; }
        public DbSet<ABS.DBModels.IdentityAppRoleDataPayTypes> _IdentityAppRoleDataPayTypes { get; set; }
        public DbSet<ABS.DBModels.IdentityOperations> _IdentityOperations { get; set; }
        public DbSet<ABS.DBModels.ReportingDimensions> _ReportingDimensions { get; set; }
        public DbSet<ABS.DBModels.SubAccountsDimensions> _SubAccountsDimensions { get; set; }


    }
}