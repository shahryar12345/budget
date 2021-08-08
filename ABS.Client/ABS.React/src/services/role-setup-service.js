import getURL from './api/apiList';
import { makeApiRequest } from './api';

export const GetAllRoles = () => {
    return new Promise((resolve) => {
        makeApiRequest('get', getURL('ROLES')).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            console.log('Error occured while getting')
            resolve([]);
        });
    })
}

// export const createRole = (params) => {
//     return new Promise((resolve) => {
//         makeApiRequest('post', getURL('ROLES'), params).then((response) => {
//             resolve(response.data);
//         }).catch((err) => {
//             console.log('Error occured while getting')
//             resolve([]);
//         });
//     })
// }
// export const updateRole = (params) => {
//     return new Promise((resolve) => {
//         makeApiRequest('put', `${getURL('ROLES')}/${params.userProfileID}`, params).then((response) => {
//             resolve(params.userProfileID);
//         }).catch((err) => {
//             console.log('Error occured while getting')
//             resolve([]);
//         });
//     })
// }

export const assignEntitiesToUsers = (params) => {
    return new Promise((resolve) => {
        makeApiRequest('post', getURL('ASSIGNENTITIES'), params).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            console.log('Error occured while getting')
            resolve([]);
        });
    })
}


export const getAllMenuItemsListWithActionPermissions = (params) => {
    return new Promise((resolve) => {
        makeApiRequest('get', getURL('GETMENUITEMS'), params).then((response) => {
            resolve(response.data);
            // resolve(data);
        }).catch((err) => {
            console.log('Error occured while getting')
            resolve([]);
        });
    })
}


export const createRole = (params) => {
    return new Promise((resolve) => {
        // makeApiRequest('post', `${getURL(`CREATEROLES`)}?RamObj=${params}`, params).then((response) => {
        makeApiRequest('post', `${getURL(`CREATEROLES`)}`, params).then((response) => {
            resolve(response);
        }).catch((err) => {
            console.log('Error occured while creating...')
            resolve([]);
        });
    })
}
// getRoleDetails
export const getRoleDetails = (params) => {
    return new Promise((resolve) => {
        makeApiRequest('get', `${getURL(`GETROLESDETAILS`)}/?RamObj=${params}`).then((response) => {
            resolve(modifyRoleObject(response));
        }).catch((err) => {
            console.log('Error occured while updating...', err)
            resolve([]);
        });
    })
}

const modifyRoleObject = (res) => {
    const data = {
        roleProfile: {
            identityAppRoleID: res.data.roleProfile.identityAppRoleID,
            name: res.data.roleProfile.name,
            description: res.data.roleProfile.description,
        },
        "selectedUsers": modifyUserArray(res.data.allUserRoles),
        "selectedMenuItems": modifyMenuItemsArray(res.data.allRoleScreens, res.data.allRoleScreenOperations),
    }
    return data
}

const modifyUserArray = (arr) => {
    let updatedArray = []
    updatedArray = arr.map(dt => {
        return {
            userProfileID: dt?.userID?.userProfileID,
            username: dt?.userID?.username
        }
    })
    return updatedArray;
}

const modifyMenuItemsArray = (allRoleScreens, allRoleScreenOperations) => {
    let updatedArray = []
    updatedArray = allRoleScreens.map(dt => {
        return {
            id: dt?.screenID?.identityScreenID,
            description: dt?.screenID?.description,
            name: dt?.screenID?.name,
            parentId: dt?.screenID?.parentID,
            value: dt?.screenID?.value,
            actionsPermission: getActionPermissionByScreenId(dt.screenID.identityScreenID, allRoleScreenOperations)
        }
    })
    return updatedArray;
}

const getActionPermissionByScreenId = (screenId, allRoleScreenOperations) => {
    let updatedArray = [];
    allRoleScreenOperations.forEach(data => {
        if (data?.screenOperationID?.identityScreens?.identityScreenID === screenId) {
            updatedArray.push(
                {
                    id: data?.screenOperationID?.identityOperation?.identityOperationID,
                    name: data?.screenOperationID?.identityOperation?.name,
                    value: data.value
                }
            )
        }
    })
    return updatedArray
}

