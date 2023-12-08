import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Add Routes to the import
import HomePage from './HomePage';
import UploadPage from './UploadPage';
import SearchPage from './SearchPage';
import PackageDetailPage from './PackageDetailPage';
import RatePage from './RatePage';
import LoginPage from './LoginPage';
import DeletePage from './DeletePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/package/:packageName" element={<PackageDetailPage />} />
          <Route path="/rate" element={<RatePage />} />
          <Route path="/delete" element={<DeletePage />} />
          {/* Add routes for other functionalities here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;