// // <<<<<<< HEAD
// // import { signInWithEmailAndPassword } from 'firebase/auth';
// // import React, { useState } from 'react';
// // import { auth } from '../../config/firebase'; 

// // // // // import { signInWithEmailAndPassword } from 'firebase/auth';
// // // // // import React, { useState } from 'react';
// // // // // import { auth } from '../../config/firebase' // Correct import for auth
// // // // // import { Form, Input, Checkbox } from 'antd';
// // // // // import { UserOutlined, LockOutlined } from '@ant-design/icons';


// // // // // export default function LoginForm() {
// // // // //     const [email, setEmail] = useState('');
// // // // //     const [password, setPassword] = useState('');

// // // // //     const handleSubmit = async (e) => {
// // // // //         e.preventDefault();

// // // // //         try {
// // // // //             await signInWithEmailAndPassword(auth, email, password);
// // // // //             console.log('Signed in successfully');
// // // // //             window.location.href = "/";
// // // // //         } catch (err) {
// // // // //             alert("Admin not registered");
// // // // //             console.log("Admin not registered", err);
// // // // //         }
// // // // //     };

// // // // //     // return (
// // // // //     return (
// // // // //         <div>
// // // // //             <Form.Item
// // // // //                 // label={translate('email')}
// // // // //                 name="email"
// // // // //                 rules={[
// // // // //                     {
// // // // //                         required: true,
// // // // //                     },
// // // // //                     {
// // // // //                         type: 'email',
// // // // //                     },
// // // // //                 ]}
// // // // //             >
// // // // //                 <Input
// // // // //                     prefix={<UserOutlined className="site-form-item-icon" />}
// // // // //                     placeholder={'admin@demo.com'}
// // // // //                     type="email"
// // // // //                     size="large"
// // // // //                 />
// // // // //             </Form.Item>
// // // // //             <Form.Item
// // // // //                 label={translate('password')}
// // // // //                 name="password"
// // // // //                 rules={[
// // // // //                     {
// // // // //                         required: true,
// // // // //                     },
// // // // //                 ]}
// // // // //             >
// // // // //                 <Input.Password
// // // // //                     prefix={<LockOutlined className="site-form-item-icon" />}
// // // // //                     placeholder={'admin123'}
// // // // //                     size="large"
// // // // //                 />
// // // // //             </Form.Item>

// // // // //             <Form.Item>
// // // // //                 <Form.Item name="remember" valuePropName="checked" noStyle>
// // // // //                     <Checkbox>{translate('Remember me')}</Checkbox>
// // // // //                 </Form.Item>
// // // // //                 <a className="login-form-forgot" href="/forgetpassword" style={{ marginLeft: '0px' }}>
// // // // //                     {translate('Forgot password')}
// // // // //                 </a>
// // // // //             </Form.Item>
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // //         <div className="h-screen flex items-center justify-center min-h-screen bg-gray-100 w-screen">
// // // // // //             <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
// // // // // //                 <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
// // // // // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
// // // // // //                 <input
// // // // // //                     type="email"
// // // // // //                     value={email}
// // // // // //                     onChange={(e) => setEmail(e.target.value)}
// // // // // //                     required
// // // // // //                     className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />

// // // // // //                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
// // // // // //                 <input
// // // // // //                     type="password"
// // // // // //                     value={password}
// // // // // //                     onChange={(e) => setPassword(e.target.value)}
// // // // // //                     required
// // // // // //                     className="border border-gray-300 bg-white p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // // // //                 />

// // // // // //                 <button
// // // // // //                     type="submit"
// // // // // //                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
// // // // // //                 >
// // // // // //                     Login
// // // // // //                 </button>

// // // // // //                 <p className="mt-4 text-center text-sm text-gray-600">
// // // // // //                     Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
// // // // // //                 </p>
// // // // // //             </form>
// // // // // //         </div>
// // // // // //     );
// // // // // // }



