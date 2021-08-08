import { convertUTCDateToLocalDateLocalString } from "../date.helper";
import config from './data-transform-config';

const extraMappingStatistics = [
  {
    statisticsCodeID: "all",
    statisticsCode: "All",
    statisticsCodeName: "",
    isMaster: false
  },
  {
    statisticsCodeID: "primary",
    statisticsCode: "Primary",
    statisticsCodeName: "",
    isMaster: false
  },
  {
    statisticsCodeID: "secondary",
    statisticsCode: "Secondary",
    statisticsCodeName: "",
    isMaster: false
  },
  {
    statisticsCodeID: "tertiary",
    statisticsCode: "Tertiary",
    statisticsCodeName: "",
    isMaster: false
  },
];


export const transformBudgetVersionData = (data, dateformat) => {
  const rows = Object.values(JSON.parse(JSON.stringify(data)));
  rows.forEach(function (row) {
    row["id"] = row["budgetVersionsID"];
    row["creationDate"] = convertUTCDateToLocalDateLocalString(
      row["creationDate"] + "",
      dateformat
    );
    row["updateddate"] = convertUTCDateToLocalDateLocalString(
      row["updateddate"] + "",
      dateformat
    );
  });
  return rows;
};

export const getBudgetVersionDataForDropDowns = (data) => {
  let updatedData = [];
  let budgetversionData = Object.values(JSON.parse(JSON.stringify(data)));
  budgetversionData.map((budgetversion) => {
    updatedData.push({
      id: budgetversion.budgetVersionsID,
      value: budgetversion.code,
      text: budgetversion.code + " : " + budgetversion.description,
      key: budgetversion.code,
    });
  });

  return updatedData;
};

export const getStatisticsForDropDowns = (data) => {
  const extraStates = [
    {
      statisticsCodeID: "all",
      statisticsCode: "All",
      statisticsCodeName: "",
    },
    {
      statisticsCodeID: "primary",
      statisticsCode: "Primary",
      statisticsCodeName: "",
    },
    {
      statisticsCodeID: "secondary",
      statisticsCode: "Secondary",
      statisticsCodeName: "",
    },
    {
      statisticsCodeID: "tertiary",
      statisticsCode: "Tertiary",
      statisticsCodeName: "",
    },
  ];
  return [...extraStates, ...data];
};


// Dimension Relationship.

export const getEntityGroupedData = async (entityData , dimensionRelationshipData) => {
  // Get All the Entity Groups from the Data.
  let Groups =  entityData.filter((entity) => {      
    return entity.isGroup === true;
  });
  let entitiesWithGroup;
  let entitiesWithOutGroup = [...entityData.filter((item) => {return !item.isGroup})]; // only all items
  entitiesWithGroup = Groups.map((group) => {
      
      //Get relatioships/All Child objects of that group
      let relationships = dimensionRelationshipData.filter((relationships) => {
        return relationships.parentid === group.entityID && relationships.relation === "GROUP" && relationships.model === "ENTITY"
      });
      let childEntities = []; // save all child entity record of this group.
      relationships.forEach((relationship) => {
          let child = entityData.find((entity) => {return entity.entityID === relationship.childid})
          if(child)
          {
            childEntities.push({...child , parentId : relationship.parentid});
            // remove this child from the actual Data , to remove the duplication.
            //entitiesWithOutGroup = entitiesWithOutGroup.filter((entity) => {return entity.entityID !== child.entityID })
          }            
      });
      group["childEntities"] = [...childEntities];
      group["parentId"] = null;
      // Also Remove the group entity object from the actual Data . to prevent duplication.
      //entitiesWithOutGroup = entitiesWithOutGroup.filter((entity) => {return entity.entityID !== group.entityID })
      return group;
  });
  // Merge The group aur non-group data into one array.
  return [...entitiesWithGroup , ...entitiesWithOutGroup.map((item) => {return {...item , parentid : null}})]
}

