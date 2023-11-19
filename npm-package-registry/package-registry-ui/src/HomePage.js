// HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [packageList, setPackageList] = useState([]);

  useEffect(() => {
    // Simulate fetching all packages from DynamoDB (replace with actual query later)
    const mockData = [
      { packageName: 'PackageA', otherInfo: 'InfoA' },
      { packageName: 'PackageB', otherInfo: 'InfoB' },
      { packageName: 'PackageC', otherInfo: 'InfoC' },
    ];

    setPackageList(mockData);
  }, []);

  return (
    <div>
      <h1>Welcome to the Package Registry</h1>
      <Link to="/upload"><button>Upload Package</button></Link>
      <Link to="/update"><button>Update Package</button></Link>
      <Link to="/search"><button>Search Package</button></Link>

      <h2>Package Directory</h2>
      <ul>
        {packageList.map((packageData) => (
          <li key={packageData.packageName}>
            {packageData.packageName} - {packageData.otherInfo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
