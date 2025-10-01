'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Stack, 
  Chip,
  Paper,
  Divider
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  SportsSoccer as SoccerIcon,
  Code as CodeIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import SimpleLayout from '../../components/SimpleLayout';

const CreditsPage: React.FC = () => {
  return (
    <SimpleLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
              A Focikupáról
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Egy iskolai labdarúgó bajnokság, amely évek óta összehoz diákokat és tanárokat a sport szeretetében
            </Typography>
          </Box>

          {/* Tournament Organizers */}
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrophyIcon color="primary" />
                  <Typography variant="h5" gutterBottom>
                    Focikupa Szervezők
                  </Typography>
                </Box>
                
                <Typography variant="body1" paragraph>
                  A Focikupa minden évben a lelkes szervezők munkájának köszönhetően valósul meg, 
                  akik gondoskodnak a bajnokság lebonyolításáról, a csapatok koordinálásáról és 
                  az esemény sikeres megrendezéséről.
                </Typography>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Jelenlegi szervezők (2025/26)
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                    <Chip label="Viniczei Viktor 21F" color="primary" />
                    <Chip label="Ács Péter 21F" color="primary" />
                  </Stack>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label="Testnevelő Tanárok" variant="outlined" />
                  <Chip label="Diákönkormányzat" variant="outlined" />
                  <Chip label="Iskolavezetés" variant="outlined" />
                  <Chip label="Adminisztrátorok" variant="outlined" />
                </Stack>

                <Paper sx={{ p: 2, bgcolor: 'info.dark', color: 'info.contrastText' }}>
                  <Typography variant="body2">
                    <strong>Történelem:</strong> Korábban éveken át a 19F osztály szervezte a bajnokságot.
                  </Typography>
                </Paper>
              </Stack>
            </CardContent>
          </Card>

          {/* Referees */}
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SoccerIcon color="primary" />
                  <Typography variant="h5" gutterBottom>
                    Bírók és Játékvezetők
                  </Typography>
                </Box>
                
                <Typography variant="body1" paragraph>
                  A mérkőzések fair play szellemben történő lebonyolításáért felelős bírók, 
                  akik biztosítják, hogy minden meccs szabályos körülmények között zajlik.
                </Typography>

                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Bíró vagy?</strong> A láblécben található &ldquo;Bíró vagyok&rdquo; linkre kattintva 
                    elérheted az adminisztrációs felületet, ahol rögzítheted a mérkőzések eredményeit.
                  </Typography>
                </Paper>
              </Stack>
            </CardContent>
          </Card>

          {/* Website Creators */}
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CodeIcon color="primary" />
                  <Typography variant="h5" gutterBottom>
                    Weboldal Fejlesztők
                  </Typography>
                </Box>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Jelenlegi Weboldal (2025/26)
                    </Typography>
                    <Typography variant="body1" paragraph>
                      A modern, responsive weboldal Next.js és React technológiákkal készült, 
                      Material-UI design rendszert használva. A valós idejű eredménykövetés 
                      és a felhasználóbarát interfész biztosítja a legjobb élményt.
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Fejlesztők:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                        <Chip label="Balla Botond 23F" color="secondary" />
                        <Chip label="Viniczei Viktor 21F" color="secondary" />
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip label="Next.js 15" size="small" color="primary" />
                      <Chip label="React" size="small" color="primary" />
                      <Chip label="Material-UI" size="small" color="primary" />
                      <Chip label="TypeScript" size="small" color="primary" />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <HistoryIcon fontSize="small" color="action" />
                      <Typography variant="h6">
                        Történelem
                      </Typography>
                    </Box>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          2024/25 tanév - Django weboldal
                        </Typography>
                        <Typography variant="body1" paragraph>
                          Az előző tanévben egy Django alapú weboldal futott az 
                          <strong> app.szlg.info/foci</strong> címen, amely már digitális 
                          megoldást nyújtott a bajnokság követésére.
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          Korábbi évek - DÖK Foci
                        </Typography>
                        <Typography variant="body1" paragraph>
                          A bajnokság korábban <strong>DÖK Foci</strong> néven futott, hagyományos 
                          papír alapú szervezéssel. Köszönet minden korábbi fejlesztőnek és szervezőnek, 
                          aki hozzájárult a projekt fejlődéséhez az évek során.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Special Thanks */}
          <Paper sx={{ p: 3, bgcolor: 'primary.dark', color: 'primary.contrastText' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Köszönetnyilvánítás
            </Typography>
            <Typography variant="body1">
              Külön köszönet minden résztvevőnek, aki évről évre részt vesz a Focikupában, 
              legyen az játékos, szurkoló, szervező vagy bíró. Ti teszitek lehetővé, 
              hogy ez az esemény minden évben sikeres és emlékezetes legyen!
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </SimpleLayout>
  );
};

export default CreditsPage;