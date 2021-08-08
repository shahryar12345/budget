using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABSProcessing.Operations
{
    public class opBudgetVersionStaffing
    {
        public static BudgetingContext getContext(BudgetingContext _context)
        {



            _context.BudgetVersionStaffing.Include(a => a.Entity).ToList();
            _context.BudgetVersionStaffing.Include(a => a.Department).ToList();
            _context.BudgetVersionStaffing.Include(a => a.JobCode).ToList();
            _context.BudgetVersionStaffing.Include(a => a.PayType).ToList();
            _context.BudgetVersionStaffing.Include(a => a.TimePeriodID).ToList();
            _context.BudgetVersionStaffing.Include(a => a.BudgetVersion).ToList();


            _context.BudgetVersionStaffing.Include(a => a.DataScenarioTypeID).ToList();
            _context.BudgetVersionStaffing.Include(a => a.DimensionsRowID).ToList();


            return _context;


        }

        public async Task<List<ABS.DBModels.BudgetVersionStaffing>> getStaffing(int budgetVersionID, string entity, string department, string jobCode, string payType, string forecastType, BudgetingContext context)
        {
            string staffingType = "Dollars";
            if (forecastType.Contains("hours"))
            {
                staffingType = "Hours";
            }
            else if (forecastType.Contains("average_wage"))
            {
                staffingType = "AverageWage";
            }
            else if (forecastType.Contains("pay_type_distribution"))
            {
                staffingType = "PayTypeDistribution";
            }
            var _staffing = await context.BudgetVersionStaffing
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID
                && t.Entity.EntityID == int.Parse(entity)
                && t.Department.DepartmentID == int.Parse(department)
                && t.JobCode.JobCodeID == int.Parse(jobCode)
                && t.PayType.PayTypeID == int.Parse(payType)
                && t.StaffingDataType.ItemTypeValue == staffingType
                && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _staffing;
        }

        public  async  Task<List<ABS.DBModels.BudgetVersionStaffing>> getStaffing(int budgetVersionID, string entity, string department, string jobCode, string payType, string forecastType, List<ABS.DBModels.BudgetVersionStaffing> ExistingRecords)
        {
            await Task.Delay(1);
            string staffingType = "Dollars";
            if (forecastType.Contains("hours"))
            {
                staffingType = "Hours";
            }
            else if (forecastType.Contains("average_wage"))
            {
                staffingType = "AverageWage";
            }
            else if (forecastType.Contains("pay_type_distribution"))
            {
                staffingType = "PayTypeDistribution";
            }
            var _staffing = ExistingRecords.Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID
                && t.Entity.EntityID == int.Parse(entity)
                && t.Department.DepartmentID == int.Parse(department)
                && t.JobCode.JobCodeID == int.Parse(jobCode)
                && t.PayType.PayTypeID == int.Parse(payType)
                && t.StaffingDataType.ItemTypeValue == staffingType
                && t.IsActive == true && t.IsDeleted == false)
                .ToList();
            return _staffing;
        }

        public async Task<List<ABS.DBModels.BudgetVersionStaffing>> getStaffingAllPayTypes(int budgetVersionID, string entity, string department, string jobCode, string forecastType, BudgetingContext context)
        {
            string staffingType = "Dollars";
            if (forecastType.Contains("hours"))
            {
                staffingType = "Hours";
            }
            else if (forecastType.Contains("average_wage"))
            {
                staffingType = "AverageWage";
            }
            else if (forecastType.Contains("pay_type_distribution"))
            {
                staffingType = "PayTypeDistribution";
            }
            var _staffing = await context.BudgetVersionStaffing
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID && t.Entity.EntityID == int.Parse(entity) && t.Department.DepartmentID == int.Parse(department) && t.JobCode.JobCodeID == int.Parse(jobCode) && t.StaffingDataType.ItemTypeValue == staffingType && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _staffing;
        }
        public    List<ABS.DBModels.BudgetVersionStaffing> getStaffingAllPayTypes(int budgetVersionID, string entity, string department, string jobCode, string forecastType, List<ABS.DBModels.BudgetVersionStaffing> ExistingRecords )
        {
            string staffingType = "Dollars";
            if (forecastType.Contains("hours"))
            {
                staffingType = "Hours";
            }
            else if (forecastType.Contains("average_wage"))
            {
                staffingType = "AverageWage";
            }
            else if (forecastType.Contains("pay_type_distribution"))
            {
                staffingType = "PayTypeDistribution";
            }
            var _staffing = ExistingRecords
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID 
                && t.Entity.EntityID == int.Parse(entity) 
                && t.Department.DepartmentID == int.Parse(department) 
                && t.JobCode.JobCodeID == int.Parse(jobCode) 
                && t.StaffingDataType.ItemTypeValue == staffingType 
                && t.IsActive == true && t.IsDeleted == false)
                .ToList();
            return _staffing;
        }

        public async Task<List<ABS.DBModels.BudgetVersionStaffing>> getHoursAndDollarsByBudgetID(int budgetVersionID, BudgetingContext context)
        {
            var _staffing = await context.BudgetVersionStaffing
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID && (t.StaffingDataType.ItemTypeValue == "Hours" || t.StaffingDataType.ItemTypeValue == "Dollars") && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _staffing;
        }

        public List<ABS.DBModels.BudgetVersionStaffing> getHoursAndDollarsByBudgetIDLocal(int budgetVersionID, List<BudgetVersionStaffing> ExistingRecords)
        {
            var _staffing = ExistingRecords
                .Where(t => t.BudgetVersion.BudgetVersionID == budgetVersionID 
                && (t.StaffingDataType.ItemTypeValue == "Hours" || t.StaffingDataType.ItemTypeValue == "Dollars") 
                && t.IsActive == true 
                && t.IsDeleted == false)
                .ToList();
            return _staffing;
        }

        internal async Task<List<ABS.DBModels.BudgetVersionStaffing>> getALlBVSF(List<int> list, BudgetingContext context)
        {
            var _staffing = await context.BudgetVersionStaffing
                .Where(t => list.Contains(t.BudgetVersion.BudgetVersionID )
                
                && t.IsActive == true && t.IsDeleted == false)
                .ToListAsync();
            return _staffing;
        }
    }
}
