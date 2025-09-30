'use client';

import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Skeleton, 
  Stack, 
  Typography,
  LinearProgress,
  Chip,
  Fade
} from '@mui/material';
import { Sports as SportsIcon } from '@mui/icons-material';

interface EnhancedLoadingSkeletonProps {
  variant?: 'matches' | 'live-matches' | 'match-card' | 'standings' | 'topscorers' | 'announcements' | 'card' | 'text' | 'team-card' | 'chart' | 'players';
  count?: number;
  height?: number | string;
  showProgress?: boolean;
  message?: string;
}

const EnhancedLoadingSkeleton: React.FC<EnhancedLoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 3, 
  height = 60,
  showProgress = false,
  message
}) => {
  const renderMatchCardSkeleton = (index: number, isLive = false) => (
    <Fade in timeout={300 + (index * 100)} key={index}>
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 1.5,
          borderColor: isLive ? 'success.main' : 'divider',
          backgroundColor: isLive ? 'rgba(76, 175, 80, 0.08)' : 'background.paper',
        }}
      >
        {isLive && (
          <LinearProgress 
            color="success" 
            sx={{ height: 2 }}
            variant="indeterminate"
          />
        )}
        
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Skeleton variant="text" width={80} height={16} />
            {isLive && (
              <Chip 
                label="ÉLŐ" 
                size="small" 
                color="success" 
                variant="filled"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
            <Skeleton variant="text" width={100} height={16} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={120} height={24} />
            </Box>
            
            <Box sx={{ textAlign: 'center', minWidth: 90, px: 1 }}>
              <Skeleton variant="text" width={60} height={32} sx={{ mx: 'auto' }} />
              {isLive && <Skeleton variant="text" width={40} height={16} sx={{ mx: 'auto' }} />}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'flex-end' }}>
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  const renderPlayersSkeleton = (index: number) => (
    <Fade in timeout={150 + (index * 75)} key={index}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Skeleton variant="text" width={30} height={24} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, ml: 2 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Box>
            <Skeleton variant="text" width={140} height={20} />
            <Skeleton variant="text" width={100} height={16} />
          </Box>
        </Box>
        <Skeleton variant="text" width={50} height={24} />
      </Box>
    </Fade>
  );

  const renderAnnouncementsSkeleton = (index: number) => (
    <Card 
      key={index}
      sx={{ 
        mb: 2,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Skeleton variant="text" width="70%" height={28} />
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3 }} />
          </Box>
          <Skeleton variant="text" width="40%" height={16} />
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </Stack>
      </CardContent>
    </Card>
  );

  const renderTeamCardSkeleton = (index: number) => (
    <Card 
      key={index}
      sx={{ 
        mb: 2,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="circular" width={56} height={56} />
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={16} />
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderChartSkeleton = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: 200 }}>
          {[...Array(8)].map((_, i) => (
            <Skeleton 
              key={i} 
              variant="rectangular" 
              width="12%" 
              height={Math.random() * 120 + 40}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const renderDefaultSkeleton = (index: number) => (
    <Skeleton 
      key={index}
      variant="rectangular" 
      width="100%" 
      height={height}
      sx={{ 
        mb: 1,
        borderRadius: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
      }}
    />
  );

  if (variant === 'live-matches') {
    return (
      <Box>
        {showProgress && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SportsIcon sx={{ color: 'success.main' }} />
              <Typography variant="body2" color="success.main">
                {message || 'Élő mérkőzések betöltése...'}
              </Typography>
            </Box>
            <LinearProgress color="success" />
          </Box>
        )}
        
        <Stack spacing={2}>
          {Array.from({ length: count }).map((_, index) => 
            renderMatchCardSkeleton(index, true)
          )}
        </Stack>
      </Box>
    );
  }

  if (variant === 'match-card') {
    return renderMatchCardSkeleton(0);
  }

  if (variant === 'matches') {
    return (
      <Box>
        {showProgress && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {message || 'Mérkőzések betöltése...'}
            </Typography>
            <LinearProgress />
          </Box>
        )}
        
        <Stack spacing={2}>
          {Array.from({ length: count }).map((_, index) => 
            renderMatchCardSkeleton(index)
          )}
        </Stack>
      </Box>
    );
  }

  if (variant === 'players') {
    return (
      <Box>
        {showProgress && (
          <LinearProgress sx={{ mb: 2 }} />
        )}
        {Array.from({ length: count }).map((_, index) => 
          renderPlayersSkeleton(index)
        )}
      </Box>
    );
  }

  if (variant === 'announcements') {
    return (
      <Box>
        {[...Array(count)].map((_, index) => renderAnnouncementsSkeleton(index))}
      </Box>
    );
  }

  if (variant === 'team-card') {
    return (
      <Box>
        {[...Array(count)].map((_, index) => renderTeamCardSkeleton(index))}
      </Box>
    );
  }

  if (variant === 'chart') {
    return renderChartSkeleton();
  }

  return (
    <Box>
      {[...Array(count)].map((_, index) => renderDefaultSkeleton(index))}
    </Box>
  );
};

export default EnhancedLoadingSkeleton;