import { UserData } from "@/store";

export const CREDIT_CARDS = [
  {
    id: "1",
    lastFour: "4242",
    brand: "mastercard",
    name: "Cartão Principal",
    expDate: "12/25",
  },
  {
    id: "2",
    lastFour: "5555",
    brand: "mastercard",
    name: "Cartão Secundário",
    expDate: "06/24",
  },
];

export const BADGES = [
  {
    id: "first_help",
    name: "Primeira Ajuda",
    description: "Realizou sua primeira contribuição para transformar vidas",
    icon: "🎖️",
    condition: (user: UserData) => (user.sponsorships?.length || 0) >= 1,
  },
  {
    id: "impact_maker",
    name: "Agente de Impacto",
    description: "Investiu mais de R$500 em oportunidades de educação",
    icon: "🤝",
    condition: (user: UserData) =>
      (user.sponsorships?.reduce((sum, s) => sum + s.amount, 0) || 0) >= 500,
  },
  {
    id: "consistent_supporter",
    name: "Apoio Constante",
    description: "Contribuiu para pelo menos 5 cursos diferentes",
    icon: "📚",
    condition: (user: UserData) => (user.sponsorships?.length || 0) >= 5,
  },
  {
    id: "community_champion",
    name: "Campeão da Comunidade",
    description: "Reconhecido pelo compromisso máximo com a causa",
    icon: "🏆",
    condition: (user: UserData) => (user.sponsorLevel || 0) >= 4,
  },
];

export const COURSES = [
  {
    id: "1",
    title: "Alfabetização de Jovens e Adultos",
    description:
      "Curso gratuito de leitura e escrita para quem deseja aprender ou aprimorar a alfabetização.",
    category: "Educação",
    price: 320,
    duration: "16 semanas",
  },
  {
    id: "2",
    title: "Introdução à Informática",
    description:
      "Aprenda a usar computador, internet e ferramentas básicas para o dia a dia.",
    category: "Tecnologia",
    price: 160,
    duration: "8 semanas",
  },
  {
    id: "3",
    title: "Noções Básicas de Inglês",
    description:
      "Curso de inglês voltado para conversação e situações do cotidiano.",
    category: "Idiomas",
    price: 240,
    duration: "12 semanas",
  },
  {
    id: "4",
    title: "Empreendedorismo Comunitário",
    description:
      "Aprenda a criar pequenos negócios e gerar renda na sua comunidade.",
    category: "Empreendedorismo",
    price: 200,
    duration: "10 semanas",
  },
  {
    id: "5",
    title: "Oficina de Artesanato Sustentável",
    description:
      "Transforme materiais recicláveis em peças artesanais e decorativas.",
    category: "Artesanato",
    price: 120,
    duration: "6 semanas",
  },
  {
    id: "6",
    title: "Culinária Saudável",
    description: "Receitas acessíveis e nutritivas para o dia a dia.",
    category: "Culinária",
    price: 100,
    duration: "5 semanas",
  },
  {
    id: "7",
    title: "Educação Financeira para Famílias",
    description:
      "Organize seu orçamento e planeje o futuro com recursos limitados.",
    category: "Finanças",
    price: 120,
    duration: "6 semanas",
  },
  {
    id: "8",
    title: "Fotografia Comunitária",
    description: "Use seu celular para registrar eventos e histórias locais.",
    category: "Fotografia",
    price: 80,
    duration: "4 semanas",
  },
  {
    id: "9",
    title: "Português para Imigrantes",
    description:
      "Aprenda português básico para facilitar a integração no Brasil.",
    category: "Idiomas",
    price: 200,
    duration: "10 semanas",
  },
  {
    id: "10",
    title: "Primeiros Socorros",
    description:
      "Aprenda técnicas essenciais para ajudar em emergências até a chegada de profissionais.",
    category: "Saúde",
    price: 60,
    duration: "3 semanas",
  },
];

export const SPONSOR_LEVELS = [
  {
    level: 1,
    name: "Iniciante",
    pointsRequired: 0,
    badge: "🥉",
    benefits: ["Acesso básico"],
  },
  {
    level: 2,
    name: "Apoiador",
    pointsRequired: 100,
    badge: "🥈",
    benefits: ["Selo no perfil", "Prioridade na lista de patrocinadores"],
  },
  {
    level: 3,
    name: "Benfeitor",
    pointsRequired: 500,
    badge: "🥇",
    benefits: ["Reconhecimento público", "Relatórios de impacto"],
  },
  {
    level: 4,
    name: "Visionário",
    pointsRequired: 1000,
    badge: "🏆",
    benefits: ["Participação em eventos", "Histórias dos estudantes"],
  },
];
