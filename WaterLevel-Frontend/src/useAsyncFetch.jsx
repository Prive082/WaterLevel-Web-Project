// A custom hook that calls fetch.
// A hook is a function that can be called by React components.
// This one is wrapped around the built-in effect hook.  

import React, {useEffect} from 'react';

const useAsyncFetch = function (url, options, thenFun, catchFun, date) {
  console.log("in useAsyncFetch");

  // the usual function that does a fetch
  async function fetchData(date) {
    // Send request to origin server at appropriate endpoint
    let request = createPostRequest(date);
    let response = await fetch('/query/getCDECData', request);

    // Wait for origin server to send back JSON object
    let json = await response.json();

    // Sanity check the contents of the JSON
    console.log(json);
    thenFun(json);
  }

  // The effect hook is a function called when the component is created or updated.
  // In this case, "the component" refers to the componet using 
  // this useFetch hook.
  // Because we give it a second argument of [] (meaning "update when the variables in this empty list change"),
  // this particular effect hook will get run only after the componet is created, not when it is updated.
  // In particular, when the calling component is re-rendered its state variables change,
  // this effect does not get called again. 
  useEffect(function () {
    fetchData(date);
  }, [date]);

}

function createPostRequest(data) {
  const request = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  };
  return request;
}

export default useAsyncFetch;