let departmentsUsed = [];
export const getDepartmentHierarchyGroupedData = async (departmentData , dimensionRelationshipData) =>
{
departmentsUsed = [];
let duplicateHierarcies = [];  
let remainingData = [...departmentData];
// Get All the Department Hierarchies from the Data.
let Hierarchies =  departmentData.filter((department) => {      
  return department.isHierarchy === true;
});

let HierarchiesWithGroupsAndItem = await Hierarchies.map((Hierarchy) => {
      departmentsUsed.push(Hierarchy.departmentID);
      Hierarchy = getHierarchyObj(departmentData , dimensionRelationshipData , Hierarchy)
      // Save duplicate Hierarchy ID list
      Hierarchy["hierarchyDepartments"].forEach((item) => {
        duplicateHierarcies.push(item.departmentID)
      });
  //first check for the nested hierarchie of this parent hierarchie 
  //Get all group objects of that Hierarchy

  // let groupsRelationShips = dimensionRelationshipData.filter((relationships) => {
  //   return relationships.parentid === Hierarchy.departmentID && relationships.relation === "HIERARCHY" && relationships.model === "DEPARTMENT"
  // });
  //   let HierarchyGroups = [];
  //    groupsRelationShips.forEach((relationship) => {
  //       let group = departmentData.find((department) => {return department.departmentID === relationship.childid && department.isGroup === true})
  //       // if Group is found in that Hierarchy , now find its items.
  //       if(group)
  //       {
  //         // First find group and its items relationships
  //         let GroupItemRelationships = dimensionRelationshipData.filter((relationships) => {
  //           return relationships.parentid === group.departmentID && relationships.relation === "GROUP" && relationships.model === "DEPARTMENT"
  //         });
  //         let childDepatments = [];
  //         // Now find the item(Child) object of these relationship.
  //         GroupItemRelationships.forEach((GroupItemRelationship) => {
  //           let child = departmentData.find((department) => {return department.departmentID === GroupItemRelationship.childid})
  //           if(child)
  //           {
  //             childDepatments.push(child);
  //             // Remove department Item (Child) from the remaing Data , to prevent Duplication.
  //             remainingData = remainingData.filter((department) => {return department.departmentID !== child.departmentID })
  //           }
  //         });
  //         group["childDepartments"] = [...childDepatments];
  //         HierarchyGroups.push(group);
  //         // Remove department group (Child of Hierarchy) from the remaing Data , to prevent Duplication.
  //         remainingData = remainingData.filter((department) => {return department.departmentID !== group.departmentID })
            
  //       }
  // })
  // Hierarchy["groupDepartments"] = [...Hierarchy["hierarchyDepartments"] , ...HierarchyGroups];
  // // Remove department Hierarchy from the remaing Data , to prevent Duplication.
  // remainingData = remainingData.filter((department) => {return department.departmentID !== Hierarchy.departmentID })
      
  
  return  Hierarchy;
});

/// Now Get groups without any Hierarchy from the remaining Data.

departmentsUsed.forEach((id) => {
  remainingData = remainingData.filter((department) => {return department.departmentID !== id })
});

let Groups =  remainingData.filter((entity) => {      
  return entity.isGroup === true;
});
let departmentWithGroupOnly;
let departmentWithOutGroup = [...remainingData.filter((item) => {return !item.isGroup && !item.isHierarchy})];

departmentWithGroupOnly = await Groups.map((group) => {
   //Get relatioships/All Child objects of that group
   let relationships = dimensionRelationshipData.filter((relationships) => {
    return relationships.parentid === group.departmentID && relationships.relation === "GROUP" && relationships.model === "DEPARTMENT"
  });
  let childDepartments = []; // save all child entity record of this group.
  relationships.forEach((relationship) => {
      let child = remainingData.find((entity) => {return entity.departmentID === relationship.childid})
      if(child)
      {
        childDepartments.push({...child , parentId : relationship.parentid});
        // remove this child from the actual Data , to remove the duplication.
        //departmentWithOutGroup = departmentWithOutGroup.filter((entity) => {return entity.departmentID !== child.departmentID })
      }            
  });
  group["childDepartments"] = [...childDepartments];
  group["parentId"] = null; 
  // Also Remove the group entity object from the actual Data . to prevent duplication.
  //departmentWithOutGroup = departmentWithOutGroup.filter((entity) => {return entity.departmentID !== group.departmentID })
  return group;
});
duplicateHierarcies.forEach((item) => {
  HierarchiesWithGroupsAndItem = HierarchiesWithGroupsAndItem.filter((itemFilter) => {
      return item !== itemFilter.departmentID
  });
});
// Merge Data in order , Hierarchies , OnlyGroups , Only Items
// const abc =  [...HierarchiesWithGroupsAndItem , ...departmentWithGroupOnly , ...departmentWithOutGroup]
// console.log('dept : ' , abc)
//return [...HierarchiesWithGroupsAndItem , ...departmentWithGroupOnly , ...departmentWithOutGroup]

if(HierarchiesWithGroupsAndItem.length)
{
  //return [...HierarchiesWithGroupsAndItem[0]['groupDepartments']]
  
  return [...HierarchiesWithGroupsAndItem[0]['groupDepartments'] , ...departmentWithGroupOnly , ...departmentWithOutGroup]
  //return [...HierarchiesWithGroupsAndItem[0]['groupDepartments'] , ...departmentWithGroupOnly]

}else
{
  return [];
}
}

