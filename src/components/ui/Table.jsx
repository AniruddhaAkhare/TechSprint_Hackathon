const Table = ({ children }) => {
    return <table className="w-full border-collapse">{children}</table>;
  };
  
  const TableHead = ({ children }) => {
    return <thead className="bg-gray-200">{children}</thead>;
  };
  
  const TableRow = ({ children }) => {
    return <tr className="border-b">{children}</tr>;
  };
  
  const TableHeader = ({ children }) => {
    return <th className="p-2 text-left">{children}</th>;
  };
  
  const TableBody = ({ children }) => {
    return <tbody>{children}</tbody>;
  };
  
  const TableCell = ({ children }) => {
    return <td className="p-2">{children}</td>;
  };
  
  export { Table, TableHead, TableRow, TableHeader, TableBody, TableCell };
  