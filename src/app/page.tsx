"use client";

import React from "react";
import { Box, Stack, Typography, Card, CardContent, Button, Paper } from "@mui/material";
import { BugReport as BugIcon } from "@mui/icons-material";
import SimpleLayout from "../components/SimpleLayout";
import LiveMatches from "../components/LiveMatches";
import MatchesList from "../components/MatchesList";
import LeagueTable from "../components/LeagueTable";
import GoalScorersList from "../components/GoalScorersList";
import { useTournamentContext } from "../hooks/useTournamentContext";
import { hasTournamentStarted } from "../utils/dataUtils";

export default function HomePage() {
  const { tournament, matches, loading, error } = useTournamentContext();
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
        <Box sx={{ p: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h5">{tournament.name}</Typography>
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
                  >
                    Register / More info
                  </Button>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </SimpleLayout>
    );
  }

  if (loading) {
    return (
      <SimpleLayout>
        <Box sx={{ p: 3 }}>
          <Typography>Loading tournament data…</Typography>
        </Box>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <Box sx={{ p: 3 }}>
        {tournament ? (
          <Stack spacing={3}>
            <Typography variant="h4">{tournament.name}</Typography>
            <LiveMatches />
            <MatchesList matches={matches ?? []} />
            <LeagueTable />
            <GoalScorersList />
          </Stack>
        ) : (
          <Typography>No current tournament available.</Typography>
        )}
      </Box>
    </SimpleLayout>
  );
}
