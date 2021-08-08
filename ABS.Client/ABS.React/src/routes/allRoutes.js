import AddSystemSettings from '../components/content-pages/SystemSettings/AddSystemSettings';
import Disclaimer from '../components/content-pages/Disclaimer';
import BudgetVersions from '../components/content-pages/BudgetVersions';
import BudgetVersionForm from '../components/content-pages/BudgetVersions/budget-version-form';
import RenameBudgetVersions from '../components/content-pages/BudgetVersions/RenameBudgetVersions';
import Forecast from '../components/content-pages/Forecast';
import FteDivisors from '../components/content-pages/FteDivisors';
import Mapping from '../components/content-pages/Mapping';
import Inflation from '../components/content-pages/Inflation';
import Raises from '../components/content-pages/Raises/raises';
import PayTypeDistribution from '../components/content-pages/PayTypeDistribution';
import PayTypeDistributionForm from '../components/content-pages/PayTypeDistribution/pay-type-distribution-form';
import ManualWageRate from '../components/content-pages/ManualWageRate';
import SystemSettings from '../components/content-pages/SystemSettings';
import Backgroundjob from '../components/content-pages/BackgroundJob';
import UserSetup from '../components/content-pages/Admin/UserSetup/userSetup';
import RoleSetup from '../components/content-pages/Admin/RoleSetup';
import Reports from '../components/content-pages/Reports';
import ReportForm from '../components/content-pages/Reports/report-form';

export const allRoutes = [
    {
        path: '/systemSettings',
        component: SystemSettings,
        value: ['systemSettings']
    },
    {
        path: '/AddSystemSettings',
        component: AddSystemSettings,
        value: ['addSystemSettings']
    },
    {
        path: '/BudgetVersions',
        component: BudgetVersions,
        value: ['budgetVersionsList']
    },
    {
        path: '/BudgetVersion/:id',
        component: BudgetVersionForm,
        value: [
            'budgetVersion',
            'budgetVersions/StatisticData',
            'budgetVersions/StatisticData/ShowData',
            'budgetVersions/StatisticData/AddRow',
            'budgetVersions/StatisticData/Forecasting',
            'budgetVersions/GeneralLedger',
            'budgetVersions/GeneralLedger/ShowData',
            'budgetVersions/GeneralLedger/AddRow',
            'budgetVersions/GeneralLedger/Forecast',
            'budgetVersions/GeneralLedger/Inflation',
            'budgetVersions/staffingData',
            'budgetVersions/StaffingData/ShowData',
            'budgetVersions/StaffingData/AddRow',
            'budgetVersions/StaffingData/Forecast',
            'budgetVersions/StaffingData/Raises',
            'budgetVersions/StaffingData/WagRate',
        ]
    },
    {
        path: '/AddBudgetVersions',
        component: BudgetVersionForm,
        value: '/AddBudgetVersions'
    },
    {
        path: '/RenameBudgetVersions',
        component: RenameBudgetVersions,
        value: '/RenameBudgetVersions'
    },
    {
        path: '/Forecast/:id',
        component: Forecast,
        value: ['budgetVersions/StatisticData/Forecasting',
            'budgetVersions/GeneralLedger/Forecast',
            'budgetVersions/StaffingData/Forecast'
        ]
    },
    {
        path: '/FteDivisors',
        component: FteDivisors,
        value: ['FTEDivisors']
    },
    {
        path: '/Mapping',
        component: Mapping,
        value: ['mappings', 'Mapping/JobCode&PayTypetoGLAccount']
    },
    {
        path: '/Inflation/:id',
        component: Inflation,
        value: ['budgetVersions/GeneralLedger/Inflation']
    },
    {
        path: '/Raises/:id',
        component: Raises,
        value: ['budgetVersions/StaffingData/Raises']
    },
    {
        path: '/PayTypeDistribution',
        component: PayTypeDistribution,
        value: ['defaultPayTypeDistributions']
    },
    {
        path: '/AddPayTypeDistribution',
        component: PayTypeDistributionForm,
        value: '/AddPayTypeDistribution'
    },
    {
        path: '/EditPayTypeDistribution/:id',
        component: PayTypeDistributionForm,
        value: '/EditPayTypeDistribution/:id'
    },
    {
        path: '/ManualWageRate/:id',
        component: ManualWageRate,
        value: ['budgetVersions/StaffingData/WagRate']
    },
    {
        path: '/Backgroundjobs',
        component: Backgroundjob,
        value: ['backgroundJobs']
    },
    {
        path: '/UserSetup',
        component: UserSetup,
        value: ['userSetup']
    },
    {
        path: '/RoleSetup',
        component: RoleSetup,
        value: ['roleSetup']
    },
    {
        path: '/Reports',
        component: Reports,
        value: ['reports']
    },
    {
        path: '/StructureTables',
        component: FteDivisors,
        value: ['structureTables']
    },
    {
        path: '/AddReport',
        component: ReportForm,
        value: '/AddReport'
    },
    {
        path: "/Report/:id",
        component: ReportForm,
        value: '/Report/:id'
    },

]