

import React from "react";

const CompanyDetails = ({ companyData, setCompanyData, isEditing, renderField }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="flex items-center justify-between">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Company Details
      </h3>
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      >
        {isEditing ? (
          <>
            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save
          </>
        ) : (
          <>
            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </>
        )}
      </button>
    </div>
  </div>

<div className="px-6 py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Company Name */}
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center">
        <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Company Name
      </label>
      {isEditing ? (
        <input
          type="text"
          value={companyData.name}
          onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
          placeholder="Enter company name"
          className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner placeholder-gray-400 text-sm"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-lg shadow-inner">{renderField(companyData.name) || <span className="text-gray-400">Not specified</span>}</p>
      )}
    </div>

    {/* Domain */}
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center">
        <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        Domain
      </label>
      {isEditing ? (
        <input
          type="text"
          value={companyData.domain}
          onChange={(e) => setCompanyData({ ...companyData, domain: e.target.value })}
          placeholder="Enter domain"
          className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner placeholder-gray-400 text-sm"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-lg shadow-inner">{renderField(companyData.domain) || <span className="text-gray-400">Not specified</span>}</p>
      )}
    </div>

    {/* Phone */}
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center">
        <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Phone
      </label>
      {isEditing ? (
        <input
          type="text"
          value={companyData.phone}
          onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
          placeholder="Enter phone number"
          className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner placeholder-gray-400 text-sm"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-lg shadow-inner">{renderField(companyData.phone) || <span className="text-gray-400">Not specified</span>}</p>
      )}
    </div>

    {/* Email */}
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center">
        <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Email
      </label>
      {isEditing ? (
        <input
          type="email"
          value={companyData.email}
          onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
          placeholder="Enter email"
          className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner placeholder-gray-400 text-sm"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-lg shadow-inner">{renderField(companyData.email) || <span className="text-gray-400">Not specified</span>}</p>
      )}
    </div>

    {/* Address */}
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center">
        <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Company Address
      </label>
      {isEditing ? (
        <input
          type="text"
          value={companyData.address}
          onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
          placeholder="Enter Address"
          className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner placeholder-gray-400 text-sm"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-lg shadow-inner">{renderField(companyData.address) || <span className="text-gray-400">Not specified</span>}</p>
      )}
    </div>

    {/* City */}
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center">
        <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        City
      </label>
      {isEditing ? (
        <input
          type="text"
          value={companyData.city}
          onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
          placeholder="Enter city"
          className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner placeholder-gray-400 text-sm"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-lg shadow-inner">{renderField(companyData.city) || <span className="text-gray-400">Not specified</span>}</p>
      )}
    </div>

    {/* Career Page */}
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center">
        <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        Company's Career Page
      </label>
      {isEditing ? (
        <input
          type="text"
          value={companyData.url}
          onChange={(e) => setCompanyData({ ...companyData, url: e.target.value })}
          placeholder="Enter URL"
          className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner placeholder-gray-400 text-sm"
        />
      ) : companyData.url ? (
        <a
          href={companyData.url.startsWith('http') ? companyData.url : `https://${companyData.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline bg-indigo-50 px-4 py-3 rounded-lg shadow-inner inline-flex items-center gap-1 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {renderField(companyData.url)}
        </a>
      ) : (
        <p className="text-sm text-gray-400 bg-gray-50 px-4 py-3 rounded-lg shadow-inner">Not specified</p>
      )}
    </div>

    {/* Company Type */}
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center">
        <svg className="w-4 h-4 mr-1.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Company Type
      </label>
      {isEditing ? (
        <input
          type="text"
          value={companyData.companyType}
          onChange={(e) => setCompanyData({ ...companyData, companyType: e.target.value })}
          placeholder="Enter company type"
          className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner placeholder-gray-400 text-sm"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-4 py-3 rounded-lg shadow-inner">{renderField(companyData.companyType) || <span className="text-gray-400">Not specified</span>}</p>
      )}
    </div>
  </div>
</div>
</div>
  );
};

export default CompanyDetails;