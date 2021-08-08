import axios from 'axios';
import { makeApiRequest } from './api';
import getURL from './api/apiList';

export const SaveForecast = (forecastSection) => {
  return new Promise((resolve) => {
    // axios.post(getURL('FORECASTSAVE'), forecastSection).then((response) => {
    makeApiRequest('post', getURL('FORECASTSAVE'), forecastSection).then((response) => {
      resolve({
        success: response.data.status === 'failed' ? false : true,
        message: response.data.status === 'failed' ? 'Forecast already exists!' : 'Forecast saved.'
      })
    }).catch((err) => {
      console.log('Error occured while saving forecast')
      resolve({
        success: false,
        message: 'Forecast already exists!'
      })
    });
  })
}



