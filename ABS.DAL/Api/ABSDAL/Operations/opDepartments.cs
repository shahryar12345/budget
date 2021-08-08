using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ABSDAL.Context;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ABS.DBModels;
using ABS.DBModels.Models.ADSImport;

namespace ABSDAL.Operations
{
    public class opDepartments
    {

        public static BudgetingContext getContext(BudgetingContext _context)
        {

            _context.Departments.Include(a => a.GroupPolicy).ToList();
            _context.Departments.Include(a => a.DepartmentTypeID).ToList();
            _context.Departments.Include(a => a.DepartmentMasterID).ToList();

            return _context;
        }


        public static ABS.DBModels.Departments getDepartmentObjbyID(int departmentID, BudgetingContext _context)
        {

            ABS.DBModels.Departments ITUpdate = _context.Departments
                            .Where(a => a.DepartmentID == departmentID
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();

            return ITUpdate;
        }

        internal async static Task<List<Departments>> getAllDepartments(BudgetingContext _context)
        {
            List<ABS.DBModels.Departments> ITUpdate =await  _context.Departments
                           .Where(a =>   a.IsDeleted == false && a.IsActive == true)
                           .ToListAsync();

            return ITUpdate;
        }

        public static ABS.DBModels.Departments getDepartmentObjbyCode(string departmentCode, BudgetingContext _context)
        {

            ABS.DBModels.Departments ITUpdate = _context.Departments
                            .Where(a => a.DepartmentCode.ToUpper() == departmentCode.ToUpper()
                            && a.IsDeleted == false && a.IsActive == true)
                            .FirstOrDefault();

            return ITUpdate;
        }

        public static async Task<ABS.DBModels.APIResponse> DeptsBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;
                int duplicates = 0;

                List<Departments> GetAllexistingDepts = await _context.Departments.Where(f=>f.IsActive==true && f.IsDeleted ==false).ToListAsync();
                List<Departments> existingDepts = null;
                var itemTypesList = _context._ItemTypes.ToList();

                var importdatamethod = opItemTypes.getImportDataBy(_context);

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);

                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {
                    Console.WriteLine("||||||||||||||||||||||||Remaining Records: " + ITUpdate.totalCount--);
                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());

                    bool isMaster = false;
                    bool isHierarchy = false;
                    bool isCodeGroup = false;
                    bool isGroup = false;
                    bool addMasterRelationship = false;
                    string deptCode = "";
                    string deptMastCode = "";
                    string deptDescription = "";
                    string deptName = "";
                    Departments existingDept = null;
                    ItemTypes GroupPolicy = null;
                    ItemTypes DepartmentType = null;
                    Departments DeptMaster = null;
                    Departments deptGroup = null;
                    Departments deptHierarchy = null;

                    //check for department record type
                    try
                    {
                        isMaster = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isMaster").ToString());
                    }
                    catch
                    {
                        isMaster = false;
                    }

                    try
                    {
                        isHierarchy = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isHierarchy").ToString());
                    }
                    catch
                    {
                        isHierarchy = false;
                    }

                    try
                    {
                        isCodeGroup = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isCodeGroup").ToString());
                    }
                    catch
                    {
                        isCodeGroup = false;
                    }


                    //determine what department records to pull based on record type
                    if (isMaster)
                    {
                        existingDepts = GetAllexistingDepts.Where(dm => dm.IsMaster == true).ToList();

                        if (HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString() == "")
                        {
                            errorones++;
                            continue;
                        }
                        else
                        {
                            deptCode = arrval["code"].ToString();
                        }

                        foreach (var DeptMasterRecord in existingDepts)
                        {

                            if ((DeptMasterRecord.DepartmentCode == deptCode))
                            {
                                duplicates++;
                                //existingDept = DeptMasterRecord;
                                break;
                            }
                        }

                        deptName = HelperFunctions.ParseValue(arrval, "name").ToString();
                        deptDescription = HelperFunctions.ParseValue(arrval, "objectId").ToString();
                        isMaster = true;
                        isGroup = false;
                        isHierarchy = false;
                        isCodeGroup = false;

                    }
                    else if (isHierarchy)
                    {
                        existingDepts = GetAllexistingDepts.Where(dh => dh.IsHierarchy == true && dh.IsGroup == false).ToList();


                        deptCode = HelperFunctions.ParseValue(arrval, "name");

                        existingDept = existingDepts.Where(f => f.DepartmentCode == deptCode).FirstOrDefault();


                        deptName = HelperFunctions.ParseValue(arrval, "name");
                        deptDescription = HelperFunctions.ParseValue(arrval, "objectId");

                        isGroup = false;
                        isMaster = false;
                        isHierarchy = true;
                        isCodeGroup = false;
                        var deptmastcoderecord = HelperFunctions.ParseValue(arrval, deptMastCode);
                        DeptMaster = GetAllexistingDepts.Where(d => d.DepartmentCode == deptmastcoderecord).FirstOrDefault();

                    }