const getHierarchyObj = (departmentData , dimensionRelationshipData , hierarchyObj) => {

  let childrenHierarchiesRelationShips = dimensionRelationshipData.filter((relationships) => {
    return relationships.parentid === hierarchyObj.departmentID && relationships.relation === "HIERARCHY" && relationships.model === "DEPARTMENT"
  }); 

  let childHierarchies = []
  childrenHierarchiesRelationShips.forEach((hierarchyRelationships) => {
      let hierarchyObject = departmentData.find((department) => {return department.departmentID === hierarchyRelationships.childid && department.isHierarchy === true})
      let completeHierarchyObj = hierarchyObject;
      if(completeHierarchyObj)
      {
        completeHierarchyObj = getHierarchyObj(departmentData , dimensionRelationshipData ,hierarchyObject)
        childHierarchies.push({...completeHierarchyObj , parentId : hierarchyRelationships.parentid });
        departmentData = departmentData.filter((department) => {return department.departmentID !== hierarchyObject.departmentID })
        departmentsUsed.push(hierarchyObject.departmentID); 
      }
    });
    hierarchyObj["hierarchyDepartments"] = [...childHierarchies];

    let childGroups = []
    childrenHierarchiesRelationShips.forEach((hierarchyRelationships) => {
      let groupObject = departmentData.find((department) => {return department.departmentID === hierarchyRelationships.childid && department.isGroup === true})
      if(groupObject)
      {
        groupObject = GetCompleteDepartmentGroupObj(departmentData ,dimensionRelationshipData , groupObject);
        childGroups.push({...groupObject , parentId :hierarchyRelationships.parentid });
        departmentsUsed.push(groupObject.departmentID); 
        // let GroupItemRelationships = dimensionRelationshipData.filter((relationships) => {
        //   return relationships.parentid === groupObject.departmentID && relationships.relation === "GROUP" && relationships.model === "DEPARTMENT"
        // });
        // let childDepatments = [];
        // GroupItemRelationships.forEach((GroupItemRelationship) => {
        //   let child = departmentData.find((department) => {return department.departmentID === GroupItemRelationship.childid})
        //   if(child)
        //   {
        //     childDepatments.push(child);
        //     // Remove department Item (Child) from the remaing Data , to prevent Duplication.
        //     departmentData = departmentData.filter((department) => {return department.departmentID !== child.departmentID })
        //   }
        // });
        // groupObject["childDepartments"] = [...childDepatments];
      }
      // childGroups.push(groupObject);
    });
    hierarchyObj["groupDepartments"] = [...childGroups]
    hierarchyObj["parentid"] = null;
    return hierarchyObj
}

