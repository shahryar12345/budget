
import { Calculator16, Settings24, ChartBar16, TableSplit16, Purchase16, Help24, Search24, Favorite16, Map16, Task32, Logout32 } from '@carbon/icons-react';

export const allSideMenuItems = [
    {
        name: 'Budget versions',
        path: '/BudgetVersions',
        // onClick: () => { history.push('/BudgetVersions') },
        renderIcon: ChartBar16,
        value: "budgetVersionsList"
    },
    {
        name: 'Reports',
        path: '/Reports',
        // onClick: () => { history.push('/Reports') },
        renderIcon: Purchase16,
        value: 'reports',
    },
    {
        name: 'Structure tables',
        path: TableSplit16,
        // onClick: () => { history.push('/BudgetVersions') },
        renderIcon: TableSplit16,
        value: 'structureTables' ,

    },
    {
        name: 'FTE divisors',
        path: '/FteDivisors',
        // onClick: () => { history.push('/FteDivisors') },
        renderIcon: Calculator16,
        value: 'FTEDivisors',

    },
    {
        name: 'Pay type distributions',
        path: '/PayTypeDistribution',
        // onClick: () => { history.push('/PayTypeDistribution') },
        renderIcon: Calculator16,
        value: 'defaultPayTypeDistributions',

    },
    {
        name: 'Mappings',
        path: '/Mapping',
        // onClick: () => { history.push('/Mapping') },
        renderIcon: Map16,
        value: 'mappings',

    },
    {
        name: 'Background jobs',
        path: '/Backgroundjobs',
        // onClick: () => { history.push('/Backgroundjobs') },
        renderIcon: Task32,
        value: 'backgroundJobs',


    },
    {
        name: 'User setup',
        path: '/UserSetup',
        // onClick: () => { history.push('/UserSetup') },
        renderIcon: Task32,
        value: 'userSetup',

    },
    {
        name: 'Role setup',
        path: '/RoleSetup',
        // onClick: () => { history.push('/RoleSetup') },
        renderIcon: Task32,
        value: 'roleSetup',

    },
]