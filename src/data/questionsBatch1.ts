import { Question } from '../types/question';

// Raw question bank containing all 692 verified questions parsed into structured tactical flashcard format
export const QUESTIONS_BATCH_1: Question[] = [
  // 1. INTERNATIONAL & SUMMITS (Q1 - Q196)
  {
    id: 'q1',
    qNumber: 1,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'Which of the following countries are part of the European Free Trade Association (EFTA) involved in the India-EFTA TEPA?',
    options: {
      a: 'Switzerland, Norway, Iceland, and Denmark',
      b: 'Switzerland, Norway, Iceland, and Liechtenstein',
      c: 'France, Belgium, Luxembourg and Switzerland',
      d: 'Sweden, Finland, Iceland and Denmark'
    },
    answer: 'b',
    explanation: 'The European Free Trade Association (EFTA) consists of four non-EU member states: Switzerland, Norway, Iceland, and Liechtenstein.'
  },
  {
    id: 'q2',
    qNumber: 2,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'When did the India-EFTA Trade and Economic Partnership Agreement (TEPA) enter into force?',
    options: {
      a: 'October 1, 2025',
      b: 'March 10, 2024',
      c: 'January 1, 2025',
      d: 'July 1, 2025'
    },
    answer: 'a',
    explanation: 'Signed in March 2024, the historic India-EFTA TEPA entered into force on October 1, 2025.'
  },
  {
    id: 'q3',
    qNumber: 3,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'What is the primary objective of a Free Trade Agreement (FTA)?',
    options: {
      a: 'To foster competitive market monopolies',
      b: 'To impose import quotas on goods from partner countries',
      c: 'To reduce tariffs and non-tariff barriers to trade',
      d: 'To limit foreign direct investment by partner countries'
    },
    answer: 'c',
    explanation: 'FTAs are international treaties designed to reduce or eliminate tariffs, duties, and non-tariff barriers to facilitate trade and investment.'
  },
  {
    id: 'q4',
    qNumber: 4,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'Which of the following deals is called the "Mother of Deals"?',
    options: {
      a: 'The India EU Free Trade Agreement',
      b: 'The India-US Civil Nuclear Deal',
      c: 'The Paris Climate Agreement',
      d: 'The India-EFTA Economic and Trade Agreement'
    },
    answer: 'a',
    explanation: 'The comprehensive and high-stakes India-European Union Bilateral Trade and Investment Agreement is often referred to as the "Mother of Deals".'
  },
  {
    id: 'q5',
    qNumber: 5,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'India does not have a free trade agreement with which of the following?',
    options: {
      a: 'UAE',
      b: 'Oman',
      c: 'EFTA',
      d: 'European Union'
    },
    answer: 'd',
    explanation: 'India has completed CEPAs/FTAs with UAE, Oman, and EFTA, while the India-EU FTA is still under prolonged negotiations.'
  },
  {
    id: 'q6',
    qNumber: 6,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'What is the key feature of the India-United States interim agreement mentioned in the passage?',
    options: {
      a: 'It was signed in February 2026',
      b: 'It finalized the India-US FTA',
      c: 'It marks India\'s first trade agreement with a Western country',
      d: 'It was a framework for an interim agreement, not a final one'
    },
    answer: 'd',
    explanation: 'The framework laid out terms for an early harvest / interim bilateral agreement rather than a final comprehensive free trade pact.'
  },
  {
    id: 'q7',
    qNumber: 7,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'The India-Oman Comprehensive Economic Partnership Agreement (CEPA) came into force on [1], which of the following has been redacted with [1] in the passage above?',
    context: 'The India-Oman Comprehensive Economic Partnership Agreement (CEPA), which came into force on [1], aims to strengthen this historic relationship...',
    options: {
      a: 'January 26, 2026',
      b: 'March 1, 2026',
      c: 'June 1, 2026',
      d: 'July 1, 2026'
    },
    answer: 'c',
    explanation: 'The India-Oman CEPA formally came into force on June 1, 2026.'
  },
  {
    id: 'q8',
    qNumber: 8,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'Which of the following best describes a Comprehensive Economic Partnership Agreement (CEPA)?',
    options: {
      a: 'A state-led import substitution strategy that reduces quantitative restrictions and tariff escalation to protect domestic infant industries from global competition.',
      b: 'A legally binding, broad-spectrum economic integration framework encompassing trade in goods, services, investment facilitation, intellectual property rights, and regulatory cooperation.',
      c: 'A broadly structured tariff-reduction arrangement limited primarily to goods trade in select industrial product categories under predefined safeguard clauses.',
      d: 'A monetary integration arrangement involving fixed exchange rates, capital mobility alignment, and potential common currency adoption among participating economies.'
    },
    answer: 'b',
    explanation: 'A CEPA is more extensive than a standard FTA, covering trade in goods, services, investment, intellectual property rights, and regulatory mechanisms.'
  },
  {
    id: 'q9',
    qNumber: 9,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'Which of the following is the leading export category in India\'s bilateral trade with Oman?',
    options: {
      a: 'Refined petroleum products',
      b: 'Coal exports',
      c: 'Cotton exports',
      d: 'Tea and coffee exports'
    },
    answer: 'a',
    explanation: 'Refined petroleum products constitute the dominant export item from India to Oman.'
  },
  {
    id: 'q10',
    qNumber: 10,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'The capital and currency of Oman are respectively:',
    options: {
      a: 'Salalah and Omani Dinar',
      b: 'Muscat and Omani Rial',
      c: 'Nizwa and Omani Riyal',
      d: 'Muscat and Omani Riyal'
    },
    answer: 'b',
    explanation: 'The capital of the Sultanate of Oman is Muscat, and its currency is the Omani Rial (OMR).'
  },
  {
    id: 'q11',
    qNumber: 11,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Free Trade Agreements (FTAs)',
    question: 'Before concluding the Oman CEPA, India had entered into trade agreements with several partners including which of the following?',
    options: {
      a: 'European Free Trade Association',
      b: 'European Union',
      c: 'New Zealand',
      d: 'All of the above'
    },
    answer: 'a',
    explanation: 'India concluded the TEPA with EFTA prior to finalizing the Oman CEPA.'
  },
  // Geopolitics & Conflicts
  {
    id: 'q12',
    qNumber: 12,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Iran retaliated against US actions primarily through:',
    options: {
      a: 'Cyber-attacks only',
      b: 'Trade sanctions',
      c: 'Missile and drone strikes',
      d: 'Naval invasions'
    },
    answer: 'c',
    explanation: 'Iran\'s asymmetric and conventional retaliation centered on extensive ballistic missile and Shahed drone strikes across the region.'
  },
  {
    id: 'q13',
    qNumber: 13,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following statements is Not correct regarding the regional expansion of the USA-Iran conflict?',
    options: {
      a: 'Hezbollah, based in Lebanon, engaged in conflict with Israel on the northern front',
      b: 'Houthis in Yemen targeted commercial shipping in the Red Sea and Gulf of Aden',
      c: 'Popular Mobilization Forces (PMF) in Iraq and Syria remained neutral during the conflict',
      d: 'None of the above'
    },
    answer: 'c',
    explanation: 'PMF militias in Iraq and Syria actively launched rocket and drone attacks on US bases, rather than remaining neutral.'
  },
  {
    id: 'q14',
    qNumber: 14,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following was a major reason cited by the United States for attacking Iran?',
    options: {
      a: 'Preventing nuclear weapon development',
      b: 'Destroying missile capabilities',
      c: 'Regime change',
      d: 'All of the above'
    },
    answer: 'd',
    explanation: 'US operational rationale included destroying missile facilities, interdicting nuclear weapon research, and pushing for political reorientation.'
  },
  {
    id: 'q15',
    qNumber: 15,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following international organisations stated that there was no confirmed evidence of an Iranian nuclear weapons program?',
    options: {
      a: 'IMF',
      b: 'IAEA',
      c: 'UNO',
      d: 'WTO'
    },
    answer: 'b',
    explanation: 'The International Atomic Energy Agency (IAEA) is the specialized nuclear inspection watchdog.'
  },
  {
    id: 'q16',
    qNumber: 16,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'India imports a significant portion of its crude oil via which region affected by the conflict?',
    options: {
      a: 'Persian Gulf',
      b: 'Baltic Sea',
      c: 'Arctic Ocean',
      d: 'Mediterranean Sea'
    },
    answer: 'a',
    explanation: 'Over 60% of India\'s crude oil and petroleum supplies transit through the Persian Gulf and Strait of Hormuz.'
  },
  {
    id: 'q17',
    qNumber: 17,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following strategic waterways was closed by Iran during the conflict?',
    options: {
      a: 'Suez Canal',
      b: 'Strait of Hormuz',
      c: 'Strait of Gibraltar',
      d: 'Bosphorus Strait'
    },
    answer: 'b',
    explanation: 'The Strait of Hormuz is the narrow passage linking the Persian Gulf with the Gulf of Oman and Arabian Sea.'
  },
  {
    id: 'q18',
    qNumber: 18,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'According to the Uppsala Conflict Data Program (UCDP), a "major war" is defined as a conflict resulting in at least:',
    options: {
      a: '1,000 battlefield deaths a year.',
      b: '5,000 battlefield deaths a year.',
      c: '10,000 battlefield deaths a year.',
      d: '100,000 battlefield deaths a year.'
    },
    answer: 'a',
    explanation: 'UCDP classifies a conflict as a war when it generates at least 1,000 battle-related fatalities in a single calendar year.'
  },
  {
    id: 'q19',
    qNumber: 19,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following countries are directly involved in the Russia-Ukraine War? 1. Russia, 2. Ukraine, 3. Belarus, 4. Poland',
    options: {
      a: '1 and 2 only',
      b: '1, 2 and 3 only',
      c: '2 and 4 only',
      d: '1, 2, 3 and 4'
    },
    answer: 'b',
    explanation: 'Russia and Ukraine are direct combatants, while Belarus serves as a staging ground and non-combatant co-belligerent.'
  },
  {
    id: 'q20',
    qNumber: 20,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The ongoing Israel-Hamas conflict primarily centers on which territory?',
    options: {
      a: 'Golan Heights',
      b: 'Gaza Strip',
      c: 'West Bank only',
      d: 'Sinai Peninsula'
    },
    answer: 'b',
    explanation: 'The intense urban and military confrontation between Israel and Hamas is centered on the Gaza Strip.'
  },
  {
    id: 'q21',
    qNumber: 21,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The Red Sea shipping crisis is mainly linked to attacks by which group?',
    options: {
      a: 'Hezbollah',
      b: 'Boko Haram',
      c: 'ISIS',
      d: 'Houthis'
    },
    answer: 'd',
    explanation: 'The Houthi movement (Ansar Allah) in Yemen targeted container ships navigating the Bab el-Mandeb strait and Red Sea.'
  },
  {
    id: 'q22',
    qNumber: 22,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The conflict between Armenia and Azerbaijan mainly concerns which disputed region?',
    options: {
      a: 'Crimea',
      b: 'Kosovo',
      c: 'Nagorno-Karabakh',
      d: 'Donbas'
    },
    answer: 'c',
    explanation: 'Nagorno-Karabakh (Artsakh) has been the central contested mountainous territory between Armenia and Azerbaijan.'
  },
  {
    id: 'q23',
    qNumber: 23,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The Rapid Support Forces (RSF) are associated with which of the following countries?',
    options: {
      a: 'Chad',
      b: 'Sudan',
      c: 'Ethiopia',
      d: 'Eritrea'
    },
    answer: 'b',
    explanation: 'The RSF, led by Mohamed Hamdan Dagalo (Hemedti), is fighting against the Sudanese Armed Forces in Sudan.'
  },
  {
    id: 'q24',
    qNumber: 24,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The Democratic Republic of the Congo (DRC) has witnessed renewed fighting involving which of the following rebel groups?',
    options: {
      a: 'M23',
      b: 'FARC',
      c: 'LTTE',
      d: 'PKK'
    },
    answer: 'a',
    explanation: 'The March 23 Movement (M23) has driven violent clashes in the North Kivu province of the DRC.'
  },
  {
    id: 'q25',
    qNumber: 25,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The Russo-Ukrainian conflict originally began in:',
    options: {
      a: '2014',
      b: '2008',
      c: '2010',
      d: '2022'
    },
    answer: 'a',
    explanation: 'Hostilities began in February-March 2014 with the annexation of Crimea and the war in Donbas, escalating into full invasion in 2022.'
  },
  {
    id: 'q26',
    qNumber: 26,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The Euromaidan protests in Ukraine were associated with:',
    options: {
      a: 'Expansion of NATO bases',
      b: 'Revolution of Dignity',
      c: 'Russian annexation of Crimea',
      d: 'Minsk ceasefire talks'
    },
    answer: 'b',
    explanation: 'The Euromaidan wave of demonstrations in 2013-2014 culminated in the Revolution of Dignity.'
  },
  {
    id: 'q27',
    qNumber: 27,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following international military alliances did Russia oppose Ukraine from joining?',
    options: {
      a: 'ASEAN',
      b: 'BRICS',
      c: 'NATO',
      d: 'SCO'
    },
    answer: 'c',
    explanation: 'Russian leadership vehemently opposed Ukraine joining the North Atlantic Treaty Organization (NATO).'
  },
  {
    id: 'q28',
    qNumber: 28,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following statements best describes the Russo-Ukrainian War?',
    options: {
      a: 'A short border conflict resolved in 2015',
      b: 'Europe\'s largest conflict since World War II',
      c: 'A naval-only conflict in the Black Sea',
      d: 'A conflict limited only to cyberwarfare'
    },
    answer: 'b',
    explanation: 'The conflict is widely recognized as the largest land war and security crisis on the European continent since 1945.'
  },
  {
    id: 'q29',
    qNumber: 29,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following agreements were signed in 2014 and 2015 to reduce fighting in eastern Ukraine?',
    options: {
      a: 'Geneva Agreements',
      b: 'Minsk Agreements',
      c: 'Camp David Accords',
      d: 'Oslo Accords'
    },
    answer: 'b',
    explanation: 'Minsk I (2014) and Minsk II (2015) protocols were brokered under the Normandy Format.'
  },
  {
    id: 'q30',
    qNumber: 30,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following statements is Not true regarding Ukraine?',
    options: {
      a: 'It is a country in Eastern Europe.',
      b: 'Its capital is Kyiv.',
      c: 'Its official currency is Hryvnia.',
      d: 'It does not shares land borders with Moldova and Slovakia.'
    },
    answer: 'd',
    explanation: 'Ukraine shares direct international land borders with both Moldova and Slovakia (along with Poland, Hungary, Romania, Belarus, and Russia).'
  },
  {
    id: 'q31',
    qNumber: 31,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The Islamabad Memorandum of Understanding was primarily brokered by which of the following countries?',
    options: {
      a: 'Qatar',
      b: 'Saudi Arabia',
      c: 'Türkiye',
      d: 'Pakistan'
    },
    answer: 'd',
    explanation: 'The Islamabad MoU was hosted and brokered through Pakistani diplomatic channels.'
  },
  {
    id: 'q32',
    qNumber: 32,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The primary objective of the Islamabad Memorandum of Understanding is to:',
    options: {
      a: 'Establish a permanent regional collective security architecture by integrating the defence mechanisms of West Asian countries under a multilateral military coordination framework',
      b: 'Establish a ceasefire to permanently end military hostilities and establish a structured 60-day diplomatic framework for long-term negotiations between the United States and Iran',
      c: 'Create a regional economic integration mechanism centred on energy cooperation, free movement of goods, and a common monetary framework among Gulf states',
      d: 'Establish an international legal framework authorising multinational peacekeeping forces to supervise all nuclear facilities and maritime chokepoints in West Asia'
    },
    answer: 'b',
    explanation: 'The MoU focused on a ceasefire and a structured 60-day diplomatic track between the US and Iran.'
  },
  {
    id: 'q33',
    qNumber: 33,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'According to the Memorandum, Iran reaffirmed that it would:',
    options: {
      a: 'Not procure or develop nuclear weapons',
      b: 'Suspend all uranium enrichment permanently',
      c: 'Join the Nuclear Non-Proliferation Treaty for the first time',
      d: 'Transfer all nuclear facilities to the IAEA'
    },
    answer: 'a',
    explanation: 'Iran explicitly reaffirmed its sovereign commitment to refrain from acquiring or developing nuclear weapons.'
  },
  {
    id: 'q34',
    qNumber: 34,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'According to the Memorandum, the final agreement will acquire additional legal force through:',
    options: {
      a: 'Ratification by the G7 Leaders\' and endorsement through a binding United Nations Security Council resolution.',
      b: 'Approval by the International Court of Justice and approved by the United Nations Security Council.',
      c: 'Endorsement through a binding United Nations Security Council resolution.',
      d: 'Certification by the USA and Iran and agreed by the United Nations General Assembly.'
    },
    answer: 'c',
    explanation: 'The mechanism provides for endorsement through a binding resolution passed by the United Nations Security Council.'
  },
  {
    id: 'q35',
    qNumber: 35,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'The implementation of the Memorandum and compliance with the future final agreement will be monitored through:',
    options: {
      a: 'A joint executive monitoring mechanism',
      b: 'A NATO verification mission',
      c: 'A World Bank oversight committee',
      d: 'An Organisation of Islamic Cooperation commission'
    },
    answer: 'a',
    explanation: 'A joint executive monitoring mechanism was established to verify compliance.'
  },
  {
    id: 'q36',
    qNumber: 36,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Geopolitics & International Conflicts',
    question: 'Which of the following international organisations is specifically assigned a supervisory role over the neutralisation of Iran\'s enriched uranium stockpile?',
    options: {
      a: 'Organisation for the Prohibition of Chemical Weapons (OPCW)',
      b: 'International Atomic Energy Agency (IAEA)',
      c: 'World Trade Organization (WTO)',
      d: 'United Nations Development Programme (UNDP)'
    },
    answer: 'b',
    explanation: 'The IAEA is assigned technical supervision over enriched fissile material stockpiles and dilution verification.'
  },
  // International Relations & Summits
  {
    id: 'q37',
    qNumber: 37,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following countries was not part of Prime Minister Narendra Modi\'s 5-nation diplomatic tour in 2026?',
    options: {
      a: 'Norway',
      b: 'Sweden',
      c: 'Germany',
      d: 'Italy'
    },
    answer: 'c',
    explanation: 'The 2026 tour encompassed Nordic nations, Italy, and partners, but excluded Germany from the itinerary.'
  },
  {
    id: 'q38',
    qNumber: 38,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Why had the India-Nordic Summit been cancelled earlier?',
    options: {
      a: 'Because of disagreement over the India-EU FTA',
      b: 'Because of the 2025 Pahalgam attack and conflict',
      c: 'Because Nordic countries withdrew from the summit',
      d: 'Because India postponed all European engagements'
    },
    answer: 'b',
    explanation: 'Security disruptions following the 2025 Pahalgam terror attack led to the postponement of the summit.'
  },
  {
    id: 'q39',
    qNumber: 39,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'What larger global concern shaped the renewed push for India-Europe collaboration?',
    options: {
      a: 'The decline of tourism between India and Europe',
      b: 'The inability of Europe to cooperate with Asian countries',
      c: 'The complete breakdown of trade between India and Nordic countries',
      d: 'The growing concern over superpower behaviour challenging the rules-based order'
    },
    answer: 'd',
    explanation: 'Both democratic blocs sought alignment against unilateral aggression and supply chain vulnerabilities.'
  },
  {
    id: 'q40',
    qNumber: 40,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'What do the India-EFTA trade agreement and the proposed India EU FTA have in common?',
    options: {
      a: 'A shared desire to diversify supply chains and markets',
      b: 'A decision to end all trade with non-European countries',
      c: 'A plan to restrict Indian exports to Nordic countries',
      d: 'A move to reduce diplomatic contact with Europe'
    },
    answer: 'a',
    explanation: 'Supply chain resilience, de-risking from single suppliers, and export market diversification are central goals.'
  },
  {
    id: 'q41',
    qNumber: 41,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Why were discussions in the UAE on Strategic Petroleum Reserves and Green Strategic Partnerships significant?',
    options: {
      a: 'They were linked to India\'s concerns over energy security',
      b: 'They were meant to replace all renewable energy projects',
      c: 'They were focused only on reducing foreign trade',
      d: 'They were unrelated to India\'s foreign policy'
    },
    answer: 'a',
    explanation: 'India\'s SPR cavern storage and green hydrogen corridors are pivotal to national energy resilience.'
  },
  {
    id: 'q42',
    qNumber: 42,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following countries conferred its highest civilian honour on Prime Minister Narendra Modi during his 5-nation diplomatic tour?',
    options: {
      a: 'Sweden',
      b: 'Denmark',
      c: 'Italy',
      d: 'France'
    },
    answer: 'c',
    explanation: 'Italy conferred its prestigious decoration celebrating bilateral strategic partnership.'
  },
  {
    id: 'q43',
    qNumber: 43,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Nepal Prime Minister Balendra Shah made headlines in May 2026 by stating that:',
    options: {
      a: 'India has no claim over Kalapani.',
      b: 'Nepal has never occupied any foreign territory.',
      c: 'Nepal too has encroached upon some Indian territories.',
      d: 'The Kalapani dispute has been permanently resolved.'
    },
    answer: 'c',
    explanation: 'Balendra Shah made a candid geopolitical remark indicating reciprocal border discrepancies.'
  },
  {
    id: 'q44',
    qNumber: 44,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following areas are associated with the India-Nepal territorial dispute discussed by Prime Minister Balendra Shah? 1. Kalapani, 2. Lipulekh, 3. Limpiyadhura, 4. Doklam',
    options: {
      a: '1 and 2 only',
      b: '1, 2 and 3 only',
      c: '2, 3 and 4 only',
      d: '1, 2, 3 and 4'
    },
    answer: 'b',
    explanation: 'Kalapani, Lipulekh, and Limpiyadhura are in the western trijunction dispute; Doklam is at the India-Bhutan-China trijunction.'
  },
  {
    id: 'q45',
    qNumber: 45,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'The elections that brought Balendra Shah to power were the first held after:',
    options: {
      a: 'The September 2025 Gen Z protests',
      b: 'The 2015 Constitution',
      c: 'The COVID-19 pandemic',
      d: 'The Nepal earthquake'
    },
    answer: 'a',
    explanation: 'Youth-led anti-corruption and governance reform protests in Autumn 2025 shifted the political landscape.'
  },
  {
    id: 'q46',
    qNumber: 46,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'The Kalapani territory is presently administered by India as part of which district?',
    options: {
      a: 'Chamoli',
      b: 'Pithoragarh',
      c: 'Almora',
      d: 'Uttarkashi'
    },
    answer: 'b',
    explanation: 'Kalapani is administered by India as part of Pithoragarh district in Uttarakhand.'
  },
  {
    id: 'q47',
    qNumber: 47,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'The Kalapani dispute primarily revolves around differing interpretations of the origin of which river?',
    options: {
      a: 'Gandak River',
      b: 'Koshi River',
      c: 'Kali River',
      d: 'Teesta River'
    },
    answer: 'c',
    explanation: 'The 1816 Treaty of Sugauli demarcated the boundary along the Kali (Sharda) River, whose source is interpreted differently.'
  },
  {
    id: 'q48',
    qNumber: 48,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'The valley of Kalapani forms an important route to which famous pilgrimage destination?',
    options: {
      a: 'Amarnath',
      b: 'Kedarnath',
      c: 'Hemkund Sahib',
      d: 'Kailash-Manasarovar'
    },
    answer: 'd',
    explanation: 'The Kalapani-Lipulekh pass route is the traditional Himalayan pilgrimage path to Kailash-Manasarovar in Tibet.'
  },
  {
    id: 'q49',
    qNumber: 49,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'During his State Visit to Indonesia, Prime Minister Narendra Modi was conferred which of the following honours?',
    options: {
      a: 'Bintang Adipurna',
      b: 'Bintang Mahaputera',
      c: 'Order of Temasek',
      d: 'Nishan-e-Indonesia'
    },
    answer: 'a',
    explanation: 'Bintang Republik Indonesia Adipurna is Indonesia\'s highest civilian and state decoration for foreign dignitaries.'
  },
  {
    id: 'q50',
    qNumber: 50,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Who among the following pairs of leaders were among the founding fathers of the Non-Aligned Movement (NAM)?',
    options: {
      a: 'Jawaharlal Nehru and Suharto',
      b: 'Indira Gandhi and Sukarno',
      c: 'Jawaharlal Nehru and Winston Churchill',
      d: 'Jawaharlal Nehru and Sukarno'
    },
    answer: 'd',
    explanation: 'Jawaharlal Nehru of India and President Sukarno of Indonesia (along with Tito, Nasser, and Nkrumah) founded NAM.'
  },
  {
    id: 'q51',
    qNumber: 51,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'The Indonesia Open Network (ION) launched during the Indian Prime Minister Narendra Modi\'s visit is modeled on India\'s:',
    options: {
      a: 'Prime Minister\'s Wi-Fi Access Network Interface (PM-WANI)',
      b: 'Unified Payments Interface (UPI)',
      c: 'Open Network for Digital Commerce (ONDC)',
      d: 'DigiLocker'
    },
    answer: 'c',
    explanation: 'ION unbundles digital commerce marketplaces using the open interoperable protocols pioneered by India\'s ONDC.'
  },
  {
    id: 'q52',
    qNumber: 52,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'India agreed to provide technical assistance for the conservation of which UNESCO World Heritage site in Indonesia?',
    options: {
      a: 'Prambanan Temple Complex',
      b: 'Borobudur Temple',
      c: 'Komodo National Park',
      d: 'Ujung Kulon National Park'
    },
    answer: 'a',
    explanation: 'India (via the Archaeological Survey of India) extended conservation expertise for the 9th-century Prambanan Hindu temple complex.'
  },
  {
    id: 'q53',
    qNumber: 53,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following Indian institutions has agreed to establish a branch campus in Indonesia?',
    options: {
      a: 'IIT Delhi',
      b: 'IIM Bangalore',
      c: 'AIIMS New Delhi',
      d: 'IISc Bengaluru'
    },
    answer: 'a',
    explanation: 'Following its Abu Dhabi campus, IIT Delhi expanded with technical education initiatives in Southeast Asia.'
  },
  {
    id: 'q54',
    qNumber: 54,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following is the boundary between India and the Tibet Autonomous Region of China in the eastern sector which has been redacted with [1] in the passage above?',
    context: 'The area falls within the [1] Line, the boundary historically recognized by the Survey of India on its official maps...',
    options: {
      a: 'Johnson Line',
      b: 'McMahon Line',
      c: 'Durand Line',
      d: 'Line of Control (LOC)'
    },
    answer: 'b',
    explanation: 'The McMahon Line was negotiated at the 1914 Simla Convention as the demarcation in the eastern Himalayas.'
  },
  {
    id: 'q55',
    qNumber: 55,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'India and China share a _____ km border which runs from northwest of the Karakoram Pass and ends at Arunachal Pradesh.',
    options: {
      a: '2,488 km',
      b: '3,488 km',
      c: '4,488 km',
      d: '5,488 km'
    },
    answer: 'b',
    explanation: 'The Line of Actual Control (LAC) and contested border span approximately 3,488 km across western, middle, and eastern sectors.'
  },
  {
    id: 'q56',
    qNumber: 56,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following events in 2020 contributed to the suspension of visa and trade relations between India and China?',
    options: {
      a: 'China\'s open support to terrorism at the SCO Summit',
      b: 'A financial dispute over trade tariffs',
      c: 'India\'s withdrawal from the SCO summit',
      d: 'Military standoff at the LAC and Galwan clashes'
    },
    answer: 'd',
    explanation: 'The fatal Galwan Valley confrontation in June 2020 led to severe diplomatic, military, and commercial freezes.'
  },
  {
    id: 'q57',
    qNumber: 57,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'The Darbuk-Shyok-DBO Road is a strategic all-weather road in eastern Ladakh in India near the Line of Actual Control with China. The road has been constructed by:',
    options: {
      a: 'Border Roads Organisation',
      b: 'DRDO',
      c: 'National Highway Development Authority',
      d: 'Hindustan Construction Company'
    },
    answer: 'a',
    explanation: 'The Border Roads Organisation (BRO) constructed the critical DS-DBO 255-km sub-sector north road.'
  },
  {
    id: 'q58',
    qNumber: 58,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'China refers to which Indian state as "South Tibet (Zang Nan)"?',
    options: {
      a: 'Sikkim',
      b: 'Arunachal Pradesh',
      c: 'Ladakh',
      d: 'Uttarakhand'
    },
    answer: 'b',
    explanation: 'Beijing routinely applies the revisionist label "Zangnan" (South Tibet) to Arunachal Pradesh.'
  },
  {
    id: 'q59',
    qNumber: 59,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following statements regarding the Vibrant Villages Programme-I (VVP-I) and Vibrant Villages Programme-II (VVP-II) is correct?',
    options: {
      a: 'VVP-I covers all strategically important villages located along every international land border of India, including the northern, western, eastern and northeastern borders.',
      b: 'VVP-II covers only the villages located along the northern border and continues the same geographical coverage as VVP-I without expanding to other international land border areas.',
      c: 'VVP-II covers strategic villages along international land borders other than the northern border already covered under VVP-I.',
      d: 'Both VVP-I and VVP-II are implemented as Centrally Sponsored Schemes with shared financial responsibility between the Central and State Governments.'
    },
    answer: 'c',
    explanation: 'VVP-II was expanded to cover borders with Myanmar, Bangladesh, and Pakistan, after VVP-I fortified the northern LAC border villages.'
  },
  {
    id: 'q60',
    qNumber: 60,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following cities of India have been redacted with [1] and [2] in the passage above?',
    context: '...backing major infrastructure projects including a high-speed rail corridor between [1] and [2].',
    options: {
      a: 'Mumbai and Bengaluru',
      b: 'Mumbai and Delhi',
      c: 'Kolkata and Mumbai',
      d: 'Mumbai and Ahmedabad'
    },
    answer: 'd',
    explanation: 'The flagship Japan-backed Shinkansen high-speed bullet train corridor connects Mumbai and Ahmedabad.'
  },
  {
    id: 'q61',
    qNumber: 61,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following banks has been redacted with [3] in the passage above?',
    context: 'Japanese firms have also increased investments in Indian companies, including a recent $1.6 billion deal for a 20% stake in [3] Bank.',
    options: {
      a: 'Yes Bank',
      b: 'Canara Bank',
      c: 'SBI',
      d: 'Punjab National Bank'
    },
    answer: 'a',
    explanation: 'Sumitomo Mitsui Banking Corporation (SMBC) of Japan acquired a landmark strategic stake in Yes Bank.'
  },
  {
    id: 'q62',
    qNumber: 62,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'Which of the following historic distinctions is associated with Sanae Takaichi?',
    options: {
      a: 'First Prime Minister from the Liberal Democratic Party',
      b: 'First woman to serve as Japan\'s Prime Minister',
      c: 'Youngest Prime Minister in Japan\'s history',
      d: 'First Prime Minister elected by direct popular vote'
    },
    answer: 'b',
    explanation: 'Sanae Takaichi made history by becoming Japan\'s first female prime minister.'
  },
  {
    id: 'q63',
    qNumber: 63,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Relations & Summits',
    question: 'India and Japan are foundational members of which of the following groups?',
    options: {
      a: 'ASEAN',
      b: 'BRICS',
      c: 'QUAD',
      d: 'SCO'
    },
    answer: 'c',
    explanation: 'India, Japan, the United States, and Australia form the Quadrilateral Security Dialogue (QUAD).'
  },
  // BIMSTEC
  {
    id: 'q64',
    qNumber: 64,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BIMSTEC',
    question: 'What was the original name of BIMSTEC before it was renamed?',
    options: {
      a: 'Bay of Bengal Economic Cooperation',
      b: 'Bangladesh-India-Sri Lanka-Thailand Economic Cooperation',
      c: 'Bay of Bengal Economic Cooperation and South Asia Economic Council',
      d: 'Bay of Bengal Economic Cooperation and South East Asia Regional Cooperation'
    },
    answer: 'b',
    explanation: 'BIMSTEC originally stood for BIST-EC (Bangladesh, India, Sri Lanka, Thailand Economic Cooperation) before Myanmar, Nepal, and Bhutan joined.'
  },
  {
    id: 'q65',
    qNumber: 65,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BIMSTEC',
    question: 'Which of the following countries was not a member when BIMSTEC was established in 1997?',
    options: {
      a: 'Bangladesh',
      b: 'Sri Lanka',
      c: 'Myanmar',
      d: 'Thailand'
    },
    answer: 'c',
    explanation: 'Myanmar joined a few months later in late 1997 (changing BIST-EC to BIMST-EC); Nepal and Bhutan joined in 2004.'
  },
  {
    id: 'q66',
    qNumber: 66,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BIMSTEC',
    question: 'The BIMSTEC Secretariat was established in:',
    options: {
      a: 'Dhaka',
      b: 'New Delhi',
      c: 'Kathmandu',
      d: 'Bangkok'
    },
    answer: 'a',
    explanation: 'The permanent BIMSTEC Secretariat is located in Dhaka, Bangladesh.'
  },
  {
    id: 'q67',
    qNumber: 67,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BIMSTEC',
    question: 'Which of the following sectors was initially focused on by BIMSTEC when it was established?',
    options: {
      a: 'Agriculture and Fisheries',
      b: 'Trade, Technology, Energy, Transport, Tourism, Fisheries',
      c: 'Counter-terrorism and Security',
      d: 'Environment and Climate Change'
    },
    answer: 'b',
    explanation: 'The six foundational pillars were trade, technology, energy, transport, tourism, and fisheries.'
  },
  {
    id: 'q68',
    qNumber: 68,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BIMSTEC',
    question: 'Which of the following countries within BIMSTEC focuses on expertise in the technology sector?',
    options: {
      a: 'Bangladesh',
      b: 'Bhutan',
      c: 'India',
      d: 'Sri Lanka'
    },
    answer: 'c',
    explanation: 'India was assigned the lead role in the security and technology/innovation domains.'
  },
  {
    id: 'q69',
    qNumber: 69,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BIMSTEC',
    question: 'The Bay of Bengal Initiative for Multi-Sectoral Technical and Economic Cooperation (BIMSTEC) is a regional organization that was established on 06 June 1997 through the:',
    options: {
      a: 'Beijing Declaration',
      b: 'Bangkok Declaration',
      c: 'Dhaka Declaration',
      d: 'New Delhi Declaration'
    },
    answer: 'b',
    explanation: 'The Bangkok Declaration signed on 6 June 1997 brought BIMSTEC into existence.'
  },
  // International Military Exercises
  {
    id: 'q70',
    qNumber: 70,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Military Exercises',
    question: 'Which of the following country\'s military participated alongside India in Exercise LAMITIYE-2026?',
    options: {
      a: 'Sri Lanka',
      b: 'Seychelles',
      c: 'Bangladesh',
      d: 'Nepal'
    },
    answer: 'b',
    explanation: 'LAMITIYE is the biennial joint military training exercise conducted between the Indian Army and Seychelles Defence Forces.'
  },
  {
    id: 'q71',
    qNumber: 71,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Military Exercises',
    question: 'Which of the following country\'s military participated alongside India in Exercise Dustlik 2026?',
    options: {
      a: 'Russia',
      b: 'Saudi Arabia',
      c: 'Oman',
      d: 'Uzbekistan'
    },
    answer: 'd',
    explanation: 'Exercise Dustlik is the bilateral military training exercise between India and Uzbekistan.'
  },
  {
    id: 'q72',
    qNumber: 72,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Military Exercises',
    question: 'Where was the 13th edition of the India-Kyrgyzstan Joint Special Forces Exercise KHANJAR 2026 held?',
    options: {
      a: 'Missamari, Assam',
      b: 'New Delhi, India',
      c: 'Bishkek, Kyrgyzstan',
      d: 'Mumbai, India'
    },
    answer: 'a',
    explanation: 'The 13th edition of Exercise Khanjar was hosted at Missamari Military Station in Assam, India.'
  },
  {
    id: 'q73',
    qNumber: 73,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Military Exercises',
    question: 'What is the primary objective of the India-Cambodia joint military exercise CINBAX-II 2026?',
    options: {
      a: 'To improve naval warfare techniques',
      b: 'To train for urban warfare operations',
      c: 'To enhance counter-terrorism and peacekeeping operations',
      d: 'To focus on joint air defense operations'
    },
    answer: 'c',
    explanation: 'Exercise CINBAX centers on UN peacekeeping deployment and counter-terrorism drills.'
  },
  {
    id: 'q74',
    qNumber: 74,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Military Exercises',
    question: 'Where was the second edition of the India-UAE joint military exercise "Desert Cyclone" held?',
    options: {
      a: 'Al-Hamra Training City, Abu Dhabi',
      b: 'Dubai Military Training Base',
      c: 'Indian Army Training Center, Rajasthan',
      d: 'Sharjah Training Zone'
    },
    answer: 'a',
    explanation: 'The second edition took place at Al-Hamra Training City in Abu Dhabi, UAE.'
  },
  {
    id: 'q75',
    qNumber: 75,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Military Exercises',
    question: 'Where is the 14th edition of the India - Thailand joint military Exercise MAITREE XIV being conducted?',
    options: {
      a: 'New Delhi, India',
      b: 'Bangkok, Thailand',
      c: 'Pune, India',
      d: 'Umroi, Meghalaya'
    },
    answer: 'd',
    explanation: 'Joint Training Node (JTN) Umroi in Meghalaya hosted Exercise Maitree XIV.'
  },
  {
    id: 'q76',
    qNumber: 76,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Military Exercises',
    question: 'Consider the following pairs: 1. Garuda Shakti - Army/Special Forces, 2. Samudra Shakti - Navy, 3. IND-INDO CORPAT - Coordinated Naval Patrol. Which of the pairs given above are correctly matched?',
    options: {
      a: '1 and 2 only',
      b: '2 and 3 only',
      c: '1 and 3 only',
      d: '1, 2 and 3'
    },
    answer: 'd',
    explanation: 'All three exercises between India and Indonesia are correctly matched.'
  },
  {
    id: 'q77',
    qNumber: 77,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Military Exercises',
    question: 'What is the name of the joint military exercise conducted between India and Oman?',
    options: {
      a: 'AL NAJAH',
      b: 'Al-Mohed Al-Hindi',
      c: 'Ekuverin',
      d: 'SIMBEX'
    },
    answer: 'a',
    explanation: 'AL NAJAH is the bilateral army exercise between India and the Royal Army of Oman.'
  },
  {
    id: 'q78',
    qNumber: 78,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'International Military Exercises',
    question: 'Which of the following is NOT the primary bilateral military exercise between India and Japan?',
    options: {
      a: 'Dharma Guardian (Army)',
      b: 'Nomadic Elephant (Army)',
      c: 'JIMEX (Navy)',
      d: 'Veer Guardian (Air Force)'
    },
    answer: 'b',
    explanation: 'Nomadic Elephant is conducted between India and Mongolia, not Japan.'
  },
  // BRICS
  {
    id: 'q79',
    qNumber: 79,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BRICS',
    question: 'What was the theme of India\'s BRICS Chairship in 2026?',
    options: {
      a: 'BRICS for Global Prosperity',
      b: 'Strengthening South-South Cooperation',
      c: 'Building for Resilience, Innovation, Cooperation and Sustainability',
      d: 'Inclusive Growth through Multilateralism'
    },
    answer: 'c',
    explanation: 'The designated chairship theme focused on resilience, innovation, cooperation, and sustainability.'
  },
  {
    id: 'q80',
    qNumber: 80,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BRICS',
    question: 'BRICS cooperation is primarily structured around which three pillars?',
    options: {
      a: 'Defence, Agriculture and Technology',
      b: 'Political and Security; Economic and Financial; Cultural and People-to-People Exchanges',
      c: 'Trade, Environment and Health',
      d: 'Diplomacy, Industry and Education'
    },
    answer: 'b',
    explanation: 'BRICS operates on 3 pillars: Political & Security, Economic & Financial, and Cultural & People-to-People exchanges.'
  },
  {
    id: 'q81',
    qNumber: 81,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BRICS',
    question: 'Which of the following values is NOT part of the BRICS spirit as reaffirmed by the Ministers?',
    options: {
      a: 'Mutual respect and understanding',
      b: 'Equality and solidarity',
      c: 'Openness and inclusiveness',
      d: 'Military alliance'
    },
    answer: 'd',
    explanation: 'BRICS is an economic and political dialogue forum, not a mutual defence or military pact.'
  },
  {
    id: 'q82',
    qNumber: 82,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BRICS',
    question: 'The year 2026 marks which significant milestone in the history of BRICS?',
    options: {
      a: '10th Anniversary',
      b: '15th Anniversary',
      c: '20th Anniversary',
      d: '25th Anniversary'
    },
    answer: 'c',
    explanation: 'First ministerial meeting of BRIC foreign ministers took place in September 2006, marking 20 years in 2026.'
  },
  {
    id: 'q83',
    qNumber: 83,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BRICS',
    question: 'Which of the following statements correctly reflects the BRICS Ministers\' stance on the UN?',
    options: {
      a: 'The UN Charter and the central role of the United Nations remain indispensable.',
      b: 'The United Nations has become irrelevant.',
      c: 'Sovereign states should avoid multilateral cooperation.',
      d: 'International law should be replaced by regional agreements.'
    },
    answer: 'a',
    explanation: 'BRICS declarations continuously emphasize the indispensable centrality of the UN Charter and multilateralism.'
  },
  {
    id: 'q84',
    qNumber: 84,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'BRICS',
    question: 'Which of the following countries was NOT admitted as a new member of BRICS in January 2024?',
    options: {
      a: 'Brazil',
      b: 'Egypt',
      c: 'India',
      d: 'Argentina'
    },
    answer: 'd',
    explanation: 'Argentina declined its invitation under President Javier Milei. Brazil and India were already founding members.'
  },
  // OPEC & IEA
  {
    id: 'q85',
    qNumber: 85,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'The Organization of the Petroleum Exporting Countries (OPEC) is a:',
    options: {
      a: 'Permanent and intergovernmental Organization',
      b: 'Voluntary and Nongovernmental Organization',
      c: 'Non-permanent and intergovernmental Organization',
      d: 'Free association of oil producing countries'
    },
    answer: 'a',
    explanation: 'OPEC is a permanent intergovernmental organization of oil-exporting nations.'
  },
  {
    id: 'q86',
    qNumber: 86,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'The Organization of the Petroleum Exporting Countries (OPEC) was founded in September 1960 in Baghdad by the first five members. Which of the following countries is NOT a founding member of OPEC?',
    options: {
      a: 'Iran',
      b: 'Iraq',
      c: 'Saudi Arabia',
      d: 'Russia'
    },
    answer: 'd',
    explanation: 'The 5 founders were Iran, Iraq, Kuwait, Saudi Arabia, and Venezuela. Russia is an OPEC+ ally, not a founding OPEC member.'
  },
  {
    id: 'q87',
    qNumber: 87,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Although founded in Baghdad, Iraq, in September 1960, the organization moved its headquarters in 1965 to:',
    options: {
      a: 'Geneva',
      b: 'Paris',
      c: 'Riyadh',
      d: 'Vienna'
    },
    answer: 'd',
    explanation: 'OPEC has been headquartered in Vienna, Austria since 1965.'
  },
  {
    id: 'q88',
    qNumber: 88,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following best describes the objective of OPEC?',
    options: {
      a: 'Promote renewable energy',
      b: 'Coordinate petroleum policies of member countries',
      c: 'Regulate global trade tariffs',
      d: 'Control international banking'
    },
    answer: 'b',
    explanation: 'OPEC coordinates and unifies petroleum policies to stabilize global crude oil markets and prices.'
  },
  {
    id: 'q89',
    qNumber: 89,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following countries is NOT a current member of OPEC?',
    options: {
      a: 'Equatorial Guinea',
      b: 'Angola',
      c: 'The Republic of the Congo',
      d: 'Gabon'
    },
    answer: 'b',
    explanation: 'Angola formally withdrew from OPEC effective January 1, 2024.'
  },
  {
    id: 'q90',
    qNumber: 90,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'The OPEC+ agreement was largely formed in 2016 as a response to:',
    options: {
      a: 'Increased global demand for oil',
      b: 'A massive supply glut and declining oil prices',
      c: 'The rise of US shale oil production',
      d: 'Both (b) and (c)'
    },
    answer: 'd',
    explanation: 'OPEC+ was created in 2016 to counter the US shale oil boom and massive global oversupply.'
  },
  {
    id: 'q91',
    qNumber: 91,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'The International Energy Agency operates under the framework of which organization?',
    options: {
      a: 'United Nations',
      b: 'OECD',
      c: 'World Bank',
      d: 'OPEC'
    },
    answer: 'b',
    explanation: 'The IEA was founded in 1974 within the OECD framework following the 1973 oil embargo.'
  },
  {
    id: 'q92',
    qNumber: 92,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following best describes India\'s status in the International Energy Agency?',
    options: {
      a: 'Association country',
      b: 'Founding member',
      c: 'Full member',
      d: 'Observer country'
    },
    answer: 'a',
    explanation: 'India joined the IEA as an Association Country in March 2017.'
  },
  {
    id: 'q93',
    qNumber: 93,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following conditions must be fulfilled by member countries of the International Energy Agency?',
    options: {
      a: 'Maintain nuclear energy reserves',
      b: 'Maintain oil stocks equal to 90 days of net imports',
      c: 'Export surplus oil to member countries',
      d: 'Provide financial contributions to OPEC'
    },
    answer: 'b',
    explanation: 'IEA members are obligated to hold emergency oil reserves equivalent to at least 90 days of net oil imports.'
  },
  {
    id: 'q94',
    qNumber: 94,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following countries is Not a founding members of Organization of the Petroleum Exporting Countries?',
    options: {
      a: 'Iran',
      b: 'Iraq',
      c: 'Kuwait',
      d: 'Russia'
    },
    answer: 'd',
    explanation: 'Russia was not one of the five founding member states in 1960.'
  },
  {
    id: 'q95',
    qNumber: 95,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following countries is considered the de facto leader of Organization of the Petroleum Exporting Countries?',
    options: {
      a: 'Iran',
      b: 'Iraq',
      c: 'Saudi Arabia',
      d: 'Venezuela'
    },
    answer: 'c',
    explanation: 'Saudi Arabia is OPEC\'s largest producer and acts as its swing producer and de facto leader.'
  },
  {
    id: 'q96',
    qNumber: 96,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'OPEC+ refers to:',
    options: {
      a: 'A subgroup of OPEC dealing with renewable energy',
      b: 'An alliance of OPEC and non-OPEC oil-producing countries',
      c: 'A UN-backed energy initiative',
      d: 'A financial institution for oil trade'
    },
    answer: 'b',
    explanation: 'OPEC+ is the broader coalition comprising OPEC members and 10 allied non-OPEC oil producers including Russia.'
  },
  {
    id: 'q97',
    qNumber: 97,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'The Strait of Hormuz connects which two water bodies?',
    options: {
      a: 'Red Sea and Arabian Sea',
      b: 'Mediterranean Sea and Red Sea',
      c: 'Arabian Sea and Bay of Bengal',
      d: 'Persian Gulf and Gulf of Oman'
    },
    answer: 'd',
    explanation: 'The strait links the Persian Gulf with the Gulf of Oman, opening out into the Arabian Sea and Indian Ocean.'
  },
  {
    id: 'q98',
    qNumber: 98,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Why is the Strait of Hormuz considered strategically important?',
    options: {
      a: 'It connects Europe and North America',
      b: 'It is the deepest strait in the world',
      c: 'It provides the only sea route from the Persian Gulf to the open ocean',
      d: 'It is used only for naval operations'
    },
    answer: 'c',
    explanation: 'It is the world\'s most critical oil chokepoint and the only maritime access from the Persian Gulf to open seas.'
  },
  {
    id: 'q99',
    qNumber: 99,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following countries lie on the northern and southern coasts of the Strait of Hormuz?',
    options: {
      a: 'Iran and Oman-UAE',
      b: 'Iraq and Saudi Arabia',
      c: 'Kuwait and Qatar',
      d: 'Pakistan and Iran'
    },
    answer: 'a',
    explanation: 'Iran is situated on the northern coast; Oman (Musandam exclave) and the UAE lie on the southern coast.'
  },
  {
    id: 'q100',
    qNumber: 100,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following statements is Not correct regarding the Strait of Hormuz?',
    options: {
      a: 'Around one-fifth of global oil and gas supplies transit through the Strait of Hormuz.',
      b: 'More than 80% of the oil passing through the strait is destined for European markets.',
      c: 'India depends on the strait for a significant share of its crude oil and natural gas imports.',
      d: 'Both (a) and (c) are correct.'
    },
    answer: 'b',
    explanation: 'Over 80% of the oil transit through Hormuz is destined for Asian economies (India, China, Japan, South Korea), not Europe.'
  },
  {
    id: 'q101',
    qNumber: 101,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following statements is Not correct regarding the Organization of the Petroleum Exporting Countries (OPEC)?',
    options: {
      a: 'It was founded in Baghdad, Iraq, with the signing of an agreement in September 1960 by five countries namely Islamic Republic of Iran, Iraq, Kuwait, Saudi Arabia and Venezuela.',
      b: 'The headquarters of the Organization of the Petroleum Exporting Countries (OPEC) is in Vienna, Austria.',
      c: 'Angola withdrew its membership effective 1 January 2024.',
      d: 'It has a total of 20 Member Countries including Russia.'
    },
    answer: 'd',
    explanation: 'OPEC currently has 12 members. Russia is a non-OPEC partner in OPEC+, not a member of OPEC itself.'
  },
  {
    id: 'q102',
    qNumber: 102,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'OPEC & IEA',
    question: 'Which of the following countries is the world\'s largest oil producer?',
    options: {
      a: 'USA',
      b: 'Russia',
      c: 'Saudi Arabia',
      d: 'Venezuela'
    },
    answer: 'a',
    explanation: 'Driven by shale tight oil production, the United States is the world\'s largest crude oil producer.'
  },
  // Environmental Agreements
  {
    id: 'q103',
    qNumber: 103,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'World Environment Day is observed every year on which date?',
    options: {
      a: 'April 22',
      b: 'May 22',
      c: 'June 5',
      d: 'June 11'
    },
    answer: 'c',
    explanation: 'World Environment Day has been observed annually on June 5 since 1973 by UNEP.'
  },
  {
    id: 'q104',
    qNumber: 104,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'What is the official theme of World Environment Day 2026?',
    options: {
      a: 'Beat Plastic Pollution',
      b: 'Only One Earth',
      c: 'Ecosystem Restoration for All',
      d: 'Inspired by Nature. For Climate. For Our Future.'
    },
    answer: 'd',
    explanation: 'The theme designated for World Environment Day 2026 is "Inspired by Nature. For Climate. For Our Future."'
  },
  {
    id: 'q105',
    qNumber: 105,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'Which of the following countries is the official host country for World Environment Day 2026?',
    options: {
      a: 'Azerbaijan',
      b: 'Brazil',
      c: 'India',
      d: 'Kenya'
    },
    answer: 'a',
    explanation: 'Azerbaijan was selected as the global host for World Environment Day 2026.'
  },
  {
    id: 'q106',
    qNumber: 106,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'India\'s 100th Ramsar Site, Jai Prakash Narayan Bird Sanctuary (Surha Tal), is located in which of the following states of India redacted with [1] in the passage above?',
    context: 'Prime Minister Narendra Modi announced the designation of India\'s 100th Ramsar site - Jai Prakash Narayan Bird Sanctuary (Surha Tal) in Ballia, [1], as a Wetland of International Importance.',
    options: {
      a: 'Bihar',
      b: 'Gujarat',
      c: 'Uttar Pradesh',
      d: 'Haryana'
    },
    answer: 'c',
    explanation: 'Surha Tal (Jai Prakash Narayan Bird Sanctuary) is situated in Ballia district of Uttar Pradesh.'
  },
  {
    id: 'q107',
    qNumber: 107,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'Which of the following statements is Not true?',
    options: {
      a: 'The Ramsar Convention was adopted in 1971 in the city of Ramsar in Iran and came into force in 1975.',
      b: 'February 4 is observed annually as World Wetlands Day to raise awareness about conserving the most critical ecosystems on the planet.',
      c: 'The theme for this year is "Wetlands and traditional knowledge: Celebrating cultural heritage".',
      d: 'It was the first intergovernmental agreement focused exclusively on a specific ecosystem.'
    },
    answer: 'b',
    explanation: 'World Wetlands Day is observed on February 2 (not February 4), marking the signing date in 1971.'
  },
  {
    id: 'q108',
    qNumber: 108,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'Shekha Jheel serves as an important stopover point along which of the following flyways?',
    options: {
      a: 'Central Asian Flyway',
      b: 'East Asian-Australasian Flyway',
      c: 'Pacific Flyway',
      d: 'African-Eurasian Flyway'
    },
    answer: 'a',
    explanation: 'Shekha Jheel in Aligarh lies on the vital Central Asian Flyway used by migratory waterfowl.'
  },
  {
    id: 'q109',
    qNumber: 109,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'The Ramsar Convention was signed in which of the following countries?',
    options: {
      a: 'Iraq',
      b: 'Switzerland',
      c: 'Iran',
      d: 'Italy'
    },
    answer: 'c',
    explanation: 'The convention was signed in Ramsar, an Iranian city on the shores of the Caspian Sea, on February 2, 1971.'
  },
  {
    id: 'q110',
    qNumber: 110,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'World Wetlands Day is observed every year on:',
    options: {
      a: 'January 26',
      b: 'February 2',
      c: 'March 21',
      d: 'April 22'
    },
    answer: 'b',
    explanation: 'World Wetlands Day is commemorated annually on February 2.'
  },
  {
    id: 'q111',
    qNumber: 111,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'What was the theme of World Wetlands Day 2026?',
    options: {
      a: 'Wetlands and Climate Action',
      b: 'Wetlands for Water Security',
      c: 'Wetlands and traditional knowledge: Celebrating cultural heritage',
      d: 'Wetlands and Biodiversity Protection'
    },
    answer: 'c',
    explanation: 'The official Ramsar theme was "Wetlands and traditional knowledge: Celebrating cultural heritage".'
  },
  {
    id: 'q112',
    qNumber: 112,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'As of May 2026, which of the following countries has the highest number of Ramsar Sites in the world?',
    options: {
      a: 'India',
      b: 'Mexico',
      c: 'China',
      d: 'United Kingdom'
    },
    answer: 'd',
    explanation: 'The United Kingdom leads globally with 175 Ramsar sites, followed closely by Mexico.'
  },
  {
    id: 'q113',
    qNumber: 113,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'Which of the following Indian states ranks second in the number of Ramsar Sites?',
    options: {
      a: 'Odisha',
      b: 'Uttar Pradesh',
      c: 'Rajasthan',
      d: 'Gujarat'
    },
    answer: 'b',
    explanation: 'Tamil Nadu holds the most Ramsar sites in India (18), while Uttar Pradesh ranks second.'
  },
  {
    id: 'q114',
    qNumber: 114,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'In which year did India host its first Conference of the Parties (COP) summit under the UNFCCC?',
    options: {
      a: '1997',
      b: '2002',
      c: '2015',
      d: '2012'
    },
    answer: 'b',
    explanation: 'India hosted COP8 in New Delhi in October-November 2002, which adopted the Delhi Ministerial Declaration.'
  },
  {
    id: 'q115',
    qNumber: 115,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'What is the full form of UNFCCC?',
    options: {
      a: 'United Nations Framework Convention on Climate Change',
      b: 'United Nations Forum for Climate Control and Cooperation',
      c: 'United Nations Federal Council for Climate Conservation',
      d: 'United Nations Framework for Carbon Control Committee'
    },
    answer: 'a',
    explanation: 'UNFCCC stands for United Nations Framework Convention on Climate Change, adopted in 1992 at Rio.'
  },
  {
    id: 'q116',
    qNumber: 116,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'With reference to the Kyoto Protocol, which of the following statements is Not true?',
    options: {
      a: 'It was adopted in 1997 and entered into force in 2005.',
      b: 'It legally binds all countries, including developing nations, to reduce emissions.',
      c: 'It operationalizes the United Nations Framework Convention on Climate Change.',
      d: 'The Convention itself only asks those countries to adopt policies and measures on mitigation and report periodically.'
    },
    answer: 'b',
    explanation: 'The Kyoto Protocol applied legally binding emission reduction targets only to developed (Annex I) nations under CBDR.'
  },
  {
    id: 'q117',
    qNumber: 117,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'The first and the latest Conference of the Parties (COP) to the UNFCCC were held in ... and ... respectively.',
    options: {
      a: 'Berlin and Belem',
      b: 'Rome and Belem',
      c: 'Paris and Baku',
      d: 'London and Belem'
    },
    answer: 'a',
    explanation: 'COP1 was held in Berlin (1995) and COP30 in Belém, Brazil in the Amazon basin.'
  },
  {
    id: 'q118',
    qNumber: 118,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'The Tropical Forests Forever Facility (TFFF) launched at COP30, is best described as:',
    options: {
      a: 'A global treaty to ban deforestation',
      b: 'A satellite-based monitoring system only',
      c: 'A payment-for-performance mechanism to reward forest conservation',
      d: 'A carbon trading market for developed countries'
    },
    answer: 'c',
    explanation: 'TFFF provides predictable annual payments to developing tropical nations based on verified standing hectares conserved.'
  },
  {
    id: 'q119',
    qNumber: 119,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'On March 25, 2026, India announced its updated Nationally Determined Contribution (NDC). Which of the following statements is/are correct?',
    options: {
      a: 'India aims to reduce the emissions intensity of its GDP by about 47% by 2035 (from 2005 levels).',
      b: 'India plans to have around 60% of its total electricity capacity from non-fossil fuel sources by 2035.',
      c: 'India aims to create an additional carbon sink of about 3.5 to 4 billion tonnes of CO2 equivalent by 2035.',
      d: 'All of the above'
    },
    answer: 'd',
    explanation: 'All statements accurately describe India\'s heightened 2035 NDC targets submitted under the Paris Agreement.'
  },
  {
    id: 'q120',
    qNumber: 120,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'India\'s original Nationally Determined Contributions (NDCs) were first submitted in:',
    options: {
      a: '2012',
      b: '2015',
      c: '2018',
      d: '2020'
    },
    answer: 'b',
    explanation: 'India submitted its Intended Nationally Determined Contributions (INDCs) in October 2015 ahead of the Paris summit.'
  },
  {
    id: 'q121',
    qNumber: 121,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'India\'s emissions intensity of GDP is targeted to be reduced to what level by 2035?',
    options: {
      a: '47%',
      b: '30%',
      c: '40%',
      d: '60%'
    },
    answer: 'a',
    explanation: 'The revised target aims for a 47% reduction below 2005 levels by 2035.'
  },
  {
    id: 'q122',
    qNumber: 122,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'The share of non-fossil fuel-based energy in India\'s installed capacity is targeted to reach ... by 2035.',
    options: {
      a: '50%',
      b: '55%',
      c: '60%',
      d: '75%'
    },
    answer: 'c',
    explanation: 'India accelerated its cumulative electric power capacity target from non-fossil sources to 60% by 2035.'
  },
  {
    id: 'q123',
    qNumber: 123,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'India aims to create a carbon sink of how much by 2035?',
    options: {
      a: '2-3 billion tonnes CO2 equivalent',
      b: '3.5-4.0 billion tonnes CO2 equivalent',
      c: '4.5-5.0 billion tonnes CO2 equivalent',
      d: '5-6 billion tonnes CO2 equivalent'
    },
    answer: 'b',
    explanation: 'The target expands carbon sequestration to 3.5 to 4.0 billion tonnes of CO2 equivalent through afforestation.'
  },
  {
    id: 'q124',
    qNumber: 124,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'The National Action Plan on Climate Change (NAPCC) is implemented through:',
    options: {
      a: 'Five missions',
      b: 'Seven missions',
      c: 'Twelve missions',
      d: 'Nine missions'
    },
    answer: 'd',
    explanation: 'Originally launched with 8 national missions in 2008, a 9th mission (National Bio-Energy Mission) was added.'
  },
  {
    id: 'q125',
    qNumber: 125,
    category: 'international',
    categoryName: 'International & Summits',
    subtopic: 'Environmental Agreements & Climate Change',
    question: 'Which of the following initiatives promotes lifestyle changes for climate action in India?',
    options: {
      a: 'Make in India',
      b: 'Digital India',
      c: 'LiFE',
      d: 'Skill India'
    },
    answer: 'c',
    explanation: 'Mission LiFE (Lifestyle for Environment) was launched at COP26 to encourage mindful and deliberate utilization.'
  }
];
