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
    slug: "beneficios-hoquei-em-patins",
    title: "Os Benefícios do Hóquei em Patins: Muito Mais do que um Desporto",
    excerpt: "Descobre como a prática do hóquei em patins desenvolve não apenas o físico, mas também o carácter, a disciplina e o espírito de equipa — benefícios que duram uma vida inteira.",
    date: "2026-06-15",
    author: "Hóquei Clube PDL",
    category: "Modalidade",
    readTime: 6,
    tags: ["hóquei em patins", "benefícios", "saúde", "desporto", "formação"],
    content: `
## O que é o Hóquei em Patins?

O hóquei em patins — também conhecido como rink hockey ou roller hockey — é uma modalidade coletiva praticada em patins de quatro rodas (patins de roda), em que dois equipas de cinco jogadores (incluindo o guarda-redes) se defrontam num pavilhão fechado, tentando introduzir uma bola na baliza adversária utilizando sticks curvos.

Portugal é uma das maiores potências mundiais desta modalidade, com inúmeros títulos europeus e mundiais. Nos Açores, o Hóquei Clube PDL é o embaixador desta tradição desportiva desde 2012.

---

## Benefícios Físicos

### Cardiovascular e Resistência
O hóquei em patins é uma atividade de alta intensidade que alterna sprints explosivos com períodos de recuperação ativa. Esta dinâmica desenvolve o sistema cardiovascular de forma eficaz, melhorando a capacidade aeróbica e anaeróbica. Estudos mostram que uma hora de jogo pode queimar entre 500 a 700 calorias, equivalente a uma sessão de corrida intensa.

### Força e Potência Muscular
A prática regular fortalece os músculos das pernas, glúteos e core de forma natural e funcional. O ato de patinar exige ativação constante dos músculos estabilizadores, enquanto os movimentos de passe e remate trabalham o tronco superior e os membros superiores.

### Coordenação e Equilíbrio
Patinar requer um equilíbrio dinâmico constante. Com o tempo, os praticantes desenvolvem uma consciência corporal excecional — a chamada propriocepção — que beneficia todas as outras atividades físicas do dia a dia. A coordenação olho-mão necessária para controlar o stick e a bola simultaneamente aguça os reflexos e a destreza motora.

### Flexibilidade e Agilidade
Os movimentos de mudança de direção, travagens e arranques rápidos exigem e desenvolvem flexibilidade nos quadris e tornozelos. Com treino regular, os atletas tornam-se significativamente mais ágeis e responsivos.

---

## Benefícios Cognitivos

### Pensamento Tático
O hóquei em patins é um desporto de leitura permanente do jogo. Os jogadores precisam de antecipar movimentos adversários, identificar espaços livres e tomar decisões em frações de segundo. Esta exigência cognitiva treina o pensamento estratégico e a tomada de decisão sob pressão — competências valiosas fora do pavilhão.

### Concentração e Foco
A velocidade do jogo obriga a um estado de atenção elevado e sustentado. Os praticantes aprendem a filtrar distrações e a manter o foco num ambiente caótico — uma habilidade transferível para o estudo e a vida profissional.

### Memória Muscular
A repetição de técnicas — o remate, o passe, a defesa — constrói memória muscular que permite executar movimentos complexos de forma automática. Este processo de aprendizagem motora otimiza a neuroplasticidade cerebral.

---

## Benefícios Sociais e Emocionais

### Espírito de Equipa
O hóquei em patins é, acima de tudo, um desporto coletivo. Nenhum jogador ganha sozinho. A interdependência dentro de uma equipa ensina humildade, confiança nos colegas e a arte de colocar o grupo acima do individual — valores que formam cidadãos melhores.

### Gestão de Emoções
Aprender a lidar com a derrota, a frustração de um erro num momento decisivo ou a pressão de um jogo importante são experiências que desenvolvem a resiliência emocional. O desporto é, por isso, uma escola de vida incomparável.

### Disciplina e Responsabilidade
Chegar aos treinos com pontualidade, cumprir as orientações do treinador e manter os equipamentos em ordem são pequenos hábitos que constroem uma mentalidade disciplinada. Crianças que praticam desporto federado tendem a ter melhores resultados académicos e menos comportamentos de risco.

### Integração Social
O balneário cria laços únicos. A convivência entre atletas de diferentes idades, backgrounds e personalidades ensina tolerância, comunicação e empatia. Muitas das amizades mais duradouras da vida formam-se num pavilhão desportivo.

---

## Benefícios para as Crianças e Jovens

Para os escalões de formação — como os que o HCPDL tem ao nível Sub-11, Sub-13 e Sub-17 — os benefícios são ainda mais marcantes:

- **Desenvolvimento motor global**: a aprendizagem do patinar nesta fase potencia o desenvolvimento das capacidades motoras fundamentais
- **Autoestima e confiança**: superar desafios físicos e técnicos constrói uma autoimagem positiva
- **Rotinas saudáveis**: o treino regular afasta os jovens de comportamentos sedentários e do excesso de tempo em ecrãs
- **Sentido de pertença**: fazer parte de um clube cria uma identidade comunitária positiva

---

## Porquê Escolher o Hóquei em Patins?

Numa era de crescente sedentarismo e isolamento digital, o hóquei em patins oferece o que poucas modalidades conseguem: velocidade, técnica, estratégia, contacto físico controlado e — sobretudo — uma comunidade unida por uma paixão comum.

No Hóquei Clube PDL, esta modalidade é praticada com orgulho desde 2012, formando atletas que representam os Açores em competições nacionais e contribuindo para o desenvolvimento desportivo da nossa ilha.

**Se procuras uma atividade completa para ti ou para os teus filhos, o hóquei em patins é a resposta.** Vem treinar connosco!

---

*Tens dúvidas sobre como inscrever o teu filho ou sobre os nossos treinos? [Contacta-nos](/  #contact) — temos escalões para todas as idades.*
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