// // // // import { signInWithEmailAndPassword } from 'firebase/auth';
// // // // import React, { useState } from 'react';
// // // // import { auth } from '../../config/firebase'; // Ensure correct import for Firebase auth
// // // // import { Form, Input, Checkbox, Button } from 'antd';
// // // // import { UserOutlined, LockOutlined } from '@ant-design/icons';

// // // // export default function LoginForm() {
// // // //     const [email, setEmail] = useState('');
// // // //     const [password, setPassword] = useState('');

// // // //     const handleSubmit = async (e) => {
// // // //         e.preventDefault();

// // // //         try {
// // // //             await signInWithEmailAndPassword(auth, email, password);
// // // //             console.log('Signed in successfully');
// // // //             window.location.href = "/";
// // // //         } catch (err) {
// // // //             alert("Admin not registered");
// // // //             console.error("Admin not registered", err);
// // // //         }
// // // //     };

// // // //     return (
// // // //         <div>
// // // //             <Form onSubmitCapture={handleSubmit}>
// // // //                 <Form.Item
// // // //                     label="Email"
// // // //                     name="email"
// // // //                     rules={[
// // // //                         { required: true, message: 'Please enter your email!' },
// // // //                         { type: 'email', message: 'Enter a valid email!' },
// // // //                     ]}
// // // //                 >
// // // //                     <Input
// // // //                         prefix={<UserOutlined className="site-form-item-icon" />}
// // // //                         placeholder="admin@demo.com"
// // // //                         type="email"
// // // //                         size="large"
// // // //                         value={email}
// // // //                         onChange={(e) => setEmail(e.target.value)}
// // // //                     />
// // // //                 </Form.Item>

// // // //                 <Form.Item
// // // //                     label="Password"
// // // //                     name="password"
// // // //                     rules={[{ required: true, message: 'Please enter your password!' }]}
// // // //                 >
// // // //                     <Input.Password
// // // //                         prefix={<LockOutlined className="site-form-item-icon" />}
// // // //                         placeholder="admin123"
// // // //                         size="large"
// // // //                         value={password}
// // // //                         onChange={(e) => setPassword(e.target.value)}
// // // //                     />
// // // //                 </Form.Item>

// // // //                 <Form.Item>
// // // //                     <Checkbox>Remember me</Checkbox>
// // // //                     <a className="login-form-forgot" href="/forgetpassword" style={{ marginLeft: '10px' }}>
// // // //                         Forgot password?
// // // //                     </a>
// // // //                 </Form.Item>

// // // //                 <Form.Item>
// // // //                     <Button type="primary" htmlType="submit" block>
// // // //                         Login
// // // //                     </Button>
// // // //                 </Form.Item>
// // // //             </Form>
// // // //         </div>
// // // //     );
// // // // }

// // // import { signInWithEmailAndPassword } from 'firebase/auth';
// // // import React, { useState } from 'react';
// // // import { auth } from '../../config/firebase'; // Ensure correct Firebase import
// // // import { Form, Input, Checkbox, Button } from 'antd';
// // // import { UserOutlined, LockOutlined } from '@ant-design/icons';

// // // export default function LoginForm() {
// // //     const [email, setEmail] = useState('');
// // //     const [password, setPassword] = useState('');

// // //     const handleSubmit = async (e) => {
// // //         e.preventDefault();

// // //         try {
// // //             await signInWithEmailAndPassword(auth, email, password);
// // //             console.log('Signed in successfully');
// // //             window.location.href = "/dashboard"; // Redirect after login
// // //         } catch (err) {
// // //             alert("Admin not registered");
// // //             console.error("Admin not registered", err);
// // //         }
// // //     };

// // //     return (
// // //         <div className="flex items-center justify-center h-screen bg-gray-100">
// // //             <div className="bg-white p-8 rounded-lg shadow-lg w-96">
// // //                 <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
// // //                 <Form onSubmitCapture={handleSubmit} layout="vertical">
// // //                     <Form.Item
// // //                         label="Email"
// // //                         name="email"
// // //                         rules={[
// // //                             { required: true, message: 'Please enter your email!' },
// // //                             { type: 'email', message: 'Enter a valid email!' },
// // //                         ]}
// // //                     >
// // //                         <Input
// // //                             prefix={<UserOutlined className="site-form-item-icon" />}
// // //                             placeholder="admin@demo.com"
// // //                             type="email"
// // //                             size="large"
// // //                             value={email}
// // //                             onChange={(e) => setEmail(e.target.value)}
// // //                         />
// // //                     </Form.Item>