var data = [
    {
        id: 0,
        name: 'Budget Versions List',
        parentId: null,
        value: "budgetVersionsList",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Add'
            },
            {
                id: 2,
                value: false,
                name: 'Open'
            },
            {
                id: 3,
                value: false,
                name: 'Copy'
            },
            {
                id: 4,
                value: false,
                name: 'Rename'
            },
            {
                id: 5,
                value: false,
                name: 'Delete'
            },
            {
                id: 6,
                value: false,
                name: 'Calculate'
            },
        ],
    },
    {
        id: 1,
        name: 'Budget Version',
        parentId: null,
        value: "budgetVersion"
    },
    {
        id: 2,
        name: 'Reports',
        parentId: null,
        value: "reports",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Add'
            },
            {
                id: 2,
                value: false,
                name: 'Edit'
            },
            {
                id: 3,
                value: false,
                name: 'Copy'
            },
            {
                id: 4,
                value: false,
                name: 'Rename'
            },
            {
                id: 5,
                value: false,
                name: 'Delete'
            },
            {
                id: 6,
                value: false,
                name: 'Update'
            },
            {
                id: 7,
                value: false,
                name: 'Export'
            }
        ],
    },
    {
        id: 3,
        name: 'Structure Tables',
        parentId: null,
        value: "structureTables"
    },
    {
        id: 4,
        name: 'FTE divisors',
        parentId: null,
        value: "FTEDivisors",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ],
    },
    {
        id: 5,
        name: 'Default Pay Type distributions',
        parentId: null,
        value: 'defaultPayTypeDistributions',
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ],
    },
    {
        id: 6,
        name: 'Mappings',
        parentId: null,
        value: "mappings"
    },
    {
        id: 7,
        name: 'Statistic',
        fullName: 'Budget Versions/Statistic data',
        parentId: 1,
        value: 'budgetVersions/StatisticData'
    },
    {
        id: 8,
        name: 'Show data',
        fullName: 'Budget Versions/Statistic data/ShowData',
        parentId: 7,
        value: 'budgetVersions/StatisticData/ShowData',
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },
    {
        id: 9,
        name: 'Add row',
        fullName: 'Budget Versions/Statistic data/AddRow',
        parentId: 7,
        value: 'budgetVersions/StatisticData/AddRow',
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
        ]
    },
    {
        id: 10,
        name: 'Forecasting',
        fullName: 'Budget Versions/StatisticData/Forecasting',
        parentId: 7,
        value: 'budgetVersions/StatisticData/Forecasting',
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },

    {
        id: 11,
        name: 'General ledger',
        fullName: 'Budget Versions/GeneralLedger',
        parentId: 1,
        value: 'budgetVersions/GeneralLedger'
    },
    {
        id: 12,
        name: 'Show data',
        fullName: 'Budget Versions/GeneralLedger/ShowData',
        parentId: 11,
        value: 'budgetVersions/GeneralLedger/ShowData',
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },

    {
        id: 13,
        name: 'Add row',
        fullName: 'Budget Versions/GeneralLedger/Add row',
        parentId: 11,
        value: "budgetVersions/GeneralLedger/AddRow",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
        ]
    },
    {
        id: 14,
        name: 'Forecast',
        fullName: 'Budget Versions/GeneralLedger/Forecast',
        parentId: 11,
        value: "budgetVersions/GeneralLedger/Forecast",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },
    {
        id: 15,
        name: 'Inflation',
        fullName: 'Budget Versions/GeneralLedger/Forecast',
        parentId: 11,
        value: "budgetVersions/GeneralLedger/Inflation",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },

    {
        id: 16,
        name: 'Staffing',
        fullName: 'Budget Versions/Staffing data',
        parentId: 1,
        value: "budgetVersions/staffingData"
    },
    {
        id: 17,
        name: 'Show data',
        fullName: 'Budget Versions/Staffing data/Show data',
        parentId: 15,
        value: "budgetVersions/StaffingData/ShowData",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },
    {
        id: 18,
        name: 'Add row',
        fullName: 'Budget Versions/Staffing data/Add row',
        parentId: 15,
        value: "budgetVersions/StaffingData/AddRow",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
        ]
    },
    {
        id: 19,
        name: 'Forecast',
        fullName: 'Budget Versions/Staffing data/Forecast',
        parentId: 15,
        value: "budgetVersions/StaffingData/Forecast",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },
    {
        id: 20,
        name: 'Raises',
        fullName: 'Budget Versions/Staffing data/Raises',
        parentId: 15,
        value: "budgetVersions/StaffingData/Raises",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },
    {
        id: 21,
        name: 'Wage Rate',
        fullName: 'Budget Versions/Staffing data/Wage Rate',
        parentId: 15,
        value: "budgetVersions/StaffingData/WagRate",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },
    {
        id: 22,
        name: 'Statistic to Department',
        fullName: 'Mapping/Statistic to Department',
        parentId: 6,
        value: 'Mapping/StatisticToDepartment',
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },
    {
        id: 23,
        name: 'Job Code & Pay Type to GL Account',
        fullName: 'Mapping/Job Code & Pay Type to GL Account',
        parentId: 6,
        value: "Mapping/JobCode&PayTypetoGLAccount",
        actionsPermission: [
            {
                id: 0,
                value: false,
                name: 'View'
            },
            {
                id: 1,
                value: false,
                name: 'Edit'
            },
            {
                id: 2,
                value: false,
                name: 'Delete'
            },
        ]
    },
    {
        id: 24,
        name: 'System Settings',
        fullName: 'systemSettings',
        parentId: null,
        value: "systemSettings",
    },
    {
        id: 25,
        name: 'Add System Settings',
        fullName: 'Add System Settings',
        parentId: null,
        value: "addSystemSettings",
    },
    {
        id: 26,
        name: 'Background Jobs',
        fullName: 'Background Jobs',
        parentId: null,
        value: "backgroundJobs",
    },
    {
        id: 27,
        name: 'User Setup',
        fullName: 'User Setup',
        parentId: null,
        value: "userSetup",
    },
    {   
        id: 28,
        name: 'Role Setup',
        fullName: 'systemSettings',
        parentId: null,
        value: "roleSetup",
    }
]


