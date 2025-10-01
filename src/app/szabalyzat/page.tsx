"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import {
  SportsSoccer as SoccerIcon,
  Warning as WarningIcon,
  PersonOff as PersonOffIcon,
  Schedule as ScheduleIcon,
  Groups as GroupsIcon,
  Gavel as GavelIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import SimpleLayout from "../../components/SimpleLayout";

export default function RulesPage() {
  const rulesSections = [
    {
      id: "alapveto",
      title: "Alapvető szabályok",
      icon: <SoccerIcon />,
      color: "primary",
      rules: [
        {
          text: "A stoplis cipő használata tilos!",
          important: true,
        },
        {
          text: "A csapatok 4 mezőnyjátékosból és 1 kapusból állnak.",
        },
        {
          text: "A csapatkeret maximum 10 játékosból állhat!",
        },
        {
          text: "A cseréket a játék folyamán bármikor és bármennyiszer lehet végrehajtani!",
          subRule: "A csere addig nem léphet pályára, amíg az őt cserélő játékos nem hagyta el azt!",
        },
        {
          text: "A meccsek lejátszását maximum 2 héttel lehet eltolni!",
          subRule: "Amennyiben egy csapat nem játszik egymás után 3 héten 1 mérkőzést sem, azt a csapatot 3 pont levonással szankcionáljuk.",
        },
        {
          text: "A csapaton belül minden játékosnak ugyanolyan színű mezt kell viselnie!",
          subRule: "Amennyiben két ugyanolyan színű csapat játszik, a fiatalabbik vagy a nem rendes mezt viselő csapatnak kell megkülönböztetőt felvennie!",
        },
      ],
    },
    {
      id: "kizaras",
      title: "Kizárás",
      icon: <PersonOffIcon />,
      color: "error",
      rules: [
        {
          text: "Kizárás esetén a kizárt csapattól elvesszük az összes szerzett pontot és gólt.",
          important: true,
        },
        {
          text: "A kizárt csapat addig lejátszott meccseit töröljük.",
          important: true,
        },
        {
          text: "Amennyiben egy csapat nem tudja a bajnokság végéig lejátszani az összes mérkőzését, kizárással szankcionáljuk.",
        },
        {
          text: "Amennyiben egy csapat nem játszik egymás után 5 héten 1 mérkőzést sem, kizárjuk a bajnokságból.",
        },
      ],
    },
    {
      id: "magatartas",
      title: "Magatartás",
      icon: <GroupsIcon />,
      color: "warning",
      rules: [
        {
          text: "A bíró/ellenfél játékosainak szidása sárgalapot von maga után!",
          important: true,
        },
        {
          text: "Nézők vállalhatatlan viselkedése esetén a bírónak joga van megszakítani a mérkőzést.",
          subRule: "Ha ez nem történik meg, a sértett csapat kapitánya jelezheti ezt a szervezők felé.",
        },
        {
          text: "Verekedés esetén piros lappal szankcionáljuk az agresszív felet/feleket.",
          important: true,
        },
        {
          text: "Piros lap vagy az 5. sárga lap megszerzése után a szabálytalanságot elkövető játékos a következő fordulóról el van tiltva!",
          important: true,
        },
        {
          text: "A játék menetének szándékos akadályozása sárga lapot von maga után!",
        },
      ],
    },
    {
      id: "jatek-menete",
      title: "Játék menete",
      icon: <ScheduleIcon />,
      color: "success",
      rules: [
        {
          text: "2*10 perc játék.",
          important: true,
        },
        {
          text: "Az óra csak akkor áll meg, amikor a labda kimegy a hálón kívülre!",
        },
        {
          text: "A bíró alkalmazhat hosszabbítást.",
        },
        {
          text: "A labda eléréséhez való becsúszás csak abban az esetben engedélyezett, ha ez nem veszélyezteti az ellenfél csapat játékosának testi épségét!",
          important: true,
        },
        {
          text: "Az oldalvonalról csak bedobás és térd alatti berúgás végezhető el!",
          subRule: "Első alkalommal egy szóbeli figyelmeztetést kap a szabálytalanságot elkövető csapat, és újból el kell végezniük a beadást. A második alkalomtól kezdve az ellenfél csapata jön az oldalvonalról!",
        },
        {
          text: "A kirúgást 6 másodperc alatt kell elvégezni, amennyiben ez nem teljesül az ellenfél csapata jön szöglettel!",
        },
        {
          text: "Bármelyik mezőnyjátékos kiadhatja az alapvonalról kiment labdát!",
          subRule: "A kirúgást 8 másodperc alatt kell elvégezni, amennyiben ez nem teljesül, az ellenfél csapata jön szöglettel!",
        },
        {
          text: "Amennyiben a kéz meghosszabbítja a test felületét az ellenfél csapata jön!",
        },
        {
          text: "Szabadrúgásnál a védekező csapat sorfalának 5 méterre kell lennie!",
        },
        {
          text: "Szögletrúgásnál a legközelebbi védekező játékos a 6-os vonalán tartózkodhat!",
        },
        {
          text: "A szándékosan lábbal hazaadott, kapus által megfogott labda után az ellenfél csapata jön közvetett szabadrúgással a 6-os vonaláról!",
        },
        {
          text: "Amennyiben a kapus a 6-oson kívül fogja meg a labdát, az ellenfél csapata jön közvetett szabadrúgással!",
        },
      ],
    },
  ];

  const getSectionColorProps = (color: string) => {
    switch (color) {
      case "error":
        return {
          backgroundColor: "rgba(234, 67, 53, 0.1)",
          borderColor: "rgba(234, 67, 53, 0.3)",
          iconColor: "error.main",
        };
      case "warning":
        return {
          backgroundColor: "rgba(255, 152, 0, 0.1)",
          borderColor: "rgba(255, 152, 0, 0.3)",
          iconColor: "warning.main",
        };
      case "success":
        return {
          backgroundColor: "rgba(52, 168, 83, 0.1)",
          borderColor: "rgba(52, 168, 83, 0.3)",
          iconColor: "success.main",
        };
      default:
        return {
          backgroundColor: "rgba(66, 165, 245, 0.1)",
          borderColor: "rgba(66, 165, 245, 0.3)",
          iconColor: "primary.main",
        };
    }
  };

  return (
    <SimpleLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ p: 3, maxWidth: "1200px", mx: "auto" }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <GavelIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
                SZLG FOCI Szabályzat
              </Typography>
            </motion.div>

            <Alert
              severity="info"
              sx={{
                maxWidth: 600,
                mx: "auto",
                backgroundColor: "rgba(66, 165, 245, 0.1)",
                border: "1px solid rgba(66, 165, 245, 0.3)",
                "& .MuiAlert-icon": {
                  color: "primary.main",
                },
              }}
            >
              <Typography variant="body2">
                Minden játékos és csapat köteles betartani az alábbi szabályokat.
                A szabálysértés szankciókkal járhat.
              </Typography>
            </Alert>
          </Box>

          {/* Rules Sections */}
          <Stack spacing={4}>
            {rulesSections.map((section, index) => {
              const colorProps = getSectionColorProps(section.color);
              
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                >
                  <Card
                    sx={{
                      background: colorProps.backgroundColor,
                      border: `1px solid ${colorProps.borderColor}`,
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Section Header */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            color: colorProps.iconColor,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {section.icon}
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            color: colorProps.iconColor,
                          }}
                        >
                          {section.title}
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 3, borderColor: colorProps.borderColor }} />

                      {/* Rules List */}
                      <List sx={{ p: 0 }}>
                        {section.rules.map((rule, ruleIndex) => (
                          <ListItem
                            key={ruleIndex}
                            sx={{
                              p: 0,
                              mb: 2,
                              flexDirection: "column",
                              alignItems: "stretch",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1,
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: rule.important ? 600 : 400,
                                  color: rule.important ? colorProps.iconColor : "text.primary",
                                  flex: 1,
                                  lineHeight: 1.6,
                                }}
                              >
                                • {rule.text}
                              </Typography>
                              {rule.important && (
                                <Chip
                                  icon={<WarningIcon sx={{ fontSize: 16 }} />}
                                  label="Fontos"
                                  size="small"
                                  sx={{
                                    backgroundColor: colorProps.iconColor,
                                    color: "white",
                                    fontSize: "0.7rem",
                                    height: 24,
                                    "& .MuiChip-icon": {
                                      color: "white",
                                    },
                                  }}
                                />
                              )}
                            </Box>
                            
                            {rule.subRule && (
                              <Box
                                sx={{
                                  ml: 3,
                                  mt: 1,
                                  p: 2,
                                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                                  borderRadius: 1,
                                  borderLeft: `3px solid ${colorProps.iconColor}`,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.secondary",
                                    fontStyle: "italic",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  ↳ {rule.subRule}
                                </Typography>
                              </Box>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </Stack>

          {/* Footer Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                  p: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                Ez a szabályzat a SZLG FOCI bajnokság minden résztvevőjére vonatkozik.
                A szabályok betartása minden játékos és csapat felelőssége.
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </motion.div>
    </SimpleLayout>
  );
}