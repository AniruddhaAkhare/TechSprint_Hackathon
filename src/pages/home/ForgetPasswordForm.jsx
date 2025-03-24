// import React from 'react';
// import { Form, Input } from 'antd';
// import { MailOutlined } from '@ant-design/icons';
// // import useLanguage from '@/locale/useLanguage';

// // import useLanguage from '@/locale/useLanguage';

// export default function ForgetPasswordForm() {
//   // const translate=useLanguage()
//   return (
//     <Form.Item
//       name="email"
//       rules={[
//         {
//           required: true,
//         },
//         {
//           type: 'email',
//         },
//       ]}
//     >
//       <Input
//         prefix={<MailOutlined className="site-form-item-icon" />}
//         type="email"
//         placeholder={translate('email')}
//         size="large"
//       />
//     </Form.Item>
//   );
// }


import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase'; // Ensure this path matches your setup

export default function ForgetPasswordForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, values.email);
            alert('Password reset email sent! Check your inbox.');
            window.location.href = '/login'; // Redirect back to login after success
        } catch (error) {
            console.error('Error sending password reset email:', error);
            alert('Failed to send reset email. ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 w-screen">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Reset Password</h2>
                <Form onFinish={handleSubmit} className="forget-password-form">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="site-form-item-icon" />}
                            type="email"
                            placeholder="Enter your email"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            Send Reset Email
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <a href="/login" className="text-blue-500 hover:underline text-center block">
                            Back to Login
                        </a>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}