// src/emailTemplates.js
export const emailTemplates = {
    welcome: (name) => ({
      subject: `Welcome to Our LMS, ${name}!`,
      html: `
        <div>
          <h1>Welcome ${name}!</h1>
          <p>Your account has been successfully created.</p>
          <a href="https://shikshasaarathi.com">Get Started</a>
        </div>
      `
    }),

  };