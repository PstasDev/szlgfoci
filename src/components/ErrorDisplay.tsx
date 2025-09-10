'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Alert,
  Container,
  Stack,
  Paper
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { ErrorInfo } from '@/utils/errorUtils';

interface ErrorDisplayProps {
  errorInfo: ErrorInfo;
  fullPage?: boolean;
  onRetry?: () => void;
  variant?: 'paper' | 'alert' | 'box';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  errorInfo, 
  fullPage = false, 
  onRetry,
  variant = 'paper'
}) => {
  const router = useRouter();

  const handleAction = () => {
    if (errorInfo.actionHref) {
      if (typeof window !== 'undefined' && errorInfo.actionHref === window.location.href) {
        // Reload current page
        window.location.reload();
      } else {
        router.push(errorInfo.actionHref);
      }
    } else if (onRetry) {
      onRetry();
    }
  };

  const content = (
    <Stack spacing={3} alignItems="center" textAlign="center">
      <ErrorIcon 
        sx={{ 
          fontSize: 64, 
          color: 'warning.main',
          opacity: 0.7
        }} 
      />
      <Stack spacing={1}>
        <Typography 
          variant={fullPage ? "h4" : "h6"} 
          component="h2"
          sx={{ color: 'text.primary', fontWeight: 600 }}
        >
          {errorInfo.title}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: 500,
            lineHeight: 1.6
          }}
        >
          {errorInfo.message}
        </Typography>
      </Stack>
      
      {(errorInfo.action || onRetry) && (
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={
              errorInfo.actionHref === '/' ? <HomeIcon /> :
              (typeof window !== 'undefined' && errorInfo.actionHref === window.location.href) ? <RefreshIcon /> :
              <BackIcon />
            }
            onClick={handleAction}
            sx={{
              backgroundColor: '#42a5f5',
              '&:hover': {
                backgroundColor: '#1976d2'
              }
            }}
          >
            {errorInfo.action || 'Újrapróbálás'}
          </Button>
          
          {errorInfo.actionHref !== '/' && (
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={() => router.push('/')}
              sx={{
                borderColor: '#42a5f5',
                color: '#42a5f5',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(66, 165, 245, 0.1)'
                }
              }}
            >
              Főoldal
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );

  if (variant === 'alert') {
    return (
      <Alert 
        severity="warning" 
        sx={{ 
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderColor: 'warning.main',
          color: 'text.primary'
        }}
      >
        {content}
      </Alert>
    );
  }

  if (variant === 'box') {
    return (
      <Box sx={{ py: { xs: 4, sm: 6 }, px: 2 }}>
        {content}
      </Box>
    );
  }

  const paperContent = (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 3, sm: 4 },
        backgroundColor: 'background.paper',
        borderRadius: 2,
        maxWidth: 600,
        mx: 'auto'
      }}
    >
      {content}
    </Paper>
  );

  if (fullPage) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 8 } }}>
        {paperContent}
      </Container>
    );
  }

  return paperContent;
};

export default ErrorDisplay;