                    else if (isCodeGroup)

                    {
                        existingDepts = GetAllexistingDepts.Where(dcg => dcg.IsMaster == false && dcg.IsHierarchy == false && dcg.IsGroup == true).ToList();

                        if (HelperFunctions.CheckKeyValuePairs(arrval, "name").ToString() == "")
                        {
                            errorones++;
                            continue;
                        }
                        else
                        {
                            deptCode = arrval["name"].ToString();
                        }

                        foreach (var DeptCodeGroupRecord in existingDepts)
                        {
                            if ((DeptCodeGroupRecord.DepartmentCode == deptCode))
                            {
                                duplicates++;
                                existingDept = DeptCodeGroupRecord;
                                break;
                            }
                        }

                        deptName = arrval["name"].ToString();
                        deptDescription = arrval["objectId"].ToString();

                    }
                    else
                    {
                        addMasterRelationship = true;
                        //need to include hierarchy records for department hierarchy groups that are included in department records.
                        existingDepts = GetAllexistingDepts.Where(d => d.IsMaster == false).ToList();

                        //verify that the department code exists
                        if (HelperFunctions.CheckKeyValuePairs(arrval, "deptCode").ToString() == "")
                        {
                            errorones++;
                            continue;
                        }
                        else
                        {
                            deptCode = arrval["deptCode"].ToString();
                        }

                        deptMastCode = arrval["deptMastCode"].ToString();


                        var checkdepartmentrecord = existingDepts.Where(f => f.DepartmentCode == deptCode).FirstOrDefault();
                        if (checkdepartmentrecord != null)
                        {
                            duplicates++;
                            existingDept = checkdepartmentrecord;
                           
                        }
                        else
                        {

                        }
                        
                        
                        //foreach (var DepartmentRecord in existingDepts)
                        //{
                        //    if ((DepartmentRecord.DepartmentCode == deptCode))
                        //    //if ((DepartmentRecord.DepartmentCode == deptCode) && (DepartmentRecord.DepartmentMasterID?.DepartmentCode == deptMastCode))
                        //    {
                        //        duplicates++;
                        //        existingDept = DepartmentRecord;
                        //        break;
                        //    }
                        //}

                        deptDescription = HelperFunctions.CheckKeyValuePairs(arrval, "objectId").ToString();
                        deptName = HelperFunctions.CheckKeyValuePairs(arrval, "description").ToString();

                      
                        var groupPolicyValue = HelperFunctions.CheckKeyValuePairs(arrval, "policy").ToString();

                        if (groupPolicyValue == "PatientCareDept")
                        {
                            groupPolicyValue = "PatientCareDepartment";
                        }

                        try
                        {
                            isGroup = Boolean.Parse(HelperFunctions.CheckKeyValuePairs(arrval, "isGroup").ToString());
                        }
                        catch
                        {
                            isGroup = false;
                        }

                        //is Department Group is true, this is a hierarchy group.
                        //if (isGroup)
                        //{
                        //    isHierarchy = true;
                        //}

                        GroupPolicy = itemTypesList.Where(f => f.ItemTypeKeyword == "GROUPPOLICY" && f.ItemTypeValue == groupPolicyValue).FirstOrDefault();
                        DepartmentType = itemTypesList.Where(f => f.ItemTypeKeyword == "DEPARTMENTTYPE" && f.ItemTypeValue == HelperFunctions.CheckKeyValuePairs(arrval, "departmentTypeId").ToString()).FirstOrDefault();
                        DeptMaster = GetAllexistingDepts.Where(d => d.DepartmentCode == deptMastCode ).ToList().FirstOrDefault();

                    }

