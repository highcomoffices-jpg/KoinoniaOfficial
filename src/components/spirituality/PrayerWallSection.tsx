import React, { useState } from 'react';
import { Heart, Plus, Users, CheckCircle, Clock, MessageCircle, Search, Filter, Star, Share2, Target, Zap, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { mockPrayerWall } from '../../data/mockPremiumData';
import { PrayerWall, PrayerCategory } from '../../types/premium';

export const PrayerWallSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory | ''>('');
  const [sortBy, setSortBy] = useState('recent');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [prayedFor, setPrayedFor] = useState<string[]>([]);

  const categoryOptions = [
    { value: PrayerCategory.HEALING, label: 'Guérison' },
    { value: PrayerCategory.FAMILY, label: 'Famille' },
    { value: PrayerCategory.WORK, label: 'Travail' },
    { value: PrayerCategory.GUIDANCE, label: 'Direction' },
    { value: PrayerCategory.GRATITUDE, label: 'Gratitude' },
    { value: PrayerCategory.FORGIVENESS, label: 'Pardon' },
    { value: PrayerCategory.PROTECTION, label: 'Protection' },
    { value: PrayerCategory.PEACE, label: 'Paix' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Plus récentes' },
    { value: 'popular', label: 'Plus priées' },
    { value: 'urgent', label: 'Urgentes' },
    { value: 'answered', label: 'Exaucées' }
  ];

  const filteredPrayers = mockPrayerWall.filter(prayer => {
    const matchesSearch = prayer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prayer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || prayer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.prayerCount - a.prayerCount;
      case 'urgent':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'answered':
        return (b.isAnswered ? 1 : 0) - (a.isAnswered ? 1 : 0);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handlePrayFor = (prayerId: string) => {
    if (!prayedFor.includes(prayerId)) {
      setPrayedFor(prev => [...prev, prayerId]);
      // Simulation d'augmentation du compteur
      const prayer = mockPrayerWall.find(p => p.id === prayerId);
      if (prayer) {
        prayer.prayerCount += 1;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Mur des prières collectives</h2>
          <p className="text-gray-600">Partagez et soutenez les intentions de prière</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Star}>
            Mes prières
          </Button>
          <Button 
            variant="primary" 
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
          >
            Déposer une intention
          </Button>
        </div>
      </div>

      {/* Statistiques enrichies */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {mockPrayerWall.length}
          </div>
          <div className="text-sm text-gray-600">Intentions actives</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {mockPrayerWall.reduce((sum, p) => sum + p.prayerCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Prières offertes</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-spiritual-600">
            {mockPrayerWall.filter(p => p.isAnswered).length}
          </div>
          <div className="text-sm text-gray-600">Prières exaucées</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-warm-600">
            {mockPrayerWall.filter(p => p.category === PrayerCategory.HEALING).length}
          </div>
          <div className="text-sm text-gray-600">Demandes de guérison</div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une intention de prière..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex space-x-3">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as PrayerCategory | '')}
                options={categoryOptions}
                placeholder="Toutes catégories"
                className="min-w-[150px]"
              />
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
                className="min-w-[150px]"
              />
            </div>
          </div>
          
          {(searchTerm || selectedCategory) && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredPrayers.length} intention{filteredPrayers.length > 1 ? 's' : ''} trouvée{filteredPrayers.length > 1 ? 's' : ''}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Liste des prières */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrayers.map((prayer) => (
          <PrayerCard 
            key={prayer.id} 
            prayer={prayer}
            hasPrayed={prayedFor.includes(prayer.id)}
            onPray={() => handlePrayFor(prayer.id)}
          />
        ))}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <CreatePrayerModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Call to action */}
      <Card className="bg-gradient-to-r from-spiritual-50 to-primary-50 border-spiritual-200">
        <div className="text-center">
          <Heart className="w-12 h-12 text-spiritual-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Partagez votre intention
          </h3>
          <p className="text-gray-600 mb-4">
            Déposez votre intention de prière et recevez le soutien de la communauté
          </p>
          <Button variant="spiritual" onClick={() => setShowCreateModal(true)}>
            Déposer une intention de prière
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface PrayerCardProps {
  prayer: PrayerWall;
  hasPrayed: boolean;
  onPray: () => void;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, hasPrayed, onPray }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  const getCategoryColor = (category: PrayerCategory) => {
    switch (category) {
      case PrayerCategory.HEALING: return 'bg-green-100 text-green-800';
      case PrayerCategory.FAMILY: return 'bg-blue-100 text-blue-800';
      case PrayerCategory.WORK: return 'bg-purple-100 text-purple-800';
      case PrayerCategory.GUIDANCE: return 'bg-yellow-100 text-yellow-800';
      case PrayerCategory.GRATITUDE: return 'bg-pink-100 text-pink-800';
      case PrayerCategory.FORGIVENESS: return 'bg-indigo-100 text-indigo-800';
      case PrayerCategory.PROTECTION: return 'bg-red-100 text-red-800';
      case PrayerCategory.PEACE: return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Aujourd\'hui';
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    return new Intl.DateTimeFormat('fr').format(date);
  };

  const progressPercentage = prayer.targetPrayerCount 
    ? Math.min((prayer.prayerCount / prayer.targetPrayerCount) * 100, 100)
    : 0;

  return (
    <Card hover className="h-full flex flex-col group">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-spiritual-400 to-primary-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{prayer.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(prayer.category)}`}>
                {prayer.category}
              </span>
              {prayer.isAnswered && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Exaucée</span>
                </span>
              )}
              {hasPrayed && (
                <span className="px-2 py-1 bg-spiritual-100 text-spiritual-800 text-xs rounded-full">
                  ✓ Prié
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(prayer.createdAt)}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{prayer.description}</p>

        {/* Demandeur */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>
            Demandé par {prayer.isAnonymous ? 'Anonyme' : `${prayer.requester.firstName} ${prayer.requester.lastName}`}
          </span>
        </div>

        {/* Progression avec objectif */}
        {prayer.targetPrayerCount && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Objectif de prières</span>
              <span className="font-bold text-lg">
                {prayer.prayerCount}/{prayer.targetPrayerCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-spiritual-500 to-primary-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {Math.round(progressPercentage)}% atteint
              </span>
              <span className="text-spiritual-600 font-medium">
                {prayer.targetPrayerCount - prayer.prayerCount} prières restantes
              </span>
            </div>
          </div>
        )}

        {/* Témoignage si exaucée */}
        {prayer.isAnswered && prayer.testimony && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-900">Témoignage de réponse</span>
              <Award className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-sm text-green-800 leading-relaxed italic">"{prayer.testimony}"</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-green-600">
                Exaucée le {prayer.answeredAt ? new Intl.DateTimeFormat('fr').format(prayer.answeredAt) : ''}
              </span>
            </div>
          </div>
        )}

        {/* Statistiques de soutien */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-spiritual-600">
                <Heart className="w-4 h-4" />
                <span className="font-medium">{prayer.prayerCount} prières</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-600">
                <MessageCircle className="w-4 h-4" />
                <span>Soutenir</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatDate(prayer.createdAt)}</span>
            </div>
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
          
          <button
            onClick={() => setShowSupportModal(true)}
            className="flex items-center space-x-1 text-gray-500 hover:text-spiritual-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Encourager</span>
          </button>
        </div>
        
        <Button 
          variant={hasPrayed ? "outline" : "spiritual"}
          size="sm"
          icon={hasPrayed ? CheckCircle : Heart}
          onClick={onPray}
          disabled={hasPrayed}
          className="group-hover:scale-105 transition-transform duration-200"
        >
          {hasPrayed ? 'Prié ✓' : 'Prier maintenant'}
        </Button>
      </div>

      {/* Modal de soutien */}
      {showSupportModal && (
        <SupportModal 
          prayer={prayer}
          onClose={() => setShowSupportModal(false)} 
        />
      )}
    </Card>
  );
};

interface CreatePrayerModalProps {
  onClose: () => void;
}

const CreatePrayerModal: React.FC<CreatePrayerModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isAnonymous: false,
    targetPrayerCount: '',
    isUrgent: false
  });

  const categoryOptions = [
    { value: PrayerCategory.HEALING, label: 'Guérison' },
    { value: PrayerCategory.FAMILY, label: 'Famille' },
    { value: PrayerCategory.WORK, label: 'Travail' },
    { value: PrayerCategory.GUIDANCE, label: 'Direction' },
    { value: PrayerCategory.GRATITUDE, label: 'Gratitude' },
    { value: PrayerCategory.FORGIVENESS, label: 'Pardon' },
    { value: PrayerCategory.PROTECTION, label: 'Protection' },
    { value: PrayerCategory.PEACE, label: 'Paix' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de création
    console.log('Création de l\'intention:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-spiritual-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Déposer une intention de prière
          </h2>
          <p className="text-gray-600">
            Partagez votre intention avec la communauté Koinonia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre de l'intention"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: Guérison pour ma mère"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description détaillée
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez votre intention de prière avec plus de détails..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              required
            />
          </div>

          <Select
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            options={categoryOptions}
            placeholder="Sélectionnez une catégorie"
            required
          />

          <Input
            label="Objectif de prières (optionnel)"
            type="number"
            value={formData.targetPrayerCount}
            onChange={(e) => setFormData(prev => ({ ...prev, targetPrayerCount: e.target.value }))}
            placeholder="Ex: 100 prières"
            min="1"
          />

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Rester anonyme</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Intention urgente</span>
            </label>
          </div>

          <div className="bg-spiritual-50 border border-spiritual-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-spiritual-600" />
              <span className="text-sm font-medium text-spiritual-900">Confidentialité</span>
            </div>
            <p className="text-sm text-spiritual-800">
              Votre intention sera partagée avec respect et bienveillance. La communauté Koinonia s'engage à prier avec sincérité.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" fullWidth onClick={onClose}>
              Annuler
            </Button>
            <Button variant="spiritual" fullWidth type="submit">
              Publier l'intention
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

interface SupportModalProps {
  prayer: PrayerWall;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ prayer, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSendSupport = () => {
    // Logique d'envoi de message de soutien
    console.log('Message de soutien:', message);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Encourager dans la prière
          </h3>
          <p className="text-gray-600">
            Envoyez un message d'encouragement à {prayer.isAnonymous ? 'cette personne' : prayer.requester.firstName}
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-1">{prayer.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{prayer.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message d'encouragement
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez un message d'encouragement et de soutien..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💙 Votre message sera envoyé avec bienveillance et dans l'esprit de communion chrétienne.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" fullWidth onClick={onClose}>
              Annuler
            </Button>
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleSendSupport}
              disabled={!message.trim()}
            >
              Envoyer l'encouragement
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};