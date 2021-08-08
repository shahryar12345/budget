import { ENV } from "../../components";
import { allMenuItemsList } from "../localData/allMenuItemsList";
import { SAVE_USER_DETAILS } from "../_actions/action-types";

const initialState = {
    UserProfile: {},
    actionsPermissionBasedRoutes: [
        {
            name: "Add",
            path: '/AddBudgetVersions',
            value: false,
            parentRoute: "budgetVersionsList"
        },
        {
            name: "Rename",
            path: '/RenameBudgetVersions',
            value: false,
            parentRoute: "budgetVersionsList"
        },
        {
            name: "Add",
            path: '/AddPayTypeDistribution',
            value: false,
            parentRoute: "defaultPayTypeDistributions"
        },
        {
            name: "Edit",
            path: '/EditPayTypeDistribution/:id',
            value: false,
            parentRoute: "defaultPayTypeDistributions"
        },
        {
            name: "Add",
            path: '/AddReport',
            value: false,
            parentRoute: "reports"
        },
        {
            name: "Edit",
            path: '/Report/:id',
            value: false,
            parentRoute: "reports"
        }
    ],
    MenuItemsList: ENV !== 'DEMO' ? [] : allMenuItemsList,
    budgetVersionsListAP: {
        View: false,
        Add: false,
        Open: false,
        Copy: false,
        Rename: false,
        Delete: false,
        Calculate: false
    },
    budgetVersionAP: {
        StatisticData: {
            Add: false,
            View: false,
            Edit: false,
            Delete: false,
            Forecast: false
        },
        GeneralLedger: {
            Add: false,
            View: false,
            Edit: false,
            Delete: false,
            Forecast: false,
            Inflation: false
        },
        StaffingData: {
            Add: false,
            View: false,
            Edit: false,
            Delete: false,
            Forecast: false,
            Raises: false,
            Wage: false
        },
    },
    defaultPayTypeDistributionsAP: {
        View: false,
        Add: false,
        Edit: false,
        Delete: false
    },
    mappingsAP: {
        MappingStatisticToDepartmentAP: {
            View: false,
            Edit: false,
            Delete: false
        },
        MappingJobCodePayTypetoGLAccountAP: {
            View: false,
            Edit: false,
            Delete: false
        }
    },
    FTEDivisorsAP: {
        View: false,
        Edit: false,
        Delete: false
    },
    reportsAP: {
        View: false,
        Add: false,
        Edit: false,
        Copy: false,
        Rename: false,
        Run: false,
        Delete: false,
        Update: false,
        Export: false,
    }
};

const UserDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USER_DETAILS:
            if (ENV !== 'DEMO') {
                return {
                    ...state,
                    MenuItemsList: action.payload.MenuItemsList,
                    actionsPermissionBasedRoutes: state.actionsPermissionBasedRoutes.map(data => isActionsPermissionBasedRouteActive(data, action?.payload?.MenuItemsList ? action?.payload?.MenuItemsList : [])),
                    UserProfile: action.payload.UserID,
                    budgetVersionsListAP: getActionForScreen('budgetVersionsList', state.budgetVersionsListAP, action?.payload?.MenuItemsList ? action?.payload?.MenuItemsList : []),
                    budgetVersionAP: getActionForScreenWithDiffScenarios('budgetVersions', state.budgetVersionAP, action?.payload?.MenuItemsList ? action?.payload?.MenuItemsList : []),
                    defaultPayTypeDistributionsAP: getActionForScreen('defaultPayTypeDistributions', state.defaultPayTypeDistributionsAP, action?.payload?.MenuItemsList ? action?.payload?.MenuItemsList : []),
                    mappingsAP: {
                        ...state.mappingsAP,
                        MappingStatisticToDepartmentAP: getActionForScreen('Mapping/StatisticToDepartment', state.mappingsAP.MappingStatisticToDepartmentAP, action?.payload?.MenuItemsList ? action?.payload?.MenuItemsList : []),
                        MappingJobCodePayTypetoGLAccountAP: getActionForScreen('Mapping/JobCode&PayTypetoGLAccount', state.mappingsAP.MappingJobCodePayTypetoGLAccountAP, action?.payload?.MenuItemsList ? action?.payload?.MenuItemsList : []),
                    },
                    FTEDivisorsAP: getActionForScreen('FTEDivisors', state.FTEDivisorsAP, action?.payload?.MenuItemsList ? action?.payload?.MenuItemsList : []),
                    reportsAP: getActionForScreen('reports', state.reportsAP, action?.payload?.MenuItemsList ? action?.payload?.MenuItemsList : [])
                };
            }
            return {
                ...state,
                actionsPermissionBasedRoutes: state.actionsPermissionBasedRoutes.map(data => isActionsPermissionBasedRouteActive(data, state.MenuItemsList)),
                UserProfile: action?.payload?.UserID ? action.payload.UserID : {},
                budgetVersionsListAP: getActionForScreen('budgetVersionsList', state.budgetVersionsListAP, state.MenuItemsList),
                budgetVersionAP: getActionForScreenWithDiffScenarios('budgetVersions', state.budgetVersionAP, state.MenuItemsList),
                defaultPayTypeDistributionsAP: getActionForScreen('defaultPayTypeDistributions', state.defaultPayTypeDistributionsAP, state.MenuItemsList),
                mappingsAP: {
                    ...state.mappingsAP,
                    MappingStatisticToDepartmentAP: getActionForScreen('Mapping/StatisticToDepartment', state.mappingsAP.MappingStatisticToDepartmentAP, state.MenuItemsList),
                    MappingJobCodePayTypetoGLAccountAP: getActionForScreen('Mapping/JobCode&PayTypetoGLAccount', state.mappingsAP.MappingJobCodePayTypetoGLAccountAP, state.MenuItemsList),
                },
                FTEDivisorsAP: getActionForScreen('FTEDivisors', state.FTEDivisorsAP, state.MenuItemsList),
                reportsAP: getActionForScreen('reports', state.reportsAP, state.MenuItemsList)
            };
        default:
            return state;
    }
};