export const getStatisticsGroupedData = async (statisticData , dimensionRelationshipData , addMappingStatistics = false) => {
  // Get All the Statistics Groups from the Data.
  let Groups =  statisticData.filter((statistic) => {      
    return statistic.isGroup === true;
  });
  let statisticWithGroup;
  let statisticWithOutGroup = [...statisticData.filter((item) => {return !item.isGroup})];
  statisticWithGroup = Groups.map((group) => {
      
      //Get relatioships/All Child objects of that group
      let relationships = dimensionRelationshipData.filter((relationships) => {
        return relationships.parentid === group.statisticsCodeID && relationships.relation === "GROUP" && relationships.model === "STATISTICSCODE"
      });
      let childStatistics = []; // save all child statistics record of this group.
      relationships.forEach((relationship) => {
          let child = statisticData.find((statistics) => {return statistics.statisticsCodeID === relationship.childid && statistics.isMaster !== true})
          if(child)
          {
            childStatistics.push({...child , parentId : relationship.parentid});
            // remove this child from the actual Data , to remove the duplication.
            //statisticWithOutGroup = statisticWithOutGroup.filter((statistics) => {return statistics.statisticsCodeID !== child.statisticsCodeID })
          }            
      });
      group["childStatistic"] = [...childStatistics];
      group["parentId"] = null;
      // Also Remove the group entity object from the actual Data . to prevent duplication.
      //statisticWithOutGroup = statisticWithOutGroup.filter((statistics) => {return statistics.statisticsCodeID !== group.statisticsCodeID })
      return group;
  });

    if(config.statistic.HideMasters)
    {
      statisticWithOutGroup = statisticWithOutGroup.filter((statistics) => {return statistics.isMaster === false })
    }

   // Merge The group aur non-group data into one array.
   if(addMappingStatistics)
   {
    return [...extraMappingStatistics,...statisticWithGroup , ...statisticWithOutGroup] 
   }else
   {     
     return [...statisticWithGroup , ...statisticWithOutGroup]
   }
}

// export const getGLAccountGroupedData = (GLAccountsData , dimensionRelationshipData) => {
  
//   // Get All the Entity Groups from the Data.
//   let Groups =  GLAccountsData.filter((glAccount) => {      
//     return glAccount.isGroup === true;
//   });
//   let glAccountsWithGroup;
//   let glAccountsWithOutGroup = [...GLAccountsData];
//   glAccountsWithGroup = Groups.map((group) => {
      
//       //Get relatioships/All Child objects of that group
//       let relationships = dimensionRelationshipData.filter((relationships) => {
//         return relationships.parentid === group.glAccountID && relationships.relation === "GROUP" && relationships.model === "GLACCOUNT"
//       });
//       let childGLAccounts = []; // save all child entity record of this group.
//       relationships.forEach((relationship) => {
//           let child = GLAccountsData.find((glAccount) => {return glAccount.glAccountID === relationship.childid})
//           if(child)
//           {
//             childGLAccounts.push(child);
//             // remove this child from the actual Data , to remove the duplication.
//             glAccountsWithOutGroup = glAccountsWithOutGroup.filter((glAccount) => {return glAccount.glAccountID !== child.glAccountID })
//           }            
//       });
//       group["childGLAccounts"] = [...childGLAccounts];
//       // Also Remove the group entity object from the actual Data . to prevent duplication.
//       glAccountsWithOutGroup = glAccountsWithOutGroup.filter((glAccount) => {return glAccount.glAccountID !== group.glAccountID })
//       return group;
//   });
//   // Merge The group aur non-group data into one array.
//   return [...glAccountsWithGroup , ...glAccountsWithOutGroup]
// }

