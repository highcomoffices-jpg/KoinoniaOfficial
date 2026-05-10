import React, { useState } from 'react';
import { Crown, Users, Target, Gift, Calendar, TrendingUp, Award, Plus, Search, Filter, CheckCircle, Clock, Heart, Share2, Trophy, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { mockCommunityChallenge } from '../../data/mockPremiumData';
import { CommunityChallenge, ChallengeType } from '../../types/premium';

export const ChallengesSection: React.FC = () => {
  const [activeChallenges] = useState(mockCommunityChallenge.filter(c => c.isActive));
  const [completedChallenges] = useState(mockCommunityChallenge.filter(c => c.isCompleted));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ChallengeType | ''>('');
  const [sortBy, setSortBy] = useState('progress');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [participatedChallenges, setParticipatedChallenges] = useState<string[]>([]);

  const getChallengeTypeIcon = (type: ChallengeType) => {
    switch (type) {
      case ChallengeType.PRAYER_COUNT: return '🙏';
      case ChallengeType.DONATION_AMOUNT: return '💰';
      case ChallengeType.BIBLE_READING: return '📖';
      case ChallengeType.COMMUNITY_SERVICE: return '🤝';
      case ChallengeType.EVANGELIZATION: return '📢';
      default: return '🎯';
    }
  };

  const getChallengeTypeLabel = (type: ChallengeType) => {
    switch (type) {
      case ChallengeType.PRAYER_COUNT: return 'Prières';
      case ChallengeType.DONATION_AMOUNT: return 'Dons';
      case ChallengeType.BIBLE_READING: return 'Lecture biblique';
      case ChallengeType.COMMUNITY_SERVICE: return 'Service communautaire';
      case ChallengeType.EVANGELIZATION: return 'Évangélisation';
      default: return 'Défi';
    }
  };

  const challengeTypeOptions = [
    { value: ChallengeType.PRAYER_COUNT, label: 'Défis de prière' },
    { value: ChallengeType.DONATION_AMOUNT, label: 'Défis de don' },
    { value: ChallengeType.BIBLE_READING, label: 'Lecture biblique' },
    { value: ChallengeType.COMMUNITY_SERVICE, label: 'Service communautaire' },
    { value: ChallengeType.EVANGELIZATION, label: 'Évangélisation' }
  ];

  const sortOptions = [
    { value: 'progress', label: 'Progression' },
    { value: 'participants', label: 'Participants' },
    { value: 'deadline', label: 'Date limite' },
    { value: 'reward', label: 'Récompense' }
  ];

  const filteredChallenges = [...activeChallenges, ...completedChallenges].filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || challenge.type === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'participants':
        return b.participantIds.length - a.participantIds.length;
      case 'deadline':
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      case 'progress':
        return (b.currentCount / b.targetCount) - (a.currentCount / a.targetCount);
      default:
        return 0;
    }
  });

  const handleParticipate = (challengeId: string) => {
    if (!participatedChallenges.includes(challengeId)) {
      setParticipatedChallenges(prev => [...prev, challengeId]);
      // Simulation d'augmentation du compteur
      const challenge = activeChallenges.find(c => c.id === challengeId);
      if (challenge) {
        challenge.currentCount += 1;
        challenge.participantIds.push('current-user');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Défis communautaires</h2>
          <p className="text-gray-600">Participez à des défis spirituels et caritatifs</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Trophy}>
            Mes récompenses
          </Button>
          <Button 
            variant="primary" 
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
          >
            Créer un défi
          </Button>
        </div>
      </div>

      {/* Statistiques enrichies */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {activeChallenges.length}
          </div>
          <div className="text-sm text-gray-600">Défis actifs</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {completedChallenges.length}
          </div>
          <div className="text-sm text-gray-600">Défis complétés</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-spiritual-600">
            {activeChallenges.reduce((sum, c) => sum + c.participantIds.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Participants actifs</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-warm-600">
            {activeChallenges.reduce((sum, c) => sum + c.currentCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Actions accomplies</div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un défi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex space-x-3">
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ChallengeType | '')}
                options={challengeTypeOptions}
                placeholder="Tous les types"
                className="min-w-[180px]"
              />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
                className="min-w-[150px]"
              />
            </div>
          </div>
          
          {(searchTerm || selectedType) && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredChallenges.length} défi{filteredChallenges.length > 1 ? 's' : ''} trouvé{filteredChallenges.length > 1 ? 's' : ''}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                }}
              >
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Défis actifs */}
      {activeChallenges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-gray-900">Défis en cours</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredChallenges.filter(c => c.isActive).map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                hasParticipated={participatedChallenges.includes(challenge.id)}
                onParticipate={() => handleParticipate(challenge.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Défis complétés */}
      {completedChallenges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Défis complétés</span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredChallenges.filter(c => c.isCompleted).map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                hasParticipated={true}
                onParticipate={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <CreateChallengeModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Call to action */}
      <Card className="bg-gradient-to-r from-warm-50 to-primary-50 border-warm-200">
        <div className="text-center">
          <Crown className="w-12 h-12 text-warm-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Créez votre propre défi
          </h3>
          <p className="text-gray-600 mb-4">
            Mobilisez votre communauté autour d'une cause qui vous tient à cœur
          </p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Créer un défi communautaire
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface ChallengeCardProps {
  challenge: CommunityChallenge;
  hasParticipated: boolean;
  onParticipate: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, hasParticipated, onParticipate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const progressPercentage = Math.min((challenge.currentCount / challenge.targetCount) * 100, 100);
  const isCompleted = challenge.currentCount >= challenge.targetCount;
  const daysLeft = Math.ceil((challenge.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    setIsShared(true);
    // Simulation de partage
    setTimeout(() => setIsShared(false), 2000);
  };

  const formatReward = () => {
    switch (challenge.reward.type) {
      case 'donation':
        return `${challenge.reward.amount?.toLocaleString()} ${challenge.reward.currency} pour ${challenge.reward.beneficiary?.name}`;
      case 'badge':
        return `Badge spécial pour tous les participants`;
      case 'premium_access':
        return `Accès premium gratuit pendant 1 mois`;
      default:
        return challenge.reward.description;
    }
  };

  const getChallengeTypeIcon = (type: ChallengeType) => {
    switch (type) {
      case ChallengeType.PRAYER_COUNT: return '🙏';
      case ChallengeType.DONATION_AMOUNT: return '💰';
      case ChallengeType.BIBLE_READING: return '📖';
      case ChallengeType.COMMUNITY_SERVICE: return '🤝';
      case ChallengeType.EVANGELIZATION: return '📢';
      default: return '🎯';
    }
  };

  const getChallengeTypeLabel = (type: ChallengeType) => {
    switch (type) {
      case ChallengeType.PRAYER_COUNT: return 'Prières';
      case ChallengeType.DONATION_AMOUNT: return 'Dons';
      case ChallengeType.BIBLE_READING: return 'Lecture biblique';
      case ChallengeType.COMMUNITY_SERVICE: return 'Service communautaire';
      case ChallengeType.EVANGELIZATION: return 'Évangélisation';
      default: return 'Défi';
    }
  };

  return (
    <Card hover className="h-full flex flex-col group">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
            {getChallengeTypeIcon(challenge.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2">{challenge.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {getChallengeTypeLabel(challenge.type)}
              </span>
              {isCompleted && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>Complété</span>
                </span>
              )}
              {hasParticipated && (
                <span className="px-2 py-1 bg-spiritual-100 text-spiritual-800 text-xs rounded-full">
                  ✓ Participé
                </span>
              )}
            </div>
          </div>
        </div>
        {challenge.imageUrl && (
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={challenge.imageUrl}
              alt={challenge.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="flex-1 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{challenge.description}</p>

        {/* Progression avec animation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Progression</span>
            <span className="font-bold text-lg">
              {challenge.currentCount.toLocaleString()}/{challenge.targetCount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ease-out ${
                isCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-spiritual-500 to-primary-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {Math.round(progressPercentage)}% complété
            </span>
            <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-spiritual-600'}`}>
              {isCompleted ? '🎉 Objectif atteint !' : `${challenge.targetCount - challenge.currentCount} restant`}
            </span>
          </div>
        </div>

        {/* Récompense enrichie */}
        <div className="bg-gradient-to-r from-warm-50 to-primary-50 rounded-lg p-4 border border-warm-200">
          <div className="flex items-center space-x-2 mb-2">
            <Gift className="w-5 h-5 text-warm-600" />
            <span className="text-sm font-semibold text-warm-900">Récompense</span>
            {challenge.reward.type === 'donation' && (
              <span className="bg-green-100 text-green-800 text-xs rounded-full px-2 py-1">
                Caritatif
              </span>
            )}
          </div>
          <p className="text-sm text-warm-800 leading-relaxed">{formatReward()}</p>
          {challenge.reward.beneficiary && (
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-700 font-medium">
                Bénéficiaire : {challenge.reward.beneficiary.name}
              </span>
            </div>
          )}
        </div>

        {/* Détails avec icônes */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <Users className="w-4 h-4" />
            <span>{challenge.participantIds.length} participants</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {challenge.isActive 
                ? daysLeft > 0 
                  ? `${daysLeft} jour${daysLeft > 1 ? 's' : ''} restant${daysLeft > 1 ? 's' : ''}`
                  : 'Expire bientôt'
                : 'Terminé'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${
              isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{isLiked ? '1' : '0'}</span>
          </button>
          
          <button
            onClick={handleShare}
            className={`flex items-center space-x-1 transition-colors ${
              isShared ? 'text-green-600' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">{isShared ? 'Partagé!' : 'Partager'}</span>
          </button>
        </div>
        
        <Button 
          variant={hasParticipated ? "outline" : isCompleted ? "spiritual" : "primary"}
          size="sm"
          icon={hasParticipated ? CheckCircle : isCompleted ? Trophy : Target}
          onClick={onParticipate}
          disabled={hasParticipated || !challenge.isActive}
          className="group-hover:scale-105 transition-transform duration-200"
        >
          {hasParticipated 
            ? 'Participé ✓' 
            : isCompleted 
              ? 'Complété 🏆' 
              : 'Participer maintenant'
          }
        </Button>
      </div>
    </Card>
  );
};

interface CreateChallengeModalProps {
  onClose: () => void;
}

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    targetCount: '',
    duration: '30',
    rewardType: 'badge'
  });

  const challengeTypeOptions = [
    { value: ChallengeType.PRAYER_COUNT, label: 'Défi de prière' },
    { value: ChallengeType.DONATION_AMOUNT, label: 'Défi de don' },
    { value: ChallengeType.BIBLE_READING, label: 'Défi de lecture' },
    { value: ChallengeType.COMMUNITY_SERVICE, label: 'Service communautaire' },
    { value: ChallengeType.EVANGELIZATION, label: 'Défi d\'évangélisation' }
  ];

  const durationOptions = [
    { value: '7', label: '7 jours' },
    { value: '14', label: '14 jours' },
    { value: '30', label: '30 jours' },
    { value: '60', label: '60 jours' },
    { value: '90', label: '90 jours' }
  ];

  const rewardTypeOptions = [
    { value: 'badge', label: 'Badge spécial' },
    { value: 'donation', label: 'Don caritatif' },
    { value: 'premium', label: 'Accès premium' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de création du défi
    console.log('Création du défi:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-warm-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Créer un défi communautaire
          </h2>
          <p className="text-gray-600">
            Mobilisez votre communauté autour d'une cause spirituelle
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre du défi"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: 1000 prières pour la paix"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez l'objectif et l'impact de ce défi..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              required
            />
          </div>

          <Select
            label="Type de défi"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            options={challengeTypeOptions}
            placeholder="Sélectionnez le type"
            required
          />

          <Input
            label="Objectif à atteindre"
            type="number"
            value={formData.targetCount}
            onChange={(e) => setFormData(prev => ({ ...prev, targetCount: e.target.value }))}
            placeholder="Ex: 1000"
            min="1"
            required
          />

          <Select
            label="Durée du défi"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            options={durationOptions}
            required
          />

          <Select
            label="Type de récompense"
            value={formData.rewardType}
            onChange={(e) => setFormData(prev => ({ ...prev, rewardType: e.target.value }))}
            options={rewardTypeOptions}
            required
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Aperçu de l'impact</span>
            </div>
            <p className="text-sm text-blue-800">
              Ce défi mobilisera la communauté Koinonia et aura un impact positif sur {formData.targetCount || 'X'} {formData.type ? getChallengeTypeLabel(formData.type as ChallengeType).toLowerCase() : 'actions'}.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" fullWidth onClick={onClose}>
              Annuler
            </Button>
            <Button variant="spiritual" fullWidth type="submit">
              Créer le défi
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};