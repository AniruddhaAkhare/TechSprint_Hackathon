import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../../config/firebase'; 
import { Form, Input, Checkbox, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Signed in successfully');
            window.location.href = "/";
        } catch (err) {
            alert("Admin not registered");
            console.error("Admin not registered", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 w-screen">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
                <Form onSubmitCapture={handleSubmit}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Enter a valid email!' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="admin@demo.com"
                            type="email"
                            size="large"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="admin123"
                            size="large"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex items-center justify-between">
                            <Checkbox>Remember me</Checkbox>
                            <a className="text-blue-500 hover:underline" href="/forgetpassword">
                                Forgot password?
                            </a>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
