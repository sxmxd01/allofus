import {
  LeaderboardUser,
  BankQuestion,
  Passage,
  SyllabusTopic,
  SubjectType,
} from '../types';

export interface SubjectItem {
  id: SubjectType;
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
}

export const subjectsList: SubjectItem[] = [
  {
    id: 'gk',
    label: 'General Knowledge',
    shortLabel: 'GK',
    badge: 'Topics • QB • Oneliners',
    description: 'National and international affairs, judiciary, constitutional bench rulings, treaties, and static GK.',
  },
  {
    id: 'quants',
    label: 'Quantitative Techniques',
    shortLabel: 'Quants',
    badge: 'Data Caselets Drill',
    description: 'Data interpretation, arithmetic caselets, percentage breakdowns, ratio distributions, and statistical tables.',
  },
  {
    id: 'analytical',
    label: 'Analytical Reasoning',
    shortLabel: 'Analytical Reasoning',
    badge: 'Logic Puzzles Drill',
    description: 'Complex seating arrangements, matrix logic, blood relations, syllogisms, and sequential condition sets.',
  },
];

export const initialLeaderboard: LeaderboardUser[] = [
  {
    id: 'u-avni',
    name: 'Avni',
    isCurrentUser: false,
    solvedCount: 0,
    accuracy: 100.0,
    streak: 0,
    status: 'online',
    color: '#38bdf8',
  },
  {
    id: 'u-sadvitha',
    name: 'Sadvitha',
    isCurrentUser: false,
    solvedCount: 0,
    accuracy: 100.0,
    streak: 0,
    status: 'online',
    color: '#c084fc',
  },
  {
    id: 'u-samad',
    name: 'Samad',
    isCurrentUser: true,
    solvedCount: 0,
    accuracy: 100.0,
    streak: 0,
    status: 'online',
    color: '#34d399',
  },
  {
    id: 'u-shourya',
    name: 'Shourya',
    isCurrentUser: false,
    solvedCount: 0,
    accuracy: 100.0,
    streak: 0,
    status: 'online',
    color: '#fbbf24',
  },
];

