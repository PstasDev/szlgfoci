'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
} from '@mui/material';
import GoogleSportsLayout from '@/components/GoogleSportsLayout';
import GoogleSportsMatchCard from '@/components/GoogleSportsMatchCard';
import GoogleSportsLeagueTable from '@/components/GoogleSportsLeagueTable';
import GoogleSportsMatchStats from '@/components/GoogleSportsMatchStats';
import { getLiveMatches, getUpcomingMatches, getRecentMatches } from '@/data/mockData';
import { useRouter } from 'next/navigation';

const GoogleSportsDemo: React.FC = () => {
  const router = useRouter();
  const liveMatches = getLiveMatches();
  const upcomingMatches = getUpcomingMatches(2);
  const recentMatches = getRecentMatches(2);

  // Get a sample match for statistics
  const sampleMatch = recentMatches[0] || liveMatches[0] || upcomingMatches[0];

  return (
    <GoogleSportsLayout
      showBackButton={true}
      onBack={() => router.back()}
    >
      <Stack spacing={4}>
        {/* Demo Header */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 3,
          background: 'linear-gradient(135deg, rgba(234, 67, 53, 0.1) 0%, rgba(251, 188, 4, 0.1) 100%)',
          borderRadius: 3,
          border: '1px solid rgba(234, 67, 53, 0.2)'
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#e8eaed',
              fontWeight: 700,
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            🚀 Google Sports Design Demo
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#9aa0a6',
              fontWeight: 400,
              mb: 2
            }}
          >
            Teljes komponens kollekció bemutatása
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#4285f4',
              fontWeight: 500
            }}
          >
            Itt láthatja az összes komponenst Google Sports stílusban
          </Typography>
        </Box>
        {/* Featured Match */}
        {sampleMatch && (
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#e8eaed',
                fontWeight: 600,
                mb: 2
              }}
            >
              Kiemelt mérkőzés
            </Typography>
            <GoogleSportsMatchCard match={sampleMatch} variant="detailed" />
          </Box>
        )}

        {/* League Table */}
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#e8eaed',
              fontWeight: 600,
              mb: 2
            }}
          >
            Liga tabella
          </Typography>
          <GoogleSportsLeagueTable />
        </Box>

        {/* Matches Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
          gap: 3 
        }}>
          {/* Live Matches */}
          {liveMatches.length > 0 && (
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#ea4335',
                  fontWeight: 600,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: '#ea4335' 
                  }} 
                />
                Élő mérkőzések
              </Typography>
              <Stack spacing={2}>
                {liveMatches.slice(0, 3).map((match) => (
                  <GoogleSportsMatchCard 
                    key={match.id} 
                    match={match} 
                    variant="compact" 
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Upcoming Matches */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#e8eaed',
                fontWeight: 600,
                mb: 2
              }}
            >
              Következő mérkőzések
            </Typography>
            <Stack spacing={2}>
              {upcomingMatches.map((match) => (
                <GoogleSportsMatchCard 
                  key={match.id} 
                  match={match} 
                  variant="compact" 
                />
              ))}
            </Stack>
          </Box>

          {/* Recent Results */}
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#e8eaed',
                fontWeight: 600,
                mb: 2
              }}
            >
              Legutóbbi eredmények
            </Typography>
            <Stack spacing={2}>
              {recentMatches.map((match) => (
                <GoogleSportsMatchCard 
                  key={match.id} 
                  match={match} 
                  variant="compact" 
                />
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Match Statistics */}
        {sampleMatch && (
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#e8eaed',
                fontWeight: 600,
                mb: 2
              }}
            >
              Mérkőzés statisztikák
            </Typography>
            <GoogleSportsMatchStats match={sampleMatch} />
          </Box>
        )}
      </Stack>
    </GoogleSportsLayout>
  );
};

export default GoogleSportsDemo;
