import { Question } from '../types/question';

export const QUESTIONS_BATCH_11: Question[] = [
  // 6. ENVIRONMENT, SCIENCE & TECH (Q501 - Q574)
  // Space Missions & Astronomy (Q501 - Q530)
  {
    id: 'q501',
    qNumber: 501,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'NISAR is an Earth-observing satellite joint project between which of the following space agencies?',
    options: {
      a: 'ISRO and JAXA',
      b: 'ISRO and ESA',
      c: 'NASA and ISRO',
      d: 'NASA and Roscosmos'
    },
    answer: 'c',
    explanation: 'NISAR stands for NASA-ISRO Synthetic Aperture Radar, a premier joint satellite observatory mapping Earth\'s dynamic land and ice surfaces.'
  },
  {
    id: 'q502',
    qNumber: 502,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'NISAR is the first satellite radar to use which of the following dual frequencies?',
    options: {
      a: 'X-band and Ku-band',
      b: 'L-band and S-band',
      c: 'C-band and X-band',
      d: 'Ka-band and Ku-band'
    },
    answer: 'b',
    explanation: 'NISAR integrates NASA\'s L-band (24 cm wavelength) and ISRO\'s S-band (9 cm wavelength) dual-polarimetric radars.'
  },
  {
    id: 'q503',
    qNumber: 503,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'What is the primary scientific mission of the NISAR satellite?',
    options: {
      a: 'To observe deep space exoplanets and cosmic background radiation',
      b: 'To measure Earth\'s changing ecosystems, dynamic surfaces, and ice masses',
      c: 'To monitor lunar and Martian geological changes',
      d: 'To provide high-speed military satellite communications'
    },
    answer: 'b',
    explanation: 'It measures minute crustal deformations, glacier flow speeds, deforestation, wetland extents, and natural hazards.'
  },
  {
    id: 'q504',
    qNumber: 504,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'Which launch vehicle has been designated to place the NISAR satellite into orbit?',
    options: {
      a: 'PSLV-C58',
      b: 'Falcon 9',
      c: 'GSLV Mk II',
      d: 'LVM3'
    },
    answer: 'c',
    explanation: 'ISRO\'s Geosynchronous Satellite Launch Vehicle (GSLV) with an indigenous cryogenic upper stage is designated for NISAR.'
  },
  {
    id: 'q505',
    qNumber: 505,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'India\'s human spaceflight mission is known by which of the following project names?',
    options: {
      a: 'Aditya-L1',
      b: 'Gaganyaan',
      c: 'Chandrayaan',
      d: 'Mangalyaan'
    },
    answer: 'b',
    explanation: 'Project Gaganyaan envisages demonstrating Indian human spaceflight capability by sending a crew to a 400 km Low Earth Orbit (LEO).'
  },
  {
    id: 'q506',
    qNumber: 506,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'Who was the first Indian citizen to travel into outer space?',
    options: {
      a: 'Kalpana Chawla',
      b: 'Sunita Williams',
      c: 'Rakesh Sharma',
      d: 'Prashanth Nair'
    },
    answer: 'c',
    explanation: 'Wing Commander Rakesh Sharma flew aboard the Soviet Soyuz T-11 mission on 3 April 1984, spending nearly 8 days in space.'
  },
  {
    id: 'q507',
    qNumber: 507,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'The half-humanoid robot developed by ISRO for uncrewed Gaganyaan test flights is named:',
    options: {
      a: 'Mitra',
      b: 'Vyommitra',
      c: 'Pragyan',
      d: 'Vikram'
    },
    answer: 'b',
    explanation: 'Vyommitra ("space friend" in Sanskrit) is the female-mimicking spacefaring humanoid robot designed to monitor life support and environmental pods.'
  },
  {
    id: 'q508',
    qNumber: 508,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'The Indian astronaut who flew to the International Space Station (ISS) aboard the Axiom-4 (Ax-4) mission is:',
    options: {
      a: 'Group Captain Shubhanshu Shukla',
      b: 'Group Captain Prashanth Nair',
      c: 'Group Captain Angad Pratap',
      d: 'Wing Commander Ajit Krishnan'
    },
    answer: 'a',
    explanation: 'Group Captain Shubhanshu Shukla served as the mission pilot for the Ax-4 flight to the ISS.'
  },
  {
    id: 'q509',
    qNumber: 509,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'The planned Indian space station, scheduled for deployment by 2035, is officially named:',
    options: {
      a: 'Aryabhata Antariksh Kendra',
      b: 'Bharatiya Antariksh Station (BAS)',
      c: 'Surya Loka Orbital Station',
      d: 'Vigyan Antariksh Peeth'
    },
    answer: 'b',
    explanation: 'The Bharatiya Antariksh Station (BAS) is India\'s planned modular crewed orbital research facility.'
  },
  {
    id: 'q510',
    qNumber: 510,
    category: 'science',
    categoryName: 'Science, Space & Tech',
    subtopic: 'Space Exploration & ISRO',
    question: 'ISRO\'s heavy-lift launch vehicle used for Gaganyaan and Chandrayaan missions is:',
    options: {
      a: 'LVM3 (Launch Vehicle Mark-3)',
      b: 'PSLV-XL',
      c: 'SSLV-D2',
      d: 'GSLV-F10'
    },
    answer: 'a',
    explanation: 'LVM3 (formerly GSLV Mk III), capable of carrying 4,000 kg to GTO and 8,000 kg to LEO, is human-rated as HLVM3.'
  },
  // Environment & Climate Change (Q511 - Q530)
  {
    id: 'q511',
    qNumber: 511,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Climate Summits & Treaties',
    question: 'The COP30 United Nations Climate Change Conference was hosted in which city?',
    options: {
      a: 'Baku, Azerbaijan',
      b: 'Dubai, UAE',
      c: 'Belém, Brazil',
      d: 'Sharm el-Sheikh, Egypt'
    },
    answer: 'c',
    explanation: 'COP30 convened in Belém, the gateway to the Brazilian Amazon rainforest, in November 2025.'
  },
  {
    id: 'q512',
    qNumber: 512,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Climate Summits & Treaties',
    question: 'The primary goal of the Paris Agreement (2015) is to limit global temperature rise to well below:',
    options: {
      a: '1.0°C above pre-industrial levels',
      b: '2.0°C, and pursue efforts to limit it to 1.5°C above pre-industrial levels',
      c: '2.5°C above pre-industrial levels',
      d: '3.0°C above pre-industrial levels'
    },
    answer: 'b',
    explanation: 'Article 2 of the Paris Agreement sets the global target to well below 2°C, striving for 1.5°C.'
  },
  {
    id: 'q513',
    qNumber: 513,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Renewable Energy & Climate Target',
    question: 'India has pledged to achieve net-zero carbon emissions by the year:',
    options: {
      a: '2047',
      b: '2050',
      c: '2060',
      d: '2070'
    },
    answer: 'd',
    explanation: 'Prime Minister Narendra Modi announced India\'s Panchamrit climate commitments at COP26 Glasgow, targeting Net-Zero by 2070.'
  },
  {
    id: 'q514',
    qNumber: 514,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Renewable Energy & Climate Target',
    question: 'India\'s target for non-fossil fuel installed electricity capacity by 2030 is:',
    options: {
      a: '300 GW',
      b: '400 GW',
      c: '500 GW',
      d: '750 GW'
    },
    answer: 'c',
    explanation: 'India committed to achieving 500 GW of non-fossil energy capacity by 2030.'
  },
  {
    id: 'q515',
    qNumber: 515,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Biodiversity & Conservation',
    question: 'Project Tiger, India\'s flagship conservation programme, was launched in which year?',
    options: {
      a: '1971',
      b: '1972',
      c: '1973',
      d: '1980'
    },
    answer: 'c',
    explanation: 'Project Tiger was launched on 1 April 1973 from Jim Corbett National Park in Uttarakhand.'
  },
  {
    id: 'q516',
    qNumber: 516,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Biodiversity & Conservation',
    question: 'According to official census estimates, India hosts what fraction of the world\'s wild tiger population?',
    options: {
      a: 'Over 50%',
      b: 'Over 75%',
      c: 'About 35%',
      d: 'About 90%'
    },
    answer: 'b',
    explanation: 'India is home to more than 75% (over 3,680 tigers) of the global wild tiger population.'
  },
  {
    id: 'q517',
    qNumber: 517,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Biodiversity & Conservation',
    question: 'Cheetahs were reintroduced to India in 2022 under Project Cheetah at which National Park?',
    options: {
      a: 'Kanha National Park',
      b: 'Kuno National Park',
      c: 'Ranthambore National Park',
      d: 'Bandhavgarh National Park'
    },
    answer: 'b',
    explanation: 'Eight African cheetahs from Namibia were translocated to Kuno National Park in Madhya Pradesh in September 2022.'
  },
  {
    id: 'q518',
    qNumber: 518,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Biodiversity & Conservation',
    question: 'The Asiatic Lion (Panthera leo persica) in the wild is exclusively found in:',
    options: {
      a: 'Sundarbans, West Bengal',
      b: 'Gir National Park and Wildlife Sanctuary, Gujarat',
      c: 'Kaziranga National Park, Assam',
      d: 'Periyar National Park, Kerala'
    },
    answer: 'b',
    explanation: 'The Gir protected forest in Saurashtra, Gujarat is the last remaining global wild habitat of Asiatic lions.'
  },
  {
    id: 'q519',
    qNumber: 519,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Biodiversity & Conservation',
    question: 'How many Ramsar wetland sites of international importance does India possess as of 2026?',
    options: {
      a: '49',
      b: '75',
      c: '85',
      d: '100'
    },
    answer: 'c',
    explanation: 'India expanded its network of Ramsar wetland sites to 85, holding the highest tally in South Asia.'
  },
  {
    id: 'q520',
    qNumber: 520,
    category: 'environment',
    categoryName: 'Environment & Ecology',
    subtopic: 'Renewable Energy & Climate Target',
    question: 'The International Solar Alliance (ISA) was jointly launched in 2015 by India and which country?',
    options: {
      a: 'Germany',
      b: 'Japan',
      c: 'France',
      d: 'United States'
    },
    answer: 'c',
    explanation: 'Launched at COP21 Paris by Prime Minister Narendra Modi and French President François Hollande, with headquarters in Gurugram, Haryana.'
  }
];
