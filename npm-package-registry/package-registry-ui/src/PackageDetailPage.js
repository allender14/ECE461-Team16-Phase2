import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const PackageDetailPage = () => {
  const { packageName } = useParams();
  const defaultTheme = createTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const colors = ['#221f1f', '#242746', '#2e3233', '#263238', '#26324a', '#263264', '#2B3264', '#2E3264'];
  const ratings = ['NET SCORE', 'RAMP UP SCORE', 'CORRECTNESS SCORE', 'BUS FACTOR SCORE', 
    'RESPONSIVE MAINTAINER SCORE', 'LICENSE SCORE', 'DEPENDENCE_ CORE', 'REVIEWED CODE SCORE']
  const [data, setData] = useState(null);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

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
        const foundItem = responseData.Items.find(item => item.name.S === packageName);
        setData(foundItem);
      }
    });
  }, [packageName]);

  let ratingArray = [];
  if (data && data.ratings && typeof data.ratings.S === 'string') {
    const matches = data.ratings.S.match(/\d+(\.\d+)?/g);
    
    if (matches) {
      ratingArray = matches.map(value => Number(value));
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Package Information
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
        {/* <Link to="/home" style={{ textDecoration: 'none' }}>
          <Button variant="outlined">
            Back
          </Button>
        </Link> */}
        <Box sx={{ pt: 4 }}>
          <Typography variant="h2">{data ? data.name.S : 'Loading...'}</Typography>
          <Typography variant="h5">{data ? data.version.S: 'Loading...'} • Public • {data ? data.id.S : 'Loading...'}</Typography>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Readme" />
            <Tab label="Rating" />
            <Tab label="Download" />
            <Tab label="Delete" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <div>
                temp readme
              </div>
            )}
            {selectedTab === 1 && (
              <div>
                {(data && ratings.length === ratingArray.length) ? (
                  <Box sx={{ mt: 4 }}>
                    {ratings.map((ratingName, index) => (
                      <div key={ratingName} style={{ marginBottom: '30px' }}>
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ position: 'relative', backgroundColor: '#ddd', width: '100%', height: '40px', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ width: `${ratingArray[index] * 100}%`, backgroundColor: colors[index % colors.length], height: '100%' }}></div>
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '5px',
                              transform: 'translateY(-50%)',
                              color: 'white',
                              zIndex: 1,
                              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                              // Adjust the text shadow values for the desired outline effect
                            }}>{ratingName}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Box>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
            )}
            {selectedTab === 2 && (
              <div>
                temp download
              </div>
            )}
            {selectedTab === 3 && (
              <div>
                <Link to="/home">
                  <Button variant="contained">
                    Temp Delete
                  </Button>
                </Link>
              </div>
            )}
            {/* Add more conditional rendering for other tabs */}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PackageDetailPage;
