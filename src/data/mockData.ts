// =====================================================
// DONNÉES MOCKÉES - COPIÉES DIRECTEMENT DE insert_mock_data.sql
// Conversion SQL → TypeScript
// =====================================================

import { Country, Continent, SubRegion, City, Confession, Parish, User, Post, UserRole, UserLevel, PostVisibility } from '../types';

// =====================================================
// 1. CONTINENTS (6)
// =====================================================
export const mockContinents: Continent[] = [
  { id: '1', name: 'Afrique', code: 'AF' },
  { id: '2', name: 'Europe', code: 'EU' },
  { id: '3', name: 'Amérique du Nord', code: 'NA' },
  { id: '4', name: 'Amérique du Sud', code: 'SA' },
  { id: '5', name: 'Asie', code: 'AS' },
  { id: '6', name: 'Océanie', code: 'OC' }
];

// =====================================================
// 2. SOUS-RÉGIONS (5)
// =====================================================
export const mockSubRegions: SubRegion[] = [
  { id: '1', name: 'Afrique de l\'Ouest', continentId: '1' },
  { id: '2', name: 'Afrique Centrale', continentId: '1' },
  { id: '3', name: 'Afrique de l\'Est', continentId: '1' },
  { id: '4', name: 'Europe de l\'Ouest', continentId: '2' },
  { id: '5', name: 'Europe du Sud', continentId: '2' }
];

// =====================================================
// 3. PAYS (5)
// =====================================================
export const mockCountries: Country[] = [
  {
    id: '1',
    name: 'Bénin',
    code: 'BJ',
    continent: mockContinents[0], // Afrique
    subRegion: mockSubRegions[0], // Afrique de l'Ouest
    cities: [] // Rempli plus bas
  },
  {
    id: '2',
    name: 'Sénégal',
    code: 'SN',
    continent: mockContinents[0],
    subRegion: mockSubRegions[0],
    cities: []
  },
  {
    id: '3',
    name: 'France',
    code: 'FR',
    continent: mockContinents[1], // Europe
    subRegion: mockSubRegions[3], // Europe de l'Ouest
    cities: []
  },
  {
    id: '4',
    name: 'République Démocratique du Congo',
    code: 'CD',
    continent: mockContinents[0],
    subRegion: mockSubRegions[1], // Afrique Centrale
    cities: []
  },
  {
    id: '5',
    name: 'Kenya',
    code: 'KE',
    continent: mockContinents[0],
    subRegion: mockSubRegions[2], // Afrique de l'Est
    cities: []
  }
];

// =====================================================
// 4. VILLES (28)
// =====================================================
export const mockCities: City[] = [
  // Bénin (10 villes)
  { id: '1', name: 'Cotonou', countryId: '1' },
  { id: '2', name: 'Porto-Novo', countryId: '1' },
  { id: '3', name: 'Parakou', countryId: '1' },
  { id: '4', name: 'Djougou', countryId: '1' },
  { id: '5', name: 'Bohicon', countryId: '1' },
  { id: '6', name: 'Kandi', countryId: '1' },
  { id: '7', name: 'Lokossa', countryId: '1' },
  { id: '8', name: 'Ouidah', countryId: '1' },
  { id: '9', name: 'Abomey', countryId: '1' },
  { id: '10', name: 'Natitingou', countryId: '1' },
  
  // Sénégal (5 villes)
  { id: '11', name: 'Dakar', countryId: '2' },
  { id: '12', name: 'Saint-Louis', countryId: '2' },
  { id: '13', name: 'Thiès', countryId: '2' },
  { id: '14', name: 'Kaolack', countryId: '2' },
  { id: '15', name: 'Ziguinchor', countryId: '2' },
  
  // France (5 villes)
  { id: '16', name: 'Paris', countryId: '3' },
  { id: '17', name: 'Lyon', countryId: '3' },
  { id: '18', name: 'Marseille', countryId: '3' },
  { id: '19', name: 'Toulouse', countryId: '3' },
  { id: '20', name: 'Nice', countryId: '3' },
  
  // RDC (4 villes)
  { id: '21', name: 'Kinshasa', countryId: '4' },
  { id: '22', name: 'Lubumbashi', countryId: '4' },
  { id: '23', name: 'Mbuji-Mayi', countryId: '4' },
  { id: '24', name: 'Kisangani', countryId: '4' },
  
  // Kenya (4 villes)
  { id: '25', name: 'Nairobi', countryId: '5' },
  { id: '26', name: 'Mombasa', countryId: '5' },
  { id: '27', name: 'Kisumu', countryId: '5' },
  { id: '28', name: 'Nakuru', countryId: '5' }
];

