import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions"; // Proper import
const sendWelcomeEmail = async ({toEmail, fullName}) => {
  // Validate parameters before API call
  if (!toEmail?.trim()) {
    throw new Error("Recipient email is required");
  }

  const subject = `Welcome to Shiksha Saarathi${fullName ? `, ${fullName}` : ''}!`;
  const htmlContent = `
    ${fullName ? `<h1>Welcome, ${fullName}!</h1>` : '<h1>Welcome to Shiksha Saarathi!</h1>'}
    <p>Thank you for enrolling at Shiksha Saarathi.</p>
  `.trim();

  console.log("Final Email Payload:", { 
    toEmail, 
    subject, 
    htmlContent: htmlContent.slice(0, 50) + "..." 
  });

  try {
    const sendEmailFunction = httpsCallable(functions, "sendEmail");
    const { data } = await sendEmailFunction({
      toEmail: toEmail,
      subject,
      htmlContent
    });

    return data;
  } catch (error) {
    console.error("Error Breakdown:", {
      code: error.code,
      clientInput: { toEmail, fullName },
      serverError: error.details
    });
    
    throw new Error(`Email failed: ${error.details?.missingFields?.join(", ") || "Unknown error"}`);
  }
};
export default sendWelcomeEmail;