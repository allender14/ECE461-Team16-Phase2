import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setFile(droppedFile);
  }

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  }

  const handleFileUpload = () => {
    if (file && fileName.trim() !== '') {
      console.log(`Uploading file: ${file.name} with name: ${fileName}`);
      setFile(null); // Clear the file input field
      setFileName(''); // Clear the text box field
    } else {
      alert('Please provide a valid file and name.');
    }
  }

  return (
    <div>
      <h2>Upload Package</h2>
      <div
        className="upload-box"
        onDrop={handleFileDrop}
        onDragOver={(event) => event.preventDefault()}
        style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}
      >
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag your zipped package file here</p>
        )}
        <p>or</p>
        <input
          type="file"
          accept=".zip"
          onChange={(event) => setFile(event.target.files[0])}
        />
      </div>

      {/* Add a text box for the file name */}
      <input
        type="text"
        value={fileName}
        onChange={handleFileNameChange}
        placeholder="Enter file name"
      />

      <button onClick={handleFileUpload} disabled={!file || fileName.trim() === ''}>Upload</button>

      {/* Add a button to go back to the homepage */}
      <Link to="/">
        <button>Go Back to Homepage</button>
      </Link>
    </div>
  );
}

export default UploadPage;
