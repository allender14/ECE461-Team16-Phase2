import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    addFile(droppedFile);
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    addFile(selectedFile);
  }

  const addFile = (newFile) => {
    if (newFile) {
      setFiles((prevFiles) => [...prevFiles, newFile]);
      setFileName(newFile.name);
    }
  }

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  }

  const handleFileUpload = () => {
    // Handle the upload logic for all files in the 'files' array
    if (files.length > 0) {
      console.log('Uploading files:', files.map((file) => file.name));
      // Clear the files array and file name after upload
      setFiles([]);
      setFileName('');
    } else {
      alert('Please provide at least one valid file.');
    }
  }

  return (
    <div>
      <h2>Upload Package</h2>

      {/* Display the list of files above the drag-and-drop area */}
      {files.length > 0 && (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              {file.name}
              <button onClick={() => removeFile(index)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <div
        className="upload-box"
        onDrop={handleFileDrop}
        onDragOver={(event) => event.preventDefault()}
        style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}
      >
        <p>Drag your zipped package file here</p>
        <p>or</p>
        <input
          type="file"
          accept=".zip"
          onChange={handleFileChange}
        />
      </div>

      <button onClick={handleFileUpload} disabled={files.length === 0}>Upload</button>

      {/* Add a button to go back to the homepage */}
      <Link to="/">
        <button>Go Back to Homepage</button>
      </Link>
    </div>
  );
}

export default UploadPage;
