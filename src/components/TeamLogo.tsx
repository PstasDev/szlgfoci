'use client';

import React from 'react';
import { Avatar, Box } from '@mui/material';
import { getTagozatColor, getTeamTagozatLetter } from '@/utils/dataUtils';
import type { Team, Standing } from '@/types/api';

interface TeamLogoProps {
  team?: Team | Standing | null;
  teamName?: string;
  size?: number;
  fontSize?: string;
  showBorder?: boolean;
  fallbackColor?: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({
  team,
  teamName,
  size = 32,
  fontSize = '0.8rem',
  showBorder = false,
  fallbackColor
}) => {
  // Get team info
  const teamData = team || (teamName ? { tagozat: teamName } : null);
  const logoUrl = team && 'logo_url' in team ? team.logo_url : null;
  const tagozatLetter = teamData ? getTeamTagozatLetter(teamData) : '?';
  const bgColor = fallbackColor || getTagozatColor(tagozatLetter);

  // If logo URL is available, show the logo
  if (logoUrl) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: showBorder ? '2px solid' : 'none',
          borderColor: showBorder ? bgColor : 'transparent',
          backgroundColor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={logoUrl}
          alt={`${teamName || 'Team'} logo`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            // Fallback to tagozat letter if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `
              <div style="
                width: 100%; 
                height: 100%; 
                background-color: ${bgColor}; 
                color: white; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-weight: bold; 
                font-size: ${fontSize};
                border-radius: 50%;
              ">
                ${tagozatLetter}
              </div>
            `;
          }}
        />
      </Box>
    );
  }

  // Fallback to colored avatar with tagozat letter
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: bgColor,
        fontSize: fontSize,
        fontWeight: 'bold',
        color: 'white',
        border: showBorder ? '2px solid rgba(255, 255, 255, 0.2)' : 'none',
        boxShadow: showBorder ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
      }}
    >
      {tagozatLetter}
    </Avatar>
  );
};

export default TeamLogo;