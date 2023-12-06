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
import AWS_CONFIG from './awsConfig';

const HomePage = () => {
  const defaultTheme = createTheme();
  const [data, setData] = useState(null);
  const [accessKey, setAccessKey] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');

  const handleLogout = () => {
    setAccessKey('');
    setSecretAccessKey('');

    const updatedConfig = {
      ...AWS_CONFIG,
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
    };
    Object.assign(AWS_CONFIG, updatedConfig);
  };

  useEffect(() => {
    const AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: '',
      secretAccessKey: '',
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
        console.log('Items retrieved:', responseData.Items);
        setData(responseData);
      }
    });
  }, []);

  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <AppBar position="relative">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" color="inherit" noWrap>
              ACME Corporation Package Registry
            </Typography>
            <Button color="inherit" onClick={handleLogout} component={Link} to="/">
              Logout
            </Button>
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
              {data && data.Items && data.Items.length > 0 && data.Items.map((item) => (
                <ListItemButton
                  key={item.id.S} // Assuming 'id' is a string attribute (use .S for string type)
                  component={Link}
                  to={`/package/${item.name.S}`} // Assuming 'name' is a string attribute
                  divider
                >
                  <ListItemText primary={`${item.name.S}`} /> {/* Display name */}
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
