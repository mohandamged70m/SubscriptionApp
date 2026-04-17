import { useState } from 'react';
import { Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useSignUp } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';

const SafeAreaView = styled(RNSafeAreaView);

type SignUpStep = 'form' | 'verify';

export default function SignUpPage() {
  const { signUp, errors: signUpErrors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<SignUpStep>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [localErrors, setLocalErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; code?: string; general?: string }>({});
  const [resendCooldown, setResendCooldown] = useState(0);

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLocalErrors({});

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.verifications.sendEmailCode();

      setStep('verify');
      startResendCooldown();
    } catch (err: any) {
      const message = err?.message || 'Unable to create account. Please try again.';
      if (message.toLowerCase().includes('email')) {
        setLocalErrors({ email: message });
      } else if (message.toLowerCase().includes('password')) {
        setLocalErrors({ password: message });
      } else {
        setLocalErrors({ general: message });
      }
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      setLocalErrors({ code: 'Verification code is required' });
      return;
    }

    if (verificationCode.length < 6) {
      setLocalErrors({ code: 'Please enter the complete verification code' });
      return;
    }

    setLocalErrors({});

    try {
      await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });

      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: () => router.replace('/(tabs)'),
        });
      } else {
        setLocalErrors({ general: 'Verification failed. Please try again.' });
      }
    } catch (err: any) {
      const message = err?.message || 'Invalid or expired code';
      setLocalErrors({ code: message });
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    try {
      await signUp.verifications.sendEmailCode();
      startResendCooldown();
    } catch (err: any) {
      setLocalErrors({ general: 'Failed to resend code. Please try again.' });
    }
  };

  const serverErrors = signUpErrors?.fields;
  const displayEmailError = localErrors.email || serverErrors?.emailAddress?.message;
  const displayPasswordError = localErrors.password || serverErrors?.password?.message;
  const displayConfirmError = localErrors.confirmPassword;
  const displayCodeError = localErrors.code;
  const displayGeneralError = localErrors.general || signUpErrors?.global?.message;

  if (step === 'verify') {
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
              </View>

              <View className="auth-card">
                <Text className="auth-title">Check your email</Text>
                <Text className="auth-subtitle">
                  We sent a verification code to {email}
                </Text>

                <View className="auth-form">
                  {displayGeneralError && (
                    <View className="auth-error bg-destructive/10 p-3 rounded-lg">
                      <Text className="auth-error text-center">{displayGeneralError}</Text>
                    </View>
                  )}

                  <View className="auth-field">
                    <Text className="auth-label">Verification Code</Text>
                    <TextInput
                      className={`auth-input ${displayCodeError ? 'auth-input-error' : ''}`}
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      maxLength={6}
                    />
                    {displayCodeError && <Text className="auth-error">{displayCodeError}</Text>}
                  </View>

                  <Pressable
                    className={`auth-button ${fetchStatus === 'fetching' ? 'auth-button-disabled' : ''}`}
                    onPress={handleVerify}
                    disabled={fetchStatus === 'fetching'}
                  >
                    <Text className="auth-button-text text-white">
                      {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify'}
                    </Text>
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={handleResendCode}
                    disabled={resendCooldown > 0}
                  >
                    <Text className="auth-secondary-button-text">
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-link-row">
                <Link href="/(auth)/sign-in" asChild>
                  <Pressable>
                    <Text className="auth-link">Back to sign in</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
              <Text className="auth-title">Create account</Text>
              <Text className="auth-subtitle">Start tracking your subscriptions today</Text>

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
                    placeholder="Create a password"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    secureTextEntry
                    textContentType="newPassword"
                  />
                  <Text className="auth-helper">Must be at least 8 characters</Text>
                  {displayPasswordError && <Text className="auth-error">{displayPasswordError}</Text>}
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Confirm Password</Text>
                  <TextInput
                    className={`auth-input ${displayConfirmError ? 'auth-input-error' : ''}`}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    secureTextEntry
                    textContentType="newPassword"
                  />
                  {displayConfirmError && (
                    <Text className="auth-error">{displayConfirmError}</Text>
                  )}
                </View>

                <Pressable
                  className={`auth-button ${fetchStatus === 'fetching' ? 'auth-button-disabled' : ''}`}
                  onPress={handleSignUp}
                  disabled={fetchStatus === 'fetching'}
                >
                  <Text className="auth-button-text text-white">
                    {fetchStatus === 'fetching' ? 'Creating account...' : 'Create account'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}