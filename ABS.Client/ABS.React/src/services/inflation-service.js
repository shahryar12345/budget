import axios from 'axios';
import { makeApiRequest } from './api';
import getURL from './api/apiList';

export const PostInflation = (inflation) => {
  return new Promise((resolve) => {
    // axios.post(getURL('INFLATION'), inflation).then((response) => {
      makeApiRequest('post', getURL('INFLATION'), inflation).then((response) => {
      resolve({
        success: response.data.status === 'failed' ? false : true,
        message: response.data.status === 'failed' ? 'Inflation already exists!' : 'Inflation saved.'
      })
    }).catch((err) => {
      console.log('Error occured while saving inflation')
      resolve({
        success: false,
        message: 'Inflation already exists!'
      })
    });
  })
}

export const GetInflationsByBudgetVersionID = (budgetVersionID) => {
  return new Promise((resolve) => {
    // axios.get(`${getURL("INFLATION")}/GetInflationsByBudgetVersionID?budgetVersionid=${budgetVersionID}`)
    makeApiRequest('get', `${getURL("INFLATION")}/GetInflationsByBudgetVersionID?budgetVersionid=${budgetVersionID}`)  
    .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Error occured while getting Inflation Data");
        resolve([]);
      });
  });
};
