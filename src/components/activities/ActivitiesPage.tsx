import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Calendar, MapPin, Clock, Users, Plus, Church, BookOpen, Heart, Music } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { mockParishActivities } from '../../data/mockServicesData';
import { ParishActivity, ActivityType } from '../../types';

export const ActivitiesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityType | ''>('');
  const [selectedParish, setSelectedParish] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Filtrer les activités
  const filteredActivities = useMemo(() => {
    return mockParishActivities.filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || activity.type === selectedType;
      const matchesParish = !selectedParish || activity.parishId === selectedParish;
      
      // Filtrer par date
      const now = new Date();
      const activityDate = new Date(activity.date);
      let matchesDate = true;
      
      switch (dateFilter) {
        case 'today':
          matchesDate = activityDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          matchesDate = activityDate >= now && activityDate <= weekFromNow;
          break;
        case 'month':
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          matchesDate = activityDate >= now && activityDate <= monthFromNow;
          break;
        default:
          matchesDate = activityDate >= now; // Activités futures uniquement
      }
      
      return matchesSearch && matchesType && matchesParish && matchesDate && activity.isActive;
    });
  }, [searchTerm, selectedType, selectedParish, dateFilter]);

  const activityTypeOptions = [
    { value: ActivityType.MASS, label: 'Messes' },
    { value: ActivityType.PRAYER_MEETING, label: 'Réunions de prière' },
    { value: ActivityType.BIBLE_STUDY, label: 'Études bibliques' },
    { value: ActivityType.YOUTH_GATHERING, label: 'Rassemblements jeunes' },
    { value: ActivityType.CHARITY_EVENT, label: 'Événements caritatifs' },
    { value: ActivityType.PILGRIMAGE, label: 'Pèlerinages' },
    { value: ActivityType.RETREAT, label: 'Retraites' },
    { value: ActivityType.CONFERENCE, label: 'Conférences' },
    { value: ActivityType.CONCERT, label: 'Concerts' },
    { value: ActivityType.FESTIVAL, label: 'Festivals' },
    { value: ActivityType.COMMUNITY_SERVICE, label: 'Services communautaires' },
    { value: ActivityType.OTHER, label: 'Autres' }
  ];

  const parishOptions = [
    { value: '1', label: 'Cathédrale Notre-Dame de Miséricorde' },
    { value: '4', label: 'Église Évangélique du Bénin' }
  ];

  const dateFilterOptions = [
    { value: 'all', label: 'Toutes les dates' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' }
  ];

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.MASS: return Church;
      case ActivityType.BIBLE_STUDY: return BookOpen;
      case ActivityType.CONCERT: return Music;
      case ActivityType.PRAYER_MEETING: return Heart;
      default: return Calendar;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedParish('');
    setDateFilter('all');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              Activités Paroissiales
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Découvrez et participez aux activités de votre communauté
            </p>
          </div>
          <Button variant="primary" icon={Plus} className="w-full lg:w-auto">
            Proposer une activité
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary-600">
              {filteredActivities.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Activités à venir</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-spiritual-600">
              {filteredActivities.filter(a => a.type === ActivityType.MASS).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Messes programmées</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-warm-600">
              {filteredActivities.filter(a => a.type === ActivityType.CHARITY_EVENT).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Actions caritatives</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {filteredActivities.reduce((sum, a) => sum + a.currentParticipants, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Participants inscrits</div>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <div className="space-y-4">
            <div className="flex flex-col space-y-4 xl:flex-row xl:items-center xl:space-y-0 xl:space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher une activité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ActivityType | '')}
                  options={activityTypeOptions}
                  placeholder="Tous les types"
                  className="w-full sm:min-w-[180px]"
                />
                <Select
                  value={selectedParish}
                  onChange={(e) => setSelectedParish(e.target.value)}
                  options={parishOptions}
                  placeholder="Toutes paroisses"
                  className="w-full sm:min-w-[200px]"
                />
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  options={dateFilterOptions}
                  className="w-full sm:min-w-[150px]"
                />
              </div>
            </div>
            
            {(searchTerm || selectedType || selectedParish || dateFilter !== 'all') && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                  {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} trouvée{filteredActivities.length > 1 ? 's' : ''}
                </p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Liste des activités */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Message si aucune activité */}
        {filteredActivities.length === 0 && (
          <Card className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune activité trouvée
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">
              Aucune activité ne correspond à vos critères de recherche.
            </p>
            <Button variant="primary" icon={Plus}>
              Proposer une activité
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

interface ActivityCardProps {
  activity: ParishActivity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const [isInterested, setIsInterested] = useState(false);
  const ActivityIcon = getActivityIcon(activity.type);

  const handleInterest = () => {
    setIsInterested(!isInterested);
  };

  const handleRegister = () => {
    // Logique d'inscription
    console.log('S\'inscrire à l\'activité:', activity.id);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const isUpcoming = new Date(activity.date) > new Date();
  const isFull = activity.maxParticipants && activity.currentParticipants >= activity.maxParticipants;

  return (
    <Card hover className="h-full flex flex-col">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-spiritual-400 to-primary-400 rounded-lg flex items-center justify-center">
            <ActivityIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
              {activity.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {activity.parish.name}
            </p>
          </div>
        </div>
        <button
          onClick={handleInterest}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Heart className={`w-4 h-4 ${isInterested ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Image */}
      {activity.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden mb-4">
          <img
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">
          {activity.description}
        </p>

        {/* Détails */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(activity.date)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{activity.location}</span>
          </div>

          {activity.maxParticipants && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                {activity.currentParticipants}/{activity.maxParticipants} participants
              </span>
              {isFull && <span className="text-red-500 text-xs">(Complet)</span>}
            </div>
          )}

          {activity.price && activity.price > 0 && (
            <div className="text-lg font-bold text-primary-600">
              {activity.price.toLocaleString()} FCFA
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {activity.isRecurring && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Récurrent
            </span>
          )}
          {!isUpcoming && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
              Passé
            </span>
          )}
          {activity.price === 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Gratuit
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="text-sm text-gray-500">
          Par {activity.organizer.firstName} {activity.organizer.lastName}
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleRegister}
          disabled={!isUpcoming || isFull}
        >
          {isFull ? 'Complet' : isUpcoming ? 'Participer' : 'Terminé'}
        </Button>
      </div>
    </Card>
  );
};

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case ActivityType.MASS: return Church;
    case ActivityType.BIBLE_STUDY: return BookOpen;
    case ActivityType.CONCERT: return Music;
    case ActivityType.PRAYER_MEETING: return Heart;
    default: return Calendar;
  }
}