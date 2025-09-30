"use client";

import React from "react";
import { Box, Stack, Typography, Card, CardContent, Button, Paper } from "@mui/material";
import { BugReport as BugIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import SimpleLayout from "../components/SimpleLayout";
import AnnouncementsWidget from "../components/AnnouncementsWidget";
import LiveMatches from "../components/LiveMatches";
import MatchesList from "../components/MatchesList";
import LeagueTable from "../components/LeagueTable";
import GoalScorersList from "../components/GoalScorersList";
import StatisticsCharts from "../components/StatisticsCharts";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useTournamentData } from "../contexts/TournamentDataContext";
import { hasTournamentStarted } from "../utils/dataUtils";

export default function HomePage() {
  const { tournament, matches, loading, error } = useTournamentData();
  const [debugInfo, setDebugInfo] = React.useState<Record<string, unknown> | null>(null);
  const [showDebug, setShowDebug] = React.useState(false);

  const fetchDebugInfo = async () => {
    try {
      console.log('🔍 Fetching debug info...');
      const response = await fetch('/api/debug');
      const data = await response.json();
      console.log('🔍 Debug info:', data);
      setDebugInfo(data);
      setShowDebug(true);
    } catch (err) {
      console.error('🔍 Error fetching debug info:', err);
      setDebugInfo({ error: 'Failed to fetch debug info' });
      setShowDebug(true);
    }
  };

  const showPreTournament = tournament ? !hasTournamentStarted(tournament) : false;

  if (error) {
    return (
      <SimpleLayout>
        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography color="error">{error}</Typography>
            {debugInfo && showDebug && (
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" gutterBottom>Debug Information:</Typography>
                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </Paper>
            )}
            <Button 
              variant="outlined" 
              startIcon={<BugIcon />}
              onClick={fetchDebugInfo}
              sx={{ alignSelf: 'flex-start' }}
            >
              Show Debug Info
            </Button>
          </Stack>
        </Box>
      </SimpleLayout>
    );
  }

  if (showPreTournament && tournament) {
    const registrationLink = tournament.registration_by_link;

    return (
      <SimpleLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ p: 3 }}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(66, 165, 245, 0.1), rgba(21, 101, 192, 0.05))',
              border: '1px solid rgba(66, 165, 245, 0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h5" sx={{ color: 'primary.main', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {tournament.name}
                  </Typography>
                  <Typography color="text.secondary">
                    This tournament has not started yet. Check back later for schedules and
                    live results.
                  </Typography>
                  {registrationLink ? (
                    <Button
                      variant="contained"
                      color="primary"
                      href={registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Register / More info
                    </Button>
                  ) : null}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </motion.div>
      </SimpleLayout>
    );
  }

  if (loading) {
    return (
      <SimpleLayout>
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <LoadingSkeleton variant="card" count={1} height={60} />
            <LoadingSkeleton variant="matches" count={3} />
            <LoadingSkeleton variant="standings" count={5} />
            <LoadingSkeleton variant="topscorers" count={3} />
          </Stack>
        </Box>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, staggerChildren: 0.1 }}
      >
        <Box sx={{ p: 3 }}>
          {tournament ? (
            <Stack spacing={3}>
              {/* Tournament Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'primary.main',
                    textAlign: 'center',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  {tournament.name}
                </Typography>
              </motion.div>

              {/* Announcements */}
              <AnnouncementsWidget />
              
              {/* Live Matches */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <LiveMatches />
              </motion.div>

              {/* Statistics Charts */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <StatisticsCharts />
              </motion.div>
              
              {/* Matches List */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <MatchesList matches={matches ?? []} />
              </motion.div>

              {/* League Table and Top Scorers */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
                gap: 3 
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <LeagueTable />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <GoalScorersList />
                </motion.div>
              </Box>
            </Stack>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 8 }}>
                No current tournament available.
              </Typography>
            </motion.div>
          )}
        </Box>
      </motion.div>
    </SimpleLayout>
  );
}
