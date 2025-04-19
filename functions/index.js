import { https } from 'firebase-functions';
import { SendMailClient } from "zeptomail";

const url = "api.zeptomail.in/";
const token = "Zoho-enczapikey PHtE6r1YF+nigzN58xgEtvWxFMT3MoIq/bszfgASt9tKA/YCTE1QqdF9lme/+hwpBPhER//Iyd895ejJt+jWJG7sNGZMXWqyqK3sx/VYSPOZsbq6x00fsl4ZdkDaUo7odtVj1ifWvNfaNA==";

export const sendTestEmail = https.onRequest(async (req, res) => {
  try {
    const client = new SendMailClient({url, token});
    
    await client.sendMail({
      "from": {
        "address": "noreply@shikshasaarathi.com",
        "name": "noreply"
      },
      "to": [{
        "email_address": {
          "address": "aniruddha@fireblazeaischool.in",
          "name": "Aniruddha"
        }
      }],
      "subject": "Test Email",
      "htmlbody": "<div><b>Test email sent successfully.</b></div>"
    });

    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});
