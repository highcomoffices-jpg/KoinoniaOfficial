import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PostCard } from './PostCard';
import { CreatePostModal } from '../posts/CreatePostModal';
import { CompleteProfileModal } from '../profile/CompleteProfileModal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { mockPosts } from '../../data/mockData';
import { Post } from '../../types';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCompleteProfileModalOpen, setIsCompleteProfileModalOpen] = useState(false);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLike = (postId: string) => {
    console.log('Like post:', postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
  };

  const handleCreatePost = () => {
    if (!user?.profileComplete) {
      setIsCompleteProfileModalOpen(true);
    } else {
      setIsCreatePostModalOpen(true);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="w-full max-w-full mx-auto">
          {/* Message de bienvenue pour profil incomplet */}
          {user && !user.profileComplete && (
            <Card className="bg-gradient-to-r from-warm-50 to-primary-50 border-warm-200 mb-6">
              <div className="text-center py-2 px-2">
                <h2 className="text-base font-semibold text-warm-800 mb-1">
                  {t('profile.incomplete.title')}
                </h2>
                <p className="text-sm text-warm-700 mb-3">
                  {t('profile.incomplete.message')}
                </p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setIsCompleteProfileModalOpen(true)}
                >
                  {t('profile.incomplete.complete')}
                </Button>
              </div>
            </Card>
          )}

          {/* En-tête avec actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {t('home')}
              </h1>
              <p className="text-sm text-gray-600 truncate">
                Découvrez les derniers contenus de votre communauté
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" icon={Filter} className="flex-1 sm:flex-none">
                Filtrer
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                icon={Plus}
                onClick={handleCreatePost}
                className="flex-1 sm:flex-none"
              >
                {t('create')}
              </Button>
            </div>
          </div>

          {/* Flux de posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))}
          </div>

          {/* Message si aucun post */}
          {posts.length === 0 && (
            <Card className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Aucun contenu pour le moment
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Soyez le premier à partager quelque chose avec votre communauté !
              </p>
              <Button variant="primary" icon={Plus} onClick={handleCreatePost}>
                {t('create')}
              </Button>
            </Card>
          )}

          {/* Modales */}
          <CreatePostModal
            isOpen={isCreatePostModalOpen}
            onClose={() => setIsCreatePostModalOpen(false)}
            onPostCreated={handlePostCreated}
          />

          <CompleteProfileModal
            isOpen={isCompleteProfileModalOpen}
            onClose={() => setIsCompleteProfileModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};
