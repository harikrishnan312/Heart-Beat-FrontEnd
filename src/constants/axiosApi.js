import axios from 'axios';
import jwt_decode from 'jwt-decode';
import baseApiCall from './fetchApi';


// const baseURL = "http://localhost:8000"
// const baseURL = 'https://heartbeat-e56y.onrender.com';
const baseURL = "https://vanchi.online/"

const createInstance = (token) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  let cancelTokenSource = null;

  instance.interceptors.request.use(
    async function (config) {
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Request canceled due to new request');
      }

      cancelTokenSource = axios.CancelToken.source();
      config.cancelToken = cancelTokenSource.token;

      const isAccessTokenExpired = (token) => {
        try {
          if (!token) {
            return true;
          }
  
          const decodedToken = jwt_decode(token);
          const currentTime = Math.floor(Date.now() / 1000);
  
          if (decodedToken.exp < currentTime) {
            return true;
          }
        } catch (error) {
          console.error('Error decoding access token:', error);
          return true;
        }
  
        return false;
      };

      if (isAccessTokenExpired(token)) {
        console.log('Token expired');
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const options = {
            method: 'get',
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${refreshToken}`
            },
            params: {
              refresh: true
            },
            cancelToken: cancelTokenSource.token 
          };

          try {
            const response = await baseApiCall('refresh', options);
            if (response) {
              localStorage.setItem('token', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);
              config.headers.Authorization = `Bearer ${response.accessToken}`;
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
            throw error; 
          }
        } else {
          console.log('No refresh token');
        }
      }

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return instance;
};


export default createInstance;


// Calling api get call

// const axiosInstance = createInstance(userToken);

// axiosInstance
//   .get('/user-data')
//   .then((response) => {
//     setData(response.data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });


// const sendData = async () => {
//     try {
//       const dataToSend = { name: 'John', age: 25 }; // Data to send in the request
//       const response = await axiosInstance.post('/endpoint', dataToSend);
//       console.log('Response:', response.data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };
  
//   sendData();