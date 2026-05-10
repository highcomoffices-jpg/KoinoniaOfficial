import React, { useState } from 'react';
import { Brain, Clock, Star, Play, CheckCircle, Lock, Search, Filter, Award, Target, Zap, BookOpen, Heart, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { mockBiblicalPaths } from '../../data/mockPremiumData';
import { BiblicalPath, BiblicalPathCategory } from '../../types/premium';

export const BiblicalPathsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BiblicalPathCategory | ''>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [startedPaths, setStartedPaths] = useState<string[]>([]);

  const categoryOptions = [
    { value: BiblicalPathCategory.INNER_PEACE, label: 'Paix intérieure' },
    { value: BiblicalPathCategory.FAMILY_ISSUES, label: 'Problèmes familiaux' },
    { value: BiblicalPathCategory.PROFESSIONAL_SUCCESS, label: 'Succès professionnel' },
    { value: BiblicalPathCategory.HEALING, label: 'Guérison' },
    { value: BiblicalPathCategory.FORGIVENESS, label: 'Pardon' },
    { value: BiblicalPathCategory.GUIDANCE, label: 'Direction' },
    { value: BiblicalPathCategory.GRATITUDE, label: 'Gratitude' },
    { value: BiblicalPathCategory.FAITH_BUILDING, label: 'Renforcement de la foi' }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' }
  ];

  const filteredPaths = mockBiblicalPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || path.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || path.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleStartPath = (pathId: string, isPremium: boolean) => {
    if (isPremium) {
      setShowPremiumModal(true);
      return;
    }

    if (!startedPaths.includes(pathId)) {
      setStartedPaths(prev => [...prev, pathId]);
      // Simulation de démarrage du parcours
      const path = mockBiblicalPaths.find(p => p.id === pathId);
      if (path) {
        path.completionRate = 5; // Simulation de progression initiale
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec générateur IA */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Plans de lecture spirituels IA</h2>
          <p className="text-gray-600">Parcours bibliques personnalisés selon vos besoins</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={BookOpen}>
            Mes parcours
          </Button>
          <Button 
            variant="spiritual" 
            icon={Brain}
            onClick={() => setShowAIGenerator(true)}
          >
            Générer un parcours IA
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-spiritual-600">
            {mockBiblicalPaths.length}
          </div>
          <div className="text-sm text-gray-600">Parcours disponibles</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mockBiblicalPaths.filter(p => p.isAIGenerated).length}
          </div>
          <div className="text-sm text-gray-600">Générés par IA</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {startedPaths.length}
          </div>
          <div className="text-sm text-gray-600">Mes parcours actifs</div>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-warm-600">
            {mockBiblicalPaths.filter(p => p.difficulty === 'beginner').length}
          </div>
          <div className="text-sm text-gray-600">Niveau débutant</div>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un parcours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex space-x-3">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as BiblicalPathCategory | '')}
                options={categoryOptions}
                placeholder="Toutes catégories"
                className="min-w-[180px]"
              />
              <Select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                options={difficultyOptions}
                placeholder="Tous niveaux"
                className="min-w-[150px]"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Liste des parcours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPaths.map((path) => (
          <BiblicalPathCard 
            key={path.id} 
            path={path}
            hasStarted={startedPaths.includes(path.id)}
            onStart={() => handleStartPath(path.id, path.isPremium)}
          />
        ))}
      </div>

      {/* Générateur IA Modal */}
      {showAIGenerator && (
        <AIPathGeneratorModal onClose={() => setShowAIGenerator(false)} />
      )}

      {/* Modal Premium */}
      {showPremiumModal && (
        <PremiumModal onClose={() => setShowPremiumModal(false)} />
      )}
    </div>
  );
};

interface BiblicalPathCardProps {
  path: BiblicalPath;
  hasStarted: boolean;
  onStart: () => void;
}

