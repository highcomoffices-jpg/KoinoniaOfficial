import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Church, Plus, Heart, User, Bell, Settings, ShoppingBag, BookOpen, Users, MessageCircle, Calendar, Award, Menu, X, Sparkles, MapPin, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mainNavigationItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'parishes', label: t('parishes'), icon: Church },
    { id: 'market', label: 'Market', icon: ShoppingBag },
    { id: 'spirituality', label: 'Spiritualité', icon: Sparkles },
    { id: 'formations', label: 'Formations', icon: Award },
  ];

  const secondaryNavigationItems = [
    { id: 'activities', label: 'Activités', icon: Calendar },
    { id: 'groups', label: 'Groupes', icon: Users },
    { id: 'live-celebrations', label: 'Live', icon: Zap },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'create', label: t('create'), icon: Plus },
    { id: 'subscriptions', label: t('subscriptions'), icon: Heart },
  ];

  const userNavigationItems = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsSidebarOpen(false);
  };

  // ============================================
  // MOBILE : Barre de navigation en bas
  // ============================================
  if (isMobile) {
    return (
      <>
        {/* Barre de navigation mobile (bas de l'écran) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex justify-around items-center px-2 py-2">
            {mainNavigationItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-medium">Plus</span>
            </button>
          </div>
        </nav>

        {/* Bottom padding pour éviter que le contenu soit caché par la barre */}
        <div className="pb-16" />

        {/* Sidebar mobile latérale (glisse depuis la gauche) */}
        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto">
              <div className="flex flex-col h-full">
                {/* En-tête */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Contenu */}
                <div className="flex-1 p-4 space-y-6">
                  {/* Message profil incomplet */}
                  {!user?.profileComplete && (
                    <div className="bg-warm-50 border border-warm-200 rounded-lg p-3">
                      <p className="text-sm text-warm-800 font-medium">
                        Profil incomplet
                      </p>
                      <p className="text-xs text-warm-600 mt-1">
                        Votre accès est limité. Complétez votre profil.
                      </p>
                    </div>
                  )}

                  {/* Section principale */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                      Principal
                    </h3>
                    {mainNavigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabChange(item.id)}
                          className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg transition-colors text-left ${
                            isActive
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                          {item.id === 'spirituality' && (
                            <span className="ml-auto text-xs bg-gradient-to-r from-spiritual-500 to-primary-500 text-white px-2 py-0.5 rounded-full">
                              Premium
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Section communauté */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                      Communauté
                    </h3>
                    {secondaryNavigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabChange(item.id)}
                          className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg transition-colors text-left ${
                            isActive
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                          {item.id === 'chat' && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                          )}
                          {item.id === 'live-celebrations' && (
                            <span className="ml-auto bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                              Live
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Section personnel */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                      Personnel
                    </h3>
                    {userNavigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabChange(item.id)}
                          className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg transition-colors text-left ${
                            isActive
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                          {item.id === 'notifications' && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">5</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // ============================================
  // DESKTOP : Sidebar fixe à gauche
  // ============================================
  return (
    <nav className="hidden md:block fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-30">
      <div className="p-4">
        {/* Message profil incomplet */}
        {!user?.profileComplete && (
          <div className="bg-warm-50 border border-warm-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-warm-800 font-medium">
              Profil incomplet
            </p>
            <p className="text-xs text-warm-600 mt-1">
              Votre accès est limité. Complétez votre profil.
            </p>
            <button
              onClick={() => handleTabChange('profile')}
              className="mt-2 text-xs text-primary-600 font-medium hover:underline"
            >
              Compléter mon profil →
            </button>
          </div>
        )}

        {/* Section principale */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Principal
          </h3>
          {mainNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left mb-1 ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.id === 'spirituality' && (
                  <span className="ml-auto text-xs bg-gradient-to-r from-spiritual-500 to-primary-500 text-white px-1.5 py-0.5 rounded-full">
                    Premium
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section communauté */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Communauté
          </h3>
          {secondaryNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left mb-1 ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.id === 'chat' && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                )}
                {item.id === 'live-celebrations' && (
                  <span className="ml-auto bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                    Live
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section personnel */}
        <div className="pt-2 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3 pt-2">
            Personnel
          </h3>
          {userNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left mb-1 ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.id === 'notifications' && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">5</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};