'use client';

import React from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Sports as SportsIcon,
  People as PeopleIcon,
  SportsScore as ScoreIcon,
  SportsSoccer as SoccerIcon,
  Gavel as GavelIcon,
} from '@mui/icons-material';

interface HeaderProps {
  selectedSeason?: string;
  onSeasonChange?: (season: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedSeason: _selectedSeason, onSeasonChange: _onSeasonChange }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'CSAPATOK', icon: <PeopleIcon />, href: '/csapatok' },
    { text: 'MECCSEK', icon: <SportsIcon />, href: '/merkozesek' },
    { text: 'GÓLLÖVŐLISTA', icon: <ScoreIcon />, href: '/gollista' },
    { text: 'SZABÁLYZAT', icon: <GavelIcon />, href: '/szabalyzat' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%' }}>
      <Box sx={{ 
        my: 3, 
        color: 'primary.main', 
        fontWeight: 'bold',
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1
      }}>
        <SoccerIcon sx={{ fontSize: 24, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Focikupa
        </Typography>
      </Box>
      
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              component={Link} 
              href={item.href}
              sx={{ 
                textAlign: 'left',
                borderRadius: 2,
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontWeight: 600, 
                    fontSize: '0.9rem',
                    color: 'text.primary'
                  } 
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 2, md: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: { xs: 1, sm: 2 }, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            component={Link}
            href="/"
            variant="h5"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 },
              color: 'text.primary',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              textDecoration: 'none',
            }}
          >
            <SoccerIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: 'primary.main' }} />
            Focikupa
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                href={item.href}
                sx={{ 
                  fontWeight: 500,
                  fontSize: { md: '0.75rem', lg: '0.8rem' },
                  px: { md: 0.8, lg: 1.2 },
                  py: 0.8,
                  color: 'text.primary',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: { xs: 280, sm: 320 },
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderRightColor: 'divider'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
