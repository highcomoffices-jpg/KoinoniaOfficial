import React, { useState } from 'react';
import { Heart, Gift } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { Select } from './Select';
import { mockOrganizations } from '../../data/mockPremiumData';
import { PaymentMethod } from '../../types/premium';

interface MicroDonationButtonProps {
  targetType: 'post' | 'live' | 'prayer' | 'formation';
  targetId: string;
  className?: string;
}

export const MicroDonationButton: React.FC<MicroDonationButtonProps> = ({ 
  targetType, 
  targetId, 
  className = '' 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MOBILE_MONEY);
  const [isProcessing, setIsProcessing] = useState(false);

  const beneficiaryOptions = mockOrganizations.map(org => ({
    value: org.id,
    label: org.name
  }));

  const paymentMethodOptions = [
    { value: PaymentMethod.MOBILE_MONEY, label: 'Mobile Money' },
    { value: PaymentMethod.CARD, label: 'Carte bancaire' },
    { value: PaymentMethod.CRYPTO, label: 'Cryptomonnaie' }
  ];

  const handleDonate = async () => {
    if (!amount || parseInt(amount) < 100) return;

    setIsProcessing(true);
    
    // Simulation de traitement du paiement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowModal(false);
    setAmount('');
    setBeneficiaryId('');
    
    // Afficher une notification de succès
    alert(`Merci ! Votre don de ${amount} FCFA a été envoyé avec succès.`);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        icon={Gift}
        onClick={() => setShowModal(true)}
        className={`text-warm-600 hover:text-warm-700 hover:bg-warm-50 ${className}`}
      >
        Offrande
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-warm-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Faire une micro-offrande
              </h2>
              <p className="text-gray-600">
                Soutenez cette {targetType === 'post' ? 'publication' : 
                              targetType === 'live' ? 'diffusion' :
                              targetType === 'prayer' ? 'prière' : 'formation'} par votre générosité
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Montant (FCFA)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Minimum 100 FCFA"
                min="100"
                required
              />

              <div className="grid grid-cols-3 gap-2">
                {[100, 500, 1000].map((suggestedAmount) => (
                  <button
                    key={suggestedAmount}
                    onClick={() => setAmount(suggestedAmount.toString())}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                  >
                    {suggestedAmount} FCFA
                  </button>
                ))}
              </div>

              <Select
                label="Bénéficiaire (optionnel)"
                value={beneficiaryId}
                onChange={(e) => setBeneficiaryId(e.target.value)}
                options={beneficiaryOptions}
                placeholder="Sélectionnez une organisation"
              />

              <Select
                label="Méthode de paiement"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                options={paymentMethodOptions}
                required
              />

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p className="mb-1">💡 <strong>Micro-offrande :</strong></p>
                <p>Votre don sera directement versé à l'organisation choisie ou à la communauté générale.</p>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => setShowModal(false)}
                  disabled={isProcessing}
                >
                  Annuler
                </Button>
                <Button 
                  variant="spiritual" 
                  fullWidth 
                  onClick={handleDonate}
                  loading={isProcessing}
                  disabled={!amount || parseInt(amount) < 100}
                >
                  {isProcessing ? 'Traitement...' : 'Confirmer le don'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};