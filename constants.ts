import { Game, Plan } from './types';

export const GAMES: Game[] = [
  {
    id: '1',
    title: 'Cyber Drift 2077',
    description: 'Um jogo de corrida futurista de alta octanagem nas ruas de Neo-Tokyo. Personalize seu veículo e domine o asfalto cibernético.',
    price: 59.99,
    image: 'https://picsum.photos/400/600?random=1',
    banner: 'https://picsum.photos/1920/1080?random=1',
    rating: 4.8,
    category: 'Corrida',
    platform: 'PC',
    releaseDate: '2023-11-15',
    tags: ['Cyberpunk', 'Corrida', 'Multijogador'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    screenshots: [
      'https://picsum.photos/1920/1080?random=101',
      'https://picsum.photos/1920/1080?random=102',
      'https://picsum.photos/1920/1080?random=103'
    ]
  },
  {
    id: '2',
    title: 'Shadows of Eldoria',
    description: 'Um RPG épico de fantasia sombria. Explore masmorras, lute contra dragões e descubra os segredos de um reino esquecido.',
    price: 49.99,
    image: 'https://picsum.photos/400/600?random=2',
    banner: 'https://picsum.photos/1920/1080?random=2',
    rating: 4.9,
    category: 'RPG',
    platform: 'Playstation 4',
    releaseDate: '2024-01-20',
    tags: ['Fantasia', 'RPG', 'Mundo Aberto'],
    screenshots: [
      'https://picsum.photos/1920/1080?random=104',
      'https://picsum.photos/1920/1080?random=105'
    ]
  },
  {
    id: '3',
    title: 'Galactic Front',
    description: 'Comande sua frota estelar em batalhas táticas em tempo real. A galáxia está em guerra e só você pode trazer a paz.',
    price: 39.99,
    image: 'https://picsum.photos/400/600?random=3',
    banner: 'https://picsum.photos/1920/1080?random=3',
    rating: 4.5,
    category: 'Estratégia',
    platform: 'PC',
    releaseDate: '2023-09-10',
    tags: ['Sci-Fi', 'Estratégia', 'Espaço'],
    screenshots: []
  },
  {
    id: '4',
    title: 'Neon Assassin',
    description: 'Furtividade e ação se encontram neste thriller cyberpunk. Elimine alvos de alto perfil sem deixar rastros.',
    price: 29.99,
    image: 'https://picsum.photos/400/600?random=4',
    banner: 'https://picsum.photos/1920/1080?random=4',
    rating: 4.7,
    category: 'Ação',
    platform: 'Xbox 360',
    releaseDate: '2024-03-05',
    tags: ['Stealth', 'Ação', 'Singleplayer'],
    screenshots: [
      'https://picsum.photos/1920/1080?random=106'
    ]
  },
  {
    id: '5',
    title: 'Apex Legends: Arena',
    description: 'O battle royale definitivo evoluiu. Novos heróis, novas armas e um modo arena intenso.',
    price: 0,
    image: 'https://picsum.photos/400/600?random=5',
    banner: 'https://picsum.photos/1920/1080?random=5',
    rating: 4.6,
    category: 'Tiro 1 Pessoa',
    platform: 'Playstation 3',
    releaseDate: '2022-05-12',
    tags: ['FPS', 'Battle Royale', 'Grátis'],
    screenshots: []
  },
  {
    id: '6',
    title: 'Mythos Reborn',
    description: 'Deuses antigos despertam. Um jogo de ação e aventura inspirado na mitologia grega com visuais deslumbrantes.',
    price: 69.99,
    image: 'https://picsum.photos/400/600?random=6',
    banner: 'https://picsum.photos/1920/1080?random=6',
    rating: 4.9,
    category: 'Aventura',
    platform: 'Playstation 2',
    releaseDate: '2024-02-14',
    tags: ['Mitologia', 'Ação', 'História Rica'],
    screenshots: [
       'https://picsum.photos/1920/1080?random=107',
       'https://picsum.photos/1920/1080?random=108',
       'https://picsum.photos/1920/1080?random=109',
       'https://picsum.photos/1920/1080?random=110'
    ]
  },
];

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1.00,
    features: ['Plano de Teste', 'Acesso Limitado'],
    isPopular: false,
    isHidden: true
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 19.90,
    features: ['Até 5 downloads por mês', 'Acesso a todos os jogos', 'Suporte por email'],
    isPopular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39.90,
    features: ['Até 15 downloads por mês', 'Acesso a todos os jogos', 'Suporte prioritário 24/7', 'Velocidade máxima', 'Acesso antecipado a lançamentos', 'Sem anúncios'],
    isPopular: true,
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 49.90,
    features: ['Downloads ilimitados', 'Tudo do Premium +', 'Acesso a jogos exclusivos', 'Download simultâneo', 'Biblioteca em nuvem', '1 mês grátis para amigos', 'Badge exclusivo'],
    isPopular: false,
  },
];

export const CATEGORIES = [
  'Todos',
  'Ação',
  'Arcade',
  'Aventura',
  'Corrida',
  'Emuladores',
  'Esportes',
  'Esportes Radicais',
  'Futebol',
  'Infantil',
  'Kinect',
  'Mundo Aberto',
  'Plataforma',
  'Programas',
  'PTBR',
  'RPG',
  'Simulador',
  'Tiro 1 Pessoa',
  'Tiro 3 Pessoa',
  'Sem categoria',
  'Xbox Clássico'
];

export const PLATFORMS = [
  'Playstation',
  'Playstation 2',
  'Playstation 3',
  'Playstation 4',
  'Xbox 360'
];