export const getGLAccountHierarchyGroupedData = async (GLAccountsData , dimensionRelationshipData) => 
{
  let duplicateHierarcies = [];  
  let remainingData = [...GLAccountsData];
 // Get All the Department Hierarchies from the Data.
  let Hierarchies =  GLAccountsData.filter((glaccount) => {      
  return glaccount.isHierarchy === true;
  });

  let HierarchiesWithGroupsAndItem = Hierarchies.map((Hierarchy) => {
      Hierarchy = geGLtHierarchyObj(GLAccountsData , dimensionRelationshipData , Hierarchy)
     // Save duplicate Hierarchy ID list
     Hierarchy["hierarchyGLAccounts"].forEach((item) => {
      duplicateHierarcies.push(item.glAccountID)
    });
    //first check for the nested hierarchie of this parent hierarchie 
    //Get all group objects of that Hierarchy
    
    
  //   let groupsRelationShips = dimensionRelationshipData.filter((relationships) => {
  //     return relationships.parentid === Hierarchy.glAccountID && relationships.relation === "HIERARCHY" && relationships.model === "GLACCOUNT"
  //   });
    
    
    
  //   let HierarchyGroups = [];
  //   groupsRelationShips.forEach((relationship) => {
  //     let group = GLAccountsData.find((glAccount) => {return glAccount.glAccountID === relationship.childid && glAccount.isGroup === true})
  //     // if Group is found in that Hierarchy , now find its items.
  //     if(group)
  //     {
  //       // First find group and its items relationships
  //       let GroupItemRelationships = dimensionRelationshipData.filter((relationships) => {
  //         return relationships.parentid === group.glAccountID && relationships.relation === "GROUP" && relationships.model === "GLACCOUNT"
  //       });
  //       let childGLAccounts = [];
  //       // Now find the item(Child) object of these relationship.
  //       GroupItemRelationships.forEach((GroupItemRelationship) => {
  //         let child = GLAccountsData.find((glAccount) => {return glAccount.glAccountID === GroupItemRelationship.childid})
  //         if(child)
  //         {
  //           childGLAccounts.push(child);
  //           // Remove department Item (Child) from the remaing Data , to prevent Duplication.
  //           remainingData = remainingData.filter((glAccount) => {return glAccount.glAccountID !== child.glAccountID })
  //         }
  //       });
  //       group["childGLAccounts"] = [...childGLAccounts];
  //       HierarchyGroups.push(group);
  //       // Remove department group (Child of Hierarchy) from the remaing Data , to prevent Duplication.
  //       remainingData = remainingData.filter((glAccount) => {return glAccount.glAccountID !== group.glAccountID })
          
  //     }
  // })
  //   Hierarchy["groupGLAccounts"] = [...Hierarchy["hierarchyGLAccounts"] , ...HierarchyGroups];



    // Remove department Hierarchy from the remaing Data , to prevent Duplication.
    remainingData = remainingData.filter((department) => {return department.glAccountID !== Hierarchy.glAccountID })
    return  Hierarchy;
  });

  /// Now Get groups without any Hierarchy from the remaining Data.
  let Groups =  remainingData.filter((glAccount) => {      
    return glAccount.isGroup === true;
  });
  let glAccountWithGroupOnly;
  let glAccountWithOutGroup = [...remainingData];
  
//   glAccountWithGroupOnly = Groups.map((group) => {
//     //Get relatioships/All Child objects of that group
//     let relationships = dimensionRelationshipData.filter((relationships) => {
//      return relationships.parentid === group.glAccountID && relationships.relation === "GROUP" && relationships.model === "GLACCOUNT"
//    });
//    let childGLAccounts = []; // save all child entity record of this group.
//    relationships.forEach((relationship) => {
//        let child = remainingData.find((glAccount) => {return glAccount.glAccountID === relationship.childid})
//        if(child)
//        {
//          childGLAccounts.push(child);
//          // remove this child from the actual Data , to remove the duplication.
//          glAccountWithOutGroup = glAccountWithOutGroup.filter((glAccount) => {return glAccount.glAccountID !== child.glAccountID })
//        }            
//    });
//    group["childGLAccounts"] = [...childGLAccounts];
//    // Also Remove the group entity object from the actual Data . to prevent duplication.
//    glAccountWithOutGroup = glAccountWithOutGroup.filter((glAccount) => {return glAccount.glAccountID !== group.glAccountID })
//    return group;
//  });


 duplicateHierarcies.forEach((item) => {
  HierarchiesWithGroupsAndItem = HierarchiesWithGroupsAndItem.filter((itemFilter) => {
      return item !== itemFilter.glAccountID
  });
});

//const abc = [...HierarchiesWithGroupsAndItem , ...glAccountWithGroupOnly , ...glAccountWithOutGroup];
//console.log("GL abc" , abc )
// 
if(HierarchiesWithGroupsAndItem.length)
{
  return [...HierarchiesWithGroupsAndItem[0]["groupGLAccounts"]];
  return [...HierarchiesWithGroupsAndItem];
}else
{
  return [];
}

  // Get All the Entity Groups from the Data.
  // let Groups =  GLAccountsData.filter((glAccount) => {      
  //   return glAccount.isGroup === true;
  // });
  // let glAccountsWithGroup;
  // let glAccountsWithOutGroup = [...GLAccountsData];
  // glAccountsWithGroup = Groups.map((group) => {
      
    
  //     //Get relatioships/All Child objects of that group
  //     let relationships = dimensionRelationshipData.filter((relationships) => {
  //       return relationships.parentid === group.glAccountID && relationships.relation === "GROUP" && relationships.model === "GLACCOUNT"
  //     });
      
  //     let childGLAccounts = []; // save all child entity record of this group.
  //     relationships.forEach((relationship) => {
  //         let child = GLAccountsData.find((glAccount) => {return glAccount.glAccountID === relationship.childid})
  //         if(child)
  //         {
  //           childGLAccounts.push(child);
  //           // remove this child from the actual Data , to remove the duplication.
  //           glAccountsWithOutGroup = glAccountsWithOutGroup.filter((glAccount) => {return glAccount.glAccountID !== child.glAccountID })
  //         }            
  //     });
  //     group["childGLAccounts"] = [...childGLAccounts];
  //     // Also Remove the group entity object from the actual Data . to prevent duplication.
  //     glAccountsWithOutGroup = glAccountsWithOutGroup.filter((glAccount) => {return glAccount.glAccountID !== group.glAccountID })
  //     return group;
  //});
  // Merge The group aur non-group data into one array.
  //return [...glAccountsWithGroup , ...glAccountsWithOutGroup]
}

