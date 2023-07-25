// api.js
const BASE_URL = 'https://heart-beat.onrender.com';

// const baseApiCall = async (endpoint, options) => {
//   try {
//     const response = await fetch(`${BASE_URL}/${endpoint}`, options);
//     const data = await response.json();
//     return data;
//   } catch (error) {
// Handle error
//     console.error('Error:', error);
//     throw error;
//   }
// };

// export default baseApiCall;
const baseApiCall = async (endpoint, options) => {
  try {
    const { params, ...fetchOptions } = options;

    let url = `${BASE_URL}/${endpoint}`;

    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryString}`;
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle error
    console.error('Error:', error);
    throw error;
  }
};

export default baseApiCall;
