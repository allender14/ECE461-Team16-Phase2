import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PackageDetailPage = () => {
  const { packageName } = useParams();
  const [packageInfo, setPackageInfo] = useState({ packageName: '', otherInfo: '' });

  useEffect(() => {
    // Simulate fetching package details based on packageName (replace with actual query later)
    const mockData = [
      { packageName: 'PackageA', otherInfo: 'InfoA' },
      { packageName: 'PackageB', otherInfo: 'InfoB' },
      { packageName: 'PackageC', otherInfo: 'InfoC' },
    ];

    const selectedPackage = mockData.find(pkg => pkg.packageName === packageName);
    if (selectedPackage) {
      setPackageInfo(selectedPackage);
    } else {
      // Handle case where package details for given name are not found
      setPackageInfo({ packageName: 'Package Not Found', otherInfo: '' });
    }
  }, [packageName]);

  return (
    <div>
      <h2>Package Details</h2>
      <p>Package Name: {packageInfo.packageName}</p>
      <p>Other Info: {packageInfo.otherInfo}</p>
    </div>
  );
};

export default PackageDetailPage;
