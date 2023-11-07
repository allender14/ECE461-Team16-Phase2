import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Package Registry</h1>
      <Link to="/upload"><button>Upload Package</button></Link>
      <Link to="/update"><button>Update Package</button></Link>
      <Link to="/rate"><button>Rate Package</button></Link>
      <Link to="/download"><button>Download Package</button></Link>
    </div>
  );
}

export default HomePage;