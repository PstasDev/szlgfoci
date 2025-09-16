"use client";

import React from "react";
import { Box, Stack, Typography, Card, CardContent, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import SimpleLayout from "../components/SimpleLayout";
import LiveMatches from "../components/LiveMatches";
import MatchesList from "../components/MatchesList";
import LeagueTable from "../components/LeagueTable";
import GoalScorersList from "../components/GoalScorersList";
import ErrorDisplay from "../components/ErrorDisplay";
import { useTournamentContext, useTournamentSelection } from "../hooks/useTournamentContext";
import { useTournaments } from "../hooks/useTournaments";
import { hasTournamentStarted } from "../utils/dataUtils";

export default function HomePage() {
  const { tournament, matches, loading, error } = useTournamentContext();
  const { selectedTournament, selectedTournamentId, setSelectedTournamentId } = useTournamentSelection();
  const { tournaments, loading: tournamentsLoading } = useTournaments();

  const displayTournament = tournament ?? selectedTournament ?? null;

  const showPreTournament = (() => {
    if (tournament) return !hasTournamentStarted(tournament);
    if (selectedTournament) return !hasTournamentStarted(selectedTournament);
    return false;
  })();

  const handleTournamentChange = (event: { target: { value: string } }) => {
    const newTournamentId = parseInt(event.target.value);
    console.log(`🔄 Homepage: User selected tournament ID: ${newTournamentId}`);
    setSelectedTournamentId(newTournamentId);
  };

  const getSelectValue = () => {
    if (tournamentsLoading || tournaments.length === 0) {
      return '';
    }
    const tournamentExists = selectedTournamentId !== null && tournaments.some(t => t.id === selectedTournamentId);
    return tournamentExists ? selectedTournamentId.toString() : '';
  };

  if (error) {
    return (
      <SimpleLayout>
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </SimpleLayout>
    );
  }

  if (showPreTournament && displayTournament) {
    const registrationLink = (displayTournament as any).registration_by_link;

    return (
      <SimpleLayout>
        <Box sx={{ p: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h5">{displayTournament.name}</Typography>
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

  if (loading && !displayTournament) {
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
        {/* Tournament Selector */}
        <Box sx={{ mb: 3 }}>
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
              '& .MuiInputLabel-root': { 
                color: 'text.secondary',
              },
              '& .MuiSelect-select': { 
                color: 'text.primary',
              },
              '& .MuiSvgIcon-root': { color: 'text.secondary' },
            }}
          >
            <InputLabel>Válassz Bajnokságot</InputLabel>
            <Select
              value={getSelectValue()}
              label="Válassz Bajnokságot"
              onChange={handleTournamentChange}
              disabled={tournamentsLoading}
            >
              {tournamentsLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Betöltés...
                </MenuItem>
              ) : tournaments.length > 0 ? (
                tournaments.map((tournament) => (
                  <MenuItem key={tournament.id} value={tournament.id?.toString() || ''}>
                    {tournament.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Nincsenek elérhető bajnokságok</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>

        {displayTournament ? (
          <Stack spacing={3}>
            <Typography variant="h4">{displayTournament.name}</Typography>
            <LiveMatches />
            <MatchesList matches={matches ?? []} />
            <LeagueTable />
            <GoalScorersList />
          </Stack>
        ) : (
          <Typography>Select a tournament to view details.</Typography>
        )}
      </Box>
    </SimpleLayout>
  );
}
