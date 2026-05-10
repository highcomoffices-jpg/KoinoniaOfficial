import React, { useState, useEffect } from 'react';
import { MapPin, Play, Clock, Volume2, Navigation, Lock, Pause, Download, Share2, Heart, Star, Filter, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { mockLocationMeditations } from '../../data/mockPremiumData';
import { LocationMeditation, LocationType } from '../../types/premium';

export const LocationMeditationsSection: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyMeditations, setNearbyMeditations] = useState<LocationMeditation[]>([]);
  const [allMeditations] = useState(mockLocationMeditations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<LocationType | ''>('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [playingMeditation, setPlayingMeditation] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    // Simulation de géolocalisation (Cotonou par défaut)
    setUserLocation({ lat: 6.3703, lng: 2.3912 });
  }, []);

  useEffect(() => {
    if (userLocation) {
      // Calculer les méditations à proximité
      const nearby = allMeditations.filter(meditation => {
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          meditation.latitude, 
          meditation.longitude
        );
        return distance <= meditation.radius / 1000; // Convertir en km
      });
      setNearbyMeditations(nearby);
    }
  }, [userLocation, allMeditations]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getLocationTypeIcon = (type: LocationType) => {
    switch (type) {
      case LocationType.CHURCH: return '⛪';
      case LocationType.CROSS: return '✝️';
      case LocationType.SACRED_SITE: return '🏛️';
      case LocationType.CEMETERY: return '🪦';
      case LocationType.PILGRIMAGE_SITE: return '🙏';
      default: return '📍';
    }
  };

  const getLocationTypeLabel = (type: LocationType) => {
    switch (type) {
      case LocationType.CHURCH: return 'Église';
      case LocationType.CROSS: return 'Croix';
      case LocationType.SACRED_SITE: return 'Site sacré';
      case LocationType.CEMETERY: return 'Cimetière';
      case LocationType.PILGRIMAGE_SITE: return 'Site de pèlerinage';
      default: return 'Lieu';
    }
  };

  const locationTypeOptions = [
    { value: LocationType.CHURCH, label: 'Églises' },
    { value: LocationType.CROSS, label: 'Croix' },
    { value: LocationType.SACRED_SITE, label: 'Sites sacrés' },
    { value: LocationType.CEMETERY, label: 'Cimetières' },
    { value: LocationType.PILGRIMAGE_SITE, label: 'Sites de pèlerinage' }
  ];

  const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'fon', label: 'Fon' },
    { value: 'yoruba', label: 'Yoruba' }
  ];

  const filteredMeditations = allMeditations.filter(meditation => {
    const matchesSearch = meditation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meditation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meditation.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || meditation.locationType === selectedType;
    const matchesLanguage = !selectedLanguage || meditation.language === selectedLanguage;
    return matchesSearch && matchesType && matchesLanguage;
  });

  const handlePlayMeditation = (meditationId: string, isPremium: boolean) => {
    if (isPremium) {
      setShowPremiumModal(true);
      return;
    }

    if (playingMeditation === meditationId) {
      setPlayingMeditation(null);
      setCurrentTime(0);
    } else {
      setPlayingMeditation(meditationId);
      setCurrentTime(0);
      // Simulation de lecture audio
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const meditation = allMeditations.find(m => m.id === meditationId);
          if (prev >= (meditation?.duration || 0) * 60) {
            clearInterval(interval);
            setPlayingMeditation(null);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Méditations géolocalisées</h2>
          <p className="text-gray-600">Méditations contextuelles près des lieux sacrés</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={MapPin}>
            Carte interactive
          </Button>
          <Button variant="spiritual" icon={Download}>
            Télécharger hors ligne
          </Button>
        </div>
      </div>

      {/* Statut de localisation */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Localisation activée - Cotonou, Bénin</h3>
              <p className="text-green-700 text-sm">
                {nearbyMeditations.length} méditation{nearbyMeditations.length > 1 ? 's' : ''} disponible{nearbyMeditations.length > 1 ? 's' : ''} à proximité
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Actualiser position
          </Button>
        </div>
      </Card>

      {/* Filtres */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une méditation ou un lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex space-x-3">
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as LocationType | '')}
                options={locationTypeOptions}
                placeholder="Tous les types"
                className="min-w-[150px]"
              />
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                options={languageOptions}
                placeholder="Toutes langues"
                className="min-w-[130px]"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Méditations à proximité */}
      {nearbyMeditations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold text-gray-900">À proximité de vous</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {nearbyMeditations.map((meditation) => (
              <LocationMeditationCard 
                key={meditation.id} 
                meditation={meditation} 
                isNearby={true}
                isPlaying={playingMeditation === meditation.id}
                currentTime={playingMeditation === meditation.id ? currentTime : 0}
                onPlay={() => handlePlayMeditation(meditation.id, meditation.isPremium)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Toutes les méditations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Toutes les méditations ({filteredMeditations.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMeditations.map((meditation) => (
            <LocationMeditationCard 
              key={meditation.id} 
              meditation={meditation} 
              isNearby={nearbyMeditations.some(m => m.id === meditation.id)}
              isPlaying={playingMeditation === meditation.id}
              currentTime={playingMeditation === meditation.id ? currentTime : 0}
              onPlay={() => handlePlayMeditation(meditation.id, meditation.isPremium)}
            />
          ))}
        </div>
      </div>

      {/* Modal Premium */}
      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}

      {/* Call to action Premium */}
      <Card className="bg-gradient-to-r from-spiritual-50 to-primary-50 border-spiritual-200">
        <div className="text-center">
          <Lock className="w-12 h-12 text-spiritual-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Débloquez plus de méditations
          </h3>
          <p className="text-gray-600 mb-4">
            Accédez à plus de 50 méditations géolocalisées dans tout le Bénin
          </p>
          <Button variant="spiritual" onClick={() => setShowPremiumModal(true)}>
            Passer à Premium - 5000 FCFA/mois
          </Button>
        </div>
      </Card>
    </div>
  );
};

interface LocationMeditationCardProps {
  meditation: LocationMeditation;
  isNearby: boolean;
  isPlaying: boolean;
  currentTime: number;
  onPlay: () => void;
}

const LocationMeditationCard: React.FC<LocationMeditationCardProps> = ({ 
  meditation, 
  isNearby,
  isPlaying,
  currentTime,
  onPlay
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    setIsShared(true);
    // Simulation de partage
    navigator.share?.({
      title: meditation.title,
      text: meditation.description,
      url: window.location.href
    }).catch(() => {
      // Fallback pour navigateurs sans support
      navigator.clipboard.writeText(window.location.href);
    });
    setTimeout(() => setIsShared(false), 2000);
  };

  const getLocationTypeIcon = (type: LocationType) => {
    switch (type) {
      case LocationType.CHURCH: return '⛪';
      case LocationType.CROSS: return '✝️';
      case LocationType.SACRED_SITE: return '🏛️';
      case LocationType.CEMETERY: return '🪦';
      case LocationType.PILGRIMAGE_SITE: return '🙏';
      default: return '📍';
    }
  };

  const getLocationTypeLabel = (type: LocationType) => {
    switch (type) {
      case LocationType.CHURCH: return 'Église';
      case LocationType.CROSS: return 'Croix';
      case LocationType.SACRED_SITE: return 'Site sacré';
      case LocationType.CEMETERY: return 'Cimetière';
      case LocationType.PILGRIMAGE_SITE: return 'Site de pèlerinage';
      default: return 'Lieu';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / (meditation.duration * 60)) * 100;

  return (
    <Card hover className={`${isNearby ? 'ring-2 ring-green-500 bg-green-50' : ''} ${isPlaying ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="space-y-4">
        {/* En-tête */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getLocationTypeIcon(meditation.locationType)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{meditation.title}</h3>
              <p className="text-sm text-gray-500">{meditation.locationName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isNearby && (
              <span className="bg-green-100 text-green-800 text-xs rounded-full px-2 py-1 animate-pulse">
                📍 À proximité
              </span>
            )}
            {meditation.isPremium && (
              <span className="bg-gradient-to-r from-spiritual-500 to-primary-500 text-white text-xs rounded-full px-2 py-1">
                Premium
              </span>
            )}
          </div>
        </div>

        {/* Verset biblique */}
        <div className="bg-gradient-to-r from-spiritual-50 to-primary-50 rounded-lg p-4 border border-spiritual-100">
          <p className="text-sm italic text-spiritual-800 mb-2 leading-relaxed">
            "{meditation.bibleVerse}"
          </p>
          <p className="text-xs text-spiritual-600 font-medium">
            — {meditation.verseReference}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">{meditation.description}</p>

        {/* Lecteur audio */}
        {isPlaying && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">En cours de lecture...</p>
                <p className="text-xs text-blue-700">
                  {formatTime(currentTime)} / {formatTime(meditation.duration * 60)}
                </p>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="sm" onClick={onPlay}>
                <Pause className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Détails */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{meditation.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Volume2 className="w-4 h-4" />
              <span className="uppercase font-medium">{meditation.language}</span>
            </div>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">
            {getLocationTypeLabel(meditation.locationType)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
            
            <div className="flex items-center space-x-1 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{meditation.radius}m</span>
            </div>
          </div>
          
          <Button 
            variant={meditation.isPremium ? "spiritual" : isPlaying ? "outline" : "primary"}
            size="sm"
            icon={meditation.isPremium ? Lock : isPlaying ? Pause : Play}
            onClick={onPlay}
          >
            {meditation.isPremium ? 'Premium requis' : isPlaying ? 'Pause' : 'Écouter'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface PremiumModalProps {
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-spiritual-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Contenu Premium
          </h3>
          <p className="text-gray-600 mb-6">
            Cette méditation est réservée aux membres Premium. Débloquez l'accès à plus de 50 méditations géolocalisées.
          </p>
          
          <div className="space-y-4">
            <div className="bg-spiritual-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-spiritual-900 mb-2">Avantages Premium :</h4>
              <ul className="text-sm text-spiritual-800 space-y-1">
                <li>• 50+ méditations géolocalisées</li>
                <li>• Audio haute qualité en 3 langues</li>
                <li>• Téléchargement hors ligne</li>
                <li>• Parcours IA personnalisés</li>
                <li>• Support prioritaire</li>
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" fullWidth onClick={onClose}>
                Plus tard
              </Button>
              <Button variant="spiritual" fullWidth>
                Passer à Premium - 5000 FCFA/mois
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};