// Type definitions for your data for better code safety
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

interface Comunicado {
  id: number;
  slug: string;
  titulo: string;
  data: string;
  conteudo: string;
}

// Helper function to convert date strings to ISO format with error handling
const toISOString = (dateStr: string, timeStr: string = '00:00'): string => {
  try {
    const [day, month, year] = dateStr.split('/');
    
    // Validate date parts exist
    if (!day || !month || !year) {
      console.warn(`Invalid date format: ${dateStr}`);
      return new Date().toISOString(); // Fallback to current date
    }
    
    // Create date object
    const date = new Date(`${year}-${month}-${day}T${timeStr}`);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date created from: ${dateStr} ${timeStr}`);
      return new Date().toISOString(); // Fallback to current date
    }
    
    return date.toISOString();
  } catch (error) {
    console.error(`Error parsing date: ${dateStr} ${timeStr}`, error);
    return new Date().toISOString(); // Fallback to current date
  }
};

// Function to generate the schema for game events
export const generateEventsSchema = (seniores: Event[], formacao: Event[]) => {
  return [...seniores, ...formacao].map(event => {
    const awayTeamName = event.title.includes('vs') ? event.title.split('vs ')[1] : 'Adversário a definir';
    
    return {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "name": event.title,
      "startDate": toISOString(event.date, event.time),
      "location": {
        "@type": "Place",
        "name": event.location,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rua do Mercado, 31",
          "addressLocality": "Ponta Delgada",
          "postalCode": "9500-326",
          "addressRegion": "Açores",
          "addressCountry": "PT"
        }
      },
      "sport": "Hóquei em Patins",
      "homeTeam": {
        "@type": "SportsTeam",
        "name": "Hóquei Clube PDL",
        "url": "https://hoqueiclubepdl.com/"
      },
      "awayTeam": {
        "@type": "SportsTeam",
        "name": awayTeamName
      },
      "organizer": {
        "@type": "Organization",
        "name": "Federação de Patinagem de Portugal",
        "alternateName": "FPP",
        "url": "https://fpp.pt/"
      },
      "description": `Jogo de hóquei em patins da categoria ${event.type} em Ponta Delgada, Açores. Hóquei Clube PDL vs ${awayTeamName}.`
    };
  });
};

// Function to generate the schema for news articles
export const generateNewsSchema = (comunicados: Comunicado[]) => {
  return comunicados.map(comunicado => ({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": comunicado.titulo,
    "datePublished": toISOString(comunicado.data),
    "dateModified": toISOString(comunicado.data),
    "articleBody": comunicado.conteudo,
    "inLanguage": "pt-PT",
    "url": `https://hoqueiclubepdl.com/comunicados/${comunicado.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://hoqueiclubepdl.com/comunicados/${comunicado.slug}`
    },
    "author": {
      "@type": "Organization",
      "name": "Hóquei Clube PDL",
      "url": "https://hoqueiclubepdl.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hóquei Clube PDL",
      "url": "https://hoqueiclubepdl.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hoqueiclubepdl.com/uploads/pdlLogo.png",
        "width": 512,
        "height": 512
      }
    }
  }));
};