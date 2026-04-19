import { Text, View, Pressable, Image } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
// @ts-expect-error - getClerkInstance not in types but available at runtime
import { getClerkInstance } from '@clerk/expo';
import images from '@/constants/images';
import { usePostHog } from 'posthog-react-native';
import React from 'react';
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    const posthog = usePostHog();

    const handleSignOut = async () => {
        posthog.capture('user_signed_out');
        try {
            const clerk = getClerkInstance();
            if (clerk) {
                await clerk.signOut();
            }
            posthog.reset();
        } catch (error) {
            console.error('Sign-out failed:', error);
        }
    };

    const clerk = getClerkInstance();
    const user = clerk?.user;

    const emailAddresses = user?.emailAddresses ?? [];
    const displayName = user?.firstName || user?.fullName || emailAddresses[0]?.emailAddress || 'User';
    const email = emailAddresses[0]?.emailAddress;
    const createdAt = (user as unknown as { createdAt?: number })?.createdAt;

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-3xl font-sans-bold text-primary mb-6">Settings</Text>

            <View className="auth-card mb-5">
                <View className="flex-row items-center gap-4 mb-4">
                    <Image
                        source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                        className="size-16 rounded-full"
                    />
                    <View className="flex-1">
                        <Text className="text-lg font-sans-bold text-primary">{displayName}</Text>
                        {email && (
                            <Text className="text-sm font-sans-medium text-muted-foreground">{email}</Text>
                        )}
                    </View>
                </View>
            </View>

            <View className="auth-card mb-5">
                <Text className="text-base font-sans-semibold text-primary mb-3">Account</Text>
                <View className="gap-2">
                    <View className="flex-row justify-between items-center py-2">
                        <Text className="text-sm font-sans-medium text-muted-foreground">Account ID</Text>
                        <Text className="text-sm font-sans-medium text-primary" numberOfLines={1} ellipsizeMode="tail">
                            {user?.id?.substring(0, 20)}...
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center py-2">
                        <Text className="text-sm font-sans-medium text-muted-foreground">Joined</Text>
                        <Text className="text-sm font-sans-medium text-primary">
                            {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>

            <Pressable
                className="auth-button bg-destructive"
                onPress={handleSignOut}
            >
                <Text className="auth-button-text text-white">Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default Settings