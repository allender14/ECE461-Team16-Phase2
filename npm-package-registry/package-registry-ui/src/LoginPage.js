import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [accessKey, setAccessKey] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [credentialsSet, setCredentialsSet] = useState(false); // State to track if credentials are set
  const defaultTheme = createTheme();

  const handleAccessKeyChange = (e) => {
    setAccessKey(e.target.value);
  };

  const handleSecretAccessKeyChange = (e) => {
    setSecretAccessKey(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    sessionStorage.setItem('accessKey', accessKey);
    sessionStorage.setItem('secretAccessKey', secretAccessKey);
    setCredentialsSet(true); // Update state to indicate credentials are set
  };

  useEffect(() => {
    // Check session storage on initial load to display Home button
    if (sessionStorage.getItem('accessKey') && sessionStorage.getItem('secretAccessKey')) {
      setCredentialsSet(true);
    }
  }, []);

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
          <form onSubmit={handleFormSubmit}>
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
          {credentialsSet && ( // Show Home button when credentials are set
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Home
              </Button>
            </Link>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;
