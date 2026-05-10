import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Church, Users, Plus, Filter, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Pagination } from '../ui/Pagination';
import { ProposeParishModal } from './ProposeParishModal';
import { MyParishModal } from './MyParishModal';
import { ParishDetailsModal } from './ParishDetailsModal';
import { usePagination } from '../../hooks/usePagination';
import { mockParishes, mockCities, mockConfessions } from '../../data/mockData';
import { Parish } from '../../types';

export const ParishesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedConfession, setSelectedConfession] = useState('');
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [isMyParishModalOpen, setIsMyParishModalOpen] = useState(false);
  const [selectedParishForDetails, setSelectedParishForDetails] = useState<Parish | null>(null);

  // TEST: Simuler une paroisse utilisateur pour le développement
  const userParish = user?.parish || mockParishes[0]; // Utiliser la première paroisse mock pour les tests

  // Filtrer les paroisses selon les critères de recherche
  const filteredParishes = useMemo(() => {
    return mockParishes.filter(parish => {
      const matchesSearch = parish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           parish.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = !selectedCity || parish.cityId === selectedCity;
      const matchesConfession = !selectedConfession || parish.confessionId === selectedConfession;
      
      return matchesSearch && matchesCity && matchesConfession;
    });
  }, [searchTerm, selectedCity, selectedConfession]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedParishes,
    goToPage,
    resetPagination
  } = usePagination({ data: filteredParishes, itemsPerPage: 20 });

  // Reset pagination when filters change
  React.useEffect(() => {
    resetPagination();
  }, [searchTerm, selectedCity, selectedConfession, resetPagination]);

  // Options pour les filtres
  const cityOptions = mockCities.map(city => ({
    value: city.id,
    label: city.name
  }));

  const confessionOptions = mockConfessions.map(confession => ({
    value: confession.id,
    label: confession.name
  }));

  const getParishCity = (cityId: string) => {
    return mockCities.find(city => city.id === cityId)?.name || 'Ville inconnue';
  };

  const getParishConfession = (confessionId: string) => {
    return mockConfessions.find(confession => confession.id === confessionId)?.name || 'Confession inconnue';
  };

  const handleJoinParish = (parishId: string) => {
    // Logique pour rejoindre une paroisse
    console.log('Rejoindre la paroisse:', parishId);
    // Ici vous ajouterez la logique pour rejoindre la paroisse
  };

  const handleProposeParish = (data: any) => {
    console.log('Nouvelle paroisse proposée:', data);
    setIsProposeModalOpen(false);
  };

  const handleLeaveParish = () => {
    console.log('Quitter la paroisse');
    setIsMyParishModalOpen(false);
  };

  const handleViewDetails = (parish: Parish) => {
    if (userParish?.id === parish.id) {
      // Si c'est MA paroisse : ouvrir le modal d'édition
      setIsMyParishModalOpen(true);
    } else {
      // Si c'est une AUTRE paroisse : ouvrir le modal de consultation
      setSelectedParishForDetails(parish);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedConfession('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* En-tête responsive */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              Paroisses et Confessions
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Découvrez et rejoignez les communautés chrétiennes près de chez vous
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              icon={Plus}
              className="w-full sm:w-auto"
              onClick={() => setIsProposeModalOpen(true)}
            >
              Proposer une paroisse
            </Button>
            {/* TOUJOURS afficher le bouton Ma paroisse pour les tests */}
            <Button
              variant="primary"
              icon={Church}
              className="w-full sm:w-auto"
              onClick={() => setIsMyParishModalOpen(true)}
            >
              Ma paroisse
            </Button>
          </div>
        </div>

        {/* Ma paroisse actuelle - TOUJOURS visible pour les tests */}
        {userParish && (
          <Card className="bg-gradient-to-r from-spiritual-50 to-primary-50 border-spiritual-200">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-spiritual-600 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Church className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-spiritual-900 text-sm sm:text-base">Ma paroisse</h3>
                <p className="text-spiritual-800 font-medium truncate">{userParish.name}</p>
                <p className="text-sm text-spiritual-600 truncate">
                  {getParishCity(userParish.cityId)} • {getParishConfession(userParish.confessionId)}
                </p>
              </div>
              {/* BOUTON CORRIGÉ : Ajout du onClick */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto"
                onClick={() => setIsMyParishModalOpen(true)}
              >
                Voir les détails
              </Button>
            </div>
          </Card>
        )}

        {/* Filtres et recherche responsive */}
        <Card>
          <div className="space-y-4">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher une paroisse ou une adresse..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  options={cityOptions}
                  placeholder="Toutes les villes"
                  className="w-full sm:min-w-[150px]"
                />
                <Select
                  value={selectedConfession}
                  onChange={(e) => setSelectedConfession(e.target.value)}
                  options={confessionOptions}
                  placeholder="Toutes les confessions"
                  className="w-full sm:min-w-[180px]"
                />
              </div>
            </div>
            
            {(searchTerm || selectedCity || selectedConfession) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                  {filteredParishes.length} paroisse{filteredParishes.length > 1 ? 's' : ''} trouvée{filteredParishes.length > 1 ? 's' : ''}
                </p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Liste des paroisses responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {paginatedParishes.map((parish) => (
            <ParishCard
              key={parish.id}
              parish={parish}
              city={getParishCity(parish.cityId)}
              confession={getParishConfession(parish.confessionId)}
              onJoin={handleJoinParish}
              isCurrentParish={userParish?.id === parish.id}
              onViewDetails={() => handleViewDetails(parish)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={filteredParishes.length}
            itemsPerPage={20}
          />
        )}

        {/* Message si aucune paroisse trouvée */}
        {filteredParishes.length === 0 && (
          <Card className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Church className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune paroisse trouvée
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">
              Essayez de modifier vos critères de recherche ou proposez une nouvelle paroisse.
            </p>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsProposeModalOpen(true)}
            >
              Proposer une paroisse
            </Button>
          </Card>
        )}

        {/* Modals */}
        <ProposeParishModal
          isOpen={isProposeModalOpen}
          onClose={() => setIsProposeModalOpen(false)}
          onSubmit={handleProposeParish}
        />
        
        <MyParishModal
          isOpen={isMyParishModalOpen}
          onClose={() => setIsMyParishModalOpen(false)}
          onLeaveParish={handleLeaveParish}
          userParish={userParish}
        />
        
        {selectedParishForDetails && (
          <ParishDetailsModal
            isOpen={!!selectedParishForDetails}
            onClose={() => setSelectedParishForDetails(null)}
            parish={selectedParishForDetails}
            city={getParishCity(selectedParishForDetails.cityId)}
            confession={getParishConfession(selectedParishForDetails.confessionId)}
            onJoinParish={handleJoinParish}
          />
        )}
      </div>
    </div>
  );
};

interface ParishCardProps {
  parish: Parish;
  city: string;
  confession: string;
  onJoin: (parishId: string) => void;
  isCurrentParish: boolean;
  onViewDetails: () => void;
}

const ParishCard: React.FC<ParishCardProps> = ({ 
  parish, 
  city, 
  confession, 
  onJoin, 
  isCurrentParish,
  onViewDetails 
}) => {
  return (
    <Card hover className="relative h-full">
      {/* Badge de validation - Position corrigée */}
      {parish.validated && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
        </div>
      )}

      {/* Badge paroisse actuelle - Position corrigée pour ne pas masquer l'icône */}
      {isCurrentParish && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 bg-spiritual-100 text-spiritual-800 text-xs rounded-full font-medium shadow-sm">
            Ma paroisse
          </span>
        </div>
      )}

      <div className="space-y-4 h-full flex flex-col">
        {/* En-tête */}
        <div className="flex items-start space-x-3 pt-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-spiritual-400 to-primary-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <Church className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base">
              {parish.name}
            </h3>
            <p className="text-xs sm:text-sm text-spiritual-600 font-medium truncate">
              {confession}
            </p>
          </div>
        </div>

        {/* Informations */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{city}</span>
          </div>
          {parish.address && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
              {parish.address}
            </p>
          )}
        </div>

        {/* Statistiques simulées */}
        <div className="flex items-center justify-between text-xs sm:text-sm border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-1 text-gray-500">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{Math.floor(Math.random() * 500) + 50} membres</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <span>{Math.floor(Math.random() * 20) + 5} posts/sem</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {/* BOUTON CORRIGÉ : Ajout du onClick */}
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={onViewDetails}
          >
            Voir détails
          </Button>
          {!isCurrentParish && (
            <Button 
              variant="primary" 
              size="sm" 
              fullWidth
              onClick={() => onJoin(parish.id)}
            >
              Rejoindre
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};