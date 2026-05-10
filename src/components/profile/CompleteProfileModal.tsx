import React, { useState, useEffect } from 'react';
import { X, MapPin, Church, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { useGeoData } from '../../hooks/useGeoData';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { user, updateProfile } = useAuth();
  const { 
    countries, 
    cities, 
    confessions, 
    parishes,
    isLoading: geoLoading,
    loadCitiesByCountry,
    loadParishesByCityAndConfession 
  } = useGeoData();

  const [formData, setFormData] = useState({
    countryId: '',
    cityId: '',
    confessionId: '',
    parishId: '',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with user data
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        countryId: user.country?.id || '',
        cityId: user.cityId || '',
        confessionId: user.confession?.id || '',
        parishId: user.parish?.id || '',
        bio: user.bio || '',
      });
    }
  }, [user, isOpen]);

  // Load cities when country changes
  useEffect(() => {
    if (formData.countryId && isOpen) {
      loadCitiesByCountry(formData.countryId);
    }
  }, [formData.countryId, loadCitiesByCountry, isOpen]);

  // Load parishes when city or confession changes
  useEffect(() => {
    if ((formData.cityId || formData.confessionId) && isOpen) {
      loadParishesByCityAndConfession(formData.cityId, formData.confessionId);
    }
  }, [formData.cityId, formData.confessionId, loadParishesByCityAndConfession, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Reset parish if city or confession changes
      if ((name === 'cityId' || name === 'confessionId') && prev.parishId) {
        newData.parishId = '';
      }
      
      return newData;
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (!user) throw new Error('Utilisateur non trouvé');

      // Validation
      const validationErrors: Record<string, string> = {};
      
      if (!formData.countryId.trim()) {
        validationErrors.countryId = 'Le pays est requis';
      }
      
      if (!formData.cityId.trim()) {
        validationErrors.cityId = 'La ville est requise';
      }
      
      if (!formData.confessionId.trim()) {
        validationErrors.confessionId = 'La confession est requise';
      }
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }

      // Prepare update data
      const updateData: any = {
        country_id: formData.countryId,
        city_id: formData.cityId,
        confession_id: formData.confessionId,
        profile_complete: true,
      };

      if (formData.parishId.trim()) {
        updateData.parish_id = formData.parishId;
      }

      if (formData.bio.trim()) {
        updateData.bio = formData.bio;
      }

      await updateProfile(updateData);
      onComplete();
      onClose();

    } catch (error: any) {
      console.error('Error completing profile:', error);
      setErrors({
        general: error.message || 'Une erreur est survenue',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate options for selects
  const countryOptions = countries.map(country => ({
    value: country.id,
    label: country.name,
  })).sort((a, b) => a.label.localeCompare(b.label));

  const cityOptions = cities.map(city => ({
    value: city.id,
    label: city.name,
  })).sort((a, b) => a.label.localeCompare(b.label));

  const confessionOptions = confessions.map(confession => ({
    value: confession.id,
    label: confession.name,
  })).sort((a, b) => a.label.localeCompare(b.label));

  const parishOptions = parishes
    .filter(parish => {
      if (formData.cityId && parish.city_id !== formData.cityId) return false;
      if (formData.confessionId && parish.confession_id !== formData.confessionId) return false;
      return true;
    })
    .map(parish => ({
      value: parish.id,
      label: parish.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Compléter votre profil</h2>
              <p className="text-gray-600 mt-1">Quelques informations pour personnaliser votre expérience</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-spiritual-400 rounded-full flex items-center justify-center">
                <div className="text-white text-xl font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Localisation
              </h3>
              
              <Select
                label="Pays"
                name="countryId"
                value={formData.countryId}
                onChange={handleChange}
                options={countryOptions}
                placeholder="Sélectionnez votre pays"
                error={errors.countryId}
                disabled={isLoading || geoLoading}
                required
              />

              <Select
                label="Ville"
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                options={cityOptions}
                placeholder={formData.countryId ? "Sélectionnez votre ville" : "Sélectionnez d'abord un pays"}
                error={errors.cityId}
                disabled={isLoading || geoLoading || !formData.countryId}
                required
              />
            </div>

            {/* Religious Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Church className="w-5 h-5 mr-2 text-spiritual-600" />
                Confession religieuse
              </h3>
              
              <Select
                label="Confession religieuse"
                name="confessionId"
                value={formData.confessionId}
                onChange={handleChange}
                options={confessionOptions}
                placeholder="Sélectionnez votre confession"
                error={errors.confessionId}
                disabled={isLoading || geoLoading}
                required
              />

              <Select
                label="Paroisse/Église (optionnel)"
                name="parishId"
                value={formData.parishId}
                onChange={handleChange}
                options={parishOptions}
                placeholder="Sélectionnez votre paroisse"
                error={errors.parishId}
                disabled={isLoading || !formData.cityId || !formData.confessionId}
                helptext={parishOptions.length === 0 ? "Aucune paroisse trouvée" : undefined}
              />
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                À propos de vous
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biographie (optionnel)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Parlez-nous un peu de vous..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none disabled:bg-gray-100"
                  disabled={isLoading}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {formData.bio.length}/500 caractères
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Plus tard
              </Button>
              <Button
                type="submit"
                variant="spiritual"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Enregistrement...' : 'Terminer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};