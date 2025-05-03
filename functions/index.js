const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

exports.sendEmail = functions.region("us-central1").https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { toEmail, subject, htmlContent } = req.body;
    // Detailed validation
    if (!toEmail || !subject || !htmlContent) {
      const missingFields = [];
      if (!toEmail) missingFields.push("toEmail");
      if (!subject) missingFields.push("subject");
      if (!htmlContent) missingFields.push("htmlContent");
      return res.status(400).send(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) {
      return res.status(400).send(`Invalid email address: ${toEmail}`);
    }

    try {
      const response = await axios.post(
        "https://api.zeptomail.com/v1.1/email",
        {
          fromAddress: "noreply@shikshasaarathi.com",
          toAddress: toEmail,
          subject: subject,
          htmlbody: htmlContent,
        },
        {
          headers: {
            Authorization: `Zoho-enczapikey PHtE6r1cE+G93WUupERW4/LsR8WmPY0vrr8xKQRPudwQWKdVH00Erjih5bqV4u/ULGnqYT5KWGqyqK3sx/VYSPOZsbq6x00ctlUTcUzbUI/sc9Bs1SLTs9fTNA==`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).send({
        status: "success",
        message: "Email sent successfully",
        data: response.data,
      });
    } catch (error) {
      console.error("Error sending email via ZeptoMail:", {
        message: error.message,
        code: error.code,
        response: error.response ? error.response.data : null,
      });

      let errorMessage = "Failed to send email.";
      if (error.response) {
        errorMessage += ` ZeptoMail responded with: ${JSON.stringify(error.response.data)}`;
      } else if (error.code === "ENOTFOUND") {
        errorMessage += " Could not connect to ZeptoMail API.";
      } else {
        errorMessage += ` Error: ${error.message}`;
      }

      return res.status(500).send(errorMessage);
    }
  });
});