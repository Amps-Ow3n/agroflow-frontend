// src/api/client.js

import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json"
  }
});

client.interceptors.request.use(
(config)=>{

const token =
localStorage.getItem("access_token");


if(token){

config.headers.Authorization =
`Bearer ${token}`;

}

return config;

},
(error)=>Promise.reject(error)
);



client.interceptors.response.use(

(response)=>response,


(error)=>{

if (error.response?.status === 401) {

  localStorage.removeItem("access_token");

  localStorage.removeItem("role");

  if (
    window.location.pathname !== "/login"
  ) {

    window.location.href = "/login";

  }

}

return Promise.reject(error);

}

);
export default client;