import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { mockCities, mockConfessions } from '../../data/mockData';

interface ProposeParishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ProposeParishModal: React.FC<ProposeParishModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    confessionId: '',
    cityId: '',
    address: '',
    description: '',
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (step === 1) {
      if (formData.name && formData.confessionId && formData.cityId) {
        setStep(2);
      }
    } else {
      onSubmit(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      confessionId: '',
      cityId: '',
      address: '',
      description: '',
    });
    setStep(1);
    onClose();
  };

  const confessionOptions = mockConfessions.map(c => ({
    value: c.id,
    label: c.name,
  }));

  const cityOptions = mockCities.map(c => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Proposer une paroisse</h2>
            <p className="text-gray-600 text-sm mt-1">
              Étape {step} sur 2 - {step === 1 ? 'Informations générales' : 'Détails supplémentaires'}
            </p>
          </div>
          <button
            onClick={resetForm}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nom de la paroisse *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Cathédrale Notre-Dame"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Confession *
                  </label>
                  <Select
                    name="confessionId"
                    value={formData.confessionId}
                    onChange={handleSelectChange}
                    options={confessionOptions}
                    placeholder="Sélectionner une confession"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Ville *
                  </label>
                  <Select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleSelectChange}
                    options={cityOptions}
                    placeholder="Sélectionner une ville"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Adresse
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ex: 10 rue de Rivoli, 75001 Paris"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez la paroisse, ses activités, ses horaires..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ℹ️ Votre proposition sera vérifiée par nos modérateurs avant publication.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {step === 2 && (
            <Button variant="ghost" onClick={() => setStep(1)} fullWidth>
              Retour
            </Button>
          )}
          <Button variant="ghost" onClick={resetForm} fullWidth>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            fullWidth
            icon={step === 1 ? ChevronRight : undefined}
          >
            {step === 1 ? 'Continuer' : 'Proposer'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