                    if (DeptMaster == null && importdatamethod == "MASTER" && isMaster == false && isHierarchy == false && isCodeGroup == false)
                    {
                        continue;
                    }
                    //if (DeptMaster == null && importdatamethod == "GROUP" && isMaster == false && isHierarchy == false && isCodeGroup == false)
                    //{
                    //    continue;
                    //}
                    int insertedID = 0;
                    if (existingDept != null)
                    {
                        existingDept.DepartmentName = deptName;
                        existingDept.Description = deptDescription;
                        existingDept.DepartmentTypeID = DepartmentType;
                        existingDept.GroupPolicy = GroupPolicy;
                        existingDept.IsMaster = isMaster;
                        existingDept.IsHierarchy = isHierarchy;
                        existingDept.IsGroup = (isCodeGroup == true || isGroup == true);
                        existingDept.GroupPolicy = GroupPolicy;
                        existingDept.UpdatedDate = DateTime.UtcNow;


                        _context.Entry(existingDept).State = EntityState.Modified;
                        insertedID = existingDept.DepartmentID;
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        Departments ndept = new Departments();

                        ndept.DepartmentCode = deptCode;
                        ndept.Description = deptDescription;
                        ndept.DepartmentName = deptName;
                        ndept.IsMaster = isMaster;
                        ndept.IsHierarchy = isHierarchy;
                        ndept.IsGroup = (isCodeGroup == true || isGroup == true);
                        ndept.GroupPolicy = GroupPolicy;
                        ndept.DepartmentMasterID = DeptMaster;
                        ndept.CreationDate = DateTime.UtcNow;
                        ndept.UpdatedDate = DateTime.UtcNow;
                        ndept.IsActive = true;
                        ndept.IsDeleted = false;
                        ndept.Identifier = Guid.NewGuid();

                        _context.Add(ndept);
                        insertedID = await _context.SaveChangesAsync();
                    }


                    successones++;

