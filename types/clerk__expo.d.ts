declare module '@clerk/expo/token-cache' {
  export const tokenCache: any;
}

declare module '@clerk/expo' {
  import { ReactNode } from 'react';

  export interface ClerkProviderProps {
    publishableKey: string;
    tokenCache?: any;
    children?: ReactNode;
  }

  export function ClerkProvider(props: ClerkProviderProps): React.JSX.Element;

  export const tokenCache: any;

  export function useAuth(): {
    isSignedIn: boolean;
    isLoaded: boolean;
  };

  export function useSignIn(): {
    signIn: {
      password: (options: { identifier: string; password: string }) => Promise<any>;
      status: string;
      finalize: (options: { navigate: () => void }) => Promise<void>;
    };
    errors: {
      fields?: {
        identifier?: { message?: string };
        password?: { message?: string };
      };
      global?: { message?: string };
    };
    fetchStatus: 'idle' | 'fetching';
  };

  export function useSignUp(): {
    signUp: {
      create: (options: { emailAddress: string; password: string }) => Promise<any>;
      verifications: {
        sendEmailCode: () => Promise<void>;
        verifyEmailCode: (options: { code: string }) => Promise<any>;
      };
      status: string;
      finalize: (options: { navigate: () => void }) => Promise<void>;
    };
    errors: {
      fields?: {
        emailAddress?: { message?: string };
        password?: { message?: string };
      };
      global?: { message?: string };
    };
    fetchStatus: 'idle' | 'fetching';
  };

  export function useUser(): {
    user: {
      id: string;
      userName?: string;
      firstName?: string;
      fullName?: string;
      emailAddresses?: Array<{ emailAddress: string }>;
      imageUrl?: string;
    } | null;
  };
}