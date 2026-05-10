import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Post } from '../../types';
import { MicroDonationButton } from '../ui/MicroDonationButton';

interface PostActionsProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export const PostActions: React.FC<PostActionsProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onShare 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const handleComment = () => {
    onComment?.(post.id);
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  return (
    <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 gap-3">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-1.5 transition-colors ${
            isLiked 
              ? 'text-red-600' 
              : 'text-gray-600 hover:text-red-600'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{likesCount}</span>
        </button>
        
        <button 
          onClick={handleComment}
          className="flex items-center space-x-1.5 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.commentsCount}</span>
        </button>
        
        <button 
          onClick={handleShare}
          className="flex items-center space-x-1.5 text-gray-600 hover:text-green-600 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">{post.sharesCount}</span>
        </button>

        {/* Bouton de micro-don */}
        <div className="flex-shrink-0">
          <MicroDonationButton 
            targetType="post" 
            targetId={post.id}
          />
        </div>
      </div>
      
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};