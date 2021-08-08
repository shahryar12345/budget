import axios from 'axios';
import { makeApiRequest } from './api';
import getURL from './api/apiList';

export const PostRaises = (raises) => {
  return new Promise((resolve) => {
    // axios.post(getURL('RAISES'), raises).then((response) => {
    makeApiRequest('post', getURL('RAISES'), raises).then((response) => {
      resolve({
        success: response.data.status === 'failed' ? false : true,
        message: response.data.status === 'failed' ? 'Staffing wage adjustment already exists!' : 'Staffing wage adjustment saved.'
      })
    }).catch((err) => {
      console.log('Error occured while saving inflation')
      resolve({
        success: false,
        message: 'Staffing wage adjustment already exists!'
      })
    });
  })
}

export const GetRaisesByBudgetVersionID = (budgetVersionID) => {
  return new Promise((resolve) => {
    // axios.get(`${getURL("RAISES")}/GetStaffingWageAdjustmentsByBudgetVersionID?budgetVersionid=${budgetVersionID}`)
    makeApiRequest('get', `${getURL("RAISES")}/GetStaffingWageAdjustmentsByBudgetVersionID?budgetVersionid=${budgetVersionID}`)  
    .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Error occured while getting Staffing wage adjustment data");
        resolve([]);
      });
  });
};