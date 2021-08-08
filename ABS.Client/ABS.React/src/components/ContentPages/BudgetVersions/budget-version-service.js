import axios from 'axios';
import { makeApiRequest } from '../../../services/api';
import getURL from '../../../services/api/apiList';
import { rows } from '../../../services/statistics-table.data';


export const GetBudgetVersionCodes = () => {
    return new Promise((resolve) => {
        // axios.get(getURL('BUDGETVERSIONCODES')).then((response) => {
        makeApiRequest('get', getURL('BUDGETVERSIONCODES')).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            console.log('Error occured while getting budget version codes')
            resolve([]);
        });
    })
}

export const SaveBudgetVersion = (budgetVersion) => {
    return new Promise((resolve) => {
        // axios.post(getURL('BUDGETVERSIONS'), budgetVersion).then((response) => {
        makeApiRequest('post', getURL('BUDGETVERSIONS'), budgetVersion).then((response) => {
        resolve({
                success: response.data.status == 'failed' ? false : true,
                message: response.data.status == 'failed' ? 'Budget version already exists.' : 'Budget version saved.'
            })
        }).catch((err) => {
            console.log('Error occured while saving budget version')
            resolve({
                success: false,
                message: 'Budget version already exists!'
            })
        });
    })
}

export const GetBudgetVersion = (budgetVersionId) => {
    return new Promise((resolve) => {
        // axios.get(getURL('BUDGETVERSIONS') + '/' + budgetVersionId).then((response) => {
            makeApiRequest('get',getURL('BUDGETVERSIONS') + '/' + budgetVersionId).then((response) => {
            resolve({
                success: response.status == 200 ? true : false,
                data: response.data
            })
        }).catch((err) => {
            resolve({
                success: false,
            })
        });
    })
}

export const UpdateBudgetVersion = (budgetVersion) => {
    return new Promise((resolve) => {
        // axios.post(getURL('BUDGETVERSIONS'), budgetVersion).then((response) => {
            makeApiRequest('get', getURL('BUDGETVERSIONS'), budgetVersion).then((response) => {
            resolve({
                success: true,
                message: 'Budget version updated.'
            })
        }).catch((err) => {
            console.log('Error occured while saving budget version')
            resolve({
                success: false,
                message: 'Budget version already exists!'
            })
        });
    })
}

export const GetStatsTableDataFromADS = (adsTableLink, budgetVersionType, budgetversionId) => {
    return new Promise((resolve) => {
        //todo: update after ADS integration
        if (budgetVersionType === 'Forecast') {
            if (budgetversionId && budgetversionId > 60) resolve(rows);
            else resolve([{}, {}, {}, {}, {}, {}])
        }
        else {
            if (adsTableLink) resolve(rows)
            else resolve([{}, {}, {}, {}, {}, {}]);
        }
    })
}

