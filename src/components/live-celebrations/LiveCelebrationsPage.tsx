import React, { useState } from 'react';
import { Zap, Users, DollarSign, Eye, Heart, Gift, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { mockLiveCelebrations, mockOrganizations } from '../../data/mockPremiumData';
import { LiveCelebration, PaymentMethod } from '../../types/premium';

export const LiveCelebrationsPage: React.FC = () => {
  const [liveCelebrations] = useState(mockLiveCelebrations);
  const [selectedCelebration, setSelectedCelebration] = useState<LiveCelebration | null>(null);

  const activeCelebrations = liveCelebrations.filter(c => c.isLive);
  const upcomingCelebrations = liveCelebrations.filter(c => !c.isLive && new Date(c.startTime) > new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* En-tête */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              Célébrations Live
            </h1>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full px-3 py-1 animate-pulse">
              Live
            </span>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Participez aux célébrations en direct avec offrandes interactives
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="sm" className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {activeCelebrations.length}
            </div>
            <div className="text-sm text-gray-600">En direct maintenant</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {upcomingCelebrations.length}
            </div>
            <div className="text-sm text-gray-600">À venir</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {liveCelebrations.reduce((sum, c) => sum + c.participantCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Participants total</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-2xl font-bold text-spiritual-600">
              {liveCelebrations.reduce((sum, c) => sum + c.totalOfferings, 0).toLocaleString()} FCFA
            </div>
            <div className="text-sm text-gray-600">Offrandes collectées</div>
          </Card>
        </div>

        {/* Célébrations en direct */}
        {activeCelebrations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-gray-900">En direct maintenant</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeCelebrations.map((celebration) => (
                <LiveCelebrationCard 
                  key={celebration.id} 
                  celebration={celebration}
                  onJoin={() => setSelectedCelebration(celebration)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Célébrations à venir */}
        {upcomingCelebrations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Prochaines célébrations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingCelebrations.map((celebration) => (
                <UpcomingCelebrationCard 
                  key={celebration.id} 
                  celebration={celebration}
                />
              ))}
            </div>
          </div>
        )}

        {/* Viewer de célébration */}
        {selectedCelebration && (
          <CelebrationViewer 
            celebration={selectedCelebration}
            onClose={() => setSelectedCelebration(null)}
          />
        )}
      </div>
    </div>
  );
};

interface LiveCelebrationCardProps {
  celebration: LiveCelebration;
  onJoin: () => void;
}

const LiveCelebrationCard: React.FC<LiveCelebrationCardProps> = ({ celebration, onJoin }) => {
  return (
    <Card hover className="relative overflow-hidden">
      {/* Badge Live */}
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-red-500 text-white text-xs rounded-full px-3 py-1 animate-pulse flex items-center space-x-1">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span>LIVE</span>
        </span>
      </div>

      {/* Image de fond */}
      {celebration.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden mb-4 relative">
          <img
            src={celebration.imageUrl}
            alt={celebration.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Play className="w-16 h-16 text-white opacity-80" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Titre et organisateur */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">{celebration.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{celebration.description}</p>
          <p className="text-sm text-spiritual-600 font-medium mt-2">
            Par {celebration.organizer.firstName} {celebration.organizer.lastName}
          </p>
        </div>

        {/* Paroisses participantes */}
        <div className="flex flex-wrap gap-2">
          {celebration.parishes.slice(0, 2).map((parish) => (
            <span key={parish.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {parish.name}
            </span>
          ))}
          {celebration.parishes.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{celebration.parishes.length - 2} autres
            </span>
          )}
        </div>

        {/* Statistiques en temps réel */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="font-bold">{celebration.participantCount}</span>
            </div>
            <div className="text-xs text-gray-600">Participants</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="font-bold">{celebration.totalOfferings.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-600">FCFA collectés</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button variant="primary" fullWidth icon={Eye} onClick={onJoin}>
            Rejoindre le live
          </Button>
          <Button variant="outline" icon={Heart}>
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface UpcomingCelebrationCardProps {
  celebration: LiveCelebration;
}

const UpcomingCelebrationCard: React.FC<UpcomingCelebrationCardProps> = ({ celebration }) => {
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card hover>
      <div className="space-y-4">
        {/* Titre et organisateur */}
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-2">{celebration.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{celebration.description}</p>
          <p className="text-sm text-spiritual-600 font-medium mt-2">
            Par {celebration.organizer.firstName} {celebration.organizer.lastName}
          </p>
        </div>

        {/* Date et heure */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm font-medium text-blue-900 mb-1">Programmé pour :</div>
          <div className="text-blue-800">{formatDateTime(celebration.startTime)}</div>
        </div>

        {/* Paroisses participantes */}
        <div className="flex flex-wrap gap-2">
          {celebration.parishes.slice(0, 2).map((parish) => (
            <span key={parish.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {parish.name}
            </span>
          ))}
          {celebration.parishes.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{celebration.parishes.length - 2} autres
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button variant="outline" fullWidth>
            Me rappeler
          </Button>
          <Button variant="outline" icon={Heart}>
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface CelebrationViewerProps {
  celebration: LiveCelebration;
  onClose: () => void;
}

const CelebrationViewer: React.FC<CelebrationViewerProps> = ({ celebration, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showOfferingModal, setShowOfferingModal] = useState(false);
  const [offeringAmount, setOfferingAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleOffering = () => {
    // Logique d'offrande
    setShowOfferingModal(false);
    setOfferingAmount('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="font-bold">{celebration.title}</h2>
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">LIVE</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{celebration.participantCount} participants</span>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              ✕
            </button>
          </div>
        </div>

        {/* Zone vidéo */}
        <div className="flex-1 bg-black relative">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-center">
              <Play className="w-24 h-24 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Diffusion en direct</p>
              <p className="text-sm opacity-75">Simulation de stream vidéo</p>
            </div>
          </div>

          {/* Contrôles vidéo */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Compteur d'offrandes en temps réel */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-75 rounded-lg p-3 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {celebration.totalOfferings.toLocaleString()} FCFA
              </div>
              <div className="text-xs opacity-75">Offrandes collectées</div>
            </div>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="bg-gray-50 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <Users className="w-4 h-4 inline mr-1" />
              {celebration.participantCount} participants
            </div>
            <div className="text-sm text-gray-600">
              <Heart className="w-4 h-4 inline mr-1" />
              {Math.floor(Math.random() * 100) + 50} réactions
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" icon={Heart}>
              Réagir
            </Button>
            <Button variant="spiritual" icon={Gift} onClick={() => setShowOfferingModal(true)}>
              Faire une offrande
            </Button>
          </div>
        </div>

        {/* Modal d'offrande */}
        {showOfferingModal && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <div className="text-center mb-6">
                <Gift className="w-12 h-12 text-spiritual-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Faire une offrande</h3>
                <p className="text-gray-600">Soutenez cette célébration par votre générosité</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Montant (FCFA)"
                  type="number"
                  value={offeringAmount}
                  onChange={(e) => setOfferingAmount(e.target.value)}
                  placeholder="Ex: 1000"
                  min="100"
                />

                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setOfferingAmount(amount.toString())}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      {amount} FCFA
                    </button>
                  ))}
                </div>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-gray-300 text-spiritual-600 focus:ring-spiritual-500"
                  />
                  <span className="text-sm text-gray-700">Offrande anonyme</span>
                </label>

                <div className="text-xs text-gray-500">
                  {celebration.showDonorNames && !isAnonymous 
                    ? "Votre nom sera affiché publiquement" 
                    : "Votre offrande restera anonyme"
                  }
                </div>

                <div className="flex space-x-3">
                  <Button variant="outline" fullWidth onClick={() => setShowOfferingModal(false)}>
                    Annuler
                  </Button>
                  <Button 
                    variant="spiritual" 
                    fullWidth 
                    onClick={handleOffering}
                    disabled={!offeringAmount || parseInt(offeringAmount) < 100}
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};