// // //                     <Form.Item
// // //                         label="Password"
// // //                         name="password"
// // //                         rules={[{ required: true, message: 'Please enter your password!' }]}
// // //                     >
// // //                         <Input.Password
// // //                             prefix={<LockOutlined className="site-form-item-icon" />}
// // //                             placeholder="admin123"
// // //                             size="large"
// // //                             value={password}
// // //                             onChange={(e) => setPassword(e.target.value)}
// // //                         />
// // //                     </Form.Item>

// // //                     <Form.Item>
// // //                         <Checkbox>Remember me</Checkbox>
// // //                         <a className="text-blue-500 hover:underline ml-2" href="/forgetpassword">
// // //                             Forgot password?
// // //                         </a>
// // //                     </Form.Item>

// // //                     <Form.Item>
// // //                         <Button type="primary" htmlType="submit" block>
// // //                             Login
// // //                         </Button>
// // //                     </Form.Item>
// // //                 </Form>
// // //             </div>
// // //         </div>
// // //     );
// // // }






// // import { signInWithEmailAndPassword } from 'firebase/auth';
// // import React, { useState } from 'react';
// // import { auth } from '../../config/firebase'; // Ensure correct import for Firebase auth
// // import { Form, Input, Checkbox, Button } from 'antd';
// // import { UserOutlined, LockOutlined } from '@ant-design/icons';
// // import './LoginForm.css';

