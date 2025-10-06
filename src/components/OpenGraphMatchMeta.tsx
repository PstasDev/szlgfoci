'use client';

import { Match } from '@/types/api';

interface OpenGraphMatchMetaProps {
  match: Match;
}

/**
 * Component that generates OpenGraph meta tags optimized for Instagram DMs and social sharing
 * for match detail pages. Creates rich previews with match information.
 */
export default function OpenGraphMatchMeta({ match }: OpenGraphMatchMetaProps) {
  const baseUrl = 'https://foci.szlg.info';
  const matchUrl = `${baseUrl}/merkozesek/${match.id}`;
  
  // Generate rich title for the match
  const generateTitle = () => {
    if (match.status === 'upcoming') {
      return `${match.homeTeam} vs ${match.awayTeam} - ${match.date} ${match.time}`;
    } else if (match.status === 'live') {
      return `🔴 ÉLŐ: ${match.homeTeam} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.awayTeam}`;
    } else {
      return `${match.homeTeam} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.awayTeam} - Végeredmény`;
    }
  };

  // Generate rich description with match details
  const generateDescription = () => {
    const baseDesc = `📅 ${match.date} ${match.time} | 📍 ${match.venue}`;
    
    if (match.status === 'upcoming') {
      return `Közelgő mérkőzés: ${baseDesc} | ⚽ ${match.round}`;
    } else if (match.status === 'live') {
      const goals = match.events?.filter(e => e.type === 'goal')?.length || 0;
      return `Élő mérkőzés: ${baseDesc} | 🥅 ${goals} gól eddig | ⚽ ${match.round}`;
    } else {
      const homeGoals = match.events?.filter(e => e.type === 'goal' && e.team === 'home')?.length || 0;
      const awayGoals = match.events?.filter(e => e.type === 'goal' && e.team === 'away')?.length || 0;
      const cards = match.events?.filter(e => e.type === 'yellow_card' || e.type === 'red_card')?.length || 0;
      return `Befejezett mérkőzés: ${baseDesc} | 🥅 ${homeGoals + awayGoals} gól | 🟨🟥 ${cards} lap | ⚽ ${match.round}`;
    }
  };

  // Generate match image URL for OpenGraph (this would be an API endpoint that generates match images)
  const generateImageUrl = () => {
    const params = new URLSearchParams({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore?.toString() || '0',
      awayScore: match.awayScore?.toString() || '0',
      status: match.status,
      date: match.date,
      time: match.time,
      venue: match.venue,
      round: match.round,
      homeColor: match.homeTeamObj?.color || '#42a5f5',
      awayColor: match.awayTeamObj?.color || '#f44336',
      homeLogoUrl: match.homeTeamObj?.logo_url || '',
      awayLogoUrl: match.awayTeamObj?.logo_url || '',
    });
    
    return `${baseUrl}/api/og/match?${params.toString()}`;
  };

  const title = generateTitle();
  const description = generateDescription();
  const imageUrl = generateImageUrl();

  return (
    <>
      {/* Standard meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph meta tags - optimized for Instagram and Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Szlgfoci - Iskolai Foci Kupa" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={matchUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${match.homeTeam} vs ${match.awayTeam} mérkőzés részletei`} />
      <meta property="og:locale" content="hu_HU" />
      
      {/* Article specific OG tags */}
      <meta property="article:published_time" content={`${match.date}T${match.time}:00.000Z`} />
      <meta property="article:section" content="Sport" />
      <meta property="article:tag" content="labdarúgás" />
      <meta property="article:tag" content="iskola" />
      <meta property="article:tag" content="bajnokság" />
      <meta property="article:tag" content={match.homeTeam} />
      <meta property="article:tag" content={match.awayTeam} />
      
      {/* Twitter Card meta tags - optimized for sharing */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@szlgfoci" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${match.homeTeam} vs ${match.awayTeam} mérkőzés részletei`} />
      
      {/* Instagram specific optimizations */}
      <meta property="ig:title" content={title} />
      <meta property="ig:description" content={description} />
      <meta property="ig:image" content={imageUrl} />
      
      {/* WhatsApp sharing optimization */}
      <meta property="og:image:type" content="image/png" />
      
      {/* Additional SEO and sharing meta tags */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={matchUrl} />
      
      {/* JSON-LD structured data for rich search results */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            "name": title,
            "description": description,
            "url": matchUrl,
            "image": imageUrl,
            "startDate": `${match.date}T${match.time}:00.000Z`,
            "location": {
              "@type": "Place",
              "name": match.venue
            },
            "homeTeam": {
              "@type": "SportsTeam",
              "name": match.homeTeam
            },
            "awayTeam": {
              "@type": "SportsTeam", 
              "name": match.awayTeam
            },
            "sport": "Football",
            "eventStatus": match.status === 'live' ? "https://schema.org/EventScheduled" : 
                          match.status === 'finished' ? "https://schema.org/EventPostponed" : 
                          "https://schema.org/EventScheduled",
            ...(match.status !== 'upcoming' && {
              "homeTeamScore": match.homeScore || 0,
              "awayTeamScore": match.awayScore || 0
            })
          })
        }}
      />
    </>
  );
}