// const obj = {
//     "roleProfile": {
//         "identityAppRoleID": 0,
//         "name": "xyz name",
//         "description": "abc description",
//     },
//     "allUserRoles": [
//         {
//             "identityAppRoleUserID": {
//                 "userID": {
//                     "userProfileID": 0,
//                 },
//                 "appRoleID": {
//                     "identityAppRoleID": 0
//                 },
//             },
//         },
//     ],
//     "allRoleScreens": [{
//         "screenID": {
//             "identityScreenID": {
//                 "identityScreenID": 1,
//             },
//         },
//         "appRoleID": {
//             "identityAppRoleID": 0,
//         },
//     },
// ],
//     "allRoleScreenOperations": [
//         {
//             "value": "false",
//             "screenOperationID": {
//                 "identityScreenOperationID": 1,
//             },
//             "identityOperation": {
//                 "identityOperationID": 1,
//             },
//         },
//     ],
// }


const obj = {
    "roleProfile": {
        "identityAppRoleID": 0,
        "name": "xyz name",
        "description": "abc description"
    },
    "allUserRoles": [
        {
            // "identityAppRoleUserID": {
            "userID": {
                "userProfileID": 0
            },
            "appRoleID": {
                "identityAppRoleID": 0
            }
            // }
        }
    ],
    "allRoleScreens": [{
        "screenID": {
            "identityScreenID": {
                "identityScreenID": 1
            }
        },
        "appRoleID": {
            "identityAppRoleID": 0
        }
    }
    ],
    "allRoleScreenOperations": [
        {
            "value": "false",
            "screenOperationID": {
                "identityScreenOperationID": 1
            },
            "identityOperation": {
                "identityOperationID": 1
            }
        }
    ]
}



const a = {
    "roleProfile": {
        "identityAppRoleID": 0,
        "name": "Role 1",
        "description": "Role 1 description",
        "isActive": true,
        "isDeleted": false
    },
    "allUserRoles": [
        {

            "userID": {
                "userProfileID": 1
            },
            "appRoleID": {
                "identityAppRoleID": 0
            }
            ,
            "isActive": true,
            "isDeleted": false
        }

    ],
    "allRoleScreens": [{
        "screenID": {

            "identityScreenID": 1

        },
        "appRoleID": {
            "identityAppRoleID": 0
        }
        ,
        "isActive": true,
        "isDeleted": false
    }
    ],
    "allRoleScreenOperations": [
        {
            "value": "false",
            "screenOperationID": {
                "identityScreenOperationID": 1
            },
            "identityOperation": {
                "identityOperationID": 1
            }, "appRoleID": {
                "identityAppRoleID": 0
            }
            ,
            "isActive": true,
            "isDeleted": false
        }
    ]
}



