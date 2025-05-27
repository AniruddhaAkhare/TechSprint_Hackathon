


import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";

const sendWelcomeEmail = async ({ toEmail, fullName }) => {
  if (!toEmail?.trim()) {
    throw new Error("Recipient email is required");
  }

  const subject = `Welcome to Shiksha Saarathi${fullName ? `, ${fullName}` : ''}!`;
  
  const htmlContent = `
    <div>
      ${fullName ? `<h1>Welcome, ${fullName}!</h1>` : '<h1>Welcome!</h1>'}
      <p>Thank you for joining Shiksha Saarathi.</p>
    </div>
  `.trim();

  try {
    const sendEmailFunction = httpsCallable(functions, "sendEmail");
    const result = await sendEmailFunction({
      toEmail: toEmail.trim(),
      subject,
      htmlContent,
      fullName: fullName?.trim() || undefined
    });

    return {
      success: true,
      ...result.data
    };

  } catch (error) {
    //console.error("Email Error:", {
      // input: { toEmail, fullName },
      // error: {
      //   code: error.code,
      //   message: error.message,
      //   details: error.details
      // }
    // }
  // );

    throw new Error(
      error.details?.errorDetails?.message || 
      'Failed to send welcome email. Please try again later.'
    );
  }
};

export default sendWelcomeEmail;