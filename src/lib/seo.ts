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

// Helper function to convert date strings to ISO format
const toISOString = (dateStr: string, timeStr: string = '00:00') => {
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}T${timeStr}`).toISOString();
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
            "url": "https://hoqueiclubepdl.com/lovable-uploads/13209336-cce9-4537-b6a8-01a8f59aaada.png"
        }
    }
  }));
};