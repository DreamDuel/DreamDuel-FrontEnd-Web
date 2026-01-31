// Infrastructure Services Index
// Exporta todos los servicios para facilitar imports

export { HttpClient } from './HttpClient';
export { AuthService } from './AuthService';
export { UserService } from './UserService';
export { UploadService } from './UploadService';
export { AIGenerationService } from './AIGenerationService';
export { PaymentService } from './PaymentService';
export { CommentService } from './CommentService';
export { AnalyticsService } from './AnalyticsService';

// Service Container (recomendado para uso en la aplicación)
export {
  services,
  authService,
  userService,
  uploadService,
  aiGenerationService,
  paymentService,
  commentService,
  analyticsService,
} from './ServiceContainer';

// Types
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
} from './AuthService';

export type {
  UserProfile,
  UpdateProfileRequest,
  FollowResponse,
} from './UserService';

export type {
  GenerationRequest,
  GenerationResponse,
  BatchGenerationRequest,
  BatchGenerationResponse,
} from './AIGenerationService';

export type {
  SubscriptionPlan,
  PaymentIntent,
  SubscriptionStatus,
} from './PaymentService';

export type {
  Comment,
  CreateCommentRequest,
} from './CommentService';

export type {
  AnalyticsEvent,
  UserMetrics,
  StoryAnalytics,
} from './AnalyticsService';
