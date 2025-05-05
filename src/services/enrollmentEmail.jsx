import { httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { functions } from "../config/firebase.js";

// Connect to Firebase Functions emulator for local testing
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

/**
 * Sends a welcome email to a newly added student with course and fee details using Zoho ZeptoMail via Firebase Cloud Function.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} fullName - The student's full name.
 * @param {Object} course - The enrolled course details (e.g., { name: string }).
 * @param {Object} feeDetails - The fee details (e.g., { feeTemplate: string, totalFees: number, discountType: string, discountValue: string, feeAfterDiscount: number, discountReason: string }).
 * @returns {Promise<{success: boolean, messageId?: string}>}
 */
const EnrollmentEmail = async (toEmail, fullName, course, feeDetails) => {
  // Enhanced logging
  console.log("Preparing enrollment email with:", { 
    toEmail, 
    fullName, 
    courseName: course?.name,
    feeDetails: {
      ...feeDetails,
      totalFees: feeDetails?.totalFees ? `₹${feeDetails.totalFees}` : undefined,
      feeAfterDiscount: feeDetails?.feeAfterDiscount ? `₹${feeDetails.feeAfterDiscount}` : undefined
    }
  });

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(toEmail)) {
    throw new Error("Please provide a valid email address");
  }

  if (!fullName?.trim()) {
    throw new Error("Student name is required");
  }

  if (!course?.name) {
    throw new Error("Course name is required");
  }

  // Format currency values
  const formatCurrency = (amount) => {
    return amount ? `₹${amount.toLocaleString('en-IN')}` : '₹0';
  };

  try {
    const sendEmailFunction = httpsCallable(functions, "sendEmail");
    const subject = `Welcome to ${course.name}, ${fullName.split(' ')[0]}!`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #2c3e50;">Welcome, ${fullName}!</h1>
        <p>Thank you for enrolling in <strong>${course.name}</strong> at Shiksha Saarathi.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #2c3e50; margin-top: 0;">Enrollment Details</h2>
          <ul style="line-height: 1.6; padding-left: 20px;">
            <li><strong>Course:</strong> ${course.name}</li>
            ${course.duration ? `<li><strong>Duration:</strong> ${course.duration}</li>` : ''}
            ${course.startDate ? `<li><strong>Start Date:</strong> ${course.startDate}</li>` : ''}
          </ul>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #2c3e50; margin-top: 0;">Fee Details</h2>
          <ul style="line-height: 1.6; padding-left: 20px;">
            <li><strong>Fee Structure:</strong> ${feeDetails.feeTemplate || "Standard"}</li>
            <li><strong>Total Fees:</strong> ${formatCurrency(feeDetails.totalFees)}</li>
            ${
              feeDetails.discountValue
                ? `<li><strong>Discount Applied:</strong> ${
                    feeDetails.discountType === "percentage"
                      ? `${feeDetails.discountValue}%`
                      : formatCurrency(feeDetails.discountValue)
                  }${feeDetails.discountReason ? ` (${feeDetails.discountReason})` : ""}</li>`
                : ""
            }
            <li><strong>Net Payable Amount:</strong> ${formatCurrency(feeDetails.feeAfterDiscount || feeDetails.totalFees)}</li>
          </ul>
        </div>

        <div style="margin: 20px 0;">
          <p>We're excited to have you on board. Here's what to do next:</p>
          <ol style="line-height: 1.6; padding-left: 20px;">
            <li>Check your email for login credentials</li>
            <li>Access the learning portal at <a href="https://shikshasaarathi.com" style="color: #3498db;">shikshasaarathi.com</a></li>
            <li>Review the course syllabus and schedule</li>
          </ol>
        </div>

        <p style="margin-top: 30px; color: #7f8c8d;">
          Best regards,<br/>
          <strong>The Shiksha Saarathi Team</strong>
        </p>
      </div>
    `;

    console.log(`Sending enrollment email to ${toEmail}`);
    const result = await sendEmailFunction({
      toEmail: toEmail.trim(),
      subject,
      htmlContent: emailContent,
    });

    console.log("Email sent successfully:", result.data);
    return {
      success: true,
      messageId: result.data?.messageId
    };

  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    console.error("Failed to send enrollment email:", errorDetails);
    
    throw new Error(
      errorDetails.message || 
      'Failed to send enrollment confirmation. Please contact support if the issue persists.'
    );
  }
};

export default EnrollmentEmail;