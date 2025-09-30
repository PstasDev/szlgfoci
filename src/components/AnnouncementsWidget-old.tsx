'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Campaign as CampaignIcon,
  PriorityHigh as UrgentIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useTournamentData } from '@/contexts/TournamentDataContext';
import type { Announcement } from '@/types/api';

const AnnouncementsWidget: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await api.get<Announcement[]>('/announcements');
        setAnnouncements(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
        setError('Failed to load announcements');
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'normal': return 'primary';
      case 'low': return 'secondary';
      default: return 'primary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <UrgentIcon />;
      case 'high': return <WarningIcon />;
      case 'normal': return <InfoIcon />;
      case 'low': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Sürgős';
      case 'high': return 'Magas';
      case 'normal': return 'Normál';
      case 'low': return 'Alacsony';
      default: return 'Normál';
    }
  };

  if (loading) {
    return (
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.05), rgba(21, 101, 192, 0.05))',
        border: '1px solid rgba(66, 165, 245, 0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error || announcements.length === 0) {
    return null; // Don't show anything if there are no announcements
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.05), rgba(21, 101, 192, 0.05))',
        border: '1px solid rgba(66, 165, 245, 0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        },
        transition: 'box-shadow 0.3s ease',
      }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid', 
          borderBottomColor: 'divider',
          background: 'linear-gradient(90deg, rgba(66, 165, 245, 0.1), rgba(21, 101, 192, 0.1))',
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'primary.main',
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <CampaignIcon />
            Közlemények
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 0 }}>
          <Stack spacing={0}>
            <AnimatePresence>
              {announcements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Paper 
                    sx={{ 
                      m: 1,
                      border: `1px solid ${getPriorityColor(announcement.priority) === 'error' ? 'rgba(244, 67, 54, 0.3)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: 2,
                      overflow: 'hidden',
                      background: announcement.priority === 'urgent' 
                        ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.08), rgba(211, 47, 47, 0.04))'
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box 
                      sx={{ 
                        p: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Chip
                          icon={getPriorityIcon(announcement.priority)}
                          label={getPriorityLabel(announcement.priority)}
                          color={getPriorityColor(announcement.priority) as any}
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }}
                        />
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {announcement.title}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {new Date(announcement.date_created).toLocaleDateString('hu-HU')}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{
                            transform: expandedId === announcement.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Collapse in={expandedId === announcement.id}>
                      <Box sx={{ px: 2, pb: 2 }}>
                        <Alert 
                          severity={getPriorityColor(announcement.priority) === 'error' ? 'error' : 'info'}
                          sx={{ 
                            mt: 1,
                            '& .MuiAlert-message': {
                              width: '100%',
                            }
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.6,
                            }}
                          >
                            {announcement.content}
                          </Typography>
                          
                          {announcement.author && (
                            <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                                Szerző: {announcement.author.user}
                              </Typography>
                            </Box>
                          )}
                        </Alert>
                      </Box>
                    </Collapse>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnnouncementsWidget;