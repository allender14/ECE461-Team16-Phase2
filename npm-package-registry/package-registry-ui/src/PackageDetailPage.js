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
import DownloadIcon from '@mui/icons-material/Download';

const PackageDetailPage = () => {
  const { packageName } = useParams();
  const defaultTheme = createTheme();
  const [packageInfo, setPackageInfo] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const colors = ['#221f1f', '#242746', '#2e3233', '#263238', '#26324a', '#263264', '#2B3264', '#2E3264'];

  const mockScores = {
    NET_SCORE: 0.9,
    RAMP_UP_SCORE: 0.5,
    CORRECTNESS_SCORE: 0.7,
    BUS_FACTOR_SCORE: 0.3,
    RESPONSIVE_MAINTAINER_SCORE: 0.4,
    LICENSE_SCORE: 1,
    DEPENDENCE_SCORE: 0.5,
    REVIEWED_CODE_SCORE: 0.3,
  };

  const [scores] = useState(mockScores);

  useEffect(() => {
    // Simulate fetching package details based on packageName (replace with actual query later)
    const mockData = [
      { id: '197164276', name: 'Cloudinary', version: '7.2.1', readme: 'lots of text', rating: '{"URL":"https://github.com/cloudinary/cloudinary", "NET_SCORE":0.9, "RAMP_UP_SCORE":0.5, "CORRECTNESS_SCORE":0.7, "BUS_FACTOR_SCORE":0.3, "RESPONSIVE_MAINTAINER_SCORE":0.4, "LICENSE_SCORE":1, "DEPENDENCE SCORE":0.5, "REVIEWED_CODE_SCORE":0.19}'},
      { id: '967481617', name: 'Nullivex', version: '3.29.1', readme: 'lots of text', rating: '{"URL":"https://github.com/nullivex/nodist", "NET_SCORE":0.4, "RAMP_UP_SCORE":0.2, "CORRECTNESS_SCORE":0.3, "BUS_FACTOR_SCORE":0.2, "RESPONSIVE_MAINTAINER_SCORE":0.9, "LICENSE_SCORE":1, "DEPENDENCE SCORE":0.8, "REVIEWED_CODE_SCORE":0.92}'},
      { id: '418794191', name: 'Pino', version: '4.2.0', readme: 'lots of text', rating: '{"URL":"https://github.com/pinojs/pino", "NET_SCORE":0.6, "RAMP_UP_SCORE":0.3, "CORRECTNESS_SCORE":0.5, "BUS_FACTOR_SCORE":0.7, "RESPONSIVE_MAINTAINER_SCORE":0.1, "LICENSE_SCORE":0, "DEPENDENCE SCORE":0.4, "REVIEWED_CODE_SCORE":0.28}'}
    ];

    const selectedPackage = mockData.find(pkg => pkg.name === packageName);
    if (selectedPackage) {
      setPackageInfo(selectedPackage);
    } else {
      // Handle case where package details for the given name are not found
      setPackageInfo({ name: 'Package Not Found', id: '', readme: '', rating: '', version: '' });
    }
  }, [packageName]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

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
        {/* Add "Back to Homepage" button */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="outlined">
            Back
          </Button>
        </Link>
        <Box sx={{ pt: 4 }}>
          <Typography variant="h2">{packageInfo.name}</Typography>
          <Typography variant="h5">{packageInfo.version} • Public • {packageInfo.id}</Typography>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Readme" />
            <Tab label="Rating" />
            <Tab label="Download" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {selectedTab === 0 && (
              <div>
                {packageInfo.readme}
              </div>
            )}
            {selectedTab === 1 && (
              <div>
                <Box sx={{ mt: 4 }}>
                  {Object.entries(scores).map(([key, value], index) => (
                    <div key={key} style={{ marginBottom: '30px' }}>
                      <div key={key} style={{ marginBottom: '10px' }}>
                        <div style={{ position: 'relative', backgroundColor: '#ddd', width: '100%', height: '40px', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ width: `${value * 100}%`, backgroundColor: colors[index % colors.length], height: '100%' }}></div>
                          <div style={{ position: 'absolute', top: '50%', left: '5px', transform: 'translateY(-50%)', color: 'white', zIndex: 1 }}>{key}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Box>
              </div>
            )}
            {selectedTab === 2 && (
              <div>
                <Button variant="contained">
                  {packageInfo.name} v{packageInfo.version}  <DownloadIcon />
                </Button>
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
