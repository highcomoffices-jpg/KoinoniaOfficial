import { 
  LiveCelebration, 
  BiblicalPath, 
  LocationMeditation, 
  PrayerWall, 
  CommunityChallenge, 
  SpiritualBadge,
  UserBadge,
  SpiritualRanking,
  Organization,
  PaymentMethod,
  BiblicalPathCategory,
  LocationType,
  PrayerCategory,
  ChallengeType,
  BadgeCategory,
  SpiritualLevel
} from '../types/premium';
import { mockCurrentUser, mockParishes } from './mockData';

// Organisations caritatives
export const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Enfants Bénis du Bénin',
    description: 'Association caritative pour l\'éducation et la santé des enfants défavorisés',
    type: 'charity',
    contactEmail: 'contact@enfantsbenisbenin.org',
    website: 'https://enfantsbenisbenin.org',
    logoUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=150',
    isVerified: true,
    totalReceived: 2450000,
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Espoir et Vie - Cotonou',
    description: 'Soutien aux familles en difficulté et aux personnes âgées',
    type: 'charity',
    contactEmail: 'info@espoirvie.org',
    isVerified: true,
    totalReceived: 1890000,
    createdAt: new Date('2023-03-20')
  }
];

// Célébrations live
export const mockLiveCelebrations: LiveCelebration[] = [
  {
    id: '1',
    title: 'Culte de Louange et Guérison',
    description: 'Service spécial de louange avec prières de guérison pour notre communauté',
    organizerId: '2',
    organizer: {
      id: '2',
      firstName: 'Pasteur Samuel',
      lastName: 'Dossou',
      email: 'pasteur.samuel@example.com',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    parishIds: ['1', '4'],
    parishes: [mockParishes[0], mockParishes[3]],
    startTime: new Date('2024-01-28T19:00:00'),
    endTime: new Date('2024-01-28T21:00:00'),
    streamUrl: 'https://youtube.com/live/celebration-1',
    isLive: true,
    totalOfferings: 45000,
    participantCount: 127,
    showDonorNames: false,
    offerings: [],
    imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-28T19:30:00')
  },
  {
    id: '2',
    title: 'Anniversaire Église Béthel - 25 ans',
    description: 'Célébration spéciale pour les 25 ans de l\'Église Béthel avec témoignages',
    organizerId: '3',
    organizer: {
      id: '3',
      firstName: 'Évêque Paul',
      lastName: 'Soglo',
      email: 'eveque.paul@example.com',
      role: 'vigneron' as any,
      level: 'berger' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    parishIds: ['4'],
    parishes: [mockParishes[3]],
    startTime: new Date('2024-02-03T15:00:00'),
    streamUrl: 'https://youtube.com/live/celebration-2',
    isLive: false,
    totalOfferings: 125000,
    participantCount: 89,
    showDonorNames: true,
    offerings: [],
    imageUrl: 'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

// Parcours bibliques IA
export const mockBiblicalPaths: BiblicalPath[] = [
  {
    id: '1',
    title: 'Soulagement dans l\'épreuve',
    description: 'Parcours personnalisé pour trouver la paix et l\'espoir dans les moments difficiles',
    category: BiblicalPathCategory.INNER_PEACE,
    difficulty: 'beginner',
    duration: 7,
    steps: [
      {
        id: '1',
        pathId: '1',
        day: 1,
        title: 'Dieu est mon refuge',
        description: 'Découvrez la protection divine dans les tempêtes de la vie',
        bibleVerse: 'L\'Éternel est mon berger : je ne manquerai de rien.',
        verseReference: 'Psaume 23:1',
        audioUrl: 'https://example.com/audio/psaume23-fon.mp3',
        meditationText: 'Dans les moments d\'épreuve, rappelons-nous que Dieu est notre berger fidèle...',
        reflectionQuestions: [
          'Comment puis-je faire confiance à Dieu dans cette situation ?',
          'Quelles sont les bénédictions que je peux voir malgré les difficultés ?'
        ],
        isCompleted: false
      }
    ],
    isAIGenerated: true,
    isPremium: true,
    completionRate: 0,
    imageUrl: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Harmonie familiale chrétienne',
    description: 'Parcours pour renforcer les liens familiaux selon les principes bibliques',
    category: BiblicalPathCategory.FAMILY_ISSUES,
    difficulty: 'intermediate',
    duration: 14,
    steps: [],
    isAIGenerated: true,
    isPremium: true,
    completionRate: 0,
    imageUrl: 'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
];

// Méditations géolocalisées
export const mockLocationMeditations: LocationMeditation[] = [
  {
    id: '1',
    title: 'Méditation Éclat - Sainte-Anne',
    description: 'Méditation spéciale pour les visiteurs de l\'Église Sainte-Anne',
    bibleVerse: 'Ne crains rien, car je suis avec toi; Ne promène pas des regards inquiets, car je suis ton Dieu',
    verseReference: 'Isaïe 41:10',
    audioUrl: 'https://example.com/audio/meditation-sainte-anne.mp3',
    duration: 5,
    latitude: 6.4969,
    longitude: 2.6283,
    radius: 100,
    locationName: 'Église Sainte-Anne de Porto-Novo',
    locationType: LocationType.CHURCH,
    language: 'fr',
    isPremium: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Paix au Calvaire',
    description: 'Méditation contemplative près de la croix du Calvaire',
    bibleVerse: 'Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos',
    verseReference: 'Matthieu 11:28',
    audioUrl: 'https://example.com/audio/meditation-calvaire.mp3',
    duration: 8,
    latitude: 6.3703,
    longitude: 2.3912,
    radius: 50,
    locationName: 'Calvaire de Cotonou',
    locationType: LocationType.CROSS,
    language: 'fr',
    isPremium: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
];

// Mur des prières
export const mockPrayerWall: PrayerWall[] = [
  {
    id: '1',
    title: 'Guérison pour ma mère',
    description: 'Ma mère souffre d\'une maladie grave. Priez pour sa guérison complète.',
    category: PrayerCategory.HEALING,
    requesterId: '4',
    requester: {
      id: '4',
      firstName: 'Marie',
      lastName: 'Adjovi',
      email: 'marie.adjovi@example.com',
      role: 'brebis' as any,
      level: 'semeur' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    isAnonymous: false,
    prayerCount: 234,
    targetPrayerCount: 500,
    isAnswered: false,
    isPremium: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-28')
  },
  {
    id: '2',
    title: 'Réconciliation familiale',
    description: 'Prière pour la réconciliation dans ma famille après des années de conflit.',
    category: PrayerCategory.FAMILY,
    requesterId: '5',
    requester: {
      id: '5',
      firstName: 'Anonyme',
      lastName: '',
      email: '',
      role: 'brebis' as any,
      level: 'semeur' as any,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    isAnonymous: true,
    prayerCount: 89,
    isAnswered: true,
    answeredAt: new Date('2024-01-25'),
    testimony: 'Gloire à Dieu ! Ma famille s\'est réconciliée après 3 ans de séparation.',
    isPremium: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-25')
  }
];

// Défis communautaires
export const mockCommunityChallenge: CommunityChallenge[] = [
  {
    id: '1',
    title: '50 000 prières pour les orphelins de Dassa',
    description: 'Unissons-nous dans la prière pour les enfants orphelins de Dassa-Zoumé',
    type: ChallengeType.PRAYER_COUNT,
    targetCount: 50000,
    currentCount: 34567,
    reward: {
      type: 'donation',
      amount: 100000,
      currency: 'FCFA',
      beneficiaryId: '1',
      beneficiary: mockOrganizations[0],
      description: '100 000 FCFA seront versés à l\'association Enfants Bénis du Bénin'
    },
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    participantIds: ['1', '2', '3', '4'],
    participants: [],
    isActive: true,
    isCompleted: false,
    imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-28')
  },
  {
    id: '2',
    title: '100 000 Amen pour la paix au Bénin',
    description: 'Disons ensemble 100 000 Amen pour la paix et l\'unité dans notre nation',
    type: ChallengeType.PRAYER_COUNT,
    targetCount: 100000,
    currentCount: 78234,
    reward: {
      type: 'badge',
      badgeId: '1',
      description: 'Badge spécial "Artisan de Paix" pour tous les participants'
    },
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    participantIds: ['1', '2', '3', '4', '5'],
    participants: [],
    isActive: true,
    isCompleted: false,
    imageUrl: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-28')
  }
];

// Badges spirituels
export const mockSpiritualBadges: SpiritualBadge[] = [
  {
    id: '1',
    name: 'Artisan de Paix',
    description: 'Décerné pour la participation active aux défis de prière pour la paix',
    icon: '🕊️',
    color: '#10B981',
    category: BadgeCategory.PRAYER,
    requirements: [
      {
        type: 'prayers',
        count: 100,
        description: 'Participer à 100 prières collectives'
      }
    ],
    rarity: 'rare',
    pointsValue: 500,
    unlockedBy: ['1', '2', '3'],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Moissonneur de Bénédictions',
    description: 'Pour ceux qui partagent généreusement leurs bénédictions',
    icon: '🌾',
    color: '#F59E0B',
    category: BadgeCategory.GENEROSITY,
    requirements: [
      {
        type: 'donations',
        count: 50,
        description: 'Effectuer 50 micro-dons'
      }
    ],
    rarity: 'epic',
    pointsValue: 1000,
    unlockedBy: ['1'],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Porteur de Lumière',
    description: 'Illumine la communauté par ses publications inspirantes',
    icon: '💡',
    color: '#8B5CF6',
    category: BadgeCategory.COMMUNITY,
    requirements: [
      {
        type: 'posts',
        count: 30,
        description: 'Publier 30 posts inspirants'
      }
    ],
    rarity: 'common',
    pointsValue: 200,
    unlockedBy: ['1', '2', '3', '4'],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Éclaireur de Nations',
    description: 'Guide spirituel reconnu pour son impact international',
    icon: '🌍',
    color: '#EF4444',
    category: BadgeCategory.LEADERSHIP,
    requirements: [
      {
        type: 'formations',
        count: 10,
        description: 'Compléter 10 formations spirituelles'
      },
      {
        type: 'activities',
        count: 25,
        description: 'Organiser 25 activités communautaires'
      }
    ],
    rarity: 'legendary',
    pointsValue: 2500,
    unlockedBy: [],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'Semeur de Paix',
    description: 'Reconnu pour ses contributions à la paix communautaire',
    icon: '🌱',
    color: '#06B6D4',
    category: BadgeCategory.SERVICE,
    requirements: [
      {
        type: 'prayers',
        count: 50,
        description: 'Participer à 50 prières collectives'
      },
      {
        type: 'donations',
        count: 30,
        description: 'Effectuer 30 dons caritatifs'
      }
    ],
    rarity: 'rare',
    pointsValue: 750,
    unlockedBy: ['1', '2'],
    createdAt: new Date('2024-01-01')
  }
];

// Badges utilisateur
export const mockUserBadges: UserBadge[] = [
  {
    id: '1',
    userId: '1',
    badgeId: '3',
    badge: mockSpiritualBadges[2],
    unlockedAt: new Date('2024-01-20'),
    isVisible: true
  },
  {
    id: '2',
    userId: '1',
    badgeId: '5',
    badge: mockSpiritualBadges[4],
    unlockedAt: new Date('2024-01-25'),
    isVisible: true
  }
];

// Classement spirituel
export const mockSpiritualRanking: SpiritualRanking[] = [
  {
    id: '1',
    userId: '1',
    user: mockCurrentUser,
    totalPoints: 950,
    rank: 1,
    badges: mockUserBadges,
    achievements: [
      {
        id: '1',
        name: 'Premier pas',
        description: 'Première connexion à Koinonia',
        icon: '👶',
        pointsAwarded: 50,
        unlockedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Communautaire',
        description: 'Rejoint sa première communauté',
        icon: '🤝',
        pointsAwarded: 100,
        unlockedAt: new Date('2024-01-18')
      }
    ],
    level: SpiritualLevel.SERVANT,
    updatedAt: new Date('2024-01-28')
  }
];