                    if (addMasterRelationship)
                    {
                        //var savedDept = _context.Departments.Where(d => d.DepartmentCode == deptCode).FirstOrDefault();
                        var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "DEPARTMENT", "MASTER", DeptMaster.DepartmentID, insertedID);
                    }
                }

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

        public static async Task<ABS.DBModels.APIResponse> DeptRelationshipsBulkInsert(System.Text.Json.JsonElement rawText, BudgetingContext _context)
        {
            try
            {

                ABS.DBModels.APIResponse ITUpdate = new ABS.DBModels.APIResponse();
                int errorones = 0;
                int successones = 0;

                string uncompressedData = Services.CompressionHelper.GetUncompressedData(rawText);

                object[] values = JsonConvert.DeserializeObject<object[]>(uncompressedData);
                List<NodeDepartmentData> NodesData = null;

                List<Departments> GetAllexistingDepartment = await _context.Departments.Where(f=>f.IsActive ==true && f.IsDeleted ==false).ToListAsync();
                List<Departments> existingDepartment = null;

                bool isGroup = false;
                ITUpdate.totalCount = values.Count();
                foreach (var item in values)
                {

                    Console.WriteLine("Remaining Records: " + ITUpdate.totalCount--);

                    ABS.DBModels.Departments depthierarchygroup = null;

                    var arrval = JsonConvert.DeserializeObject<Dictionary<string, object>>(item.ToString());
                    string relationshipType = HelperFunctions.CheckKeyValuePairs(arrval, "relationshipType").ToString();
                    Departments parentDept = null;
                    Departments childDept = null;
                    string depth = HelperFunctions.ParseValue(arrval, "depth");
                    string ordering = HelperFunctions.ParseValue(arrval, "ordering");
                    string objectId = HelperFunctions.ParseValue(arrval, "objectId");

                    if (relationshipType == "Hierarchy")
                    {
                        string hierarchyrecord = HelperFunctions.CheckKeyValuePairs(arrval, "hierarchyId").ToString();

                        var gethierarchyDept = GetAllexistingDepartment.Where(d => d.IsHierarchy == true && d.Description == hierarchyrecord).FirstOrDefault();
                        if (gethierarchyDept != null)
                        {
                            parentDept = gethierarchyDept;
                        }
                        string deptcoderecord = HelperFunctions.CheckKeyValuePairs(arrval, "deptCode").ToString();
                        string deptmastcoderecord = HelperFunctions.CheckKeyValuePairs(arrval, "deptMastCode").ToString();
                        childDept = GetAllexistingDepartment.Where(d => d.DepartmentCode == deptcoderecord  ).FirstOrDefault();
                        //childDept = _context.Departments.Where(d => d.DepartmentCode == deptcoderecord && d.DepartmentMasterID.DepartmentCode == deptmastcoderecord).FirstOrDefault();

                        try
                        {
                            NodesData = JsonConvert.DeserializeObject<List<NodeDepartmentData>>(uncompressedData);
                        }
                        catch
                        {

                        }

                        string parentId = HelperFunctions.ParseValue(arrval, "parentId");
                        if (parentId != "" && parentId != null)
                        {
                            var deptcodedata = NodesData.Where(f => f.objectId == int.Parse(parentId)).FirstOrDefault();
                            if (deptcodedata != null)
                            {
                                depthierarchygroup = getDepartmentObjbyCode(deptcodedata.deptCode, _context);
                            }

                            var isgroupaccout = NodesData.Count(f => f.parentId == int.Parse(objectId));
                            if (isgroupaccout > 0)
                            {
                                isGroup = true;
                            }
                            else
                            {
                                isGroup = false;
                            }

                            if (childDept.IsGroup == isGroup)
                            {

                            }
                            else
                            {
                                childDept.IsGroup = isGroup;
                                _context.Entry(childDept).State = EntityState.Modified;
                                _context.SaveChanges();
                            }


                        }
                        else
                        {
                            var isgroupaccout = NodesData.Count(f => f.parentId == int.Parse(objectId));
                            if (isgroupaccout > 0)
                            {
                                isGroup = true;
                            }
                            else
                            {
                                isGroup = false;
                            }

                            if (childDept.IsGroup == isGroup)
                            {

                            }
                            else
                            {
                                childDept.IsGroup = isGroup;
                                _context.Entry(childDept).State = EntityState.Modified;
                                _context.SaveChanges();
                            }
                        }
                    }
                    else if (relationshipType == "Group")
                    {
                        var departmentCodeGroupObjectId = HelperFunctions.CheckKeyValuePairs(arrval, "departmentCodeGroupObjectId").ToString();
                        var getCodeGroupDept = GetAllexistingDepartment.Where(f => f.Description == departmentCodeGroupObjectId).FirstOrDefault();

                        if (getCodeGroupDept != null)
                        {
                            parentDept = getCodeGroupDept;
                        }

                        var childdeptrecord = HelperFunctions.CheckKeyValuePairs(arrval, "code").ToString();
                        var deptmastcoderecord = HelperFunctions.CheckKeyValuePairs(arrval, "masterCode").ToString();
                        childDept = GetAllexistingDepartment.Where(d => d.DepartmentCode == childdeptrecord ).FirstOrDefault();
                        //childDept = _context.Departments.Where(d => d.DepartmentCode == childdeptrecord && d.DepartmentMasterID.DepartmentCode == deptmastcoderecord).FirstOrDefault();
                    }

                    if (parentDept != null && childDept != null && relationshipType == "Group")
                    {
                        var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "DEPARTMENT", relationshipType.ToUpper(), parentDept.DepartmentID, childDept.DepartmentID);
                        successones++;
                    }
                    else
                    if (parentDept != null && childDept != null && relationshipType == "Hierarchy" && depth == NodesData.Min(f=>f.depth))
                    {
                       
                            var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "DEPARTMENT", relationshipType.ToUpper(), parentDept.DepartmentID, childDept.DepartmentID, depth, ordering);
                       

                       // var y = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "DEPARTMENT", "GROUP", depthierarchygroup.DepartmentID, childDept.DepartmentID, depth, ordering);
                        successones++;
                    }
                    else
                    if (parentDept != null && childDept != null && relationshipType == "Hierarchy" && depthierarchygroup != null)
                    {
                        if (depth == NodesData.Min(f => f.depth))
                        {
                            var x = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "DEPARTMENT", relationshipType.ToUpper(), parentDept.DepartmentID, childDept.DepartmentID, depth, ordering);
                        }
                        
                        var y = await opRelationships.InsertRelationData(_context, "MODELTYPE", "RELATIONSHIPTYPE", "DEPARTMENT", "GROUP", depthierarchygroup.DepartmentID, childDept.DepartmentID, depth, ordering);
                        successones++;
                    }
                    else
                    {
                        errorones++;
                    }
                }

                ITUpdate.message += "|| Total Inserted: " + successones;
                ITUpdate.message += "|| Total Errors found:  " + errorones;

                return ITUpdate;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, _context);
                return null;
            }
        }
    }




    
}
