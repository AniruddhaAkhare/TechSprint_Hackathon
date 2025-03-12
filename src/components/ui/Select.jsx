// export default function Select ({ options, ...props }) {
//     return (
//       <select className="w-full p-2 border rounded-md focus:outline-blue-500" {...props}>
//         {options.map((option, index) => (
//           <option key={index} value={option.value}>{option.label}</option>
//         ))}
//       </select>
//     );
//   };
  

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}


export default function Select ({ options = [], ...props }) {
    return (
      <select className="w-full p-2 border rounded-md focus:outline-blue-500" {...props}>
        {options.length > 0 ? (
          options.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))
        ) : (
          <option value="" disabled>No options available</option>
        )}
      </select>
    );
  };
  