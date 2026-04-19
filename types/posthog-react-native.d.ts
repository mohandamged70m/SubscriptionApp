declare module 'posthog-react-native' {
  export default class PostHog {
    constructor(apiKey: string, options?: any);
    capture(event: string, properties?: Record<string, any>): void;
    identify(event: string, properties?: Record<string, any>): void;
    reset(): void;
  }

  export function usePostHog(): {
    capture: (event: string, properties?: Record<string, any>) => void;
    identify: (event: string, properties?: Record<string, any>) => void;
    reset: () => void;
  };
}