using ABS.DBModels;
using ABSDAL.Context;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ABSDAL.Operations
{
    public class opIdentityScreens
    {
        public async static Task<string> InsertRecords(IdentityScreens identityScreens, BudgetingContext _context)
        {
            _context._IdentityScreens.Add(identityScreens);
            await _context.SaveChangesAsync();

            return ("Record(s) saved successfully");

        }

        internal async static Task<IdentityScreens> GetScreenbyName(IdentityScreens Screenname, bool createNew ,BudgetingContext _context)
        {
            var AllScreens = await _context._IdentityScreens
                .Where(f =>
                //f.Name.ToUpper() == Screenname.Name.ToUpper()
                //&&
                f.IsActive == true && f.IsDeleted == false
                )
                .ToListAsync();

            IdentityScreens screenobj = new IdentityScreens();
            if (Screenname != null && Screenname.Code != null)
            {
                  screenobj = AllScreens.Where(f =>
                f.Name.ToUpper() == Screenname.Name.ToUpper()
                && f.Code.ToUpper() == Screenname.Code.ToUpper()
                ).FirstOrDefault();
            }
            else
                if (Screenname != null && Screenname.Code == null)
            {
                  screenobj = AllScreens.Where(f =>
                f.Name.ToUpper() == Screenname.Name.ToUpper()
                //&& f.Code.ToUpper() == Screenname.Code.ToUpper()
                ).FirstOrDefault();
            }

            IdentityScreens parentScreenID = null;
            if (Screenname.Code != "" && Screenname.Code != null)
            {
                parentScreenID = AllScreens.Where(f => f.Code.ToUpper() == Screenname.Code.ToUpper()).FirstOrDefault();

                if (parentScreenID == null)
                { } else
                {  
                    if (parentScreenID.ParentID != null && parentScreenID.IdentityScreenID > 0 )
                    { }
                    else
                    if (parentScreenID.ParentID != null && Screenname.ParentID != null )
                    {
                        parentScreenID = AllScreens.Where(f => f.IdentityScreenID == Screenname.ParentID).FirstOrDefault();
                    }
                }
            }

             if (screenobj == null && createNew)
            {
                

                var screenrecord = new IdentityScreens();
                screenrecord.Name = Screenname.Name;
                screenrecord.Code = Screenname.Name;
                screenrecord.Description = Screenname.Name;
                screenrecord.Value = Screenname.Value;
                screenrecord.CreationDate = DateTime.UtcNow;
                screenrecord.UpdatedDate = DateTime.UtcNow;
                screenrecord.IsActive = Screenname.IsActive ?? true;
                screenrecord.IsDeleted = Screenname.IsDeleted ?? false;
                if (parentScreenID != null)
                {
                    screenrecord.ParentID = parentScreenID.IdentityScreenID;
                }
                _context._IdentityScreens.Add(screenrecord);
                await _context.SaveChangesAsync();

                return screenrecord;
            }
            else
            {
                return screenobj;
            }
        }

       
    }
}