'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { SplashScreen } from '@/components/splash/splash-screen';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading, error } = useAuth();

  // Show loading during initialization
  if (isLoading) {
    return (
      <SplashScreen />
    );
  }

  // Show error if initialization failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Initialization Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};