export const bankQuestions: BankQuestion[] = [
  // ========================================================
  // GK - CURRENT AFFAIRS
  // ========================================================
  {
    id: 'GK-101',
    subject: 'gk',
    type: 'current',
    category: 'Judiciary & Infrastructure',
    subtopic: 'Judicial Complexes',
    text: 'Chief Justice of India recently inaugurated which landmark multi-storey judicial complex equipped with digital e-court facilities in Gurugram, Haryana?',
    options: ['Nyaya Bhavan', 'Tower of Justice', 'Justice Plaza', 'Constitution Complex'],
    correctOptionIndex: 1, // Tower of Justice
    explanation:
      'The Tower of Justice in Gurugram was inaugurated as a high-density, paperless judicial complex integrating automated e-court video links and certified biometric evidence storage.',
    difficulty: 'Moderate',
    source: 'Haryana Judicial Gazette & The Hindu Legal Digest',
    isVerified: true,
    extraNotes: 'Remember: inaugurated in Gurugram Sector 12; key question from North Zone Judicial Conference.',
  },
  {
    id: 'GK-102',
    subject: 'gk',
    type: 'current',
    category: 'Constitutional Law',
    subtopic: 'Affirmative Action',
    text: 'Which landmark 7-judge Constitution Bench held that State Governments have constitutional power to sub-classify Scheduled Castes for affirmative action under Article 341?',
    options: [
      'State of Punjab v. Davinder Singh (2024)',
      'Jarnail Singh v. Lachhmi Narain Gupta',
      'Indra Sawhney v. Union of India',
      'M. Nagaraj v. Union of India',
    ],
    correctOptionIndex: 0,
    explanation:
      'In State of Punjab v. Davinder Singh (2024), a 7-judge bench by a 6:1 majority overruled E.V. Chinnaiah (2004) and held that Article 341 does not create an unalterable monolith, permitting empirical sub-classification.',
    difficulty: 'Hard',
    source: 'Supreme Court Reports & LiveLaw',
    isVerified: true,
    extraNotes: 'CJI D.Y. Chandrachud led the bench; Justice Bela Trivedi delivered the sole dissent.',
  },
  {
    id: 'GK-103',
    subject: 'gk',
    type: 'current',
    category: 'Criminal Law Reform',
    subtopic: 'Bharatiya Nyaya Sanhita',
    text: 'Under the Bharatiya Nyaya Sanhita (BNS), which new section penalizes acts endangering the sovereignty, unity, and integrity of India, replacing the colonial sedition provision (Section 124A IPC)?',
    options: [
      'Section 152',
      'Section 197',
      'Section 113',
      'Section 188',
    ],
    correctOptionIndex: 0,
    explanation:
      'Section 152 of the BNS replaces archaic Section 124A IPC. It omits the term "sedition" and penalizes purposely encouraging subversion, armed rebellion, or feelings of separatist activities.',
    difficulty: 'Moderate',
    source: 'Ministry of Law and Justice - BNS Gazette',
    isVerified: true,
    extraNotes: 'Punishment is imprisonment for life or up to 7 years, plus fine.',
  },
  {
    id: 'GK-104',
    subject: 'gk',
    type: 'current',
    category: 'Statutory Law',
    subtopic: 'Data Privacy',
    text: 'The Digital Personal Data Protection Act (DPDPA), 2023 mandates that data consent notices must be provided in English and how many official regional languages listed in the 8th Schedule?',
    options: ['18 languages', '22 languages', '14 languages', 'All 28 recognized languages'],
    correctOptionIndex: 1,
    explanation:
      'Section 5(3) of DPDPA specifies that data fiduciaries must provide the consent notice in English or any of the 22 languages specified in the Eighth Schedule to the Constitution of India.',
    difficulty: 'Easy',
    source: 'DPDP Act, 2023 Gazette Notification',
    isVerified: true,
    extraNotes: 'Eighth Schedule contains 22 languages: 14 initial + Sindhi (1967) + Konkani, Manipuri, Nepali (1992) + Bodo, Dogri, Maithili, Santhali (2003).',
  },
  {
    id: 'GK-105',
    subject: 'gk',
    type: 'current',
    category: 'Constitutional Appointments',
    subtopic: 'Election Commission',
    text: 'Under the Chief Election Commissioner and other Election Commissioners Act, 2023, who constitutes the 3-member Selection Committee that recommends appointments to the President?',
    options: [
      'Prime Minister, Chief Justice of India, and Leader of Opposition in Lok Sabha',
      'Prime Minister, a nominated Union Cabinet Minister, and Leader of Opposition in Lok Sabha',
      'Chief Justice of India, Law Minister, and Speaker of Lok Sabha',
      'President of India, Prime Minister, and Chief Justice of India',
    ],
    correctOptionIndex: 1,
    explanation:
      'The 2023 statutory enactment replaced the interim judicial formula of Anoop Baranwal and established a committee composed of the PM, a designated Cabinet Minister, and the Leader of the Opposition.',
    difficulty: 'Moderate',
    source: 'The Gazette of India: Act No. 49 of 2023',
    isVerified: true,
    extraNotes: 'Key controversy: Supreme Court CJI was substituted by a Cabinet Minister nominated by the PM.',
  },
  {
    id: 'GK-106',
    subject: 'gk',
    type: 'current',
    category: 'International Treaties',
    subtopic: 'Maritime Law',
    text: 'Which country recently ratified the BBNJ (Biodiversity Beyond National Jurisdiction) Treaty, also known as the High Seas Treaty, adopted under UNCLOS?',
    options: ['India', 'Palau', 'Norway', 'Singapore'],
    correctOptionIndex: 1,
    explanation:
      'Palau became the very first nation to officially ratify the High Seas Treaty (BBNJ) in early 2024. India signed the agreement at the UN Headquarters during the General Assembly.',
    difficulty: 'Moderate',
    source: 'UN Treaty Section & Division for Ocean Affairs',
    isVerified: true,
  },
  {
    id: 'GK-107',
    subject: 'gk',
    type: 'current',
    category: 'Environment & Ecology',
    subtopic: 'Ramsar Wetlands',
    text: 'With the addition of Nanjarayan Bird Sanctuary and Kazhuveli Bird Sanctuary in 2024, which Indian State holds the highest total number of Ramsar sites in India?',
    options: ['Uttar Pradesh (10 sites)', 'Tamil Nadu (18 sites)', 'Kerala (12 sites)', 'Gujarat (8 sites)'],
    correctOptionIndex: 1,
    explanation:
      'Tamil Nadu leads India with 18 Ramsar wetlands, followed by Uttar Pradesh with 10. India\'s total count now stands at 85 designated wetlands of international importance.',
    difficulty: 'Easy',
    source: 'Ministry of Environment, Forest and Climate Change',
    isVerified: true,
  },

  // ========================================================
  // GK - MOCKS QUESTIONS (CLAT Consortium Style Full Mocks)
  // ========================================================
  {
    id: 'GK-M01',
    subject: 'gk',
    type: 'mocks',
    category: 'Consortium Mock 1',
    subtopic: 'Constitutional History',
    text: 'The Constitution (First Amendment) Act, 1951 was enacted by which legislative body before the first general elections were held in independent India?',
    options: [
      'The Constituent Assembly functioning as the Provisional Parliament',
      'The Supreme Court of India under emergency decree',
      'The Interim Planning Commission',
      'The Governor-General in Council',
    ],
    correctOptionIndex: 0,
    explanation:
      'Under Article 379 of the transitional provisions, until both Houses of Parliament were elected, the Constituent Assembly exercised all legislative powers of Parliament and enacted the 1st Amendment.',
    difficulty: 'Hard',
    source: 'CLAT Consortium Official Mock Series',
    isVerified: true,
    extraNotes: 'Introduced 9th Schedule, inserted Article 15(4) following Champakam Dorairajan.',
  },
  {
    id: 'GK-M02',
    subject: 'gk',
    type: 'mocks',
    category: 'Consortium Mock 1',
    subtopic: 'International Organizations',
    text: 'Which international treaty established the Permanent Court of Arbitration (PCA) headquartered in The Hague, Netherlands?',
    options: [
      '1899 Hague Convention for the Pacific Settlement of International Disputes',
      '1945 Charter of the United Nations',
      '1919 Treaty of Versailles',
      '1969 Vienna Convention on the Law of Treaties',
    ],
    correctOptionIndex: 0,
    explanation:
      'The PCA was established by the First International Peace Conference held in The Hague in 1899, making it the oldest dispute-resolution institution for interstate arbitration.',
    difficulty: 'Hard',
    source: 'PCA Official Archives & International Law Compendium',
    isVerified: true,
  },
  {
    id: 'GK-M03',
    subject: 'gk',
    type: 'mocks',
    category: 'Consortium Mock 2',
    subtopic: 'Financial Regulations',
    text: 'Under the Reserve Bank of India framework, what is the maximum permissible limit for foreign portfolio investment (FPI) in government securities (G-Secs) under the Fully Accessible Route (FAR)?',
    options: [
      'There is no upper ceiling; eligible securities have 100% foreign investment allowed',
      'Capped strictly at 15% of outstanding stock',
      'Capped at 6% of general fiscal limits',
      'Limited to $25 billion per calendar year',
    ],
    correctOptionIndex: 0,
    explanation:
      'The Fully Accessible Route (FAR) introduced by RBI in 2020 designates specific government benchmark securities without any macro-prudential investment ceiling for non-resident investors.',
    difficulty: 'Hard',
    source: 'RBI Notifications & Sovereign Debt Reports',
    isVerified: true,
  },
  {
    id: 'GK-M04',
    subject: 'gk',
    type: 'mocks',
    category: 'Consortium Mock 2',
    subtopic: 'Space Exploration',
    text: 'Which propulsion stage in ISRO\'s LVM3 heavy-lift launch vehicle uses indigenous cryogenic engine CE-20 for placing payloads into Geosynchronous Transfer Orbit (GTO)?',
    options: ['C25 Cryogenic Upper Stage', 'S200 Solid Boosters', 'L110 Core Liquid Stage', 'Vikas Hypergolic Stage'],
    correctOptionIndex: 0,
    explanation:
      'The C25 stage is the third and uppermost stage of LVM3, powered by the indigenous cryogenic engine CE-20 burning liquid oxygen (LOX) and liquid hydrogen (LH2).',
    difficulty: 'Moderate',
    source: 'ISRO Technical Specifications',
    isVerified: true,
  },
];

