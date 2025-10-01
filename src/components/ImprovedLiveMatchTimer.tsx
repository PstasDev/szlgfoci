'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { timeService } from '@/services/apiService';
import type { EnhancedEventSchema, MatchTiming, MatchEvent } from '@/types/api';

interface ImprovedLiveMatchTimerProps {
  startTime: string;
  events?: (EnhancedEventSchema | MatchEvent)[];
  _isHalfTime?: boolean;
  isPaused?: boolean;
}

const ImprovedLiveMatchTimer: React.FC<ImprovedLiveMatchTimerProps> = ({ 
  startTime, 
  events = [],
  _isHalfTime = false, 
  isPaused = false 
}) => {
  const [matchTiming, setMatchTiming] = React.useState<MatchTiming>({
    current_minute: 1, // Start at minute 1, never 0
    current_half: 1,
    status: 'not_started',
    is_live: false
  });
  const [serverTimeOffset, setServerTimeOffset] = React.useState<number>(0);

  // Memoize events and start time
  const memoizedEvents = useMemo(() => events, [events]);
  const memoizedStartTime = useMemo(() => startTime, [startTime]);

  // Get server time offset on mount
  React.useEffect(() => {
    const getServerTime = async () => {
      try {
        const serverTimeData = await timeService.getServerTime();
        const localTime = Date.now();
        const serverTime = new Date(serverTimeData.server_time).getTime();
        const offset = serverTime - localTime;
        setServerTimeOffset(offset);
      } catch {
        console.warn('Failed to get server time, using local time');
        setServerTimeOffset(0);
      }
    };

    getServerTime();
  }, []);

  // Simplified match timing calculation focused on match start event
  React.useEffect(() => {
    if (isPaused) return;

    const calculateMatchTiming = (): MatchTiming => {
      console.log('🔄 ImprovedLiveMatchTimer: Starting calculation...');
      
      if (!memoizedEvents || memoizedEvents.length === 0) {
        console.log('⚠️ No events available');
        return { current_minute: 1, current_half: 1, status: 'not_started', is_live: false }; // Always start at minute 1
      }

      // Sort events by exact time (prioritize actual event timing)
      const sortedEvents = [...memoizedEvents].sort((a, b) => {
        if (a.exact_time && b.exact_time) {
          return new Date(a.exact_time).getTime() - new Date(b.exact_time).getTime();
        }
        // Fallback to minute sorting if no exact time
        return (a.minute || 0) - (b.minute || 0);
      });

      // Find key events
      const matchStartEvent = sortedEvents.find(e => e.event_type === 'match_start');
      const halfTimeEvent = sortedEvents.find(e => e.event_type === 'half_time');
      const secondHalfStartEvent = sortedEvents.find(e => 
        (e.half === 2 && e.minute > 10)
      );
      const matchEndEvent = sortedEvents.find(e => 
        e.event_type === 'match_end' || e.event_type === 'full_time'
      );
      const extraTimeEvent = sortedEvents.find(e => e.event_type === 'extra_time');

      console.log('🔍 Key events:', {
        matchStart: !!matchStartEvent,
        halfTime: !!halfTimeEvent,
        secondHalfStart: !!secondHalfStartEvent,
        matchEnd: !!matchEndEvent,
        extraTime: !!extraTimeEvent
      });

      // If match hasn't started or no start event with timing
      if (!matchStartEvent || !matchStartEvent.exact_time) {
        console.log('⚠️ No match start event with exact_time');
        return { current_minute: 1, current_half: 1, status: 'not_started', is_live: false };
      }

      // If match has ended
      if (matchEndEvent) {
        console.log('⚠️ Match has ended');
        return {
          current_minute: matchEndEvent.minute || 20,
          current_half: matchEndEvent.half || 2,
          status: 'finished',
          is_live: false,
          last_event_time: matchEndEvent.exact_time || undefined
        };
      }

      // Calculate current time based on match start event
      const now = new Date(Date.now() + serverTimeOffset);
      const matchStartTime = new Date(matchStartEvent.exact_time);

      if (isNaN(matchStartTime.getTime())) {
        console.log('⚠️ Invalid match start time');
        return { current_minute: 1, current_half: 1, status: 'not_started', is_live: false };
      }

      let currentMinute: number;
      let currentHalf: number;
      let status: MatchTiming['status'];

      // Check if currently at half time
      if (halfTimeEvent && !secondHalfStartEvent) {
        console.log('📅 Currently at half time');
        return {
          current_minute: 10,
          current_half: 1,
          status: 'half_time',
          is_live: true,
          last_event_time: halfTimeEvent.exact_time || undefined
        };
      }

      // Calculate based on which half we're in
      if (secondHalfStartEvent && secondHalfStartEvent.exact_time) {
        // Second half - calculate from second half start
        const secondHalfStartTime = new Date(secondHalfStartEvent.exact_time);
        
        if (!isNaN(secondHalfStartTime.getTime())) {
          const elapsed = now.getTime() - secondHalfStartTime.getTime();
          const elapsedMinutes = Math.floor(elapsed / (1000 * 60));
          currentMinute = 11 + elapsedMinutes; // Second half starts at minute 11
          currentHalf = 2;
          status = 'second_half';

          console.log('⚽ Second half calculation from event:', {
            secondHalfStartTime: secondHalfStartTime.toISOString(),
            now: now.toISOString(),
            elapsed,
            elapsedMinutes,
            currentMinute
          });
        } else {
          // Fallback if second half start time is invalid
          currentMinute = 11;
          currentHalf = 2;
          status = 'second_half';
        }
      } else {
        // First half - calculate from match start
        const elapsed = now.getTime() - matchStartTime.getTime();
        const elapsedMinutes = Math.floor(elapsed / (1000 * 60));
        currentMinute = Math.max(1, elapsedMinutes + 1); // Football starts at minute 1
        currentHalf = 1;
        status = 'first_half';

          console.log('⚽ First half calculation from match start:', {
            matchStartTime: matchStartTime.toISOString(),
            now: now.toISOString(),
            elapsed,
            elapsedMinutes,
            currentMinute
          });
        }

        // Handle injury time display
        if (currentHalf === 1 && currentMinute > 10 && !halfTimeEvent) {
          status = 'first_half'; // First half injury time
        }

        if (currentHalf === 2 && currentMinute > 20) {
          status = 'second_half'; // Second half injury time
        }

        console.log('🎯 Final calculation result:', {
          current_minute: currentMinute,
          current_half: currentHalf,
          status,
          is_live: true
        });
        
        return {
        current_minute: currentMinute,
        current_half: currentHalf,
        status,
        is_live: true,
        extra_time_minutes: extraTimeEvent?.extra_time || undefined,
        last_event_time: sortedEvents[sortedEvents.length - 1]?.exact_time || undefined
      };
    };

    const updateTiming = () => {
      const timing = calculateMatchTiming();
      setMatchTiming(timing);
    };

    // Update immediately
    updateTiming();

    // Update every second if live
    if (matchTiming.is_live || matchTiming.status === 'first_half' || matchTiming.status === 'second_half') {
      const interval = setInterval(updateTiming, 1000);
      return () => clearInterval(interval);
    }
  }, [memoizedEvents, memoizedStartTime, serverTimeOffset, isPaused, matchTiming.is_live, matchTiming.status]);

  const getDisplayTime = () => {
    const { current_minute, status, extra_time_minutes } = matchTiming;
    
    if (isNaN(current_minute) || current_minute < 1) {
      return '1\'';
    }
    
    if (status === 'half_time') {
      return 'HT';
    }
    
    if (status === 'finished') {
      return 'FT';
    }
    
    if (status === 'not_started') {
      return '1\'';
    }

    // Handle first half injury time
    if (current_minute > 10 && matchTiming.current_half === 1 && status === 'first_half') {
      const injuryTime = current_minute - 10;
      if (extra_time_minutes) {
        return `10+${extra_time_minutes}'`;
      } else {
        return `10+${injuryTime}'`;
      }
    }

    // Handle second half injury time
    if (current_minute > 20 && matchTiming.current_half === 2 && status === 'second_half') {
      const injuryTime = current_minute - 20;
      if (extra_time_minutes) {
        return `20+${extra_time_minutes}'`;
      } else {
        return `20+${injuryTime}'`;
      }
    }

    return `${current_minute}'`;
  };

  const getChipColor = () => {
    const { status, current_minute } = matchTiming;
    
    if (status === 'half_time') return 'warning';
    if (status === 'finished') return 'default';
    if (status === 'extra_time') return 'error';
    if (current_minute >= 20) return 'error';
    if (current_minute >= 10) return 'info';
    return 'success';
  };

  const getStatus = () => {
    const { status } = matchTiming;
    
    switch (status) {
      case 'not_started': return 'Nincs elkezdve';
      case 'first_half': return 'Első félidő';
      case 'half_time': return 'Félidő';
      case 'second_half': return 'Második félidő';
      case 'extra_time': return 'Hosszabbítás';
      case 'finished': return 'Vége';
      default: return 'Ismeretlen';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip 
        label={getDisplayTime()}
        color={getChipColor()}
        size="small"
        sx={{ 
          fontWeight: 'bold',
          fontSize: '0.875rem',
          minWidth: 50
        }}
      />
      
      {matchTiming.is_live && (
        <PlayIcon sx={{ 
          color: 'success.main',
          fontSize: 16,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.5 },
            '100%': { opacity: 1 }
          }
        }} />
      )}
      
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'text.secondary',
          fontWeight: 500,
          display: { xs: 'none', sm: 'block' }
        }}
      >
        {getStatus()}
      </Typography>
    </Box>
  );
};

export default ImprovedLiveMatchTimer;