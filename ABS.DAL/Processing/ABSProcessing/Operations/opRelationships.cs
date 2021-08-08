
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSProcessing.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSProcessing.Operations
{
    public class opRelationships
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {
            _context.Relationships.Include(a => a.ModelType)
            .Include(a => a.RelationshipType).ToList();
            //_context.Relationships.Include(a => a.ModelType).ToList();
            //_context.Relationships.Include(a => a.RelationshipType).ToList();
            return _context;
        }

        public async static Task<List<ABS.DBModels.Relationships>> getGroupChildData(int parentID, string modelType, Context.BudgetingContext context)
        {
            try
            {
                List<ABS.DBModels.Relationships> relationships = await context.Relationships
                       .Where(x =>
                       x.ParentID == parentID &&
                       x.ModelType.ItemTypeCode.ToUpper() == modelType.ToUpper() &&
                       x.RelationshipType.ItemTypeCode.ToUpper() == "GROUP" &&
                       x.IsActive == true && x.IsDeleted == false)
                       .ToListAsync();

                return relationships;
            }
            catch ( Exception ex )
            {
                Logger.LogError(ex);
                return null;
            }
        }
         public  static List<ABS.DBModels.Relationships> getGroupChildData(int parentID, string modelType, List<Relationships> AllRelationships)
        {
            try
            {
                List<ABS.DBModels.Relationships> relationships = AllRelationships
                       .Where(x =>
                       x.ParentID == parentID &&
                       x.ModelType.ItemTypeCode.ToUpper() == modelType.ToUpper() &&
                       x.RelationshipType.ItemTypeCode.ToUpper() == "GROUP" &&
                       x.IsActive == true && x.IsDeleted == false)
                       .ToList();

                return relationships;
            }
            catch ( Exception ex )
            {
                Logger.LogError(ex);
                return null;
            }
        }

        public static List<ABS.DBModels.Relationships> getHierarchyChildData(int parentID, string modelType, List<Relationships> AllRelationships)
        {
            try
            {
                List<ABS.DBModels.Relationships> relationships = AllRelationships
                       .Where(x =>
                       x.ParentID == parentID &&
                       x.ModelType.ItemTypeCode.ToUpper() == modelType.ToUpper() &&
                       x.RelationshipType.ItemTypeCode.ToUpper() == "HIERARCHY" &&
                       x.IsActive == true && x.IsDeleted == false)
                       .ToList();

                return relationships;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex);
                return null;
            }
        }

        public async static Task<List<Relationships>> GetAllRelationships(BudgetingContext context)
        {
            var cntxt = getContext(context);
            List<ABS.DBModels.Relationships> relationships = await cntxt.Relationships
                       .Where(x => x.IsActive == true && x.IsDeleted == false)
                       .ToListAsync();

            return relationships;
        }
    }
}

