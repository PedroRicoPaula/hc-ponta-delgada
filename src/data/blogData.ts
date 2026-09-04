export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  readTime: number;
  photo?: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "merch-oficial-15-anos",
    title: "Merch oficial e 15 anos de Hóquei Clube PDL",
    excerpt: "Já podes reservar a colecção 2026/27 no site: camisola dos 15 anos, equipamento de jogo e mais. Sem envios. O levantamento é no pavilhão.",
    date: "2026-09-04",
    author: "Hóquei Clube PDL",
    category: "Clube",
    readTime: 4,
    photo: "/uploads/blog/camisola-15-anos.jpeg",
    tags: ["merch", "15 anos", "loja oficial", "Ponta Delgada"],
    content: `
## Quinze anos em Ponta Delgada

O Hóquei Clube PDL foi fundado a 12 de setembro de 2012, depois de o Clube União Micaelense ter encerrado a secção de hóquei em patins. Um grupo de antigos atletas e dirigentes quis manter a modalidade na cidade. Na época 2026/27 assinalamos esses 15 anos com uma camisola comemorativa, a peça de destaque desta colecção.

Não somos o único clube de hóquei em patins em São Miguel. Na ilha há outros, como o Caldeiras Hóquei Clube (Ribeira Grande) e o Marítimo Sport Clube. A modalidade na ilha é organizada pela Associação de Patinagem de São Miguel, filiada na Federação de Patinagem de Portugal. O HC PDL compete, nos seniores, no Campeonato Nacional da 3.ª Divisão (Série Sul B).

A merch não é uma loja com correio. É equipamento e recordação do clube, para quem treina, joga ou apoia.

---

## Página de merch no site

Abrimos a [página de merch](/merch): catálogo com preços de sócio e de não sócio, tamanhos e reserva por email.

Como funciona:

- Escolhes as peças no site
- Envias a reserva a partir do teu email (o site não cobra nem guarda o pedido)
- Transferes para o IBAN do Hóquei Clube PDL e anexas o comprovativo
- O clube confirma, incluindo se o preço de sócio se aplica
- **Levantas no Pavilhão Sidónio Serpa.** Não fazemos envios.

---

## A camisola dos 15 anos

É uma t-shirt da época, com o distintivo **15** ao peito. Preço: 23 € sócio, 27 € não sócio. Tamanhos do XS ao XXL.

A foto deste artigo é um recorte da frente da peça, o mesmo modelo do catálogo.

---

## O resto da colecção 2026/27

Na mesma página encontras, entre outras:

- Camisola de jogo (principal ou alternativa) e guarda-redes
- Equipamento de jogo (camisola reversível e calções pretos)
- Sweat com ou sem capuz
- Softshell, cachecol e boné

Preços e variantes estão no catálogo. Qualquer dúvida, o email da reserva é [hoquei.clube.pdl@gmail.com](mailto:hoquei.clube.pdl@gmail.com).

---

## Reserva já

[Abre a merch](/merch), escolhe a camisola dos 15 anos ou o que precisares, e envia o pedido. Quando o clube confirmar, vês-nos no pavilhão.

*Treinos e contactos: [página inicial](/#contact).*
    `.trim(),
  },
  {
    slug: "beneficios-hoquei-em-patins",
    title: "Os benefícios do hóquei em patins",
    excerpt: "Uma modalidade rápida, colectiva e exigente: o que o hóquei em patins desenvolve no corpo, na cabeça e no grupo, no pavilhão e fora dele.",
    date: "2026-06-15",
    author: "Hóquei Clube PDL",
    category: "Modalidade",
    readTime: 6,
    photo: "/uploads/blog/hoquei-em-patins.jpg",
    tags: ["hóquei em patins", "benefícios", "saúde", "desporto", "formação"],
    content: `
## O que é o hóquei em patins?

O hóquei em patins (também chamado rink hockey) joga-se em patins de quatro rodas, em pavilhão. Duas equipas de cinco jogadores, incluindo o guarda-redes, tentam meter a bola na baliza adversária com sticks curvos.

Em Portugal a modalidade tem história longa e palmarés internacional. Nos Açores pratica-se em São Miguel desde 1947, segundo a Associação de Patinagem de São Miguel. Vários clubes passaram por essa história. O Hóquei Clube PDL surgiu em 2012, em Ponta Delgada, e hoje partilha a ilha com outros clubes de hóquei em patins.

---

## Benefícios físicos

### Coração e resistência
O jogo mistura sprints com recuperação activa. Exige o sistema cardiovascular de forma intensa, como outros desportos de pavilhão de alta intensidade.

### Força e equilíbrio
Patinar pede pernas, glúteos e tronco de forma contínua. O passe e o remate envolvem os braços e o core. O equilíbrio em movimento (a propriocepção) treina-se a cada sessão.

### Agilidade
Mudanças de direcção, travagens e arranques pedem quadris e tornozelos disponíveis. Com treino regular, a resposta no chão fica mais rápida.

---

## Benefícios cognitivos

### Leitura de jogo
Há que antecipar o adversário, ver o espaço e decidir em pouco tempo. Isso treina o pensamento táctico e a decisão sob pressão.

### Concentração
A velocidade do jogo obriga a atenção sustentada. Filtrar o ruído do pavilhão é um hábito útil também na escola e no trabalho.

### Técnica
Remate, passe e defesa repetidos constroem automatismos. Sem isso, o jogo não flui.

---

## Benefícios sociais e emocionais

### Espírito de equipa
Ninguém ganha sozinho. Confiar no colega e pôr o grupo à frente do individual faz parte do desporto colectivo.

### Gestão de emoções
A derrota, o erro num lance decisivo e a pressão de um jogo oficial ensinam a lidar com frustração. O pavilhão é uma escola de resiliência.

### Disciplina
Pontualidade, indicação do treinador e cuidado com o equipamento são hábitos pequenos que se notam no resto da vida. O desporto federado, quando é bem acompanhado, ajuda a estruturar rotinas.

### Integração
O balneário junta idades e temperamentos diferentes. Muitas amizades duradouras começam aí.

---

## Crianças e jovens

No HC PDL há formação em Sub-11, Sub-13 e Sub-17. Nesta fase o patinar ajuda o desenvolvimento motor, a confiança e o sentido de pertença a um clube. Também tira tempo ao ecrã, se a família acompanhar o ritmo de treinos.

---

## Porque escolher esta modalidade?

Poucas modalidades juntam velocidade, técnica, táctica e contacto controlado no mesmo pavilhão. No Hóquei Clube PDL praticamos isto desde 2012, com seniores no Campeonato Nacional da 3.ª Divisão da FPP e formação a competir a nível regional e nacional.

**Se queres experimentar, para ti ou para os teus filhos, fala connosco.**

---

*Inscrições e horários: [contactos](/#contact). Foto: treino de hóquei em patins, Wikimedia Commons (licença livre).*
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function getRecentPosts(count = 3): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
