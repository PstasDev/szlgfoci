import { Metadata } from 'next';
import { Match } from '@/types/api';

interface GenerateMetadataProps {
  params: { id: string };
}

// Helper function to fetch match data for metadata
async function getMatchForMetadata(_id: string): Promise<Match | null> {
  try {
    // This would typically fetch from your API
    // For now, we'll return null and handle it gracefully
    return null;
  } catch (error) {
    console.error('Error fetching match for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const matchId = params.id;
  const match = await getMatchForMetadata(matchId);
  
  const baseUrl = 'https://foci.szlg.info';
  const matchUrl = `${baseUrl}/merkozesek/${matchId}`;
  
  if (!match) {
    return {
      title: 'Mérkőzés részletei - Szlgfoci',
      description: 'Iskolai labdarúgó bajnokság mérkőzés részletei',
      openGraph: {
        title: 'Szlgfoci - Iskolai Foci Kupa',
        description: 'Iskolai labdarúgó bajnokság mérkőzés részletei',
        url: matchUrl,
        siteName: 'Szlgfoci',
        images: [{
          url: `${baseUrl}/api/og/match?homeTeam=Mérkőzés&awayTeam=Betöltés&status=upcoming`,
          width: 1200,
          height: 630,
        }],
        locale: 'hu_HU',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Szlgfoci - Iskolai Foci Kupa',
        description: 'Iskolai labdarúgó bajnokság mérkőzés részletei',
      },
    };
  }

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

  // Generate match image URL for OpenGraph
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
    });
    
    return `${baseUrl}/api/og/match?${params.toString()}`;
  };

  const title = generateTitle();
  const description = generateDescription();
  const imageUrl = generateImageUrl();

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: matchUrl,
      siteName: 'Szlgfoci - Iskolai Foci Kupa',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: `${match.homeTeam} vs ${match.awayTeam} mérkőzés részletei`,
      }],
      locale: 'hu_HU',
      type: 'article',
      publishedTime: `${match.date}T${match.time}:00.000Z`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    other: {
      // Instagram specific optimizations
      'ig:title': title,
      'ig:description': description,
      'ig:image': imageUrl,
    },
  };
}