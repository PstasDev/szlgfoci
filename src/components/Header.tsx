'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Home as HomeIcon,
  SportsScore as ScoreIcon,
} from '@mui/icons-material';

interface HeaderProps {
  selectedSeason?: string;
  onSeasonChange?: (season: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedSeason: _selectedSeason, onSeasonChange: _onSeasonChange }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showLogo, setShowLogo] = React.useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'FŐOLDAL', icon: <HomeIcon />, href: '/' },
    { text: 'CSAPATOK', icon: <PeopleIcon />, href: '/csapatok' },
    { text: 'MECCSEK', icon: <SportsIcon />, href: '/merkozesek' },
    { text: 'GÓLLÖVŐLISTA', icon: <ScoreIcon />, href: '/gollista' },
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
        {showLogo && (
          <Image 
            src="/favicon.svg" 
            alt="Focikupa logo" 
            width={24} 
            height={24}
            style={{ flexShrink: 0 }}
            onError={() => setShowLogo(false)}
          />
        )}
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
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
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
            variant="h5"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 },
              color: 'text.primary',
              fontSize: { xs: '1.2rem', sm: '1.5rem' }
            }}
          >
            {showLogo && (
              <Image 
                src="/favicon.svg" 
                alt="Focikupa logo" 
                width={28} 
                height={28}
                style={{ flexShrink: 0 }}
                onError={() => setShowLogo(false)}
              />
            )}
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
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease'
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
