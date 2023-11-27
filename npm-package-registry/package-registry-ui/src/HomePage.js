import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const HomePage = () => {
  const [packageList, setPackageList] = useState([]);
  const defaultTheme = createTheme();

  useEffect(() => {
    // Simulate fetching all packages from DynamoDB (replace with actual query later)
    const mockData = [
      { packageName: 'PackageA', otherInfo: 'InfoA' },
      { packageName: 'PackageB', otherInfo: 'InfoB' },
      { packageName: 'PackageC', otherInfo: 'InfoC' },
    ];

    setPackageList(mockData);
  }, []);

  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              ACME Corporation Package Registry
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="lg">
              <Stack
                sx={{ pt: 0 }}
                direction="row"
                spacing={10}
                justifyContent="center"
              >
                <Link to="/upload">
                  <Button variant="contained">Upload Package</Button>
                </Link>
                <Link to="/update">
                  <Button variant="contained">Update Package</Button>
                </Link>
                <Link to="/search">
                  <Button variant="contained">Search Package</Button>
                </Link>
                <Link to="/rate">
                  <Button variant="contained">Rate Package</Button>
                </Link>
              </Stack>
            </Container>
          </Box>
          <Container maxwidth="lg">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Package Directory
            </Typography>
            <List>
              {packageList.map((packageData) => (
                <ListItemButton
                  key={packageData.packageName}
                  component={Link}
                  to={`/packages/${packageData.packageName}`}
                  divider
                >
                  <ListItemText primary={`${packageData.packageName} - ${packageData.otherInfo}`} />
                </ListItemButton>
              ))}
            </List>
          </Container>
        </main>
      </ThemeProvider>
    </div>
  );
};

export default HomePage;
