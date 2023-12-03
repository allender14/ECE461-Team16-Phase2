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
      { id: '197164276', name: 'Cloudinary', version: '7.2.1', readme: 'lots of text', rating: '{"URL":"https://github.com/cloudinary/cloudinary", "NET_SCORE":0.9, "RAMP_UP_SCORE":0.5, "CORRECTNESS_SCORE":0.7, "BUS_FACTOR_SCORE":0.3, "RESPONSIVE_MAINTAINER_SCORE":0.4, "LICENSE_SCORE":1, "DEPENDENCE SCORE:0.5, "REVIEWED_CODE_SCORE":0.19}'},
      { id: '967481617', name: 'Nullivex', version: '3.29.1', readme: 'lots of text', rating: '{"URL":"https://github.com/nullivex/nodist", "NET_SCORE":0.4, "RAMP_UP_SCORE":0.2, "CORRECTNESS_SCORE":0.3, "BUS_FACTOR_SCORE":0.2, "RESPONSIVE_MAINTAINER_SCORE":0.9, "LICENSE_SCORE":1, "DEPENDENCE SCORE:0.8, "REVIEWED_CODE_SCORE":0.92}'},
      { id: '418794191', name: 'Pino', version: '4.2.0', readme: 'lots of text', rating: '{"URL":"https://github.com/pinojs/pino", "NET_SCORE":0.6, "RAMP_UP_SCORE":0.3, "CORRECTNESS_SCORE":0.5, "BUS_FACTOR_SCORE":0.7, "RESPONSIVE_MAINTAINER_SCORE":0.1, "LICENSE_SCORE":0, "DEPENDENCE SCORE:0.4, "REVIEWED_CODE_SCORE":0.28}'}
    ];

    // Filter mock data based on search query
    const filteredResults = mockData.filter(
      (packageData) =>
        packageData.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                  key={result.name}
                  component={Link}
                  to={`/package/${result.name}`}
                  divider
                >
                  <ListItemText primary={`${result.name}`} />
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
