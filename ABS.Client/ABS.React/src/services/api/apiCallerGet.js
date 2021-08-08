import axios from 'axios';
import getURL from './apiList';
import { makeApiRequest } from './index'

export async function getApiResponseParams(apiResource, params) {
  // console.log('getApiResponseparams', apiResource, params);
  let endpoint = getURL(apiResource)
  //console.log(endpoint)
  // const response = await axios.get(endpoint, {
  //   params: {
  //     UserId: 1
  //   },
  // });
  const response = await makeApiRequest('get', endpoint, {
      params: {
        UserId: 1
      }
    });
  const data = await response.data;
  // console.log('getApiResponseParams data', data)
  return data;
}

export async function getApiResponseWithParams(apiResource, params) {
  let endpoint = getURL(apiResource)
  // const response = await axios.get(endpoint, params);

  const response = await makeApiRequest('get', endpoint, params);

  const data = await response.data;
  return data;
}

export async function getApiResponseAsync(apiResource) {
  //console.log('getApiResponse', apiResource);
  let endpoint = getURL(apiResource)
  // const response = await axios.get(endpoint);
  const response = await makeApiRequest('get',endpoint);
  const data = await response.data;
  // console.log('data received from API',data)
  return data;
}

function getApiResponse(apiResource) {
  //console.log('getApiResponse', apiResource);
  let endpoint = getURL(apiResource)
  //const response =  axios.get(endpoint);
  // axios.get(endpoint).then((response) => { return response.data });;
  makeApiRequest('get', endpoint).then((response) => { return response.data });
}

export default getApiResponse;