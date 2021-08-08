export const allMenuItemsList = [
    {
        id: 0,
        name: 'Budget Versions List',
        parentId: null,
        value: "budgetVersionsList",
        actionsPermission: [
            {
                id: 0,
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Add'
            },
            {
                id: 2,
                value: "true",
                name: 'Open'
            },
            {
                id: 3,
                value: "true",
                name: 'Copy'
            },
            {
                id: 4,
                value: "true",
                name: 'Rename'
            },
            {
                id: 5,
                value: "true",
                name: 'Delete'
            },
            {
                id: 6,
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Add'
            },
            {
                id: 2,
                value: "true",
                name: 'Edit'
            },
            {
                id: 3,
                value: "true",
                name: 'Copy'
            },
            {
                id: 4,
                value: "true",
                name: 'Rename'
            },
            {
                id: 5,
                value: "true",
                name: 'Delete'
            },
            {
                id: 6,
                value: "true",
                name: 'Update'
            },
            {
                id: 7,
                value: "true",
                name: 'Export'
            },
            {
                id: 8,
                value: "true",
                name: 'Run'
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
                name: 'Delete'
            },
            {
                id: 3,
                value: "true",
                name: 'Add'
            }
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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
                value: "true",
                name: 'View'
            },
            {
                id: 1,
                value: "true",
                name: 'Edit'
            },
            {
                id: 2,
                value: "true",
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