const geGLtHierarchyObj = (glData , dimensionRelationshipData , hierarchyObj) => {

  let childrenHierarchiesRelationShips = dimensionRelationshipData.filter((relationships) => {
    return relationships.parentid === hierarchyObj.glAccountID && relationships.relation === "HIERARCHY" && relationships.model === "GLACCOUNT"
  }); 
  let childHierarchies = []
          childrenHierarchiesRelationShips.forEach((hierarchyRelationships) => {
            let hierarchyObject = glData.find((glAccount) => {return glAccount.glAccountID === hierarchyRelationships.childid && glAccount.isHierarchy === true})
            let completeHierarchyObj = hierarchyObject;
            if(completeHierarchyObj)
            {
                  completeHierarchyObj = geGLtHierarchyObj(glData , dimensionRelationshipData ,hierarchyObject)
                  childHierarchies.push(completeHierarchyObj);
                  glData = glData.filter((glAccount) => {return glAccount.glAccountID !== hierarchyObject.glAccountID })     
            }
      });
  hierarchyObj["hierarchyGLAccounts"] = [...childHierarchies];
  let childGroups = []
  childrenHierarchiesRelationShips.forEach((hierarchyRelationships) => {
    let groupObject = glData.find((glAccount) => {return glAccount.glAccountID === hierarchyRelationships.childid && glAccount.isGroup === true})
    if(groupObject)
    {
      groupObject = GetCompleteGLAccountGroupObj(glData , dimensionRelationshipData , groupObject)
      childGroups.push(groupObject);
      // let GroupItemRelationships = dimensionRelationshipData.filter((relationships) => {
      //   return relationships.parentid === groupObject.glAccountID && relationships.relation === "GROUP" && relationships.model === "GLACCOUNT"
      // });
      // let childGLAccount = [];
      // GroupItemRelationships.forEach((GroupItemRelationship) => {
      //   let child = glData.find((glAccount) => {return glAccount.glAccountID === GroupItemRelationship.childid})
      //   if(child)
      //   {
      //     childGLAccount.push(child);
      //     // Remove department Item (Child) from the remaing Data , to prevent Duplication.
      //     glData = glData.filter((glAccount) => {return glAccount.glAccountID !== child.glAccountID })
      //   }
      // });
      // groupObject["childGLAccounts"] = [...childGLAccount];
    }
    // childGroups.push(groupObject);
  });
  hierarchyObj["groupGLAccounts"] = [...childGroups]       
  return hierarchyObj
}

