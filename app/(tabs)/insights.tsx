import { Text, View, Image, Pressable, ScrollView } from 'react-native';
import React, { useMemo } from 'react';
import { styled } from 'nativewind';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { icons } from '@/constants/icons';
import { useSubscriptionStore } from '@/lib/subscriptionStore';
import { formatCurrency } from '@/lib/utils';

const SafeAreaView = styled(RNSafeAreaView);

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CHART_DATA = [
    { day: 'Mon', value: 15 },
    { day: 'Tue', value: 25 },
    { day: 'Wed', value: 18 },
    { day: 'Thu', value: 40 },
    { day: 'Fri', value: 22 },
    { day: 'Sat', value: 8 },
    { day: 'Sun', value: 12 },
];

const HISTORY_DATA = [
    {
        id: 'claude',
        name: 'Claude',
        date: 'June 25, 12:00',
        price: 9.84,
        period: '/ per month',
        color: '#F5C842',
        icon: icons.claude,
    },
    {
        id: 'canva',
        name: 'Canva',
        date: 'June 30, 16:00',
        price: 43.89,
        period: '/ per month',
        color: '#A8D5C2',
        icon: icons.canva,
    },
];

const Insights = () => {
    const { subscriptions } = useSubscriptionStore();

    const totalExpenses = useMemo(() => {
        return subscriptions
            .filter(sub => sub.status === 'active')
            .reduce((sum, sub) => {
                const monthly = sub.billing === 'Yearly' ? sub.price / 12 : sub.price;
                return sum + monthly;
            }, 0);
    }, [subscriptions]);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-8">
                <View className="insights-header">
                    <Pressable>
                        <Image source={icons.back} className="insights-back-icon" />
                    </Pressable>
                    <Text className="insights-title">Monthly Insights</Text>
                    <Pressable>
                        <Image source={icons.menu} className="insights-menu-icon" />
                    </Pressable>
                </View>

                <View className="insights-content">
                    <View className="section-header">
                        <Text className="section-title">Upcoming</Text>
                        <Pressable className="view-all-pill">
                            <Text className="view-all-text">View all</Text>
                        </Pressable>
                    </View>

                    <View className="chart-container">
                        <View className="chart-y-axis">
                            <Text className="chart-y-label">45</Text>
                            <Text className="chart-y-label">30</Text>
                            <Text className="chart-y-label">15</Text>
                            <Text className="chart-y-label">0</Text>
                        </View>
                        <View className="chart-bars">
                            {CHART_DATA.map((item, index) => (
                                <View key={item.day} className="bar-wrapper">
                                    {index === 3 && (
                                        <View className="bar-label-container">
                                            <Text className="bar-label">${item.value}</Text>
                                        </View>
                                    )}
                                    <View
                                        className={`bar ${index === 3 ? 'bar-highlight' : ''}`}
                                        style={{ height: (item.value / 45) * 140 }}
                                    />
                                    <Text className="bar-day">{item.day}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className="expenses-card">
                        <View className="expenses-left">
                            <Text className="expenses-title">Expenses</Text>
                            <Text className="expenses-subtitle">March 2026</Text>
                        </View>
                        <View className="expenses-right">
                            <Text className="expenses-amount">-{formatCurrency(totalExpenses)}</Text>
                            <View className="expenses-change">
                                <Text className="expenses-change-text">+12%</Text>
                            </View>
                        </View>
                    </View>

                    <View className="section-header">
                        <Text className="section-title">History</Text>
                        <Pressable className="view-all-pill">
                            <Text className="view-all-text">View all</Text>
                        </Pressable>
                    </View>

                    <View className="history-list">
                        {HISTORY_DATA.map((item) => (
                            <View key={item.id} className="history-card" style={{ backgroundColor: item.color }}>
                                <Image source={item.icon} className="history-icon" />
                                <View className="history-info">
                                    <Text className="history-name">{item.name}</Text>
                                    <Text className="history-date">{item.date}</Text>
                                </View>
                                <View className="history-price">
                                    <Text className="history-price-text">{formatCurrency(item.price)}</Text>
                                    <Text className="history-period">{item.period}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Insights;