import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RatePage = () => {
  const [urlInput, setReviewText] = useState('');

  const handleInputChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmit = () => {
    // Here, you can implement the functionality to submit the review text
    // For now, let's just log it and clear the text box
    console.log('Submitted review:', urlInput);
    setReviewText('');
  };

  return (
    <div>
      <h2>Rate Package</h2>
      <input
        type="text"
        placeholder="Enter package URL"
        value={urlInput}
        onChange={handleInputChange}
        style={{ width: '300px' }}
      />
      <button onClick={handleSubmit}>Rate</button>
      <Link to="/">
        <button>Go Back to Homepage</button>
      </Link>
    </div>
  );
};

export default RatePage;