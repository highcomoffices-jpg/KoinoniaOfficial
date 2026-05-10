import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, MapPin, Clock, Heart, Star, ShoppingBag, Book, Music, Cross, Gift, ArrowLeft, Phone, MessageCircle, Mail, X, Eye, Bookmark, Share2, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Pagination } from '../ui/Pagination';
import { usePagination } from '../../hooks/usePagination';
import { mockMarketItems } from '../../data/mockMarketData';
import { MarketItem, MarketCategory } from '../../types/market';

export const MarketPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory | ''>('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
  const [contactingItem, setContactingItem] = useState<MarketItem | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Filtrer les articles selon les critères
  const filteredItems = useMemo(() => {
    let filtered = mockMarketItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesLocation = !selectedLocation || item.location.includes(selectedLocation);
      
      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Tri
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedLocation, sortBy]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedItems,
    goToPage,
    resetPagination
  } = usePagination({ data: filteredItems, itemsPerPage: 20 });

  // Reset pagination when filters change
  React.useEffect(() => {
    resetPagination();
  }, [searchTerm, selectedCategory, selectedLocation, sortBy, resetPagination]);

  const categoryOptions = [
    { value: MarketCategory.BOOKS, label: 'Livres & Ressources' },
    { value: MarketCategory.MUSIC, label: 'Musique & Louange' },
    { value: MarketCategory.CRAFTS, label: 'Artisanat Chrétien' },
    { value: MarketCategory.CLOTHING, label: 'Vêtements & Accessoires' },
    { value: MarketCategory.SERVICES, label: 'Services' },
    { value: MarketCategory.EVENTS, label: 'Événements' },
    { value: MarketCategory.DONATIONS, label: 'Dons & Collectes' },
    { value: MarketCategory.OTHER, label: 'Autres' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'popular', label: 'Plus populaires' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' }
  ];

  const getCategoryIcon = (category: MarketCategory) => {
    switch (category) {
      case MarketCategory.BOOKS: return Book;
      case MarketCategory.MUSIC: return Music;
      case MarketCategory.CRAFTS: return Cross;
      case MarketCategory.CLOTHING: return ShoppingBag;
      case MarketCategory.SERVICES: return Star;
      case MarketCategory.EVENTS: return Clock;
      case MarketCategory.DONATIONS: return Gift;
      default: return ShoppingBag;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSortBy('recent');
  };

  const handleItemClick = (item: MarketItem) => {
    setSelectedItem(item);
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  const handleLike = (itemId: string) => {
    setLikedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBookmark = (itemId: string) => {
    setBookmarkedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleShare = async (item: MarketItem) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers !');
      }
    } catch (error) {
      console.log('Partage annulé');
    }
  };

  const handleContact = (item: MarketItem) => {
    setContactingItem(item);
  };

  const handleShowFavorites = () => {
    // Logique pour afficher les favoris
    alert(`Vous avez ${bookmarkedItems.length} article(s) en favoris`);
  };

  const handleCreateListing = () => {
    // Logique pour créer une annonce
    alert('Fonctionnalité de création d\'annonce - À implémenter');
  };

  // Si un article est sélectionné, afficher la page de détail
  if (selectedItem) {
    return (
      <MarketItemDetail 
        item={selectedItem}
        onBack={handleBackToList}
        onLike={() => handleLike(selectedItem.id)}
        onBookmark={() => handleBookmark(selectedItem.id)}
        onShare={() => handleShare(selectedItem)}
        onContact={() => handleContact(selectedItem)}
        isLiked={likedItems.includes(selectedItem.id)}
        isBookmarked={bookmarkedItems.includes(selectedItem.id)}
        onImageClick={(index) => {
          setSelectedImageIndex(index);
          setShowImageModal(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* En-tête responsive */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              Market Chrétien
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Achetez, vendez et partagez des ressources chrétiennes avec votre communauté
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              variant="outline" 
              icon={Heart} 
              className="w-full sm:w-auto"
              onClick={handleShowFavorites}
            >
              Mes favoris ({bookmarkedItems.length})
            </Button>
            <Button 
              variant="primary" 
              icon={Plus} 
              className="w-full sm:w-auto"
              onClick={handleCreateListing}
            >
              Publier une annonce
            </Button>
          </div>
        </div>

        {/* Statistiques rapides responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary-600">{mockMarketItems.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Annonces actives</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-spiritual-600">
              {mockMarketItems.filter(item => item.category === MarketCategory.BOOKS).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Livres disponibles</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-warm-600">
              {mockMarketItems.filter(item => item.category === MarketCategory.SERVICES).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Services proposés</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {mockMarketItems.filter(item => item.category === MarketCategory.DONATIONS).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Collectes actives</div>
          </Card>
        </div>

        {/* Filtres et recherche responsive */}
        <Card>
          <div className="space-y-4">
            <div className="flex flex-col space-y-4 xl:flex-row xl:items-center xl:space-y-0 xl:space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher des livres, musiques, services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as MarketCategory | '')}
                  options={categoryOptions}
                  placeholder="Toutes catégories"
                  className="w-full sm:min-w-[180px]"
                />
                <Input
                  placeholder="Ville ou région"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  icon={MapPin}
                  className="w-full sm:min-w-[150px]"
                />
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={sortOptions}
                  className="w-full sm:min-w-[150px]"
                />
              </div>
            </div>
            
            {(searchTerm || selectedCategory || selectedLocation) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                  {filteredItems.length} annonce{filteredItems.length > 1 ? 's' : ''} trouvée{filteredItems.length > 1 ? 's' : ''}
                </p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Grille des articles responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {paginatedItems.map((item) => (
            <MarketItemCard 
              key={item.id} 
              item={item}
              onItemClick={() => handleItemClick(item)}
              onLike={() => handleLike(item.id)}
              onBookmark={() => handleBookmark(item.id)}
              onShare={() => handleShare(item)}
              onContact={() => handleContact(item)}
              isLiked={likedItems.includes(item.id)}
              isBookmarked={bookmarkedItems.includes(item.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={filteredItems.length}
            itemsPerPage={20}
          />
        )}

        {/* Message si aucun article trouvé */}
        {filteredItems.length === 0 && (
          <Card className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune annonce trouvée
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">
              Essayez de modifier vos critères de recherche ou soyez le premier à publier !
            </p>
            <Button variant="primary" icon={Plus} onClick={handleCreateListing}>
              Publier une annonce
            </Button>
          </Card>
        )}

        {/* Modal de contact */}
        {contactingItem && (
          <ContactModal 
            item={contactingItem}
            onClose={() => setContactingItem(null)}
          />
        )}

        {/* Modal d'image agrandie */}
        {showImageModal && selectedItem && (
          <ImageModal 
            images={[selectedItem.imageUrl]}
            selectedIndex={selectedImageIndex}
            onClose={() => setShowImageModal(false)}
            onNavigate={setSelectedImageIndex}
          />
        )}
      </div>
    </div>
  );
};

interface MarketItemCardProps {
  item: MarketItem;
  onItemClick: () => void;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onContact: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
}

const MarketItemCard: React.FC<MarketItemCardProps> = ({ 
  item, 
  onItemClick, 
  onLike, 
  onBookmark, 
  onShare, 
  onContact,
  isLiked, 
  isBookmarked 
}) => {
  const CategoryIcon = getCategoryIcon(item.category);

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    return `${price.toLocaleString()} FCFA`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Aujourd\'hui';
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    return new Intl.DateTimeFormat('fr').format(date);
  };

  const getCategoryColor = (category: MarketCategory) => {
    switch (category) {
      case MarketCategory.BOOKS: return 'bg-blue-100 text-blue-800';
      case MarketCategory.MUSIC: return 'bg-purple-100 text-purple-800';
      case MarketCategory.CRAFTS: return 'bg-amber-100 text-amber-800';
      case MarketCategory.CLOTHING: return 'bg-pink-100 text-pink-800';
      case MarketCategory.SERVICES: return 'bg-green-100 text-green-800';
      case MarketCategory.EVENTS: return 'bg-indigo-100 text-indigo-800';
      case MarketCategory.DONATIONS: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card hover className="relative h-full flex flex-col group">
      {/* Badge catégorie */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(item.category)} shadow-sm`}>
          <CategoryIcon className="w-3 h-3 inline mr-1" />
          {item.category}
        </span>
      </div>

      {/* Boutons d'action */}
      <div className="absolute top-3 right-3 z-10 flex space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          className="p-2 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="p-2 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Image cliquable */}
      <div 
        className="aspect-square rounded-lg overflow-hidden mb-4 cursor-pointer relative group"
        onClick={onItemClick}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Contenu */}
      <div className="space-y-3 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 
            className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm sm:text-base cursor-pointer hover:text-primary-600 transition-colors"
            onClick={onItemClick}
          >
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Prix */}
        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-primary-600">
            {formatPrice(item.price)}
          </span>
          {item.condition && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {item.condition}
            </span>
          )}
        </div>

        {/* Vendeur et localisation */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-primary-400 to-spiritual-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-white font-bold">
              {item.seller.firstName[0]}
            </span>
          </div>
          <span className="flex-1 truncate">{item.seller.firstName}</span>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[80px]">{item.location}</span>
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{item.likes + (isLiked ? 1 : 0)}</span>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <Share2 className="w-3 h-3" />
              <span>Partager</span>
            </button>
            <span className="hidden sm:inline">{formatDate(item.createdAt)}</span>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onItemClick();
              }}
            >
              Détails
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onContact();
              }}
            >
              Contacter
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface MarketItemDetailProps {
  item: MarketItem;
  onBack: () => void;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onContact: () => void;
  isLiked: boolean;
  isBookmarked: boolean;
  onImageClick: (index: number) => void;
}

const MarketItemDetail: React.FC<MarketItemDetailProps> = ({ 
  item, 
  onBack, 
  onLike, 
  onBookmark, 
  onShare, 
  onContact,
  isLiked, 
  isBookmarked,
  onImageClick 
}) => {
  const CategoryIcon = getCategoryIcon(item.category);
  const [viewCount] = useState(Math.floor(Math.random() * 200) + 50);

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    return `${price.toLocaleString()} FCFA`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryColor = (category: MarketCategory) => {
    switch (category) {
      case MarketCategory.BOOKS: return 'bg-blue-100 text-blue-800';
      case MarketCategory.MUSIC: return 'bg-purple-100 text-purple-800';
      case MarketCategory.CRAFTS: return 'bg-amber-100 text-amber-800';
      case MarketCategory.CLOTHING: return 'bg-pink-100 text-pink-800';
      case MarketCategory.SERVICES: return 'bg-green-100 text-green-800';
      case MarketCategory.EVENTS: return 'bg-indigo-100 text-indigo-800';
      case MarketCategory.DONATIONS: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDetailedDescription = () => {
    switch (item.category) {
      case MarketCategory.BOOKS:
        return `${item.description}\n\nCe livre est en ${item.condition?.toLowerCase()} et contient des enseignements précieux pour votre croissance spirituelle. Idéal pour l'étude personnelle ou en groupe.`;
      case MarketCategory.SERVICES:
        return `${item.description}\n\nService professionnel proposé par un membre vérifié de notre communauté. Tarif compétitif et qualité garantie.`;
      case MarketCategory.DONATIONS:
        return `${item.description}\n\nVotre contribution fera une différence réelle dans la vie des bénéficiaires. Chaque don compte pour cette noble cause.`;
      default:
        return `${item.description}\n\nArticle proposé par un membre de confiance de notre communauté chrétienne.`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb et retour */}
        <div className="flex items-center space-x-2 mb-6">
          <Button 
            variant="ghost" 
            icon={ArrowLeft} 
            onClick={onBack}
            className="hover:bg-primary-50 hover:text-primary-600"
          >
            Retour au Market
          </Button>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">{item.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero section */}
            <Card>
              <div className="space-y-4">
                {/* Image principale */}
                <div 
                  className="aspect-video rounded-lg overflow-hidden cursor-pointer group relative"
                  onClick={() => onImageClick(0)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <Eye className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Titre et badges */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${getCategoryColor(item.category)}`}>
                      <CategoryIcon className="w-4 h-4 inline mr-1" />
                      {item.category}
                    </span>
                    {item.condition && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {item.condition}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Disponible</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {item.title}
                  </h1>

                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(item.price)}
                  </div>
                </div>
              </div>
            </Card>

            {/* Description détaillée */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {getDetailedDescription()}
                </p>
              </div>
            </Card>

            {/* Informations détaillées */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations détaillées</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Catégorie</span>
                  <p className="font-medium">{item.category}</p>
                </div>
                {item.condition && (
                  <div>
                    <span className="text-sm text-gray-500">État</span>
                    <p className="font-medium">{item.condition}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">Localisation</span>
                  <p className="font-medium">{item.location}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Publié le</span>
                  <p className="font-medium">{formatDate(item.createdAt)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Vues</span>
                  <p className="font-medium">{viewCount} vues</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Référence</span>
                  <p className="font-medium text-xs">#{item.id.toUpperCase()}</p>
                </div>
              </div>
            </Card>

            {/* Conseils de sécurité */}
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Conseils de sécurité</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Rencontrez le vendeur dans un lieu public</li>
                    <li>• Vérifiez l'article avant le paiement</li>
                    <li>• Utilisez des moyens de paiement sécurisés</li>
                    <li>• Signalez tout comportement suspect</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vendeur */}
            <Card className="sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Vendeur</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-spiritual-400 rounded-full flex items-center justify-center">
                    {item.seller.avatar ? (
                      <img
                        src={item.seller.avatar}
                        alt={`${item.seller.firstName} ${item.seller.lastName}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold">
                        {item.seller.firstName[0]}{item.seller.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {item.seller.firstName} {item.seller.lastName}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">4.8</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Vendeur vérifié</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Membre depuis 2 ans</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-purple-500" />
                    <span>15 articles vendus</span>
                  </div>
                </div>

                {/* Actions de contact */}
                <div className="space-y-2">
                  <Button 
                    variant="primary" 
                    fullWidth 
                    icon={MessageCircle}
                    onClick={onContact}
                  >
                    Contacter le vendeur
                  </Button>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={isLiked ? Heart : Heart}
                      onClick={onLike}
                      className={isLiked ? 'text-red-600 border-red-600' : ''}
                    >
                      {isLiked ? 'Aimé' : 'Aimer'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Bookmark}
                      onClick={onBookmark}
                      className={isBookmarked ? 'text-yellow-600 border-yellow-600' : ''}
                    >
                      {isBookmarked ? 'Sauvé' : 'Sauver'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Share2}
                      onClick={onShare}
                    >
                      Partager
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Statistiques */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vues</span>
                  <span className="font-medium">{viewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Likes</span>
                  <span className="font-medium">{item.likes + (isLiked ? 1 : 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Publié</span>
                  <span className="font-medium text-sm">{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </Card>

            {/* Articles similaires */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Articles similaires</h3>
              <div className="space-y-3">
                {mockMarketItems
                  .filter(i => i.category === item.category && i.id !== item.id)
                  .slice(0, 3)
                  .map(similarItem => (
                    <div key={similarItem.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <img
                        src={similarItem.imageUrl}
                        alt={similarItem.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {similarItem.title}
                        </h4>
                        <p className="text-sm text-primary-600 font-bold">
                          {formatPrice(similarItem.price)}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ContactModalProps {
  item: MarketItem;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ item, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState<'message' | 'phone' | 'whatsapp' | 'email'>('message');
  const [message, setMessage] = useState(`Bonjour ${item.seller.firstName},\n\nJe suis intéressé(e) par votre annonce "${item.title}".\n\nPouvez-vous me donner plus d'informations ?\n\nMerci !`);
  const [isProcessing, setIsProcessing] = useState(false);

  const contactMethods = [
    {
      id: 'message',
      label: 'Message Koinonia',
      icon: MessageCircle,
      description: 'Sécurisé et privé',
      color: 'text-blue-600'
    },
    {
      id: 'phone',
      label: 'Appel téléphonique',
      icon: Phone,
      description: 'Contact direct',
      color: 'text-green-600'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      description: 'Messagerie instantanée',
      color: 'text-green-600'
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      description: 'Communication formelle',
      color: 'text-purple-600'
    }
  ];

  const handleContact = async () => {
    setIsProcessing(true);

    // Simulation de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (selectedMethod) {
      case 'message':
        alert('Message envoyé via Koinonia ! Le vendeur recevra une notification.');
        break;
      case 'phone':
        window.open(`tel:+22997123456`, '_self');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/22997123456?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${item.seller.firstName.toLowerCase()}@example.com?subject=${encodeURIComponent(`Intérêt pour: ${item.title}`)}&body=${encodeURIComponent(message)}`, '_self');
        break;
    }

    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Contacter {item.seller.firstName}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Article concerné */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-lg font-bold text-primary-600">{formatPrice(item.price)}</p>
            </div>
          </div>
        </div>

        {/* Méthodes de contact */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Choisissez votre méthode de contact :</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id as any)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-600' : method.color}`} />
                    <div>
                      <p className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                        {method.label}
                      </p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Message personnalisé */}
          {(selectedMethod === 'message' || selectedMethod === 'whatsapp' || selectedMethod === 'email') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                placeholder="Tapez votre message..."
              />
            </div>
          )}

          {/* Conseils de sécurité */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">Conseils de sécurité</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Ne payez jamais à l'avance sans voir l'article</li>
                  <li>• Rencontrez-vous dans un lieu public et sûr</li>
                  <li>• Vérifiez l'identité du vendeur</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button variant="outline" fullWidth onClick={onClose}>
              Annuler
            </Button>
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleContact}
              loading={isProcessing}
              disabled={selectedMethod === 'message' && !message.trim()}
            >
              {selectedMethod === 'phone' ? 'Appeler maintenant' :
               selectedMethod === 'whatsapp' ? 'Ouvrir WhatsApp' :
               selectedMethod === 'email' ? 'Ouvrir Email' :
               'Envoyer le message'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface ImageModalProps {
  images: string[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, selectedIndex, onClose, onNavigate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <img
          src={images[selectedIndex]}
          alt="Image agrandie"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === selectedIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function getCategoryIcon(category: MarketCategory) {
  switch (category) {
    case MarketCategory.BOOKS: return Book;
    case MarketCategory.MUSIC: return Music;
    case MarketCategory.CRAFTS: return Cross;
    case MarketCategory.CLOTHING: return ShoppingBag;
    case MarketCategory.SERVICES: return Star;
    case MarketCategory.EVENTS: return Clock;
    case MarketCategory.DONATIONS: return Gift;
    default: return ShoppingBag;
  }
}

function formatPrice(price: number) {
  if (price === 0) return 'Gratuit';
  return `${price.toLocaleString()} FCFA`;
}