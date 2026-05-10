import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Send, Paperclip, Smile, Phone, Video, MoreVertical, Search, Users, MessageCircle, 
  ArrowLeft, Pin, BellOff, Trash2, Flag, Gift, Heart, ThumbsUp, Laugh, 
  Image as ImageIcon, FileText, Camera, Play, Pause, Volume2, VolumeX, Download,
  Crown, Star, Church, Cross
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { ChatConversation, ChatMessage, ChatType, MessageType, UserRole, UserLevel } from '../../types';
import { MicroDonationButton } from '../ui/MicroDonationButton';

// Données mockées enrichies pour les conversations
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    type: ChatType.DIRECT,
    participantIds: ['1', '2'],
    participants: [
      {
        id: '2',
        firstName: 'Marie',
        lastName: 'Adjovi',
        email: 'marie.adjovi@example.com',
        role: UserRole.VIGNERON,
        level: UserLevel.BERGER,
        profileComplete: true,
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    lastMessage: {
      id: '1',
      conversationId: '1',
      senderId: '2',
      sender: {} as any,
      content: 'Que la paix du Christ soit avec toi ! 🙏',
      type: MessageType.TEXT,
      isEdited: false,
      readBy: ['1'],
      createdAt: new Date('2024-01-20T14:30:00'),
      updatedAt: new Date('2024-01-20T14:30:00')
    },
    unreadCount: 2,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20T14:30:00')
  },
  {
    id: '2',
    type: ChatType.GROUP,
    name: 'Jeunes Chrétiens de Cotonou',
    participantIds: ['1', '3', '4', '5'],
    participants: [
      {
        id: '3',
        firstName: 'Samuel',
        lastName: 'Kpossou',
        email: 'samuel.kpossou@example.com',
        role: UserRole.VIGNERON,
        level: UserLevel.BERGER,
        profileComplete: true,
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        firstName: 'Grace',
        lastName: 'Dossou',
        email: 'grace.dossou@example.com',
        role: UserRole.BREBIS,
        level: UserLevel.MOISSONNEUR,
        profileComplete: true,
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    groupId: '1',
    lastMessage: {
      id: '2',
      conversationId: '2',
      senderId: '3',
      sender: {} as any,
      content: 'N\'oubliez pas notre réunion de prière ce soir ! 🙏',
      type: MessageType.TEXT,
      isEdited: false,
      readBy: ['1', '3'],
      createdAt: new Date('2024-01-20T16:45:00'),
      updatedAt: new Date('2024-01-20T16:45:00')
    },
    unreadCount: 5,
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20T16:45:00')
  },
  {
    id: '3',
    type: ChatType.GROUP,
    name: 'Prière pour le Bénin 🇧🇯',
    participantIds: ['1', '6', '7', '8'],
    participants: [
      {
        id: '6',
        firstName: 'Pasteur Emmanuel',
        lastName: 'Ahouansou',
        email: 'pasteur.emmanuel@example.com',
        role: UserRole.VIGNERON,
        level: UserLevel.BERGER,
        profileComplete: true,
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    groupId: '3',
    lastMessage: {
      id: '3',
      conversationId: '3',
      senderId: '6',
      sender: {} as any,
      content: 'Prions ensemble pour la paix dans notre nation 🙏🇧🇯',
      type: MessageType.TEXT,
      isEdited: false,
      readBy: ['1'],
      createdAt: new Date('2024-01-20T18:20:00'),
      updatedAt: new Date('2024-01-20T18:20:00')
    },
    unreadCount: 12,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20T18:20:00')
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    conversationId: '1',
    senderId: '2',
    sender: {
      id: '2',
      firstName: 'Marie',
      lastName: 'Adjovi',
      email: 'marie.adjovi@example.com',
      role: UserRole.VIGNERON,
      level: UserLevel.BERGER,
      profileComplete: true,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    content: 'Salut Jean ! Comment vas-tu en ce dimanche béni ?',
    type: MessageType.TEXT,
    isEdited: false,
    readBy: ['1', '2'],
    createdAt: new Date('2024-01-20T14:00:00'),
    updatedAt: new Date('2024-01-20T14:00:00')
  },
  {
    id: '2',
    conversationId: '1',
    senderId: '1',
    sender: {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      role: UserRole.BREBIS,
      level: UserLevel.SEMEUR,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    content: 'Très bien merci ! Et toi ? Comment se passe ta semaine de ministère ?',
    type: MessageType.TEXT,
    isEdited: false,
    readBy: ['1', '2'],
    createdAt: new Date('2024-01-20T14:15:00'),
    updatedAt: new Date('2024-01-20T14:15:00')
  },
  {
    id: '3',
    conversationId: '1',
    senderId: '2',
    sender: {
      id: '2',
      firstName: 'Marie',
      lastName: 'Adjovi',
      email: 'marie.adjovi@example.com',
      role: UserRole.VIGNERON,
      level: UserLevel.BERGER,
      profileComplete: true,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    content: 'Que la paix du Christ soit avec toi ! 🙏 J\'ai une belle nouvelle à partager...',
    type: MessageType.TEXT,
    isEdited: false,
    readBy: ['1'],
    createdAt: new Date('2024-01-20T14:30:00'),
    updatedAt: new Date('2024-01-20T14:30:00')
  },
  {
    id: '4',
    conversationId: '1',
    senderId: '2',
    sender: {
      id: '2',
      firstName: 'Marie',
      lastName: 'Adjovi',
      email: 'marie.adjovi@example.com',
      role: UserRole.VIGNERON,
      level: UserLevel.BERGER,
      profileComplete: true,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    content: 'Voici une photo de notre dernière réunion de prière 📸',
    type: MessageType.IMAGE,
    mediaUrl: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
    isEdited: false,
    readBy: ['1'],
    createdAt: new Date('2024-01-20T14:35:00'),
    updatedAt: new Date('2024-01-20T14:35:00')
  }
];

// Statuts en ligne simulés
const onlineUsers = ['2', '3', '6'];

export const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConversationsList, setShowConversationsList] = useState(true);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [showPrayerPanel, setShowPrayerPanel] = useState(false);
  const [selectedMessageForReaction, setSelectedMessageForReaction] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: user.id,
      sender: user,
      content: newMessage.trim(),
      type: MessageType.TEXT,
      isEdited: false,
      readBy: [user.id],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationSelect = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setShowConversationsList(false);
    // Marquer les messages comme lus
    conversation.unreadCount = 0;
  };

  const handleBackToList = () => {
    setShowConversationsList(true);
    setSelectedConversation(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !selectedConversation || !user) return;

    files.forEach(file => {
      const message: ChatMessage = {
        id: Date.now().toString() + Math.random(),
        conversationId: selectedConversation.id,
        senderId: user.id,
        sender: user,
        content: file.name,
        type: file.type.startsWith('image/') ? MessageType.IMAGE : 
              file.type.startsWith('video/') ? MessageType.VIDEO : MessageType.FILE,
        mediaUrl: URL.createObjectURL(file),
        isEdited: false,
        readBy: [user.id],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setMessages(prev => [...prev, message]);
    });
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // Logique de réaction (à implémenter avec l'API)
    console.log('Réaction:', messageId, emoji);
    setSelectedMessageForReaction(null);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    return new Intl.DateTimeFormat('fr', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return new Intl.DateTimeFormat('fr', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('fr', {
        day: 'numeric',
        month: 'short'
      }).format(date);
    }
  };

  const isUserOnline = (userId: string) => onlineUsers.includes(userId);

  const getGroupIcon = (groupName: string) => {
    if (groupName.toLowerCase().includes('prière')) return Cross;
    if (groupName.toLowerCase().includes('jeunes')) return Users;
    if (groupName.toLowerCase().includes('église') || groupName.toLowerCase().includes('paroisse')) return Church;
    return Users;
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return Crown;
      case UserRole.VIGNERON: return Star;
      default: return null;
    }
  };

  const filteredConversations = mockConversations.filter(conv => {
    if (!searchTerm) return true;
    
    if (conv.type === ChatType.GROUP && conv.name) {
      return conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return conv.participants.some(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const conversationMessages = messages.filter(m => m.conversationId === selectedConversation?.id);

  const quickReactions = ['🙏', '❤️', '👍', '😊', '🎉', '😢'];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar des conversations - Structure en 3 colonnes */}
      <div className={`${
        showConversationsList ? 'flex' : 'hidden'
      } md:flex w-full md:w-80 bg-white border-r border-gray-200 flex-col`}>
        {/* En-tête sidebar avec recherche */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-spiritual-50 to-primary-50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-spiritual-600 to-primary-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-600">Communauté spirituelle</p>
            </div>
          </div>
          <Input
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="bg-white"
          />
        </div>

        {/* Liste des conversations avec design enrichi */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => {
            const GroupIcon = conversation.type === ChatType.GROUP ? getGroupIcon(conversation.name || '') : null;
            const isGroupConversation = conversation.type === ChatType.GROUP;
            const mainParticipant = conversation.participants[0];
            const isOnline = mainParticipant && isUserOnline(mainParticipant.id);
            
            return (
              <div
                key={conversation.id}
                onClick={() => handleConversationSelect(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                  selectedConversation?.id === conversation.id ? 'bg-gradient-to-r from-spiritual-50 to-primary-50 border-spiritual-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {isGroupConversation ? (
                      <div className="w-12 h-12 bg-gradient-to-br from-spiritual-400 to-primary-400 rounded-full flex items-center justify-center">
                        {GroupIcon && <GroupIcon className="w-6 h-6 text-white" />}
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-spiritual-400 relative">
                        {mainParticipant?.avatar ? (
                          <img
                            src={mainParticipant.avatar}
                            alt={`${mainParticipant.firstName} ${mainParticipant.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                            {mainParticipant?.firstName[0]}{mainParticipant?.lastName[0]}
                          </div>
                        )}
                        {/* Halo vert pour utilisateur en ligne */}
                        {isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        )}
                      </div>
                    )}
                    
                    {/* Badge de messages non lus */}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs text-white font-bold">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {isGroupConversation 
                            ? conversation.name 
                            : `${mainParticipant?.firstName} ${mainParticipant?.lastName}`
                          }
                        </h3>
                        {/* Icône de rôle pour les utilisateurs */}
                        {!isGroupConversation && mainParticipant && getRoleIcon(mainParticipant.role) && (
                          <div className="flex-shrink-0">
                            {React.createElement(getRoleIcon(mainParticipant.role)!, { 
                              className: "w-3 h-3 text-yellow-500" 
                            })}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {conversation.lastMessage && formatLastMessageTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    
                    {/* Rôle et niveau pour conversations directes */}
                    {!isGroupConversation && mainParticipant && (
                      <p className="text-xs text-spiritual-600 font-medium truncate">
                        {t(`role.${mainParticipant.role}`)} • {t(`level.${mainParticipant.level}`)}
                      </p>
                    )}
                    
                    {/* Dernier message */}
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage.type === MessageType.IMAGE && '📷 '}
                        {conversation.lastMessage.type === MessageType.VIDEO && '🎥 '}
                        {conversation.lastMessage.type === MessageType.FILE && '📎 '}
                        {conversation.lastMessage.content}
                      </p>
                    )}
                    
                    {/* Statut en ligne pour conversations directes */}
                    {!isGroupConversation && isOnline && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        • En ligne
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className={`${
        !showConversationsList ? 'flex' : 'hidden'
      } md:flex flex-1 flex-col bg-white`}>
        {selectedConversation ? (
          <>
            {/* En-tête du chat enrichi */}
            <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Bouton retour mobile */}
                  <button
                    onClick={handleBackToList}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  {/* Avatar et infos */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-spiritual-400">
                      {selectedConversation.type === ChatType.GROUP ? (
                        <div className="w-full h-full flex items-center justify-center">
                          {React.createElement(getGroupIcon(selectedConversation.name || ''), { 
                            className: "w-6 h-6 text-white" 
                          })}
                        </div>
                      ) : selectedConversation.participants[0]?.avatar ? (
                        <img
                          src={selectedConversation.participants[0].avatar}
                          alt={`${selectedConversation.participants[0].firstName} ${selectedConversation.participants[0].lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                          {selectedConversation.participants[0]?.firstName[0]}{selectedConversation.participants[0]?.lastName[0]}
                        </div>
                      )}
                    </div>
                    {/* Statut en ligne */}
                    {selectedConversation.type === ChatType.DIRECT && 
                     selectedConversation.participants[0] && 
                     isUserOnline(selectedConversation.participants[0].id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-semibold text-gray-900">
                        {selectedConversation.type === ChatType.GROUP 
                          ? selectedConversation.name 
                          : `${selectedConversation.participants[0]?.firstName} ${selectedConversation.participants[0]?.lastName}`
                        }
                      </h2>
                      {/* Icône de rôle */}
                      {selectedConversation.type === ChatType.DIRECT && 
                       selectedConversation.participants[0] && 
                       getRoleIcon(selectedConversation.participants[0].role) && (
                        <div>
                          {React.createElement(getRoleIcon(selectedConversation.participants[0].role)!, { 
                            className: "w-4 h-4 text-yellow-500" 
                          })}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.type === ChatType.GROUP 
                        ? `${selectedConversation.participants.length} membres`
                        : selectedConversation.participants[0] && isUserOnline(selectedConversation.participants[0].id)
                          ? `En ligne • ${t(`role.${selectedConversation.participants[0].role}`)} • ${t(`level.${selectedConversation.participants[0].level}`)}`
                          : selectedConversation.participants[0] 
                            ? `${t(`role.${selectedConversation.participants[0].role}`)} • ${t(`level.${selectedConversation.participants[0].level}`)}`
                            : 'Hors ligne'
                      }
                    </p>
                  </div>
                </div>
                
                {/* Actions rapides */}
                <div className="flex items-center space-x-2">
                  {/* Bouton Offrande pour groupes spirituels */}
                  {selectedConversation.type === ChatType.GROUP && (
                    <MicroDonationButton 
                      targetType="live" 
                      targetId={selectedConversation.id}
                      className="hidden sm:flex"
                    />
                  )}
                  
                  {/* Bouton Prière */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPrayerPanel(!showPrayerPanel)}
                    className="hidden sm:flex text-spiritual-600 hover:bg-spiritual-50"
                  >
                    🙏
                  </Button>
                  
                  <Button variant="ghost" size="sm" icon={Phone} className="hidden sm:flex" />
                  <Button variant="ghost" size="sm" icon={Video} className="hidden sm:flex" />
                  
                  {/* Menu options */}
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon={MoreVertical}
                      onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                    />
                    
                    {showOptionsMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                          <Pin className="w-4 h-4" />
                          <span>Épingler</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                          <BellOff className="w-4 h-4" />
                          <span>Désactiver notifications</span>
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Supprimer</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                          <Flag className="w-4 h-4" />
                          <span>Signaler</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Zone de messages avec design amélioré */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {conversationMessages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {!isOwnMessage && (
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-spiritual-400 flex-shrink-0 relative">
                          {message.sender.avatar ? (
                            <img
                              src={message.sender.avatar}
                              alt={`${message.sender.firstName} ${message.sender.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-xs">
                              {message.sender.firstName[0]}{message.sender.lastName[0]}
                            </div>
                          )}
                          {/* Statut en ligne */}
                          {isUserOnline(message.sender.id) && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                          )}
                        </div>
                      )}
                      
                      <div className="relative">
                        {/* Bulle de message avec design spirituel */}
                        <div className={`rounded-2xl px-4 py-2 shadow-sm ${
                          isOwnMessage 
                            ? 'bg-gradient-to-r from-primary-600 to-spiritual-600 text-white' 
                            : 'bg-white text-gray-900 border border-gray-100'
                        }`}>
                          {/* Contenu selon le type */}
                          {message.type === MessageType.TEXT && (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          )}
                          
                          {message.type === MessageType.IMAGE && (
                            <div className="space-y-2">
                              <img
                                src={message.mediaUrl}
                                alt="Image partagée"
                                className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(message.mediaUrl, '_blank')}
                              />
                              {message.content !== message.sender.firstName && (
                                <p className="text-sm">{message.content}</p>
                              )}
                            </div>
                          )}
                          
                          {message.type === MessageType.VIDEO && (
                            <div className="space-y-2">
                              <div className="relative rounded-lg overflow-hidden bg-black">
                                <video
                                  src={message.mediaUrl}
                                  className="max-w-full h-auto"
                                  controls
                                  preload="metadata"
                                >
                                  Votre navigateur ne supporte pas la lecture vidéo.
                                </video>
                              </div>
                              {message.content !== message.sender.firstName && (
                                <p className="text-sm">{message.content}</p>
                              )}
                            </div>
                          )}
                          
                          {message.type === MessageType.FILE && (
                            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                              <FileText className="w-8 h-8 text-gray-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{message.content}</p>
                                <p className="text-xs text-gray-500">Document</p>
                              </div>
                              <Button variant="ghost" size="sm" icon={Download} />
                            </div>
                          )}
                        </div>
                        
                        {/* Timestamp */}
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-right text-gray-500' : 'text-left text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                          {isOwnMessage && (
                            <span className="ml-2">
                              {message.readBy.length > 1 ? '✓✓' : '✓'}
                            </span>
                          )}
                        </p>
                        
                        {/* Réactions rapides au survol */}
                        <div className="absolute top-0 right-0 transform translate-x-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center space-x-1 bg-white rounded-full shadow-lg border border-gray-200 p-1 ml-2">
                            {quickReactions.slice(0, 3).map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(message.id, emoji)}
                                className="w-6 h-6 hover:bg-gray-100 rounded-full flex items-center justify-center text-sm transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                            <button
                              onClick={() => setSelectedMessageForReaction(message.id)}
                              className="w-6 h-6 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                            >
                              <Smile className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie enrichie */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Barre d'outils multimédia */}
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                  title="Joindre un fichier"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = 'image/*';
                      fileInputRef.current.click();
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                  title="Envoyer une image"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPrayerPanel(!showPrayerPanel)}
                  className="p-2 text-spiritual-600 hover:bg-spiritual-50 rounded-full transition-colors"
                  title="Envoyer une intention de prière"
                >
                  🙏
                </button>
                {selectedConversation.type === ChatType.GROUP && (
                  <MicroDonationButton 
                    targetType="live" 
                    targetId={selectedConversation.id}
                    className="p-2 text-warm-600 hover:bg-warm-50 rounded-full"
                  />
                )}
              </div>
              
              {/* Zone de saisie principale */}
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tapez votre message..."
                    rows={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none bg-gray-50 hover:bg-white"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
                
                <Button 
                  variant="spiritual" 
                  size="sm" 
                  icon={Send}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-full w-11 h-11 p-0"
                />
              </div>
              
              {/* Picker d'emoji */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                  <div className="grid grid-cols-6 gap-2">
                    {['😊', '😂', '❤️', '🙏', '👍', '👏', '🎉', '😢', '😮', '😍', '🔥', '💯'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setNewMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center text-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Input file caché */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </>
        ) : (
          /* État vide avec design spirituel */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-spiritual-50 to-primary-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-spiritual-400 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-600 mb-6">
                Choisissez une conversation pour commencer à échanger avec votre communauté
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Button variant="primary" icon={Users}>
                  Créer un groupe
                </Button>
                <Button variant="outline" icon={Search}>
                  Trouver des amis
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panneau de prière latéral */}
      {showPrayerPanel && (
        <div className="w-80 bg-white border-l border-gray-200 p-4 hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Intentions de prière</h3>
            <button
              onClick={() => setShowPrayerPanel(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <Card padding="sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-spiritual-400 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  🙏
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Envoyer une intention</h4>
                <textarea
                  placeholder="Partagez votre intention de prière..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                />
                <Button variant="spiritual" size="sm" fullWidth className="mt-3">
                  Envoyer 🙏
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Overlay pour fermer les menus */}
      {(showOptionsMenu || showEmojiPicker) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowOptionsMenu(false);
            setShowEmojiPicker(false);
          }}
        />
      )}

      {/* Picker de réaction pour message spécifique */}
      {selectedMessageForReaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-4">Choisir une réaction</h3>
              <div className="grid grid-cols-4 gap-3">
                {quickReactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(selectedMessageForReaction, emoji)}
                    className="w-12 h-12 hover:bg-gray-100 rounded-lg flex items-center justify-center text-2xl transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                fullWidth 
                className="mt-4"
                onClick={() => setSelectedMessageForReaction(null)}
              >
                Annuler
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};