// 
// { "roleProfile": { "identityAppRoleID": 0, "name": "Role 2", "description": "role des", "isActive": true, "isDeleted": false }, "allUserRoles": [{ "userID": { "userProfileID": 3018 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "userID": { "userProfileID": 3017 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }], "allRoleScreens": [{ "screenID": { "identityScreenID": 2002 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "screenID": { "identityScreenID": 2004 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }], "allRoleScreenOperations": [{ "value": "false", "screenOperationID": { "identityScreenOperationID": 2002 }, "identityOperation": { "identityOperationID": 1002 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "value": "false", "screenOperationID": { "identityScreenOperationID": 2002 }, "identityOperation": { "identityOperationID": 1 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "value": "false", "screenOperationID": { "identityScreenOperationID": 2002 }, "identityOperation": { "identityOperationID": 1003 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "value": "false", "screenOperationID": { "identityScreenOperationID": 2002 }, "identityOperation": { "identityOperationID": 1004 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "value": "false", "screenOperationID": { "identityScreenOperationID": 2002 }, "identityOperation": { "identityOperationID": 1005 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "value": "false", "screenOperationID": { "identityScreenOperationID": 2002 }, "identityOperation": { "identityOperationID": 1006 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "value": "false", "screenOperationID": { "identityScreenOperationID": 2002 }, "identityOperation": { "identityOperationID": 1007 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "value": "false", "screenOperationID": { "identityScreenOperationID": 2004 }, "identityOperation": { "identityOperationID": 1002 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "value": "false", "screenOperationID": { "identityScreenOperationID": 2004 }, "identityOperation": { "identityOperationID": 2 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }, { "value": "false", "screenOperationID": { "identityScreenOperationID": 2004 }, "identityOperation": { "identityOperationID": 1006 }, "appRoleID": { "identityAppRoleID": 0 }, "isActive": true, "isDeleted": false }] }