const BiblicalPathCard: React.FC<BiblicalPathCardProps> = ({ path, hasStarted, onStart }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return difficulty;
    }
  };

  const currentProgress = hasStarted ? Math.max(path.completionRate, 5) : path.completionRate;

  return (
    <Card hover className="h-full flex flex-col group">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-spiritual-400 to-primary-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{path.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(path.difficulty)}`}>
                {getDifficultyLabel(path.difficulty)}
              </span>
              {path.isAIGenerated && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  🤖 IA
                </span>
              )}
              {path.isPremium && (
                <span className="px-2 py-1 bg-gradient-to-r from-spiritual-500 to-primary-500 text-white text-xs rounded-full">
                  Premium
                </span>
              )}
              {hasStarted && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  ✓ Démarré
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          {path.isPremium && <Lock className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Image */}
      {path.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden mb-4 relative group">
          <img
            src={path.imageUrl}
            alt={path.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-12 h-12 text-white" />
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{path.description}</p>

        {/* Détails enrichis */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{path.duration} jours</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{path.steps.length} étapes</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span className="font-medium">{path.difficulty}</span>
          </div>
        </div>

        {/* Progression avec animation */}
        {currentProgress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Progression</span>
              <span className="font-bold">{Math.round(currentProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-spiritual-500 to-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div className="text-xs text-spiritual-600 font-medium">
              Étape {Math.ceil((currentProgress / 100) * path.steps.length)} sur {path.steps.length}
            </div>
          </div>
        )}

        {/* Aperçu des étapes */}
        {path.steps.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Première étape :</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{path.steps[0].description}</p>
            <div className="flex items-center space-x-2 mt-2">
              <BookOpen className="w-3 h-3 text-spiritual-600" />
              <span className="text-xs text-spiritual-600 font-medium">
                {path.steps[0].verseReference}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer avec actions enrichies */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            {hasStarted ? 'Continuer' : 'Commencer'}
          </div>
          {path.isAIGenerated && (
            <div className="flex items-center space-x-1 text-blue-600">
              <Brain className="w-3 h-3" />
              <span className="text-xs">Personnalisé</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {!path.isPremium && (
            <Button variant="ghost" size="sm" icon={Download}>
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button 
            variant={path.isPremium ? "spiritual" : hasStarted ? "outline" : "primary"} 
            size="sm"
            icon={path.isPremium ? Lock : hasStarted ? Play : CheckCircle}
            onClick={onStart}
            className="group-hover:scale-105 transition-transform duration-200"
          >
            {path.isPremium ? 'Premium requis' : hasStarted ? 'Continuer' : 'Commencer'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface AIPathGeneratorModalProps {
  onClose: () => void;
}

const AIPathGeneratorModal: React.FC<AIPathGeneratorModalProps> = ({ onClose }) => {
  const [need, setNeed] = useState('');
  const [duration, setDuration] = useState('7');
  const [difficulty, setDifficulty] = useState('beginner');
  const [personalSituation, setPersonalSituation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const needOptions = [
    { value: 'peace', label: 'Paix intérieure et sérénité' },
    { value: 'family', label: 'Problème familial ou relationnel' },
    { value: 'work', label: 'Succès professionnel et carrière' },
    { value: 'healing', label: 'Guérison physique ou émotionnelle' },
    { value: 'guidance', label: 'Direction divine et discernement' },
    { value: 'forgiveness', label: 'Pardon et réconciliation' },
    { value: 'gratitude', label: 'Gratitude et reconnaissance' },
    { value: 'faith', label: 'Renforcement de la foi' }
  ];

  const durationOptions = [
    { value: '3', label: '3 jours - Parcours express' },
    { value: '7', label: '7 jours - Semaine spirituelle' },
    { value: '14', label: '14 jours - Approfondissement' },
    { value: '21', label: '21 jours - Transformation' },
    { value: '30', label: '30 jours - Parcours complet' }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Débutant - Versets simples et méditations courtes' },
    { value: 'intermediate', label: 'Intermédiaire - Réflexions approfondies' },
    { value: 'advanced', label: 'Avancé - Étude théologique et exégèse' }
  ];

  const generationSteps = [
    'Analyse de vos besoins spirituels...',
    'Sélection des versets appropriés...',
    'Génération des méditations personnalisées...',
    'Création du parcours adapté...',
    'Finalisation et optimisation...'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulation de génération IA avec étapes
    for (let i = 0; i < generationSteps.length; i++) {
      setGenerationStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setIsGenerating(false);
    onClose();
    
    // Simulation de création d'un nouveau parcours
    alert('🎉 Votre parcours personnalisé a été créé avec succès ! Il apparaîtra dans vos parcours actifs.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-spiritual-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Générateur de parcours IA
          </h2>
          <p className="text-gray-600">
            L'IA créera un parcours biblique personnalisé selon vos besoins spirituels
          </p>
        </div>

        {isGenerating ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-spiritual-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Génération en cours...
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {generationSteps[generationStep]}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-spiritual-500 to-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Étape {generationStep + 1} sur {generationSteps.length}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Select
              label="Quel est votre besoin spirituel principal ?"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              options={needOptions}
              placeholder="Sélectionnez votre besoin"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Décrivez votre situation (optionnel)
              </label>
              <textarea
                value={personalSituation}
                onChange={(e) => setPersonalSituation(e.target.value)}
                placeholder="Partagez plus de détails pour un parcours encore plus personnalisé..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <Select
              label="Durée souhaitée"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              options={durationOptions}
              required
            />

            <Select
              label="Niveau de difficulté"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              options={difficultyOptions}
              required
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Aperçu du parcours</span>
              </div>
              <p className="text-sm text-blue-800">
                L'IA créera un parcours de {duration} jours avec des versets, méditations et réflexions adaptés à votre besoin de {need ? needOptions.find(n => n.value === need)?.label.toLowerCase() : 'spiritualité'}.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button variant="outline" fullWidth onClick={onClose}>
                Annuler
              </Button>
              <Button 
                variant="spiritual" 
                fullWidth 
                onClick={handleGenerate}
                disabled={!need}
                icon={Brain}
              >
                Générer mon parcours
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
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
            Ce parcours est réservé aux membres Premium. Débloquez l'accès à tous les parcours IA personnalisés.
          </p>
          
          <div className="space-y-4">
            <div className="bg-spiritual-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-spiritual-900 mb-2">Avantages Premium :</h4>
              <ul className="text-sm text-spiritual-800 space-y-1">
                <li>• Parcours IA illimités et personnalisés</li>
                <li>• Méditations audio haute qualité</li>
                <li>• Suivi de progression avancé</li>
                <li>• Téléchargement hors ligne</li>
                <li>• Support spirituel prioritaire</li>
                <li>• Accès aux célébrations live premium</li>
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