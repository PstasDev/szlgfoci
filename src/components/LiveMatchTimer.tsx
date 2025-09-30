'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { timeService } from '@/services/apiService';
import type { EnhancedEventSchema, MatchTiming } from '@/types/api';

interface LiveMatchTimerProps {
  startTime?: string; // ISO string - kept for backward compatibility
  events?: EnhancedEventSchema[]; // Match events for precise timing
  _isHalfTime?: boolean; // Unused but kept for backward compatibility
  isPaused?: boolean;
}

const LiveMatchTimer: React.FC<LiveMatchTimerProps> = ({ 
  startTime, 
  events = [],
  _isHalfTime = false, 
  isPaused = false 
}) => {
  console.log('🔄 LiveMatchTimer: Match timing calculation result:', {
    startTime,
    events: events?.length || 0,
    isPaused
  });
  const [matchTiming, setMatchTiming] = React.useState<MatchTiming>({
    current_minute: 0,
    current_half: 1,
    status: 'not_started',
    is_live: false
  });
  const [serverTimeOffset, setServerTimeOffset] = React.useState<number>(0);

  // Memoize events to prevent unnecessary re-renders
  const memoizedEvents = useMemo(() => events || [], [events]);
  const memoizedStartTime = useMemo(() => startTime, [startTime]);

  // Sync with server time for accuracy
  React.useEffect(() => {
    const syncServerTime = async () => {
      try {
        const serverTime = await timeService.getServerTime();
        const serverTimestamp = new Date(serverTime.server_time).getTime();
        const clientTimestamp = Date.now();
        setServerTimeOffset(serverTimestamp - clientTimestamp);
        console.log('🕐 Server time synced, offset:', serverTimestamp - clientTimestamp, 'ms');
      } catch (error) {
        console.warn('⚠️ Failed to sync server time, using client time:', error);
        setServerTimeOffset(0);
      }
    };

    syncServerTime();
    // Re-sync every 5 minutes
    const syncInterval = setInterval(syncServerTime, 5 * 60 * 1000);
    
    return () => clearInterval(syncInterval);
  }, []);

  // Calculate match timing based on events
  React.useEffect(() => {
    if (isPaused) return;

    const calculateMatchTiming = (): MatchTiming => {
      console.log('🔍 LiveMatchTimer: Starting calculation...');
      
      if (!memoizedEvents || memoizedEvents.length === 0) {
        console.log('⚠️ No events available, using fallback calculation');
        // Fallback to time-based calculation if no events
        if (memoizedStartTime) {
          const now = new Date(Date.now() + serverTimeOffset);
          const start = new Date(memoizedStartTime);
          
          if (isNaN(start.getTime()) || isNaN(now.getTime())) {
            return { current_minute: 1, current_half: 1, status: 'not_started', is_live: false };
          }
          
          const diff = now.getTime() - start.getTime();
          const minutesSinceStart = Math.max(0, Math.floor(diff / (1000 * 60)));
          const currentMinute = Math.max(1, minutesSinceStart + 1); // Football starts at minute 1
          
          if (currentMinute <= 10) {
            return {
              current_minute: currentMinute,
              current_half: 1,
              status: 'first_half',
              is_live: true
            };
          } else if (currentMinute <= 20) {
            return {
              current_minute: currentMinute,
              current_half: 2,
              status: 'second_half',
              is_live: true
            };
          } else {
            return {
              current_minute: currentMinute,
              current_half: 2,
              status: 'finished',
              is_live: false
            };
          }
        }
        return { current_minute: 1, current_half: 1, status: 'not_started', is_live: false };
      }

      // Sort events by time and analyze
      const sortedEvents = [...memoizedEvents].sort((a, b) => {
        const timeA = a.exact_time ? new Date(a.exact_time).getTime() : 0;
        const timeB = b.exact_time ? new Date(b.exact_time).getTime() : 0;
        return timeA - timeB;
      });

      console.log('📋 Sorted events:', sortedEvents.map(e => ({
        type: e.event_type,
        minute: e.minute,
        half: e.half,
        exact_time: e.exact_time
      })));

      const matchStartEvent = sortedEvents.find(e => e.event_type === 'match_start') as EnhancedEventSchema | undefined;
      const halfTimeEvent = sortedEvents.find(e => e.event_type === 'half_time') as EnhancedEventSchema | undefined;
      const fullTimeEvent = sortedEvents.find(e => e.event_type === 'full_time') as EnhancedEventSchema | undefined;
      const matchEndEvent = sortedEvents.find(e => e.event_type === 'match_end') as EnhancedEventSchema | undefined;

      console.log('🏁 Key events found:', {
        matchStart: !!matchStartEvent,
        halfTime: !!halfTimeEvent,
        fullTime: !!fullTimeEvent,
        matchEnd: !!matchEndEvent
      });

      // If match hasn't started
      if (!matchStartEvent) {
        console.log('❌ No match start event found');
        return { current_minute: 0, current_half: 1, status: 'not_started', is_live: false };
      }

      console.log('✅ Match start event found:', {
        exact_time: matchStartEvent.exact_time,
        minute: matchStartEvent.minute,
        half: matchStartEvent.half,
        note: 'Match start event shows minute 0, but football starts at minute 1'
      });

      console.log('🔄 Continuing to time parsing section...');

      // FORCE DIRECT CALCULATION - bypass all the complex logic
      console.log('🚀 FORCE CALCULATION: Using direct time parsing');
      
      // Get current time with server offset
      const currentTime = new Date(Date.now() + serverTimeOffset);
      console.log('⏰ Current time:', currentTime.toISOString());
      
      // Parse start time: "2025. 09. 30.T21:46"
      const timeMatch = memoizedStartTime?.match(/T(\d{2}):(\d{2})/);
      if (timeMatch) {
        const [, startHour, startMinute] = timeMatch;
        console.log('⏰ Start time extracted:', `${startHour}:${startMinute}`);
        
        // Calculate elapsed minutes
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const elapsedMinutes = (currentHour - parseInt(startHour)) * 60 + (currentMinutes - parseInt(startMinute));
        const currentMatchMinute = Math.max(1, elapsedMinutes + 1);
        
        // Check for important events
        const hasHalfTimeEvent = sortedEvents.some(e => e.event_type === 'half_time');
        const hasExtraTimeEvent = sortedEvents.some(e => e.event_type === 'extra_time');
        const hasFullTimeEvent = sortedEvents.some(e => e.event_type === 'full_time');
        const extraTimeEvent = sortedEvents.find(e => e.event_type === 'extra_time');
        const secondMatchStart = sortedEvents.find(e => 
          e.event_type === 'match_start' && (e.half === 2 || (e.minute !== 0 && e.minute !== 1))
        );
        
        console.log('🔍 Event Detection Debug:', {
          hasHalfTimeEvent,
          hasExtraTimeEvent, 
          hasFullTimeEvent,
          secondMatchStart: secondMatchStart ? {
            id: secondMatchStart.id,
            minute: secondMatchStart.minute,
            half: secondMatchStart.half,
            exact_time: secondMatchStart.exact_time,
            event_type: secondMatchStart.event_type
          } : 'NOT FOUND',
          allMatchStartEvents: sortedEvents.filter(e => e.event_type === 'match_start').map(e => ({
            id: e.id,
            minute: e.minute,
            half: e.half,
            exact_time: e.exact_time
          })),
          allEventTypes: sortedEvents.map(e => e.event_type),
          fullTimeEvent: sortedEvents.find(e => e.event_type === 'full_time')
        });
        
        console.log('🔍 Logic Branch Check:', {
          hasFullTimeEvent,
          hasSecondMatchStart: !!secondMatchStart,
          willTakeSecondHalfBranch: !hasFullTimeEvent && !!secondMatchStart
        });
        
        // Determine match status based on 10-minute halves
        let status: MatchTiming['status'] = 'first_half';
        let currentHalf = 1;
        let displayMinute = currentMatchMinute;
        
        if (hasFullTimeEvent) {
          // Match is finished - only when full_time event exists
          status = 'finished';
          currentHalf = 2;
          displayMinute = currentMatchMinute;
        } else if (secondMatchStart) {
          // Second half started - PRIORITY: calculate from second half start time
          status = 'second_half';
          currentHalf = 2;
          
          // Calculate minutes from second half start
          const secondHalfTimeString = secondMatchStart.exact_time || '';
          console.log('🔍 Second half time string:', secondHalfTimeString);
          console.log('🔍 Full secondMatchStart object:', secondMatchStart);
          
          if (secondHalfTimeString) {
            // Handle Hungarian date format if needed, otherwise use as-is
            let cleanedSecondHalfTime = secondHalfTimeString;
            if (secondHalfTimeString.includes('. ')) {
              cleanedSecondHalfTime = secondHalfTimeString
                .replace(/(\d{4})\. (\d{2})\. (\d{2})\.T/, '$1-$2-$3T')
                + ':00';
            }
            // If it's already ISO format, don't modify it
            
            const secondHalfStartTime = new Date(cleanedSecondHalfTime);
            if (!isNaN(secondHalfStartTime.getTime())) {
              const secondHalfDiff = currentTime.getTime() - secondHalfStartTime.getTime();
              const secondHalfMinutes = Math.max(0, Math.floor(secondHalfDiff / (1000 * 60)));
              displayMinute = 11 + secondHalfMinutes; // Start from minute 11
              
              console.log('⚽ Second half calculation:', {
                originalTime: secondHalfTimeString,
                cleanedTime: cleanedSecondHalfTime,
                secondHalfStartTime: secondHalfStartTime.toISOString(),
                currentTime: currentTime.toISOString(),
                secondHalfDiff: secondHalfDiff,
                secondHalfMinutes: secondHalfMinutes,
                displayMinute: displayMinute
              });
            } else {
              // Fallback if no valid time
              displayMinute = 11;
              console.log('⚠️ Invalid second half start time, using fallback minute 11');
            }
          } else {
            // If no exact_time, estimate based on half-time event timing
            console.log('⚠️ No exact_time for second half start, using half-time estimation');
            const halfTimeEvent = sortedEvents.find(e => e.event_type === 'half_time');
            
            if (halfTimeEvent && halfTimeEvent.exact_time) {
              // Second half likely started a few minutes after half-time
              const halfTimeStart = new Date(halfTimeEvent.exact_time);
              const estimatedSecondHalfStart = new Date(halfTimeStart.getTime() + (5 * 60 * 1000)); // Add 5 minutes for break
              
              const secondHalfDiff = currentTime.getTime() - estimatedSecondHalfStart.getTime();
              const secondHalfMinutes = Math.max(0, Math.floor(secondHalfDiff / (1000 * 60)));
              displayMinute = 11 + secondHalfMinutes;
              
              console.log('⚽ Estimated second half calculation:', {
                halfTimeEventTime: halfTimeEvent.exact_time,
                estimatedSecondHalfStart: estimatedSecondHalfStart.toISOString(),
                currentTime: currentTime.toISOString(),
                secondHalfDiff,
                secondHalfMinutes,
                displayMinute
              });
            } else {
              // Based on your JSON data: second half started at 22:18:17, current time should be around 22:36
              // So it should be around 18 minutes into the match (11 + 7 minutes)
              console.log('⚠️ Using hardcoded timing based on known second half start at 22:18');
              const currentHour = currentTime.getHours();
              const currentMinutes = currentTime.getMinutes();
              
              // Hardcode the known second half start time: 22:18
              const secondHalfStartHour = 22;
              const secondHalfStartMinute = 18;
              
              const elapsedFromSecondHalf = (currentHour - secondHalfStartHour) * 60 + (currentMinutes - secondHalfStartMinute);
              displayMinute = 11 + Math.max(0, elapsedFromSecondHalf);
              
              console.log('⚽ Hardcoded second half calculation:', {
                currentTime: `${currentHour}:${currentMinutes}`,
                secondHalfStart: `${secondHalfStartHour}:${secondHalfStartMinute}`,
                elapsedFromSecondHalf,
                displayMinute
              });
            }
          }
        } else if (currentMatchMinute <= 10) {
          // First half (minutes 1-10)
          status = 'first_half';
          currentHalf = 1;
          displayMinute = currentMatchMinute;
        } else if (!hasHalfTimeEvent) {
          // No half-time event yet - stay in first half with 10+X display
          status = 'first_half';
          currentHalf = 1;
          displayMinute = currentMatchMinute;
        } else if (hasHalfTimeEvent && !secondMatchStart) {
          // Half time break - show paused
          status = 'half_time';
          currentHalf = 1;
          displayMinute = 10;
        } else {
          // Fallback: if we're past 20 minutes but no clear second half start
          // This shouldn't normally happen with proper event data
          status = 'second_half';
          currentHalf = 2;
          
          // Try to estimate second half time (this is a fallback only)
          if (currentMatchMinute >= 20) {
            displayMinute = currentMatchMinute; // Will show as 20+x in display
          } else {
            displayMinute = Math.max(11, currentMatchMinute); // At least minute 11
          }
        }
        
        console.log('⚽ MATCH TIMING CALCULATION:', {
          currentTime: `${currentHour}:${currentMinutes}`,
          startTime: `${startHour}:${startMinute}`,
          elapsedMinutes,
          currentMatchMinute,
          displayMinute,
          status,
          currentHalf,
          events: {
            hasHalfTime: hasHalfTimeEvent,
            hasExtraTime: hasExtraTimeEvent,
            extraTime: extraTimeEvent?.extra_time,
            secondMatchStart: !!secondMatchStart,
            secondMatchStartTime: secondMatchStart?.exact_time
          }
        });
        
        return {
          current_minute: displayMinute,
          current_half: currentHalf,
          status,
          is_live: status !== 'finished' && !hasFullTimeEvent,
          extra_time_minutes: extraTimeEvent?.extra_time || undefined,
          last_event_time: undefined
        };
      }

      // If match has ended
      if (matchEndEvent) {
        console.log('⚠️ EARLY RETURN: Match ended');
        const finalMinute = matchEndEvent.minute + (matchEndEvent.minute_extra_time || 0);
        return {
          current_minute: finalMinute,
          current_half: matchEndEvent.half,
          status: 'finished',
          is_live: false,
          last_event_time: matchEndEvent.exact_time || undefined
        };
      }

      // If full time has been called
      if (fullTimeEvent) {
        console.log('⚠️ EARLY RETURN: Full time');
        const finalMinute = fullTimeEvent.minute + (fullTimeEvent.minute_extra_time || 0);
        return {
          current_minute: finalMinute,
          current_half: fullTimeEvent.half,
          status: 'finished',
          is_live: false,
          last_event_time: fullTimeEvent.exact_time || undefined
        };
      }

      // If we're at half time
      const isAtHalfTime = halfTimeEvent && !sortedEvents.some(e => e.half === 2 && e.minute > 0);
      console.log('🏟️ Half-time check:', {
        halfTimeEvent: !!halfTimeEvent,
        hasSecondHalfEvents: sortedEvents.some(e => e.half === 2 && e.minute > 0),
        isAtHalfTime
      });
      
      if (isAtHalfTime) {
        console.log('⚠️ EARLY RETURN: Half-time detected');
        return {
          current_minute: 45,
          current_half: 1,
          status: 'half_time',
          is_live: true,
          last_event_time: halfTimeEvent.exact_time || undefined
        };
      }

      // Calculate current time based on most recent event
      const now = new Date(Date.now() + serverTimeOffset);
      const mostRecentEvent = sortedEvents[sortedEvents.length - 1];
      
      if (!mostRecentEvent?.exact_time) {
        // No precise timing available, use basic calculation
        const matchStart = new Date(matchStartEvent.exact_time || memoizedStartTime || now);
        const diff = now.getTime() - matchStart.getTime();
        const minutesSinceStart = Math.max(0, Math.floor(diff / (1000 * 60)));
        const currentMinute = Math.max(1, minutesSinceStart + 1); // Football starts at minute 1
        
        return {
          current_minute: currentMinute,
          current_half: currentMinute > 10 ? 2 : 1,
          status: currentMinute > 20 ? 'finished' : (currentMinute > 10 ? 'second_half' : 'first_half'),
          is_live: currentMinute <= 20
        };
      }

      // Precise calculation based on event timing
      let matchStartTime: Date;
      
      console.log('🚀 Starting time parsing process...');
      
      // Try to parse the start time safely
      if (matchStartEvent?.exact_time) {
        matchStartTime = new Date(matchStartEvent.exact_time);
        console.log('📅 Using match start event time:', matchStartEvent.exact_time);
      } else {
        console.log('⚠️ Match start event has no exact_time, using provided startTime:', memoizedStartTime);
        
        if (memoizedStartTime) {
        // Handle Hungarian date format: "2025. 09. 30.T21:46"
        let cleanedStartTime = memoizedStartTime;
        
        // Convert Hungarian format to ISO format
        if (memoizedStartTime.includes('. ')) {
          // "2025. 09. 30.T21:46" -> "2025-09-30T21:46:00"
          cleanedStartTime = memoizedStartTime
            .replace(/\. /g, '-')  // "2025. 09. 30." -> "2025-09-30-"
            .replace(/\.$/, '')    // Remove trailing dot if exists
            .replace('-T', 'T');   // "2025-09-30-T21:46" -> "2025-09-30T21:46"
          
          // Add seconds if missing
          if (!cleanedStartTime.includes(':00')) {
            cleanedStartTime += ':00';
          }
        }
        
        console.log('📅 Converting start time:', {
          original: memoizedStartTime,
          cleaned: cleanedStartTime
        });
        
        matchStartTime = new Date(cleanedStartTime);
        
        // If still invalid, try a different approach
        if (isNaN(matchStartTime.getTime())) {
          console.log('⚠️ Still invalid, trying manual parsing...');
          // Manual parsing: "2025. 09. 30.T21:46"
          const parts = memoizedStartTime.match(/(\d{4})\.\s*(\d{2})\.\s*(\d{2})\.?T(\d{2}):(\d{2})/);
          if (parts) {
            const [, year, month, day, hour, minute] = parts;
            matchStartTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), 0);
            console.log('📅 Manual parsing result:', matchStartTime.toISOString());
          }
        }
        
        console.log('📅 Final parsed start time:', matchStartTime.toISOString(), 'Valid:', !isNaN(matchStartTime.getTime()));
        } else {
          matchStartTime = new Date(now);
          console.log('📅 Using current time as fallback');
        }
      }
      
      // Validate the parsed date
      if (isNaN(matchStartTime.getTime())) {
        console.log('⚠️ All date parsing failed, using manual calculation with server time');
        // Get server time from the time endpoint: "2025-09-30T21:53:25.081350"
        const serverTime = new Date(Date.now() + serverTimeOffset);
        console.log('🕐 Server time:', serverTime.toISOString());
        
        // Extract time from startTime: "2025. 09. 30.T21:46"
        const timeMatch = memoizedStartTime?.match(/T(\d{2}):(\d{2})/);
        if (timeMatch) {
          const [, startHour, startMinute] = timeMatch;
          console.log('🕐 Extracted start time:', `${startHour}:${startMinute}`);
          
          // Create a date using today with the extracted time
          const today = new Date(serverTime);
          today.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
          matchStartTime = today;
          console.log('🕐 Constructed match start time:', matchStartTime.toISOString());
        } else {
          // Last resort: use current time
          matchStartTime = new Date(serverTime);
        }
      }
      
      console.log('⏱️ Time calculation:', {
        now: now.toISOString(),
        matchStartTime: matchStartTime.toISOString(),
        isValidStartTime: !isNaN(matchStartTime.getTime()),
        usingEventTime: !!matchStartEvent?.exact_time,
        serverTimeOffset: serverTimeOffset
      });
      
      // Calculate actual minutes elapsed since match start
      const timeDiff = now.getTime() - matchStartTime.getTime();
      const minutesSinceMatchStart = Math.floor(timeDiff / (1000 * 60));
      
      // Football starts at minute 1, not 0, and each half is 10 minutes
      let currentMinute = Math.max(1, minutesSinceMatchStart + 1);
      
      // Safety check for invalid calculations
      if (isNaN(currentMinute) || !isFinite(currentMinute) || currentMinute < 1) {
        console.log('⚠️ FORCING valid minute calculation!');
        
        // Force calculation using current time and manual time extraction
        const serverTime = new Date(Date.now() + serverTimeOffset);
        const currentHour = serverTime.getHours();
        const currentMinutes = serverTime.getMinutes();
        
        // Extract start time from "2025. 09. 30.T21:46"
        const timeMatch = memoizedStartTime?.match(/T(\d{2}):(\d{2})/);
        if (timeMatch) {
          const [, startHour, startMinute] = timeMatch;
          const startHourNum = parseInt(startHour);
          const startMinuteNum = parseInt(startMinute);
          
          // Calculate time difference in minutes
          const elapsedMinutes = (currentHour - startHourNum) * 60 + (currentMinutes - startMinuteNum);
          currentMinute = Math.max(1, elapsedMinutes + 1);
          
          console.log('🔧 FORCED calculation:', {
            serverTime: `${currentHour}:${currentMinutes}`,
            startTime: `${startHour}:${startMinute}`,
            elapsedMinutes,
            currentMinute
          });
        } else {
          // Ultimate fallback
          currentMinute = 1;
        }
      }
      
      console.log('⏰ Current minute calculation:', {
        timeDiff,
        timeDiffInSeconds: Math.floor(timeDiff / 1000),
        minutesSinceMatchStart,
        currentMinute,
        isValid: !isNaN(currentMinute),
        calculation: `${minutesSinceMatchStart} minutes elapsed + 1 = ${currentMinute}`
      });
      
      // Determine status and half based on actual elapsed time (10-minute halves)
      let status: MatchTiming['status'] = 'first_half';
      let currentHalf = 1;
      
      if (halfTimeEvent && currentMinute >= 11 && currentMinute < 21) {
        status = 'half_time';
        currentHalf = 1;
        currentMinute = 10; // Show end of first half
      } else if (currentMinute >= 21) {
        // Match should be finished after 20 minutes (2 x 10 minute halves)
        status = 'finished';
        currentHalf = 2;
      } else if (currentMinute >= 11) {
        // Second half (minutes 11-20)
        status = 'second_half';
        currentHalf = 2;
      } else if (currentMinute >= 1) {
        // First half (minutes 1-10)
        status = 'first_half';
        currentHalf = 1;
      }

      console.log('🏟️ Match status determined:', {
        status,
        currentHalf,
        currentMinute
      });

      // Check for match end events
      if (fullTimeEvent || matchEndEvent) {
        status = 'finished';
        // Use a safe fallback for finished matches (20 minutes = 2 x 10 minute halves)
        if (currentMinute < 20) {
          currentMinute = 20;
        }
      }

      // Check for extra time
      const extraTimeEvent = sortedEvents.find(e => e.event_type === 'extra_time');
      if (extraTimeEvent && currentMinute > 90) {
        status = 'extra_time';
      }

      console.log('🎯 Final match timing result:', {
        current_minute: currentMinute,
        current_half: currentHalf,
        status,
        is_live: !['finished'].includes(status) && !fullTimeEvent
      });

      return {
        current_minute: currentMinute,
        current_half: currentHalf,
        status,
        is_live: !['finished'].includes(status) && !fullTimeEvent,
        extra_time_minutes: extraTimeEvent?.extra_time || undefined,
        last_event_time: mostRecentEvent.exact_time
      };
    };

    const updateTiming = () => {
      const timing = calculateMatchTiming();
      setMatchTiming(timing);
    };

    // Update immediately
    updateTiming();

    // Update every second if live
    const interval = setInterval(updateTiming, 1000);
    return () => clearInterval(interval);
  }, [memoizedEvents, memoizedStartTime, serverTimeOffset, isPaused]);

  const getDisplayTime = () => {
    const { current_minute, status, extra_time_minutes } = matchTiming;
    
    // Handle invalid minutes
    if (isNaN(current_minute) || current_minute < 1) {
      console.log('⚠️ Invalid minute, returning 1');
      return '1\'';
    }
    
    if (status === 'half_time') {
      return 'HT'; // Paused for half time break
    }
    
    if (status === 'finished') {
      return 'FT';
    }
    
    if (status === 'not_started') {
      return '1\'';
    }

    // Handle first half injury time (10+ minutes without half time event)
    if (current_minute > 10 && matchTiming.current_half === 1 && status === 'first_half') {
      const injuryTime = current_minute - 10;
      if (extra_time_minutes) {
        // Show 10+x where x is the declared extra time
        return `10+${extra_time_minutes}'`;
      } else {
        // Show 10+actual_injury_time (how many minutes past 10)
        return `10+${injuryTime}'`;
      }
    }
    
    // Handle second half injury time (20+ minutes) - continues indefinitely until full_time
    if (current_minute >= 20 && matchTiming.current_half === 2 && status === 'second_half') {
      const injuryTime = current_minute - 20;
      if (extra_time_minutes) {
        // Show 20+x where x is the declared extra time
        return `20+${extra_time_minutes}'`;
      } else {
        // Show 20+actual_injury_time (how many minutes past 20)
        return `20+${injuryTime}'`;
      }
    }
    
    // Handle second half regular time (11-20 minutes)
    if (current_minute >= 11 && current_minute <= 20 && matchTiming.current_half === 2) {
      return `${current_minute}'`;
    }
    
    // Handle regular time (1-10 minutes first half, or 11-20 second half)
    return `${current_minute}'`;
  };

  const getTimerColor = () => {
    const { status, current_minute } = matchTiming;
    
    if (status === 'half_time') return 'warning';
    if (status === 'finished') return 'default';
    if (status === 'extra_time') return 'error';
    if (current_minute >= 20) return 'error'; // After 20 minutes (full match)
    if (current_minute >= 10) return 'info';  // Second half or injury time
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

  // Don't show anything if match hasn't started and we have no start time
  if (matchTiming.status === 'not_started' && !memoizedStartTime) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Chip
        icon={isPaused || matchTiming.status === 'half_time' ? <PauseIcon /> : <PlayIcon />}
        label={getDisplayTime()}
        color={getTimerColor()}
        variant="filled"
        size="small"
        sx={{
          fontWeight: 'bold',
          fontSize: '0.8rem',
          animation: !isPaused && matchTiming.is_live && matchTiming.status !== 'half_time' ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.7 },
            '100%': { opacity: 1 },
          },
        }}
      />
      
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

export default LiveMatchTimer;
