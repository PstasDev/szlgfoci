'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useTournamentData } from '@/contexts/TournamentDataContext';
import { isMatchCancelled } from '@/utils/dataUtils';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading chart...</Box>
});

const StatisticsCharts: React.FC = () => {
  const theme = useTheme();
  const { standings, matches, topScorers, loading } = useTournamentData();

  const chartOptions = useMemo(() => ({
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    theme: {
      mode: theme.palette.mode as 'light' | 'dark',
    },
    colors: ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#00796b'],
    dataLabels: {
      enabled: true,
      style: {
        colors: [theme.palette.text.primary],
        fontFamily: theme.typography.fontFamily,
      }
    },
    legend: {
      labels: {
        colors: theme.palette.text.secondary,
      }
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    xaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        }
      },
      axisBorder: {
        color: theme.palette.divider,
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode,
    }
  }), [theme]);

  // Goals per team chart data
  const goalsData = useMemo(() => {
    if (!standings.length) return { categories: [], series: [] };
    
    const categories = standings.slice(0, 8).map(team => team.team_name);
    const goalsFor = standings.slice(0, 8).map(team => team.goals_for);
    const goalsAgainst = standings.slice(0, 8).map(team => team.goals_against);

    return {
      categories,
      series: [
        {
          name: 'Lőtt gólok',
          data: goalsFor,
          color: '#4caf50'
        },
        {
          name: 'Kapott gólok',
          data: goalsAgainst,
          color: '#f44336'
        }
      ]
    };
  }, [standings]);

  // Points distribution chart
  const pointsData = useMemo(() => {
    if (!standings.length) return { labels: [], series: [] };
    
    const labels = standings.slice(0, 6).map(team => team.team_name);
    const series = standings.slice(0, 6).map(team => team.points);

    return { labels, series };
  }, [standings]);

  // Matches status chart - exclude cancelled matches from statistics
  const matchStatusData = useMemo(() => {
    if (!matches.length) return { labels: [], series: [] };

    // Filter out cancelled matches from statistics
    const activeMatches = matches.filter(m => !isMatchCancelled(m));
    
    const finished = activeMatches.filter(m => m.status === 'finished').length;
    const upcoming = activeMatches.filter(m => m.status === 'upcoming').length;
    const live = activeMatches.filter(m => m.status === 'live').length;

    return {
      labels: ['Befejezett', 'Élő', 'Következő'],
      series: [finished, live, upcoming]
    };
  }, [matches]);

  // Top scorers data
  const topScorersData = useMemo(() => {
    if (!topScorers.length) return { categories: [], series: [] };
    
    const categories = topScorers.slice(0, 5).map(scorer => scorer.player_name);
    const series = [{
      name: 'Gólok',
      data: topScorers.slice(0, 5).map(scorer => scorer.goals)
    }];

    return { categories, series };
  }, [topScorers]);

  if (loading || !standings.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(21, 101, 192, 0.05))',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        },
        transition: 'box-shadow 0.3s ease',
      }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid', 
          borderBottomColor: 'divider',
          background: 'linear-gradient(90deg, rgba(25, 118, 210, 0.1), rgba(21, 101, 192, 0.1))',
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            📊 Statisztikák
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 3 
          }}>
            {/* Goals Chart */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card variant="outlined" sx={{ height: '100%', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Gólstatisztikák
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Chart
                      options={{
                        ...chartOptions,
                        chart: {
                          ...chartOptions.chart,
                          type: 'bar' as const,
                        },
                        xaxis: {
                          ...chartOptions.xaxis,
                          categories: goalsData.categories,
                        },
                        plotOptions: {
                          bar: {
                            borderRadius: 4,
                            columnWidth: '70%',
                          }
                        }
                      }}
                      series={goalsData.series}
                      type="bar"
                      height={300}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Points Pie Chart */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card variant="outlined" sx={{ height: '100%', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Pontok eloszlása (Top 6)
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Chart
                      options={{
                        ...chartOptions,
                        chart: {
                          ...chartOptions.chart,
                          type: 'donut' as const,
                        },
                        labels: pointsData.labels,
                        responsive: [{
                          breakpoint: 480,
                          options: {
                            legend: {
                              position: 'bottom'
                            }
                          }
                        }]
                      }}
                      series={pointsData.series}
                      type="donut"
                      height={300}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Match Status Chart */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Card variant="outlined" sx={{ height: '100%', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Mérkőzések állása
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Chart
                      options={{
                        ...chartOptions,
                        chart: {
                          ...chartOptions.chart,
                          type: 'pie' as const,
                        },
                        labels: matchStatusData.labels,
                      }}
                      series={matchStatusData.series}
                      type="pie"
                      height={300}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Scorers Chart */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Card variant="outlined" sx={{ height: '100%', backdropFilter: 'blur(10px)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Legjobb gólszerzők
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Chart
                      options={{
                        ...chartOptions,
                        chart: {
                          ...chartOptions.chart,
                          type: 'bar' as const,
                        },
                        xaxis: {
                          ...chartOptions.xaxis,
                          categories: topScorersData.categories,
                        },
                        plotOptions: {
                          bar: {
                            borderRadius: 4,
                            horizontal: true,
                          }
                        }
                      }}
                      series={topScorersData.series}
                      type="bar"
                      height={300}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatisticsCharts;