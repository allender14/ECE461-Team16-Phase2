import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { List, ListItemButton, ListItemText } from '@mui/material';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const defaultTheme = createTheme();
  const [data, setData] = useState(null);

  useEffect(() => {
    const AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: sessionStorage.getItem('accessKey'),
      secretAccessKey: sessionStorage.getItem('secretAccessKey'),
      region: 'us-east-1'
    });

    const dynamodb = new AWS.DynamoDB();

    const params = {
      TableName: 'registry'
    };

    dynamodb.scan(params, (err, responseData) => {
      if (err) {
        console.error('Error fetching data:', err);
      } else {
        setData(responseData);
      }
    });
  }, []);

  const handleSearch = () => {
    // Filter mock data based on search query
    const filteredResults = data.Items.filter(
      (packageData) =>
        packageData.name.S.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Search Packages
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
        {/* Add "Back to Homepage" button */}
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <Button variant="outlined">
            Back
          </Button>
        </Link>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Search for any packages that have already been uploaded to the registry.
          </Typography>
        </Container>
        <Container maxWidth="lg">
          <TextField
            placeholder="Enter package name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mt: 2, 
                  mb: 2, 
                  mr: 2,
                  width: '100%'
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Button variant="contained" onClick={handleSearch} disabled={searchQuery.trim().length === 0} sx={{ mt: 2 }}>
              Search
            </Button>
            <List sx={{ width: '100%' }}>
              {searchResults.map((result) => (
                <ListItemButton
                  key={result.name.S}
                  component={Link}
                  to={`/package/${result.name.S}`}
                  divider
                >
                  <ListItemText primary={`${result.name.S}`} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SearchPage;
