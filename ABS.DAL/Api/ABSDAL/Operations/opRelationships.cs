using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ABS.DBModels;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;

namespace ABSDAL.Operations
{
    public class opRelationships
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {



            _context.Relationships.Include(a => a.ModelType).ToList();
            _context.Relationships.Include(a => a.RelationshipType).ToList();



            return _context;






        }


        public async static Task<List<ABS.DBModels.Relationships>> getRelationData(Context.BudgetingContext _contxt, string _ModelType, string _RelationType, string _model, string _relation)

        {

            try
            {
                List<ABS.DBModels.Relationships> GetDataFormats = await _contxt.Relationships
                       .Where(x =>
                       x.RelationshipType.ItemTypeKeyword.ToUpper() == _RelationType.ToUpper()

                       && x.RelationshipType.ItemTypeCode.ToUpper() == _relation.ToUpper()

                       && x.ModelType.ItemTypeKeyword.ToUpper() == _ModelType.ToUpper()
                       && x.ModelType.ItemTypeCode.ToUpper() == _model.ToUpper()
                       && x.IsActive == true && x.IsDeleted == false)
                       .ToListAsync();




                return GetDataFormats;
            }
            catch (Exception ex)

            {
                Logger.LogError(ex, _contxt);
                return null;

            }

        }
        public async static Task<List<ABS.DBModels.Relationships>> GetDimensionRelationData(Context.BudgetingContext _contxt, string _model)

        {

            try
            {


                List<ABS.DBModels.Relationships> GetDataFormats = await _contxt.Relationships
                    .Include(f => f.RelationshipType)
                    .Include(f => f.ModelType).AsNoTracking()
                        .Where(x =>
                        x.ModelType.ItemTypeCode.ToUpper() == _model.ToUpper()
                        && x.IsActive == true && x.IsDeleted == false)
                        .ToListAsync();





                //_contxt.Entry(GetDataFormats).References.Collection ("RelationshipType").Load(); //  


                return GetDataFormats;
            }
            catch (Exception ex)

            {
                Logger.LogError(ex, _contxt);
                return null;

            }

        }

        public static List<relationsFormat> getRelationGroups<T>(List<ABS.DBModels.Relationships> list, BudgetingContext _contxt) where T : class

        {

            try
            {
                var gnstats = new Repository.GenericRepository<T>(_contxt);


                var groupedData = list
                    .GroupBy(g => g.ParentID,
                    (key, i) => new relationsFormat
                    {
                        parent = key,
                        child = (i.Select(e => e.ChildID.ToString()).ToList<object>())
                    }
                    );



                var finalData = groupedData.Select(p =>
              new relationsFormat
              {
                  parent = gnstats.Get((int.Parse(p.parent.ToString())))
              ,
                  child = getlistdata(p.child, gnstats)
              }


                );



                return finalData.ToList();

            }
            catch (Exception ex)

            {
                Logger.LogError(ex);
                return null;

            }

        }

        public static List<object> getlistdata(List<object> x, dynamic gnstats)
        {
            List<object> getData = new List<object>();


            foreach (var item in x)
            {
                getData.Add(gnstats.Get(int.Parse(item.ToString())));
            }


            return getData;
        }

        internal async static Task<List<int>> getParentStructure(int RecordID, List<int> AllRecords, string ModelType, BudgetingContext _context, List<Relationships> AllExistingRelations = null)
        {
            await Task.Delay(1);

            if (AllExistingRelations == null)
            {

                AllExistingRelations = await GetDimensionRelationData(_context, ModelType);

            }

            List<int> AllParentRecords = new List<int>();
            var getParent = FindAllParents(AllExistingRelations, RecordID, AllParentRecords).Distinct().ToList();

            //(f => f.ParentID.GetValueOrDefault() > 0 && f.ChildID == RecordID).Select(f => f.ParentID.GetValueOrDefault()).ToList();

            AllRecords.AddRange(getParent);


            return AllRecords;


        }
        public static IEnumerable<int> FindAllParents(List<Relationships> all_data, int child, List<int> allChilds, List<int> alreadychecked = null)
        {

             var parent = all_data.Where(x => x.ParentID.GetValueOrDefault() > 0 && x.ChildID == child).ToList();

            if (alreadychecked == null) { alreadychecked = new List<int>(); }
            if (parent == null)
            {

            }
            else

            {
                allChilds.AddRange(parent.Select(f => f.ParentID.GetValueOrDefault()).ToList());
               // allChilds = allChilds.Distinct().ToList();

                foreach (var item in parent)
                {
                    Console.WriteLine("ParentID : " + item.ParentID);
                    if (item.ParentID == item.ChildID) 
                    { //break;
                    }
                    if (alreadychecked.Contains(item.ParentID.GetValueOrDefault()))
                    { }
                    else
                    {
                        alreadychecked.Add(item.ParentID.GetValueOrDefault());

                        var allp = FindAllParents(all_data, item.ParentID.GetValueOrDefault(), allChilds,alreadychecked);
                        //allChilds.AddRange(allp);
                    }
                }

            }
            return allChilds.Distinct().ToList();
        }