const GetCompleteGLAccountGroupObj = (glData , dimensionRelationshipData , groupObj) => {
  let GroupItemRelationships = dimensionRelationshipData.filter((relationships) => {
    return relationships.parentid === groupObj.glAccountID && relationships.relation === "GROUP" && relationships.model === "GLACCOUNT"
  });

  let childSubGroups = [];
  let childMembers = [];

  GroupItemRelationships.forEach((GroupItemRelationship) => {
    let subGroup = glData.find((glAccount) => {return glAccount.glAccountID === GroupItemRelationship.childid && glAccount.isGroup === true})
    if(subGroup)
    {
      subGroup = GetCompleteGLAccountGroupObj(glData , dimensionRelationshipData , subGroup);
      childSubGroups.push(subGroup);
    }else
    {
      let childMember = glData.find((glAccount) => {return glAccount.glAccountID === GroupItemRelationship.childid && glAccount.isGroup !== true})
      if(childMember)
      {
      childMembers.push(childMember);
      }
    }
  });
  groupObj["groupGLAccounts"] = [...childSubGroups , ...childMembers];
  return groupObj;
}

const GetCompleteDepartmentGroupObj = (departmentData , dimensionRelationshipData , groupObj) => {

  let GroupItemRelationships = dimensionRelationshipData.filter((relationships) => {
    return relationships.parentid === groupObj.departmentID && relationships.relation === "GROUP" && relationships.model === "DEPARTMENT"
  });

  let childSubGroups = [];
  let childMembers = [];

  GroupItemRelationships.forEach((GroupItemRelationship) => {
    let subGroup = departmentData.find((dept) => {return dept.departmentID === GroupItemRelationship.childid && dept.isGroup === true})
    if(subGroup)
    {
      subGroup = GetCompleteDepartmentGroupObj(departmentData , dimensionRelationshipData , subGroup);
      childSubGroups.push({...subGroup  , parentId : GroupItemRelationship.parentid});
      departmentsUsed.push(subGroup.departmentID);
    }else
    {
      let childMember = departmentData.find((dept) => {return dept.departmentID === GroupItemRelationship.childid && dept.isGroup !== true})
      if(childMember)
      {
      childMembers.push({...childMember , parentId : GroupItemRelationship.parentid});
      //departmentsUsed.push(childMember.departmentID);
      }
    }
  });
  groupObj["groupDepartments"] = [...childSubGroups , ...childMembers];
  return groupObj;
}

export const GetSortedEntityByGroups = (entityData) =>{
  const groups = entityData.filter((entity) => entity.isGroup === true);
  const nonGroups = entityData.filter((entity) => entity.isGroup !== true);
  return [...groups , ...nonGroups]
}

export const GetSortedDepartmentByHierarchyGroupe = (departmentData) =>{
  const hierarchies = departmentData.filter((department) => department.isHierarchy === true);  
  const groups = departmentData.filter((department) => department.isGroup === true);
  const nonGroups = departmentData.filter((department) => department.isGroup !== true && department.isHierarchy !== true);
  return [...hierarchies ,...groups , ...nonGroups]
}
// Mapping

export const getOnlyItemOfDimension = (Data) =>
{ 
  return [...Data.filter((item) => item.isGroup !== true )]
}

export const GetSortedStatisticsByGroups = (statisticsData , forRatio = false) =>{
  const groups = statisticsData.filter((statistics) => statistics.isGroup === true);
  const nonGroups = statisticsData.filter((statistics) => statistics.isGroup !== true);
  if(forRatio)
  {
    return [...extraMappingStatistics , ...groups , ...nonGroups]
  }
  return [...groups , ...nonGroups]
}

export const GetSortedGLAccountsByGroups = (GLAccountsData) =>{
  const groups = GLAccountsData.filter((glAccount) => glAccount.isGroup === true);
  const nonGroups = GLAccountsData.filter((glAccount) => glAccount.isGroup !== true);
  return [...groups , ...nonGroups]
}

