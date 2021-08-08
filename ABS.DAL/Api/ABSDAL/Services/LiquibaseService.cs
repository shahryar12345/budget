using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
 

namespace ABSDAL.Services
{
    public class LiquibaseService
    {
        public LiquibaseService()
        {
             
        }

        //public static List<string> generateschema (Context.BudgetingContext _context)
        //{

        //    var lst = _context.Model.GetEntityTypes().ToList();
        //    return lst.Select(x=> x.GetSchema)
        //        .ToList();
        //}


        

        //public static string GetSchema(EntityEntry entry, Context.BudgetingContext _context)
        //{
        //    var entity = entry.Entity;
        //    var schemaAnnotation = _context.Model.FindEntityType(entity.GetType()).GetAnnotations()
        //    .FirstOrDefault(a => a.Name == "Relational:Schema");
        //    return schemaAnnotation == null ? "dbo" : schemaAnnotation.Value.ToString();
        //}
    }
}
