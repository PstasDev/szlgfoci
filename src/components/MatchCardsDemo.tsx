'use client';

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import MatchCard from './MatchCard';
import MatchesList from './MatchesList';
import ErrorDisplay from './ErrorDisplay';
import { useTournamentData } from '@/hooks/useTournamentData';
import { getErrorInfo, isEmptyDataError } from '@/utils/errorUtils';

const MatchCardsDemo: React.FC = () => {
  const { matches, loading, error, refetch } = useTournamentData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#42a5f5' }} />
      </Box>
    );
  }

  if (error || isEmptyDataError(matches)) {
    const errorInfo = getErrorInfo('matches', error ? { message: error } : undefined);
    return (
      <Box sx={{ p: 3, backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
        <ErrorDisplay 
          errorInfo={errorInfo}
          onRetry={refetch}
          fullPage
        />
      </Box>
    );
  }

  const liveMatch = matches.find(m => m.status === 'live');
  const finishedMatch = matches.find(m => m.status === 'finished');
  const upcomingMatch = matches.find(m => m.status === 'upcoming');

  return (
    <Box sx={{ p: 3, backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <Typography variant="h3" sx={{ color: '#e8eaed', mb: 4, fontWeight: 700 }}>
        Match Card Variants Demo
      </Typography>

      {/* Individual Card Variants */}
      <Typography variant="h4" sx={{ color: '#e8eaed', mb: 3, fontWeight: 600 }}>
        Individual Card Variants
      </Typography>

      {/* Detailed Variant */}
      <Typography variant="h6" sx={{ color: '#4285f4', mb: 2, fontWeight: 600 }}>
        Detailed Variant (for featured matches, main pages)
      </Typography>
      <Box sx={{ mb: 4, maxWidth: 600 }}>
        {liveMatch && <MatchCard match={liveMatch} variant="detailed" />}
      </Box>

      <Divider sx={{ borderColor: '#404040', my: 4 }} />

      {/* Compact Variant */}
      <Typography variant="h6" sx={{ color: '#4285f4', mb: 2, fontWeight: 600 }}>
        Compact Variant (for match lists, results pages)
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500 }}>
        {finishedMatch && <MatchCard match={finishedMatch} variant="compact" />}
        {upcomingMatch && <MatchCard match={upcomingMatch} variant="compact" />}
      </Box>

      <Divider sx={{ borderColor: '#404040', my: 4 }} />

      {/* Mini Variant */}
      <Typography variant="h6" sx={{ color: '#4285f4', mb: 2, fontWeight: 600 }}>
        Mini Variant (for sidebars, quick previews)
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 280 }}>
        {matches.slice(0, 3).map((match) => (
          <MatchCard key={match.id} match={match} variant="mini" />
        ))}
      </Box>

      <Divider sx={{ borderColor: '#404040', my: 4 }} />

      {/* MatchesList Components */}
      <Typography variant="h4" sx={{ color: '#e8eaed', mb: 3, fontWeight: 600 }}>
        MatchesList Component Examples
      </Typography>

      {/* List Layout */}
      <Typography variant="h6" sx={{ color: '#4285f4', mb: 2, fontWeight: 600 }}>
        List Layout with Compact Cards
      </Typography>
      <Box sx={{ mb: 4, maxWidth: 800 }}>
        <MatchesList
          matches={matches.slice(0, 3)}
          title="Recent Matches"
          variant="compact"
          layout="list"
          maxItems={3}
        />
      </Box>

      <Divider sx={{ borderColor: '#404040', my: 4 }} />

      {/* Grid Layout */}
      <Typography variant="h6" sx={{ color: '#4285f4', mb: 2, fontWeight: 600 }}>
        Grid Layout with Mini Cards
      </Typography>
      <Box sx={{ mb: 4 }}>
        <MatchesList
          matches={matches.slice(0, 6)}
          title="All Matches Grid"
          variant="mini"
          layout="grid"
          maxItems={6}
        />
      </Box>

      <Divider sx={{ borderColor: '#404040', my: 4 }} />

      {/* Loading State */}
      <Typography variant="h6" sx={{ color: '#4285f4', mb: 2, fontWeight: 600 }}>
        Loading State
      </Typography>
      <Box sx={{ mb: 4, maxWidth: 800 }}>
        <MatchesList
          matches={[]}
          title="Loading Matches..."
          variant="compact"
          layout="list"
          loading={true}
        />
      </Box>

      <Divider sx={{ borderColor: '#404040', my: 4 }} />

      {/* Empty State */}
      <Typography variant="h6" sx={{ color: '#4285f4', mb: 2, fontWeight: 600 }}>
        Empty State
      </Typography>
      <Box sx={{ mb: 4, maxWidth: 800 }}>
        <MatchesList
          matches={[]}
          title="No Matches Available"
          variant="compact"
          layout="list"
          emptyMessage="There are no matches scheduled at this time."
        />
      </Box>

      <Divider sx={{ borderColor: '#404040', my: 4 }} />

      {/* Usage Examples */}
      <Typography variant="h4" sx={{ color: '#e8eaed', mb: 3, fontWeight: 600 }}>
        Usage Examples Throughout the Site
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: '#2d2d2d', border: '1px solid #404040' }}>
        <Typography variant="h6" sx={{ color: '#e8eaed', mb: 2 }}>
          How to use these components:
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#4285f4', mb: 1, fontWeight: 600 }}>
            Homepage - Featured Match:
          </Typography>
          <Typography variant="body2" sx={{ color: '#9aa0a6', fontFamily: 'monospace', p: 1, backgroundColor: '#1a1a1a', borderRadius: 1 }}>
            {`<MatchCard match={featuredMatch} variant="detailed" />`}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#4285f4', mb: 1, fontWeight: 600 }}>
            Matches Page - All Matches:
          </Typography>
          <Typography variant="body2" sx={{ color: '#9aa0a6', fontFamily: 'monospace', p: 1, backgroundColor: '#1a1a1a', borderRadius: 1 }}>
            {`<MatchesList matches={allMatches} title="All Matches" variant="compact" layout="list" />`}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#4285f4', mb: 1, fontWeight: 600 }}>
            Sidebar - Quick Overview:
          </Typography>
          <Typography variant="body2" sx={{ color: '#9aa0a6', fontFamily: 'monospace', p: 1, backgroundColor: '#1a1a1a', borderRadius: 1 }}>
            {`<MatchesList matches={recentMatches} title="Recent" variant="mini" layout="list" maxItems={5} />`}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ color: '#4285f4', mb: 1, fontWeight: 600 }}>
            Team Page - Team Matches:
          </Typography>
          <Typography variant="body2" sx={{ color: '#9aa0a6', fontFamily: 'monospace', p: 1, backgroundColor: '#1a1a1a', borderRadius: 1 }}>
            {`<MatchesList matches={teamMatches} title="Team Matches" variant="compact" layout="grid" showVenue={false} />`}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default MatchCardsDemo;
