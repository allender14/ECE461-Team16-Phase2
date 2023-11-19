// SearchPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    // Simulate search with mock data (replace with DynamoDB query later)
    const mockData = [
      { packageName: 'PackageA', otherInfo: 'InfoA' },
      { packageName: 'PackageB', otherInfo: 'InfoB' },
      { packageName: 'PackageC', otherInfo: 'InfoC' },
    ];

    // Filter mock data based on search query
    const filteredResults = mockData.filter(
      (packageData) =>
        packageData.packageName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  return (
    <div>
      <h2>Package Search</h2>
      <input
        type="text"
        placeholder="Enter package name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <h3>Search Results:</h3>
      <ul>
        {searchResults.map((result) => (
          <li key={result.packageName}>
            {result.packageName} - {result.otherInfo}
          </li>
        ))}
      </ul>

      {/* Add "Back to Homepage" button */}
      <Link to="/">
        <button>Back to Homepage</button>
      </Link>
    </div>
  );
};

export default SearchPage;
