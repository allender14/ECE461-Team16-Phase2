import React, { useState } from 'react';
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

  const handleSearch = () => {
    // Simulate search with mock data (replace with DynamoDB query later)
    const mockData = [
      { packageName: 'PackageA', otherInfo: 'InfoA' },
      { packageName: 'PackageB', otherInfo: 'InfoB' },
      { packageName: 'PackageC', otherInfo: 'InfoC' },
    ];

    // Filter mock data based on search query
    const filteredResults = mockData.filter(
      (packageData) =>
        packageData.packageName.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" sx={{ mt: 3 }}>
            Back to Homepage
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
                  key={result.packageName}
                  component={Link}
                  to={`/packages/${result.packageName}`}
                  divider
                >
                  <ListItemText primary={`${result.packageName} - ${result.otherInfo}`} />
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