export const sprintQuestions: BankQuestion[] = bankQuestions.filter((q) => q.subject === 'gk');

// ========================================================
// PASSAGES FOR QUANTS & ANALYTICAL REASONING
// ========================================================
export const passages: Passage[] = [
  // ------------------------------------------------------
  // QUANTS CASELET 1: Fast Track Special Courts (FTSC)
  // ------------------------------------------------------
  {
    id: 'pass-quants-1',
    subjectType: 'quants',
    subject: 'Quantitative Techniques',
    title: 'Data Caselet: Case Disposal Performance of Fast-Track Courts',
    source: 'Union Ministry of Law & Justice: National Judicial Data Grid (NJDG) Annual Audit',
    wordCount: 310,
    readTimeMinutes: 3,
    tableData: {
      headers: ['Zone', 'Total Cases Assigned', 'Disposed % of Assigned', 'Average Trial Days per Case'],
      rows: [
        ['North Zone', 4200, '40%', 180],
        ['South Zone', 3000, '60%', 120],
        ['East Zone', 2400, '30%', 240],
        ['West Zone', 2400, '50%', 160],
      ],
    },
    text: `A central auditing commission examined the performance of Fast-Track Special Courts (FTSCs) established across four operational zones—North, South, East, and West—during the fiscal year 2024–25. A cumulative total of 12,000 cases were assigned across all four zones.

North Zone received 35% of the total cases, South Zone received 25%, while East and West Zones received 20% each. 
The disposal efficiency varied significantly across zones:
- In the North Zone, 40% of assigned cases were successfully disposed of.
- In the South Zone, 60% of assigned cases were disposed of.
- In the East Zone, 30% of assigned cases were disposed of.
- In the West Zone, 50% of assigned cases were disposed of.

Every disposed case requires either a judgment of conviction or acquittal. Across all zones, 25% of all disposed cases resulted in convictions, while the remaining 75% resulted in acquittals. Undisposed cases at the end of the year are carried forward into the subsequent calendar backlog.`,
    questions: [
      {
        id: 'QT-101',
        questionNumber: 1,
        text: 'What is the absolute total number of cases successfully disposed of across all four zones combined?',
        options: ['5,400 cases', '5,200 cases', '5,120 cases', '5,600 cases'],
        correctOptionIndex: 0,
        explanation:
          'Step-by-step arithmetic:\n1. North: 40% of 4,200 = 1,680.\n2. South: 60% of 3,000 = 1,800.\n3. East: 30% of 2,400 = 720.\n4. West: 50% of 2,400 = 1,200.\nTotal disposed = 1,680 + 1,800 + 720 + 1,200 = 5,400 cases.',
        isVerified: true,
      },
      {
        id: 'QT-102',
        questionNumber: 2,
        text: 'What is the ratio of undisposed (pending) cases in the West Zone to undisposed cases in the East Zone at year end?',
        options: ['5 : 7', '3 : 4', '5 : 6', '2 : 3'],
        correctOptionIndex: 0,
        explanation:
          'Step-by-step ratio:\n- West assigned = 2,400. Disposed (50%) = 1,200. Undisposed = 1,200.\n- East assigned = 2,400. Disposed (30%) = 720. Undisposed = 2,400 - 720 = 1,680.\nRatio = 1,200 / 1,680 = 120 / 168 = 5 / 7 (5 : 7).',
        isVerified: true,
      },
      {
        id: 'QT-103',
        questionNumber: 3,
        text: 'How many total cases resulted in formal convictions across all zones during the audit period?',
        options: ['1,350 cases', '1,280 cases', '1,420 cases', '1,500 cases'],
        correctOptionIndex: 0,
        explanation:
          'Total disposed across all zones = 5,400.\nConviction rate = 25% of disposed cases.\nConvictions = 25% of 5,400 = 5,400 / 4 = 1,350 cases.',
        isVerified: true,
      },
      {
        id: 'QT-104',
        questionNumber: 4,
        text: 'The total number of cases disposed of in the South Zone is what percentage greater than the total disposed of in the North Zone?',
        options: ['7.14%', '12.5%', '15.0%', '8.33%'],
        correctOptionIndex: 0,
        explanation:
          'South disposed = 1,800. North disposed = 1,680.\nDifference = 1,800 - 1,680 = 120.\nPercentage greater = (120 / 1,680) * 100 = 12 / 168 * 100 = 1 / 14 * 100 = 7.14%.',
        isVerified: true,
      },
      {
        id: 'QT-105',
        questionNumber: 5,
        text: 'If the East Zone aims to achieve an overall 60% cumulative disposal rate next year on its current 1,680 backlog plus 1,000 newly filed cases (total 2,680), how many cases must it dispose of?',
        options: ['1,608 cases', '1,540 cases', '1,720 cases', '1,480 cases'],
        correctOptionIndex: 0,
        explanation:
          'Total cases to be handled = 1,680 + 1,000 = 2,680.\nTarget disposal rate = 60%.\nRequired disposals = 60% of 2,680 = 0.60 * 2,680 = 1,608 cases.',
        isVerified: true,
      },
    ],
  },

  // ------------------------------------------------------
  // ANALYTICAL REASONING PASSAGE 1: 7-Judge Constitution Bench
  // ------------------------------------------------------
  {
    id: 'pass-analytical-1',
    subjectType: 'analytical',
    subject: 'Analytical Reasoning',
    title: 'Linear Logic Puzzle: 7-Judge Constitution Bench Seating Arrangement',
    source: 'Supreme Court Protocol: Courtroom 1 Protocol Rules for Constitutional Benches',
    wordCount: 290,
    readTimeMinutes: 2,
    tableData: {
      headers: ['Seat 1 (Far Left)', 'Seat 2', 'Seat 3', 'Seat 4 (Center)', 'Seat 5', 'Seat 6', 'Seat 7 (Far Right)'],
      rows: [
        ['Justice G', 'Justice B', 'Justice D', 'CJI A (Center)', 'Justice C', 'Justice E', 'Justice F'],
      ],
    },
    text: `A 7-Judge Constitution Bench of the Supreme Court of India—comprising Chief Justice A and Justices B, C, D, E, F, and G—is seated in a single straight row on the elevated judicial dais facing the bar (South).

Protocol and physical observation establish the following strict spatial conditions:
1. The Chief Justice (A) is seated exactly in the middle of the dais (Seat 4).
2. Justice B is seated to the immediate left of Justice D (from the judges' own viewpoint facing the courtroom).
3. Justice C is seated between Chief Justice A and Justice E.
4. Justice F sits at the extreme right end of the dais (Seat 7).
5. Justice G is not seated adjacent to Justice D.
6. Justice E is seated immediately to the right of Justice C and immediately to the left of Justice F.
7. Justice B is seated between Justice G and Justice D.

From Judges' perspective facing the bar:
Positions from 1 (Extreme Left) to 7 (Extreme Right):
Seat 1 = G, Seat 2 = B, Seat 3 = D, Seat 4 = A (CJI), Seat 5 = C, Seat 6 = E, Seat 7 = F.`,
    questions: [
      {
        id: 'AR-101',
        questionNumber: 1,
        text: 'Who sits at the extreme left end of the judicial dais (Seat 1)?',
        options: ['Justice G', 'Justice B', 'Justice D', 'Justice E'],
        correctOptionIndex: 0,
        explanation:
          'Deductive steps:\n- CJI A is at Seat 4.\n- C is between A (4) and E (6), placing C at Seat 5 and E at Seat 6.\n- F is at extreme right (Seat 7).\n- Remaining seats on left are 1, 2, 3.\n- B sits between G and D, and B is immediate left of D, meaning G is at Seat 1, B is at Seat 2, D is at Seat 3.\nTherefore, Justice G occupies Seat 1.',
        isVerified: true,
      },
      {
        id: 'AR-102',
        questionNumber: 2,
        text: 'How many judges are seated between Justice B and Justice E?',
        options: ['3 judges', '2 judges', '4 judges', '1 judge'],
        correctOptionIndex: 0,
        explanation:
          'Justice B is at Seat 2. Justice E is at Seat 6.\nThe judges seated strictly between them are at Seats 3 (Justice D), 4 (Chief Justice A), and 5 (Justice C).\nTotal = 3 judges.',
        isVerified: true,
      },
      {
        id: 'AR-103',
        questionNumber: 3,
        text: 'From the viewpoint of the lawyers standing at the bar facing the judges (North), who is seated third from the lawyers\' right hand?',
        options: ['Justice D', 'Justice C', 'Justice B', 'Chief Justice A'],
        correctOptionIndex: 0,
        explanation:
          'Lawyers facing North view the dais in reverse lateral orientation:\n- Lawyers\' right = Judges\' left (Seat 1 = G).\n- 1st from lawyers\' right = Seat 1 (G)\n- 2nd from lawyers\' right = Seat 2 (B)\n- 3rd from lawyers\' right = Seat 3 (D).\nTherefore, Justice D is third from the lawyers\' right.',
        isVerified: true,
      },
      {
        id: 'AR-104',
        questionNumber: 4,
        text: 'If Justice D and Justice E swap seats, which pair of judges will now be seated adjacent to Chief Justice A?',
        options: ['Justice E and Justice C', 'Justice D and Justice C', 'Justice B and Justice E', 'Justice B and Justice C'],
        correctOptionIndex: 0,
        explanation:
          'Originally, CJI A at Seat 4 is flanked by D (Seat 3) and C (Seat 5).\nIf D (Seat 3) swaps with E (Seat 6), Seat 3 becomes Justice E.\nThus, Seat 4 (CJI A) is now flanked by Justice E (Seat 3) and Justice C (Seat 5).',
        isVerified: true,
      },
      {
        id: 'AR-105',
        questionNumber: 5,
        text: 'Which of the following statements is demonstrably FALSE based on the deduced arrangement?',
        options: [
          'Justice G sits adjacent to Chief Justice A',
          'Justice F sits adjacent to Justice E',
          'Justice D sits adjacent to Chief Justice A',
          'Justice B sits adjacent to Justice G',
        ],
        correctOptionIndex: 0,
        explanation:
          'Justice G sits at Seat 1, while CJI A is at Seat 4. They are separated by Justices B and D, so Justice G is NOT adjacent to CJI A. This statement is false.',
        isVerified: true,
      },
    ],
  },
];

