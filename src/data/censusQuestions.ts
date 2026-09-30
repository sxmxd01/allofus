import { Question } from '../types/question';

// 50 High-Yield Curated Questions: Census 2027, Caste Enumeration, Delimitation & Historical Milestones
export const CENSUS_QUESTIONS: Question[] = [
  {
    id: "ca_census_1",
    qNumber: 1,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census 2027 & Digital Architecture",
    question: "The upcoming Census of India, expected to be conducted around 2026-2027, will mark which historic technological milestone in Indian census history?",
    options: {
      a: "First census conducted completely via postal voting",
      b: "First ever fully digital census with a mobile app and self-enumeration portal",
      c: "First census conducted without human enumerators using satellite imagery alone",
      d: "First census restricted only to urban metropolitan areas"
    },
    answer: "b",
    explanation: "The upcoming Census will be India's first ever 'Digital Census'. Enumerators will use a dedicated mobile application for data collection, and citizens will also have the option for self-enumeration through an online web portal."
  },
  {
    id: "ca_census_2",
    qNumber: 2,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Administrative & Legal Framework",
    question: "Under which Ministry of the Government of India does the Office of the Registrar General and Census Commissioner of India (ORGI) operate?",
    options: {
      a: "Ministry of Statistics and Programme Implementation (MoSPI)",
      b: "Ministry of Home Affairs (MHA)",
      c: "Ministry of Law and Justice",
      d: "Ministry of Social Justice and Empowerment"
    },
    answer: "b",
    explanation: "The Office of the Registrar General and Census Commissioner of India functions under the Ministry of Home Affairs (MHA), Government of India."
  },
  {
    id: "ca_census_3",
    qNumber: 3,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Constitutional & Legal Provisions",
    question: "Under which Entry of the Union List (List I) in the Seventh Schedule of the Constitution of India is 'Census' placed?",
    options: {
      a: "Entry 45",
      b: "Entry 69",
      c: "Entry 77",
      d: "Entry 82"
    },
    answer: "b",
    explanation: "'Census' is listed under Entry 69 of the Union List (List I) in the Seventh Schedule of the Constitution of India, making it an exclusive Union subject."
  },
  {
    id: "ca_census_4",
    qNumber: 4,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Constitutional & Legal Provisions",
    question: "The statutory basis for conducting the population census in independent India is provided by which Act?",
    options: {
      a: "The Registration of Births and Deaths Act, 1969",
      b: "The Census Act, 1948",
      c: "The Representation of the People Act, 1950",
      d: "The Collection of Statistics Act, 2008"
    },
    answer: "b",
    explanation: "The statutory basis for the census is the Census Act, 1948 (Act No. 37 of 1948), piloted by then Home Minister Sardar Vallabhbhai Patel."
  },
  {
    id: "ca_census_5",
    qNumber: 5,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Confidentiality & Data Protection",
    question: "Under Section 15 of the Census Act, 1948, what is the special legal status granted to individual census answers and records?",
    options: {
      a: "They can be freely accessed through Right to Information (RTI) applications",
      b: "They are confidential and inadmissible as evidence in any civil proceeding or court of law",
      c: "They must be published in the official state gazette within 30 days",
      d: "They can be shared with commercial banks for credit scoring"
    },
    answer: "b",
    explanation: "Section 15 of the Census Act, 1948 mandates that individual records and responses given to census enumerators are strictly confidential and cannot be inspected or used as evidence in any civil, criminal, or revenue court."
  },
  {
    id: "ca_census_6",
    qNumber: 6,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Early Rollout in Snowbound Regions",
    question: "In the standard two-phase structure of the Indian Census, why are high-altitude snowbound regions like Ladakh, parts of Himachal Pradesh, and Uttarakhand surveyed ahead of the plains?",
    options: {
      a: "Because they have constitutional priority under Article 371",
      b: "Because severe winter snowfall and pass closures make them physically inaccessible between October and April",
      c: "Because they follow a completely different calendar system",
      d: "Because they do not require house-listing operations"
    },
    answer: "b",
    explanation: "Snowbound high-altitude districts (including Ladakh, Kinnaur, Lahaul-Spiti, and higher reaches of Uttarakhand) are surveyed during the late summer/early autumn months before heavy winter snowfall cuts off mountain passes and isolates settlements."
  },
  {
    id: "ca_census_7",
    qNumber: 7,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Phases of Census",
    question: "The decennial Census of India is traditionally carried out in which two distinct operational phases?",
    options: {
      a: "Voter Registration followed by Demographic Polling",
      b: "House-listing & Housing Census followed by Population Enumeration",
      c: "Agricultural Survey followed by Urban Infrastructure Mapping",
      d: "Sample Survey followed by Full Audit"
    },
    answer: "b",
    explanation: "Indian census operations are carried out in two distinct phases: Phase 1 is the 'House-listing and Housing Census' (along with updating the NPR), and Phase 2 is the 'Population Enumeration'."
  },
  {
    id: "ca_census_8",
    qNumber: 8,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Caste Enumeration Policy",
    question: "Since independence in 1947, which social groups have been specifically enumerated by caste/tribe in every decennial Indian census?",
    options: {
      a: "Other Backward Classes (OBCs) and General Category",
      b: "Scheduled Castes (SCs) and Scheduled Tribes (STs) only",
      c: "All castes including sub-castes across all religions",
      d: "Economically Weaker Sections (EWS) only"
    },
    answer: "b",
    explanation: "Every decennial census in post-independence India has exclusively enumerated individual castes for Scheduled Castes (SCs) and Scheduled Tribes (STs) under constitutional mandates (Articles 341 and 342), omitting enumeration of other caste groups."
  },
  {
    id: "ca_census_9",
    qNumber: 9,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Historical Milestones",
    question: "Which was the last decennial census in British India that attempted a full enumeration of all castes across the subcontinent?",
    options: {
      a: "1911 Census",
      b: "1921 Census",
      c: "1931 Census",
      d: "1941 Census"
    },
    answer: "c",
    explanation: "The 1931 Census, conducted under Census Commissioner J.H. Hutton, was the last comprehensive caste-based decennial census in India. The 1941 census was heavily curtailed due to World War II."
  },
  {
    id: "ca_census_10",
    qNumber: 10,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Caste Enumeration Policy",
    question: "Which dedicated commission was appointed under Article 340 to examine the sub-categorization of Other Backward Classes (OBCs) within the Central List?",
    options: {
      a: "Kothari Commission",
      b: "Justice G. Rohini Commission",
      c: "Sarkaria Commission",
      d: "Punchhi Commission"
    },
    answer: "b",
    explanation: "The Justice G. Rohini Commission was constituted in October 2017 under Article 340 of the Constitution to examine the sub-categorization of OBCs, submitting its report to the President in July 2023."
  },
  {
    id: "ca_census_11",
    qNumber: 11,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "State Caste Surveys",
    question: "Which Indian state made headlines in October 2023 by releasing the findings of its independent 'Caste-based Survey' (Jati Ganana)?",
    options: {
      a: "Bihar",
      b: "Uttar Pradesh",
      c: "Maharashtra",
      d: "Madhya Pradesh"
    },
    answer: "a",
    explanation: "Bihar was the first Indian state in recent decades to conduct and publish a comprehensive state-level caste survey (Bihar Jati Adharit Ganana), released on October 2, 2023."
  },
  {
    id: "ca_census_12",
    qNumber: 12,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Constitutional Delimitation Freeze",
    question: "Which Constitutional Amendment Act originally froze the total number of seats in the Lok Sabha based on the 1971 census until the first census taken after 2026?",
    options: {
      a: "42nd Amendment Act, 1976 and extended by the 84th Amendment Act, 2001",
      b: "44th Amendment Act, 1978 and extended by the 61st Amendment Act, 1988",
      c: "52nd Amendment Act, 1985 and extended by the 73rd Amendment Act, 1992",
      d: "86th Amendment Act, 2002 and extended by the 91st Amendment Act, 2003"
    },
    answer: "a",
    explanation: "The 42nd Amendment Act of 1976 froze Lok Sabha and State Assembly seat counts until the 2000 census. The 84th Amendment Act of 2001 further extended this freeze until the first census conducted after the year 2026."
  },
  {
    id: "ca_census_13",
    qNumber: 13,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Women's Reservation Linkage",
    question: "Under the Nari Shakti Vandan Adhiniyam (106th Constitutional Amendment Act, 2023), when will the 33% reservation for women in the Lok Sabha and State Legislative Assemblies come into effect?",
    options: {
      a: "Immediately during the 2024 General Elections",
      b: "After a delimitation exercise is conducted based on the relevant figures of the first census published after the commencement of the Act",
      c: "Only if ratified by all 28 state legislative councils",
      d: "On January 26, 2050"
    },
    answer: "b",
    explanation: "Under Article 334A inserted by the 106th Constitutional Amendment Act, 2023, the 33% reservation for women will come into effect after an exercise of delimitation is undertaken based on figures of the first census conducted post-commencement of the Act."
  },
  {
    id: "ca_census_14",
    qNumber: 14,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Historical Census",
    question: "The first non-synchronous census in modern India was initiated in 1872 during the viceroyalty of which Governor-General?",
    options: {
      a: "Lord Canning",
      b: "Lord Mayo",
      c: "Lord Lytton",
      d: "Lord Curzon"
    },
    answer: "b",
    explanation: "The first non-synchronous population count in India was initiated in 1872 under Viceroy Lord Mayo."
  },
  {
    id: "ca_census_15",
    qNumber: 15,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Historical Census",
    question: "The first complete, synchronous, and decennial census covering all of British India was conducted in 1881 under which Viceroy?",
    options: {
      a: "Lord Ripon",
      b: "Lord Dufferin",
      c: "Lord Dalhousie",
      d: "Lord Wellesley"
    },
    answer: "a",
    explanation: "The first synchronous decennial census across India was conducted in 1881 under Viceroy Lord Ripon. W.C. Plowden was the first Census Commissioner of India."
  },
  {
    id: "ca_census_16",
    qNumber: 16,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Demographic History",
    question: "Which decennial census year is celebrated in Indian demography as the 'Year of the Great Divide'?",
    options: {
      a: "1901",
      b: "1911",
      c: "1921",
      d: "1951"
    },
    answer: "c",
    explanation: "The 1921 Census is known as the 'Year of the Great Divide' because it was the only census period (1911-1921) in Indian history where the population recorded a negative growth rate (-0.31%), largely due to the 1918 influenza pandemic and severe famines. After 1921, India entered a phase of sustained population growth."
  },
  {
    id: "ca_census_17",
    qNumber: 17,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Independent India Milestones",
    question: "Who served as the Census Commissioner for the 1951 Census—the first census of Independent India?",
    options: {
      a: "Sukumar Sen",
      b: "R. A. Gopalaswami",
      c: "Asok Mitra",
      d: "P. C. Mahalanobis"
    },
    answer: "b",
    explanation: "R. A. Gopalaswami was the Registrar General and Census Commissioner of India for the 1951 Census. (Sukumar Sen was India's first Chief Election Commissioner who conducted the 1951-52 elections)."
  },
  {
    id: "ca_census_18",
    qNumber: 18,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "2011 Census Review",
    question: "What was the official slogan of the 2011 Census of India (the 15th National Census)?",
    options: {
      a: "Count Every Indian, Empower Every Citizen",
      b: "Our Census, Our Future",
      c: "Digital India, Counted India",
      d: "Sabka Saath, Sabka Vikas"
    },
    answer: "b",
    explanation: "The official slogan of the 2011 Census of India was 'Our Census, Our Future' (हमारा जनगणना, हमारा भविष्य)."
  },
  {
    id: "ca_census_19",
    qNumber: 19,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "2011 Census Review",
    question: "According to the 2011 Census, what was the national sex ratio of India (females per 1,000 males)?",
    options: {
      a: "927",
      b: "933",
      c: "943",
      d: "954"
    },
    answer: "c",
    explanation: "According to the final data of Census 2011, the sex ratio of India was 943 females per 1,000 males (up from 933 in 2001)."
  },
  {
    id: "ca_census_20",
    qNumber: 20,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "2011 Census Review",
    question: "Which Indian state recorded the lowest sex ratio in Census 2011 among all states?",
    options: {
      a: "Punjab",
      b: "Haryana",
      c: "Rajasthan",
      d: "Bihar"
    },
    answer: "b",
    explanation: "Haryana recorded the lowest sex ratio among all states in Census 2011, with 879 females per 1,000 males."
  },
  {
    id: "ca_census_21",
    qNumber: 21,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "2011 Census Review",
    question: "Which Indian state recorded the highest literacy rate in Census 2011?",
    options: {
      a: "Mizoram",
      b: "Goa",
      c: "Kerala",
      d: "Tripura"
    },
    answer: "c",
    explanation: "Kerala recorded the highest literacy rate in Census 2011 at 94.00%, followed closely by Lakshadweep (91.85%) and Mizoram (91.33%)."
  },
  {
    id: "ca_census_22",
    qNumber: 22,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "2011 Census Review",
    question: "Which Indian state was the only state to record a negative decadal population growth rate (-0.58%) during 2001-2011?",
    options: {
      a: "Sikkim",
      b: "Nagaland",
      c: "Goa",
      d: "Manipur"
    },
    answer: "b",
    explanation: "Nagaland was the only Indian state to register a negative population growth rate of -0.58% in the 2001-2011 decadal period."
  },
  {
    id: "ca_census_23",
    qNumber: 23,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "NPR vs Census",
    question: "Under which statutory legislation is the National Population Register (NPR) prepared and maintained, distinguishing it from the Census?",
    options: {
      a: "The Census Act, 1948",
      b: "The Citizenship Act, 1955 and the Citizenship Rules, 2003",
      c: "The Aadhaar Act, 2016",
      d: "The Foreigners Act, 1946"
    },
    answer: "b",
    explanation: "Unlike the Census which is conducted under the Census Act 1948, the National Population Register (NPR) is prepared under the provisions of the Citizenship Act, 1955 and the Citizenship (Registration of Citizens and Issue of National Identity Cards) Rules, 2003."
  },
  {
    id: "ca_census_24",
    qNumber: 24,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "NPR Definition",
    question: "For the purpose of the National Population Register (NPR), a 'usual resident' is defined as a person who has resided in a local area for at least how many months, or intends to reside there for that duration?",
    options: {
      a: "3 months",
      b: "6 months",
      c: "12 months",
      d: "5 years"
    },
    answer: "b",
    explanation: "For NPR purposes, a 'usual resident' is defined as a person who has resided in a local area for the past 6 months or more, or a person who intends to reside in that area for the next 6 months or more."
  },
  {
    id: "ca_census_25",
    qNumber: 25,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Delimitation Commission",
    question: "Under which Article of the Constitution of India does Parliament enact a Delimitation Act after every census?",
    options: {
      a: "Article 72",
      b: "Article 82",
      c: "Article 110",
      d: "Article 324"
    },
    answer: "b",
    explanation: "Article 82 of the Constitution provides for the readjustment of allocation of seats in the Lok Sabha and division of states into territorial constituencies after each census by such authority and in such manner as Parliament may by law determine."
  },
  {
    id: "ca_census_26",
    qNumber: 26,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Delimitation Commission Orders",
    question: "What is the legal constitutional standing of the orders issued by a Delimitation Commission in India?",
    options: {
      a: "They are advisory and must be approved by the Supreme Court of India",
      b: "They have the force of law and cannot be called into question before any court of law",
      c: "They expire automatically after two years unless renewed by Parliament",
      d: "They can be modified by the Governor of each state"
    },
    answer: "b",
    explanation: "Under Article 329(a) and the Delimitation Act, the orders of the Delimitation Commission, once published in the Gazette of India, have the force of law and cannot be called in question before any court."
  },
  {
    id: "ca_census_27",
    qNumber: 27,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Delimitation History",
    question: "How many times have Delimitation Commissions been constituted in India so far?",
    options: {
      a: "Two times (1952, 2002)",
      b: "Four times (1952, 1962, 1972, and 2002)",
      c: "Seven times after every census",
      d: "Only once in 1976"
    },
    answer: "b",
    explanation: "Delimitation Commissions have been set up four times in India's history: in 1952 (under 1952 Act), 1963 (under 1962 Act), 1973 (under 1972 Act), and 2002 (under 2002 Act, chaired by Justice Kuldip Singh)."
  },
  {
    id: "ca_census_28",
    qNumber: 28,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "First General Elections",
    question: "India's first General Elections were held between October 1951 and February 1952. Who was India's first Chief Election Commissioner who oversaw this historic exercise?",
    options: {
      a: "K.V.K. Sundaram",
      b: "Sukumar Sen",
      c: "S.P. Sen Verma",
      d: "T.N. Seshan"
    },
    answer: "b",
    explanation: "Sukumar Sen, an Indian Civil Service officer, was India's first Chief Election Commissioner (1950 to 1958) who successfully orchestrated the first two general elections (1951-52 and 1957)."
  },
  {
    id: "ca_census_29",
    qNumber: 29,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "First General Elections",
    question: "Who was famously recognized as independent India's first registered voter, casting his ballot in Kinnaur, Himachal Pradesh in October 1951?",
    options: {
      a: "Shyam Saran Negi",
      b: "Kailash Satyarthi",
      c: "Baba Amte",
      d: "Verghese Kurien"
    },
    answer: "a",
    explanation: "Shyam Saran Negi (1917-2022) of Kalpa, Kinnaur (Himachal Pradesh) was independent India's first voter. Polling in Kinnaur was held early in October 1951 due to anticipated winter snow before the rest of the country voted in early 1952."
  },
  {
    id: "ca_census_30",
    qNumber: 30,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "SECC 2011",
    question: "What does the abbreviation 'SECC 2011' stand for, which was conducted separately from the decennial census?",
    options: {
      a: "Special Economic Census Commission",
      b: "Socio-Economic and Caste Census 2011",
      c: "State-level Employment and Credit Census",
      d: "Secondary Education and Curriculum Council"
    },
    answer: "b",
    explanation: "SECC stands for 'Socio-Economic and Caste Census 2011'. It was conducted to identify beneficiaries for targeted social welfare schemes based on deprivation criteria."
  },
  {
    id: "ca_census_31",
    qNumber: 31,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "SECC vs Census",
    question: "Which was a major administrative difference between the decennial Census 2011 and the SECC 2011?",
    options: {
      a: "Census data is legally confidential under the Census Act 1948, whereas SECC data was open for verification and beneficiary identification",
      b: "SECC was conducted exclusively by the Indian Army",
      c: "Census only counted urban citizens while SECC counted only rural citizens",
      d: "SECC was conducted under the direct supervision of the United Nations"
    },
    answer: "a",
    explanation: "While Census data is bound by strict statutory non-disclosure under Section 15 of the Census Act 1948, SECC 2011 was conducted without the Census Act to allow open verification by Gram Sabhas and use by government ministries for beneficiary targeting."
  },
  {
    id: "ca_census_32",
    qNumber: 32,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census 2027 Technology",
    question: "What major provision has been introduced in the upcoming Census to allow citizens to submit their household data directly without waiting for an enumerator?",
    options: {
      a: "Automated phone robocalls",
      b: "Self-enumeration online web portal",
      c: "Newspaper cutout coupons",
      d: "Social media direct messaging"
    },
    answer: "b",
    explanation: "The upcoming digital census features a self-enumeration online portal where residents can log in, authenticate with their mobile numbers, fill out the census form, and receive a reference code to share with the visiting enumerator."
  },
  {
    id: "ca_census_33",
    qNumber: 33,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Urban Agglomerations",
    question: "In Indian Census terminology, what is a settlement defined as having a minimum population of 5,000, at least 75% of male working population engaged in non-agricultural pursuits, and a density of at least 400 persons per sq. km called?",
    options: {
      a: "Statutory Town",
      b: "Census Town",
      c: "Outgrowth",
      d: "Revenue Village"
    },
    answer: "b",
    explanation: "A 'Census Town' is an area that is not statutorily notified as a town by a state municipality or cantonment board, but fulfills three demographic criteria: population ≥ 5,000; ≥75% of male main workers in non-agriculture; and density ≥ 400 per sq. km."
  },
  {
    id: "ca_census_34",
    qNumber: 34,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Literacy Definition",
    question: "According to the official Census definition in India, who is classified as a 'literate' person?",
    options: {
      a: "Anyone who has completed at least Class 10 (Matriculation)",
      b: "A person aged 7 years and above who can both read and write with understanding in any language",
      c: "Any adult who can sign their name on legal documents",
      d: "Anyone who can read basic English or Hindi"
    },
    answer: "b",
    explanation: "In the Indian Census, a person aged 7 and above who can both read and write with understanding in any language is treated as literate. A person who can merely read but cannot write is not classified as literate."
  },
  {
    id: "ca_census_35",
    qNumber: 35,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Child Sex Ratio",
    question: "What age cohort is specifically examined in the Census to calculate the 'Child Sex Ratio' (CSR)?",
    options: {
      a: "0 to 1 year",
      b: "0 to 6 years",
      c: "0 to 14 years",
      d: "5 to 18 years"
    },
    answer: "b",
    explanation: "The Child Sex Ratio (CSR) in the Indian Census evaluates the number of females per 1,000 males in the age group of 0-6 years."
  },
  {
    id: "ca_census_36",
    qNumber: 36,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "2011 CSR Trends",
    question: "What was India's Child Sex Ratio (0-6 years) in the 2011 Census, which triggered national policy initiatives like Beti Bachao Beti Padhao?",
    options: {
      a: "943",
      b: "927",
      c: "918",
      d: "896"
    },
    answer: "c",
    explanation: "India's Child Sex Ratio dropped to an alarming 918 girls per 1,000 boys in Census 2011 (down from 927 in 2001 and 945 in 1991), prompting major government interventions."
  },
  {
    id: "ca_census_37",
    qNumber: 37,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Constitutional Articles on Delimitation",
    question: "Article 170(3) of the Constitution of India deals with the readjustment of constituencies for which legislative body after each census?",
    options: {
      a: "Rajya Sabha",
      b: "State Legislative Assemblies (Vidhan Sabhas)",
      c: "Zilla Parishads",
      d: "Municipal Corporations"
    },
    answer: "b",
    explanation: "While Article 82 governs the readjustment of Lok Sabha constituencies, Article 170(3) provides for the readjustment of territorial constituencies in State Legislative Assemblies."
  },
  {
    id: "ca_census_38",
    qNumber: 38,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "North-South Demographic Debate",
    question: "Why has the upcoming delimitation exercise based on the post-2026 census sparked major federal discussions between southern and northern Indian states?",
    options: {
      a: "Southern states implemented family planning effectively and fear losing parliamentary representation to northern states with higher population growth",
      b: "Northern states pay more GST than southern states",
      c: "Southern states do not have any Scheduled Caste reservation",
      d: "Northern states want to adopt a multi-member constituency system"
    },
    answer: "a",
    explanation: "Southern states (such as Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, and Telangana) stabilized their fertility rates decades ago. Delimiting Lok Sabha seats strictly on raw population would increase the seat share of high-fertility northern states while penalizing southern states."
  },
  {
    id: "ca_census_39",
    qNumber: 39,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "87th Amendment Act",
    question: "The 87th Constitutional Amendment Act of 2003 permitted the Delimitation Commission to adjust constituency boundaries within states on the basis of which census figures (without altering total state seat totals)?",
    options: {
      a: "1971 Census",
      b: "1981 Census",
      c: "1991 Census",
      d: "2001 Census"
    },
    answer: "d",
    explanation: "The 87th Amendment Act, 2003 amended the 84th Amendment to allow the Delimitation Commission to redraw the boundaries of assembly and parliamentary constituencies within each state based on the 2001 Census population, while keeping the total number of seats allocated to each state unchanged."
  },
  {
    id: "ca_census_40",
    qNumber: 40,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "J&K Delimitation 2022",
    question: "Under whose chairpersonship was the Delimitation Commission for the Union Territory of Jammu and Kashmir constituted in 2020, issuing its final order in May 2022?",
    options: {
      a: "Justice Ranjana Prakash Desai",
      b: "Justice Ruma Pal",
      c: "Justice Gyan Sudha Misra",
      d: "Justice B.S. Chauhan"
    },
    answer: "a",
    explanation: "The J&K Delimitation Commission was chaired by retired Supreme Court judge Justice Ranjana Prakash Desai, recommending 90 assembly constituencies (43 for Jammu, 47 for Kashmir)."
  },
  {
    id: "ca_census_41",
    qNumber: 41,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Decadal Census Cadence",
    question: "Prior to the postponement of the 2021 Census due to the global COVID-19 pandemic, how long had India maintained an uninterrupted decennial census cadence?",
    options: {
      a: "Since 1951 (70 years)",
      b: "Since 1881 (140 years)",
      c: "Since 1921 (100 years)",
      d: "Since 1971 (50 years)"
    },
    answer: "b",
    explanation: "India conducted an uninterrupted decennial census every 10 years without a single break from 1881 through 2011—a continuous 140-year streak that even survived World Wars I and II and Partition."
  },
  {
    id: "ca_census_42",
    qNumber: 42,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Language Enumeration",
    question: "Under Census methodology, how are mother tongues and languages classified if they are not included in the Eighth Schedule of the Constitution?",
    options: {
      a: "They are completely discarded and deleted from records",
      b: "They are grouped under 'Non-Scheduled Languages' if spoken by 10,000 or more people at the national level",
      c: "They are automatically classified as regional dialects of Sanskrit",
      d: "They are merged into Hindi automatically"
    },
    answer: "b",
    explanation: "Mother tongues spoken by 10,000 or more speakers at the all-India level that are not listed in the Eighth Schedule are classified and published as 'Non-Scheduled Languages' (such as Bhili, Gondi, Garo, Khasi, etc.)."
  },
  {
    id: "ca_census_43",
    qNumber: 43,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "First General Election Mechanics",
    question: "During India's first General Elections in 1951-52, how was secret voting maintained by illiterate voters before symbols were introduced on a single paper ballot?",
    options: {
      a: "Each candidate had a separate, colored ballot box marked with their allotted election symbol",
      b: "Thumb impressions were scanned through electronic sensors",
      c: "Voters whispered their choice to the presiding officer",
      d: "Voters dropped colored stones into clay pots"
    },
    answer: "a",
    explanation: "In the 1951-52 elections, the 'balloting system' was used: inside the voting booth, there was a separate ballot box for each candidate bearing that candidate's election symbol. The voter simply dropped a blank ballot paper into the box of their chosen candidate."
  },
  {
    id: "ca_census_44",
    qNumber: 44,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "First General Elections Multi-member Constituencies",
    question: "In the 1st Lok Sabha (1952), how were reserved seats for Scheduled Castes and Scheduled Tribes originally accommodated?",
    options: {
      a: "Through separate communal electorates",
      b: "Through double-member (and one three-member) constituencies where voters elected two representatives",
      c: "By presidential nomination only",
      d: "By rotating constituencies annually"
    },
    answer: "b",
    explanation: "In the 1952 and 1957 elections, many constituencies were two-member constituencies (one general and one SC/ST member), alongside one three-member constituency (North Bengal). Double-member constituencies were abolished in 1961."
  },
  {
    id: "ca_census_45",
    qNumber: 45,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Constitutional Articles",
    question: "Which Article of the Constitution guarantees Universal Adult Suffrage, entitling every citizen of India aged 18 and above to vote without discrimination?",
    options: {
      a: "Article 324",
      b: "Article 325",
      c: "Article 326",
      d: "Article 328"
    },
    answer: "c",
    explanation: "Article 326 of the Constitution of India provides for universal adult suffrage for elections to the House of the People (Lok Sabha) and the Legislative Assemblies of States."
  },
  {
    id: "ca_census_46",
    qNumber: 46,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Voting Age Reform",
    question: "Which Constitutional Amendment Act reduced the voting age in India from 21 years to 18 years in 1988?",
    options: {
      a: "44th Amendment Act",
      b: "52nd Amendment Act",
      c: "61st Amendment Act",
      d: "73rd Amendment Act"
    },
    answer: "c",
    explanation: "The 61st Constitutional Amendment Act, 1988 (which came into force in March 1989 under Prime Minister Rajiv Gandhi) lowered the voting age from 21 to 18 years by amending Article 326."
  },
  {
    id: "ca_census_47",
    qNumber: 47,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census Functionary Penalties",
    question: "Under the Census Act, 1948, what is the legal obligation of citizens regarding answering questions posed by an authorized census officer?",
    options: {
      a: "Answering is purely voluntary with no legal consequence",
      b: "Every person is legally bound to answer census questions truthfully to the best of their knowledge and belief",
      c: "Only property owners are legally required to respond",
      d: "Responses are optional if the resident holds a valid passport"
    },
    answer: "b",
    explanation: "Under Section 10 and Section 11 of the Census Act, 1948, residents are legally bound to answer questions asked by census officers truthfully. Refusal or intentionally giving false answers is a punishable offence."
  },
  {
    id: "ca_census_48",
    qNumber: 48,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Mascot & Symbols",
    question: "What was the official mascot used during Census 2011 to raise public awareness and celebrate field workers?",
    options: {
      a: "An elephant named Appu",
      b: "A female enumerator holding a kit and census tablet/register",
      c: "A tiger named Shera",
      d: "A peacock named Mayur"
    },
    answer: "b",
    explanation: "The official mascot of Census 2011 was a female enumerator (wearing a green and orange sari, holding a census folder and kit), highlighting the frontline role of India's Anganwadi workers and primary school teachers."
  },
  {
    id: "ca_census_49",
    qNumber: 49,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Aadhaar and Census 2027",
    question: "In the proposed digital architecture of Census 2027, how will Aadhaar numbers be treated for enumerated individuals?",
    options: {
      a: "Aadhaar will be strictly mandatory; individuals without Aadhaar will not be counted",
      b: "Providing Aadhaar will be purely voluntary to facilitate family linkage, without making it a prerequisite for enumeration",
      c: "Aadhaar numbers will replace names entirely",
      d: "Aadhaar card biometrics will be captured directly on the spot by enumerators"
    },
    answer: "b",
    explanation: "The Ministry of Home Affairs has affirmed that providing Aadhaar in the Census is voluntary. No citizen can be excluded or denied enumeration for not having or not providing an Aadhaar number."
  },
  {
    id: "ca_census_50",
    qNumber: 50,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Global Demographics",
    question: "According to United Nations Population Division estimates released in April 2023, India surpassed which country to become the most populous nation on Earth?",
    options: {
      a: "United States",
      b: "China",
      c: "Indonesia",
      d: "Russia"
    },
    answer: "b",
    explanation: "In April 2023, UN demographic estimates confirmed that India had officially overtaken China to become the world's most populous nation, with an estimated population exceeding 1.428 billion."
  },
  {
    id: "ca_census_51",
    qNumber: 51,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Demographic Metrics (TFR)",
    question: "According to the National Family Health Survey-5 (NFHS-5, 2019-21), India's Total Fertility Rate (TFR) fell to what level, dropping below the replacement level of fertility (2.1)?",
    options: {
      a: "2.0 children per woman",
      b: "2.3 children per woman",
      c: "1.6 children per woman",
      d: "2.5 children per woman"
    },
    answer: "a",
    explanation: "NFHS-5 reported that India's Total Fertility Rate (TFR) has declined to 2.0 children per woman, falling below the replacement level of 2.1, indicating that India's population will stabilize and eventually decline in the coming decades."
  },
  {
    id: "ca_census_52",
    qNumber: 52,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Registrar General Leadership",
    question: "Who currently serves as the Registrar General and Census Commissioner of India (RG&CCI) overseeing preparations for the upcoming digital census?",
    options: {
      a: "Mritunjay Kumar Narayan",
      b: "Dr. Vivek Joshi",
      c: "Sailesh",
      d: "C. Chandramouli"
    },
    answer: "a",
    explanation: "Senior IAS officer Mritunjay Kumar Narayan was appointed as the Registrar General and Census Commissioner of India in late 2022, steering the modernization and IT roadmap for Census 2027."
  },
  {
    id: "ca_census_53",
    qNumber: 53,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "2011 Decadal Growth",
    question: "What was India's decadal population growth rate during the decade 2001-2011 according to the 2011 Census?",
    options: {
      a: "21.54%",
      b: "17.70%",
      c: "13.25%",
      d: "24.80%"
    },
    answer: "b",
    explanation: "India's decadal growth rate between 2001 and 2011 was 17.70% (a sharp decline from the 21.54% recorded between 1991 and 2001)."
  },
  {
    id: "ca_census_54",
    qNumber: 54,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Population Density",
    question: "Which Indian state had the highest population density according to Census 2011, with 1,106 persons per square kilometre?",
    options: {
      a: "West Bengal",
      b: "Bihar",
      c: "Uttar Pradesh",
      d: "Kerala"
    },
    answer: "b",
    explanation: "Bihar had the highest population density among all Indian states in Census 2011 at 1,106 persons per sq. km, overtaking West Bengal (1,028 persons per sq. km)."
  },
  {
    id: "ca_census_55",
    qNumber: 55,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Population Density",
    question: "Which Indian state has the lowest population density in India according to Census 2011, with just 17 persons per square kilometre?",
    options: {
      a: "Mizoram",
      b: "Sikkim",
      c: "Arunachal Pradesh",
      d: "Himachal Pradesh"
    },
    answer: "c",
    explanation: "Arunachal Pradesh has the lowest population density in India, with only 17 persons per square kilometre as per Census 2011."
  },
  {
    id: "ca_census_56",
    qNumber: 56,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Urban-Rural Distribution",
    question: "According to Census 2011, what percentage of India's population lived in rural areas?",
    options: {
      a: "50.50%",
      b: "68.84%",
      c: "75.20%",
      d: "82.10%"
    },
    answer: "b",
    explanation: "According to Census 2011, 68.84% of India's population (833.5 million) lived in rural areas, while 31.16% (377.1 million) resided in urban areas."
  },
  {
    id: "ca_census_57",
    qNumber: 57,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Urbanization Metrics",
    question: "Which Indian state is the most urbanized state by percentage of urban population according to Census 2011?",
    options: {
      a: "Maharashtra",
      b: "Tamil Nadu",
      c: "Goa",
      d: "Gujarat"
    },
    answer: "c",
    explanation: "Goa is the most urbanized state in India with 62.17% of its total population living in urban areas, followed by Mizoram (52.11%) and Tamil Nadu (48.40%)."
  },
  {
    id: "ca_census_58",
    qNumber: 58,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Scheduled Castes Demographics",
    question: "According to Census 2011, what percentage of India's total population is comprised of Scheduled Castes (SCs)?",
    options: {
      a: "12.4%",
      b: "16.6%",
      c: "22.5%",
      d: "8.6%"
    },
    answer: "b",
    explanation: "Scheduled Castes (SCs) constitute 16.6% of India's total population (approximately 201.4 million persons) as per Census 2011."
  },
  {
    id: "ca_census_59",
    qNumber: 59,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Scheduled Tribes Demographics",
    question: "What proportion of India's total population belongs to Scheduled Tribes (STs) according to Census 2011?",
    options: {
      a: "5.5%",
      b: "8.6%",
      c: "12.2%",
      d: "15.0%"
    },
    answer: "b",
    explanation: "Scheduled Tribes (STs) account for 8.6% of India's total population (around 104.3 million persons) according to Census 2011."
  },
  {
    id: "ca_census_60",
    qNumber: 60,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "States with No SCs",
    question: "Which of the following Indian states has NO notified Scheduled Caste (SC) population as per presidential orders and Census 2011?",
    options: {
      a: "Nagaland and Mizoram",
      b: "Punjab and Haryana",
      c: "Odisha and Jharkhand",
      d: "Kerala and Karnataka"
    },
    answer: "a",
    explanation: "Nagaland and Mizoram (along with the Union Territories of Lakshadweep and Andaman & Nicobar Islands) have no notified Scheduled Caste communities under the Constitution (Scheduled Castes) Order."
  },
  {
    id: "ca_census_61",
    qNumber: 61,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "States with No STs",
    question: "In which pair of Indian states is there NO notified Scheduled Tribe (ST) population according to the official ST order?",
    options: {
      a: "Punjab and Haryana",
      b: "Madhya Pradesh and Chhattisgarh",
      c: "Rajasthan and Gujarat",
      d: "Assam and Meghalaya"
    },
    answer: "a",
    explanation: "Punjab and Haryana (along with the Union Territories of Chandigarh, Delhi, and Puducherry) have no notified Scheduled Tribe communities."
  },
  {
    id: "ca_census_62",
    qNumber: 62,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Highest SC Proportion",
    question: "Which Indian state has the highest percentage of Scheduled Caste population relative to its total state population (31.9%)?",
    options: {
      a: "Uttar Pradesh",
      b: "Punjab",
      c: "West Bengal",
      d: "Bihar"
    },
    answer: "b",
    explanation: "Punjab has the highest proportion of Scheduled Caste population at 31.9% of its total population. (In absolute numbers, Uttar Pradesh has the largest SC population)."
  },
  {
    id: "ca_census_63",
    qNumber: 63,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Highest ST Population",
    question: "Which Indian state has the largest absolute number of Scheduled Tribe individuals in the country according to Census 2011?",
    options: {
      a: "Madhya Pradesh",
      b: "Maharashtra",
      c: "Odisha",
      d: "Jharkhand"
    },
    answer: "a",
    explanation: "Madhya Pradesh has the largest absolute ST population in India (15.31 million, representing 14.7% of the total ST population of India)."
  },
  {
    id: "ca_census_64",
    qNumber: 64,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Working Age Cohort",
    question: "In demographic analysis and Census classification, what age bracket defines the 'Working Age Population' in India?",
    options: {
      a: "15 to 59 years",
      b: "18 to 65 years",
      c: "21 to 60 years",
      d: "14 to 50 years"
    },
    answer: "a",
    explanation: "The Indian Census and the Central Statistics Office define the working-age population as individuals between 15 and 59 years of age. Those below 15 and 60+ constitute the dependent population."
  },
  {
    id: "ca_census_65",
    qNumber: 65,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Delimitation Commission Composition",
    question: "Who serves as the Chairperson of a Delimitation Commission appointed under the Delimitation Act?",
    options: {
      a: "A retired or serving Judge of the Supreme Court of India",
      b: "The Chief Election Commissioner of India ex-officio",
      c: "The Speaker of the Lok Sabha",
      d: "The Union Minister of Law and Justice"
    },
    answer: "a",
    explanation: "The Delimitation Commission is chaired by a retired or serving Judge of the Supreme Court, with the Chief Election Commissioner (or an Election Commissioner nominated by CEC) and the respective State Election Commissioner serving as ex-officio members."
  },
  {
    id: "ca_census_66",
    qNumber: 66,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Delimitation Associate Members",
    question: "What role do Members of Parliament and Legislative Assembly members play on a Delimitation Commission when redrawing constituencies?",
    options: {
      a: "They have full voting powers on every boundary decision",
      b: "They act as Associate Members to advise and assist, but have no right to vote or sign the final orders",
      c: "They can veto any order of the Chairperson",
      d: "They are legally barred from attending meetings"
    },
    answer: "b",
    explanation: "Under the Delimitation Act, five Lok Sabha MPs and five state MLAs are nominated as 'Associate Members' from each state to assist the commission, but they have no voting rights and cannot sign final determinations."
  },
  {
    id: "ca_census_67",
    qNumber: 67,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Constitutional Articles for Reservation",
    question: "Which Article of the Constitution of India provides for the reservation of seats for Scheduled Castes and Scheduled Tribes in the Lok Sabha based on their population proportion?",
    options: {
      a: "Article 330",
      b: "Article 332",
      c: "Article 334",
      d: "Article 338"
    },
    answer: "a",
    explanation: "Article 330 of the Constitution provides for reservation of seats for Scheduled Castes and Scheduled Tribes in the Lok Sabha in proportion to their population in each State."
  },
  {
    id: "ca_census_68",
    qNumber: 68,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Constitutional Articles for Reservation",
    question: "Which Article of the Constitution provides for SC and ST seat reservations in State Legislative Assemblies (Vidhan Sabhas)?",
    options: {
      a: "Article 330",
      b: "Article 332",
      c: "Article 335",
      d: "Article 340"
    },
    answer: "b",
    explanation: "Article 332 of the Constitution provides for the reservation of seats for Scheduled Castes and Scheduled Tribes in the Legislative Assemblies of the States."
  },
  {
    id: "ca_census_69",
    qNumber: 69,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "104th Amendment Act",
    question: "The 104th Constitutional Amendment Act, 2019 extended political reservations for SCs and STs in the Lok Sabha and State Assemblies until 2030, but discontinued which reservation?",
    options: {
      a: "Reservation for Women in local panchayats",
      b: "Nomination of Anglo-Indian members to the Lok Sabha and State Legislative Assemblies",
      c: "Reservation for Ex-Servicemen",
      d: "Reservation for Economically Weaker Sections"
    },
    answer: "b",
    explanation: "The 104th Amendment Act extended the reservation of seats for SCs and STs for another ten years (up to January 25, 2030) under Article 334, while discontinuing the provision for nominating Anglo-Indians to the Lok Sabha and state assemblies."
  },
  {
    id: "ca_census_70",
    qNumber: 70,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Sample Registration System (SRS)",
    question: "Between decennial censuses, which institutional mechanism operated by the ORGI provides annual estimates of Birth Rate, Death Rate, and Infant Mortality Rate (IMR)?",
    options: {
      a: "Sample Registration System (SRS)",
      b: "Periodic Labour Force Survey (PLFS)",
      c: "Annual Survey of Industries (ASI)",
      d: "Consumer Price Index (CPI) Survey"
    },
    answer: "a",
    explanation: "The Sample Registration System (SRS), run by the Office of the Registrar General of India since 1964-65, is a dual-record system providing reliable annual demographic estimates of fertility and mortality rates."
  },
  {
    id: "ca_census_71",
    qNumber: 71,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "District Extremes",
    question: "Which district in India had the smallest population in Census 2011, with just 8,004 residents?",
    options: {
      a: "Dibang Valley (Arunachal Pradesh)",
      b: "Lahaul and Spiti (Himachal Pradesh)",
      c: "Yanam (Puducherry)",
      d: "North Sikkim (Sikkim)"
    },
    answer: "a",
    explanation: "Dibang Valley in Arunachal Pradesh was the least populous district in India in Census 2011, with a recorded population of only 8,004 people."
  },
  {
    id: "ca_census_72",
    qNumber: 72,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Mandal Commission Basis",
    question: "When the Mandal Commission submitted its landmark report in 1980 estimating the OBC population at roughly 52%, which historical census data did it extrapolate from in the absence of contemporary caste figures?",
    options: {
      a: "1911 Census",
      b: "1921 Census",
      c: "1931 Census",
      d: "1951 Census"
    },
    answer: "c",
    explanation: "Because independent India ceased decennial caste enumeration after 1931, the B.P. Mandal Commission used the 1931 Census figures as the benchmark baseline to estimate backward class demographics."
  },
  {
    id: "ca_census_73",
    qNumber: 73,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Statutory Census Notification",
    question: "Under Section 3 of the Census Act, 1948, who is legally empowered to issue the official notification declaring the intention to take a census of India?",
    options: {
      a: "The Central Government by notification in the Official Gazette",
      b: "The Election Commission of India",
      c: "The Supreme Court of India",
      d: "The Planning Commission"
    },
    answer: "a",
    explanation: "Section 3 of the Census Act, 1948 states: 'The Central Government may, by notification in the Official Gazette, declare its intention of taking a census in the whole or any part of the territories to which this Act extends.'"
  },
  {
    id: "ca_census_74",
    qNumber: 74,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Constitutional Basis for 1976 Delimitation Freeze",
    question: "What was the stated rationale of the Indira Gandhi government in 1976 for enacting the 42nd Amendment to freeze parliamentary delimitation until 2000?",
    options: {
      a: "To ensure that states aggressively implementing national family planning programmes were not penalized with reduced political representation",
      b: "A shortage of paper for voter identity cards",
      c: "To prepare for electronic voting machines",
      d: "A temporary dispute with the Supreme Court"
    },
    answer: "a",
    explanation: "The freeze on Lok Sabha and Assembly seats in 1976 was introduced so that progressive states that actively curbed population growth through family planning were not disadvantaged by losing legislative representation relative to states with unchecked population growth."
  },
  {
    id: "ca_census_75",
    qNumber: 75,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Global Demographics",
    question: "What major global population milestone was officially marked by the United Nations on November 15, 2022?",
    options: {
      a: "The global human population reached 8 billion people",
      b: "The global population reached 10 billion people",
      c: "Urban population exceeded rural population for the first time",
      d: "World fertility dropped to zero"
    },
    answer: "a",
    explanation: "On November 15, 2022, the United Nations officially recognized the 'Day of Eight Billion', designating a symbolic baby born in Manila as the eight-billionth person on Earth."
  },
  {
    id: "ca_census_76",
    qNumber: 76,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Gender Literacy Gap",
    question: "According to Census 2011, what were the national male and female literacy rates respectively, reflecting a gender literacy gap of 16.3 percentage points?",
    options: {
      a: "Male: 80.89%, Female: 64.64%",
      b: "Male: 75.26%, Female: 53.67%",
      c: "Male: 85.00%, Female: 72.00%",
      d: "Male: 70.00%, Female: 60.00%"
    },
    answer: "a",
    explanation: "In Census 2011, the male literacy rate was 80.89% while the female literacy rate stood at 64.64%, with a persisting gender gap of 16.25 percentage points."
  },
  {
    id: "ca_census_77",
    qNumber: 77,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Lowest Female Literacy",
    question: "Which Indian state recorded the lowest female literacy rate (52.12%) in Census 2011?",
    options: {
      a: "Rajasthan",
      b: "Bihar",
      c: "Jharkhand",
      d: "Uttar Pradesh"
    },
    answer: "a",
    explanation: "Rajasthan recorded the lowest female literacy rate among all states in Census 2011 at 52.12%, followed by Bihar at 51.50% (overall Bihar had the lowest total literacy rate of 61.80%)."
  },
  {
    id: "ca_census_78",
    qNumber: 78,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Economic Activity Definitions",
    question: "In Census terminology, a person who had worked for at least 6 months (183 days) or more during the preceding year is classified as:",
    options: {
      a: "Main Worker",
      b: "Marginal Worker",
      c: "Non-Worker",
      d: "Salaried Professional"
    },
    answer: "a",
    explanation: "A 'Main Worker' is defined in the Census of India as an individual who participated in any economically productive work for 183 days (6 months) or more during the reference year. Those working less than 183 days are 'Marginal Workers'."
  },
  {
    id: "ca_census_79",
    qNumber: 79,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Four Categories of Workers",
    question: "The Census of India classifies all working individuals into four broad occupational categories: Cultivators, Agricultural Labourers, Household Industry Workers, and:",
    options: {
      a: "Other Workers",
      b: "Industrial Magnates",
      c: "Government Servants",
      d: "Self-Employed Entrepreneurs"
    },
    answer: "a",
    explanation: "The four standard Census worker categories are: 1. Cultivators (CL), 2. Agricultural Labourers (AL), 3. Household Industry Workers (HHI), and 4. Other Workers (OW), which encompasses all factory, services, transport, and office workers."
  },
  {
    id: "ca_census_80",
    qNumber: 80,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Agricultural Workforce",
    question: "What percentage of India's total workforce was directly engaged in agriculture (Cultivators + Agricultural Labourers) according to Census 2011?",
    options: {
      a: "54.6%",
      b: "65.8%",
      c: "42.1%",
      d: "72.4%"
    },
    answer: "a",
    explanation: "According to Census 2011, out of 481.9 million total workers, 54.6% were engaged in the agricultural sector (24.6% Cultivators and 30.0% Agricultural Labourers), down from 58.2% in 2001."
  },
  {
    id: "ca_census_81",
    qNumber: 81,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Transgender Enumeration",
    question: "Which was the first decennial census in Indian history to collect separate demographic data for transgender persons under the 'Other' gender category?",
    options: {
      a: "Census 2011",
      b: "Census 2001",
      c: "Census 1991",
      d: "Census 1981"
    },
    answer: "a",
    explanation: "Census 2011 was the first census in independent India to introduce a third gender category ('Other') on the enumeration form, counting approximately 4.88 lakh transgender individuals."
  },
  {
    id: "ca_census_82",
    qNumber: 82,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Disability Enumeration",
    question: "While Census 2011 enumerated 8 types of disabilities, the upcoming Census will align with the Rights of Persons with Disabilities (RPwD) Act, 2016, which recognizes how many benchmark disabilities?",
    options: {
      a: "21 disabilities",
      b: "7 disabilities",
      c: "14 disabilities",
      d: "28 disabilities"
    },
    answer: "a",
    explanation: "The Rights of Persons with Disabilities Act, 2016 expanded the recognized categories of disabilities from 7 (under the 1995 Act) to 21 disabilities, including acid attack victims, dwarfism, Parkinson's disease, and learning disabilities."
  },
  {
    id: "ca_census_83",
    qNumber: 83,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Religious Composition 2011",
    question: "According to Census 2011, what were the percentage shares of the two largest religious communities in India?",
    options: {
      a: "Hindus: 79.80%, Muslims: 14.23%",
      b: "Hindus: 82.50%, Muslims: 11.20%",
      c: "Hindus: 75.00%, Muslims: 18.00%",
      d: "Hindus: 80.50%, Muslims: 13.40%"
    },
    answer: "a",
    explanation: "The religious data released by the Census 2011 showed Hindus constituting 79.80% (966.3 million) and Muslims constituting 14.23% (172.2 million) of the total population."
  },
  {
    id: "ca_census_84",
    qNumber: 84,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Christian Majority States",
    question: "Which trio of northeastern Indian states recorded a Christian majority of over 70% in Census 2011?",
    options: {
      a: "Nagaland, Mizoram, and Meghalaya",
      b: "Assam, Tripura, and Manipur",
      c: "Sikkim, Arunachal Pradesh, and Tripura",
      d: "Mizoram, Manipur, and Assam"
    },
    answer: "a",
    explanation: "Nagaland (87.93%), Mizoram (87.16%), and Meghalaya (74.59%) are the three Christian-majority states in India as recorded in Census 2011."
  },
  {
    id: "ca_census_85",
    qNumber: 85,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Highest Muslim Population Percentage",
    question: "Excluding Jammu & Kashmir and Lakshadweep, which Indian state had the highest proportion of Muslim population relative to its total state population (34.22%) in Census 2011?",
    options: {
      a: "Assam",
      b: "West Bengal",
      c: "Kerala",
      d: "Uttar Pradesh"
    },
    answer: "a",
    explanation: "Assam had the highest percentage of Muslim population among full states outside J&K at 34.22% in Census 2011, followed by West Bengal at 27.01% and Kerala at 26.56%."
  },
  {
    id: "ca_census_86",
    qNumber: 86,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Buddhist Demographics",
    question: "Which Indian state has the highest percentage of Buddhist population (27.39%) according to Census 2011?",
    options: {
      a: "Sikkim",
      b: "Arunachal Pradesh",
      c: "Maharashtra",
      d: "Himachal Pradesh"
    },
    answer: "a",
    explanation: "Sikkim has the highest proportion of Buddhists at 27.39% of its population, followed by Arunachal Pradesh (11.77%). (Maharashtra has the highest absolute number of Buddhists due to the Neo-Buddhist movement)."
  },
  {
    id: "ca_census_87",
    qNumber: 87,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Sikh Demographics",
    question: "What percentage of the population in Punjab was recorded as following Sikhism in Census 2011?",
    options: {
      a: "57.69%",
      b: "63.20%",
      c: "72.40%",
      d: "50.10%"
    },
    answer: "a",
    explanation: "In Census 2011, Sikhs formed 57.69% of the total population in Punjab, while Hindus constituted 38.49%."
  },
  {
    id: "ca_census_88",
    qNumber: 88,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Outgrowth Definition",
    question: "In Indian Census terminology, what is an 'Outgrowth' (OG)?",
    options: {
      a: "A fairly large, viable unit physically contiguous to a statutory town that possesses distinct urban infrastructure (such as a railway colony, university campus, or military cantonment)",
      b: "A forest settlement",
      c: "A slum built inside municipal limits",
      d: "An offshore island"
    },
    answer: "a",
    explanation: "An Outgrowth (OG) is a recognizable hamlet or cluster (like a university campus, port area, or military station) that lies physically adjacent and contiguous to a statutory town boundary, sharing urban characteristics."
  },
  {
    id: "ca_census_89",
    qNumber: 89,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Urban Agglomeration Definition",
    question: "What is an 'Urban Agglomeration' (UA) in the Census of India?",
    options: {
      a: "A continuous urban spread constituting a core statutory town and its adjoining outgrowths, or two or more physically contiguous towns",
      b: "An entire revenue district",
      c: "A smart city project area",
      d: "A metropolitan police zone"
    },
    answer: "a",
    explanation: "An Urban Agglomeration is a continuous urban spread consisting of a core town and its adjoining outgrowths (OGs), or two or more physically contiguous towns together with or without outgrowths."
  },
  {
    id: "ca_census_90",
    qNumber: 90,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Million-Plus UAs Count",
    question: "How many million-plus Urban Agglomerations (cities with a population of 1 million or more) were identified in India in Census 2011?",
    options: {
      a: "53 million-plus UAs",
      b: "35 million-plus UAs",
      c: "75 million-plus UAs",
      d: "25 million-plus UAs"
    },
    answer: "a",
    explanation: "Census 2011 identified 53 million-plus Urban Agglomerations/cities in India, up from 35 million-plus cities in Census 2001."
  },
  {
    id: "ca_census_91",
    qNumber: 91,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Most Populous UA",
    question: "Which Urban Agglomeration was the most populous in India in Census 2011, with a population exceeding 18.4 million?",
    options: {
      a: "Greater Mumbai UA",
      b: "Delhi UA",
      c: "Kolkata UA",
      d: "Chennai UA"
    },
    answer: "a",
    explanation: "Greater Mumbai Urban Agglomeration was the most populous UA in Census 2011 with 18.41 million people, followed by Delhi UA (16.34 million) and Kolkata UA (14.05 million)."
  },
  {
    id: "ca_census_92",
    qNumber: 92,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "States with Most Million-Plus Cities",
    question: "Which two Indian states had the highest number of million-plus cities (7 each) in Census 2011?",
    options: {
      a: "Uttar Pradesh and Kerala",
      b: "Maharashtra and Gujarat",
      c: "Tamil Nadu and Karnataka",
      d: "West Bengal and Bihar"
    },
    answer: "a",
    explanation: "Uttar Pradesh and Kerala each had 7 million-plus urban agglomerations in Census 2011 (UP: Kanpur, Lucknow, Ghaziabad, Agra, Varanasi, Meerut, Allahabad; Kerala: Kochi, Kozhikode, Thrissur, Malappuram, Thiruvananthapuram, Kannur, Kollam)."
  },
  {
    id: "ca_census_93",
    qNumber: 93,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Institutional Household",
    question: "In Census methodology, what is an 'Institutional Household'?",
    options: {
      a: "A group of unrelated persons who live together in an institution and take meals from a common kitchen (such as boarding houses, messes, hostels, jails, and hospitals)",
      b: "A joint family with more than 10 members",
      c: "A royal palace",
      d: "A corporate office building"
    },
    answer: "a",
    explanation: "An Institutional Household is defined as a household where a group of unrelated persons reside together and share a common kitchen (e.g. orphanages, correctional homes, old-age homes, hostels, ashrams)."
  },
  {
    id: "ca_census_94",
    qNumber: 94,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Houseless Enumeration Timing",
    question: "When are houseless persons (those living on pavements, under flyovers, staircases, and open spaces) traditionally enumerated during the census?",
    options: {
      a: "On the final night of the population enumeration period",
      b: "At dawn on the first day",
      c: "During daytime market hours",
      d: "Only on national holidays"
    },
    answer: "a",
    explanation: "Houseless population enumeration is carried out simultaneously across the entire country on the final night of the enumeration phase (usually the night of February 28) by special mobile enumerator squads."
  },
  {
    id: "ca_census_95",
    qNumber: 95,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census Reference Moment",
    question: "What is the standard national 'Reference Moment' of the decennial Indian Census for non-snowbound regions?",
    options: {
      a: "00:00 hours of 1st March of the Census year",
      b: "12:00 noon of 1st January",
      c: "Midnight of 15th August",
      d: "00:00 hours of 1st April"
    },
    answer: "a",
    explanation: "The census counts the population as it exists at 00:00 hours of March 1 of the census year. The five-day revisional round (March 1-5) updates any births or deaths that occurred prior to this reference moment."
  },
  {
    id: "ca_census_96",
    qNumber: 96,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Revisional Round Purpose",
    question: "What is the purpose of the 5-day 'Revisional Round' conducted by census enumerators immediately following the main enumeration period?",
    options: {
      a: "To account for births and deaths that occurred between the visit of the enumerator and the reference moment (00:00 hours of March 1)",
      b: "To recount all votes in municipal elections",
      c: "To calculate total property tax collected",
      d: "To distribute national identity cards"
    },
    answer: "a",
    explanation: "The revisional round allows enumerators to re-visit households to enumerate any babies born before sunrise on March 1 and remove individuals who passed away before 00:00 hours on March 1."
  },
  {
    id: "ca_census_97",
    qNumber: 97,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "First Delimitation Commission",
    question: "Who was appointed as the Chairman of the first Delimitation Commission of Independent India in 1952?",
    options: {
      a: "Justice N. Chandrasekhara Aiyar",
      b: "Justice J. L. Kapur",
      c: "Justice Kuldip Singh",
      d: "Justice S. Fazl Ali"
    },
    answer: "a",
    explanation: "The first Delimitation Commission under the Delimitation Commission Act, 1952 was chaired by retired Supreme Court Judge Justice N. Chandrasekhara Aiyar."
  },
  {
    id: "ca_census_98",
    qNumber: 98,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Fourth Delimitation Commission",
    question: "The fourth Delimitation Commission, constituted in July 2002 under Justice Kuldip Singh, based its constituency boundary readjustments on which census?",
    options: {
      a: "2001 Census (amended by the 87th Amendment Act, 2003)",
      b: "1991 Census",
      c: "1971 Census",
      d: "1981 Census"
    },
    answer: "a",
    explanation: "Initially tasked using 1991 census data under the 84th Amendment, the mandate was amended by the 87th Constitutional Amendment Act, 2003 to redraw boundaries based on the final figures of the 2001 Census."
  },
  {
    id: "ca_census_99",
    qNumber: 99,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "State Seat Allocations",
    question: "How many Lok Sabha parliamentary constituencies are currently allocated to Uttar Pradesh, the state with the highest representation in the House of the People?",
    options: {
      a: "80 seats",
      b: "54 seats",
      c: "48 seats",
      d: "40 seats"
    },
    answer: "a",
    explanation: "Uttar Pradesh has 80 Lok Sabha seats—the largest parliamentary contingent in India—followed by Maharashtra (48), West Bengal (42), and Bihar (40)."
  },
  {
    id: "ca_census_100",
    qNumber: 100,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "State Population Rankings",
    question: "Which is the least populous state in India according to Census 2011, with a recorded population of only 610,577?",
    options: {
      a: "Sikkim",
      b: "Mizoram",
      c: "Goa",
      d: "Arunachal Pradesh"
    },
    answer: "a",
    explanation: "Sikkim is India's least populous state with a population of 610,577 in Census 2011, followed by Mizoram (1.09 million) and Arunachal Pradesh (1.38 million)."
  },
  {
    id: "ca_census_101",
    qNumber: 101,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "UT Population Rankings",
    question: "Which Union Territory of India has the smallest population according to Census 2011, with just 64,473 residents?",
    options: {
      a: "Lakshadweep",
      b: "Daman and Diu",
      c: "Andaman and Nicobar Islands",
      d: "Dadra and Nagar Haveli"
    },
    answer: "a",
    explanation: "Lakshadweep is the least populated Union Territory in India, with a recorded population of 64,473 in Census 2011."
  },
  {
    id: "ca_census_102",
    qNumber: 102,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Child Sex Ratio Extremes",
    question: "Which Indian state recorded the lowest Child Sex Ratio (0-6 years) in Census 2011 with just 834 girls per 1,000 boys?",
    options: {
      a: "Haryana",
      b: "Punjab",
      c: "Rajasthan",
      d: "Gujarat"
    },
    answer: "a",
    explanation: "Haryana recorded the lowest Child Sex Ratio (834 girls per 1,000 boys) among all states in Census 2011, followed closely by Punjab (846)."
  },
  {
    id: "ca_census_103",
    qNumber: 103,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Child Sex Ratio Extremes",
    question: "Which Indian state recorded the highest Child Sex Ratio (0-6 years) in Census 2011 with 971 girls per 1,000 boys?",
    options: {
      a: "Mizoram",
      b: "Kerala",
      c: "Goa",
      d: "Tamil Nadu"
    },
    answer: "a",
    explanation: "Mizoram recorded the highest Child Sex Ratio (0-6 years) in Census 2011 at 971, followed by Meghalaya at 970."
  },
  {
    id: "ca_census_104",
    qNumber: 104,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "District Sex Ratio Extremes",
    question: "Which administrative district in India had the highest sex ratio in Census 2011, with 1,184 females per 1,000 males?",
    options: {
      a: "Mahe (Puducherry)",
      b: "Almora (Uttarakhand)",
      c: "Kannur (Kerala)",
      d: "Ratnagiri (Maharashtra)"
    },
    answer: "a",
    explanation: "Mahe district in the Union Territory of Puducherry recorded the highest sex ratio in India at 1,184 females per 1,000 males in Census 2011."
  },
  {
    id: "ca_census_105",
    qNumber: 105,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "District Sex Ratio Extremes",
    question: "Which district recorded the lowest sex ratio in India in Census 2011, with only 534 females per 1,000 males?",
    options: {
      a: "Daman (Daman and Diu)",
      b: "Leh (Ladakh)",
      c: "Tawang (Arunachal Pradesh)",
      d: "Jaisalmer (Rajasthan)"
    },
    answer: "a",
    explanation: "Daman district in Daman and Diu had the lowest sex ratio in India at 534 females per 1,000 males, heavily skewed by the influx of male industrial migrant laborers."
  },
  {
    id: "ca_census_106",
    qNumber: 106,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "District Literacy Extremes",
    question: "Which district in India achieved the highest literacy rate (97.91%) according to Census 2011?",
    options: {
      a: "Serchhip (Mizoram)",
      b: "Aizawl (Mizoram)",
      c: "Kottayam (Kerala)",
      d: "Ernakulam (Kerala)"
    },
    answer: "a",
    explanation: "Serchhip district in Mizoram achieved the highest literacy rate in India at 97.91% in Census 2011, edging out Aizawl (97.89%)."
  },
  {
    id: "ca_census_107",
    qNumber: 107,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "District Literacy Extremes",
    question: "Which district had the lowest recorded literacy rate in India in Census 2011 at 36.10%?",
    options: {
      a: "Alirajpur (Madhya Pradesh)",
      b: "Bijapur (Chhattisgarh)",
      c: "Dantewada (Chhattisgarh)",
      d: "Shravasti (Uttar Pradesh)"
    },
    answer: "a",
    explanation: "Alirajpur district in Madhya Pradesh had the lowest literacy rate in India at 36.10% in Census 2011, followed by Bijapur in Chhattisgarh (40.86%)."
  },
  {
    id: "ca_census_108",
    qNumber: 108,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Houselisting Question Count",
    question: "How many questions are included in the standardized Houselisting and Housing Schedule of the Census to assess household living standards and asset ownership?",
    options: {
      a: "31 questions",
      b: "10 questions",
      c: "50 questions",
      d: "15 questions"
    },
    answer: "a",
    explanation: "The Houselisting Schedule prepared by ORGI comprises 31 questions covering building material, ownership status, drinking water source, electricity, sanitation, kitchen fuel, internet, and consumer assets."
  },
  {
    id: "ca_census_109",
    qNumber: 109,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census Numbering on Houses",
    question: "Under Section 10 of the Census Act, 1948, what legal obligation is imposed on every occupier of a house regarding census markings?",
    options: {
      a: "They must permit census officers to paint or affix census building numbers on the property and must not deface them",
      b: "They must paint their house in government colors",
      c: "They must install CCTV cameras",
      d: "They must display their tax returns on the door"
    },
    answer: "a",
    explanation: "Section 10 of the Census Act mandates that every occupant must allow census officers to mark numbers on the house and must prevent the removal or defacement of those census numbers."
  },
  {
    id: "ca_census_110",
    qNumber: 110,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census Act Penalties",
    question: "Under Section 11 of the Census Act, 1948, what penalties can be imposed on a census officer who refuses to perform census duties without reasonable cause?",
    options: {
      a: "Fine which may extend to one thousand rupees or imprisonment which may extend to three years, or both",
      b: "Immediate dismissal without inquiry only",
      c: "No penalty",
      d: "Permanent loss of citizenship"
    },
    answer: "a",
    explanation: "Section 11(1) of the Census Act provides for criminal penalties, including fines up to ₹1,000 and imprisonment for up to 3 years, for census officers who refuse duties or falsify census records."
  },
  {
    id: "ca_census_111",
    qNumber: 111,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census Act Overriding Power",
    question: "Does the Census Act, 1948 contain provisions exempting military cantonments or naval ships from ordinary census enumeration?",
    options: {
      a: "No, under Section 9, military commanders and commanding officers of vessels must act as census officers for their personnel upon notification",
      b: "Yes, military personnel are completely excluded from the census",
      c: "Military personnel are counted only in wartime",
      d: "Only naval officers are counted"
    },
    answer: "a",
    explanation: "Section 9 of the Census Act empowers the government to designate military commanders, ship captains, and prison superintendents as authorized census officers for their respective establishments."
  },
  {
    id: "ca_census_112",
    qNumber: 112,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Historical Delimitation in the Northeast",
    question: "Why was the 2002 Delimitation Commission's work deferred in Assam, Arunachal Pradesh, Manipur, and Nagaland in 2008 by presidential orders?",
    options: {
      a: "Due to ongoing law and order concerns, contested 2001 census figures, and civil society unrest",
      b: "Because there were no qualified judges to serve",
      c: "Because those states had no legislative assemblies",
      d: "Because they used a different currency"
    },
    answer: "a",
    explanation: "In February 2008, the central government deferred delimitation in Assam, Arunachal Pradesh, Manipur, and Nagaland under Section 10A of the Delimitation Act, citing severe security concerns and disputed 2001 census demographic counts."
  },
  {
    id: "ca_census_113",
    qNumber: 113,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census 1931 Caste Commissioner",
    question: "Who was the Census Commissioner of British India in 1931 who conducted the detailed caste census and authored a renowned sociological treatise on the caste system?",
    options: {
      a: "J. H. Hutton",
      b: "Herbert Risley",
      c: "W. C. Plowden",
      d: "Sir William Hunter"
    },
    answer: "a",
    explanation: "J. H. Hutton was the Census Commissioner of India for the 1931 Census. He subsequently published 'Caste in India: Its Nature, Function, and Origins', based on the 1931 ethnographic survey."
  },
  {
    id: "ca_census_114",
    qNumber: 114,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Herbert Risley 1901 Anthropometry",
    question: "Which Census Commissioner introduced controversial anthropometric nasal index measurements in the 1901 Census to classify Indian castes by racial hierarchy?",
    options: {
      a: "Sir Herbert Hope Risley",
      b: "Lord Curzon",
      c: "W. W. Hunter",
      d: "Lord Cornwallis"
    },
    answer: "a",
    explanation: "Sir Herbert Hope Risley, Census Commissioner in 1901, introduced anthropometric measurements (such as nasal indices and skull dimensions) in an attempt to classify castes on a pseudo-scientific racial scale."
  },
  {
    id: "ca_census_115",
    qNumber: 115,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "NSSO Establishment",
    question: "Recognizing the need for ongoing socio-economic data between decennial censuses, which pioneering statistician founded the National Sample Survey (NSS) in 1950?",
    options: {
      a: "Prof. P. C. Mahalanobis",
      b: "Dr. C. R. Rao",
      c: "Sir C. V. Raman",
      d: "Dr. B. R. Ambedkar"
    },
    answer: "a",
    explanation: "Prof. Prasanta Chandra Mahalanobis founded the Indian Statistical Institute (ISI) and launched the National Sample Survey (NSS) in 1950 to collect representative large-scale sample data across rounds."
  },
  {
    id: "ca_census_116",
    qNumber: 116,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Civil Registration System (CRS)",
    question: "Under the Registration of Births and Deaths (Amendment) Act, 2023, what expanded national legal role is given to digital birth certificates issued by the Civil Registration System (CRS)?",
    options: {
      a: "A single document to prove date and place of birth for admission to educational institutions, driving license, passport, and voter registration",
      b: "It replaces currency notes",
      c: "It acts as a universal medical insurance card",
      d: "It automatically grants government employment"
    },
    answer: "a",
    explanation: "The Registration of Births and Deaths (Amendment) Act, 2023 established that digital birth certificates issued through the CRS will serve as the sole single proof of age for voter enrollment, educational admissions, passports, and government services."
  },
  {
    id: "ca_census_117",
    qNumber: 117,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census GIS Mapping",
    question: "What GIS-based technology initiative is being deployed for Census 2027 to ensure that no habitation or slum is omitted by enumerators?",
    options: {
      a: "Digital Mapping and Geo-fencing of Enumeration Blocks (EBs) using satellite imagery and mobile GPS tracking",
      b: "Manual hand-drawn sketches only",
      c: "Commercial billboard coordinates",
      d: "Postal pin-code registers exclusively"
    },
    answer: "a",
    explanation: "For the digital census, the Registrar General's office has digitized more than 25 lakh Enumeration Blocks (EBs) onto GIS maps, using geo-fencing so enumerators can navigate boundaries on their mobile tablets without overlapping or missing houses."
  },
  {
    id: "ca_census_118",
    qNumber: 118,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census Budgeting",
    question: "What was the landmark financial outlay approved by the Union Cabinet in December 2019 for conducting the Census of India and updating the National Population Register (NPR)?",
    options: {
      a: "Approximately ₹8,754 crore for Census and ₹3,941 crore for NPR",
      b: "₹500 crore total",
      c: "₹50,000 crore total",
      d: "₹1,000 crore total"
    },
    answer: "a",
    explanation: "The Union Cabinet approved an expenditure of ₹8,754.23 crore for conducting the Census of India and ₹3,941.35 crore for updating the National Population Register (NPR)."
  },
  {
    id: "ca_census_119",
    qNumber: 119,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census Enumerator Profile",
    question: "Who primarily serves as frontline enumerators during the physical house-to-house enumeration phase of the Indian Census?",
    options: {
      a: "Government primary school teachers, Anganwadi workers, and municipal staff designated as Census Officers",
      b: "Private contractors",
      c: "Volunteers from non-governmental organizations",
      d: "University undergraduate students exclusively"
    },
    answer: "a",
    explanation: "Nearly 30 lakh frontline enumerators are drawn from state government school teachers, Anganwadi workers, and local municipal revenue employees, statutory designated under the Census Act 1948."
  },
  {
    id: "ca_census_120",
    qNumber: 120,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "District Census Handbook (DCHB)",
    question: "What is the 'District Census Handbook' (DCHB) published by the Directorate of Census Operations for every district in India?",
    options: {
      a: "A comprehensive publication containing village and town-level primary census abstracts, amenities directories, and historical demographic profiles",
      b: "A tourist guidebook",
      c: "A compilation of state court judgments",
      d: "An election candidate manifest"
    },
    answer: "a",
    explanation: "The District Census Handbook (DCHB) is one of the most prestigious data repositories published by the Census Organization, providing granular village-level and town ward-level data on demographics, schools, drinking water, and infrastructure."
  },
  {
    id: "ca_census_121",
    qNumber: 121,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "First General Election Voter Count",
    question: "During India's first General Elections in 1951-52, approximately how many eligible adult citizens were on the electoral roll to cast their vote?",
    options: {
      a: "Approximately 173 million voters",
      b: "50 million voters",
      c: "500 million voters",
      d: "900 million voters"
    },
    answer: "a",
    explanation: "In the 1951-52 elections, India's newly created Election Commission enrolled 173.2 million voters, representing the largest democratic electorate in human history at the time."
  },
  {
    id: "ca_census_122",
    qNumber: 122,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Voter Inking Origin",
    question: "During the first General Elections, which specialized chemical product manufactured by Mysore Paints and Varnish Limited was introduced to prevent fraudulent double-voting?",
    options: {
      a: "Indelible Ink containing silver nitrate",
      b: "Fluorescent dye",
      c: "Permanent black marker",
      d: "Henna paste"
    },
    answer: "a",
    explanation: "Indelible ink containing silver nitrate was developed by the Council of Scientific and Industrial Research (CSIR) and manufactured by Mysore Paints and Varnish Ltd, staining skin upon exposure to ultraviolet light."
  },
  {
    id: "ca_census_123",
    qNumber: 123,
    section: "current_affairs",
    difficulty: "Moderate",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "1951 Election Turnout",
    question: "What was the voter turnout percentage in India's historic 1951-52 first General Elections?",
    options: {
      a: "45.7%",
      b: "66.4%",
      c: "25.0%",
      d: "82.5%"
    },
    answer: "a",
    explanation: "Voter turnout in the 1951-52 General Elections was 45.7%, demonstrating immense democratic participation despite widespread illiteracy and transport challenges."
  },
  {
    id: "ca_census_124",
    qNumber: 124,
    section: "current_affairs",
    difficulty: "Hard",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Article 81 Representation Ratio",
    question: "Under Article 81(2) of the Constitution of India, what ratio must be maintained as far as practicable across all parliamentary constituencies in every state?",
    options: {
      a: "The ratio between the number of seats allocated to a state and the population of the state must be uniform across all states",
      b: "One MP for every 10 square kilometers",
      c: "One MP for every district headquarters",
      d: "Equal number of MPs from every state regardless of population"
    },
    answer: "a",
    explanation: "Article 81(2)(a) requires that the ratio between the number of Lok Sabha seats allotted to each state and the population of the state shall, so far as practicable, be the same for all states (applicable to states having population > 6 million)."
  },
  {
    id: "ca_census_125",
    qNumber: 125,
    section: "current_affairs",
    difficulty: "Easy",
    category: "ca_census",
    categoryName: "Census of India & Delimitation",
    subtopic: "Census 2027 Vision",
    question: "What is the defining vision of India's Census 2027 that distinguishes it from all previous 15 decennial censuses in Indian history?",
    options: {
      a: "A 100% paperless, digital enumeration with citizen self-enumeration, multi-lingual mobile applications, real-time monitoring dashboards, and immediate data release",
      b: "Conducting the census using postal mail ballots exclusively",
      c: "A census conducted once every 50 years",
      d: "Restricting enumeration to metropolitan cities"
    },
    answer: "a",
    explanation: "Census 2027 will be India's first completely paperless digital census, empowering citizens with self-enumeration portals, mobile apps for 30 lakh enumerators, geo-fenced enumeration blocks, and automated data processing, setting a new benchmark for demographic surveys globally."
  }
];
