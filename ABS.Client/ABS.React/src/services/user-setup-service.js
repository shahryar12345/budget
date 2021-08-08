import getURL from './api/apiList';
import { makeApiRequest } from './api';

export const GetAllUsers = () => {
    return new Promise((resolve) => {
        makeApiRequest('get', getURL('USERS')).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            console.log('Error occured while getting')
            resolve([]);
        });
    })
}

export const createUser = (params) => {
    return new Promise((resolve) => {
        makeApiRequest('post', getURL('USERS'), params).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            console.log('Error occured while getting')
            resolve([]);
        });
    })
}
export const updateUser = (params) => {
    return new Promise((resolve) => {
        makeApiRequest('put', `${getURL('USERS')}/${params.userProfileID}`, params).then((response) => {
            resolve(params.userProfileID);
        }).catch((err) => {
            console.log('Error occured while getting')
            resolve([]);
        });
    })
}

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

// GETROLESWITHMENIITEMS
export const getRolesWithMenuItems = () => {
    return new Promise((resolve) => {
        makeApiRequest('get', `${getURL(`GETROLESWITHMENIITEMS`)}`).then((response) => {
            resolve(response);
        }).catch((err) => {
            console.log('Error occured while getting...', err);
            resolve([]);
        });
    })
}

export const createUpdateUsers = (params) => {
    return new Promise((resolve, reject) => {
        makeApiRequest('post', `${getURL(`CREATE/UPDATE-USERS`)}`, params).then((response) => {
            resolve(response);
        }).catch((err) => {
            console.log('Error occured while getting...', err);
            reject('error');
        });
    })
}

export const getDetailsOfUser = (params) => {
    return new Promise((resolve) => {
        makeApiRequest('get', `${getURL(`USERDETAILS`)}?UserObj=${params}`).then((response) => {
            if (response?.data?.userProfile) {
                response = {
                    ...response.data,
                    userProfile:
                    {
                        ...response.data.userProfile,
                        userDepartments: response.data.userProfile.userDepartments ? JSON.parse(response.data.userProfile.userDepartments) : "",
                        userStatisticCodes: response.data.userProfile.userStatisticCodes ? JSON.parse(response.data.userProfile.userStatisticCodes) : "",
                        userJobCodes: response.data.userProfile.userJobCodes ? JSON.parse(response.data.userProfile.userJobCodes) : "",
                        userPayTypes: response.data.userProfile.userPayTypes ? JSON.parse(response.data.userProfile.userPayTypes) : "",
                        userGLAccounts: response.data.userProfile.userGLAccounts ? JSON.parse(response.data.userProfile.userGLAccounts) : "",
                    },
                    allUserRoles: response.data.allUserRoles.map(data => data?.appRoleID?.identityAppRoleID),
                    allRoleEntities: response.data.allRoleEntities.map(data => data?.entityID?.entityID),
                    allRoleDepartments: response.data.allRoleDepartments.filter(data => data?.value === "true").map(data => ({ departmentID: data?.departmentID?.departmentID, departmentName: data?.departmentID?.departmentName, departmentCode: data?.departmentID?.departmentName })),
                    allRoleGLAccounts: response.data.allRoleGLAccounts.filter(data => data?.value === "true").map(data => ({ glAccountID: data?.glAccountsID?.glAccountID, glAccountName: data?.glAccountsID?.glAccountName, glAccountCode: data?.glAccountsID?.glAccountCode })),
                    allRoleJobCodes: response.data.allRoleJobCodes.filter(data => data?.value === "true").map(data => ({ jobCodeID: data?.jobCodesID?.jobCodeID, jobCodeName: data?.jobCodesID?.jobCodeName, jobCodeCode: data?.jobCodesID?.jobCodeCode })),
                    allRolePayTypes: response.data.allRolePayTypes.filter(data => data?.value === "true").map(data => ({ payTypeID: data?.payTypesID?.payTypeID, payTypeName: data?.payTypesID?.payTypeName, payTypeCode: data?.payTypesID?.payTypeCode })),
                    allRoleStatisticCodes: response.data.allRoleStatisticCodes.filter(data => data?.value === "true").map(data => ({ statisticsCodeID: data?.statsCodeID?.statisticsCodeID, statisticsCodeName: data?.statsCodeID?.statisticsCodeName, statisticsCode: data?.statsCodeID?.statisticsCode })),
                }
                resolve(response)
            }
            // console.log({ response })
            resolve(response.data);
        }).catch((err) => {
            console.log('Error occured while getting...', err);
            resolve([]);
        });
    })
}

export const getUserDetails = (params) => {
    return new Promise((resolve) => {
        makeApiRequest('get', `${getURL(`GETUSERDETAILS`)}?UserObj=${params}`).then((response) => {
            response = { ...response.data, MenuItemsList: response.data.MenuItemsList ? JSON.parse(response.data.MenuItemsList) : [] }
            if (response.MenuItemsList.length && response.MenuItemsList[0].roleScreens.length) {
                response.MenuItemsList = response.MenuItemsList[0].roleScreens
            }
            resolve(response);
        }).catch((err) => {
            console.log('Error occured while getting...', err);
            resolve([]);
        });
    })
}

const obj = {
    "userProfile": {
        "userProfileID": 0,
        "firstName": "string",
        "middleName": "string",
        "lastName": "string",
        "initials": "string",
        "jobFunction": "string",
        "dob": "2021-02-09T10:34:58.864Z",
        "isLDAPUser": true,
        "contactNumber": "string",
        "address": "string",
        "username": "string",
        "userPassword": "string",
        "creationDate": "2021-02-09T10:34:58.864Z",
        "updatedDate": "2021-02-09T10:34:58.864Z",
    },
    allUserRoles: [
        {
            identityAppRoleUserID: 0,
            userID: {
                userProfileID: 0,
            }
        }
    ],
    allRoleDepartments: [
        {
            departmentID: {
                departmentID: 0
            }
        }
    ],
    allRoleEntities: [
        {
            entityID: {
                entityID: 0
            }
        }
    ],
    allRoleStatisticCodes: [
        {
            statsCodeID: {
                statisticsCodeID: 0
            }
        }
    ],
    allRoleGLAccounts: [
        {
            glAccountsID: {
                glAccountID: 0
            }
        }
    ],
    allRolePayTypes: [
        {
            payTypesID: {
                payTypeID: 0
            }
        }
    ],
    allRoleJobCodes: [
        {
            jobCodesID: {
                jobCodeID: 0
            }
        }
    ],
}
