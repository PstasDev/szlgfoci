'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  FormHelperText,
  Chip
} from '@mui/material';
import { AccessTime as TimeIcon } from '@mui/icons-material';
import { validateMatchTime, getTimeSuggestions, formatEventTime, parseFormattedTime } from '@/utils/dataUtils';

interface TimeInputProps {
  minute: number;
  extraTime?: number | null;
  onChange: (minute: number, extraTime?: number | null) => void;
  currentMinute?: number; // For intelligent suggestions
  currentExtraTime?: number; // NEW: Current extra time from backend
  half?: number; // For intelligent suggestions
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  variant?: 'standard' | 'outlined' | 'filled';
  size?: 'small' | 'medium';
}

const TimeInput: React.FC<TimeInputProps> = ({
  minute,
  extraTime,
  onChange,
  currentMinute,
  currentExtraTime,
  half = 1,
  label = 'Match Time',
  required = false,
  error = false,
  helperText,
  disabled = false,
  variant = 'outlined',
  size = 'medium'
}) => {
  const [minuteValue, setMinuteValue] = useState<string>(minute.toString());
  const [extraTimeValue, setExtraTimeValue] = useState<string>(extraTime ? extraTime.toString() : '');
  const [formattedValue, setFormattedValue] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Update formatted value when minute or extra time changes
  useEffect(() => {
    const formatted = formatEventTime(minute, extraTime);
    setFormattedValue(formatted);
  }, [minute, extraTime]);

  // Validate input
  useEffect(() => {
    const validation = validateMatchTime(minute, extraTime);
    setValidationError(validation.isValid ? '' : validation.error || '');
  }, [minute, extraTime]);

  // Get intelligent suggestions
  const suggestions = currentMinute ? getTimeSuggestions(currentMinute, currentExtraTime, half) : [];

  const handleMinuteChange = (newMinute: string) => {
    setMinuteValue(newMinute);
    const minuteNum = parseInt(newMinute, 10);
    if (!isNaN(minuteNum) && minuteNum > 0) {
      onChange(minuteNum, extraTime);
    }
  };

  const handleExtraTimeChange = (newExtraTime: string) => {
    setExtraTimeValue(newExtraTime);
    const extraTimeNum = newExtraTime ? parseInt(newExtraTime, 10) : null;
    if (newExtraTime === '' || (!isNaN(extraTimeNum!) && extraTimeNum! >= 0)) {
      onChange(minute, extraTimeNum);
    }
  };

  const handleFormattedTimeSelect = (selectedTime: string) => {
    const parsed = parseFormattedTime(selectedTime);
    setMinuteValue(parsed.minute.toString());
    setExtraTimeValue(parsed.extraTime ? parsed.extraTime.toString() : '');
    onChange(parsed.minute, parsed.extraTime);
  };

  const showValidationError = validationError && !helperText;
  const finalHelperText = validationError || helperText || 'Enter base minute + extra time (e.g., 45+3)';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Intelligent suggestions */}
      {suggestions.length > 0 && (
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
            Quick suggestions:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {suggestions.map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                size="small"
                variant="outlined"
                onClick={() => handleFormattedTimeSelect(suggestion)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Main time input */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          label={label}
          value={minuteValue}
          onChange={(e) => handleMinuteChange(e.target.value)}
          type="number"
          required={required}
          error={error || !!validationError}
          disabled={disabled}
          variant={variant}
          size={size}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TimeIcon />
              </InputAdornment>
            ),
            inputProps: {
              min: 1,
              max: 120,
              step: 1
            }
          }}
        />

        <Typography variant="h6" sx={{ color: 'text.secondary', minWidth: 20, textAlign: 'center' }}>
          +
        </Typography>

        <TextField
          label="Extra Time"
          value={extraTimeValue}
          onChange={(e) => handleExtraTimeChange(e.target.value)}
          type="number"
          disabled={disabled}
          variant={variant}
          size={size}
          placeholder="0"
          sx={{ width: 120 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  min
                </Typography>
              </InputAdornment>
            ),
            inputProps: {
              min: 0,
              max: 15,
              step: 1
            }
          }}
        />

        <Typography variant="h6" sx={{ color: 'text.secondary', minWidth: 20 }}>
          &apos;
        </Typography>
      </Box>

      {/* Display formatted result */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Display:
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600, 
            color: validationError ? 'error.main' : 'primary.main',
            fontFamily: 'monospace'
          }}
        >
          {formattedValue}
        </Typography>
      </Box>

      {/* Help text */}
      {(showValidationError || helperText) && (
        <FormHelperText error={!!validationError}>
          {finalHelperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default TimeInput;