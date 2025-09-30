'use client';

import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

interface EnhancedLoadingSkeletonProps {
  variant?: 'matches' | 'standings' | 'topscorers' | 'announcements' | 'card' | 'text' | 'team-card' | 'chart';
  count?: number;
  height?: number | string;
}

const EnhancedLoadingSkeleton: React.FC<EnhancedLoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 3, 
  height = 60
}) => {
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