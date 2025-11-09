export interface UserProfile {
  name?: string;
  email?: string;
  businessType?: string;
  preferences?: Record<string, any>;
  avatar?: string;
  createdAt?: Date;
  lastActive?: Date;
}

export interface UserState {
  userProfile: UserProfile | null;
  hasCompletedOnboarding: boolean;
}

export interface UserActions {
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  clearUserProfile: () => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  resetOnboarding: () => void;
}
