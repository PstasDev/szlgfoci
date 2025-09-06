'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Stack,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AppRegistration as RegistrationIcon,
  Sports as SportsIcon,
} from '@mui/icons-material';

const UpcomingSeason: React.FC = () => {
  const startDate = new Date('2025-10-15');
  const today = new Date();
  const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleRegistrationClick = () => {
    // Here you would typically open the registration form or navigate to it
    alert('Csapat regisztráció űrlap megnyitása...');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <SportsIcon sx={{ fontSize: 40 }} />
            SZLG Liga 25/26
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            A következő szezon hamarosan kezdődik!
          </Typography>
        </Box>

        <Divider />

        {/* Main Content */}
        <Stack spacing={3} alignItems="center">
          {/* Start Date Card */}
          <Card 
            sx={{ 
              width: '100%', 
              maxWidth: 600,
              textAlign: 'center',
              borderLeft: 4,
              borderLeftColor: 'primary.main'
            }}
          >
            <CardContent sx={{ py: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CalendarIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Kezdés Dátuma
                </Typography>
              </Box>
              
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'text.primary',
                  mb: 2
                }}
              >
                2025. október 15.
              </Typography>
              
              <Typography variant="h6" color="text.secondary">
                {daysUntilStart > 0 ? (
                  `Még ${daysUntilStart} nap a kezdésig`
                ) : (
                  'A szezon már elkezdődött!'
                )}
              </Typography>
            </CardContent>
          </Card>

          {/* Registration Section */}
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              width: '100%', 
              maxWidth: 600,
              textAlign: 'center',
              backgroundColor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <RegistrationIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Csapat Regisztráció
              </Typography>
            </Box>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3, fontSize: '1.1rem' }}
            >
              Regisztrálja csapatát a SZLG Liga 25/26 szezonra!
              <br />
              A regisztráció jelenleg nyitott.
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              onClick={handleRegistrationClick}
              startIcon={<RegistrationIcon />}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
                transition: 'all 0.3s ease'
              }}
            >
              Csapat Regisztráció Űrlap
            </Button>
          </Paper>

          {/* Information Notice */}
          <Paper 
            sx={{ 
              p: 3, 
              width: '100%', 
              maxWidth: 600,
              backgroundColor: 'primary.50',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              A részletes információk, csapat listák és menetrend hamarosan elérhető lesz.
              <br />
              Kövesse figyelemmel a frissítéseket!
            </Typography>
          </Paper>
        </Stack>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 SZLG - Labdarúgó Bajnokság
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default UpcomingSeason;
