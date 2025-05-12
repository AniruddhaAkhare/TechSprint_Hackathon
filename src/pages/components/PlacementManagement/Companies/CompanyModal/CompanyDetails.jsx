const CompanyDetails = ({ companyData, setCompanyData, isEditing, renderField }) => {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-medium mb-2">Company Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Company Name</label>
            {isEditing ? (
              <input
                type="text"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                placeholder="Enter company name"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            ) : (
              <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.name)}</p>
            )}
          </div>
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Domain</label>
            {isEditing ? (
              <input
                type="text"
                value={companyData.domain}
                onChange={(e) => setCompanyData({ ...companyData, domain: e.target.value })}
                placeholder="Enter domain"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            ) : (
              <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.domain)}</p>
            )}
          </div>
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Phone</label>
            {isEditing ? (
              <input
                type="text"
                value={companyData.phone}
                onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                placeholder="Enter phone number"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            ) : (
              <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.phone)}</p>
            )}
          </div>
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={companyData.email}
                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                placeholder="Enter email"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            ) : (
              <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.email)}</p>
            )}
          </div>
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">City</label>
            {isEditing ? (
              <input
                type="text"
                value={companyData.city}
                onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                placeholder="Enter city"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            ) : (
              <p className="mt-1 text-xs sm:text-sm text-gray-900">{renderField(companyData.city)}</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default CompanyDetails;