export const GetSortedJobCodeByGroups = (JobCodeData) =>{
  const groups = JobCodeData.filter((jobCode) => jobCode.isGroup === true);
  const nonGroups = JobCodeData.filter((jobCode) => jobCode.isGroup !== true);
  return [...groups , ...nonGroups]
}

export const GetSortedPayTypeByGroups = (PayTypeData) =>{
  const groups = PayTypeData.filter((payType) => payType.isGroup === true);
  const nonGroups = PayTypeData.filter((payType) => payType.isGroup !== true);
  let result = [...groups , ...nonGroups];
  result = result.map((payType) => {
    return {...payType , id : payType.payTypeID}
  })
  return result;
}

export const getJobCodeGroupedData = async (JobCodeData , dimensionRelationshipData) => {
  
    let Groups =  JobCodeData.filter((jobCode) => {      
      return jobCode.isGroup === true;
    });
    let jobCodeWithGroup;
    let jobCodeWithOutGroup = [...JobCodeData];
    jobCodeWithGroup = Groups.map((group) => {
        
        //Get relatioships/All Child objects of that group
        let relationships = dimensionRelationshipData.filter((relationships) => {
          return relationships.parentid === group.jobCodeID && relationships.relation === "GROUP" && relationships.model === "JOBCODE"
        });
        let jobCodeEntities = []; // save all child entity record of this group.
        relationships.forEach((relationship) => {
            let child = JobCodeData.find((jobCode) => {return jobCode.jobCodeID === relationship.childid && jobCode.isMaster !== true})
            if(child)
            {
              jobCodeEntities.push(child);
              // remove this child from the actual Data , to remove the duplication.
              jobCodeWithOutGroup = jobCodeWithOutGroup.filter((jobCode) => {return jobCode.jobCodeID !== child.jobCodeID })
            }            
        });
        group["childJobCodes"] = [...jobCodeEntities];
        // Also Remove the group entity object from the actual Data . to prevent duplication.
        jobCodeWithOutGroup = jobCodeWithOutGroup.filter((jobCode) => {return jobCode.jobCodeID !== group.jobCodeID })
        return group;
    });

    if(config.jobCode.HideMasters)
    {
      jobCodeWithOutGroup = jobCodeWithOutGroup.filter((jobCode) => {return jobCode.isMaster === false })
    }

    // Merge The group aur non-group data into one array.
    return [...jobCodeWithGroup , ...jobCodeWithOutGroup]
}

export const getPayTypeGroupedData = async (PayTypeData , dimensionRelationshipData) => {
  let Groups =  PayTypeData.filter((payType) => {      
    return payType.isGroup === true;
  });
  let payTypeWithGroup;
  let payTypeWithOutGroup = [...PayTypeData];
  payTypeWithGroup = Groups.map((group) => {
      
      //Get relatioships/All Child objects of that group
      let relationships = dimensionRelationshipData.filter((relationships) => {
        return relationships.parentid === group.payTypeID && relationships.relation === "GROUP" && relationships.model === "PAYTYPE"
      });
      let payTypeEntities = []; // save all child entity record of this group.
      relationships.forEach((relationship) => {
          let child = PayTypeData.find((payType) => {return payType.payTypeID === relationship.childid && payType.isMaster !== true})
          if(child)
          {
            payTypeEntities.push(child);
            // remove this child from the actual Data , to remove the duplication.
            payTypeWithOutGroup = payTypeWithOutGroup.filter((payType) => {return payType.payTypeID !== child.payTypeID })
          }            
      });
      group["childPayTypes"] = [...payTypeEntities];
      // Also Remove the group entity object from the actual Data . to prevent duplication.
      payTypeWithOutGroup = payTypeWithOutGroup.filter((payType) => {return payType.payTypeID !== group.payTypeID })
      return group;
  });

  if(config.payType.HideMasters)
    {
      payTypeWithOutGroup = payTypeWithOutGroup.filter((payType) => {return payType.isMaster === false })
    }
  // Merge The group aur non-group data into one array.
  return [...payTypeWithGroup , ...payTypeWithOutGroup]
}

