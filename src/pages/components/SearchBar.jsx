import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, handleSearch }) => {
    return (
        <form className="flex" role="search" onSubmit={handleSearch}>
            <input
                className="form-control border-gray-300 rounded-l py-2 px-4"
                type="text"
                placeholder="Search by name"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                className="bg-green-600 text-white py-2 px-4 rounded-r hover:bg-green-700 transition duration-200 ml-2"
                type="submit"
            >
                Search
            </button>
        </form>
    );
};

export default SearchBar;
