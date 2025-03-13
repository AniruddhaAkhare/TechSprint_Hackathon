// import axios from "axios";

// const getZoomAccessToken = async () => {
//     const clientId = "gUrHIAnRCipvUcr7n1CNQ";
//     const clientSecret = "8YROYsUaFZuWp19p53i0mm2OwlVQA9Ya";
//     const authUrl = "https://zoom.us/oauth/token";
    
//     try {
//         const response = await axios.post(
//             authUrl,
//             new URLSearchParams({
//                 grant_type: "client_credentials",
//             }),
//             {
//                 headers: {
//                     Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//             }
//         );

//         return response.data.access_token;
//     } catch (error) {
//         console.error("Error getting Zoom access token:", error);
//         return null;
//     }
// };

// export default getZoomAccessToken;


// utils/getZoomAccessToken.js
import axios from 'axios';

export default async function getZoomAccessToken() {
  try {
    const response = await axios.post(
      '/api/zoom/token', // Your backend endpoint
      null,
      { withCredentials: true }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Zoom token error:', error);
    return null;
  }
}