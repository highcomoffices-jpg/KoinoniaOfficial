import { createService } from './baseService';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UpdateProfileDto = Database['public']['Tables']['profiles']['Update'];
type InsertProfileDto = Database['public']['Tables']['profiles']['Insert'];

export class UserService {
  private profilesService = createService('profiles');

  // Get user profile by ID
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      return await this.profilesService.findById(userId);
    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      throw error;
    }
  }

  // Get current user's profile
  async getCurrentUserProfile(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      return await this.getProfile(user.id);
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId: string, data: UpdateProfileDto): Promise<Profile> {
    try {
      // Add updated_at timestamp
      const updateData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      return await this.profilesService.update(userId, updateData);
    } catch (error) {
      console.error(`Error updating profile for user ${userId}:`, error);
      throw error;
    }
  }

  // Update current user's profile
  async updateCurrentUserProfile(data: UpdateProfileDto): Promise<Profile> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      return await this.updateProfile(user.id, data);
    } catch (error) {
      console.error('Error updating current user profile:', error);
      throw error;
    }
  }

  // Get all users (with pagination and filters)
  async getUsers(options?: {
    limit?: number;
    offset?: number;
    filters?: {
      role?: string;
      level?: string;
      country_id?: string;
      city_id?: string;
      confession_id?: string;
      parish_id?: string;
      profile_complete?: boolean;
    };
    search?: string;
  }): Promise<Profile[]> {
    try {
      const queryOptions: any = {
        limit: options?.limit || 50,
        offset: options?.offset || 0,
      };

      if (options?.filters) {
        queryOptions.filters = options.filters;
      }

      if (options?.search) {
        queryOptions.or = [
          { ilike: { first_name: `%${options.search}%` } },
          { ilike: { last_name: `%${options.search}%` } },
          { ilike: { email: `%${options.search}%` } },
        ];
      }

      return await this.profilesService.findAll(queryOptions);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Search users by name or email
  async searchUsers(query: string, limit = 10): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Get users by role
  async getUsersByRole(role: string): Promise<Profile[]> {
    try {
      return await this.profilesService.findAll({
        filters: { role },
        order: { column: 'created_at', ascending: false },
      });
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  }

  // Get users by parish
  async getUsersByParish(parishId: string): Promise<Profile[]> {
    try {
      return await this.profilesService.findAll({
        filters: { parish_id: parishId },
        order: { column: 'created_at', ascending: false },
      });
    } catch (error) {
      console.error(`Error fetching users in parish ${parishId}:`, error);
      throw error;
    }
  }

  // Get users by confession
  async getUsersByConfession(confessionId: string): Promise<Profile[]> {
    try {
      return await this.profilesService.findAll({
        filters: { confession_id: confessionId },
        order: { column: 'created_at', ascending: false },
      });
    } catch (error) {
      console.error(`Error fetching users with confession ${confessionId}:`, error);
      throw error;
    }
  }

  // Count users
  async countUsers(filters?: any): Promise<number> {
    try {
      return await this.profilesService.count(filters);
    } catch (error) {
      console.error('Error counting users:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<{
    total: number;
    byRole: Record<string, number>;
    byLevel: Record<string, number>;
    withCompleteProfile: number;
    recentUsers: number; // Last 7 days
  }> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      const total = profiles?.length || 0;
      const byRole: Record<string, number> = {};
      const byLevel: Record<string, number> = {};
      let withCompleteProfile = 0;
      let recentUsers = 0;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      profiles?.forEach(profile => {
        // Count by role
        const role = profile.role || 'unknown';
        byRole[role] = (byRole[role] || 0) + 1;

        // Count by level
        const level = profile.level || 'unknown';
        byLevel[level] = (byLevel[level] || 0) + 1;

        // Count complete profiles
        if (profile.profile_complete) {
          withCompleteProfile++;
        }

        // Count recent users
        const createdAt = new Date(profile.created_at || '');
        if (createdAt > sevenDaysAgo) {
          recentUsers++;
        }
      });

      return {
        total,
        byRole,
        byLevel,
        withCompleteProfile,
        recentUsers,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Upload user avatar
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      await this.updateProfile(userId, {
        avatar_url: publicUrl,
      });

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading avatar for user ${userId}:`, error);
      throw error;
    }
  }

  // Delete user avatar
  async deleteAvatar(userId: string): Promise<void> {
    try {
      // Get current avatar URL
      const profile = await this.getProfile(userId);
      if (!profile?.avatar_url) return;

      // Extract file path from URL
      const urlParts = profile.avatar_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `avatars/${fileName}`;

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('user-avatars')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update profile to remove avatar URL
      await this.updateProfile(userId, {
        avatar_url: null,
      });
    } catch (error) {
      console.error(`Error deleting avatar for user ${userId}:`, error);
      throw error;
    }
  }

  // Get user with enriched data (joins with related tables)
  async getEnrichedProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          country:countries(*),
          city:cities(*),
          confession:confessions(*),
          parish:parishes(*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching enriched profile for user ${userId}:`, error);
      throw error;
    }
  }

  // Update user role and level (admin function)
  async updateUserRole(userId: string, role: string, level?: string): Promise<Profile> {
    try {
      const updateData: any = {
        role,
        updated_at: new Date().toISOString(),
      };

      if (level) {
        updateData.level = level;
      }

      return await this.updateProfile(userId, updateData);
    } catch (error) {
      console.error(`Error updating role for user ${userId}:`, error);
      throw error;
    }
  }

  // Mark profile as complete
  async markProfileComplete(userId: string): Promise<Profile> {
    try {
      return await this.updateProfile(userId, {
        profile_complete: true,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Error marking profile complete for user ${userId}:`, error);
      throw error;
    }
  }
}

// Singleton instance
export const userService = new UserService();

// Helper function to convert Supabase profile to your User type
export const convertProfileToUser = async (profile: Profile): Promise<any> => {
  // This is a simplified conversion
  // In a real app, you would fetch related data here
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    profileComplete: profile.profile_complete || false,
    role: profile.role || 'brebis',
    level: profile.level || 'semeur',
    countryId: profile.country_id,
    cityId: profile.city_id,
    confessionId: profile.confession_id,
    parishId: profile.parish_id,
    avatar: profile.avatar_url,
    bio: profile.bio,
    createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
    updatedAt: profile.updated_at ? new Date(profile.updated_at) : new Date(),
  };
};