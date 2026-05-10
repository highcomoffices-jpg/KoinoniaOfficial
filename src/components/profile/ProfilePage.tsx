import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, MapPin, Church, Calendar, Award, Crown, Star, TrendingUp, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { EditProfileModal } from './EditProfileModal';
import { userService } from '../../services/userService';
import { mockUserBadges, mockSpiritualRanking } from '../../data/mockPremiumData';
import type { EnrichedProfile } from '../../services/userService';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'badges' | 'ranking'>('info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [enrichedUser, setEnrichedUser] = useState<EnrichedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load enriched user data
  useEffect(() => {
    const loadEnrichedData = async () => {
      if (!user) return;
      
      console.log('1. Loading enriched profile for user:', user.id);
      setIsLoading(true);
      try {
        const profileData = await userService.getEnrichedProfile(user.id);
        console.log('2. Enriched profile loaded successfully:', {
          hasData: !!profileData,
          country: profileData?.country,
          city: profileData?.city,
          confession: profileData?.confession,
          parish: profileData?.parish
        });
        setEnrichedUser(profileData);
      } catch (error: any) {
        console.error('3. Error loading enriched profile:', {
          message: error.message,
          code: error.code,
          fullError: error
        });
        // Fallback to basic user data
        setEnrichedUser(user as any);
      } finally {
        setIsLoading(false);
        console.log('4. Loading complete');
      }
    };
  
    loadEnrichedData();
  }, [user]);

  if (!user) return null;

  const userRanking = mockSpiritualRanking.find(r => r.userId === user.id);
  const userBadges = mockUserBadges.filter(b => b.userId === user.id);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const tabs = [
    { id: 'info', label: 'Informations', icon: User },
    { id: 'badges', label: 'Badges & Récompenses', icon: Award },
    { id: 'ranking', label: 'Classement Spirituel', icon: Crown }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'badges':
        return <BadgesSection userBadges={userBadges} />;
      case 'ranking':
        return <RankingSection userRanking={userRanking} />;
      default:
        return <ProfileInfoSection 
          user={user} 
          enrichedUser={enrichedUser} 
          formatDate={formatDate} 
          isLoading={isLoading} 
        />;
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const profileData = await userService.getEnrichedProfile(user.id);
      setEnrichedUser(profileData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Safely get user initials
  const getUserInitials = () => {
    if (!user.firstName || !user.lastName) return '?';
    return `${user.firstName[0] || ''}${user.lastName[0] || ''}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* En-tête du profil */}
      <Card>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-spiritual-400 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-white text-2xl font-bold">
                  {getUserInitials()}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                    {user.role ? t(`role.${user.role}`) : 'Non défini'}
                  </span>
                  <span className="px-3 py-1 bg-spiritual-100 text-spiritual-800 text-sm rounded-full">
                    {user.level ? t(`level.${user.level}`) : 'Non défini'}
                  </span>
                  {userRanking && (
                    <span className="px-3 py-1 bg-gradient-to-r from-warm-500 to-orange-500 text-white text-sm rounded-full">
                      Rang #{userRanking.rank}
                    </span>
                  )}
                </div>
                {userRanking && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {userRanking.totalPoints} points spirituels
                    </span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  icon={Edit} 
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Modifier
                </Button>
                <Button 
                  variant="ghost" 
                  icon={LogOut}
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>

        {user.bio && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </div>
        )}
      </Card>

      {/* Navigation par onglets */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-gradient-to-r from-spiritual-500 to-primary-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'badges' && userBadges.length > 0 && (
                  <span className="bg-white bg-opacity-20 text-xs rounded-full px-2 py-0.5">
                    {userBadges.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Contenu de l'onglet */}
      {renderTabContent()}

      {/* Profil incomplet - Actions */}
      {!user.profileComplete && (
        <Card className="bg-gradient-to-r from-warm-50 to-primary-50 border-warm-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-warm-800 mb-2">
              Profil incomplet
            </h3>
            <p className="text-warm-700 mb-4">
              Complétez votre profil pour profiter de toutes les fonctionnalités
            </p>
            <Button 
              variant="primary"
              onClick={() => setIsEditModalOpen(true)}
            >
              Compléter mon profil
            </Button>
          </div>
        </Card>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

interface ProfileInfoSectionProps {
  user: any;
  enrichedUser: EnrichedProfile | null;
  formatDate: (date: Date) => string;
  isLoading: boolean;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ 
  user, 
  enrichedUser, 
  formatDate,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Informations géographiques */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-primary-600" />
          Localisation
        </h2>
        <div className="space-y-3">
          {enrichedUser?.country && (
            <div>
              <span className="text-sm text-gray-500">Pays</span>
              <p className="font-medium">{enrichedUser.country.name}</p>
            </div>
          )}
          {enrichedUser?.city && (
            <div>
              <span className="text-sm text-gray-500">Ville</span>
              <p className="font-medium">{enrichedUser.city.name}</p>
            </div>
          )}
          {(!enrichedUser?.country && !enrichedUser?.city) && user.city && (
            <div>
              <span className="text-sm text-gray-500">Ville</span>
              <p className="font-medium">{user.city}</p>
            </div>
          )}
          {!enrichedUser?.country && !enrichedUser?.city && !user.city && (
            <div>
              <span className="text-sm text-gray-500">Localisation</span>
              <p className="font-medium text-gray-400">Non renseignée</p>
            </div>
          )}
        </div>
      </Card>

      {/* Informations religieuses */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Church className="w-5 h-5 mr-2 text-spiritual-600" />
          Confession religieuse
        </h2>
        <div className="space-y-3">
          {enrichedUser?.confession && (
            <div>
              <span className="text-sm text-gray-500">Confession</span>
              <p className="font-medium">{enrichedUser.confession.name}</p>
            </div>
          )}
          {enrichedUser?.parish && (
            <div>
              <span className="text-sm text-gray-500">Paroisse/Église</span>
              <p className="font-medium">{enrichedUser.parish.name}</p>
            </div>
          )}
          {!enrichedUser?.confession && !enrichedUser?.parish && (
            <div>
              <span className="text-sm text-gray-500">Informations religieuses</span>
              <p className="font-medium text-gray-400">Non renseignées</p>
            </div>
          )}
        </div>
      </Card>

      {/* Informations du compte */}
      <Card className="md:col-span-2">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-600" />
          Informations du compte
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-gray-500">Email</span>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Membre depuis</span>
            <p className="font-medium">{formatDate(user.createdAt)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Statut du profil</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${user.profileComplete ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="font-medium">
                {user.profileComplete ? 'Complet' : 'Incomplet'}
              </span>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Dernière mise à jour</span>
            <p className="font-medium">{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface BadgesSectionProps {
  userBadges: any[];
}

const BadgesSection: React.FC<BadgesSectionProps> = ({ userBadges }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Mes badges et récompenses</h2>
        <p className="text-gray-600">Vos accomplissements spirituels reconnus par la communauté</p>
      </div>

      {userBadges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userBadges.map((userBadge) => (
            <Card key={userBadge.id} className="text-center">
              <div className="text-4xl mb-3">{userBadge.badge.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{userBadge.badge.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{userBadge.badge.description}</p>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  userBadge.badge.rarity === 'legendary' ? 'bg-purple-100 text-purple-800' :
                  userBadge.badge.rarity === 'epic' ? 'bg-orange-100 text-orange-800' :
                  userBadge.badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {userBadge.badge.rarity}
                </span>
                <span className="text-xs text-gray-500">
                  {userBadge.badge.pointsValue} points
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Obtenu le {new Intl.DateTimeFormat('fr').format(userBadge.unlockedAt)}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun badge pour le moment</h3>
          <p className="text-gray-600 mb-4">
            Participez aux activités communautaires pour débloquer vos premiers badges !
          </p>
          <Button variant="primary">Découvrir les défis</Button>
        </Card>
      )}
    </div>
  );
};

interface RankingSectionProps {
  userRanking: any;
}

const RankingSection: React.FC<RankingSectionProps> = ({ userRanking }) => {
  if (!userRanking) {
    return (
      <Card className="text-center py-12">
        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Classement non disponible</h3>
        <p className="text-gray-600">Participez aux activités pour être classé !</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Mon classement spirituel</h2>
        <p className="text-gray-600">Votre progression dans la communauté Koinonia</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-primary-600">#{userRanking.rank}</div>
          <div className="text-sm text-gray-600">Rang global</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-spiritual-600">{userRanking.totalPoints}</div>
          <div className="text-sm text-gray-600">Points spirituels</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-warm-600">{userRanking.badges.length}</div>
          <div className="text-sm text-gray-600">Badges obtenus</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-green-600">{userRanking.achievements.length}</div>
          <div className="text-sm text-gray-600">Accomplissements</div>
        </Card>
      </div>

      {/* Niveau spirituel */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Niveau spirituel</h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-warm-400 to-orange-400 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 capitalize">{userRanking.level}</h4>
            <p className="text-gray-600">Niveau actuel dans votre parcours spirituel</p>
          </div>
        </div>
      </Card>

      {/* Accomplissements récents */}
      {userRanking.achievements.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accomplissements récents</h3>
          <div className="space-y-3">
            {userRanking.achievements.map((achievement: any, index: number) => (
              <div key={achievement.id || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary-600">
                    +{achievement.pointsAwarded} points
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Intl.DateTimeFormat('fr').format(achievement.unlockedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};