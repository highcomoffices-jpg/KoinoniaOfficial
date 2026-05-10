import React, { useState } from 'react';
import { X, MapPin, Users, Calendar, Phone, Mail, Edit2, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { mockCities, mockConfessions } from '../../data/mockData';

interface MyParishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeaveParish: () => void;
  userParish: any;
}

export const MyParishModal: React.FC<MyParishModalProps> = ({
  isOpen,
  onClose,
  onLeaveParish,
  userParish,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userParish?.name || '',
    address: userParish?.address || '',
    phone: userParish?.phone || '',
    email: userParish?.email || '',
    description: userParish?.description || '',
  });

  if (!isOpen || !userParish) return null;

  const getParishCity = (cityId: string) => {
    return mockCities.find(city => city.id === cityId)?.name || 'Ville inconnue';
  };

  const getParishConfession = (confessionId: string) => {
    return mockConfessions.find(confession => confession.id === confessionId)?.name || 'Confession inconnue';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saving parish data:', formData);
    setIsEditing(false);
  };

  const handleLeaveParish = () => {
    if (window.confirm('Êtes-vous sûr de vouloir quitter cette paroisse ?')) {
      onLeaveParish();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ma paroisse</h2>
            <p className="text-gray-600 text-sm mt-1">Gestion de votre paroisse</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 mb-6">
          {/* En-tête de la paroisse */}
          <div className="bg-gradient-to-r from-spiritual-50 to-primary-50 rounded-lg p-6 border border-spiritual-200">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-spiritual-400 to-primary-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">⛪</span>
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="font-semibold"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-spiritual-900">{userParish.name}</h3>
                    <p className="text-spiritual-700 font-medium">
                      {getParishConfession(userParish.confessionId)}
                    </p>
                    <p className="text-sm text-spiritual-600">
                      {getParishCity(userParish.cityId)}
                    </p>
                  </>
                )}
              </div>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit2}
                  onClick={() => setIsEditing(true)}
                >
                  Modifier
                </Button>
              )}
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Informations de contact</h4>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Adresse de la paroisse"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@paroisse.fr"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-spiritual-600 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600">Adresse</p>
                    <p className="text-gray-900">{userParish.address || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-spiritual-600 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600">Téléphone</p>
                    <p className="text-gray-900">{userParish.phone || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-spiritual-600 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-gray-900 break-all">{userParish.email || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-spiritual-600 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-600">Membres</p>
                    <p className="text-gray-900">{userParish.members || 0} membres</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">À propos</h4>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description de la paroisse..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              <p className="text-gray-600">
                {userParish.description || 'Aucune description disponible'}
              </p>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-spiritual-600">{userParish.postsCount || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Posts cette semaine</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-spiritual-600">{userParish.eventsCount || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Événements ce mois</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-spiritual-600">{userParish.members || 0}</p>
              <p className="text-xs text-gray-600 mt-1">Membres actifs</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 border-t pt-6">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)} fullWidth>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSave} fullWidth>
                Enregistrer les modifications
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onClose} fullWidth>
                Fermer
              </Button>
              <Button
                variant="danger"
                icon={LogOut}
                onClick={handleLeaveParish}
                fullWidth
              >
                Quitter la paroisse
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};
