import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Add Routes to the import
import HomePage from './HomePage';
import UploadPage from './UploadPage';
import SearchPage from './SearchPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/search" element={<SearchPage />} />
          {/* Add routes for other functionalities here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;