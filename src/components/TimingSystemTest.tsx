'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Alert
} from '@mui/material';
import { formatEventTime, parseFormattedTime } from '@/utils/dataUtils';
import TimeInput from './TimeInput';

const TimingSystemTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = () => {
    const results: string[] = [];

    // Test 1: Basic time formatting
    results.push('=== Basic Time Formatting ===');
    results.push(`formatEventTime(10, null) = ${formatEventTime(10, null)} (expected: "10'")`);
    results.push(`formatEventTime(45, 3) = ${formatEventTime(45, 3)} (expected: "45+3'")`);
    results.push(`formatEventTime(90, 7) = ${formatEventTime(90, 7)} (expected: "90+7'")`);

    // Test 2: Backend payload simulation
    results.push('\n=== Backend Payload Simulation ===');
    const mockBackendPayloads = [
      { current_minute: 10, current_extra_time: 17, status: 'first_half', formatted_time: '10+17\'' },
      { current_minute: 45, current_extra_time: 3, status: 'first_half', formatted_time: '45+3\'' },
      { current_minute: 67, current_extra_time: null, status: 'second_half', formatted_time: '67\'' },
      { current_minute: 90, current_extra_time: 5, status: 'second_half', formatted_time: '90+5\'' }
    ];

    mockBackendPayloads.forEach(payload => {
      const ourFormatted = formatEventTime(payload.current_minute, payload.current_extra_time);
      const match = ourFormatted === payload.formatted_time;
      results.push(`Backend: ${JSON.stringify(payload)}`);
      results.push(`Our formatting: ${ourFormatted} - ${match ? '✅ MATCH' : '❌ MISMATCH'}`);
    });

    // Test 3: Parse formatted time back
    results.push('\n=== Parse Formatted Time ===');
    const timeStrings = ['10\'', '45+3\'', '90+7\'', '23\''];
    timeStrings.forEach(timeStr => {
      const parsed = parseFormattedTime(timeStr);
      const reformatted = formatEventTime(parsed.minute, parsed.extraTime);
      const match = reformatted === timeStr;
      results.push(`"${timeStr}" -> minute: ${parsed.minute}, extraTime: ${parsed.extraTime} -> "${reformatted}" ${match ? '✅' : '❌'}`);
    });

    // Test 4: Critical football scenarios
    results.push('\n=== Critical Football Scenarios ===');
    const scenarios = [
      { desc: 'First half injury time', minute: 45, extra: 3, expected: '45+3\'' },
      { desc: 'Second half injury time', minute: 90, extra: 7, expected: '90+7\'' },
      { desc: 'Regular first half', minute: 23, extra: null, expected: '23\'' },
      { desc: 'Regular second half', minute: 67, extra: null, expected: '67\'' },
      { desc: 'Deep injury time', minute: 45, extra: 8, expected: '45+8\'' }
    ];

    scenarios.forEach(scenario => {
      const result = formatEventTime(scenario.minute, scenario.extra);
      const match = result === scenario.expected;
      results.push(`${scenario.desc}: ${scenario.minute}${scenario.extra ? `+${scenario.extra}` : ''} -> "${result}" ${match ? '✅' : '❌'}`);
    });

    setTestResults(results);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Football Timing System Test
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This test validates that our frontend correctly handles the football timing system where:
        <br />• <strong>45+3</strong> means &quot;45th minute + 3 minutes extra time&quot;
        <br />• <strong>NOT</strong> 48th minute (which would be second half, 3rd minute)
      </Alert>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Interactive Time Input Test
        </Typography>
        <TimeInput
          minute={45}
          extraTime={3}
          onChange={(minute, extraTime) => {
            console.log('Time changed:', { minute, extraTime, formatted: formatEventTime(minute, extraTime) });
          }}
          currentMinute={45}
          currentExtraTime={3}
          half={1}
          label="Test Time Input"
          helperText="Try changing the values to see proper football time formatting"
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">
            Automated Tests
          </Typography>
          <Button variant="contained" onClick={runTests}>
            Run Tests
          </Button>
        </Stack>

        {testResults.length > 0 && (
          <Box sx={{ 
            backgroundColor: '#1e1e1e',
            p: 2,
            borderRadius: 1,
            fontFamily: 'monospace',
            whiteSpace: 'pre-line',
            maxHeight: 400,
            overflow: 'auto'
          }}>
            <Typography variant="body2" component="pre" sx={{ margin: 0 }}>
              {testResults.join('\n')}
            </Typography>
          </Box>
        )}
      </Paper>

      <Alert severity="success">
        <Typography variant="body2">
          <strong>Expected Results:</strong>
          <br />• All formatting tests should show ✅ MATCH
          <br />• Backend payloads should match our formatting exactly
          <br />• Parse/reformat should be identical to original
          <br />• Football scenarios should produce correct time strings
        </Typography>
      </Alert>
    </Box>
  );
};

export default TimingSystemTest;