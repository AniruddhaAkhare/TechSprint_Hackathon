export const Input = ({ type = "text", placeholder, ...props }) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full p-2 border rounded-md focus:outline-blue-500"
        {...props}
      />
    );
  };
  