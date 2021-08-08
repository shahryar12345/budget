using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ABSDAL.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class

    {

        private ABSDAL.Context.BudgetingContext _context = null;
        // private DbSet<T> model = null;
        public GenericRepository(ABSDAL.Context.BudgetingContext _contxt)
        {
            this._context = _contxt;
            //  model = _context.Set<T>();
        }
        public T Add(T t)
        {
            throw new NotImplementedException();
        }

        public Task<T> AddAsyn(T t)
        {
            throw new NotImplementedException();
        }

        public int Count()
        {
            throw new NotImplementedException();
        }

        public Task<int> CountAsync()
        {
            throw new NotImplementedException();
        }

        public void Delete(T entity)
        {
            throw new NotImplementedException();
        }

        public Task<int> DeleteAsyn(T entity)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public T Find(Expression<Func<T, bool>> match)
        {
            throw new NotImplementedException();
        }

        public ICollection<T> FindAll(Expression<Func<T, bool>> match)
        {
            throw new NotImplementedException();
        }

        public Task<ICollection<T>> FindAllAsync(Expression<Func<T, bool>> match)
        {
            throw new NotImplementedException();
        }

        public Task<T> FindAsync(Expression<Func<T, bool>> match)
        {
            throw new NotImplementedException();
        }

        public IQueryable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<ICollection<T>> FindByAsyn(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public T Get(int id)
        {
            return _context.Set<T>().Find(id);
        }

        public IQueryable<T> GetAll()
        {
            throw new NotImplementedException();
        }

        public async Task<ICollection<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public IQueryable<T> GetAllIncluding(params Expression<Func<T, object>>[] includeProperties)
        {
            throw new NotImplementedException();
        }

        public async Task<T> GetAsync(int id)
        {

            return await _context.Set<T>().FindAsync(id);


        }

        public void Save()
        {
            throw new NotImplementedException();
        }

        public Task<int> SaveAsync()
        {
            throw new NotImplementedException();
        }

        public T Update(T t, object key)
        {
            throw new NotImplementedException();
        }

        public Task<T> UpdateAsyn(T t, object key)
        {
            throw new NotImplementedException();
        }

        public T Cast<T>(object obj, T type)
        {
            return (T)obj;
        }

        public async Task<List<T>> getRelationData(string _ModelType, string _RelationType, string _model, string _relation)

        {


            List<ABS.DBModels.Relationships> GetDateFormats = await _context.Relationships
                    .Where(x =>
                    x.RelationshipType.ItemTypeKeyword.ToUpper() == _RelationType.ToUpper()

                    && x.RelationshipType.ItemTypeCode.ToUpper() == _relation.ToUpper()

                    && x.ModelType.ItemTypeKeyword.ToUpper() == _ModelType.ToUpper()
                    && x.ModelType.ItemTypeCode.ToUpper() == _model.ToUpper()
                    && x.IsActive == true && x.IsDeleted == false)
                    .ToListAsync();




            var groupedData = GetDateFormats
                .GroupBy(g => g.ParentID,
                (key, i) => new { MasterStatistics = key, MemberStatistics = i.ToList() })



              .ToList();

            List<T> masterlist = new List<T>();

            foreach (var item in groupedData)
            {
                masterlist.Add(await GetAsync(item.MasterStatistics.GetValueOrDefault()));


            }

            List<T> memberlist = new List<T>();

            foreach (var item in groupedData)
            {

                foreach (var mem in item.MemberStatistics)
                {
                    memberlist.Add(await GetAsync(mem.ChildID.GetValueOrDefault()));

                }


            }


            // var finalData = groupedData.Select(p =>
            //new
            //{
            //    Master = GetAsync( p.MasterStatistics)
            //,
            //    MemberData = p.MemberStatistics.Select(a => GetAsync(a.ChildID))

            //}


            // );

            return masterlist;
        }


    }
}