// =====================================================
// 5. CONFESSIONS RELIGIEUSES (10)
// =====================================================
export const mockConfessions: Confession[] = [
  { id: '1', name: 'Catholique', description: 'Église Catholique Romaine', validated: true },
  { id: '2', name: 'Protestant', description: 'Églises Protestantes', validated: true },
  { id: '3', name: 'Orthodoxe', description: 'Églises Orthodoxes', validated: true },
  { id: '4', name: 'Évangélique', description: 'Églises Évangéliques', validated: true },
  { id: '5', name: 'Pentecôtiste', description: 'Églises Pentecôtistes', validated: true },
  { id: '6', name: 'Baptiste', description: 'Églises Baptistes', validated: true },
  { id: '7', name: 'Méthodiste', description: 'Églises Méthodistes', validated: true },
  { id: '8', name: 'Adventiste', description: 'Église Adventiste du Septième Jour', validated: true },
  { id: '9', name: 'Presbytérienne', description: 'Églises Presbytériennes', validated: true },
  { id: '10', name: 'Anglicane', description: 'Communion Anglicane', validated: true }
];

// =====================================================
// 6. PAROISSES (29 - sélection des principales)
// =====================================================
export const mockParishes: Parish[] = [
  // Cotonou - Bénin (7)
  { id: '1', name: 'Cathédrale Notre-Dame de Miséricorde', confessionId: '1', cityId: '1', address: 'Boulevard de la Marina, Cotonou', validated: true },
  { id: '2', name: 'Paroisse Saint-Michel', confessionId: '1', cityId: '1', address: 'Quartier Akpakpa, Cotonou', validated: true },
  { id: '3', name: 'Église Saint-Antoine de Padoue', confessionId: '1', cityId: '1', address: 'Quartier Cadjehoun, Cotonou', validated: true },
  { id: '4', name: 'Temple Protestant Méthodiste', confessionId: '7', cityId: '1', address: 'Avenue Clozel, Cotonou', validated: true },
  { id: '5', name: 'Église Évangélique du Bénin', confessionId: '4', cityId: '1', address: 'Quartier Godomey, Cotonou', validated: true },
  { id: '6', name: 'Assemblée de Dieu Cotonou', confessionId: '5', cityId: '1', address: 'Quartier Fidjrossè, Cotonou', validated: true },
  { id: '7', name: 'Église Baptiste Emmanuel', confessionId: '6', cityId: '1', address: 'Quartier Dantokpa, Cotonou', validated: true },
  
  // Porto-Novo - Bénin (2)
  { id: '8', name: 'Cathédrale de l\'Immaculée Conception', confessionId: '1', cityId: '2', address: 'Centre-ville, Porto-Novo', validated: true },
  { id: '9', name: 'Église Protestante Méthodiste', confessionId: '7', cityId: '2', address: 'Quartier Tokpota, Porto-Novo', validated: true },
  
  // Parakou - Bénin (2)
  { id: '10', name: 'Paroisse Saint-Pierre de Parakou', confessionId: '1', cityId: '3', address: 'Centre-ville, Parakou', validated: true },
  { id: '11', name: 'Église Évangélique de Parakou', confessionId: '4', cityId: '3', address: 'Quartier Banikanni, Parakou', validated: true },
  
  // Ouidah - Bénin (1)
  { id: '12', name: 'Basilique de l\'Immaculée Conception', confessionId: '1', cityId: '8', address: 'Centre historique, Ouidah', validated: true },
  
  // Dakar - Sénégal (7)
  { id: '13', name: 'Cathédrale du Souvenir Africain', confessionId: '1', cityId: '11', address: 'Plateau, Dakar', validated: true },
  { id: '14', name: 'Église Saint-Joseph', confessionId: '1', cityId: '11', address: 'Médina, Dakar', validated: true },
  { id: '15', name: 'Paroisse Sainte-Anne', confessionId: '1', cityId: '11', address: 'Fann, Dakar', validated: true },
  { id: '16', name: 'Temple Protestant de Dakar', confessionId: '2', cityId: '11', address: 'Point E, Dakar', validated: true },
  { id: '17', name: 'Église Évangélique de Réveil', confessionId: '4', cityId: '11', address: 'Liberté 6, Dakar', validated: true },
  { id: '18', name: 'Assemblée de Dieu Dakar', confessionId: '5', cityId: '11', address: 'Parcelles Assainies, Dakar', validated: true },
  { id: '19', name: 'Église Baptiste Béthel', confessionId: '6', cityId: '11', address: 'Ouakam, Dakar', validated: true },
  
  // Paris - France (4)
  { id: '20', name: 'Notre-Dame de Paris', confessionId: '1', cityId: '16', address: 'Île de la Cité, Paris', validated: true },
  { id: '21', name: 'Église Saint-Sulpice', confessionId: '1', cityId: '16', address: '6e arrondissement, Paris', validated: true },
  { id: '22', name: 'Église Protestante Unie de France', confessionId: '2', cityId: '16', address: 'Rue de Rivoli, Paris', validated: true },
  { id: '23', name: 'Église Évangélique de Belleville', confessionId: '4', cityId: '16', address: '20e arrondissement, Paris', validated: true },
  
  // Kinshasa - RDC (3)
  { id: '24', name: 'Cathédrale Notre-Dame du Congo', confessionId: '1', cityId: '21', address: 'Gombe, Kinshasa', validated: true },
  { id: '25', name: 'Église du Christ au Congo', confessionId: '2', cityId: '21', address: 'Kalamu, Kinshasa', validated: true },
  { id: '26', name: 'Assemblée Chrétienne de Kinshasa', confessionId: '5', cityId: '21', address: 'Lemba, Kinshasa', validated: true },
  
  // Nairobi - Kenya (3)
  { id: '27', name: 'Holy Family Cathedral', confessionId: '1', cityId: '25', address: 'City Centre, Nairobi', validated: true },
  { id: '28', name: 'All Saints Cathedral', confessionId: '10', cityId: '25', address: 'Uhuru Highway, Nairobi', validated: true },
  { id: '29', name: 'Nairobi Baptist Church', confessionId: '6', cityId: '25', address: 'Ngong Road, Nairobi', validated: true }
];

