import axios from 'axios';
import getURL from './api/apiList';

export const GetFullTimeEquivalentByTimePeriod = (timePeriodID) => {
  return new Promise((resolve) => {
    axios
      .get(`${getURL("FTEDATA")}/GetFullTimeEquivalentByTimePeriod?timePeriodID=${timePeriodID}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log("Error occured while getting Inflation Data");
        resolve([]);
      });
  });
};
