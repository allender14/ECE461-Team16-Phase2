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
      { id: '197164276', name: 'Cloudinary', version: '7.2.1', readme: 'lots of text', rating: '{"URL":"https://github.com/cloudinary/cloudinary", "NET_SCORE":0.9, "RAMP_UP_SCORE":0.5, "CORRECTNESS_SCORE":0.7, "BUS_FACTOR_SCORE":0.3, "RESPONSIVE_MAINTAINER_SCORE":0.4, "LICENSE_SCORE":1, "DEPENDENCE SCORE:0.5, "REVIEWED_CODE_SCORE":0.19}'},
      { id: '967481617', name: 'Nullivex', version: '3.29.1', readme: 'lots of text', rating: '{"URL":"https://github.com/nullivex/nodist", "NET_SCORE":0.4, "RAMP_UP_SCORE":0.2, "CORRECTNESS_SCORE":0.3, "BUS_FACTOR_SCORE":0.2, "RESPONSIVE_MAINTAINER_SCORE":0.9, "LICENSE_SCORE":1, "DEPENDENCE SCORE:0.8, "REVIEWED_CODE_SCORE":0.92}'},
      { id: '418794191', name: 'Pino', version: '4.2.0', readme: 'lots of text', rating: '{"URL":"https://github.com/pinojs/pino", "NET_SCORE":0.6, "RAMP_UP_SCORE":0.3, "CORRECTNESS_SCORE":0.5, "BUS_FACTOR_SCORE":0.7, "RESPONSIVE_MAINTAINER_SCORE":0.1, "LICENSE_SCORE":0, "DEPENDENCE SCORE:0.4, "REVIEWED_CODE_SCORE":0.28}'},
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
                spacing={4}
                justifyContent="center"
              >
                <Link to="/upload">
                  <Button variant="outlined">Upload Package</Button>
                </Link>
                <Link to="/update">
                  <Button variant="outlined">Update Package</Button>
                </Link>
                <Link to="/search">
                  <Button variant="outlined">Search Package</Button>
                </Link>
                <Link to="/rate">
                  <Button variant="outlined">Rate Package</Button>
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
                  key={packageData.id}
                  component={Link}
                  to={`/packages/${packageData.name}`}
                  divider
                >
                  <ListItemText primary={`${packageData.name}`} />
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
