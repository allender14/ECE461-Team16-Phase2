import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [setFileName] = useState('');
  const defaultTheme = createTheme();

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/zip'){
      addFile(droppedFile);
    } else {
      alert('Please provide a valid zip file.');
    }
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/zip'){
      addFile(selectedFile);
    } else {
      alert('Please provide a valid zip file.');
    }
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
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Upload Package
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 4,
          pb: 6,
          px: 4
        }}
      >
        {/* Add a button to go back to the homepage */}
        <Link to="/">
            <Button variant="outlined">
              Back
            </Button>
        </Link>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Drag and drop or select a zip file of the package you would like to upload
            to the registry. You may upload one or multiple files at once.
          </Typography>
        </Container>
        <Container maxWidth="xl">
          {/* Display the list of files above the drag-and-drop area */}
          {files.length > 0 && (
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <Button onClick={() => removeFile(index)}>Remove</Button>
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
            <Typography variant="body1" gutterBottom>
              Drag your zipped package file here
            </Typography>
            <Typography variant="body1" gutterBottom>
              or
            </Typography>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
            />
          </div>
          <Box sx={{ pt: 4 }}>
            <Button onClick={handleFileUpload} disabled={files.length === 0} variant="contained">
              Upload 
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default UploadPage;
