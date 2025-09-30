"use client";

import React from "react";
import { Box, Stack, Typography, Card, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";
import SimpleLayout from "../components/SimpleLayout";
import AnnouncementsWidget from "../components/AnnouncementsWidget";
import LiveMatches from "../components/LiveMatches";
import LeagueTable from "../components/LeagueTable";
import GoalScorersList from "../components/GoalScorersList";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useTournamentData } from "../contexts/TournamentDataContext";
import { hasTournamentStarted } from "../utils/dataUtils";

export default function HomePage() {
  const { tournament, matches: _matches, loading, error } = useTournamentData();

  const showPreTournament = tournament ? !hasTournamentStarted(tournament) : false;

  if (error) {
    return (
      <SimpleLayout>
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
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
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 700,
                      mb: 1,
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {tournament.name}
                  </Typography>
                  
                  {/* Tournament details */}
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    sx={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    {tournament.start_date && (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        📅 Kezdés: {new Date(tournament.start_date).toLocaleDateString('hu-HU')}
                      </Typography>
                    )}
                    
                    {tournament.end_date && (
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        🏁 Befejezés: {new Date(tournament.end_date).toLocaleDateString('hu-HU')}
                      </Typography>
                    )}
                    
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        backgroundColor: hasTournamentStarted(tournament) ? 'success.main' : 'warning.main',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {hasTournamentStarted(tournament) ? '🟢 Folyamatban' : '🟡 Hamarosan'}
                    </Box>
                  </Stack>
                </Box>
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
              {/* <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <StatisticsCharts />
              </motion.div> */}
              
              {/* Matches List */}
              {/* <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <MatchesList matches={matches ?? []} />
              </motion.div> */}

              {/* League Table and Top Scorers */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
                gap: 3,
                overflowX: 'hidden',
                '& > *': {
                  minWidth: 0 // Prevents grid items from overflowing
                }
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
