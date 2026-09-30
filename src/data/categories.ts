import { CategoryMeta } from '../types/question';

export const QUESTION_BANK_CATEGORIES: CategoryMeta[] = [
  {
    id: 'international',
    name: 'International & Summits',
    code: 'INTL',
    description: 'FTAs, Geopolitics, NATO, OPEC, BRICS, BIMSTEC, UN & Bilateral Treaties',
    section: 'question_bank'
  },
  {
    id: 'history',
    name: 'Indian & World History',
    code: 'HIST',
    description: 'Freedom Movements, Indian National Congress, Treaties & Historical Events',
    section: 'question_bank'
  },
  {
    id: 'sports',
    name: 'Sports & Championships',
    code: 'SPRT',
    description: 'Cricket World Cups, FIFA, FIDE Chess, Wimbledon, Olympics & Athletics',
    section: 'question_bank'
  },
  {
    id: 'polity',
    name: 'Constitution & Polity',
    code: 'POLT',
    description: 'Judiciary, Delimitation, Finance Commission, Schemes, Acts & Governance',
    section: 'question_bank'
  },
  {
    id: 'science',
    name: 'Science, Space & Tech',
    code: 'SCIE',
    description: 'NISAR, Gaganyaan, ISRO, AI Missions, Semiconductors & Defence',
    section: 'question_bank'
  },
  {
    id: 'environment',
    name: 'Environment & Ecology',
    code: 'ENVR',
    description: 'COP Summits, Conservation, National Parks, Ramsar Sites & Climate Treaties',
    section: 'question_bank'
  },
  {
    id: 'culture',
    name: 'Awards & General Heritage',
    code: 'AWRD',
    description: 'Nobel Prizes, Jnanpith, National Symbols, Emblem, Anthem & General Studies',
    section: 'question_bank'
  }
];

export const CURRENT_AFFAIRS_CATEGORIES: CategoryMeta[] = [
  {
    id: 'ca_fifa',
    name: 'FIFA 2026 & Football History',
    code: 'FIFA',
    description: 'World Cup 2026, Host Cities, IFAB/VAR Rules, FIFA Governance, India at Olympics & Women World Cup',
    section: 'current_affairs'
  },
  {
    id: 'ca_asian_games',
    name: 'Asian Games (Hangzhou, 2026 & History)',
    code: 'ASIA',
    description: 'Hangzhou 2023 107-Medal Haul, Aichi-Nagoya 2026, Randhir Singh OCA 2024, Indian Asiad Records & Asiad History',
    section: 'current_affairs'
  },
  {
    id: 'ca_dirac_medal',
    name: 'Dirac & Boltzmann Medals: Prof. Deepak Dhar',
    code: 'DIRAC',
    description: 'Prof. Deepak Dhar (First Indian Boltzmann Medalist 2022, Dirac Medals, Statistical Physics, Self-Organized Criticality & Indian Laureates)',
    section: 'current_affairs'
  },
  {
    id: 'ca_nepal_flood',
    name: 'Nepal Flash Floods 2024 & Glacial Disasters',
    code: 'NEPAL',
    description: 'Kathmandu Valley 2024 Catastrophic Monsoon Inundation, Bagmati & Koshi River Systems, Himalayan GLOFs & Transboundary Impact',
    section: 'current_affairs'
  },
  {
    id: 'ca_census',
    name: 'Census of India & Delimitation',
    code: 'CENS',
    description: 'Digital Census 2027, Ladakh Early Rollout, Caste Enumeration Policies, Delimitation Freeze, 106th Amendment & Historical Milestones',
    section: 'current_affairs'
  },
  {
    id: 'ca_south_china_sea',
    name: 'South China Sea Disputes & UNCLOS',
    code: 'SCS',
    description: 'Sabina Shoal (Escoda), Second Thomas Shoal (BRP Sierra Madre), Scarborough Shoal, 2016 Hague PCA Award & UNCLOS Maritime Regimes',
    section: 'current_affairs'
  },
  {
    id: 'ca_polymer_currency',
    name: 'Polymer Banknotes & RBI Currency System',
    code: 'POLY',
    description: 'RBI 5-City ₹10 Polymer Trials (Kochi, Mysore, Jaipur, Shimla, Bhubaneswar), BOPP Substrate, Bank of England & RBI Currency Architecture',
    section: 'current_affairs'
  },
  {
    id: 'ca_astronauts_gallantry',
    name: 'Gaganyaan Astronauts & Gallantry Awards',
    code: 'GAGN',
    description: 'Gp Capt Shubhanshu Shukla (Axiom-4 ISS Pilot), 4 Gaganyaan Designates, HLVM3 & CE20, Param Vir Chakra & Peacetime Gallantry Medals',
    section: 'current_affairs'
  }
];

export const CATEGORIES: CategoryMeta[] = [
  ...QUESTION_BANK_CATEGORIES,
  ...CURRENT_AFFAIRS_CATEGORIES
];
