import { MarketItem, MarketCategory } from '../types/market';
import { mockCurrentUser } from './mockData';

// Données mockées pour le Market chrétien avec focus sur le Bénin
export const mockMarketItems: MarketItem[] = [
  {
    id: '1',
    title: 'Bible d\'étude MacArthur - Français',
    description: 'Bible d\'étude complète avec commentaires détaillés. Excellent état, très peu utilisée. Parfaite pour l\'étude approfondie des Écritures.',
    price: 25000,
    category: MarketCategory.BOOKS,
    condition: 'Très bon état',
    imageUrl: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '2',
      firstName: 'Marie',
      lastName: 'Adjovi',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Cotonou, Bénin',
    likes: 12,
    isAvailable: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '2',
    title: 'CD de louange - Hillsong United',
    description: 'Collection de 5 CDs de Hillsong United incluant les plus grands hits. Musique de qualité pour vos moments de louange personnels et communautaires.',
    price: 15000,
    category: MarketCategory.MUSIC,
    condition: 'Bon état',
    imageUrl: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '3',
      firstName: 'Samuel',
      lastName: 'Kpossou',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Porto-Novo, Bénin',
    likes: 8,
    isAvailable: true,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: '3',
    title: 'Croix artisanale en bois d\'ébène',
    description: 'Magnifique croix sculptée à la main par un artisan local béninois. Bois d\'ébène authentique. Parfaite pour décoration murale ou cadeau.',
    price: 8000,
    category: MarketCategory.CRAFTS,
    condition: 'Neuf',
    imageUrl: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '4',
      firstName: 'Abdou',
      lastName: 'Dossou',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Ouidah, Bénin',
    likes: 15,
    isAvailable: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '4',
    title: 'T-shirt "Jesus is my Savior"',
    description: 'T-shirt de qualité avec message chrétien inspirant. Taille M, 100% coton. Idéal pour témoigner de sa foi au quotidien.',
    price: 5000,
    category: MarketCategory.CLOTHING,
    condition: 'Neuf',
    imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '5',
      firstName: 'Fatou',
      lastName: 'Agbodjan',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Parakou, Bénin',
    likes: 6,
    isAvailable: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '5',
    title: 'Cours de guitare pour louange',
    description: 'Professeur de musique chrétien propose des cours de guitare spécialisés dans la louange et l\'adoration. Tous niveaux acceptés.',
    price: 10000,
    category: MarketCategory.SERVICES,
    imageUrl: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '6',
      firstName: 'Pierre',
      lastName: 'Houngbo',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Cotonou, Bénin',
    likes: 20,
    isAvailable: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '6',
    title: 'Retraite spirituelle - Lac Nokoué',
    description: 'Week-end de retraite spirituelle au bord du Lac Nokoué. Programme : prières, méditations, enseignements bibliques et communion fraternelle.',
    price: 35000,
    category: MarketCategory.EVENTS,
    imageUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '7',
      firstName: 'Pasteur Jean',
      lastName: 'Soglo',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Lac Nokoué, Bénin',
    likes: 25,
    isAvailable: true,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: '7',
    title: 'Collecte pour orphelinat chrétien',
    description: 'Collecte de fonds pour soutenir l\'orphelinat "Espoir des Enfants" à Cotonou. Les dons serviront à acheter des fournitures scolaires et de la nourriture.',
    price: 0,
    category: MarketCategory.DONATIONS,
    imageUrl: 'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '8',
      firstName: 'Sœur Marie',
      lastName: 'Akpovi',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Cotonou, Bénin',
    likes: 42,
    isAvailable: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '8',
    title: 'Livre "Jésus t\'appelle" - Sarah Young',
    description: 'Livre de méditations quotidiennes très inspirant. 365 jours de réflexions spirituelles pour approfondir votre relation avec Jésus.',
    price: 12000,
    category: MarketCategory.BOOKS,
    condition: 'Bon état',
    imageUrl: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '9',
      firstName: 'Grace',
      lastName: 'Tossou',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Bohicon, Bénin',
    likes: 9,
    isAvailable: true,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  },
  {
    id: '9',
    title: 'Bracelet avec verset biblique',
    description: 'Bracelet en cuir avec verset Jean 3:16 gravé. Accessoire de foi discret et élégant pour hommes et femmes.',
    price: 3000,
    category: MarketCategory.CLOTHING,
    condition: 'Neuf',
    imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '10',
      firstName: 'David',
      lastName: 'Gbaguidi',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Djougou, Bénin',
    likes: 7,
    isAvailable: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '10',
    title: 'Service de traduction biblique',
    description: 'Traducteur professionnel propose ses services pour traduire des textes bibliques et documents chrétiens du français vers le fon et le yoruba.',
    price: 2000,
    category: MarketCategory.SERVICES,
    imageUrl: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '11',
      firstName: 'Aminata',
      lastName: 'Zinsou',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Porto-Novo, Bénin',
    likes: 14,
    isAvailable: true,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09')
  },
  {
    id: '11',
    title: 'Masque traditionnel béninois chrétien',
    description: 'Masque artisanal béninois avec symboles chrétiens intégrés. Œuvre d\'art culturelle unique réalisée par un artisan expérimenté de Porto-Novo.',
    price: 45000,
    category: MarketCategory.CRAFTS,
    condition: 'Neuf',
    imageUrl: 'https://images.pexels.com/photos/208315/pexels-photo-208315.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '12',
      firstName: 'Maître Codjo',
      lastName: 'Ahouansou',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Porto-Novo, Bénin',
    likes: 18,
    isAvailable: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '12',
    title: 'Album de chants traditionnels béninois chrétiens',
    description: 'Compilation de chants chrétiens traditionnels béninois en fon et yoruba. Musique authentique pour enrichir vos moments de louange culturelle.',
    price: 8000,
    category: MarketCategory.MUSIC,
    condition: 'Neuf',
    imageUrl: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400',
    seller: {
      id: '13',
      firstName: 'Khadija',
      lastName: 'Mama',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    location: 'Abomey, Bénin',
    likes: 11,
    isAvailable: true,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07')
  }
];