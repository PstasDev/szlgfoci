'use client';

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Skeleton,
} from '@mui/material';
import MatchCard from './MatchCard';
import { Match } from '@/utils/dataUtils';

interface MatchesListProps {
  matches: Match[];
  title?: string;
  variant?: 'detailed' | 'compact' | 'mini';
  layout?: 'grid' | 'list';
  showVenue?: boolean;
  showRound?: boolean;
  clickable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  maxItems?: number;
}

const MatchesList: React.FC<MatchesListProps> = ({
  matches,
  title,
  variant = 'compact',
  layout = 'list',
  showVenue = true,
  showRound = true,
  clickable = true,
  loading = false,
  emptyMessage = 'Nincsenek elérhető mérkőzések.',
  maxItems
}) => {
  const displayMatches = maxItems ? matches.slice(0, maxItems) : matches;

  if (loading) {
    return (
      <Box>
        {title && (
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              color: '#e8eaed', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {title}
          </Typography>
        )}
        
        {layout === 'grid' ? (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: variant === 'detailed' ? '1fr' : 'repeat(2, 1fr)',
              md: variant === 'detailed' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              lg: variant === 'detailed' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)'
            },
            gap: 2
          }}>
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={variant === 'detailed' ? 300 : variant === 'compact' ? 200 : 120}
                sx={{
                  bgcolor: '#2d2d2d',
                  borderRadius: variant === 'detailed' ? '12px' : '8px'
                }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={variant === 'detailed' ? 300 : variant === 'compact' ? 160 : 80}
                sx={{
                  bgcolor: '#2d2d2d',
                  borderRadius: variant === 'detailed' ? '12px' : '8px'
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }

  if (displayMatches.length === 0) {
    return (
      <Box>
        {title && (
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              color: '#e8eaed', 
              fontWeight: 600
            }}
          >
            {title}
          </Typography>
        )}
        
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            px: 3,
            backgroundColor: '#2d2d2d',
            borderRadius: '12px',
            border: '1px solid #404040',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#9aa0a6',
              mb: 1
            }}
          >
            📅
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#9aa0a6',
              maxWidth: 400,
              mx: 'auto'
            }}
          >
            {emptyMessage}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#e8eaed', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {title}
            <Box 
              sx={{ 
                backgroundColor: '#4285f4',
                color: 'white',
                borderRadius: '50%',
                minWidth: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              {displayMatches.length}
            </Box>
          </Typography>
          
          {maxItems && matches.length > maxItems && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#4285f4',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Mind megtekintése ({matches.length})
            </Typography>
          )}
        </Box>
      )}

      {layout === 'grid' ? (
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: variant === 'detailed' ? '1fr' : 'repeat(2, 1fr)',
            md: variant === 'detailed' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            lg: variant === 'detailed' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)'
          },
          gap: 2
        }}>
          {displayMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              variant={variant}
              showVenue={showVenue}
              showRound={showRound}
              clickable={clickable}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayMatches.map((match, index) => (
            <React.Fragment key={match.id}>
              <MatchCard
                match={match}
                variant={variant}
                showVenue={showVenue}
                showRound={showRound}
                clickable={clickable}
              />
              {index < displayMatches.length - 1 && variant === 'mini' && (
                <Divider sx={{ borderColor: '#404040' }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MatchesList;
