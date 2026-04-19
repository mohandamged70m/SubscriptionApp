import { useState } from 'react';
import { Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInPage() {
  const { signIn, errors: signInErrors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: typeof localErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLocalErrors({});

    try {
      await signIn.password({
        identifier: email,
        password,
      });

      if (signIn.status === 'complete') {
        await signIn.finalize({
          navigate: () => router.replace('/(tabs)'),
        });
      }
    } catch (err: any) {
      const message = err?.message || 'Unable to sign in. Please check your credentials.';
      if (message.toLowerCase().includes('email') || message.toLowerCase().includes('identifier')) {
        setLocalErrors({ email: message });
      } else if (message.toLowerCase().includes('password')) {
        setLocalErrors({ password: message });
      } else {
        setLocalErrors({ general: message });
      }
    }
  };

  const serverErrors = signInErrors?.fields;
  const displayEmailError = localErrors.email || serverErrors?.identifier?.message;
  const displayPasswordError = localErrors.password || serverErrors?.password?.message;
  const displayGeneralError = localErrors.general || signInErrors?.global?.message;

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">S</Text>
                </View>
              </View>
              <Text className="auth-wordmark">Subtrack</Text>
              <Text className="auth-wordmark-sub">Track your subscriptions</Text>
            </View>

            <View className="auth-card">
              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">Sign in to continue tracking your subscriptions</Text>

              <View className="auth-form">
                {displayGeneralError && (
                  <View className="auth-error bg-destructive/10 p-3 rounded-lg">
                    <Text className="auth-error text-center">{displayGeneralError}</Text>
                  </View>
                )}

                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={`auth-input ${displayEmailError ? 'auth-input-error' : ''}`}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                  />
                  {displayEmailError && <Text className="auth-error">{displayEmailError}</Text>}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input ${displayPasswordError ? 'auth-input-error' : ''}`}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    secureTextEntry
                    textContentType="password"
                  />
                  {displayPasswordError && <Text className="auth-error">{displayPasswordError}</Text>}
                </View>

                <Pressable
                  className={`auth-button ${fetchStatus === 'fetching' ? 'auth-button-disabled' : ''}`}
                  onPress={handleSignIn}
                  disabled={fetchStatus === 'fetching'}
                >
                  <Text className="auth-button-text text-white">
                    {fetchStatus === 'fetching' ? 'Signing in...' : 'Sign in'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Don't have an account?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text className="auth-link">Sign up</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}