// ========================================================
// SYLLABUS TOPICS FOR GK TOPICS TAB (Match gktrck.vercel.app)
// ========================================================
export const initialSyllabusTopics: SyllabusTopic[] = [
  // September 2026
  {
    id: 'gk-sep-1',
    subject: 'gk',
    month: 'September 2026',
    title: 'Supreme Court 7-Judge Ruling on SC/ST Sub-Classification (State of Punjab v. Davinder Singh)',
    category: 'Landmark Judgments',
    status: 'mastered',
    isCompleted: true,
  },
  {
    id: 'gk-sep-2',
    subject: 'gk',
    month: 'September 2026',
    title: 'Implementation Framework of New Criminal Laws (BNS, BNSS, BSA)',
    category: 'Constitutional & Legal',
    status: 'pending',
    isCompleted: false,
  },
  {
    id: 'gk-sep-3',
    subject: 'gk',
    month: 'September 2026',
    title: 'Ramsar Convention: India’s Wetland Count Hits 85 with Nanjarayan & Kazhuveli',
    category: 'Environment & Tech',
    status: 'pending',
    isCompleted: false,
  },
  {
    id: 'gk-sep-4',
    subject: 'gk',
    month: 'September 2026',
    title: 'Interim Union Budget Fiscal Deficit Target Analysis (5.1% of GDP)',
    category: 'Economy & Policies',
    status: 'pending',
    isCompleted: false,
  },
  {
    id: 'gk-sep-5',
    subject: 'gk',
    month: 'September 2026',
    title: 'Chief Election Commissioner Selection Committee Act: Constitutional Challenges',
    category: 'Constitutional Law',
    status: 'pending',
    isCompleted: false,
  },

  // August 2026
  {
    id: 'gk-aug-1',
    subject: 'gk',
    month: 'August 2026',
    title: 'Supreme Court 9-Judge Bench Verdict on States\' Taxing Power on Minerals & Mines',
    category: 'Federalism & Taxation',
    status: 'pending',
    isCompleted: false,
  },
  {
    id: 'gk-aug-2',
    subject: 'gk',
    month: 'August 2026',
    title: 'Paris Olympic Games 2024: India’s Medals Tally, CAS Arbitrations & Key Rule Changes',
    category: 'Sports & Awards',
    status: 'pending',
    isCompleted: false,
  },
  {
    id: 'gk-aug-3',
    subject: 'gk',
    month: 'August 2026',
    title: 'Digital Personal Data Protection (DPDP) Act Rules & Appellate Tribunal Guidelines',
    category: 'Statutory Law',
    status: 'pending',
    isCompleted: false,
  },

  // July 2026
  {
    id: 'gk-jul-1',
    subject: 'gk',
    month: 'July 2026',
    title: 'SCO (Shanghai Cooperation Organisation) Summit: Astana Declaration Analysis',
    category: 'International Relations',
    status: 'pending',
    isCompleted: false,
  },
  {
    id: 'gk-jul-2',
    subject: 'gk',
    month: 'July 2026',
    title: 'Gaganyaan Abort Test Flights & Deep Ocean Mission (MATSYA 6000 Submersible)',
    category: 'Science & Defense',
    status: 'pending',
    isCompleted: false,
  },
  {
    id: 'gk-jul-3',
    subject: 'gk',
    month: 'July 2026',
    title: 'Nobel Prizes 2024–2025 Highlights & Legal Significance of Nihon Hidankyo Peace Prize',
    category: 'Honors & Summits',
    status: 'pending',
    isCompleted: false,
  },
];

