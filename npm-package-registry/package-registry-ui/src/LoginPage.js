// LoginForm.js

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import AWS_CONFIG from './awsConfig';

const LoginForm = () => {
  const [accessKey, setAccessKey] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const defaultTheme = createTheme();

  const handleAccessKeyChange = (e) => {
    setAccessKey(e.target.value);
  };

  const handleSecretAccessKeyChange = (e) => {
    setSecretAccessKey(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.preventDefault();
    // Update the AWS credentials in awsConfig.js
    const updatedConfig = {
      ...AWS_CONFIG,
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
    };
    // Update the AWS_CONFIG object with the new credentials
    // This assumes that AWS_CONFIG is a mutable object, not a frozen constant
    Object.assign(AWS_CONFIG, updatedConfig);
    console.log('AWS credentials updated:', updatedConfig);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Login
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 4,
          pb: 6,
          px: 4,
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Enter your AWS credentials
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Access Key ID"
              value={accessKey}
              onChange={handleAccessKeyChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Secret Access Key"
              value={secretAccessKey}
              onChange={handleSecretAccessKeyChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Link to="/home">
              <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              >
              Login
              </Button>
            </Link>
          </form>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;
