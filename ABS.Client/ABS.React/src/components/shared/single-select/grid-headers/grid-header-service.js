import { departmentHeaders } from './department-grid-headers';
import { entityHeaders } from './entity-grid-headers';
import { statisticsHeaders } from './statistics-grid-headers';
import { budgetVersionHeaders } from './budget-version-grid-headers';
import { glAccountsHeaders } from './glaccount-grid-headers'
import { jobCodeHeaders } from './job-code-grid-headers'
import { payTypeHeaders } from './pay-type-grid-headers'

export const getHeaders = (name) => {

    switch (name) {
        case 'Department':
            return departmentHeaders;
        case 'Entity':
            return entityHeaders;
        case 'Statistics':
            return statisticsHeaders;
        case 'Budget version':
            return budgetVersionHeaders;
        case 'GLAccounts':
            return glAccountsHeaders;
        case 'GL Account':
            return glAccountsHeaders
        case 'jobCode':
            return jobCodeHeaders;
        case 'payType':
            return payTypeHeaders;
        default:
            return;
    }
}