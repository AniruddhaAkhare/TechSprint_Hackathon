import { Route } from "react-router-dom";

const Welcome = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 w-screen">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
                <p className="mb-4">Please <a href="/login" className="text-blue-500 hover:underline">login</a> or <a href="/register" className="text-blue-500 hover:underline">register</a>.</p>
            </div>
        </div>
    );
};
export default Welcome;