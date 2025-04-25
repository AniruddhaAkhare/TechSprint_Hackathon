// const functions = require("firebase-functions");
// const { SendMailClient } = require("zeptomail");

// // ZeptoMail configuration
// const zeptoConfig = {
//   url: "api.zeptomail.in",
//   token: "Zoho-enczapikey PHtE6r1cE+G93WUupERW4/LsR8WmPY0vrr8xKQRPudwQWKdVH00Er495lmDkqE0qAfETEvCby4hp5bqV4u/ULGnqYT5KWGqyqK3sx/VYSPOZsbq6x00ctlUTcUzbUI/sc9Bs1SLTs9fTNA==",
// };

// /**
//  * Firebase Cloud Function to send emails via Zoho ZeptoMail.
//  * Callable from the client with parameters: toEmail, subject, htmlContent.
//  */
// exports.sendEmail = functions.https.onCall(async (data, context) => {
//   console.log("sendEmail function invoked with data:", data); // Debug log
//   const { toEmail, subject, htmlContent } = data;

//   // Input validation
//   if (!toEmail || !subject || !htmlContent) {
//     console.error("Missing required parameters:", { toEmail, subject, htmlContent });
//     throw new functions.https.HttpsError(
//       "invalid-argument",
//       "Missing required parameters: toEmail, subject, htmlContent"
//     );
//   }

//   // Validate ZeptoMail token
//   if (!zeptoConfig.token) {
//     console.error("ZeptoMail token is not configured in environment variables.");
//     throw new functions.https.HttpsError(
//       "failed-precondition",
//       "ZeptoMail token is not configured. Set it using `firebase functions:config:set zeptomail.token=YOUR_TOKEN`"
//     );
//   }

//   let client;
//   try {
//     console.log("Initializing ZeptoMail client with config:", {
//       url: zeptoConfig.url,
//       token: zeptoConfig.token ? "[REDACTED]" : "undefined",
//     }); // Debug log
//     client = new SendMailClient(zeptoConfig);
//   } catch (initError) {
//     console.error("Failed to initialize ZeptoMail client:", initError.message, initError);
//     throw new functions.https.HttpsError("internal", `Failed to initialize ZeptoMail client: ${initError.message}`);
//   }

//   try {
//     console.log(`Sending email to ${toEmail} with subject: ${subject}`); // Debug log
//     const response = await client.sendMail({
//       from: {
//         address: "noreply@shikshasaarathi.com",
//         name: "Shiksha Saarathi",
//       },
//       to: [
//         {
//           email_address: {
//             address: toEmail,
//             name: "",
//           },
//         },
//       ],
//       subject: subject,
//       htmlbody: htmlContent,
//     });
//     console.log("Email sent successfully:", response); // Debug log
//     return { success: true, message: "Email sent successfully", response };
//   } catch (error) {
//     console.error("Error sending email:", {
//       message: error.message,
//       code: error.code,
//       details: error.details || error,
//     }); // Detailed error logging
//     throw new functions.https.HttpsError("internal", `Failed to send email: ${error.message || "Unknown error"}`);
//   }
// });





const functions = require("firebase-functions");
const { SendMailClient } = require("zeptomail");

// ZeptoMail configuration
const zeptoConfig = {
  url: "api.zeptomail.in",
  token: "Zoho-enczapikey PHtE6r1cE+G93WUupERW4/LsR8WmPY0vrr8xKQRPudwQWKdVH00Er495lmDkqE0qAfETEvCby4hp5bqV4u/ULGnqYT5KWGqyqK3sx/VYSPOZsbq6x00ctlUTcUzbUI/sc9Bs1SLTs9fTNA==",
};

/**
 * Firebase Cloud Function to send emails via Zoho ZeptoMail.
 * Callable from the client with parameters: toEmail, subject, htmlContent.
 */
exports.sendEmail = functions.https.onCall(async (data, context) => {
  console.log("sendEmail function invoked with data:", data); // Debug log
  const { toEmail, subject, htmlContent } = data;

  // Input validation
  if (!toEmail || !subject || !htmlContent) {
    console.error("Missing required parameters:", { toEmail, subject, htmlContent });
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required parameters: toEmail, subject, htmlContent"
    );
  }

  // Validate ZeptoMail token
  if (!zeptoConfig.token) {
    console.error("ZeptoMail token is not configured in environment variables.");
    throw new functions.https.HttpsError(
      "failed-precondition",
      "ZeptoMail token is not configured. Set it using `firebase functions:config:set zeptomail.token=YOUR_TOKEN`"
    );
  }

  let client;
  try {
    console.log("Initializing ZeptoMail client with config:", {
      url: zeptoConfig.url,
      token: zeptoConfig.token ? "[REDACTED]" : "undefined",
    }); // Debug log
    client = new SendMailClient(zeptoConfig);
  } catch (initError) {
    console.error("Failed to initialize ZeptoMail client:", initError.message, initError);
    throw new functions.https.HttpsError("internal", `Failed to initialize ZeptoMail client: ${initError.message}`);
  }

  try {
    console.log(`Sending email to ${toEmail} with subject: ${subject}`); // Debug log
    const response = await client.sendMail({
      from: {
        address: "noreply@shikshasaarathi.com",
        name: "Shiksha Saarathi",
      },
      to: [
        {
          email_address: {
            address: toEmail,
            name: "",
          },
        },
      ],
      subject: subject,
      htmlbody: htmlContent,
    });
    console.log("Email sent successfully:", response); // Debug log
    return { success: true, message: "Email sent successfully", response };
  } catch (error) {
    console.error("Error sending email:", {
      message: error.message,
      code: error.code,
      details: error.details || error,
    }); // Detailed error logging
    throw new functions.https.HttpsError("internal", `Failed to send email: ${error.message || "Unknown error"}`);
  }
});