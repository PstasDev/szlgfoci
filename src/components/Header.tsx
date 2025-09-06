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
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Sports as SportsIcon,
  EmojiEvents as TrophyIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Home as HomeIcon,
  SportsScore as ScoreIcon,
} from '@mui/icons-material';
import { leagueSeasons } from '@/data/mockData';

interface HeaderProps {
  selectedSeason?: string;
  onSeasonChange?: (season: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  selectedSeason = '2024-25', 
  onSeasonChange 
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currentSeason, setCurrentSeason] = React.useState(selectedSeason);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    setCurrentSeason(selectedSeason);
  }, [selectedSeason]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSeasonChange = (event: any) => {
    const newSeason = event.target.value;
    setCurrentSeason(newSeason);
    if (onSeasonChange) {
      onSeasonChange(newSeason);
    }
  };

  const menuItems = [
    { text: 'FŐOLDAL', icon: <HomeIcon />, href: '/' },
    { text: 'LIGA TABELLA', icon: <TrophyIcon />, href: '/tabella' },
    { text: 'CSAPATOK', icon: <PeopleIcon />, href: '/csapatok' },
    { text: 'MECCSEK', icon: <SportsIcon />, href: '/merkozesek' },
    { text: 'GÓLLÖVŐLISTA', icon: <ScoreIcon />, href: '/gollista' },
    { text: 'JÁTÉKOSOK', icon: <PeopleIcon />, href: '/jatekosok' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main', fontWeight: 'bold' }}>
        ⚽ SZLG FOCI
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={Link} 
              href={item.href}
              sx={{ textAlign: 'center' }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' } }}
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
          backgroundColor: theme.palette.primary.main, // SZLG blue background
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
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
              gap: 1
            }}
          >
            ⚽ SZLG FOCI
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.8, 
                fontSize: '0.7rem',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Labdarúgó Bajnokság
            </Typography>
          </Typography>

          {/* League Selector */}
          <Box sx={{ mr: 2 }}>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: { xs: 180, md: 200 },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                '& .MuiSelect-select': { color: 'white' },
                '& .MuiSvgIcon-root': { color: 'white' },
              }}
            >
              <InputLabel>Liga</InputLabel>
              <Select
                value={currentSeason}
                label="Liga"
                onChange={handleSeasonChange}
              >
                {leagueSeasons.map((season) => (
                  <MenuItem key={season.id} value={season.id}>
                    {season.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {menuItems.slice(0, 5).map((item) => (
              <Button
                key={item.text}
                component={Link}
                href={item.href}
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  px: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
