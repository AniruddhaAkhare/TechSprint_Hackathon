import emailjs from 'emailjs-com';
// import Feedback from './Feedback.jsx';

const emailService = {
  sendEmail: async (formData) => {
    try {
      const response = await emailjs.send('service_h4jtcrx', 'template_frw684b', {
        feedback: formData, // Assuming formData contains the necessary fields
      }, '7d3Mm5-ijkatOFQe2');

      return response;
    } catch (error) {
      throw new Error('Error sending email: ' + error.message);
    }
  },
};

export default emailService;

// Note: Please replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_USER_ID' with your actual EmailJS credentials.
