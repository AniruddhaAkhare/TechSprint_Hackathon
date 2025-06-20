




const functions = require("firebase-functions");
const axios = require("axios");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.sendEmail = functions.region("us-central1").https.onCall(async (data) => {
  const { toEmail, subject, htmlContent, fullName } = data;
  const zohoApiKey =
    functions.config().zepto?.apikey || process.env.ZEPTO_API_KEY;

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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid email address format'
    );
  }

  try {
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
      htmlbody: htmlContent,
      // ACL: "public-read",
    };

    const response = await axios.post(
      "https://api.zeptomail.in/v1.1/email",
      payload,
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Zoho-enczapikey ${zohoApiKey}`
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


// exports.setRecruiterClaim = functions.https.onCall(async (data, context) => {
//   const { email } = data;

//   const userRecord = await admin.auth().getUserByEmail(email);
//   const uid = userRecord.uid;


//   const companiesSnapshot = await admin.firestore().collection('Companies').get();
//   let isPOC = false;

//   companiesSnapshot.forEach(doc => {
//     const pocs = doc.data().pointsOfContact || [];
//     const found = pocs.find(poc => poc.email.toLowerCase() === email.toLowerCase());
//     if (found) isPOC = true;
//   });

//   if (!isPOC) throw new functions.https.HttpsError('permission-denied', 'Email not found in POC list.');

  
//   await admin.auth().setCustomUserClaims(uid, {
//     role: 'sTRunlCqsvQ8PJRyRuPg' 
//   });

//   return { success: true, uid };
// });