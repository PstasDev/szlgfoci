'use client';

import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Paper,
  Chip,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { Match } from '@/utils/dataUtils';
import TeamLogo from './TeamLogo';

interface MatchShareComponentProps {
  match: Match;
}

/**
 * Component that provides comprehensive sharing options for match details,
 * including Instagram Stories with custom 9:16 generated image
 */
const MatchShareComponent: React.FC<MatchShareComponentProps> = ({ match }) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const baseUrl = 'https://foci.szlg.info';
  const matchUrl = `${baseUrl}/merkozesek/${match.id}`;

  // Generate share text
  const generateShareText = () => {
    if (match.status === 'upcoming') {
      return `⚽ Következő meccs: ${match.homeTeam} vs ${match.awayTeam}\n📅 ${match.date} ${match.time}\n📍 ${match.venue}\n🏆 ${match.round}\n\n${matchUrl}`;
    } else if (match.status === 'live') {
      const homeScore = match.homeScore !== null && match.homeScore !== undefined ? match.homeScore : 0;
      const awayScore = match.awayScore !== null && match.awayScore !== undefined ? match.awayScore : 0;
      return `🔴 ÉLŐ: ${match.homeTeam} ${homeScore} - ${awayScore} ${match.awayTeam}\n📍 ${match.venue}\n🏆 ${match.round}\n\n${matchUrl}`;
    } else {
      const homeScore = match.homeScore !== null && match.homeScore !== undefined ? match.homeScore : 0;
      const awayScore = match.awayScore !== null && match.awayScore !== undefined ? match.awayScore : 0;
      return `⚽ Végeredmény: ${match.homeTeam} ${homeScore} - ${awayScore} ${match.awayTeam}\n📅 ${match.date}\n📍 ${match.venue}\n🏆 ${match.round}\n\n${matchUrl}`;
    }
  };

  // Generate Instagram Stories image (9:16 aspect ratio)
  const generateStoryImage = async (): Promise<string> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not available');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    // Set canvas size for Instagram Stories (1080x1920)
    canvas.width = 1080;
    canvas.height = 1920;

    // Helper function to load images
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          // Check if image actually loaded properly
          if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            reject(new Error('Image failed to load properly'));
          } else {
            resolve(img);
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        // Handle different URL formats
        if (src.startsWith('http://') || src.startsWith('https://')) {
          img.src = src;
        } else if (src.startsWith('/')) {
          // Relative URL, make it absolute
          img.src = `${window.location.origin}${src}`;
        } else {
          // Assume it's a relative path
          img.src = `${window.location.origin}/${src}`;
        }
      });
    };

    // Helper function to draw circular image with clean styling
    const drawCircularImage = (
      img: HTMLImageElement, 
      x: number, 
      y: number, 
      radius: number,
      fallbackColor: string,
      fallbackText: string
    ) => {
      ctx.save();
      
      // Clean circular clipping without excessive effects
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();

      try {
        // Calculate dimensions to fit image in circle while maintaining aspect ratio
        const size = radius * 2;
        const imgAspect = img.width / img.height;
        let drawWidth = size;
        let drawHeight = size;
        
        if (imgAspect > 1) {
          drawHeight = size / imgAspect;
        } else {
          drawWidth = size * imgAspect;
        }
        
        const drawX = x - drawWidth / 2;
        const drawY = y - drawHeight / 2;
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      } catch {
        // Clean fallback to colored circle with text
        ctx.fillStyle = fallbackColor;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        
        ctx.fillStyle = 'white';
        ctx.font = `bold ${radius * 0.6}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fallbackText, x, y);
      }
      
      ctx.restore();
      
      // Clean white border inspired by the design
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.stroke();
      
      // Subtle outer shadow for depth
      ctx.beginPath();
      ctx.arc(x, y, radius + 3, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // Enhanced background with dynamic gradient inspired by the design
    const createDynamicBackground = () => {
      // Create main gradient background similar to the red design
      const mainGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      // Use team colors for dynamic gradient, fallback to red design
      const primaryColor = match.homeTeamObj?.color || '#dc2626';
      const secondaryColor = match.awayTeamObj?.color || '#b91c1c';
      
      // Create dynamic gradient based on team colors
      mainGradient.addColorStop(0, primaryColor);
      mainGradient.addColorStop(0.3, `${primaryColor}dd`);
      mainGradient.addColorStop(0.7, `${secondaryColor}dd`);
      mainGradient.addColorStop(1, secondaryColor);
      
      ctx.fillStyle = mainGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add dynamic geometric pattern overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      
      // Diagonal stripes pattern inspired by the design
      ctx.save();
      ctx.translate(0, 0);
      ctx.rotate(-Math.PI / 6); // 30 degree angle
      
      for (let i = -canvas.height; i < canvas.width + canvas.height; i += 120) {
        ctx.fillRect(i, -canvas.height, 60, canvas.height * 2);
      }
      ctx.restore();

      // Add geometric triangular elements
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      
      // Top geometric elements
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(300, 0);
      ctx.lineTo(0, 300);
      ctx.closePath();
      ctx.fill();
      
      // Bottom geometric elements
      ctx.beginPath();
      ctx.moveTo(canvas.width, canvas.height);
      ctx.lineTo(canvas.width - 300, canvas.height);
      ctx.lineTo(canvas.width, canvas.height - 300);
      ctx.closePath();
      ctx.fill();

      // Add subtle hexagonal pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 2;
      
      const hexSize = 40;
      for (let x = 0; x < canvas.width; x += hexSize * 1.5) {
        for (let y = 0; y < canvas.height; y += hexSize * 1.3) {
          drawHexagon(x + (y % (hexSize * 2.6) === 0 ? 0 : hexSize * 0.75), y, hexSize);
        }
      }
    };

    // Helper function to draw hexagon
    const drawHexagon = (centerX: number, centerY: number, radius: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    };

    createDynamicBackground();

    // Top section with clean, modern styling inspired by the design
    const topY = 180;
    
    // Main title with enhanced typography
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 15;
    ctx.letterSpacing = '4px';
    
    // Add letter spacing effect manually
    const titleText = 'SZLG FOCI';
    const titleLetters = titleText.split('');
    const titleX = canvas.width / 2 - (titleLetters.length * 32); // Approximate spacing
    
    titleLetters.forEach((letter, index) => {
      ctx.fillText(letter, titleX + (index * 64), topY);
    });
    
    ctx.shadowBlur = 0;
    
    // Subtitle with modern styling
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.letterSpacing = '8px';
    
    const subtitleText = 'MÉRKŐZÉS';
    const subtitleLetters = subtitleText.split('');
    const subtitleX = canvas.width / 2 - (subtitleLetters.length * 28);
    
    subtitleLetters.forEach((letter, index) => {
      ctx.fillText(letter, subtitleX + (index * 56), topY + 80);
    });

    // Modern status indicator with clean design
    let statusText = '';
    let statusColor = '';
    let statusBg = '';

    if (match.status === 'live') {
      statusText = 'ÉLŐ';
      statusColor = '#10b981';
      statusBg = 'rgba(16, 185, 129, 0.2)';
    } else if (match.status === 'finished') {
      statusText = 'VÉGE';
      statusColor = '#6b7280';
      statusBg = 'rgba(107, 114, 128, 0.2)';
    } else {
      statusText = 'HAMAROSAN';
      statusColor = '#f59e0b';
      statusBg = 'rgba(245, 158, 11, 0.2)';
    }

    // Clean status badge design
    const statusY = topY + 180;
    const statusPadding = 30;
    ctx.font = 'bold 32px Arial, sans-serif';
    const statusWidth = ctx.measureText(statusText).width;
    const statusBoxWidth = statusWidth + (statusPadding * 2);
    const statusBoxX = (canvas.width - statusBoxWidth) / 2;
    
    // Modern rounded rectangle effect
    const cornerRadius = 25;
    ctx.beginPath();
    ctx.roundRect(statusBoxX, statusY - 25, statusBoxWidth, 50, cornerRadius);
    ctx.fillStyle = statusBg;
    ctx.fill();
    
    ctx.strokeStyle = statusColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = statusColor;
    ctx.fillText(statusText, canvas.width / 2, statusY + 10);

    // Main teams section with clean, modern design inspired by the attachment
    const centerY = canvas.height / 2 + 100;
    const teamSpacing = 450;
    const logoRadius = 120;

    // Team positioning for balanced layout
    const homeTeamX = canvas.width / 2 - teamSpacing / 2;
    const awayTeamX = canvas.width / 2 + teamSpacing / 2;

    // Clean VS section without excessive effects
    const vsY = centerY - 80;
    
    // Simple, clean VS text inspired by the design
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 8;
    ctx.fillText('VS', canvas.width / 2, vsY);
    ctx.shadowBlur = 0;

    // Load team logos if available
    let homeLogoImg: HTMLImageElement | null = null;
    let awayLogoImg: HTMLImageElement | null = null;

    try {
      if (match.homeTeamObj?.logo_url) {
        homeLogoImg = await loadImage(match.homeTeamObj.logo_url);
      }
    } catch (error) {
      console.log('Failed to load home team logo:', error);
      homeLogoImg = null;
    }

    try {
      if (match.awayTeamObj?.logo_url) {
        awayLogoImg = await loadImage(match.awayTeamObj.logo_url);
      }
    } catch (error) {
      console.log('Failed to load away team logo:', error);
      awayLogoImg = null;
    }

    // Clean team logo positioning
    const teamLogoY = centerY + 60;

    // Home team logo with clean circular design
    if (homeLogoImg) {
      drawCircularImage(
        homeLogoImg, 
        homeTeamX, 
        teamLogoY, 
        logoRadius,
        match.homeTeamObj?.color || '#dc2626',
        match.homeTeam.charAt(0)
      );
    } else {
      drawCircularImage(
        new Image(), 
        homeTeamX, 
        teamLogoY, 
        logoRadius,
        match.homeTeamObj?.color || '#dc2626',
        match.homeTeam.charAt(0)
      );
    }

    // Away team logo with clean circular design
    if (awayLogoImg) {
      drawCircularImage(
        awayLogoImg, 
        awayTeamX, 
        teamLogoY, 
        logoRadius,
        match.awayTeamObj?.color || '#1d4ed8',
        match.awayTeam.charAt(0)
      );
    } else {
      drawCircularImage(
        new Image(), 
        awayTeamX, 
        teamLogoY, 
        logoRadius,
        match.awayTeamObj?.color || '#1d4ed8',
        match.awayTeam.charAt(0)
      );
    }

    // Clean team names with simple typography
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 6;
    
    // Handle team names cleanly
    ctx.fillText(match.homeTeam.toUpperCase(), homeTeamX, teamLogoY + logoRadius + 80);
    ctx.fillText(match.awayTeam.toUpperCase(), awayTeamX, teamLogoY + logoRadius + 80);
    
    ctx.shadowBlur = 0;

    // Clean score or date/time display inspired by the design
    const scoreY = centerY + 300;
    
    if (match.status === 'finished' || match.status === 'live') {
      const homeScore = match.homeScore !== null && match.homeScore !== undefined ? match.homeScore : 0;
      const awayScore = match.awayScore !== null && match.awayScore !== undefined ? match.awayScore : 0;
      const scoreText = `${homeScore} - ${awayScore}`;
      
      // Clean score display without excessive styling
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 84px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.fillText(scoreText, canvas.width / 2, scoreY);
      ctx.shadowBlur = 0;

      // Simple live indicator
      if (match.status === 'live') {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 28px Arial, sans-serif';
        ctx.fillText('● ÉLŐ', canvas.width / 2, scoreY + 60);
      }
    } else {
      // Clean date and time display for upcoming matches
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 6;
      ctx.fillText(match.date, canvas.width / 2, scoreY - 20);
      
      // Time in a clean rounded box
      const timeText = match.time;
      const timeWidth = ctx.measureText(timeText).width;
      const timePadding = 25;
      const timeBoxWidth = timeWidth + (timePadding * 2);
      const timeBoxX = (canvas.width - timeBoxWidth) / 2;
      const timeBoxY = scoreY + 20;
      
      // Clean rounded rectangle for time
      ctx.beginPath();
      ctx.roundRect(timeBoxX, timeBoxY - 25, timeBoxWidth, 50, 25);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Arial, sans-serif';
      ctx.fillText(timeText, canvas.width / 2, timeBoxY + 8);
      ctx.shadowBlur = 0;
    }

    // Clean round information inspired by the R1 badge in the design
    const roundY = scoreY + 120;
    const roundText = match.round;
    
    // Create clean round badge similar to the R1 design
    ctx.font = 'bold 28px Arial, sans-serif';
    const roundWidth = ctx.measureText(roundText).width;
    const roundPadding = 20;
    const roundBoxWidth = roundWidth + (roundPadding * 2);
    const roundBoxX = (canvas.width - roundBoxWidth) / 2;
    
    // Clean white rounded rectangle for round
    ctx.beginPath();
    ctx.roundRect(roundBoxX, roundY - 20, roundBoxWidth, 40, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // Round text in primary color
    ctx.fillStyle = match.homeTeamObj?.color || '#dc2626';
    ctx.textAlign = 'center';
    ctx.fillText(roundText, canvas.width / 2, roundY + 8);

    // Clean match details section inspired by minimal design
    const detailsY = 1500;
    
    // Simple venue display
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(match.venue, canvas.width / 2, detailsY);

    // Clean website URL section
    const urlY = 1650;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.fillText('foci.szlg.info', canvas.width / 2, urlY);

    // Minimal footer line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 1750);
    ctx.lineTo(canvas.width - 100, 1750);
    ctx.stroke();

    return canvas.toDataURL('image/png');
  };

  // Share handlers
  const handleInstagramStories = async () => {
    try {
      const imageData = await generateStoryImage();
      
      // Create a link to download the image
      const link = document.createElement('a');
      link.download = `${match.homeTeam}-vs-${match.awayTeam}-story.png`;
      link.href = imageData;
      link.click();
      
      // Show instructions
      alert('Kép letöltve! Most oszd meg Instagram Stories-ban:\n1. Nyisd meg az Instagram-ot\n2. Készíts új Story-t\n3. Válaszd ki a letöltött képet (csapat logókkal és részletekkel)\n4. Add hozzá a linket: ' + matchUrl);
    } catch (error) {
      console.error('Error generating story image:', error);
      alert('Hiba történt a kép generálása során.');
    }
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(matchUrl)}&quote=${encodeURIComponent(generateShareText())}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const text = generateShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleWhatsAppShare = () => {
    const text = generateShareText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(matchUrl).then(() => {
      setCopySnackbarOpen(true);
    });
  };

  const handleNativeShare = async () => {
    if ('share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: `${match.homeTeam} vs ${match.awayTeam}`,
          text: generateShareText(),
          url: matchUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <>
      {/* Share Button */}
      <Button
        variant="outlined"
        startIcon={<ShareIcon />}
        onClick={() => setShareDialogOpen(true)}
        sx={{
          borderColor: '#42a5f5',
          color: '#42a5f5',
          '&:hover': {
            backgroundColor: 'rgba(66, 165, 245, 0.08)',
            borderColor: '#42a5f5'
          }
        }}
      >
        Megosztás
      </Button>

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            border: '1px solid #404040',
            borderRadius: '16px'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#e8eaed',
          borderBottom: '1px solid #404040',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Mérkőzés megosztása
          </Typography>
          <IconButton
            onClick={() => setShareDialogOpen(false)}
            sx={{ color: '#9aa0a6' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Match Preview */}
            <Paper sx={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #404040',
              borderRadius: 2,
              p: 2
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                  {match.round}
                </Typography>
                {match.status === 'live' && (
                  <Chip label="ÉLŐ" size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                )}
              </Stack>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TeamLogo team={match.homeTeamObj} teamName={match.homeTeam} size={32} />
                  <Typography sx={{ color: '#e8eaed', fontWeight: 600 }}>
                    {match.homeTeam}
                  </Typography>
                </Box>
                
                <Typography variant="h5" sx={{ color: '#e8eaed', fontWeight: 'bold' }}>
                  {match.status !== 'upcoming' ? 
                    `${match.homeScore !== null && match.homeScore !== undefined ? match.homeScore : 0} - ${match.awayScore !== null && match.awayScore !== undefined ? match.awayScore : 0}` : 
                    'VS'
                  }
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ color: '#e8eaed', fontWeight: 600 }}>
                    {match.awayTeam}
                  </Typography>
                  <TeamLogo team={match.awayTeamObj} teamName={match.awayTeam} size={32} />
                </Box>
              </Stack>
              
              <Typography variant="body2" sx={{ color: '#9aa0a6', textAlign: 'center', mt: 1 }}>
                📅 {match.date} {match.time} • 📍 {match.venue}
              </Typography>
            </Paper>

            {/* Share Options */}
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ color: '#e8eaed', fontWeight: 600 }}>
                Megosztási lehetőségek
              </Typography>

              {/* Instagram Stories */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<InstagramIcon />}
                onClick={handleInstagramStories}
                sx={{
                  background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                    opacity: 0.9
                  }
                }}
              >
                Instagram Stories
              </Button>

              {/* Social Media Grid */}
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  onClick={handleFacebookShare}
                  sx={{
                    borderColor: '#1877F2',
                    color: '#1877F2',
                    '&:hover': {
                      backgroundColor: 'rgba(24, 119, 242, 0.08)',
                      borderColor: '#1877F2'
                    }
                  }}
                >
                  Facebook
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TwitterIcon />}
                  onClick={handleTwitterShare}
                  sx={{
                    borderColor: '#1DA1F2',
                    color: '#1DA1F2',
                    '&:hover': {
                      backgroundColor: 'rgba(29, 161, 242, 0.08)',
                      borderColor: '#1DA1F2'
                    }
                  }}
                >
                  Twitter
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleWhatsAppShare}
                  sx={{
                    borderColor: '#25D366',
                    color: '#25D366',
                    '&:hover': {
                      backgroundColor: 'rgba(37, 211, 102, 0.08)',
                      borderColor: '#25D366'
                    }
                  }}
                >
                  WhatsApp
                </Button>
              </Stack>

              <Divider sx={{ borderColor: '#404040' }} />

              {/* Copy Link and Native Share */}
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CopyIcon />}
                  onClick={handleCopyLink}
                  sx={{
                    borderColor: '#9aa0a6',
                    color: '#9aa0a6',
                    '&:hover': {
                      backgroundColor: 'rgba(154, 160, 166, 0.08)',
                      borderColor: '#9aa0a6'
                    }
                  }}
                >
                  Link másolása
                </Button>
                
                {'share' in navigator && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ShareIcon />}
                    onClick={handleNativeShare}
                    sx={{
                      borderColor: '#42a5f5',
                      color: '#42a5f5',
                      '&:hover': {
                        backgroundColor: 'rgba(66, 165, 245, 0.08)',
                        borderColor: '#42a5f5'
                      }
                    }}
                  >
                    Rendszer megosztás
                  </Button>
                )}
              </Stack>
            </Stack>

            {/* Instagram Stories Info */}
            <Alert 
              severity="info" 
              sx={{ 
                backgroundColor: 'rgba(66, 165, 245, 0.1)',
                border: '1px solid rgba(66, 165, 245, 0.3)',
                color: '#e8eaed',
                '& .MuiAlert-icon': {
                  color: '#42a5f5'
                }
              }}
            >
              <Typography variant="body2">
                Az Instagram Stories gomb egy optimalizált 9:16 arányú képet készít a mérkőzés információival, 
                csapat logókkal (vagy színes jelölésekkel) és minden részlettel, amit könnyedén megoszthat Stories-ban.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setCopySnackbarOpen(false)}
        message="Link vágólapra másolva!"
      />
    </>
  );
};

export default MatchShareComponent;