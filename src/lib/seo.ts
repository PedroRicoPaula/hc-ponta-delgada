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
        "address": "Pavilhão Sidónio Serpa, Rua do Mercado, 31, 9500-326 Ponta Delgada"
      },
      "homeTeam": {
        "@type": "SportsTeam",
        "name": "Hóquei Clube Ponta Delgada"
      },
      "awayTeam": {
        "@type": "SportsTeam",
        "name": awayTeamName
      },
      "description": `Jogo de hóquei em patins da categoria ${event.type} em Ponta Delgada, Açores.`   
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
    "articleBody": comunicado.conteudo,
    "author": {
      "@type": "Organization",
      "name": "Hóquei Clube Ponta Delgada",
      "url": "https://hoqueiclubepdl.com/"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Hóquei Clube Ponta Delgada",
        "logo": {
            "@type": "ImageObject",
            "url": "https://hoqueiclubepdl.com/uploads/pdlLogo.png"
        }
    }
  }));
};