export default UserDetailsReducer;

const isActionsPermissionBasedRouteActive = (route, userMenuItemsList) => {
    if (userMenuItemsList.length) {
        for (let mi of userMenuItemsList) {
            if (mi.value === route.parentRoute) {
                if (mi.actionsPermission.length) {
                    for (let ac of mi.actionsPermission) {
                        if (ac.name === route.name && ac.value === 'true') {
                            return { ...route, value: true }
                        }
                    }
                }
                return { ...route }
            }
        }
    }
    return { ...route }
}

const getActionForScreen = (screenKey, screenAP, userMenuItemsList) => {
    userMenuItemsList.forEach(data => {
        if (data.value === screenKey) {
            Object.keys(screenAP).map(function (key, index) {
                const obj = data.actionsPermission.find(ac => ac.name === key)
                if (obj && obj?.value && obj.value === "true") {
                    screenAP[key] = true
                }
            });
        }
    })
    return screenAP;
}

const getActionForScreenWithDiffScenarios = (subKey, screenAP, userMenuItemsList) => {
    Object.keys(screenAP).map(function (key, index) {
        const specificScenarioAP = userMenuItemsList.filter(data => data?.value?.includes(`${subKey}/${key}`));
        Object.keys(screenAP[key]).map(function (innerKey2, innerIndex) {
            specificScenarioAP.forEach(data => {
                if (data?.name?.includes(innerKey2)) {
                    data.actionsPermission.forEach(dt => {
                        if (dt?.value === "true") {
                            screenAP[key][innerKey2] = true
                        }
                    })
                }
                else if ((innerKey2 === 'View' || innerKey2 === 'Edit' || innerKey2 === 'Delete') && data?.name === "Show data") {
                    data.actionsPermission.forEach(dt => {
                        if (innerKey2 === dt?.name && dt?.value === "true") {
                            screenAP[key][innerKey2] = true
                        }
                    })

                }
            })
        })
    })
    return screenAP
}


// structureTables
// FTEDivisors
// defaultPayTypeDistributions
// mappings
// budgetVersions/StatisticData
// budgetVersions/StatisticData/ShowData
// budgetVersions/StatisticData/AddRow
// budgetVersions/StatisticData/Forecasting
// budgetVersions/GeneralLedger
// budgetVersions/GeneralLedger/ShowData
// budgetVersions/GeneralLedger/AddRow
// budgetVersions/GeneralLedger/Forecast
// budgetVersions/GeneralLedger/Inflation
// budgetVersions/StaffingData/ShowData
// budgetVersions/StaffingData/AddRow
// budgetVersions/StaffingData/Forecast
// budgetVersions/StaffingData/Raises
// budgetVersions/StaffingData/WagRate
// Mapping/StatisticToDepartment
// Mapping/JobCode&PayTypetoGLAccount




