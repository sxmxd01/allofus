import { Question } from '../types/question';

export const QUESTIONS_BATCH_3: Question[] = [
  // ICC (Q173 - Q178)
  {
    id: 'q173',
    qNumber: 173,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Criminal Court (ICC)',
    question: 'The International Criminal Court (ICC) was established under the [1] Statute. Which of the following has been replaced by [1] in the passage above?',
    context: 'The Venezuelan government has formally announced its decision to withdraw from the International Criminal Court (ICC) by notifying the United Nations Secretary-General, in accordance with Article 127 of the [1] treaty that established the ICC.',
    options: {
      a: 'Geneva Statute',
      b: 'Rome Statute',
      c: 'Paris Statute',
      d: 'Vienna Statute'
    },
    answer: 'b',
    explanation: 'The ICC was created pursuant to the 1998 Rome Statute, entering into force in July 2002.'
  },
  {
    id: 'q174',
    qNumber: 174,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Criminal Court (ICC)',
    question: 'Who among the following ICC Prosecutors opened the Venezuela I investigation in 2021 whose name is redacted with [2] in the passage above?',
    context: 'The investigation was formally opened in 2021 by the then ICC Prosecutor [2].',
    options: {
      a: 'Nazhat Shameem Khan',
      b: 'Mame Mandiaye Niang',
      c: 'Karim Khan',
      d: 'Fatou Bensouda'
    },
    answer: 'c',
    explanation: 'ICC Prosecutor Karim A. A. Khan KC opened the Venezuela I investigation in November 2021.'
  },
  {
    id: 'q175',
    qNumber: 175,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Criminal Court (ICC)',
    question: 'Which of the following crimes fall under the jurisdiction of the International Criminal Court? 1. Genocide, 2. Crimes against humanity, 3. War crimes, 4. Crime of aggression, 5. Terrorism',
    options: {
      a: '1, 2 and 3 only',
      b: '1, 2, 3 and 4 only',
      c: '2, 3, 4 and 5 only',
      d: '1, 2, 3, 4 and 5'
    },
    answer: 'b',
    explanation: 'The Rome Statute grants jurisdiction over four core crimes: Genocide, Crimes Against Humanity, War Crimes, and Crime of Aggression (Terrorism is not a distinct Rome Statute crime).'
  },
  {
    id: 'q176',
    qNumber: 176,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Criminal Court (ICC)',
    question: 'The first sitting Head of State against whom the ICC issued an arrest warrant was:',
    options: {
      a: 'Slobodan Milosevic',
      b: 'Muammar Gaddafi',
      c: 'Omar al-Bashir',
      d: 'Vladimir Putin'
    },
    answer: 'c',
    explanation: 'Omar al-Bashir of Sudan was the first sitting head of state indicted by the ICC (in 2009 for crimes in Darfur).'
  },
  {
    id: 'q177',
    qNumber: 177,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Criminal Court (ICC)',
    question: 'Which one of the following correctly distinguishes the International Criminal Court (ICC) from the International Court of Justice (ICJ)?',
    options: {
      a: 'ICC prosecutes individuals, while ICJ adjudicates disputes between states.',
      b: 'ICC hears disputes between states, while ICJ prosecutes individuals.',
      c: 'Both prosecute individuals for international crimes.',
      d: 'Both are principal organs of the United Nations.'
    },
    answer: 'a',
    explanation: 'The ICC investigates and tries individuals accused of heinous crimes; the ICJ (a principal UN organ) resolves legal disputes submitted by sovereign states.'
  },
  {
    id: 'q178',
    qNumber: 178,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Criminal Court (ICC)',
    question: 'Which of the following countries are not parties to the Rome Statute? 1. India, 2. China, 3. Russia, 4. United States',
    options: {
      a: '1 and 2 only',
      b: '2 and 3 only',
      c: '1, 2 and 4 only',
      d: '1, 2, 3 and 4'
    },
    answer: 'd',
    explanation: 'None of the major powers - India, China, the US, or Russia - are parties to the Rome Statute.'
  },
  // Indus Waters Treaty (Q179 - Q184)
  {
    id: 'q179',
    qNumber: 179,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Indus Waters Treaty',
    question: 'What was India\'s main objection to the Court of Arbitration proceedings?',
    options: {
      a: 'India argued that the tribunal was illegally constituted',
      b: 'India argued that Pakistan had withdrawn from the treaty',
      c: 'India argued that the projects were not located in Jammu and Kashmir',
      d: 'India argued that the PCA was a United Nations military body'
    },
    answer: 'a',
    explanation: 'India objected to parallel proceedings, maintaining that the appointment of a Court of Arbitration was contrary to the graduated dispute resolution mechanism of the 1960 Treaty.'
  },
  {
    id: 'q180',
    qNumber: 180,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Indus Waters Treaty',
    question: 'The Court of Arbitration ruling dealt mainly with which technical issue?',
    options: {
      a: 'River pollution standards',
      b: 'Water storage and spillway limits',
      c: 'Navigation rights in the Arabian Sea',
      d: 'Fishing rights in the Indus delta'
    },
    answer: 'b',
    explanation: 'The dispute centers on pondage, drawdown flushing, and freeboard spillway gates on run-of-the-river hydroelectric plants.'
  },
  {
    id: 'q181',
    qNumber: 181,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Indus Waters Treaty',
    question: 'Which two Indian hydroelectric projects were specifically mentioned in relation to the dispute?',
    options: {
      a: 'Tehri and Bhakra',
      b: 'Hirakud and Sardar Sarovar',
      c: 'Kishenganga and Ratle',
      d: 'Koyna and Subansiri'
    },
    answer: 'c',
    explanation: 'The 330 MW Kishenganga (Jhelum basin) and 850 MW Ratle (Chenab river) projects in Jammu & Kashmir.'
  },
  {
    id: 'q182',
    qNumber: 182,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Indus Waters Treaty',
    question: 'Why did India place the Indus Waters Treaty in abeyance?',
    options: {
      a: 'Following the Pahalgam terror attack',
      b: 'Following a trade dispute with the World Bank',
      c: 'Following a ruling by the United Nations General Assembly',
      d: 'Following Pakistan\'s withdrawal from the treaty'
    },
    answer: 'a',
    explanation: 'Cross-border terror attacks prompted diplomatic review and suspension of routine bilateral Indus Commission meetings.'
  },
  {
    id: 'q183',
    qNumber: 183,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Indus Waters Treaty',
    question: 'Where is the Permanent Court of Arbitration headquartered?',
    options: {
      a: 'Geneva, Switzerland',
      b: 'New York, United States',
      c: 'The Hague, The Netherlands',
      d: 'Vienna, Austria'
    },
    answer: 'c',
    explanation: 'The Permanent Court of Arbitration (PCA) is established at the Peace Palace in The Hague, Netherlands.'
  },
  {
    id: 'q184',
    qNumber: 184,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Indus Waters Treaty',
    question: 'Under the Indus Waters Treaty, which rivers are allocated to India?',
    options: {
      a: 'Indus, Chenab and Jhelum',
      b: 'Ganga, Yamuna and Ghaghara',
      c: 'Brahmaputra, Teesta and Subansiri',
      d: 'Beas, Ravi and Sutlej'
    },
    answer: 'd',
    explanation: 'The 1960 Treaty allocated the three Eastern Rivers (Ravi, Beas, Sutlej) for unrestricted use by India.'
  },
  // G7 & World History (Q185 - Q196)
  {
    id: 'q185',
    qNumber: 185,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'G7',
    question: 'The G7 originated initially as which grouping?',
    options: {
      a: 'Group of Five',
      b: 'Group of Six',
      c: 'Group of Four',
      d: 'Group of Eight'
    },
    answer: 'b',
    explanation: 'It was founded in 1975 at Rambouillet, France as the G6 (France, West Germany, Italy, Japan, UK, US). Canada joined in 1976 making it G7.'
  },
  {
    id: 'q186',
    qNumber: 186,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'G7',
    question: 'The G7 is best described as:',
    options: {
      a: 'A formal international organization with a permanent secretariat',
      b: 'A military alliance under NATO framework',
      c: 'An informal forum for economic and financial cooperation',
      d: 'A United Nations specialized agency'
    },
    answer: 'c',
    explanation: 'The G7 has no permanent administrative secretariat or charter; it operates as an informal intergovernmental consultation forum.'
  },
  {
    id: 'q187',
    qNumber: 187,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'G7',
    question: 'The 2026 G7 Summit was held in France. The first G7 Summit was held in:',
    options: {
      a: 'USA',
      b: 'Japan',
      c: 'Germany',
      d: 'France'
    },
    answer: 'd',
    explanation: 'The first summit took place in Chateau de Rambouillet, France in November 1975, convened by French President Valéry Giscard d\'Estaing.'
  },
  {
    id: 'q188',
    qNumber: 188,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'G7',
    question: 'The G7 originated primarily as a response to:',
    options: {
      a: '1973 energy crisis',
      b: 'Cold War military tensions',
      c: '2008 financial crisis',
      d: 'COVID-19 pandemic'
    },
    answer: 'a',
    explanation: 'The group arose to address macroeconomic stagflation following the 1973 OPEC oil embargo and collapse of the Bretton Woods currency system.'
  },
  {
    id: 'q189',
    qNumber: 189,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'G7',
    question: 'Russia\'s participation in the G7 (as G8) was suspended in:',
    options: {
      a: '2008',
      b: '2010',
      c: '2014',
      d: '2016'
    },
    answer: 'c',
    explanation: 'Russia was suspended from the G8 in March 2014 following its annexation of the Crimean Peninsula.'
  },
  {
    id: 'q190',
    qNumber: 190,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'G7',
    question: 'Which of the following countries were included as partner countries in the G7 Sherpa track invited by France?',
    options: {
      a: 'Brazil, India, Kenya, South Korea',
      b: 'China, India, South Africa, Indonesia',
      c: 'Japan, Brazil, Mexico, Australia',
      d: 'India, Russia, Turkey, Saudi Arabia'
    },
    answer: 'a',
    explanation: 'France invited key Global South democracies and partners including Brazil, India, Kenya, and South Korea.'
  },
  {
    id: 'q191',
    qNumber: 191,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'World History & Geopolitics',
    question: 'Ali Hosseini Khamenei was associated with which major historical event in Iran?',
    options: {
      a: 'The Iranian Revolution',
      b: 'The Constitutional Revolution',
      c: 'The Green Movement',
      d: 'The Arab Spring'
    },
    answer: 'a',
    explanation: 'Ayatollah Ali Khamenei was a key figure in the 1979 Islamic Revolution that overthrew the Pahlavi monarchy.'
  },
  {
    id: 'q192',
    qNumber: 192,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'World History & Geopolitics',
    question: 'Ali Hosseini Khamenei served as the President of Iran during which period?',
    options: {
      a: '1979-1981',
      b: '1989-1997',
      c: '1997-2005',
      d: '1981-1989'
    },
    answer: 'd',
    explanation: 'He served as Iran\'s third President from 1981 to 1989 throughout the Iran-Iraq War.'
  },
  {
    id: 'q193',
    qNumber: 193,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'World History & Geopolitics',
    question: 'Who among the following served as the first Supreme Leader of Islamic Republic of Iran?',
    options: {
      a: 'Mohammad Mossadegh',
      b: 'Ayatollah Ruhollah Khomeini',
      c: 'Ali Hosseini Khamenei',
      d: 'Hassan Rouhani'
    },
    answer: 'b',
    explanation: 'Grand Ayatollah Ruhollah Khomeini served as the revolutionary founder and first Supreme Leader from 1979 until his death in 1989.'
  },
  {
    id: 'q194',
    qNumber: 194,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'World History & Geopolitics',
    question: 'The official currency of Iran is:',
    options: {
      a: 'Rand',
      b: 'Ruble',
      c: 'Rial',
      d: 'Renminbi'
    },
    answer: 'c',
    explanation: 'The official monetary unit of the Islamic Republic of Iran is the Iranian Rial (IRR).'
  },
  {
    id: 'q195',
    qNumber: 195,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'World History & Geopolitics',
    question: 'What was the name given by Israel to its pre-emptive strike on Tehran in February 2026?',
    options: {
      a: 'Operation Lion\'s Roar',
      b: 'Operation Epic Fury',
      c: 'Operation True Promise 4',
      d: 'Operation Desert Shield'
    },
    answer: 'a',
    explanation: 'The IDF named the targeted strike package Operation Lion\'s Roar.'
  },
  {
    id: 'q196',
    qNumber: 196,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'World History & Geopolitics',
    question: 'Iran does not share it\'s land border with which of the following countries?',
    options: {
      a: 'Turkey',
      b: 'Iraq',
      c: 'Afghanistan',
      d: 'Israel'
    },
    answer: 'd',
    explanation: 'Iran is separated from Israel by Iraq, Jordan, and Syria, sharing no common land boundary.'
  },

  // 2. INDIAN HISTORY (Q197 - Q242)
  {
    id: 'q197',
    qNumber: 197,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'Dadabhai Naoroji was the first Indian to be elected to which of the following?',
    options: {
      a: 'Indian National Congress',
      b: 'British Parliament',
      c: 'Viceroy\'s Executive Council',
      d: 'House of Lords'
    },
    answer: 'b',
    explanation: 'Dadabhai Naoroji was elected as the Liberal MP for Finsbury Central in the UK House of Commons in 1892, becoming the first Asian/Indian British MP.'
  },
  {
    id: 'q198',
    qNumber: 198,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'Which of the following theories was formulated by Dadabhai Naoroji to explain the economic exploitation against British rule in India?',
    options: {
      a: 'Theory of Drain of Wealth',
      b: 'Theory of Economic Imperialism',
      c: 'Theory of Self-Rule',
      d: 'Theory of Economic Nationalism'
    },
    answer: 'a',
    explanation: 'Naoroji expounded the "Drain of Wealth" theory in his seminal book "Poverty and Un-British Rule in India" (1901).'
  },
  {
    id: 'q199',
    qNumber: 199,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'What was the name of the Gujarati fortnightly journal founded by Dadabhai Naoroji?',
    options: {
      a: 'Hind Swaraj',
      b: 'The Voice of India',
      c: 'Rast Goftar',
      d: 'Indian Review'
    },
    answer: 'c',
    explanation: 'Rast Goftar ("The Truth Teller") was founded in 1854 to champion progressive Zoroastrian and social reform.'
  },
  {
    id: 'q200',
    qNumber: 200,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'Which of the following titles was given to Dadabhai Naoroji due to his contributions to the Indian nationalist movement?',
    options: {
      a: 'Father of Indian Nation',
      b: 'Nightingale of India',
      c: 'Unofficial Ambassador of India',
      d: 'Grand Old Man of India'
    },
    answer: 'd',
    explanation: 'Dadabhai Naoroji is affectionately revered as the "Grand Old Man of India".'
  },
  {
    id: 'q201',
    qNumber: 201,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'Which of the following organizations was founded by Dadabhai Naoroji in London to advocate for Indian political rights?',
    options: {
      a: 'The Indian National Congress',
      b: 'The East India Association',
      c: 'The Indian Reform Society',
      d: 'The All India Muslim League'
    },
    answer: 'b',
    explanation: 'The East India Association was established in London in 1866 to inform the British public and Parliament on Indian grievances.'
  },
  {
    id: 'q202',
    qNumber: 202,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'Mahatma Jyotiba Phule was born on April 11, 1827, in:',
    options: {
      a: 'Bombay',
      b: 'Satara',
      c: 'Chennai',
      d: 'Kolkata'
    },
    answer: 'b',
    explanation: 'Jyotirao Govindrao Phule was born in Satara district, Maharashtra, in 1827.'
  },
  {
    id: 'q203',
    qNumber: 203,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'Jyotirao Phule started his first school for girls in which year?',
    options: {
      a: '1831',
      b: '1848',
      c: '1873',
      d: '1890'
    },
    answer: 'b',
    explanation: 'In August 1848 at Bhidewada, Pune, Phule along with Savitribai Phule founded the first indigenous school for girls.'
  },
  {
    id: 'q204',
    qNumber: 204,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'Mahatma Jyotiba Phule was known for his struggle against:',
    options: {
      a: 'Colonialism',
      b: 'Caste Discrimination',
      c: 'Gender Inequality',
      d: 'Both (b) and (c)'
    },
    answer: 'd',
    explanation: 'He was a pioneering crusader against caste tyranny, untouchability, and gender subjugation.'
  },
  {
    id: 'q205',
    qNumber: 205,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'The Satyashodhak Samaj was founded to:',
    options: {
      a: 'Promote British rule',
      b: 'Spread religious rituals',
      c: 'Attain equality for lower castes',
      d: 'Support caste hierarchy'
    },
    answer: 'c',
    explanation: 'Founded in September 1873, Satyashodhak Samaj (Truth-Seekers\' Society) aimed to liberate Shudras and Ati-Shudras from exploitation.'
  },
  {
    id: 'q206',
    qNumber: 206,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'Which book was written by Jyotirao Phule in 1873?',
    options: {
      a: 'Hind Swaraj',
      b: 'Gulamgiri',
      c: 'Discovery of India',
      d: 'Rast Goftar ("The Truth Teller")'
    },
    answer: 'b',
    explanation: 'In 1873, Phule wrote Gulamgiri ("Slavery"), dedicating it to the abolitionist movement in the United States.'
  },
  {
    id: 'q207',
    qNumber: 207,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Fighters & Personalities',
    question: 'Which of the following states has unanimously passed a resolution requesting the Union Government to confer the Bharat Ratna, India\'s highest civilian award, on Mahatma Jyotiba Phule and Savitribai Phule?',
    options: {
      a: 'Maharashtra',
      b: 'Madhya Pradesh',
      c: 'Uttar Pradesh',
      d: 'Kerala'
    },
    answer: 'a',
    explanation: 'The Maharashtra State Legislature unanimously passed a resolution urging Bharat Ratna for the revolutionary reformer couple.'
  },
  // Freedom Struggle Movements
  {
    id: 'q208',
    qNumber: 208,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Which of the following was the main objective of the Kakori Train action carried out by HRA in 1925?',
    options: {
      a: 'To launch an armed uprising against the British.',
      b: 'To seize British government funds for the freedom struggle.',
      c: 'To protest against the Jallianwala Bagh massacre.',
      d: 'To attack British military posts in India.'
    },
    answer: 'b',
    explanation: 'On 9 August 1925 near Kakori (Lucknow), HRA revolutionaries looted the railway treasury guard van to acquire weapons for the revolutionary struggle.'
  },
  {
    id: 'q209',
    qNumber: 209,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Which of the following revolutionaries was NOT involved in the Kakori train action?',
    options: {
      a: 'Ram Prasad Bismil',
      b: 'Ashfaqullah Khan',
      c: 'Rajendra Lahiri',
      d: 'Lala Lajpat Rai'
    },
    answer: 'd',
    explanation: 'Lala Lajpat Rai was a mainstream nationalist leader of the Congress Lal-Bal-Pal trio, not involved in underground HRA operations.'
  },
  {
    id: 'q210',
    qNumber: 210,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'In which year was the Hindustan Republican Association (HRA) renamed as the Hindustan Socialist Republican Association (HSRA)?',
    options: {
      a: '1926',
      b: '1924',
      c: '1928',
      d: '1930'
    },
    answer: 'c',
    explanation: 'At a historic meeting at Feroz Shah Kotla ruins in Delhi in September 1928, Bhagat Singh and Chandrashekhar Azad added "Socialist" to HRA.'
  },
  {
    id: 'q211',
    qNumber: 211,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'What was the ideology adopted by the HSRA after its formation?',
    options: {
      a: 'Gandhian non-violence',
      b: 'Socialist ideology',
      c: 'Secularism',
      d: 'All of the above'
    },
    answer: 'b',
    explanation: 'The HSRA embraced Marxist-Leninist socialism, seeking an egalitarian republic free from capitalism and exploitation.'
  },
  {
    id: 'q212',
    qNumber: 212,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Which of the following is the correct statement regarding the HRA\'s manifesto?',
    options: {
      a: 'The HRA advocated for an independent Hindu India.',
      b: 'It called for armed revolution to establish a Republic of the United States of India.',
      c: 'It sought peaceful negotiations for independence.',
      d: 'It promoted the idea of a theocratic state.'
    },
    answer: 'b',
    explanation: 'HRA\'s manifesto "The Revolutionary" (1925) demanded an organized armed revolution to establish the "Federal Republic of the United States of India".'
  },
  {
    id: 'q213',
    qNumber: 213,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Which of the following was a significant result of the Kakori train action?',
    options: {
      a: 'Death of prominent revolutionaries',
      b: 'Increased support for the Gandhi-led Non-Cooperation Movement',
      c: 'Establishment of the Indian National Army',
      d: 'Formation of the Indian National Congress'
    },
    answer: 'a',
    explanation: 'Ram Prasad Bismil, Ashfaqullah Khan, Roshan Singh, and Rajendra Lahiri were sentenced to death and hanged in December 1927.'
  },
  {
    id: 'q214',
    qNumber: 214,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'What is the name of the Mahatma Gandhi\'s book which declared that British rule was established in India with the cooperation of Indians, and had survived only because of this cooperation, which is redacted with [1] in the passage above?',
    context: 'In his famous book [1], Mahatma Gandhi declared that British rule was established in India with the cooperation of Indians...',
    options: {
      a: 'The Story of My Experiments with Truth',
      b: 'India of My Dreams',
      c: 'Constructive Programme: Its Meaning and Place',
      d: 'Hind Swaraj'
    },
    answer: 'd',
    explanation: 'Gandhi penned Hind Swaraj (Indian Home Rule) in 1909 aboard the ship SS Kildonan Castle.'
  },
  {
    id: 'q215',
    qNumber: 215,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Which of the following was proposed by Mahatma Gandhi as the first stage of the Non-Cooperation Movement?',
    options: {
      a: 'Launching an armed rebellion against the British',
      b: 'Immediate Civil Disobedience Movement',
      c: 'Surrender of titles and boycott of British institutions',
      d: 'Formation of a parallel government across India'
    },
    answer: 'c',
    explanation: 'Stage one required surrendering colonial titles, honours, and boycotting civil services, courts, schools, and foreign goods.'
  },
  {
    id: 'q216',
    qNumber: 216,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Mahatma Gandhi and Shaukat Ali extensively toured India during the summer of 1920 mainly to:',
    options: {
      a: 'Raise funds for the Indian Non-Cooperation Movement',
      b: 'Campaign for the legislative council elections',
      c: 'Negotiate constitutional reforms with the British Government',
      d: 'Mobilise popular support for the Non-Cooperation Movement'
    },
    answer: 'd',
    explanation: 'They mobilized mass national unity between Hindus and Muslims uniting the Khilafat cause with Swaraj.'
  },
  {
    id: 'q217',
    qNumber: 217,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Which of the following incidents led to the withdrawal of the Non-Cooperation Movement in 1922?',
    options: {
      a: 'Jallianwala Bagh Massacre',
      b: 'Chauri Chaura Incident',
      c: 'Kakori Conspiracy',
      d: 'Simon Commission Protests'
    },
    answer: 'b',
    explanation: 'On 4 February 1922 at Chauri Chaura (Gorakhpur), an agitated crowd burned a police post killing 22 policemen, leading Gandhi to call off the movement.'
  },
  {
    id: 'q218',
    qNumber: 218,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'The Non-Cooperation Movement was launched in response to which of the following? 1. Jallianwala Bagh Massacre, 2. Rowlatt Act, 3. Khilafat Movement',
    options: {
      a: '1 and 2 only',
      b: '2 and 3 only',
      c: '1 and 3 only',
      d: '1, 2 and 3'
    },
    answer: 'd',
    explanation: 'The movement united public fury over the Rowlatt Act ("Black Act"), the Amritsar massacre, and the Khilafat grievance.'
  },
  {
    id: 'q219',
    qNumber: 219,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Which of the following titles was renounced by Rabindranath Tagore in protest against the Jallianwala Bagh Massacre before the Non-Cooperation Movement?',
    options: {
      a: 'Gurudev',
      b: 'Kaiser-i-Hind Medal',
      c: 'Knighthood',
      d: 'Companion of the Indian Empire'
    },
    answer: 'c',
    explanation: 'Tagore renounced his British Knighthood in May 1919 in an impassioned letter to Viceroy Lord Chelmsford.'
  },
  {
    id: 'q220',
    qNumber: 220,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Bhagat Singh, Rajguru, and Sukhdev were executed in:',
    options: {
      a: 'Delhi Jail',
      b: 'Cellular Jail',
      c: 'Lahore Central Jail',
      d: 'Yerwada Jail'
    },
    answer: 'c',
    explanation: 'The trio was martyred by hanging on 23 March 1931 inside Lahore Central Jail.'
  },
  {
    id: 'q221',
    qNumber: 221,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'The Hindustan Socialist Republican Association (HSRA) was a radical Indian revolutionary organization founded in:',
    options: {
      a: '1924',
      b: '1915',
      c: '1919',
      d: '1928'
    },
    answer: 'd',
    explanation: 'HSRA was established in September 1928 at Delhi\'s Feroz Shah Kotla.'
  },
  {
    id: 'q222',
    qNumber: 222,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'The death of Lala Lajpat Rai was caused due to injuries sustained during protests against:',
    options: {
      a: 'Rowlatt Act',
      b: 'Simon Commission',
      c: 'Partition of Bengal',
      d: 'Quit India Movement'
    },
    answer: 'b',
    explanation: 'Lala Lajpat Rai suffered brutal police lathi blows directed by James A. Scott in Lahore while protesting the all-white Simon Commission in October 1928.'
  },
  {
    id: 'q223',
    qNumber: 223,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Who among the following was killed by Bhagat Singh and his associates due to mistaken identity?',
    options: {
      a: 'James Scott',
      b: 'Lord Mountbatten',
      c: 'General Dyer',
      d: 'John Saunders'
    },
    answer: 'd',
    explanation: 'Aiming to avenge Lajpat Rai by assassinating Police Superintendent James Scott, Bhagat Singh and Rajguru mistakenly shot Assistant Superintendent John P. Saunders.'
  },
  {
    id: 'q224',
    qNumber: 224,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Bhagat Singh and Batukeshwar Dutt threw bombs in the Central Legislative Assembly in 1929 to protest against:',
    options: {
      a: 'Rowlatt Act and Jallianwala Bagh massacre',
      b: 'Simon Commission and Salt Law',
      c: 'Trade Disputes Bill and Public Safety Bill',
      d: 'Partition of Bengal and Vernacular Press Act'
    },
    answer: 'c',
    explanation: 'On 8 April 1929, they threw smoke bombs and leaflets ("To make the deaf hear") against the repressive Public Safety and Trade Disputes Bills.'
  },
  {
    id: 'q225',
    qNumber: 225,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'The people of India agitated against the arrival of the Simon Commission because:',
    options: {
      a: 'Indians never wanted the review of the working of the Act of 1919',
      b: 'The Simon Commission recommended the abolition of Dyarchy in the Provinces',
      c: 'The Simon Commission suggested the partition of the country',
      d: 'There was no Indian member in the Simon Commission'
    },
    answer: 'd',
    explanation: 'The Indian Statutory Commission (Simon Commission) appointed in 1927 was boycotted across parties because all seven of its commissioners were British MPs.'
  },
  {
    id: 'q226',
    qNumber: 226,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Why did Mahatma Gandhi choose salt as a central issue for protest?',
    options: {
      a: 'it was heavily exported by the British',
      b: 'it was consumed only by the poor',
      c: 'it was essential for all sections of society and symbolized oppression',
      d: 'it was a major source of British military revenue'
    },
    answer: 'c',
    explanation: 'Salt was an absolute biological necessity used by every human regardless of religion, caste, or wealth; taxing it highlighted colonial inhumanity.'
  },
  {
    id: 'q227',
    qNumber: 227,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'What was the primary objective behind Mahatma Gandhi\'s eleven demands to Viceroy Irwin?',
    options: {
      a: 'to secure immediate independence from British rule',
      b: 'to include demands representing different sections of society',
      c: 'to weaken the authority of the Indian National Congress',
      d: 'to establish a new constitution for India'
    },
    answer: 'b',
    explanation: 'The 11 demands addressed peasants (50% land revenue cut), merchants (rupee-sterling ratio, tariff protection), and all citizens (salt tax abolition).'
  },
  {
    id: 'q228',
    qNumber: 228,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Which of the following statements regarding the Salt March (1930) is correct?',
    options: {
      a: 'it was largely ignored by the international media',
      b: 'it was only a regional movement limited to Gujarat',
      c: 'it gained global attention through international press coverage',
      d: 'it was supported only by political elites'
    },
    answer: 'c',
    explanation: 'Journalists like Webb Miller and international newspapers covered the 240-mile march extensively, galvanizing global sympathy.'
  },
  {
    id: 'q229',
    qNumber: 229,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'What was a significant social impact of the Salt March?',
    options: {
      a: 'it marked large-scale participation of women in the movement',
      b: 'it led to the formation of new political parties',
      c: 'it resulted in immediate independence',
      d: 'it led to the abolition of zamindari'
    },
    answer: 'a',
    explanation: 'Thousands of women (led by Sarojini Naidu, Kamaladevi Chattopadhyay, etc.) broke societal seclusion to picket liquor shops and manufacture contraband salt.'
  },
  {
    id: 'q230',
    qNumber: 230,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'Which act marked the formal beginning of the Civil Disobedience Movement?',
    options: {
      a: 'writing the letter to Viceroy Irwin',
      b: 'refusal to pay land revenue',
      c: 'boycott of British goods',
      d: 'breaking the salt law at Dandi'
    },
    answer: 'd',
    explanation: 'On the morning of 6 April 1930 at Dandi beach, Gandhi picked up a lump of natural salt, formally launching Civil Disobedience.'
  },
  {
    id: 'q231',
    qNumber: 231,
    category: 'history',
    categoryName: 'Indian & World History',
    subtopic: 'Freedom Struggle & Movements',
    question: 'What method did Mahatma Gandhi emphasize during the Salt March?',
    options: {
      a: 'armed resistance',
      b: 'violent protests',
      c: 'economic boycott alone',
      d: 'non-violent civil disobedience'
    },
    answer: 'd',
    explanation: 'Disciplined Satyagraha and complete adherence to non-violence (Ahimsa) were foundational.'
  }
];
