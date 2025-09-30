'use client';

import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'matches' | 'standings' | 'topscorers' | 'card' | 'text';
  count?: number;
  height?: number | string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 3, 
  height = 60
}) => {
  const renderMatchSkeleton = (index: number) => (
    <Card 
      key={index}
      variant="outlined" 
      sx={{ 
        mb: 1.5,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.05))',
        border: '1px solid rgba(0,0,0,0.08)',
        animation: `skeleton-pulse 1.5s ease-in-out ${index * 0.1}s infinite alternate`
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Skeleton variant="text" width={80} height={20} />
          <Skeleton variant="text" width={120} height={20} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={100} height={24} />
          </Box>
          <Box sx={{ textAlign: 'center', minWidth: 90 }}>
            <Skeleton variant="text" width={60} height={32} sx={{ mx: 'auto' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'flex-end' }}>
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderStandingsSkeleton = (index: number) => (
    <Box 
      key={index}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1.5, 
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        '&:hover': {
          background: 'rgba(0,0,0,0.02)',
        },
        animation: `skeleton-pulse 1.5s ease-in-out ${index * 0.1}s infinite alternate`
      }}
    >
      <Skeleton variant="text" width={30} height={24} sx={{ mr: 2 }} />
      <Skeleton variant="circular" width={28} height={28} sx={{ mr: 2 }} />
      <Skeleton variant="text" width={120} height={24} sx={{ flex: 1, mr: 2 }} />
      <Skeleton variant="text" width={30} height={20} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={30} height={20} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={30} height={20} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={30} height={20} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={40} height={20} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={40} height={20} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={30} height={20} sx={{ mr: 1 }} />
      <Skeleton variant="text" width={30} height={20} sx={{ fontWeight: 'bold' }} />
    </Box>
  );

  const renderTopScorersSkeleton = (index: number) => (
    <Box 
      key={index}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1.5,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        '&:hover': {
          background: 'rgba(0,0,0,0.02)',
        },
        animation: `skeleton-pulse 1.5s ease-in-out ${index * 0.1}s infinite alternate`
      }}
    >
      <Skeleton variant="text" width={30} height={24} sx={{ mr: 2 }} />
      <Skeleton variant="text" width={150} height={24} sx={{ flex: 1, mr: 2 }} />
      <Skeleton variant="text" width={80} height={20} sx={{ mr: 2 }} />
      <Skeleton variant="text" width={30} height={24} sx={{ fontWeight: 'bold' }} />
    </Box>
  );

  const renderCardSkeleton = (index: number) => (
    <Card 
      key={index}
      sx={{ 
        mb: 2,
        animation: `skeleton-pulse 1.5s ease-in-out ${index * 0.1}s infinite alternate`
      }}
    >
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={height} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );

  const renderItems = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      switch (variant) {
        case 'matches':
          items.push(renderMatchSkeleton(i));
          break;
        case 'standings':
          items.push(renderStandingsSkeleton(i));
          break;
        case 'topscorers':
          items.push(renderTopScorersSkeleton(i));
          break;
        case 'text':
          items.push(
            <Skeleton 
              key={i}
              variant="text" 
              height={height} 
              sx={{ 
                mb: 1,
                animation: `skeleton-pulse 1.5s ease-in-out ${i * 0.1}s infinite alternate`
              }} 
            />
          );
          break;
        default:
          items.push(renderCardSkeleton(i));
          break;
      }
    }
    return items;
  };

  return (
    <Box sx={{
      '& @keyframes skeleton-pulse': {
        '0%': {
          opacity: 0.6,
        },
        '100%': {
          opacity: 0.9,
        }
      }
    }}>
      {renderItems()}
    </Box>
  );
};

export default LoadingSkeleton;