// // export default function LoginForm() {
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         try {
// //             await signInWithEmailAndPassword(auth, email, password);
// //             console.log('Signed in successfully');
// //             window.location.href = "/";
// //         } catch (err) {
// //             alert("Admin not registered");
// //             console.error("Admin not registered", err);
// //         }
// //     };

// //     return (
// //         <div className="login-container">
// //             <Form className="login-form" onSubmitCapture={handleSubmit}>
// //                 <h2 className="login-title">Login</h2>

// //                 <Form.Item
// //                     label="Email"
// //                     name="email"
// //                     rules={[
// //                         { required: true, message: 'Please enter your email!' },
// //                         { type: 'email', message: 'Enter a valid email!' },
// //                     ]}
// //                 >
// //                     <Input
// //                         prefix={<UserOutlined className="site-form-item-icon" />}
// //                         placeholder="admin@demo.com"
// //                         type="email"
// //                         size="large"
// //                         value={email}
// //                         onChange={(e) => setEmail(e.target.value)}
// //                     />
// //                 </Form.Item>

// //                 <Form.Item
// //                     label="Password"
// //                     name="password"
// //                     rules={[{ required: true, message: 'Please enter your password!' }]}
// //                 >
// //                     <Input.Password
// //                         prefix={<LockOutlined className="site-form-item-icon" />}
// //                         placeholder="admin123"
// //                         size="large"
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                     />
// //                 </Form.Item>

// //                 <Form.Item>
// //                     <Checkbox>Remember me</Checkbox>
// //                     <a className="login-form-forgot" href="/forgetpassword" style={{ marginLeft: '10px' }}>
// //                         Forgot password?
// //                     </a>
// //                 </Form.Item>

// //                 <Form.Item>
// //                     <Button type="primary" htmlType="submit" block>
// //                         Login
// //                     </Button>
// //                 </Form.Item>
// //             </Form>
// //         </div>
// //     );
// // }


// import { signInWithEmailAndPassword } from 'firebase/auth';
// import React, { useState } from 'react';
// import { auth } from '../../config/firebase';
// import { Form, Input, Checkbox, Button } from 'antd';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';

// export default function LoginForm() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//             console.log('Signed in successfully');
//             window.location.href = "/";
//         } catch (err) {
//             alert("Admin not registered");
//             console.error("Admin not registered", err);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100 w-screen">
//             <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
//                 <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
//                 {/* <div className="login-container h-screen flex items-center justify-center w-screen"> */}
//                 <Form className="login-form" onSubmitCapture={handleSubmit}>
//                         {/* <h2 className="login-title">Login</h2> */}

//                         <Form.Item
//                             label="Email"
//                             name="email"
//                             rules={[
//                                 { required: true, message: 'Please enter your email!' },
//                                 { type: 'email', message: 'Enter a valid email!' },
//                             ]}
//                         >
//                             <Input
//                                 prefix={<UserOutlined className="site-form-item-icon" />}
//                                 placeholder="admin@demo.com"
//                                 type="email"
//                                 size="large"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                             />
//                         </Form.Item>

//                         <Form.Item
//                             label="Password"
//                             name="password"
//                             rules={[{ required: true, message: 'Please enter your password!' }]}
//                         >
//                             <Input.Password
//                                 prefix={<LockOutlined className="site-form-item-icon" />}
//                                 placeholder="admin123"
//                                 size="large"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </Form.Item>

//                         <Form.Item>
//                             <div className="flex items-center justify-between">
//                                 <Checkbox>Remember me</Checkbox>
//                                 <a className="text-blue-500 hover:underline" href="/forgetpassword">
//                                     Forgot password?
//                                 </a>
//                             </div>
//                         </Form.Item>

//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" block className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
//                                 Login
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 </div>
//             {/* </div> */}
//         </div>
//     );
// }


// import { signInWithEmailAndPassword } from 'firebase/auth';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../../config/firebase';
// import { Form, Input, Checkbox, Button } from 'antd';
// import { UserOutlined, LockOutlined } from '@ant-design/icons';

// export default function LoginForm() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (values) => {
//         try {
//             await signInWithEmailAndPassword(auth, values.email, values.password);
//             console.log('Signed in successfully');
//             navigate('/'); // Redirect to dashboard or home
//         } catch (err) {
//             alert('Admin not registered');
//             console.error('Admin not registered', err);
//         }
//     };

//     return (
//         // <div className='p-20'>
//         <div className="flex items-center justify-center min-h-screen bg-gray-100 w-screen">
//             <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
//                 <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
//                 <Form
//                     className="login-form"
//                     onFinish={handleSubmit} // Use onFinish instead of onSubmitCapture
//                     initialValues={{ email, password }}
//                 >
//                     <Form.Item
//                         label="Email"
//                         name="email"
//                         rules={[
//                             { required: true, message: 'Please enter your email!' },
//                             { type: 'email', message: 'Enter a valid email!' },
//                         ]}
//                     >
//                         <Input
//                             prefix={<UserOutlined className="site-form-item-icon" />}
//                             placeholder="admin@demo.com"
//                             type="email"
//                             size="large"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                     </Form.Item>

//                     <Form.Item
//                         label="Password"
//                         name="password"
//                         rules={[{ required: true, message: 'Please enter your password!' }]}
//                     >
//                         <Input.Password
//                             prefix={<LockOutlined className="site-form-item-icon" />}
//                             placeholder="admin123"
//                             size="large"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </Form.Item>

//                     <Form.Item>
//                         <div className="flex items-center justify-between">
//                             <Checkbox>Remember me</Checkbox>
//                             <a className="text-blue-500 hover:underline" href="/forgetpassword">
//                                 Forgot password?
//                             </a>
//                         </div>
//                     </Form.Item>

//                     <Form.Item>
//                         <Button
//                             type="primary"
//                             htmlType="submit"
//                             block
//                             className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
//                         >
//                             Login
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </div>
//         </div>
//     );
// }





// src/components/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust path
import { Navigate, useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const { user, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            navigate('/users');
        } catch (error) {
            setError('Failed to log in: ' + error.message);
        }
    };

    if (user) return <Navigate to="/dashboard" />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    Sign In
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">{error}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>

                {/* Link to registration page */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don’t have an account?{' '}
                        <a href="/register" className="text-blue-500 hover:underline">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