// =====================================================
// 7. PROFILS UTILISATEURS (18 - exactement ceux de votre SQL)
// =====================================================
export const mockUsers: User[] = [
  // Administrateurs et responsables (Cotonou)
  {
    id: '1',
    email: 'modestegando@gmail.com',
    firstName: 'Modeste',
    lastName: 'Gando',
    profileComplete: true,
    role: UserRole.ADMIN,
    level: UserLevel.BERGER,
    country: mockCountries[0], // Bénin
    city: 'Cotonou',
    confession: mockConfessions[0], // Catholique
    parish: mockParishes[0], // Cathédrale Notre-Dame de Miséricorde
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Prêtre catholique à la Cathédrale de Cotonou. Passionné par l\'évangélisation et la jeunesse.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'catherinelawani@gmail.com',
    firstName: 'Catherine',
    lastName: 'Lawani',
    profileComplete: true,
    role: UserRole.VIGNERON,
    level: UserLevel.BERGER,
    country: mockCountries[0],
    city: 'Cotonou',
    confession: mockConfessions[0],
    parish: mockParishes[0],
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Responsable de la catéchèse. Mère de 3 enfants. Engagée dans la vie paroissiale depuis 15 ans.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    email: 'emmanuelgando@gmail.com',
    firstName: 'Emmanuel',
    lastName: 'Gando',
    profileComplete: true,
    role: UserRole.VIGNERON,
    level: UserLevel.MOISSONNEUR,
    country: mockCountries[0],
    city: 'Cotonou',
    confession: mockConfessions[3], // Évangélique
    parish: mockParishes[4], // Église Évangélique du Bénin
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Pasteur évangélique. Enseignant biblique et conférencier.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '4',
    email: 'mariemelckiss@gmail.com',
    firstName: 'Marie',
    lastName: 'Melckiss',
    profileComplete: true,
    role: UserRole.VIGNERON,
    level: UserLevel.MOISSONNEUR,
    country: mockCountries[0],
    city: 'Cotonou',
    confession: mockConfessions[0],
    parish: mockParishes[0],
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Directrice de chorale. Musicienne et compositrice de chants religieux.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  
  // Membres actifs (Cotonou) - Suite de votre script SQL...
  {
    id: '5',
    email: 'marieconsolation@gmail.com',
    firstName: 'Marie',
    lastName: 'Consolation',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.SEMEUR,
    country: mockCountries[0],
    city: 'Cotonou',
    confession: mockConfessions[0],
    parish: mockParishes[0],
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Étudiante en théologie. Responsable des jeunes de la paroisse.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '6',
    email: 'mariejohannique@gmail.com',
    firstName: 'Marie',
    lastName: 'Johannique',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.MOISSONNEUR,
    country: mockCountries[0],
    city: 'Cotonou',
    confession: mockConfessions[1], // Protestant
    parish: mockParishes[3], // Temple Protestant Méthodiste
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Infirmière de profession. Membre active du groupe de prière.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '7',
    email: 'rodiath@gmail.com',
    firstName: 'Rodiath',
    lastName: 'Gandonou',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.SEMEUR,
    country: mockCountries[0],
    city: 'Cotonou',
    confession: mockConfessions[3], // Évangélique
    parish: mockParishes[4], // Église Évangélique du Bénin
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Entrepreneure. Fondatrice d\'une entreprise sociale chrétienne.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '8',
    email: 'karamatou@gmail.com',
    firstName: 'Karamatou',
    lastName: 'Salami',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.SEMEUR,
    country: mockCountries[0],
    city: 'Cotonou',
    confession: mockConfessions[0],
    parish: mockParishes[0],
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Mère au foyer. Responsable de l\'accueil à la paroisse.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '9',
    email: 'martory@gmail.com',
    firstName: 'Martory',
    lastName: 'Dossou',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.MOISSONNEUR,
    country: mockCountries[0],
    city: 'Cotonou',
    confession: mockConfessions[4], // Pentecôtiste
    parish: mockParishes[5], // Assemblée de Dieu Cotonou
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Enseignant. Responsable de l\'école du dimanche.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '10',
    email: 'saens@gmail.com',
    firstName: 'Saens',
    lastName: 'Kouagou',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.SEMEUR,
    country: mockCountries[0],
    city: 'Cotonou',
    confession: mockConfessions[5], // Baptiste
    parish: mockParishes[6], // Église Baptiste Emmanuel
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Étudiante en médecine. Membre de la chorale des jeunes.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  
  // Porto-Novo
  {
    id: '11',
    email: 'berenice@gmail.com',
    firstName: 'Bérénice',
    lastName: 'Yahouédéou',
    profileComplete: true,
    role: UserRole.VIGNERON,
    level: UserLevel.MOISSONNEUR,
    country: mockCountries[0],
    city: 'Porto-Novo',
    confession: mockConfessions[0],
    parish: mockParishes[7], // Cathédrale de l'Immaculée Conception
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Prêtre à Porto-Novo. Historienne des religions africaines.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '12',
    email: 'petronille@gmail.com',
    firstName: 'Pétronille',
    lastName: 'Zannou',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.SEMEUR,
    country: mockCountries[0],
    city: 'Porto-Novo',
    confession: mockConfessions[6], // Méthodiste
    parish: mockParishes[8], // Église Protestante Méthodiste
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Commerçante au marché Dantokpa. Femme de foi engagée.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  
  // Parakou
  {
    id: '13',
    email: 'reyhector@gmail.com',
    firstName: 'Rey',
    lastName: 'Hector',
    profileComplete: true,
    role: UserRole.VIGNERON,
    level: UserLevel.MOISSONNEUR,
    country: mockCountries[0],
    city: 'Parakou',
    confession: mockConfessions[0],
    parish: mockParishes[9], // Paroisse Saint-Pierre de Parakou
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Pasteur à Parakou. Spécialiste en counseling familial.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  
  // Ouidah
  {
    id: '14',
    email: 'olgapatricia@gmail.com',
    firstName: 'Olga-Patricia',
    lastName: 'Djogbenou',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.SEMEUR,
    country: mockCountries[0],
    city: 'Ouidah',
    confession: mockConfessions[0],
    parish: mockParishes[11], // Basilique de l'Immaculée Conception
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Guide touristique chrétienne à Ouidah.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  
  // Bohicon
  {
    id: '15',
    email: 'dorine@gmail.com',
    firstName: 'Dorine',
    lastName: 'Houngbedji',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.SEMEUR,
    country: mockCountries[0],
    city: 'Bohicon',
    confession: mockConfessions[3], // Évangélique
    parish: null,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Agricultrice chrétienne. Productrice de maïs et de manioc.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  
  // Djougou
  {
    id: '16',
    email: 'esperancia@gmail.com',
    firstName: 'Espérancia',
    lastName: 'Tchibozo',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.SEMEUR,
    country: mockCountries[0],
    city: 'Djougou',
    confession: mockConfessions[0],
    parish: null,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Enseignante à Djougou. Catéchiste depuis 10 ans.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  
  // Abomey
  {
    id: '17',
    email: 'victorien@gmail.com',
    firstName: 'Victorien',
    lastName: 'Houessou',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.SEMEUR,
    country: mockCountries[0],
    city: 'Abomey',
    confession: mockConfessions[1], // Protestant
    parish: null,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Artisan. Fabrique des objets d\'art chrétiens.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  
  // Sénégal (Dakar)
  {
    id: '18',
    email: 'mavie@gmail.com',
    firstName: 'Mavie',
    lastName: 'Ndiaye',
    profileComplete: true,
    role: UserRole.BREBIS,
    level: UserLevel.MOISSONNEUR,
    country: mockCountries[1], // Sénégal
    city: 'Dakar',
    confession: mockConfessions[0],
    parish: mockParishes[12], // Cathédrale du Souvenir Africain
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Étudiante sénégalaise en France. Membre active de la diaspora.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

// =====================================================
// 8. UTILISATEUR CONNECTÉ (Modeste Gando - admin)
// =====================================================
export const mockCurrentUser: User = mockUsers[0];

// =====================================================
// 9. POSTS (4 - gardons vos posts existants adaptés)
// =====================================================
export const mockPosts: Post[] = [
  {
    id: '1',
    authorId: '2', // Catherine Lawani
    author: mockUsers[1],
    content: 'Que la paix du Christ soit avec vous tous en ce dimanche béni. Prenons un moment pour méditer sur Sa grâce infinie. 🙏✨\n\nCette semaine, j\'ai été particulièrement touchée par le verset de Jean 14:27...',
    mediaUrls: ['https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=800'],
    visibility: PostVisibility.GLOBAL,
    likesCount: 24,
    commentsCount: 8,
    sharesCount: 3,
    createdAt: new Date('2024-01-20T10:30:00'),
    updatedAt: new Date('2024-01-20T10:30:00')
  },
  {
    id: '2',
    authorId: '3', // Emmanuel Gando
    author: mockUsers[2],
    content: '🔔 Rappel important pour notre communauté de Cotonou !\n\nNotre service de prière communautaire aura lieu ce soir à 19h dans la salle principale...',
    visibility: PostVisibility.RESTRICTED,
    parishIds: ['4'],
    likesCount: 15,
    commentsCount: 12,
    sharesCount: 5,
    createdAt: new Date('2024-01-20T08:15:00'),
    updatedAt: new Date('2024-01-20T08:15:00')
  },
  {
    id: '3',
    authorId: '5', // Marie Consolation
    author: mockUsers[4],
    content: 'Témoignage de reconnaissance depuis Porto-Novo 🙏\n\nJe voulais partager avec vous la fidélité de Dieu dans ma vie...',
    mediaUrls: [
      'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    visibility: PostVisibility.GLOBAL,
    likesCount: 42,
    commentsCount: 18,
    sharesCount: 7,
    createdAt: new Date('2024-01-19T14:22:00'),
    updatedAt: new Date('2024-01-19T14:22:00')
  },
  {
    id: '4',
    authorId: '13', // Rey Hector (Parakou)
    author: mockUsers[12],
    content: '🎵 Louange du jour depuis Parakou 🎵\n\n"Éternel, tu es mon berger : je ne manquerai de rien..."\n\nPsaume 23:1-2\n\nQuelle belle promesse !...',
    visibility: PostVisibility.EXTENDED,
    confessionIds: ['4'],
    likesCount: 31,
    commentsCount: 14,
    sharesCount: 9,
    createdAt: new Date('2024-01-18T16:45:00'),
    updatedAt: new Date('2024-01-18T16:45:00')
  }
];

// =====================================================
// 10. HELPER FUNCTIONS
// =====================================================
export function getCountryById(id: string): Country | undefined {
  return mockCountries.find(c => c.id === id);
}

export function getCityById(id: string): City | undefined {
  return mockCities.find(c => c.id === id);
}

export function getConfessionById(id: string): Confession | undefined {
  return mockConfessions.find(c => c.id === id);
}

export function getParishById(id: string): Parish | undefined {
  return mockParishes.find(p => p.id === id);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

// Helper pour remplir les villes des pays
mockCountries.forEach(country => {
  country.cities = mockCities.filter(city => city.countryId === country.id);
});