// {
//     "roleProfile": {
//       "identityAppRoleID": 2012,
//       "code": null,
//       "name": "role 7",
//       "description": "des...",
//     },
//     "allUserRoles": [
//       {
//         "identityAppRoleUserID": 2007,
//         "userID": {
//           "userProfileID": 3017,
//         },
//       }
//     ],
//     "allRoleScreens": [
//       {
//         "identityAppRoleScreenID": 2006,
//         "screenID": {
//           "identityScreenID": 2002,
//           "code": "Budget Versions List",
//           "name": "Budget Versions List",
//           "description": "Budget Versions List",
//         },
//       }
//     ],
//     "allRoleScreenOperations": [
//       {
//         "identityAppRoleScreenOperationID": 2012,
//         "code": null,
//         "name": null,
//         "value": "true",
//         "description": null,
//         "screenOperationID": null,
//       },
//       {
//         "identityAppRoleScreenOperationID": 2013,
//         "code": null,
//         "name": null,
//         "value": "true",
//         "description": null,
//         "screenOperationID": null,
//         "appRoleID": {
//           "identityAppRoleID": 2012,
//           "code": null,
//           "name": "role 7",
//           "value": null,
//           "description": "des...",
//           "creationDate": "2021-02-01T10:53:48.482",
//           "updatedDate": "2021-02-01T10:53:48.482",
//           "createdBy": null,
//           "updateBy": null,
//           "isActive": true,
//           "isDeleted": false,
//           "rowVersion": null,
//           "identifier": null
//         },
//         "userID": null,
//         "creationDate": null,
//         "updatedDate": null,
//         "createdBy": null,
//         "updateBy": null,
//         "isActive": true,
//         "isDeleted": false,
//         "rowVersion": null,
//         "identifier": null
//       },
//       {
//         "identityAppRoleScreenOperationID": 2014,
//         "code": null,
//         "name": null,
//         "value": "true",
//         "description": null,
//         "screenOperationID": null,
//         "appRoleID": {
//           "identityAppRoleID": 2012,
//           "code": null,
//           "name": "role 7",
//           "value": null,
//           "description": "des...",
//           "creationDate": "2021-02-01T10:53:48.482",
//           "updatedDate": "2021-02-01T10:53:48.482",
//           "createdBy": null,
//           "updateBy": null,
//           "isActive": true,
//           "isDeleted": false,
//           "rowVersion": null,
//           "identifier": null
//         },
//         "userID": null,
//         "creationDate": null,
//         "updatedDate": null,
//         "createdBy": null,
//         "updateBy": null,
//         "isActive": true,
//         "isDeleted": false,
//         "rowVersion": null,
//         "identifier": null
//       },
//       {
//         "identityAppRoleScreenOperationID": 2015,
//         "code": null,
//         "name": null,
//         "value": "true",
//         "description": null,
//         "screenOperationID": null,
//         "appRoleID": {
//           "identityAppRoleID": 2012,
//           "code": null,
//           "name": "role 7",
//           "value": null,
//           "description": "des...",
//           "creationDate": "2021-02-01T10:53:48.482",
//           "updatedDate": "2021-02-01T10:53:48.482",
//           "createdBy": null,
//           "updateBy": null,
//           "isActive": true,
//           "isDeleted": false,
//           "rowVersion": null,
//           "identifier": null
//         },
//         "userID": null,
//         "creationDate": null,
//         "updatedDate": null,
//         "createdBy": null,
//         "updateBy": null,
//         "isActive": true,
//         "isDeleted": false,
//         "rowVersion": null,
//         "identifier": null
//       },
//       {
//         "identityAppRoleScreenOperationID": 2016,
//         "code": null,
//         "name": null,
//         "value": "true",
//         "description": null,
//         "screenOperationID": null,
//         "appRoleID": {
//           "identityAppRoleID": 2012,
//           "code": null,
//           "name": "role 7",
//           "value": null,
//           "description": "des...",
//           "creationDate": "2021-02-01T10:53:48.482",
//           "updatedDate": "2021-02-01T10:53:48.482",
//           "createdBy": null,
//           "updateBy": null,
//           "isActive": true,
//           "isDeleted": false,
//           "rowVersion": null,
//           "identifier": null
//         },
//         "userID": null,
//         "creationDate": null,
//         "updatedDate": null,
//         "createdBy": null,
//         "updateBy": null,
//         "isActive": true,
//         "isDeleted": false,
//         "rowVersion": null,
//         "identifier": null
//       },
//       {
//         "identityAppRoleScreenOperationID": 2017,
//         "code": null,
//         "name": null,
//         "value": "true",
//         "description": null,
//         "screenOperationID": null,
//         "appRoleID": {
//           "identityAppRoleID": 2012,
//           "code": null,
//           "name": "role 7",
//           "value": null,
//           "description": "des...",
//           "creationDate": "2021-02-01T10:53:48.482",
//           "updatedDate": "2021-02-01T10:53:48.482",
//           "createdBy": null,
//           "updateBy": null,
//           "isActive": true,
//           "isDeleted": false,
//           "rowVersion": null,
//           "identifier": null
//         },
//         "userID": null,
//         "creationDate": null,
//         "updatedDate": null,
//         "createdBy": null,
//         "updateBy": null,
//         "isActive": true,
//         "isDeleted": false,
//         "rowVersion": null,
//         "identifier": null
//       },
//       {
//         "identityAppRoleScreenOperationID": 2018,
//         "code": null,
//         "name": null,
//         "value": "true",
//         "description": null,
//         "screenOperationID": null,
//         "appRoleID": {
//           "identityAppRoleID": 2012,
//           "code": null,
//           "name": "role 7",
//           "value": null,
//           "description": "des...",
//           "creationDate": "2021-02-01T10:53:48.482",
//           "updatedDate": "2021-02-01T10:53:48.482",
//           "createdBy": null,
//           "updateBy": null,
//           "isActive": true,
//           "isDeleted": false,
//           "rowVersion": null,
//           "identifier": null
//         },
//         "userID": null,
//         "creationDate": null,
//         "updatedDate": null,
//         "createdBy": null,
//         "updateBy": null,
//         "isActive": true,
//         "isDeleted": false,
//         "rowVersion": null,
//         "identifier": null
//       }
//     ]
//   }