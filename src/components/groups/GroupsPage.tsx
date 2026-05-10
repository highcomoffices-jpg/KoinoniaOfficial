import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Users, Plus, Lock, Globe, EyeOff, MessageCircle, Heart, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Pagination } from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { mockGroups } from '../../data/mockServicesData';
import { Group, GroupType, GroupVisibility } from '../../types';

// Helper functions moved outside to be accessible by GroupCard - CORRIGÉ
const getVisibilityIcon = (visibility: GroupVisibility) => {
  switch (visibility) {
    case GroupVisibility.PUBLIC: return Globe;
    case GroupVisibility.PRIVATE: return Lock;
    case GroupVisibility.SECRET: return EyeOff;
    default: return Globe; // Valeur par défaut
  }
};

const getVisibilityColor = (visibility: GroupVisibility) => {
  switch (visibility) {
    case GroupVisibility.PUBLIC: return 'bg-green-100 text-green-800';
    case GroupVisibility.PRIVATE: return 'bg-blue-100 text-blue-800';
    case GroupVisibility.SECRET: return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800'; // Valeur par défaut
  }
};

export const GroupsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<GroupType | ''>('');
  const [selectedVisibility, setSelectedVisibility] = useState<GroupVisibility | ''>('');
  const [showMyGroups, setShowMyGroups] = useState(false);

  // Filtrer les groupes - CODE CORRIGÉ
  const filteredGroups = useMemo(() => {
    return (mockGroups || []).filter(group => {
      if (!group) return false;
      
      const groupName = group?.name || '';
      const groupDescription = group?.description || '';
      const search = searchTerm?.toLowerCase() || '';
      
      const matchesSearch = groupName.toLowerCase().includes(search) ||
                           groupDescription.toLowerCase().includes(search);
      const matchesType = !selectedType || group.type === selectedType;
      const matchesVisibility = !selectedVisibility || group.visibility === selectedVisibility;
      
      // Filtrer selon la confession si applicable
      const isAccessible = !group.confessionIds || 
                          !user?.confession || 
                          group.confessionIds.includes(user.confession.id);
      
      // Filtrer mes groupes
      const isMyGroup = !showMyGroups || 
                       group.memberIds?.includes(user?.id || '') ||
                       group.creatorId === user?.id;
      
      // Ne pas afficher les groupes secrets sauf si on en est membre
      const canSeeSecret = group.visibility !== GroupVisibility.SECRET ||
                          group.memberIds?.includes(user?.id || '') ||
                          group.creatorId === user?.id;
      
      return matchesSearch && matchesType && matchesVisibility && isAccessible && isMyGroup && canSeeSecret && group.isActive;
    });
  }, [searchTerm, selectedType, selectedVisibility, showMyGroups, user]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedGroups,
    goToPage,
    resetPagination
  } = usePagination({ data: filteredGroups, itemsPerPage: 20 });

  // Reset pagination when filters change
  React.useEffect(() => {
    resetPagination();
  }, [searchTerm, selectedType, selectedVisibility, showMyGroups, resetPagination]);

  const groupTypeOptions = [
    { value: GroupType.PRAYER, label: 'Prière' },
    { value: GroupType.BIBLE_STUDY, label: 'Étude biblique' },
    { value: GroupType.YOUTH, label: 'Jeunesse' },
    { value: GroupType.FAMILY, label: 'Famille' },
    { value: GroupType.MINISTRY, label: 'Ministère' },
    { value: GroupType.SUPPORT, label: 'Soutien' },
    { value: GroupType.DISCUSSION, label: 'Discussion' },
    { value: GroupType.PROFESSIONAL, label: 'Professionnel' },
    { value: GroupType.REGIONAL, label: 'Régional' },
    { value: GroupType.OTHER, label: 'Autre' }
  ];

  const visibilityOptions = [
    { value: GroupVisibility.PUBLIC, label: 'Public' },
    { value: GroupVisibility.PRIVATE, label: 'Privé' },
    { value: GroupVisibility.SECRET, label: 'Secret' }
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedVisibility('');
    setShowMyGroups(false);
  };

  // CORRECTION : S'assurer que filteredGroups.length est un nombre valide
  const availableGroupsCount = filteredGroups.length || 0;
  const myGroupsCount = filteredGroups.filter(g => g.memberIds?.includes(user?.id || '')).length || 0;
  const publicGroupsCount = filteredGroups.filter(g => g.visibility === GroupVisibility.PUBLIC).length || 0;
  const totalMembersCount = filteredGroups.reduce((sum, g) => sum + (g.memberCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              Groupes Communautaires
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Rejoignez des groupes de discussion et d'entraide chrétienne
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" icon={MessageCircle} className="w-full sm:w-auto">
              Mes conversations
            </Button>
            <Button variant="primary" icon={Plus} className="w-full sm:w-auto">
              Créer un groupe
            </Button>
          </div>
        </div>

        {/* Statistiques - CORRIGÉ avec des valeurs numériques sûres */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary-600">
              {availableGroupsCount}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Groupes disponibles</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-spiritual-600">
              {myGroupsCount}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Mes groupes</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-warm-600">
              {publicGroupsCount}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Groupes publics</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {totalMembersCount}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Membres total</div>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <div className="space-y-4">
            <div className="flex flex-col space-y-4 xl:flex-row xl:items-center xl:space-y-0 xl:space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher un groupe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as GroupType | '')}
                  options={groupTypeOptions}
                  placeholder="Tous les types"
                  className="w-full sm:min-w-[150px]"
                />
                <Select
                  value={selectedVisibility}
                  onChange={(e) => setSelectedVisibility(e.target.value as GroupVisibility | '')}
                  options={visibilityOptions}
                  placeholder="Toutes visibilités"
                  className="w-full sm:min-w-[150px]"
                />
                <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={showMyGroups}
                    onChange={(e) => setShowMyGroups(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Mes groupes</span>
                </label>
              </div>
            </div>
            
            {(searchTerm || selectedType || selectedVisibility || showMyGroups) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                  {availableGroupsCount} groupe{availableGroupsCount > 1 ? 's' : ''} trouvé{availableGroupsCount > 1 ? 's' : ''}
                </p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Liste des groupes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {paginatedGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={availableGroupsCount}
            itemsPerPage={20}
          />
        )}

        {/* Message si aucun groupe */}
        {availableGroupsCount === 0 && (
          <Card className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun groupe trouvé
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">
              Aucun groupe ne correspond à vos critères de recherche.
            </p>
            <Button variant="primary" icon={Plus}>
              Créer un groupe
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  
  // CORRECTION : S'assurer que l'icône n'est jamais undefined
  const VisibilityIcon = getVisibilityIcon(group.visibility) || Globe;
  const isMember = group.memberIds?.includes(user?.id || '');
  const isCreator = group.creatorId === user?.id;
  const isModerator = group.moderatorIds?.includes(user?.id || '');
  const isFull = group.maxMembers && group.memberCount >= group.maxMembers;

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleJoin = () => {
    // Logique pour rejoindre le groupe
    console.log('Rejoindre le groupe:', group.id);
  };

  const handleChat = () => {
    // Logique pour ouvrir le chat du groupe
    console.log('Ouvrir le chat du groupe:', group.id);
  };

  // CORRECTION : Valeurs par défaut pour éviter les erreurs
  const groupName = group?.name || 'Nom inconnu';
  const groupDescription = group?.description || 'Aucune description';
  const creatorFirstName = group.creator?.firstName || 'Utilisateur';
  const creatorLastName = group.creator?.lastName || '';
  const memberCount = group.memberCount || 0;
  const maxMembers = group.maxMembers || 0;

  return (
    <Card hover className="h-full flex flex-col">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-spiritual-400 to-primary-400 rounded-lg flex items-center justify-center flex-shrink-0">
            {group.imageUrl ? (
              <img
                src={group.imageUrl}
                alt={groupName}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Users className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
              {groupName}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getVisibilityColor(group.visibility)}`}>
                <VisibilityIcon className="w-3 h-3 inline mr-1" />
                {group.visibility}
              </span>
              {isMember && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Membre
                </span>
              )}
              {isCreator && (
                <Crown className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleLike}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Description */}
      <div className="flex-1 space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">
          {groupDescription}
        </p>

        {/* Créateur */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-5 h-5 bg-gradient-to-br from-primary-400 to-spiritual-400 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {creatorFirstName[0]}
            </span>
          </div>
          <span>Créé par {creatorFirstName} {creatorLastName}</span>
        </div>

        {/* Statistiques */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>
              {memberCount}{maxMembers ? `/${maxMembers}` : ''} membres
            </span>
          </div>
          <div className="text-xs">
            {group.createdAt ? new Intl.DateTimeFormat('fr', { 
              day: 'numeric', 
              month: 'short' 
            }).format(group.createdAt) : 'Date inconnue'}
          </div>
        </div>

        {/* Confessions autorisées */}
        {group.confessionIds && group.confessionIds.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Confessions :</span> 
            {group.confessionIds.length === 1 ? ' Spécifique' : ' Multi-confessionnel'}
          </div>
        )}

        {/* Règles (aperçu) */}
        {group.rules && group.rules.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Règles :</span> {group.rules.length} règle{group.rules.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="text-sm text-gray-500">
          {group.type}
        </div>
        <div className="flex space-x-2">
          {isMember ? (
            <Button variant="primary" size="sm" onClick={handleChat}>
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleJoin}
              disabled={isFull}
            >
              {isFull ? 'Complet' : group.visibility === GroupVisibility.PRIVATE ? 'Demander' : 'Rejoindre'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};