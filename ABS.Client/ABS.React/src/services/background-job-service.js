import getURL from './api/apiList';
import { makeApiRequest } from './api';

export const GetAllBackgroundJobs = () => {
    return new Promise((resolve) => {
        makeApiRequest('get', getURL('ALLBACKGROUNDJOBS')).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            console.log('Error occured while getting background jobs')
            resolve([]);
        });
    })
}