export const initialUnsolvedQuestions: BankQuestion[] = [
  {
    id: 'SOLVE-201',
    subject: 'gk',
    category: 'International Infrastructure',
    subtopic: 'Port Accords',
    text: 'Which strategic deep-water container terminal in Colombo, Sri Lanka was developed with financial and technical backing from the Adani Ports consortium and US DFC?',
    options: [
      'West Container Terminal (WCT)',
      'East Container Terminal (ECT)',
      'Hambantota Southern Pier',
      'Kankesanthurai Port Terminal',
    ],
    correct_answer: null,
    correctOptionIndex: null,
    explanation: 'West Container Terminal (WCT) at Colombo Port.',
    difficulty: 'Moderate',
    source: 'Ministry of External Affairs & Indo-Pacific Maritime Gazette',
    isVerified: false,
    extraNotes: 'Fact check: US DFC committed $553 million; joint venture between Adani Ports and John Keells Holdings.',
  },
  {
    id: 'SOLVE-202',
    subject: 'gk',
    category: 'Statutory Enactments',
    subtopic: 'Telecommunications',
    text: 'Under the Telecommunications Act, 2023, which statutory fund replaced the erstwhile Universal Service Obligation Fund (USOF) to support rural broadband and advanced digital tech?',
    options: [
      'Digital Bharat Nidhi',
      'BharatNet Infrastructure Corpus',
      'Universal Connectivity Fund',
      'National Telecom Guarantee Trust',
    ],
    correct_answer: null,
    correctOptionIndex: null,
    explanation: 'Digital Bharat Nidhi replaced USOF under Section 24 of the 2023 Act.',
    difficulty: 'Moderate',
    source: 'Ministry of Communications Gazette',
    isVerified: false,
    extraNotes: 'Replaced Indian Telegraph Act 1885 and Wireless Telegraphy Act 1933.',
  },
  {
    id: 'SOLVE-203',
    subject: 'gk',
    category: 'Awards & Honors',
    subtopic: 'Mathematics',
    text: 'Who was awarded the prestigious 2024 Abel Prize by the Norwegian Academy of Science and Letters for ground-breaking work in probability theory and stochastic processes?',
    options: [
      'Michel Talagrand',
      'Dennis Sullivan',
      'Hillel Furstenberg',
      'Luis Caffarelli',
    ],
    correct_answer: null,
    correctOptionIndex: null,
    explanation: 'Michel Talagrand (French mathematician, CNRS).',
    difficulty: 'Hard',
    source: 'Norwegian Academy of Science and Letters',
    isVerified: false,
    extraNotes: 'Recognized for work on concentration of measure and supremum of stochastic processes.',
  },
  {
    id: 'SOLVE-204',
    subject: 'gk',
    category: 'Geopolitics & Summits',
    subtopic: 'BRICS Expansion',
    text: 'Which North African country formally became an operational full member of BRICS alongside Iran, UAE, and Ethiopia at the start of 2024?',
    options: ['Egypt', 'Algeria', 'Morocco', 'Tunisia'],
    correct_answer: null,
    correctOptionIndex: null,
    explanation: 'Egypt joined along with Iran, Ethiopia, and UAE. Saudi Arabia is reviewing membership.',
    difficulty: 'Easy',
    source: 'BRICS 2024 Secretariat & MEA Diplomatic Dispatches',
    isVerified: false,
    extraNotes: '16th BRICS Summit held in Kazan under Russian chairmanship.',
  },
  {
    id: 'SOLVE-205',
    subject: 'gk',
    category: 'Health & Treaties',
    subtopic: 'WHO Certifications',
    text: 'In January 2024, which island nation was officially certified as Malaria-free by the World Health Organization (WHO), joining Mauritius and Algeria in the African region?',
    options: ['Cabo Verde', 'Seychelles', 'Madagascar', 'Comoros'],
    correct_answer: null,
    correctOptionIndex: null,
    explanation: 'Cabo Verde (Cape Verde) became the 3rd African country certified malaria-free.',
    difficulty: 'Moderate',
    source: 'World Health Organization Official Bulletin',
    isVerified: false,
    extraNotes: 'Requires showing interruption of indigenous transmission for at least 3 consecutive years.',
  },
];

