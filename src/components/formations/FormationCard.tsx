import React, { useState } from 'react';
import { Star, Users, Clock, Heart, Play, Globe, Building, Award, Calendar, Eye, Share2, Download, Bookmark, MapPin, Zap } from 'lucide-react';
import { Formation } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CountdownTimer } from '../ui/CountdownTimer';
import { ProgressBar } from '../ui/ProgressBar';

interface FormationCardProps {
  formation: Formation;
  onClick: () => void;
  onEnroll: () => void;
  onLike: () => void;
  onShare: () => void;
  onBookmark: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
  isEnrolled: boolean;
}

export const FormationCard: React.FC<FormationCardProps> = ({ 
  formation, 
  onClick, 
  onEnroll,
  onLike, 
  onShare, 
  onBookmark,
  isLiked,
  isBookmarked,
  isEnrolled
}) => {
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 50) + 10);

  // Simulation de date de début (dans 1-60 jours)
  const startDate = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000);
  const isOnline = Math.random() > 0.5;
  const location = isOnline ? 'En ligne via Koinonia Live' : 'Église Saint-Michel, Cotonou';

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike();
  };

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEnroll();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare();
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark();
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    return `${price.toLocaleString()} FCFA`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const progressPercentage = formation.maxStudents 
    ? (formation.currentStudents / formation.maxStudents) * 100 
    : 0;

  const isFull = formation.maxStudents && formation.currentStudents >= formation.maxStudents;

  return (
    <Card hover className="h-full flex flex-col cursor-pointer group formation-card-hover" onClick={onClick}>
      {/* Image avec overlay et badges */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        {formation.imageUrl && (
          <img
            src={formation.imageUrl}
            alt={formation.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2">
            <Play className="w-8 h-8 text-white" />
            <span className="text-white font-medium">Voir la présentation</span>
          </div>
        </div>
        
        {/* Badge temps restant */}
        <div className="absolute top-3 left-3">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full px-3 py-1 font-medium animate-pulse">
            <CountdownTimer 
              targetDate={startDate} 
              size="sm" 
              showLabels={false}
              className="text-white"
            />
          </div>
        </div>

        {/* Boutons d'action - DÉPLACÉS EN BAS À DROITE */}
        <div className="absolute bottom-3 right-3 flex space-x-1">
          <button onClick={handleBookmark} className="p-2 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100 transition-all">
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
          </button>
          <button onClick={handleLike} className="p-2 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100 transition-all">
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>

        {/* Badge inscription */}
        {isEnrolled && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-green-500 text-white text-xs rounded-full px-3 py-1 font-medium">
              ✓ Inscrit
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex-1 space-y-3">
        {/* Titre et mini-description */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {formation.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {formation.description.split('.')[0]}.
          </p>
        </div>

        {/* Formateur avec photo */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-spiritual-400 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {formation.instructor.firstName[0]}{formation.instructor.lastName[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {formation.instructor.firstName} {formation.instructor.lastName}
            </p>
            <p className="text-xs text-gray-500">Formateur certifié</p>
          </div>
        </div>

        {/* Lieu */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {isOnline ? (
            <>
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-medium">{location}</span>
            </>
          ) : (
            <>
              <Building className="w-4 h-4 text-gray-500" />
              <span>{location}</span>
            </>
          )}
        </div>

        {/* Places restantes avec barre visuelle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Places</span>
            <span className="font-bold">
              {formation.currentStudents}/{formation.maxStudents || '∞'} inscrits
            </span>
          </div>
          {formation.maxStudents && (
            <ProgressBar
              current={formation.currentStudents}
              max={formation.maxStudents}
              size="sm"
              color={progressPercentage > 80 ? 'red' : progressPercentage > 60 ? 'orange' : 'green'}
              showPercentage={false}
              showNumbers={false}
            />
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {formation.maxStudents ? `${Math.round(progressPercentage)}% rempli` : 'Places illimitées'}
            </span>
            <span className={`font-medium ${
              progressPercentage > 80 ? 'text-red-600' : 
              progressPercentage > 60 ? 'text-orange-600' : 'text-green-600'
            }`}>
              {formation.maxStudents && formation.maxStudents - formation.currentStudents > 0 
                ? `${formation.maxStudents - formation.currentStudents} places restantes`
                : formation.maxStudents ? 'Complet' : 'Ouvert'
              }
            </span>
          </div>
        </div>

        {/* Note moyenne + nb avis */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(formation.rating)}
            </div>
            <span className="text-sm font-medium text-gray-900">{formation.rating}</span>
            <span className="text-sm text-gray-500">| {formation.reviewsCount} avis</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formation.duration}</span>
          </div>
        </div>

        {/* Détails supplémentaires */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4" />
            <span>{formation.modules.length} modules</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{likesCount} likes</span>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleViewDetails}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Voir détails</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Partager</span>
            </button>
          </div>
          <button
            onClick={handleViewDetails}
            className="text-xs text-spiritual-600 hover:text-spiritual-700 font-medium"
          >
            Programme complet →
          </button>
        </div>
      </div>

      {/* Footer avec prix bien visible et bouton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="text-xl font-bold text-primary-600">
          {formatPrice(formation.price)}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewDetails}
            className="group-hover:scale-105 transition-transform duration-200"
          >
            Détails
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleEnroll}
            disabled={isFull}
            className="group-hover:scale-105 transition-transform duration-200"
          >
            {isFull ? 'Complet' : isEnrolled ? 'Inscrit ✓' : 'S\'inscrire'}
          </Button>
        </div>
      </div>
    </Card>
  );
};