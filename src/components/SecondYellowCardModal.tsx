'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  useTheme
} from '@mui/material';
import {
  Warning as YellowCardIcon,
  Block as RedCardIcon
} from '@mui/icons-material';

interface Player {
  id: number;
  name: string;
  csk: boolean;
  start_year: number | null;
  tagozat: string | null;
  effective_start_year: number | null;
  effective_tagozat: string | null;
}

interface SecondYellowCardModalProps {
  open: boolean;
  player: Player | null;
  minute: number;
  half: number;
  onClose: () => void;
  onYellowCard: () => void;
  onRedCard: () => void;
  loading?: boolean;
}

const SecondYellowCardModal: React.FC<SecondYellowCardModalProps> = ({
  open,
  player,
  minute,
  half,
  onClose,
  onYellowCard,
  onRedCard,
  loading = false
}) => {
  const theme = useTheme();

  if (!player) return null;

  return (
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
          border: `2px solid ${theme.palette.warning.main}`,
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <YellowCardIcon sx={{ color: theme.palette.warning.main, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.warning.main }}>
            Második sárga lap
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {player.name} • {minute}. perc ({half}. félidő)
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
        <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.primary }}>
          Ez a játékos már kapott egy sárga lapot ebben a mérkőzésben.
        </Typography>
        
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: theme.palette.text.primary }}>
          Mit szeretne tenni?
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 100,
                backgroundColor: theme.palette.warning.main,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                boxShadow: `0 4px 20px ${theme.palette.warning.main}30`
              }}
            >
              <YellowCardIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Typography variant="body2" fontWeight="bold">
              Sárga lap
            </Typography>
          </Box>
          
          <Typography variant="h4" sx={{ alignSelf: 'center', mx: 2, color: theme.palette.text.secondary }}>
            vagy
          </Typography>
          
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 100,
                backgroundColor: theme.palette.error.main,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                boxShadow: `0 4px 20px ${theme.palette.error.main}30`
              }}
            >
              <RedCardIcon sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Typography variant="body2" fontWeight="bold">
              Automatikus piros lap
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Mégse
        </Button>
        
        <Button
          variant="contained"
          onClick={onYellowCard}
          disabled={loading}
          startIcon={<YellowCardIcon />}
          sx={{
            backgroundColor: theme.palette.warning.main,
            '&:hover': { backgroundColor: theme.palette.warning.dark },
            minWidth: 140,
            py: 1
          }}
        >
          Sárga lap
        </Button>
        
        <Button
          variant="contained"
          onClick={onRedCard}
          disabled={loading}
          startIcon={<RedCardIcon />}
          sx={{
            backgroundColor: theme.palette.error.main,
            '&:hover': { backgroundColor: theme.palette.error.dark },
            minWidth: 140,
            py: 1
          }}
        >
          Piros lap
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SecondYellowCardModal;