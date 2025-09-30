'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Campaign as CampaignIcon,
  PriorityHigh as UrgentIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as LowIcon,
} from '@mui/icons-material';
import { useTournamentData } from '@/contexts/TournamentDataContext';
import type { Announcement } from '@/types/api';

interface AnnouncementItemProps {
  announcement: Announcement;
}

const AnnouncementItem: React.FC<AnnouncementItemProps> = ({ announcement }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          icon: <UrgentIcon />,
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.1),
          label: 'Sürgős',
          severity: 'error' as const
        };
      case 'high':
        return {
          icon: <WarningIcon />,
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.1),
          label: 'Magas',
          severity: 'warning' as const
        };
      case 'normal':
        return {
          icon: <InfoIcon />,
          color: theme.palette.info.main,
          bgColor: alpha(theme.palette.info.main, 0.1),
          label: 'Normál',
          severity: 'info' as const
        };
      case 'low':
        return {
          icon: <LowIcon />,
          color: theme.palette.success.main,
          bgColor: alpha(theme.palette.success.main, 0.1),
          label: 'Alacsony',
          severity: 'success' as const
        };
      default:
        return {
          icon: <InfoIcon />,
          color: theme.palette.info.main,
          bgColor: alpha(theme.palette.info.main, 0.1),
          label: 'Normál',
          severity: 'info' as const
        };
    }
  };

  const priorityConfig = getPriorityConfig(announcement.priority);
  const isLongContent = announcement.content.length > 150;

  return (
    <Alert
      severity={priorityConfig.severity}
      icon={priorityConfig.icon}
      sx={{
        mb: 2,
        borderRadius: 2,
        '& .MuiAlert-message': {
          width: '100%'
        }
      }}
    >
      <Stack spacing={1} sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {announcement.title}
          </Typography>
          <Chip
            label={priorityConfig.label}
            size="small"
            sx={{
              backgroundColor: priorityConfig.bgColor,
              color: priorityConfig.color,
              fontWeight: 500
            }}
          />
        </Box>
        
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {new Date(announcement.date_created).toLocaleDateString('hu-HU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {expanded || !isLongContent 
              ? announcement.content 
              : `${announcement.content.substring(0, 150)}...`
            }
          </Typography>
          
          {isLongContent && (
            <Box sx={{ mt: 1 }}>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{ p: 0.5 }}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  {expanded ? 'Kevesebb' : 'Több'}
                </Typography>
              </IconButton>
            </Box>
          )}
        </Box>

        {announcement.author && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
            Szerző: {announcement.author.user_details 
              ? `${announcement.author.user_details.first_name || ''} ${announcement.author.user_details.last_name || ''}`.trim() || announcement.author.user_details.username
              : `Felhasználó #${announcement.author.user}`
            }
          </Typography>
        )}
      </Stack>
    </Alert>
  );
};

const AnnouncementsWidget: React.FC = () => {
  const { announcements, loading, error } = useTournamentData();

  // Debug logging
  React.useEffect(() => {
    console.log('📢 AnnouncementsWidget - loading:', loading);
    console.log('📢 AnnouncementsWidget - error:', error);
    console.log('📢 AnnouncementsWidget - announcements:', announcements);
    console.log('📢 AnnouncementsWidget - announcements length:', announcements?.length || 0);
  }, [announcements, loading, error]);

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CampaignIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Közlemények
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CampaignIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Közlemények
            </Typography>
          </Box>
          <Alert severity="warning">
            Nem sikerült betölteni a közleményeket.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CampaignIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Közlemények
            </Typography>
          </Box>
          <Alert severity="info">
            Jelenleg nincsenek aktív közlemények.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Sort announcements by priority and date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }
    
    return new Date(b.date_created).getTime() - new Date(a.date_created).getTime(); // Newer first
  });

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <CampaignIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Közlemények
          </Typography>
          <Chip 
            label={announcements.length} 
            size="small" 
            color="primary" 
            sx={{ ml: 1 }}
          />
        </Box>
        
        <Stack spacing={0}>
          {sortedAnnouncements.map((announcement) => (
            <AnnouncementItem
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AnnouncementsWidget;