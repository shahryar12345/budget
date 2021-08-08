using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ABS.DBModels;
using ABSDAL.Context;
using ABSDAL.DataCache;
using ABSDAL.Operations;
using ABSDAL.Repository;

namespace ABSDAL.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelationshipsController : ControllerBase
    {
        private readonly BudgetingContext _context;

        public RelationshipsController(BudgetingContext context)
        {
            _context = context;
        }

        // GET: api/Relationships
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetRelationships()
        {
            var _contxt = opRelationships.getContext(_context);
            var data =  await _contxt.Relationships
                 .Where(f => f.IsActive == true && f.IsDeleted == false 
                 && f.ModelType.ItemTypeCode.ToUpper() != "DEPARTMENT" 
                 && f.ModelType.ItemTypeCode.ToUpper() != "GLACCOUNT"
                 )
                .Select(x => new
                {
                    recordid = x.RelationshipID,
                    model = x.ModelType.ItemTypeCode.ToUpper(),

                    relation = x.RelationshipType.ItemTypeCode.ToUpper(),


                    parentid = x.ParentID,
                    childid = x.ChildID,
                    depth = x.Depth,
                    ordering = x.ordering

                })
                .OrderBy(f => f.model).ThenBy(g => g.relation).ThenBy(h => h.parentid)
                .ToListAsync();

            return data;
        }
        [HttpGet]
        [Route("GETALLENTITYRELATIONS")]
        public async Task<ActionResult<IEnumerable<object>>> GetEntityRelations()
        {
            // var _contxt = opRelationships.getContext(_context);
            var GetData =  await opRelationships.GetDimensionRelationData(_context,   "ENTITY");

            return GetData
                .Select(x => new
                {
                    recordid = x.RelationshipID,
                    model = x.ModelType.ItemTypeCode.ToUpper(),

                    relation = x.RelationshipType.ItemTypeCode.ToUpper(),


                    parentid = x.ParentID,
                    childid = x.ChildID,
                    depth = x.Depth,
                    ordering = x.ordering

                })
                .OrderBy(f => f.relation).ThenBy(h => h.parentid)
                .ToList();
        }

         
 

 


 
        [HttpGet]
        [Route("GETALLDEPARTMENTRELATIONS")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllDepartmentRelations()
        {
           // var _contxt = opRelationships.getContext(_context);
            var GetData = await opRelationships.GetDimensionRelationData(_context,   "DEPARTMENT");

            return GetData
                .Select(x => new
                {
                    recordid = x.RelationshipID,
                    model = x.ModelType.ItemTypeCode.ToUpper(),

                    relation = x.RelationshipType.ItemTypeCode.ToUpper(),


                    parentid = x.ParentID,
                    childid = x.ChildID,
                    depth = x.Depth,
                    ordering = x.ordering

                })
                .OrderBy(f => f.relation).ThenBy(h => h.parentid)
                .ToList();
        }
        [HttpGet]
        [Route("GETALLGLACCOUNTRELATIONS")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllGLACCOUNTRelations()
        {
          //  var _contxt = opRelationships.getContext(_context);
            var GetData = await opRelationships.GetDimensionRelationData(_context,   "GLACCOUNT");

            return GetData
                .Select(x => new
                {
                    recordid = x.RelationshipID,
                    model = x.ModelType.ItemTypeCode.ToUpper(),

                    relation = x.RelationshipType.ItemTypeCode.ToUpper(),


                    parentid = x.ParentID,
                    childid = x.ChildID,
                    depth = x.Depth,
                    ordering = x.ordering

                })
                .OrderBy(f => f.relation).ThenBy(h => h.parentid)
                .ToList();
        }
        
        [HttpGet]
        [Route("GETALLSTATISTICSCODERELATIONS")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllSTATISTICSCODERelations()
        {
          //  var _contxt = opRelationships.getContext(_context);
            var GetData = await opRelationships.GetDimensionRelationData(_context,   "STATISTICSCODE");

            return GetData
                .Select(x => new
                {
                    recordid = x.RelationshipID,
                    model = x.ModelType.ItemTypeCode.ToUpper(),

                    relation = x.RelationshipType.ItemTypeCode.ToUpper(),


                    parentid = x.ParentID,
                    childid = x.ChildID,
                    depth = x.Depth,
                    ordering = x.ordering

                })
                .OrderBy(f => f.relation).ThenBy(h => h.parentid)
                .ToList();
        }
        [HttpGet]
        [Route("GETALLPAYTYPERELATIONS")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllPAYTYPERelations()
        {
          //  var _contxt = opRelationships.getContext(_context);
            var GetData = await opRelationships.GetDimensionRelationData(_context,   "PAYTYPE");

            return GetData
                .Select(x => new
                {
                    recordid = x.RelationshipID,
                    model = x.ModelType.ItemTypeCode.ToUpper(),

                    relation = x.RelationshipType.ItemTypeCode.ToUpper(),


                    parentid = x.ParentID,
                    childid = x.ChildID,
                    depth = x.Depth,
                    ordering = x.ordering

                })
                .OrderBy(f => f.relation).ThenBy(h => h.parentid)
                .ToList();
        }
         [HttpGet]
        [Route("GETALLJOBCODERELATIONS")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllJOBCODERelations()
        {
           // var _contxt = opRelationships.getContext(_context);
            var GetData = await opRelationships.GetDimensionRelationData(_context,   "JOBCODE");

            return GetData
                .Select(x => new
                {
                    recordid = x.RelationshipID,
                    model = x.ModelType.ItemTypeCode.ToUpper(),

                    relation = x.RelationshipType.ItemTypeCode.ToUpper(),


                    parentid = x.ParentID,
                    childid = x.ChildID,
                    depth = x.Depth,
                    ordering = x.ordering

                })
                .OrderBy(f => f.relation).ThenBy(h => h.parentid)
                .ToList();
        }


        [Route("GetAllEntityMasters")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllEntityMasters()
        {
            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "ENTITY", "MASTER");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<Entities>(GetData, _contxt);


                if (finaldata == null)
                {
                    return NotFound();
                }

                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    Entities sc = (Entities)item.parent;
                    item.parent = new { sc.EntityID, sc.EntityCode, sc.EntityName, sc.Description };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        Entities scchild = (Entities)childitem;
                        newvalues.Add(new { scchild.EntityID, scchild.EntityCode, scchild.EntityName, scchild.Description });

                    }
                    item.child = newvalues;

                }


                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }

        [Route("GetAllDepartmentMasters")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllDepartmentMasters()
        {

            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "DEPARTMENT", "MASTER");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<ABS.DBModels.Departments>(GetData, _contxt);

                if (finaldata == null)
                {
                    return NotFound();
                }
                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    ABS.DBModels.Departments sc = (ABS.DBModels.Departments)item.parent;
                    item.parent = new { sc.DepartmentID, sc.DepartmentCode, sc.DepartmentName, sc.Description };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        ABS.DBModels.Departments scchild = (ABS.DBModels.Departments)childitem;
                        newvalues.Add(new { scchild.DepartmentID, scchild.DepartmentCode, scchild.DepartmentName, scchild.Description });

                    }
                    item.child = newvalues;

                }




                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }
        [Route("GetAllStatisticCodesMasters")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllStatisticCodesMasters()
        {
            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "STATISTICSCODE", "MASTER");

                if(GetData.Count < 1)
                {
                     return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<ABS.DBModels.StatisticsCodes>(GetData, _contxt);

                if (finaldata.Count < 1)
                {
                    return NotFound();
                }

                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    ABS.DBModels.StatisticsCodes sc = (ABS.DBModels.StatisticsCodes)item.parent;
                    item.parent = new { sc.StatisticsCodeID, sc.StatisticsCode, sc.StatisticsCodeName, sc.Description };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        ABS.DBModels.StatisticsCodes scchild = (ABS.DBModels.StatisticsCodes)childitem;
                        newvalues.Add(new { scchild.StatisticsCodeID, scchild.StatisticsCode, scchild.StatisticsCodeName, scchild.Description });

                    }
                    item.child = newvalues;

                }



                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }




        [Route("GetAllEntityGroups")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllEntityGroups()
        {
            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "ENTITY", "GROUP");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<Entities>(GetData, _contxt);


                if (finaldata == null)
                {
                    return NotFound();
                }
                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    Entities sc = (Entities)item.parent;
                    item.parent = new { sc.EntityID, sc.EntityCode, sc.EntityName, sc.Description };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        Entities scchild = (Entities)childitem;
                        newvalues.Add(new { scchild.EntityID, scchild.EntityCode, scchild.EntityName, scchild.Description });

                    }
                    item.child = newvalues;

                }



                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }

        [Route("GetAllDepartmentGroups")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllDepartmentGroups()
        {

            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "DEPARTMENT", "GROUP");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<ABS.DBModels.Departments>(GetData, _contxt);

                if (finaldata == null)
                {
                    return NotFound();
                }

                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    ABS.DBModels.Departments sc = (ABS.DBModels.Departments)item.parent;
                    item.parent = new { sc.DepartmentID, sc.DepartmentCode, sc.DepartmentName, sc.Description };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        ABS.DBModels.Departments scchild = (ABS.DBModels.Departments)childitem;
                        newvalues.Add(new { scchild.DepartmentID, scchild.DepartmentCode, scchild.DepartmentName, scchild.Description });

                    }
                    item.child = newvalues;

                }



                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }


        [Route("GetAllStatisticCodesGroups")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllStatisticCodesGroups()
        {
            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "STATISTICSCODE", "GROUP");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<ABS.DBModels.StatisticsCodes>(GetData, _contxt);


                if (finaldata == null)
                {
                    return NotFound();
                }

                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    ABS.DBModels.StatisticsCodes sc = (ABS.DBModels.StatisticsCodes)item.parent;
                    item.parent = new { sc.StatisticsCodeID, sc.StatisticsCode, sc.StatisticsCodeName, sc.Description };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        ABS.DBModels.StatisticsCodes scchild = (ABS.DBModels.StatisticsCodes)childitem;
                        newvalues.Add(new { scchild.StatisticsCodeID, scchild.StatisticsCode, scchild.StatisticsCodeName, scchild.Description });

                    }
                    item.child = newvalues;

                }


                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }

        [Route("GetAllEntityHierarchy")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllEntityHierarchy()
        {
            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "ENTITY", "HIERARCHY");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<Entities>(GetData, _contxt);

                if (finaldata == null)
                {
                    return NotFound();
                }

                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    Entities sc = (Entities)item.parent;
                    item.parent = new { sc.EntityID, sc.EntityCode, sc.EntityName, sc.Description };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        Entities scchild = (Entities)childitem;
                        newvalues.Add(new { scchild.EntityID, scchild.EntityCode, scchild.EntityName, scchild.Description });

                    }
                    item.child = newvalues;

                }



                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }

        [Route("GetAllDepartmentHierarchy")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllDepartmentHierarchy()
        {

            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "DEPARTMENT", "HIERARCHY");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<ABS.DBModels.Departments>(GetData, _contxt);

                if (finaldata == null)
                {
                    return NotFound();
                }
                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    ABS.DBModels.Departments sc = (ABS.DBModels.Departments)item.parent;
                    item.parent = new { sc.DepartmentID, sc.DepartmentCode, sc.DepartmentName, sc.Description };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        ABS.DBModels.Departments scchild = (ABS.DBModels.Departments)childitem;
                        newvalues.Add(new { scchild.DepartmentID, scchild.DepartmentCode, scchild.DepartmentName, scchild.Description });

                    }
                    item.child = newvalues;

                }




                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }


        [Route("GetAllStatisticCodesHierarchy")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllStatisticCodesHierarchy()
        {
            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "STATISTICSCODE", "HIERARCHY");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<StatisticsCodes>(GetData, _contxt);


                if (finaldata == null)
                {
                    return NotFound();
                }

                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    ABS.DBModels.StatisticsCodes sc = (ABS.DBModels.StatisticsCodes)item.parent;
                    item.parent = new { sc.StatisticsCodeID, sc.StatisticsCode, sc.StatisticsCodeName, sc.Description };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        ABS.DBModels.StatisticsCodes scchild = (ABS.DBModels.StatisticsCodes)childitem;
                        newvalues.Add(new { scchild.StatisticsCodeID, scchild.StatisticsCode, scchild.StatisticsCodeName, scchild.Description });

                    }
                    item.child = newvalues;

                }


                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }

        [Route("GetAllPayTypesMaster")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllPayTypesMaster()
        {
            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "PAYTYPE", "MASTER");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<PayTypes>(GetData, _contxt);


                if (finaldata == null)
                {
                    return NotFound();
                }

                //Apply Data formatting
                foreach (var item in finaldata)
                {
                    ABS.DBModels.PayTypes sc = (ABS.DBModels.PayTypes)item.parent;
                    item.parent = new { sc.PayTypeID, PayTypeCode = sc.PayTypeCode ?? "", PayTypeName = sc.PayTypeName ?? "", PayTypeDescription = sc.PayTypeDescription ?? "" };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        ABS.DBModels.PayTypes scchild = (ABS.DBModels.PayTypes)childitem;
                      
                        if (scchild != null)
                        {
  newvalues.Add(new { scchild.PayTypeID, PayTypeCode = scchild.PayTypeCode ?? "", PayTypeName = scchild.PayTypeName ?? "", PayTypeDescription = scchild.PayTypeDescription ?? ""});

                        }
                        else
                        {
                            continue;
                        }
                    }
                    item.child = newvalues;

                }


                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }


        [Route("GetAllPayTypesGroups")]
        [HttpGet]
        [Cached(86400)]

        public async Task<ActionResult<IEnumerable<Object>>> GetAllPayTypesGroups()
        {
            try
            {
                var _contxt = opRelationships.getContext(_context);
                // Get Relation data for model and relationtype
                var GetData = await opRelationships.getRelationData(_contxt, "MODELTYPE", "RELATIONSHIPTYPE", "PAYTYPE", "GROUP");
                if (GetData.Count < 1)
                {
                    return NotFound();
                }

                var finaldata = opRelationships.getRelationGroups<PayTypes>(GetData, _contxt);


                if (finaldata == null)
                {
                    return NotFound();
                }

                //Apply Data formatting

                foreach (var item in finaldata)
                {
                    ABS.DBModels.PayTypes sc = (ABS.DBModels.PayTypes)item.parent;
                    item.parent = new { sc.PayTypeID, PayTypeCode = sc.PayTypeCode ?? "", PayTypeName = sc.PayTypeName ?? "", PayTypeDescription = sc.PayTypeDescription ?? "" };
                    List<object> newvalues = new List<object>();
                    foreach (var childitem in item.child)
                    {
                        ABS.DBModels.PayTypes scchild = (ABS.DBModels.PayTypes)childitem;

                        if (scchild != null)
                        {
                            newvalues.Add(new { scchild.PayTypeID, PayTypeCode = scchild.PayTypeCode ?? "", PayTypeName = scchild.PayTypeName ?? "", PayTypeDescription = scchild.PayTypeDescription ?? "" });

                        }
                        else
                        {
                            continue;
                        }
                    }
                    item.child = newvalues;

                }


                return Ok(finaldata);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return NotFound();
            }
        }




        // GET: api/Relationships/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Relationships>> GetRelationships(int id)
        //{
        //    var relationships = await _context.Relationships.FindAsync(id);

        //    if (relationships == null)
        //    {
        //        return NotFound();
        //    }

        //    return relationships;
        //}

        // PUT: api/Relationships/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutRelationships(int id, Relationships relationships)
        //{
        //    if (id != relationships.RelationshipID)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(relationships).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!RelationshipsExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // POST: api/Relationships
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Relationships>> PostRelationships(Relationships relationships)
        {
            _context.Relationships.Add(relationships);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRelationships", new { id = relationships.RelationshipID }, relationships);
        }

        // DELETE: api/Relationships/5
        //[HttpDelete("{id}")]
        //public async Task<ActionResult<Relationships>> DeleteRelationships(int id)
        //{
        //    var relationships = await _context.Relationships.FindAsync(id);
        //    if (relationships == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Relationships.Remove(relationships);
        //    await _context.SaveChangesAsync();

        //    return relationships;
        //}

        private bool RelationshipsExists(int id)
        {
            return _context.Relationships.Any(e => e.RelationshipID == id);
        }
    }
}
