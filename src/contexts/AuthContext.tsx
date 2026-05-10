import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, LoginData, RegisterPhase1Data, RegisterPhase2Data, 
  Country, Confession, Parish, UserRole, UserLevel 
} from '../types';
import { 
  supabase, 
  handleSupabaseError 
} from '../lib/supabase';
import { geoService } from '../services/geoService';
import type { Database } from '../lib/database.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  registerPhase1: (data: RegisterPhase1Data) => Promise<void>;
  registerPhase2: (data: RegisterPhase2Data) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to convert Supabase profile to your User type
const convertSupabaseProfileToUser = async (
  profile: Database['public']['Tables']['profiles']['Row'],
  _authUser?: any
): Promise<User> => {
  console.log('🔵 convertSupabaseProfileToUser - début pour ID:', profile.id);
  
  const user: User = {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    profileComplete: profile.profile_complete || false,
    role: (profile.role as UserRole) || UserRole.BREBIS,
    level: (profile.level as UserLevel) || UserLevel.SEMEUR,
    country: undefined,
    city: undefined,
    confession: undefined,
    parish: undefined,
    avatar: profile.avatar_url || undefined,
    bio: profile.bio || undefined,
    createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
    updatedAt: profile.updated_at ? new Date(profile.updated_at) : new Date(),
  };

  // Chargement asynchrone des relations
  if (profile.country_id) {
    try {
      console.log('🔵 Chargement pays:', profile.country_id);
      const countryData = await geoService.getCountryById(profile.country_id);
      if (countryData) {
        user.country = {
          id: countryData.id,
          name: countryData.name,
          code: countryData.code,
          continent: {
            id: countryData.continent_id,
            name: '',
            code: ''
          },
          subRegion: countryData.sub_region_id ? {
            id: countryData.sub_region_id,
            name: '',
            continentId: countryData.continent_id
          } : undefined,
          cities: []
        };
        console.log('✅ Pays chargé:', countryData.name);
      }
    } catch (error) {
      console.warn('Could not load country:', error);
    }
  }

  if (profile.confession_id) {
    try {
      console.log('🔵 Chargement confession:', profile.confession_id);
      const confessionData = await geoService.getConfessionById(profile.confession_id);
      if (confessionData) {
        user.confession = {
          id: confessionData.id,
          name: confessionData.name,
          description: confessionData.description || '',
          validated: confessionData.validated || false
        };
        console.log('✅ Confession chargée:', confessionData.name);
      }
    } catch (error) {
      console.warn('Could not load confession:', error);
    }
  }

  if (profile.parish_id) {
    try {
      console.log('🔵 Chargement paroisse:', profile.parish_id);
      const parishData = await geoService.getParishById(profile.parish_id);
      if (parishData) {
        user.parish = {
          id: parishData.id,
          name: parishData.name,
          confessionId: parishData.confession_id,
          cityId: parishData.city_id,
          address: parishData.address || '',
          validated: parishData.validated || false
        };
        console.log('✅ Paroisse chargée:', parishData.name);
      }
    } catch (error) {
      console.warn('Could not load parish:', error);
    }
  }

  if (profile.city_id) {
    try {
      console.log('🔵 Chargement ville:', profile.city_id);
      const cityData = await geoService.getCityById(profile.city_id);
      if (cityData) {
        user.city = cityData.name;
        console.log('✅ Ville chargée:', cityData.name);
      }
    } catch (error) {
      console.warn('Could not load city:', error);
    }
  }

  console.log('🔵 convertSupabaseProfileToUser - fin, user créé');
  return user;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from Supabase on mount
  useEffect(() => {
    const loadUser = async () => {
      console.log('🔵 loadUser - début');
      try {
        setIsLoading(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('🔴 Error getting session:', sessionError);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('🟢 User session found:', session.user.id);
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error('🔴 Error loading profile:', profileError);
            setIsLoading(false);
          } else if (profile) {
            console.log('🟢 Profile loaded:', profile.email);
            const userData = await convertSupabaseProfileToUser(profile, session.user);
            setUser(userData);
            console.log('🟢 User set, isLoading va passer à false');
          } else {
            console.log('🟡 Profile not found for user:', session.user.id);
          }
        } else {
          console.log('🟡 No active session found');
        }
      } catch (error) {
        console.error('🔴 Error in loadUser:', error);
      } finally {
        console.log('🔵 loadUser - finally, isLoading=false');
        setIsLoading(false);
      }
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔵 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('🔵 1. SIGNED_IN - début du traitement');
          try {
            console.log('🔵 2. Appel maybeSingle() pour ID:', session.user.id);
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            console.log('🔵 3. maybeSingle() terminé, profile:', profile ? 'trouvé' : 'non trouvé');
            if (error) {
              console.error('🔴 3b. Erreur maybeSingle:', error);
            }
              
            if (profile) {
              console.log('🔵 4. Profile trouvé, appel convertSupabaseProfileToUser');
              const userData = await convertSupabaseProfileToUser(profile, session.user);
              console.log('🔵 5. convert terminé, appel setUser');
              setUser(userData);
              console.log('🔵 6. setUser effectué, puis setIsLoading(false)');
              setIsLoading(false);
            } else {
              console.log('🟡 Profile non trouvé, attente 1s puis retry');
              setTimeout(async () => {
                console.log('🔵 Retry - appel maybeSingle()');
                const { data: retryProfile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .maybeSingle();
                  
                if (retryProfile) {
                  console.log('🟢 Retry réussi, création user');
                  const userData = await convertSupabaseProfileToUser(retryProfile, session.user);
                  setUser(userData);
                  setIsLoading(false);
                } else {
                  console.log('🔴 Retry échoué, aucun profil trouvé');
                  setIsLoading(false);
                }
              }, 1000);
            }
          } catch (error) {
            console.error('🔴 Error in auth state change:', error);
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🟡 User signed out');
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Create initial profile for new users
  const createInitialProfile = async (authUser: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email,
          first_name: authUser.user_metadata?.first_name || '',
          last_name: authUser.user_metadata?.last_name || '',
          profile_complete: false,
          role: 'brebis',
          level: 'semeur',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error creating initial profile:', error);
        throw error;
      }
      
      console.log('Initial profile created for user:', authUser.id);
    } catch (error) {
      console.error('Error in createInitialProfile:', error);
      throw error;
    }
  };

  // Login with Supabase Auth
  const login = async (data: LoginData): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', data.email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(handleSupabaseError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Register phase 1: Create auth user
  const registerPhase1 = async (data: RegisterPhase1Data): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('Starting registration phase 1 for:', data.email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }

      console.log('Auth signup successful:', authData.user?.id);

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            country_id: data.countryId,
            profile_complete: false,
            role: 'brebis',
            level: 'semeur',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          
          if (profileError.code === '23505') {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                first_name: data.firstName,
                last_name: data.lastName,
                country_id: data.countryId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', authData.user.id);
              
            if (updateError) throw updateError;
          } else {
            throw profileError;
          }
        }

        // Créer un objet user temporaire
        const tempUser: User = {
          id: authData.user.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          profileComplete: false,
          role: UserRole.BREBIS,
          level: UserLevel.SEMEUR,
          country: undefined,
          city: undefined,
          confession: undefined,
          parish: undefined,
          avatar: undefined,
          bio: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          const countryData = await geoService.getCountryById(data.countryId);
          if (countryData) {
            tempUser.country = {
              id: countryData.id,
              name: countryData.name,
              code: countryData.code,
              continent: {
                id: countryData.continent_id,
                name: '',
                code: ''
              },
              subRegion: countryData.sub_region_id ? {
                id: countryData.sub_region_id,
                name: '',
                continentId: countryData.continent_id
              } : undefined,
              cities: []
            };
          }
        } catch (countryError) {
          console.error('Error loading country:', countryError);
        }

        setUser(tempUser);
        console.log('Registration phase 1 completed');
      }
    } catch (error) {
      console.error('Register phase 1 failed:', error);
      throw new Error(handleSupabaseError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Register phase 2: Complete profile
  const registerPhase2 = async (data: RegisterPhase2Data): Promise<void> => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('User not found');

      console.log('Starting registration phase 2 for user:', user.id);

      const updateData: any = {
        city_id: data.cityId,
        confession_id: data.confessionId,
        bio: data.bio,
        profile_complete: true,
        updated_at: new Date().toISOString(),
      };

      if (data.parishId) {
        updateData.parish_id = data.parishId;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser();
      console.log('Registration phase 2 completed');
    } catch (error) {
      console.error('Register phase 2 failed:', error);
      throw new Error(handleSupabaseError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('User not found');

      console.log('Updating profile for user:', user.id);

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.firstName !== undefined) updateData.first_name = data.firstName;
      if (data.lastName !== undefined) updateData.last_name = data.lastName;
      if (data.bio !== undefined) updateData.bio = data.bio;
      if (data.avatar !== undefined) updateData.avatar_url = data.avatar;
      
      if (data.country !== undefined) {
        updateData.country_id = typeof data.country === 'object' ? data.country.id : data.country;
      }
      
      if (data.city !== undefined) {
        updateData.city_id = typeof data.city === 'string' ? data.city : data.city;
      }
      
      if (data.confession !== undefined) {
        updateData.confession_id = typeof data.confession === 'object' ? data.confession.id : data.confession;
      }
      
      if (data.parish !== undefined) {
        updateData.parish_id = typeof data.parish === 'object' ? data.parish.id : data.parish;
      }
      
      if (data.role !== undefined) updateData.role = data.role;
      if (data.level !== undefined) updateData.level = data.level;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser();
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Update profile failed:', error);
      throw new Error(handleSupabaseError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      console.log('Logging out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error(handleSupabaseError(error));
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUser(null);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error refreshing user profile:', error);
        return;
      }

      if (profile) {
        const userData = await convertSupabaseProfileToUser(profile, session.user);
        setUser(userData);
        console.log('User data refreshed');
      }
    } catch (error) {
      console.error('Error in refreshUser:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    registerPhase1,
    registerPhase2,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
