import React from 'react';

import axios from 'axios';

import getURL from './apiList'
import { ToastNotification } from 'carbon-components-react';
import { makeApiRequest } from '.';

// const postPosts = () => {
//   axios
//     .post("https://jsonplaceholder.typicode.com/posts", {
//       title: "Fred",
//       body: "Fred is awesome"
//     })
//     .then(response => {
//       console.log(response);
//     })
//     .catch(error => {
//       console.error(error);
//     });
// };
// postPosts();



async function postApiResponse(apiResource, payload) {
  //console.log('PostApiRequests', apiResource, payload);
  let endpoint = getURL(apiResource)
 // console.log(endpoint)
  let jsonString = JSON.stringify(payload);
  // console.log('jsonstring',jsonString);
  // const response = await axios.post(endpoint,payload);
  const response = await makeApiRequest('post', endpoint, payload);
  const data = await response.data;  
  console.log('POST-Response-Data', data, data['status']);

  if (data['status'] === 'failed')
  {
  return (
		<ToastNotification kind='error' 
		iconDescription="describes the close button"
      //subtitle={<span>Subtitle text goes here. <a href="#example">Example link</a></span>}
      timeout={5}
      title={data.message} />)
  }
  
  else{
    //console.log('record save successfully')
    //console.log('record save successfully')
  return (
  <> 
		<ToastNotification kind='info' 
		iconDescription="describes the close button"
      //subtitle={<span>Subtitle text goes here. <a href="#example">Example link</a></span>}
      timeout={10}
      title="Record saved successfully " />
      </>
  )
  }
  
  //return 'success';
}
export default  postApiResponse;