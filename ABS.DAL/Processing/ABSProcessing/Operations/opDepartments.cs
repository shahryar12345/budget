using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opDepartments
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {



            _context.Departments.Include(a => a.GroupPolicy).
            Include(a => a.DepartmentTypeID).ToList();

            //_context.Departments.Include(a => a.GroupPolicy).ToList();
            //_context.Departments.Include(a => a.DepartmentTypeID).ToList();




            return _context;






        }

        public async Task<List<ABS.DBModels.Departments>> getGroupList(string childID, BudgetingContext context)
        {
            List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList(); ;
            var _departments = await context.Departments
                .Where(e => groupMemberIdsList.Contains(e.DepartmentID) && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _departments;
        }

        public List<ABS.DBModels.Departments> getGroupList(string childID, List<Departments> AllDepartmentList)
        {
            List<Departments> deptdata = new List<Departments>();
            if (childID != "")
            {
                List<int> groupMemberIdsList = childID.Split(',').Select(int.Parse).ToList();
                deptdata = AllDepartmentList
                    .Where(e => groupMemberIdsList.Contains(e.DepartmentID) && e.IsActive == true && e.IsDeleted == false)
                    .ToList();
            }
            return deptdata;

        }

        public async Task<List<ABS.DBModels.Departments>> GetAllNonGroupDepartments(BudgetingContext context)
        {
            var _departments = await context.Departments
                .Where(e => e.IsGroup == false && e.IsMaster == false && e.IsActive == true && e.IsDeleted == false)
                .ToListAsync();
            return _departments;
        }

        public async static Task<List<Departments>> GetAllDepartments(BudgetingContext context)
        {
            var cntxt = getContext(context);
            var _departments = await cntxt.Departments
               .Where(e => e.IsActive == true && e.IsDeleted == false)
               .ToListAsync();
            return _departments;
        }
    }
}
