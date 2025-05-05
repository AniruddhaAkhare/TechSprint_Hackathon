// const functions = require("firebase-functions");
// const axios = require("axios");

// exports.sendEmail = functions.region("us-central1").https.onCall(async (data) => { 
//   const { toEmail, subject, htmlContent } = data;
  
//   if (!toEmail || !subject || !htmlContent) {
//     const missingFields = [];
//     if (!toEmail) missingFields.push("toEmail");
//     if (!subject) missingFields.push("subject");
//     if (!htmlContent) missingFields.push("htmlContent");
//     throw new functions.https.HttpsError(
//       'invalid-argument',
//       `Missing required fields: ${missingFields.join(", ")}`
//     );
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(toEmail)) {
//     throw new functions.https.HttpsError(
//       'invalid-argument',
//       `Invalid email address: ${toEmail}`
//     );
//   }

//   try {
//     const response = await axios.post(
//       "https://api.zeptomail.in/v1.1/email",
//       {
//         fromAddress: "noreply@shikshasaarathi.com",
//         toAddress: toEmail,
//         subject: subject,
//         htmlbody: htmlContent,
//       },
//       {
//         headers: {
//           Authorization: "Zoho-enczapikey PHtE6r1cE+G93WUupERW4/LsR8WmPY0vrr8xKQRPudwQWKdVH00Er495lmDkqE0qAfETEvCby4hp5bqV4u/ULGnqYT5KWGqyqK3sx/VYSPOZsbq6x00ctlUTcUzbUI/sc9Bs1SLTs9fTNA==" , // Recommended: Use environment variable
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return { 
//       status: "success",
//       data: response.data 
//     };
    
//   } 
//   catch (error) {
//     const errorDetails = {
//       zeptoMailError: error.response?.data,
//       axiosError: error.message,
//       stack: error.stack
//     };
  
//     console.error("Full Error Details:", JSON.stringify(errorDetails, null, 2));
  
//     throw new functions.https.HttpsError(
//       'internal',
//       'Failed to send email',
//       errorDetails 
//     );
//   }
// });




const functions = require("firebase-functions");
const axios = require("axios");

exports.sendEmail = functions.region("us-central1").https.onCall(async (data) => {
  const { toEmail, subject, htmlContent, fullName } = data;

  // Input validation
  if (!toEmail || !subject || !htmlContent) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Missing required fields: ${[
        !toEmail && 'toEmail',
        !subject && 'subject', 
        !htmlContent && 'htmlContent'
      ].filter(Boolean).join(', ')}`
    );
  }

  // Email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid email address format'
    );
  }

  try {
    // Payload matching your working cURL example
    const payload = {
      from: {
        address: "noreply@shikshasaarathi.com"
      },
      to: [{
        email_address: {
          address: toEmail,
          name: fullName || "User"
        }
      }],
      subject: subject,
      htmlbody: htmlContent
      // Removed optional fields that might cause issues
    };

    const response = await axios.post(
      "https://api.zeptomail.in/v1.1/email",
      payload,
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Zoho-enczapikey PHtE6r1cE+G93WUupERW4/LsR8WmPY0vrr8xKQRPudwQWKdVH00Er495lmDkqE0qAfETEvCby4hp5bqV4u/ULGnqYT5KWGqyqK3sx/VYSPOZsbq6x00ctlUTcUzbUI/sc9Bs1SLTs9fTNA=="
        },
        timeout: 10000
      }
    );

    return {
      status: "success",
      messageId: response.data.request_id,
      response: response.data
    };

  } catch (error) {
    console.error("ZeptoMail API Error:", {
      status: error.response?.status,
      error: error.response?.data,
      request: error.config?.data
    });

    throw new functions.https.HttpsError(
      'internal',
      error.response?.data?.message || 'Failed to send email',
      {
        statusCode: error.response?.status,
        errorDetails: error.response?.data
      }
    );
  }
});