const functions = require("firebase-functions");
const axios = require("axios");

exports.sendEmail = functions.region("us-central1").https.onCall(async (data) => { 
  const { toEmail, subject, htmlContent } = data;
  
  if (!toEmail || !subject || !htmlContent) {
    const missingFields = [];
    if (!toEmail) missingFields.push("toEmail");
    if (!subject) missingFields.push("subject");
    if (!htmlContent) missingFields.push("htmlContent");
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(toEmail)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Invalid email address: ${toEmail}`
    );
  }

  try {
    const response = await axios.post(
      "https://api.zeptomail.in/v1.1/email",
      {
        fromAddress: "noreply@shikshasaarathi.com",
        toAddress: toEmail,
        subject: subject,
        htmlbody: htmlContent,
      },
      {
        headers: {
          Authorization: "Zoho-enczapikey PHtE6r1cE+G93WUupERW4/LsR8WmPY0vrr8xKQRPudwQWKdVH00Er495lmDkqE0qAfETEvCby4hp5bqV4u/ULGnqYT5KWGqyqK3sx/VYSPOZsbq6x00ctlUTcUzbUI/sc9Bs1SLTs9fTNA==" , // Recommended: Use environment variable
          "Content-Type": "application/json",
        },
      }
    );

    return { 
      status: "success",
      data: response.data 
    };
    
  } 
  catch (error) {
    const errorDetails = {
      zeptoMailError: error.response?.data,
      axiosError: error.message,
      stack: error.stack
    };
  
    console.error("Full Error Details:", JSON.stringify(errorDetails, null, 2));
  
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send email',
      errorDetails 
    );
  }
});




// const axios = require('axios');

// exports.sendEmail = functions.https.onCall(async (data, context) => {
//   try {
//     const apiKey = functions.config().zepto.apikey;
//     const payload = {
//       from: { 
//         address: "noreply@shikshasaarathi.com",
//         name: "Shiksha Saarathi" // Add sender name
//       },
//       to: [{
//         email_address: {
//           address: data.toEmail,
//           name: data.fullName
//         }
//       }],
//       subject: data.subject,
//       htmlbody: data.htmlContent,
//       // Add these mandatory fields
//       tracking: {
//         click_tracking: true,
//         open_tracking: true
//       }
//     };

//     console.log("Sending to ZeptoMail:", JSON.stringify(payload, null, 2));

//     const response = await axios.post('https://api.zeptomail.in/v1.1/email', payload, {
//       headers: {
//         'Authorization': "Zoho-enczapikey PHtE6r1cE+G93WUupERW4/LsR8WmPY0vrr8xKQRPudwQWKdVH00Er495lmDkqE0qAfETEvCby4hp5bqV4u/ULGnqYT5KWGqyqK3sx/VYSPOZsbq6x00ctlUTcUzbUI/sc9Bs1SLTs9fTNA==" , // Recommended: Use environment variable,
//         'Content-Type': 'application/json'
//       }
//     });

//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Full error details:", {
//       request: error.config?.data,
//       response: error.response?.data,
//       status: error.response?.status
//     });
//     throw new functions.https.HttpsError('internal', 
//       error.response?.data?.error?.message || error.message,
//       error.response?.data?.error
//     );
//   }
// });