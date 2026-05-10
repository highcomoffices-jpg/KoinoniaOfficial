import { Service, ServiceType, Formation, FormationCategory, ParishActivity, ActivityType, Group, GroupType, GroupVisibility } from '../types';
import { mockCurrentUser, mockConfessions, mockParishes } from './mockData';

// Services confessionnels mockés
export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Demande de Messe d\'intention',
    description: 'Demandez une messe pour vos intentions particulières : défunts, malades, actions de grâce, etc. Notre prêtre célébrera la messe selon vos intentions.',
    type: ServiceType.MASS_REQUEST,
    confessionIds: ['1'], // Catholique uniquement
    parishId: '1',
    providerId: '2',
    provider: {
      id: '2',
      firstName: 'Père Michel',
      lastName: 'Adjovi',
      email: 'pere.michel@cathedral-cotonou.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 5000,
    duration: '30 minutes',
    schedule: [
      {
        id: '1',
        serviceId: '1',
        date: new Date('2024-01-25'),
        startTime: '07:00',
        endTime: '07:30',
        location: 'Cathédrale Notre-Dame de Miséricorde',
        isOnline: false
      }
    ],
    currentParticipants: 0,
    requirements: ['Intention claire', 'Offrande suggérée'],
    imageUrl: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Confession et Direction spirituelle',
    description: 'Rendez-vous pour le sacrement de réconciliation et accompagnement spirituel personnalisé avec un prêtre expérimenté.',
    type: ServiceType.CONFESSION,
    confessionIds: ['1'], // Catholique uniquement
    parishId: '1',
    providerId: '3',
    provider: {
      id: '3',
      firstName: 'Père Jean',
      lastName: 'Kpossou',
      email: 'pere.jean@cathedral-cotonou.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    duration: '45 minutes',
    schedule: [
      {
        id: '2',
        serviceId: '2',
        date: new Date('2024-01-24'),
        startTime: '16:00',
        endTime: '16:45',
        location: 'Sacristie - Cathédrale',
        isOnline: false
      }
    ],
    currentParticipants: 0,
    requirements: ['Examen de conscience', 'Disposition au repentir'],
    imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '3',
    title: 'Messe en direct - Dimanche',
    description: 'Suivez la messe dominicale en direct depuis votre domicile. Communion spirituelle et participation active à la liturgie.',
    type: ServiceType.LIVE_STREAM,
    confessionIds: ['1'], // Catholique uniquement
    parishId: '1',
    providerId: '2',
    provider: {
      id: '2',
      firstName: 'Père Michel',
      lastName: 'Adjovi',
      email: 'pere.michel@cathedral-cotonou.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    duration: '1h 30min',
    schedule: [
      {
        id: '3',
        serviceId: '3',
        date: new Date('2024-01-28'),
        startTime: '09:00',
        endTime: '10:30',
        location: 'En ligne',
        isOnline: true,
        meetingLink: 'https://youtube.com/live/cathedral-cotonou'
      }
    ],
    maxParticipants: 1000,
    currentParticipants: 245,
    imageUrl: 'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '4',
    title: 'Conseil pastoral et accompagnement',
    description: 'Séance de conseil pastoral pour les couples, familles ou individus traversant des difficultés spirituelles ou personnelles.',
    type: ServiceType.COUNSELING,
    confessionIds: ['2', '4'], // Protestant et Évangélique
    providerId: '4',
    provider: {
      id: '4',
      firstName: 'Pasteur Samuel',
      lastName: 'Dossou',
      email: 'pasteur.samuel@eglise-evangelique.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 8000,
    duration: '1 heure',
    schedule: [
      {
        id: '4',
        serviceId: '4',
        date: new Date('2024-01-26'),
        startTime: '14:00',
        endTime: '15:00',
        location: 'Bureau pastoral',
        isOnline: false
      }
    ],
    currentParticipants: 0,
    requirements: ['Rendez-vous préalable', 'Confidentialité assurée'],
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  }
];

// Formations mockées
export const mockFormations: Formation[] = [
  {
    id: '1',
    title: 'Éducation chrétienne des enfants en famille',
    description: 'Formation complète pour les parents chrétiens souhaitant transmettre efficacement les valeurs chrétiennes à leurs enfants. Méthodes pratiques et bibliques adaptées au contexte africain moderne. Découvrez comment élever vos enfants dans la foi tout en respectant leur personnalité et en développant leur relation personnelle avec Jésus.',
    category: FormationCategory.FAMILY_EDUCATION,
    instructorId: '5',
    instructor: {
      id: '5',
      firstName: 'Dr. Marie',
      lastName: 'Agbodjan',
      email: 'dr.marie@formation-chretienne.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 25000,
    duration: '6 semaines',
    modules: [
      {
        id: '1',
        title: 'Fondements bibliques de l\'éducation',
        description: 'Les principes bibliques pour élever des enfants dans la foi',
        duration: '1h 30min',
        videoUrl: 'https://example.com/video1',
        resources: ['Guide PDF', 'Exercices pratiques'],
        order: 1
      },
      {
        id: '3',
        title: 'Gestion des conflits familiaux',
        description: 'Résoudre les tensions avec amour et sagesse chrétienne',
        duration: '1h 45min',
        videoUrl: 'https://example.com/video3',
        resources: ['Guide de médiation', 'Prières familiales'],
        order: 3
      },
      {
        id: '4',
        title: 'Développer la spiritualité des enfants',
        description: 'Activités et pratiques pour nourrir la foi des plus jeunes',
        duration: '2h 00min',
        videoUrl: 'https://example.com/video4',
        resources: ['Activités ludiques', 'Chants pour enfants'],
        order: 4
      },
      {
        id: '5',
        title: 'Session live Q&A avec Dr. Marie',
        description: 'Session interactive pour répondre à toutes vos questions',
        duration: '1h 30min',
        resources: ['Replay disponible', 'Support chat'],
        order: 5
      },
      {
        id: '6',
        title: 'Évaluation finale et certification',
        description: 'Quiz final et obtention de votre certificat',
        duration: '45min',
        resources: ['Certificat PDF', 'Badge numérique'],
        order: 6
      },
      {
        id: '2',
        title: 'Communication avec les enfants',
        description: 'Techniques de communication bienveillante et efficace',
        duration: '1h 15min',
        videoUrl: 'https://example.com/video2',
        resources: ['Fiches pratiques', 'Exemples concrets'],
        order: 2
      }
    ],
    maxStudents: 50,
    currentStudents: 23,
    rating: 4.8,
    reviewsCount: 15,
    imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Vie de couple selon les Écritures',
    description: 'Parcours de formation pour couples chrétiens : communication, résolution de conflits, intimité spirituelle et construction d\'un foyer solide. Renforcez votre union par la Parole de Dieu et les conseils pratiques de pasteurs expérimentés.',
    category: FormationCategory.COUPLE_LIFE,
    instructorId: '6',
    instructor: {
      id: '6',
      firstName: 'Pasteur David',
      lastName: 'Houngbo',
      email: 'pasteur.david@couple-chretien.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 35000,
    duration: '8 semaines',
    modules: [
      {
        id: '3',
        title: 'Le mariage dans le plan de Dieu',
        description: 'Vision biblique du mariage et des rôles conjugaux',
        duration: '2 heures',
        videoUrl: 'https://example.com/video3',
        resources: ['Manuel du couple', 'Questionnaire d\'évaluation'],
        order: 1
      },
      {
        id: '7',
        title: 'Communication dans le couple',
        description: 'Techniques de communication saine et bienveillante',
        duration: '1h 45min',
        videoUrl: 'https://example.com/video7',
        resources: ['Exercices pratiques', 'Guide de dialogue'],
        order: 2
      },
      {
        id: '8',
        title: 'Gestion des finances familiales',
        description: 'Principes bibliques pour une gestion sage de l\'argent',
        duration: '1h 30min',
        videoUrl: 'https://example.com/video8',
        resources: ['Budget familial', 'Outils de planification'],
        order: 3
      },
      {
        id: '9',
        title: 'Intimité spirituelle et physique',
        description: 'Équilibre entre spiritualité et intimité conjugale',
        duration: '2h 15min',
        videoUrl: 'https://example.com/video9',
        resources: ['Guide intime', 'Prières de couple'],
        order: 4
      }
    ],
    maxStudents: 30,
    currentStudents: 18,
    rating: 4.9,
    reviewsCount: 12,
    imageUrl: 'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Leadership chrétien et service',
    description: 'Développez vos compétences de leadership selon les principes bibliques. Formation destinée aux responsables d\'église et ministères. Apprenez à diriger avec humilité, sagesse et efficacité selon l\'exemple du Christ.',
    category: FormationCategory.LEADERSHIP,
    instructorId: '7',
    instructor: {
      id: '7',
      firstName: 'Évêque Paul',
      lastName: 'Soglo',
      email: 'eveque.paul@leadership-chretien.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 45000,
    duration: '10 semaines',
    modules: [
      {
        id: '4',
        title: 'Les qualités du leader chrétien',
        description: 'Caractéristiques bibliques d\'un bon leader',
        duration: '1h 45min',
        videoUrl: 'https://example.com/video4',
        resources: ['Profil de leadership', 'Plan de développement'],
        order: 1
      },
      {
        id: '10',
        title: 'Vision et stratégie ministérielle',
        description: 'Développer une vision claire pour votre ministère',
        duration: '2h 00min',
        videoUrl: 'https://example.com/video10',
        resources: ['Canevas de vision', 'Outils de planification'],
        order: 2
      },
      {
        id: '11',
        title: 'Gestion d\'équipe et délégation',
        description: 'Principes bibliques de management et délégation',
        duration: '1h 30min',
        videoUrl: 'https://example.com/video11',
        resources: ['Grilles d\'évaluation', 'Modèles de délégation'],
        order: 3
      }
    ],
    maxStudents: 25,
    currentStudents: 15,
    rating: 4.7,
    reviewsCount: 8,
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

// Activités paroissiales mockées
export const mockParishActivities: ParishActivity[] = [
  {
    id: '1',
    title: 'Messe dominicale - Cathédrale',
    description: 'Messe dominicale solennelle avec chorale et prédication. Venez nombreux pour célébrer ensemble la résurrection du Christ.',
    type: ActivityType.MASS,
    parishId: '1',
    parish: {
      id: '1',
      name: 'Cathédrale Notre-Dame de Miséricorde',
      confessionId: '1',
      cityId: '1',
      address: 'Boulevard de la Marina, Cotonou',
      validated: true
    },
    organizerId: '2',
    organizer: {
      id: '2',
      firstName: 'Père Michel',
      lastName: 'Adjovi',
      email: 'pere.michel@cathedral-cotonou.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    date: new Date('2024-01-28'),
    startTime: '09:00',
    endTime: '10:30',
    location: 'Cathédrale Notre-Dame de Miséricorde',
    maxParticipants: 500,
    currentParticipants: 234,
    isRecurring: true,
    recurrencePattern: 'weekly',
    imageUrl: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Soirée de prière et louange',
    description: 'Temps de prière communautaire, louanges et intercession pour notre nation et nos familles. Apportez vos instruments de musique !',
    type: ActivityType.PRAYER_MEETING,
    parishId: '4',
    parish: {
      id: '4',
      name: 'Église Évangélique du Bénin',
      confessionId: '4',
      cityId: '1',
      address: 'Quartier Godomey, Cotonou',
      validated: true
    },
    organizerId: '4',
    organizer: {
      id: '4',
      firstName: 'Pasteur Samuel',
      lastName: 'Dossou',
      email: 'pasteur.samuel@eglise-evangelique.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    date: new Date('2024-01-26'),
    startTime: '19:00',
    endTime: '21:00',
    location: 'Salle principale - Église Évangélique',
    maxParticipants: 150,
    currentParticipants: 67,
    isRecurring: true,
    recurrencePattern: 'weekly',
    imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'Étude biblique - Livre des Actes',
    description: 'Étude approfondie du livre des Actes des Apôtres. Découvrons ensemble les premiers pas de l\'Église primitive et leurs leçons pour aujourd\'hui.',
    type: ActivityType.BIBLE_STUDY,
    parishId: '1',
    parish: {
      id: '1',
      name: 'Cathédrale Notre-Dame de Miséricorde',
      confessionId: '1',
      cityId: '1',
      address: 'Boulevard de la Marina, Cotonou',
      validated: true
    },
    organizerId: '8',
    organizer: {
      id: '8',
      firstName: 'Sœur Marie',
      lastName: 'Akpovi',
      email: 'soeur.marie@cathedral-cotonou.org',
      role: 'vigneron' as any,
      level: 'moissonneur' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    date: new Date('2024-01-25'),
    startTime: '18:30',
    endTime: '20:00',
    location: 'Salle paroissiale',
    maxParticipants: 40,
    currentParticipants: 28,
    requirements: ['Bible personnelle', 'Carnet de notes'],
    isRecurring: true,
    recurrencePattern: 'weekly',
    imageUrl: 'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '4',
    title: 'Collecte de vivres pour les démunis',
    description: 'Action caritative pour collecter des vivres et vêtements pour les familles démunies de notre quartier. Votre générosité fait la différence !',
    type: ActivityType.CHARITY_EVENT,
    parishId: '1',
    parish: {
      id: '1',
      name: 'Cathédrale Notre-Dame de Miséricorde',
      confessionId: '1',
      cityId: '1',
      address: 'Boulevard de la Marina, Cotonou',
      validated: true
    },
    organizerId: '9',
    organizer: {
      id: '9',
      firstName: 'Diacre Pierre',
      lastName: 'Gbaguidi',
      email: 'diacre.pierre@cathedral-cotonou.org',
      role: 'vigneron' as any,
      level: 'moissonneur' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    date: new Date('2024-01-27'),
    startTime: '08:00',
    endTime: '17:00',
    location: 'Parvis de la cathédrale',
    currentParticipants: 45,
    requirements: ['Vivres non périssables', 'Vêtements en bon état'],
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

// Groupes mockés
export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Jeunes Chrétiens de Cotonou',
    description: 'Groupe pour les jeunes chrétiens de 18-35 ans de Cotonou. Partage, prière, activités et témoignages pour grandir ensemble dans la foi.',
    type: GroupType.YOUTH,
    visibility: GroupVisibility.PUBLIC,
    confessionIds: ['1', '2', '4'], // Multi-confessionnel
    creatorId: '10',
    creator: {
      id: '10',
      firstName: 'Grace',
      lastName: 'Tossou',
      email: 'grace.tossou@example.com',
      role: 'brebis' as any,
      level: 'moissonneur' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    moderatorIds: ['10', '11'],
    memberIds: ['10', '11', '12', '13', '14'],
    memberCount: 45,
    maxMembers: 100,
    rules: [
      'Respect mutuel et bienveillance',
      'Partage dans l\'amour du Christ',
      'Pas de prosélytisme entre confessions',
      'Confidentialité des témoignages personnels'
    ],
    imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    title: 'Évangélisation moderne et témoignage',
    description: 'Apprenez les techniques modernes d\'évangélisation adaptées au contexte béninois et africain. Formation pratique avec mise en situation réelle.',
    category: FormationCategory.EVANGELIZATION,
    instructorId: '8',
    instructor: {
      id: '8',
      firstName: 'Pasteur Emmanuel',
      lastName: 'Ahouansou',
      email: 'pasteur.emmanuel@evangelisation.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 20000,
    duration: '4 semaines',
    modules: [
      {
        id: '12',
        title: 'Fondements de l\'évangélisation',
        description: 'Base biblique et théologique du témoignage chrétien',
        duration: '1h 20min',
        videoUrl: 'https://example.com/video12',
        resources: ['Manuel d\'évangélisation', 'Versets clés'],
        order: 1
      },
      {
        id: '13',
        title: 'Techniques de témoignage personnel',
        description: 'Comment partager sa foi de manière naturelle et authentique',
        duration: '1h 40min',
        videoUrl: 'https://example.com/video13',
        resources: ['Scripts de témoignage', 'Exercices pratiques'],
        order: 2
      }
    ],
    maxStudents: 40,
    currentStudents: 32,
    rating: 4.6,
    reviewsCount: 22,
    imageUrl: 'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '5',
    title: 'Théologie pratique pour serviteurs',
    description: 'Formation théologique approfondie pour les serviteurs et futurs pasteurs. Étude systématique des doctrines chrétiennes avec application pratique.',
    category: FormationCategory.THEOLOGY,
    instructorId: '9',
    instructor: {
      id: '9',
      firstName: 'Dr. Samuel',
      lastName: 'Zinsou',
      email: 'dr.samuel@theologie-pratique.org',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    price: 55000,
    duration: '12 semaines',
    modules: [
      {
        id: '14',
        title: 'Introduction à la théologie systématique',
        description: 'Bases de la doctrine chrétienne et méthodes d\'étude',
        duration: '2h 30min',
        videoUrl: 'https://example.com/video14',
        resources: ['Manuel de théologie', 'Bibliographie'],
        order: 1
      },
      {
        id: '15',
        title: 'Herméneutique biblique',
        description: 'Principes d\'interprétation des Écritures',
        duration: '2h 15min',
        videoUrl: 'https://example.com/video15',
        resources: ['Guide d\'interprétation', 'Exercices d\'exégèse'],
        order: 2
      },
    ],
    maxStudents: 20,
    currentStudents: 12,
    rating: 4.9,
    reviewsCount: 6,
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '2',
    name: 'Familles Catholiques du Bénin',
    description: 'Espace d\'échange et de soutien pour les familles catholiques. Partage d\'expériences, conseils éducatifs et prières communes.',
    type: GroupType.FAMILY,
    visibility: GroupVisibility.PRIVATE,
    confessionIds: ['1'], // Catholique uniquement
    creatorId: '15',
    creator: {
      id: '15',
      firstName: 'Maman Célestine',
      lastName: 'Zinsou',
      email: 'celestine.zinsou@example.com',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    moderatorIds: ['15', '16'],
    memberIds: ['15', '16', '17', '18'],
    memberCount: 32,
    maxMembers: 80,
    rules: [
      'Réservé aux familles catholiques',
      'Respect de l\'enseignement de l\'Église',
      'Partage constructif et bienveillant',
      'Protection de la vie privée des enfants'
    ],
    imageUrl: 'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '3',
    name: 'Prière pour le Bénin',
    description: 'Groupe de prière intercessionnel pour notre nation béninoise. Prions ensemble pour la paix, la prospérité et le réveil spirituel.',
    type: GroupType.PRAYER,
    visibility: GroupVisibility.PUBLIC,
    creatorId: '17',
    creator: {
      id: '17',
      firstName: 'Pasteur Emmanuel',
      lastName: 'Ahouansou',
      email: 'pasteur.emmanuel@example.com',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    moderatorIds: ['17', '18'],
    memberIds: ['17', '18', '19', '20'],
    memberCount: 78,
    rules: [
      'Prières centrées sur le Bénin',
      'Respect de toutes les confessions chrétiennes',
      'Pas de politique partisane',
      'Prières constructives et positives'
    ],
    imageUrl: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '4',
    name: 'Entrepreneurs Chrétiens',
    description: 'Réseau d\'entrepreneurs et professionnels chrétiens. Partage d\'opportunités, conseils business et prières pour nos activités.',
    type: GroupType.PROFESSIONAL,
    visibility: GroupVisibility.PRIVATE,
    creatorId: '19',
    creator: {
      id: '19',
      firstName: 'David',
      lastName: 'Mama',
      email: 'david.mama@example.com',
      role: 'vigneron' as any,
      level: 'moissonneur' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    moderatorIds: ['19', '20'],
    memberIds: ['19', '20', '21', '22'],
    memberCount: 25,
    maxMembers: 50,
    rules: [
      'Entrepreneurs et professionnels uniquement',
      'Éthique chrétienne dans les affaires',
      'Entraide et partage d\'opportunités',
      'Confidentialité des informations business'
    ],
    imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  }
];