        public async static Task<ABS.DBModels.Relationships> InsertRelationData(Context.BudgetingContext _contxt, string _ModelType, string _RelationType, string _model, string _relation, int _parentID, int _childid, string depth = "", string ordering = "")

        {

            try
            {


                List<ABS.DBModels.Relationships> getExisting = await getRelationData(_contxt, _ModelType, _RelationType, _model, _relation);


                if (getExisting.Where(a => a.ParentID == _parentID && a.ChildID == _childid).Count() > 0)
                {
                    return getExisting.FirstOrDefault();
                }

                ABS.DBModels.Relationships newRelation = new ABS.DBModels.Relationships();

                newRelation.ParentID = _parentID;
                newRelation.ChildID = _childid;
                newRelation.ModelType = opItemTypes.getItemTypeObjbyKeywordCode(_ModelType, _model, _contxt);
                newRelation.RelationshipType = opItemTypes.getItemTypeObjbyKeywordCode(_RelationType, _relation, _contxt);

                newRelation.Depth = depth;

                newRelation.ordering = ordering;
                newRelation.CreationDate = DateTime.UtcNow;
                newRelation.IsActive = true;
                newRelation.IsDeleted = false;
                newRelation.UpdatedDate = DateTime.UtcNow;


                _contxt.Relationships.Add(newRelation);
                var res = await _contxt.SaveChangesAsync();




                if (res < 1)
                {
                    return null;
                }

                return newRelation;

            }
            catch (Exception ex)

            {
                Logger.LogError(ex, _contxt);
                return null;

            }

        }

        public async static Task<ABS.DBModels.Relationships> InsertRelationDataOld(Context.BudgetingContext _contxt, string _ModelType, string _RelationType, string _model, string _relation, int _parentID, int _childid)

        {

            try
            {


                List<ABS.DBModels.Relationships> getExisting = await getRelationData(_contxt, _ModelType, _RelationType, _model, _relation);
                var getExistingITemTypes = await opItemTypes.getAllItemTypes(_contxt);


                if (getExisting.Where(a => a.ParentID == _parentID && a.ChildID == _childid).Count() > 0)
                {
                    return getExisting.FirstOrDefault();
                }

                ABS.DBModels.Relationships newRelation = new ABS.DBModels.Relationships();

                newRelation.ParentID = _parentID;
                newRelation.ChildID = _childid;
                newRelation.ModelType = getExistingITemTypes.Where(t => t.ItemTypeKeyword.ToUpper() == _ModelType.ToUpper()
              && t.ItemTypeCode.ToUpper() == _model.ToUpper()).FirstOrDefault();

                newRelation.RelationshipType = getExistingITemTypes.Where(t => t.ItemTypeKeyword.ToUpper() == _RelationType.ToUpper()
              && t.ItemTypeCode.ToUpper() == _model.ToUpper()).FirstOrDefault();
                newRelation.CreationDate = DateTime.UtcNow;
                newRelation.IsActive = true;
                newRelation.IsDeleted = false;
                newRelation.UpdatedDate = DateTime.UtcNow;


                _contxt.Relationships.Add(newRelation);
                var res = await _contxt.SaveChangesAsync();




                if (res < 1)
                {
                    return null;
                }

                return newRelation;

            }
            catch (Exception ex)

            {
                Logger.LogError(ex, _contxt);
                return null;

            }

        }

    }
}
