// Types principaux de l'application Koinonia

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileComplete: boolean;
  role: UserRole;
  level: UserLevel;
  country?: Country;
  city?: string;
  confession?: Confession;
  parish?: Parish;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  continent: Continent;
  subRegion: SubRegion;
  cities: City[];
}

export interface Continent {
  id: string;
  name: string;
  code: string;
}

export interface SubRegion {
  id: string;
  name: string;
  continentId: string;
}

export interface City {
  id: string;
  name: string;
  countryId: string;
}

export interface Confession {
  id: string;
  name: string;
  description?: string;
  validated: boolean;
}

export interface Parish {
  id: string;
  name: string;
  confessionId: string;
  cityId: string;
  address?: string;
  validated: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  mediaUrls?: string[];
  videoUrls?: string[];
  visibility: PostVisibility;
  confessionIds?: string[];
  parishIds?: string[];
  isLive?: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  type: ServiceType;
  confessionIds: string[];
  parishId?: string;
  providerId: string;
  provider: User;
  price?: number;
  duration?: string;
  schedule?: ServiceSchedule[];
  maxParticipants?: number;
  currentParticipants: number;
  requirements?: string[];
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceSchedule {
  id: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  isOnline: boolean;
  meetingLink?: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  category: FormationCategory;
  instructorId: string;
  instructor: User;
  price: number;
  duration: string;
  modules: FormationModule[];
  confessionIds?: string[];
  maxStudents?: number;
  currentStudents: number;
  rating: number;
  reviewsCount: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormationModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  resources?: string[];
  order: number;
}

export interface ParishActivity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  parishId: string;
  parish: Parish;
  organizerId: string;
  organizer: User;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants?: number;
  currentParticipants: number;
  price?: number;
  requirements?: string[];
  imageUrl?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  type: GroupType;
  visibility: GroupVisibility;
  confessionIds?: string[];
  parishIds?: string[];
  creatorId: string;
  creator: User;
  moderatorIds: string[];
  memberIds: string[];
  memberCount: number;
  maxMembers?: number;
  rules?: string[];
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatConversation {
  id: string;
  type: ChatType;
  name?: string;
  participantIds: string[];
  participants: User[];
  groupId?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  replyToId?: string;
  isEdited: boolean;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  targetUserId: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: Date;
}

// Enums
export enum UserRole {
  BREBIS = 'brebis',
  VIGNERON = 'vigneron',
  ADMIN = 'admin'
}

export enum UserLevel {
  SEMEUR = 'semeur',
  MOISSONNEUR = 'moissonneur',
  BERGER = 'berger'
}

export enum PostVisibility {
  GLOBAL = 'global',
  RESTRICTED = 'restricted',
  EXTENDED = 'extended'
}

export enum ServiceType {
  MASS_REQUEST = 'mass_request',
  CONFESSION = 'confession',
  BAPTISM = 'baptism',
  WEDDING = 'wedding',
  FUNERAL = 'funeral',
  COUNSELING = 'counseling',
  PRAYER_REQUEST = 'prayer_request',
  LIVE_STREAM = 'live_stream',
  SPIRITUAL_DIRECTION = 'spiritual_direction',
  YOUTH_MINISTRY = 'youth_ministry',
  MUSIC_MINISTRY = 'music_ministry',
  OTHER = 'other'
}

export enum FormationCategory {
  FAMILY_EDUCATION = 'family_education',
  COUPLE_LIFE = 'couple_life',
  YOUTH_FORMATION = 'youth_formation',
  BIBLICAL_STUDIES = 'biblical_studies',
  THEOLOGY = 'theology',
  LEADERSHIP = 'leadership',
  EVANGELIZATION = 'evangelization',
  PRAYER_LIFE = 'prayer_life',
  SPIRITUAL_GROWTH = 'spiritual_growth',
  MINISTRY_TRAINING = 'ministry_training'
}

export enum ActivityType {
  MASS = 'mass',
  PRAYER_MEETING = 'prayer_meeting',
  BIBLE_STUDY = 'bible_study',
  YOUTH_GATHERING = 'youth_gathering',
  CHARITY_EVENT = 'charity_event',
  PILGRIMAGE = 'pilgrimage',
  RETREAT = 'retreat',
  CONFERENCE = 'conference',
  CONCERT = 'concert',
  FESTIVAL = 'festival',
  COMMUNITY_SERVICE = 'community_service',
  OTHER = 'other'
}

export enum GroupType {
  PRAYER = 'prayer',
  BIBLE_STUDY = 'bible_study',
  YOUTH = 'youth',
  FAMILY = 'family',
  MINISTRY = 'ministry',
  SUPPORT = 'support',
  DISCUSSION = 'discussion',
  PROFESSIONAL = 'professional',
  REGIONAL = 'regional',
  OTHER = 'other'
}

export enum GroupVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SECRET = 'secret'
}

export enum ChatType {
  DIRECT = 'direct',
  GROUP = 'group'
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  SYSTEM = 'system'
}

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  POST = 'post',
  SERVICE_BOOKING = 'service_booking',
  FORMATION_ENROLLMENT = 'formation_enrollment',
  ACTIVITY_REGISTRATION = 'activity_registration',
  GROUP_INVITATION = 'group_invitation',
  CHAT_MESSAGE = 'chat_message',
  SYSTEM = 'system'
}

export enum Language {
  FR = 'fr',
  EN = 'en',
  SW = 'sw'
}

// Interfaces pour les formulaires
export interface RegisterPhase1Data {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  countryId: string;
}

export interface RegisterPhase2Data {
  cityId: string;
  confessionId: string;
  parishId?: string;
  bio?: string;
}

export interface LoginData {
  email: string;
  password: string;
}