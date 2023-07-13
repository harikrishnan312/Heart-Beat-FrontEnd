import jwt_decode from 'jwt-decode';

const isAccessTokenExpired = (accessToken) => {
    if (!accessToken) {
      // Access token is not provided
      return true;
    }

    try {
      const decodedToken = jwt_decode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000); // Convert current time to seconds
      // console.log(decodedToken.exp,'exp');
      // console.log(currentTime,'cur');


      if (decodedToken.exp< currentTime) {
        // Access token has expired
        console.log('token expired');
        return true;
      }
    } catch (error) {
      // Failed to decode the access token
      console.error('Error decoding access token:', error);
      return true;
    }

    // Access token is valid and not expired
    return false;
  };
  
  export default isAccessTokenExpired;