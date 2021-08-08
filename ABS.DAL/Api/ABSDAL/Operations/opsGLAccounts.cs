using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABS.DBModels;
using ABS.DBModels.Models.ADSImport;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ABSDAL.Operations
{
    public class opsGLAccounts
    {
        public static BudgetingContext getContext(BudgetingContext _context)
        {
            _context.GLAccounts.Include(a => a.GLAccountType).ToList();

            return _context;
        }

        public static async Task<ABS.DBModels.APIResponse> GLAcctsBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;
                IEnumerable<NodeGLData> nodeGLDatas = null;
                var existingGLAccounts = await _context.GLAccounts
                    .Where (f=>f.IsActive == true && f.IsDeleted == false)
                    .ToListAsync();
                var itemTypesList = _context._ItemTypes.ToList();

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);
                var importdatamethod = opItemTypes.getImportDataBy(_context);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {
                    Console.WriteLine("%%%%%%%%%%%%%%%%%  Remaining Records: " + ITUpdate.totalCount--);
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());


                    ABS.DBModels.GLAccounts hierarchygroup = null;


                    string masterrecord = HelperFunctions.ParseValue(arrval, "isMaster");

                    bool isMaster = false;
                    bool.TryParse(masterrecord, out isMaster);

                    string objectId = HelperFunctions.ParseValue(arrval, "objectId");

                    bool isGroup = false;

                    try
                    {
                        isGroup = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isGroup").ToString());
                    }
                    catch
                    {
                        isGroup = false;
                    }
                    //isNode
                    string isnoderecord = HelperFunctions.ParseValue(arrval, "isNode");

                    bool isnode = false;
                    bool.TryParse(isnoderecord, out isnode);
                    if (isnode)
                    {
                        nodeGLDatas = JsonConvert.DeserializeObject<IEnumerable<NodeGLData>>(uncompressedData);

                        string parentID = HelperFunctions.ParseValue(arrval, "parentId");
                        if (parentID != "")
                        {
                            var acctcode = nodeGLDatas.Where(f => f.objectId == int.Parse(parentID)).FirstOrDefault();

                            if (acctcode != null)
                            {
                                hierarchygroup = getGLAccountsObjbyCode(acctcode.glAcctCode, _context);
                            }

                            var isgroupaccout = nodeGLDatas.Count(f => f.parentId == int.Parse(objectId));
                            if (isgroupaccout > 0)
                            {
                                isGroup = true;
                            }
                            else
                            {
                                isGroup = false;
                            }
                        }
                        else
                        {
                            var isgroupaccout = nodeGLDatas.Count(f => f.parentId == int.Parse(objectId));
                            if (isgroupaccout > 0)
                            {
                                isGroup = true;
                            }
                            else
                            {
                                isGroup = false;
                            }
                        }


                    }
                    string isHierarchyRecord = HelperFunctions.ParseValue(arrval, "isHierarchy");

                    bool isHierarchy = false;
                    bool.TryParse(isHierarchyRecord, out isHierarchy);

                    string code = HelperFunctions.ParseValue(arrval, "code");
                    string name = HelperFunctions.ParseValue(arrval, "name");
                    string accountMasterCode = HelperFunctions.ParseValue(arrval, "accountMasterCode");
                    string acctMastCode = HelperFunctions.ParseValue(arrval, "acctMastCode");
                    string glAcctCode = HelperFunctions.ParseValue(arrval, "glAcctCode");

                    if (code != "" && isMaster && glAcctCode == "")
                    {
                        glAcctCode = glAcctCode == "" ? code : glAcctCode;
                    }
                    else
                   if (code == "" && isHierarchy && glAcctCode == "" && name != "")
                    {
                        glAcctCode = glAcctCode == "" ? name : glAcctCode;

                    }
                    else
                    if (code == "" && glAcctCode == "" && name == "" && accountMasterCode == "")
                    {
                        errorones++;
                        continue;
                    }



                    // Need to Ask Bruce if we need to add DEPARTMENT in our GL records ??
                    string deptMastCode = HelperFunctions.ParseValue(arrval, "deptMastCode");
                    // var deptID = opDepartments.getDepartmentObjbyCode(deptMastCode, _context);

                    ABS.DBModels.GLAccounts glaccountmasterObj = new ABS.DBModels.GLAccounts();
                    if (acctMastCode != "")
                    {
                        glaccountmasterObj = getGLAccountsObjbyCode(acctMastCode, _context);

                    }
                    else
                    if (accountMasterCode != "" && acctMastCode == "")
                    {
                        glaccountmasterObj = getGLAccountsObjbyCode(accountMasterCode, _context);

                    }

                    if (importdatamethod == "MASTER" && glaccountmasterObj == null && isMaster == false && isGroup == false && isHierarchy == false)
                    {
                        continue;
                    }


                    string accountTypeCodeRecord = HelperFunctions.ParseValue(arrval, "accountTypeCode");
                    var accountTypeCode = itemTypesList.Where(f => f.ItemTypeKeyword == "ACCOUNTTYPE" && f.ItemTypeValue == accountTypeCodeRecord).FirstOrDefault();


                    string hierarchyIdRecord = HelperFunctions.ParseValue(arrval, "hierarchyId");
                    int hierarchyobjid = 0;
                    int.TryParse(hierarchyIdRecord, out hierarchyobjid);
                    var hierarchyId = getGLAccountsObjbyID(hierarchyobjid, _context);
                    if (hierarchyId == null)
                    {
                        // work around to match CODE TO DESCRIPTION from GL HIERARCHY ACCOUNT
                        hierarchyId = getGLAccountsObjbyDescription(hierarchyobjid, _context);
                    }
                    string ParentIDRecord = HelperFunctions.ParseValue(arrval, "parentId");
                    int parentobjid = 0;
                    int.TryParse(ParentIDRecord, out parentobjid);


                    //var parentId = getGLAccountsObjbyID(parentobjid, _context);
                    var parentId = existingGLAccounts.Where(f=>f.Description== parentobjid.ToString() ).FirstOrDefault();

                    string depth = HelperFunctions.ParseValue(arrval, "depth");
                    string ordering = HelperFunctions.ParseValue(arrval, "ordering");
                  

                    var glexists = existingGLAccounts.Where(f => f.GLAccountCode == glAcctCode).FirstOrDefault();

                    string description = objectId;

                    ABS.DBModels.GLAccounts nglAccount = new ABS.DBModels.GLAccounts();

                    nglAccount.CreationDate = DateTime.UtcNow;
                    nglAccount.UpdatedDate = DateTime.UtcNow;
                    nglAccount.IsActive = true;
                    nglAccount.IsDeleted = false;

                    nglAccount.Identifier = Guid.NewGuid();
                    nglAccount.GLAccountCode = glAcctCode;
                    nglAccount.Description = description;
                    if (name != "") { 
                    nglAccount.GLAccountName = name;
                    }
                    nglAccount.IsGroup = isGroup;
                    nglAccount.IsMaster = isMaster;
                    nglAccount.IsHierarchy = isHierarchy;
                    if (parentId != null)
                    {
                        nglAccount.ParentID = parentId.GLAccountID;
                    }
                    nglAccount.Summable = false;
                    nglAccount.ColumnLabel = HelperFunctions.CheckKeyValuePairs(arrval, "columnLabel").ToString();
                    nglAccount.GLAccountType = accountTypeCode;
                    int insertedID = 0;
                    if (glexists == null)
                    {
                        _context.Add(nglAccount);
                        insertedID = await _context.SaveChangesAsync();
                        existingGLAccounts.Add(nglAccount);
                    }
                    else
                    {
                        duplicates++;
                        //var ToDelete =   _context.TimePeriods.Where(x => x.TimePeriodName.ToUpper() == tpname.ToUpper()).FirstOrDefault();
                        //  _context.TimePeriods.Remove(ToDelete);
                        //  continue;

                        _context.Entry(glexists).State = EntityState.Modified;
                        glexists.UpdatedDate = DateTime.UtcNow;
                        if (nglAccount.GLAccountName != null)
                        {
                            glexists.GLAccountName = nglAccount.GLAccountName;
                        }


                        glexists.Description = description;

                        glexists.IsGroup = isGroup;
                        glexists.IsMaster = isMaster;
                        glexists.IsHierarchy = isHierarchy;
                        if (parentId != null)
                        {
                            glexists.ParentID = parentId.GLAccountID;

                        }

                        glexists.Summable = nglAccount.Summable;
                        glexists.ColumnLabel = HelperFunctions.CheckKeyValuePairs(arrval, "columnLabel").ToString();
                        glexists.GLAccountType = accountTypeCode;

                        await _context.SaveChangesAsync();

                        insertedID = glexists.GLAccountID;


                    }
                    if (!isMaster && !isHierarchy && isnode && hierarchyId != null && depth == nodeGLDatas.Min(f => f.depth) && glaccountmasterObj != null && insertedID > 0)
                    {
                         
                            var xr = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "HIERARCHY", hierarchyId.GLAccountID, insertedID, depth, ordering);

                        
                        var y = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "MASTER", glaccountmasterObj.GLAccountID, insertedID, depth, ordering);
                        

                    }
                    else
                    if (!isMaster && !isHierarchy && isnode && hierarchyId != null && hierarchygroup != null && glaccountmasterObj != null && insertedID > 0)
                    {

                        if (depth == nodeGLDatas.Min(f => f.depth))
                        {
                            var xr = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "HIERARCHY", hierarchyId.GLAccountID, insertedID, depth, ordering);
                        }
                        
                        var y = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "MASTER", glaccountmasterObj.GLAccountID, insertedID,depth,ordering);
                        var z = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "GROUP", hierarchygroup.GLAccountID, insertedID,depth,ordering);


                    }
                    else
                    if (!isMaster && isHierarchy && !isnode && insertedID > 0 && glaccountmasterObj != null)
                    {
                        var y = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "MASTER", glaccountmasterObj.GLAccountID, insertedID, depth, ordering);


                    }




                    successones++;


                }
                //  Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods> bulk = new Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods>();
                //await  bulk.BulkInsertAsync();
                ITUpdate.message += "|| Total Inserted: " + successones;
                ITUpdate.message += "|| Duplicate Record(s) : " + duplicates;
                ITUpdate.message += "|| Total Errors found:  " + errorones;




                return ITUpdate;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return null;
            }
        }

        internal async static Task<List<GLAccounts>> getAllGLAccounts(BudgetingContext _context)
        {
            List<GLAccounts> ITUpdate = await _context.GLAccounts
                           .Where(a => 
                             a.IsDeleted == false && a.IsActive == true)
                           .ToListAsync();
            return ITUpdate;
        }

        public static ABS.DBModels.GLAccounts getGLAccountsObjbyID(int glAccountID, BudgetingContext _context)
        {
            ABS.DBModels.GLAccounts ITUpdate = _context.GLAccounts
                            .Where(a => a.GLAccountID == glAccountID
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }
        public static ABS.DBModels.GLAccounts getGLAccountsObjbyCode(string glaccountCOde, BudgetingContext _context)
        {
            ABS.DBModels.GLAccounts ITUpdate = _context.GLAccounts
                            .Where(a => a.GLAccountCode == glaccountCOde
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }

        public static ABS.DBModels.GLAccounts getGLAccountsObjbyDescription(int glAccountID, BudgetingContext _context)
        {
            ABS.DBModels.GLAccounts ITUpdate = _context.GLAccounts
                            .Where(a => a.Description == glAccountID.ToString()

                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();
            return ITUpdate;
        }


        public static async Task<ABS.DBModels.APIResponse> GLAccInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;
                IEnumerable<MasterGLData> MasterGLDatas = null;
                IEnumerable<HierarchyGLData> HierarchyGLDatas = null;
                //IEnumerable<GLAccountGLData> GLAccountGLDatas = null;
                IEnumerable<NodeGLData> nodeGLDatas = null;
                var existingGLAccounts = await _context.GLAccounts.ToListAsync();
                var itemTypesList = _context._ItemTypes.ToList();

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {
                    Console.WriteLine("Remaining Records: " + ITUpdate.totalCount--);
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());

                    string objectId = HelperFunctions.ParseValue(arrval, "objectId");

                    string masterrecord = HelperFunctions.ParseValue(arrval, "isMaster");

                    bool isMaster = false;
                    bool.TryParse(masterrecord, out isMaster);

                    if (isMaster)
                    {
                        MasterGLDatas = JsonConvert.DeserializeObject<IEnumerable<MasterGLData>>(uncompressedData);

                        await ProcessisMasterData(arrval, uncompressedData, MasterGLDatas, _context);
                    }

                    bool isGroup = false;

                    try
                    {

                        isGroup = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isGroup").ToString());
                    }
                    catch
                    {
                        isGroup = false;
                    }
                    //if (isGroup)
                    //{
                    //    MasterGLDatas = JsonConvert.DeserializeObject<IEnumerable<MasterGLData>>(uncompressedData);

                    //    ProcessisGroupData(arrval, uncompressedData, _context);
                    //}




                    string isHierarchyRecord = HelperFunctions.ParseValue(arrval, "isHierarchy");

                    bool isHierarchy = false;
                    bool.TryParse(isHierarchyRecord, out isHierarchy);
                    if (isHierarchy)
                    {
                        HierarchyGLDatas = JsonConvert.DeserializeObject<IEnumerable<HierarchyGLData>>(uncompressedData);

                        await ProcessisHierarchyData(arrval, uncompressedData, HierarchyGLDatas, _context);


                    }


                    ABS.DBModels.GLAccounts hierarchygroup = null;






                    //isNode
                    string isnoderecord = HelperFunctions.ParseValue(arrval, "isNode");

                    bool isnode = false;
                    bool.TryParse(isnoderecord, out isnode);
                    if (isnode)
                    {
                        ProcessNodeDatA(uncompressedData, _context);

                        nodeGLDatas = JsonConvert.DeserializeObject<IEnumerable<NodeGLData>>(uncompressedData);

                        string parentID = HelperFunctions.ParseValue(arrval, "parentId");
                        if (parentID != "")
                        {
                            var acctcode = nodeGLDatas.Where(f => f.objectId == int.Parse(parentID)).FirstOrDefault();

                            if (acctcode != null)
                            {
                                hierarchygroup = getGLAccountsObjbyCode(acctcode.glAcctCode, _context);
                            }

                            var isgroupaccout = nodeGLDatas.Count(f => f.parentId == int.Parse(objectId));
                            if (isgroupaccout > 0)
                            {
                                isGroup = true;
                            }
                            else
                            {
                                isGroup = false;
                            }
                        }
                        else
                        {
                            var isgroupaccout = nodeGLDatas.Count(f => f.parentId == int.Parse(objectId));
                            if (isgroupaccout > 0)
                            {
                                isGroup = true;
                            }
                            else
                            {
                                isGroup = false;
                            }
                        }


                    }


                    string code = HelperFunctions.ParseValue(arrval, "code");
                    string name = HelperFunctions.ParseValue(arrval, "name");
                    string accountMasterCode = HelperFunctions.ParseValue(arrval, "accountMasterCode");
                    string acctMastCode = HelperFunctions.ParseValue(arrval, "acctMastCode");
                    string glAcctCode = HelperFunctions.ParseValue(arrval, "glAcctCode");

                    if (code != "" && isMaster && glAcctCode == "")
                    {
                        glAcctCode = glAcctCode == "" ? code : glAcctCode;
                    }
                    else
                   if (code == "" && isHierarchy && glAcctCode == "" && name != "")
                    {
                        glAcctCode = glAcctCode == "" ? name : glAcctCode;

                    }
                    else
                    if (code == "" && glAcctCode == "" && name == "" && accountMasterCode == "")
                    {
                        errorones++;
                        continue;
                    }



                    // Need to Ask Bruce if we need to add DEPARTMENT in our GL records ??
                    string deptMastCode = HelperFunctions.ParseValue(arrval, "deptMastCode");
                    // var deptID = opDepartments.getDepartmentObjbyCode(deptMastCode, _context);

                    ABS.DBModels.GLAccounts glaccountmasterObj = new ABS.DBModels.GLAccounts();
                    if (acctMastCode != "")
                    {
                        glaccountmasterObj = getGLAccountsObjbyCode(acctMastCode, _context);

                    }
                    else
                    if (accountMasterCode != "" && acctMastCode == "")
                    {
                        glaccountmasterObj = getGLAccountsObjbyCode(accountMasterCode, _context);

                    }
                    string accountTypeCodeRecord = HelperFunctions.ParseValue(arrval, "accountTypeCode");
                    var accountTypeCode = itemTypesList.Where(f => f.ItemTypeKeyword == "ACCOUNTTYPE" && f.ItemTypeValue == accountTypeCodeRecord).FirstOrDefault();


                    string hierarchyIdRecord = HelperFunctions.ParseValue(arrval, "hierarchyId");
                    int hierarchyobjid = 0;
                    int.TryParse(hierarchyIdRecord, out hierarchyobjid);
                    var hierarchyId = getGLAccountsObjbyID(hierarchyobjid, _context);
                    if (hierarchyId == null)
                    {
                        // work around to match CODE TO DESCRIPTION from GL HIERARCHY ACCOUNT
                        hierarchyId = getGLAccountsObjbyDescription(hierarchyobjid, _context);
                    }
                    string ParentIDRecord = HelperFunctions.ParseValue(arrval, "parentId");
                    int parentobjid = 0;
                    int.TryParse(ParentIDRecord, out parentobjid);


                    var parentId = getGLAccountsObjbyID(parentobjid, _context);

                    string depth = HelperFunctions.ParseValue(arrval, "depth");
                    string ordering = HelperFunctions.ParseValue(arrval, "ordering");


                    var glexists = existingGLAccounts.Where(f => f.GLAccountCode == glAcctCode).FirstOrDefault();

                    string description = objectId;

                    ABS.DBModels.GLAccounts nglAccount = new ABS.DBModels.GLAccounts();

                    nglAccount.CreationDate = DateTime.UtcNow;
                    nglAccount.UpdatedDate = DateTime.UtcNow;
                    nglAccount.IsActive = true;
                    nglAccount.IsDeleted = false;

                    nglAccount.Identifier = Guid.NewGuid();
                    nglAccount.GLAccountCode = glAcctCode;
                    nglAccount.Description = description;
                    if (name != "")
                    {
                        nglAccount.GLAccountName = name;
                    }
                    nglAccount.IsGroup = isGroup;
                    //nglAccount.IsMaster = isMaster;
                    //nglAccount.IsHierarchy = isHierarchy;
                    if (parentId != null)
                    {
                        nglAccount.ParentID = parentId.GLAccountID;
                    }
                    nglAccount.Summable = false;
                    nglAccount.ColumnLabel = HelperFunctions.CheckKeyValuePairs(arrval, "columnLabel").ToString();
                    nglAccount.GLAccountType = accountTypeCode;
                    int insertedID = 0;
                    if (glexists == null)
                    {
                        _context.Add(nglAccount);
                        //  insertedID = await _context.SaveChangesAsync();
                        existingGLAccounts.Add(nglAccount);
                    }
                    else
                    {
                        duplicates++;
                        //var ToDelete =   _context.TimePeriods.Where(x => x.TimePeriodName.ToUpper() == tpname.ToUpper()).FirstOrDefault();
                        //  _context.TimePeriods.Remove(ToDelete);
                        //  continue;

                        _context.Entry(glexists).State = EntityState.Modified;
                        glexists.UpdatedDate = DateTime.UtcNow;
                        if (nglAccount.GLAccountName != null)
                        {
                            glexists.GLAccountName = nglAccount.GLAccountName;
                        }


                        glexists.Description = description;

                        glexists.IsGroup = isGroup;
                        glexists.IsMaster = isMaster;
                        glexists.IsHierarchy = isHierarchy;
                        if (parentId != null)
                        {
                            glexists.ParentID = parentId.GLAccountID;

                        }

                        glexists.Summable = nglAccount.Summable;
                        glexists.ColumnLabel = HelperFunctions.CheckKeyValuePairs(arrval, "columnLabel").ToString();
                        glexists.GLAccountType = accountTypeCode;

                        //  await _context.SaveChangesAsync();

                        insertedID = glexists.GLAccountID;


                    }

                    if (isGroup)
                    {

                    }


                    if (!isMaster && !isHierarchy && isnode && hierarchyId != null && hierarchygroup != null && glaccountmasterObj != null && insertedID > 0)
                    {
                        //var xr = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "HIERARCHY", hierarchyId.GLAccountID, insertedID, depth, ordering);
                        //var y = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "MASTER", glaccountmasterObj.GLAccountID, insertedID, depth, ordering);
                        //var z = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "GROUP", hierarchygroup.GLAccountID, insertedID, depth, ordering);


                    }
                    else
                    if (!isMaster && isHierarchy && !isnode && insertedID > 0 && glaccountmasterObj != null)
                    {
                        //var y = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "GLACCOUNT", "MASTER", glaccountmasterObj.GLAccountID, insertedID, depth, ordering);


                    }




                    successones++;


                }
                //  Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods> bulk = new Z.BulkOperations.BulkOperation<ABS.DBModels.TimePeriods>();
                //await  bulk.BulkInsertAsync();
                ITUpdate.message += "|| Total Inserted: " + successones;
                ITUpdate.message += "|| Duplicate Record(s) : " + duplicates;
                ITUpdate.message += "|| Total Errors found:  " + errorones;




                return ITUpdate;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return null;
            }
        }


        private static void ProcessisGroupData(Dictionary<string, object> arrval, string uncompressedData, BudgetingContext context)
        {
            throw new NotImplementedException();
        }

        private async static Task ProcessisMasterData(Dictionary<string, object> arrval, string uncompressedData, IEnumerable<MasterGLData> masterGLDatas, BudgetingContext _context)
        {
            List<GLAccounts> lstglaccNew = new List<GLAccounts>();
            List<GLAccounts> lstglaccUpdates = new List<GLAccounts>();

            foreach (var glrecord in masterGLDatas)
            {
                string code = "";
                if (glrecord.code == "")
                {

                }
                else
                {
                    code = glrecord.code;
                }

                string name = "";
                if (glrecord.name == "")
                {

                }
                else
                {
                    name = glrecord.name;
                }

                string objectId = "";
                if (glrecord.objectId == "")
                {

                }
                else
                {
                    objectId = glrecord.objectId;
                }

                string deptMastCode = "";
                if (glrecord.deptMastCode == "")
                {

                }
                else
                {
                    deptMastCode = glrecord.deptMastCode;

                }

                GLAccounts gLAccounts = new GLAccounts();

                if (name != "" && code != "")
                {
                    gLAccounts.GLAccountName = name;

                    gLAccounts.GLAccountCode = code;
                }
                else
                    if (name == "" && code != "")
                {
                    gLAccounts.GLAccountName = code;

                    gLAccounts.GLAccountCode = code;
                }
                else
                    if (name != "" && code == "")
                {
                    gLAccounts.GLAccountName = name;

                    gLAccounts.GLAccountCode = name;
                }

                gLAccounts.Description = objectId;
                gLAccounts.IsMaster = true;
                gLAccounts.IsGroup = false;
                gLAccounts.IsHierarchy = false;
                gLAccounts.IsActive = true;
                gLAccounts.IsDeleted = false;
                gLAccounts.CreationDate = DateTime.UtcNow;
                gLAccounts.UpdatedDate = DateTime.UtcNow;



                var existingrecord = _context.GLAccounts.Where(f => f.GLAccountCode == gLAccounts.GLAccountCode).FirstOrDefault();


                if (existingrecord == null)
                {
                    lstglaccNew.Add(gLAccounts);
                }
                else
                {
                    existingrecord.GLAccountName = gLAccounts.GLAccountName;
                    existingrecord.GLAccountCode = gLAccounts.GLAccountCode;
                    existingrecord.Description = gLAccounts.Description;
                    existingrecord.IsMaster = gLAccounts.IsMaster;
                    existingrecord.IsHierarchy = gLAccounts.IsHierarchy;
                    existingrecord.IsGroup = gLAccounts.IsGroup;
                    existingrecord.IsActive = true;
                    existingrecord.IsDeleted = false;


                    existingrecord.UpdatedDate = DateTime.UtcNow;


                    lstglaccUpdates.Add(existingrecord);
                }



            }
            if (lstglaccNew.Count > 0)
            {

                await DBOperations.SaveDBObjectUpdates<GLAccounts>(lstglaccNew, false, _context);

            }
            if (lstglaccUpdates.Count > 0)
            {
                await DBOperations.SaveDBObjectUpdates<GLAccounts>(lstglaccUpdates, true, _context);
            }
        }
        private async static Task ProcessisHierarchyData(Dictionary<string, object> arrval, string uncompressedData, IEnumerable<HierarchyGLData> HierarchyGLData, BudgetingContext _context)
        {
            List<GLAccounts> lstglaccNew = new List<GLAccounts>();
            List<GLAccounts> lstglaccUpdates = new List<GLAccounts>();

            foreach (var glrecord in HierarchyGLData)
            {


                string name = "";
                if (glrecord.name == "")
                {

                }
                else
                {
                    name = glrecord.name;
                }

                string objectId = "";
                if (glrecord.objectId == "")
                {

                }
                else
                {
                    objectId = glrecord.objectId;
                }

                string accountMasterCode = "";
                if (glrecord.accountMasterCode == "")
                {

                }
                else
                {
                    accountMasterCode = glrecord.accountMasterCode;

                }

                GLAccounts gLAccounts = new GLAccounts();

                if (name != "")
                {
                    gLAccounts.GLAccountName = name;

                    gLAccounts.GLAccountCode = name;
                }
                else

                {
                    gLAccounts.GLAccountName = objectId;

                    gLAccounts.GLAccountCode = objectId;
                }


                gLAccounts.Description = objectId;
                gLAccounts.IsMaster = false;
                gLAccounts.IsGroup = false;
                gLAccounts.IsHierarchy = true;
                gLAccounts.IsActive = true;
                gLAccounts.IsDeleted = false;
                gLAccounts.CreationDate = DateTime.UtcNow;
                gLAccounts.UpdatedDate = DateTime.UtcNow;



                var existingrecord = _context.GLAccounts.Where(f => f.GLAccountCode == gLAccounts.GLAccountCode).FirstOrDefault();


                if (existingrecord == null)
                {
                    lstglaccNew.Add(gLAccounts);
                }
                else
                {
                    existingrecord.GLAccountName = gLAccounts.GLAccountName;
                    existingrecord.GLAccountCode = gLAccounts.GLAccountCode;
                    existingrecord.Description = gLAccounts.Description;
                    existingrecord.IsMaster = gLAccounts.IsMaster;
                    existingrecord.IsHierarchy = gLAccounts.IsHierarchy;
                    existingrecord.IsGroup = gLAccounts.IsGroup;
                    existingrecord.IsActive = true;
                    existingrecord.IsDeleted = false;


                    existingrecord.UpdatedDate = DateTime.UtcNow;


                    lstglaccUpdates.Add(existingrecord);
                }



            }
            if (lstglaccNew.Count > 0)
            {

                await DBOperations.SaveDBObjectUpdates<GLAccounts>(lstglaccNew, false, _context);

            }
            if (lstglaccUpdates.Count > 0)
            {
                await DBOperations.SaveDBObjectUpdates<GLAccounts>(lstglaccUpdates, true, _context);
            }
        }

        private static void ProcessNodeDatA(string uncompressedData, BudgetingContext context)
        {
            throw new NotImplementedException();
        }


    }

}
