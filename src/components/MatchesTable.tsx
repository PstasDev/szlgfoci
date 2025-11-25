'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  PlayArrow as LiveIcon,
  CheckCircle as FinishedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Stadium as VenueIcon,
  Flag as RoundIcon,
} from '@mui/icons-material';
import { Match, isMatchCancelled, getStatusBadgeProps, getStatusTranslation } from '@/utils/dataUtils';
import TeamLogo from './TeamLogo';
import { getTeamClassDisplayName } from '@/utils/dataUtils';

interface MatchesTableProps {
  matches: Match[];
}

type SortField = 'date' | 'homeTeam' | 'awayTeam' | 'round' | 'venue';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | 'live' | 'upcoming' | 'finished';

const MatchesTable: React.FC<MatchesTableProps> = ({ matches }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Navigation handler
  const handleMatchClick = (matchId: number) => {
    router.push(`/merkozesek/${matchId}`);
  };

  // Sort and filter matches
  const processedMatches = useMemo(() => {
    let filtered = matches;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(match =>
        match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.round.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(match => match.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
          break;
        case 'homeTeam':
          comparison = a.homeTeam.localeCompare(b.homeTeam, 'hu');
          break;
        case 'awayTeam':
          comparison = a.awayTeam.localeCompare(b.awayTeam, 'hu');
          break;
        case 'round':
          comparison = a.round.localeCompare(b.round, 'hu');
          break;
        case 'venue':
          comparison = a.venue.localeCompare(b.venue, 'hu');
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [matches, searchTerm, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <LiveIcon sx={{ color: '#ff4444', fontSize: '1rem' }} />;
      case 'upcoming':
        return <ScheduleIcon sx={{ color: '#4285f4', fontSize: '1rem' }} />;
      case 'finished':
        return <FinishedIcon sx={{ color: '#34a853', fontSize: '1rem' }} />;
      default:
        return <ScheduleIcon sx={{ color: '#9aa0a6', fontSize: '1rem' }} />;
    }
  };

  const getStatusLabel = (match: Match) => {
    // Check if match is cancelled and show cancellation status
    const statusBadge = getStatusBadgeProps(match.cancellationStatus);
    if (statusBadge) {
      return getStatusTranslation(match.cancellationStatus);
    }
    
    // Otherwise show normal status
    switch (match.status) {
      case 'live':
        return 'Élő';
      case 'upcoming':
        return 'Közelgő';
      case 'finished':
        return 'Befejezett';
      default:
        return match.status;
    }
  };

  const getStatusColor = (match: Match): 'error' | 'primary' | 'success' | 'default' | 'warning' => {
    // Check if match is cancelled and show appropriate color
    const statusBadge = getStatusBadgeProps(match.cancellationStatus);
    if (statusBadge) {
      return statusBadge.color;
    }
    
    // Otherwise show normal status color
    switch (match.status) {
      case 'live':
        return 'error';
      case 'upcoming':
        return 'primary';
      case 'finished':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatMatchDateTime = (date: string, time: string) => {
    const matchDate = new Date(date + ' ' + time);
    const now = new Date();
    const isToday = matchDate.toDateString() === now.toDateString();
    const isTomorrow = matchDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

    if (isToday) {
      return `Ma ${time}`;
    } else if (isTomorrow) {
      return `Holnap ${time}`;
    } else {
      return `${matchDate.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })} ${time}`;
    }
  };

  const renderScore = (match: Match) => {
    // Show score for finished or live matches, even if both scores are 0
    // But don't show live color for cancelled matches
    if (match.status === 'finished' || match.status === 'live') {
      const homeScore = match.homeScore ?? 0;
      const awayScore = match.awayScore ?? 0;
      const isLiveAndNotCancelled = match.status === 'live' && !isMatchCancelled(match);
      return (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: isLiveAndNotCancelled ? '#ff4444' : '#e8eaed',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {homeScore} - {awayScore}
        </Typography>
      );
    }
    
    // For upcoming matches, show "vs"
    return (
      <Typography
        variant="body2"
        sx={{ color: '#9aa0a6', fontStyle: 'italic' }}
      >
        vs
      </Typography>
    );
  };

  const renderMobileCard = (match: Match) => (
    <Card
      key={match.id}
      sx={{
        mb: 2,
        backgroundColor: '#2d2d2d',
        border: '1px solid #404040',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: isMatchCancelled(match) ? 0.7 : 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: '#3a3a3a',
          borderColor: '#4285f4',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(66, 133, 244, 0.15)'
        }
      }}
      onClick={() => handleMatchClick(match.id)}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Status and DateTime */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip
            icon={getStatusIcon(match.status)}
            label={getStatusLabel(match)}
            color={getStatusColor(match)}
            size="small"
            variant="filled"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
            {formatMatchDateTime(match.date, match.time)}
          </Typography>
        </Stack>

        {/* Teams and Score */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
          <Stack direction="row" alignItems="center" spacing={1} flex={1}>
            <TeamLogo team={match.homeTeamObj} teamName={match.homeTeam} size={24} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" sx={{ color: '#e8eaed', fontWeight: 500, lineHeight: 1.2 }}>
                {match.homeTeam}
              </Typography>
              <Typography variant="caption" sx={{ color: '#9aa0a6', fontSize: '0.7rem', lineHeight: 1 }}>
                ({getTeamClassDisplayName(match.homeTeamObj || null)})
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ textAlign: 'center', minWidth: 60 }}>
            {renderScore(match)}
          </Box>

          <Stack direction="row" alignItems="center" spacing={1} flex={1} justifyContent="flex-end">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="body1" sx={{ color: '#e8eaed', fontWeight: 500, lineHeight: 1.2 }}>
                {match.awayTeam}
              </Typography>
              <Typography variant="caption" sx={{ color: '#9aa0a6', fontSize: '0.7rem', lineHeight: 1 }}>
                ({getTeamClassDisplayName(match.awayTeamObj || null)})
              </Typography>
            </Box>
            <TeamLogo team={match.awayTeamObj} teamName={match.awayTeam} size={24} />
          </Stack>
        </Stack>

        {/* Additional Info */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <RoundIcon sx={{ color: '#9aa0a6', fontSize: '0.875rem' }} />
            <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
              {match.round}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <VenueIcon sx={{ color: '#9aa0a6', fontSize: '0.875rem' }} />
            <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
              {match.venue}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <Box>
        {/* Search and Filters */}
        <Stack spacing={2} mb={3}>
          <TextField
            fullWidth
            placeholder="Keresés csapatok, helyszín vagy forduló szerint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9aa0a6' }} />
                </InputAdornment>
              ),
              sx: { backgroundColor: '#2d2d2d', borderRadius: 2 }
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              sx={{ backgroundColor: '#2d2d2d', borderRadius: 2 }}
            >
              <MenuItem value="all">Minden mérkőzés</MenuItem>
              <MenuItem value="live">Élő</MenuItem>
              <MenuItem value="upcoming">Közelgő</MenuItem>
              <MenuItem value="finished">Befejezett</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Mobile Cards */}
        <Box>
          {processedMatches.map(match => renderMobileCard(match))}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search and Filters */}
      <Stack direction="row" spacing={2} mb={3} alignItems="center">
        <TextField
          placeholder="Keresés csapatok, helyszín vagy forduló szerint..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9aa0a6' }} />
              </InputAdornment>
            ),
            sx: { backgroundColor: '#2d2d2d', borderRadius: 2 }
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            sx={{ backgroundColor: '#2d2d2d', borderRadius: 2 }}
          >
            <MenuItem value="all">Minden mérkőzés</MenuItem>
            <MenuItem value="live">Élő</MenuItem>
            <MenuItem value="upcoming">Közelgő</MenuItem>
            <MenuItem value="finished">Befejezett</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: '#2d2d2d',
          borderRadius: 2,
          border: '1px solid #404040'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1a1a1a' }}>
              <TableCell sx={{ color: '#e8eaed', fontWeight: 600, py: 2 }}>
                <TableSortLabel
                  active={sortField === 'date'}
                  direction={sortOrder}
                  onClick={() => handleSort('date')}
                  sx={{ 
                    color: '#e8eaed !important',
                    '& .MuiTableSortLabel-icon': { color: '#4285f4 !important' }
                  }}
                >
                  Státusz / Időpont
                </TableSortLabel>
              </TableCell>
              
              <TableCell sx={{ color: '#e8eaed', fontWeight: 600, py: 2 }}>
                <TableSortLabel
                  active={sortField === 'homeTeam'}
                  direction={sortOrder}
                  onClick={() => handleSort('homeTeam')}
                  sx={{ 
                    color: '#e8eaed !important',
                    '& .MuiTableSortLabel-icon': { color: '#4285f4 !important' }
                  }}
                >
                  Hazai csapat
                </TableSortLabel>
              </TableCell>
              
              <TableCell align="center" sx={{ color: '#e8eaed', fontWeight: 600, py: 2 }}>
                Eredmény
              </TableCell>
              
              <TableCell sx={{ color: '#e8eaed', fontWeight: 600, py: 2 }}>
                <TableSortLabel
                  active={sortField === 'awayTeam'}
                  direction={sortOrder}
                  onClick={() => handleSort('awayTeam')}
                  sx={{ 
                    color: '#e8eaed !important',
                    '& .MuiTableSortLabel-icon': { color: '#4285f4 !important' }
                  }}
                >
                  Vendég csapat
                </TableSortLabel>
              </TableCell>

              {!isTablet && (
                <>
                  <TableCell sx={{ color: '#e8eaed', fontWeight: 600, py: 2 }}>
                    <TableSortLabel
                      active={sortField === 'round'}
                      direction={sortOrder}
                      onClick={() => handleSort('round')}
                      sx={{ 
                        color: '#e8eaed !important',
                        '& .MuiTableSortLabel-icon': { color: '#4285f4 !important' }
                      }}
                    >
                      Forduló
                    </TableSortLabel>
                  </TableCell>
                  
                  <TableCell sx={{ color: '#e8eaed', fontWeight: 600, py: 2 }}>
                    <TableSortLabel
                      active={sortField === 'venue'}
                      direction={sortOrder}
                      onClick={() => handleSort('venue')}
                      sx={{ 
                        color: '#e8eaed !important',
                        '& .MuiTableSortLabel-icon': { color: '#4285f4 !important' }
                      }}
                    >
                      Helyszín
                    </TableSortLabel>
                  </TableCell>
                </>
              )}

              {isTablet && (
                <TableCell sx={{ color: '#e8eaed', fontWeight: 600, py: 2 }}>
                  Részletek
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {processedMatches.map((match) => (
              <React.Fragment key={match.id}>
                <TableRow 
                  sx={{ 
                    opacity: isMatchCancelled(match) ? 0.7 : 1,
                    '&:hover': { 
                      backgroundColor: '#3a3a3a',
                      '& .MuiTableCell-root': {
                        borderColor: '#4285f4'
                      }
                    },
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={(e) => {
                    // For tablet, handle expand/collapse, for desktop, navigate to match
                    if (isTablet) {
                      e.stopPropagation();
                      setExpandedRow(expandedRow === match.id ? null : match.id);
                    } else {
                      handleMatchClick(match.id);
                    }
                  }}
                >
                  {/* Status and DateTime */}
                  <TableCell sx={{ py: 2 }}>
                    <Stack spacing={1}>
                      <Chip
                        icon={getStatusIcon(match.status)}
                        label={getStatusLabel(match)}
                        color={getStatusColor(match)}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 600, width: 'fit-content' }}
                      />
                      <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                        {formatMatchDateTime(match.date, match.time)}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Home Team */}
                  <TableCell sx={{ py: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TeamLogo team={match.homeTeamObj} teamName={match.homeTeam} size={28} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1" sx={{ color: '#e8eaed', fontWeight: 500, lineHeight: 1.2 }}>
                          {match.homeTeam}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9aa0a6', fontSize: '0.7rem', lineHeight: 1 }}>
                          ({getTeamClassDisplayName(match.homeTeamObj || null)})
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Score */}
                  <TableCell align="center" sx={{ py: 2 }}>
                    {renderScore(match)}
                  </TableCell>

                  {/* Away Team */}
                  <TableCell sx={{ py: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TeamLogo team={match.awayTeamObj} teamName={match.awayTeam} size={28} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1" sx={{ color: '#e8eaed', fontWeight: 500, lineHeight: 1.2 }}>
                          {match.awayTeam}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9aa0a6', fontSize: '0.7rem', lineHeight: 1 }}>
                          ({getTeamClassDisplayName(match.awayTeamObj || null)})
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {!isTablet && (
                    <>
                      {/* Round */}
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                          {match.round}
                        </Typography>
                      </TableCell>

                      {/* Venue */}
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                          {match.venue}
                        </Typography>
                      </TableCell>
                    </>
                  )}

                  {isTablet && (
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4285f4', 
                            fontWeight: 500,
                            fontSize: '0.875rem'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMatchClick(match.id);
                          }}
                        >
                          Részletek
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ color: '#9aa0a6' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRow(expandedRow === match.id ? null : match.id);
                          }}
                        >
                          {expandedRow === match.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>

                {/* Expandable row for tablet */}
                {isTablet && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                      <Collapse in={expandedRow === match.id}>
                        <Box sx={{ p: 2, backgroundColor: '#1a1a1a' }}>
                          <Stack direction="row" spacing={4}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <RoundIcon sx={{ color: '#9aa0a6', fontSize: '1rem' }} />
                              <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                                {match.round}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <VenueIcon sx={{ color: '#9aa0a6', fontSize: '1rem' }} />
                              <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                                {match.venue}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MatchesTable;