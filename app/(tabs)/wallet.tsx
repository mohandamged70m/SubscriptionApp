import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { useExpenseStore } from '@/lib/expenseStore';
import { formatCurrency } from '@/lib/utils';
import { icons } from '@/constants/icons';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import ExpenseCard from '@/components/ExpenseCard';
import AddExpenseModal from '@/components/AddExpenseModal';
import React from 'react';

const SafeAreaView = styled(RNSafeAreaView);

const Wallet = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { expenses, addExpense } = useExpenseStore();

    const navigateMonth = (direction: 'prev' | 'next') => {
        setSelectedMonth(prev => direction === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month'));
        setSelectedCategory(null);
    };

    const isCurrentMonth = selectedMonth.isSame(dayjs(), 'month');

    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const expenseMonth = dayjs(expense.date);
            const monthMatch = expenseMonth.month() === selectedMonth.month() && 
                              expenseMonth.year() === selectedMonth.year();
            const categoryMatch = !selectedCategory || expense.category === selectedCategory;
            return monthMatch && categoryMatch;
        });
    }, [expenses, selectedMonth.month(), selectedMonth.year(), selectedCategory]);

    const totalExpenses = useMemo(() => {
        return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    }, [filteredExpenses]);

    const lastMonthExpenses = useMemo(() => {
        const lastMonth = selectedMonth.subtract(1, 'month');
        return expenses.filter(expense => 
            dayjs(expense.date).month() === lastMonth.month() &&
            dayjs(expense.date).year() === lastMonth.year()
        );
    }, [expenses, selectedMonth.month(), selectedMonth.year()]);

    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentChange = lastMonthTotal > 0 
        ? ((totalExpenses - lastMonthTotal) / lastMonthTotal) * 100 
        : 0;

    const sortedExpenses = useMemo(() => {
        return [...filteredExpenses].sort((a, b) => 
            dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
        );
    }, [filteredExpenses]);

    const handleAddExpense = (expense: Expense) => {
        addExpense(expense);
    };

    const handleCategoryPress = (category: string) => {
        setSelectedCategory(prev => prev === category ? null : category);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <FlatList
                data={sortedExpenses}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => (
                    <>
                        <View className="wallet-header">
                            <Text className="wallet-title">Expenses</Text>
                            <Pressable 
                                className="wallet-add-btn"
                                onPress={() => setIsModalVisible(true)}
                            >
                                <Image source={icons.add} className="wallet-add-icon" />
                            </Pressable>
                        </View>

                        <View className="wallet-month-selector">
                            <Pressable 
                                className="wallet-month-nav"
                                onPress={() => navigateMonth('prev')}
                            >
                                <Text className="wallet-month-nav-text">‹</Text>
                            </Pressable>
                            <Text className="wallet-month-text">
                                {selectedMonth.format('MMMM YYYY')}
                            </Text>
                            <Pressable 
                                className="wallet-month-nav"
                                onPress={() => navigateMonth('next')}
                                disabled={isCurrentMonth}
                            >
                                <Text className={`wallet-month-nav-text ${isCurrentMonth ? 'wallet-month-nav-disabled' : ''}`}>›</Text>
                            </Pressable>
                        </View>

                        <View className="wallet-summary-card">
                            <Text className="wallet-summary-label">This Month</Text>
                            <Text className="wallet-summary-amount">
                                {formatCurrency(totalExpenses)}
                            </Text>
                            {percentChange !== 0 && (
                                <View className={`wallet-summary-change ${percentChange > 0 ? 'wallet-summary-change-up' : 'wallet-summary-change-down'}`}>
                                    <Text className={`wallet-summary-change-text ${percentChange > 0 ? 'wallet-summary-change-text-up' : 'wallet-summary-change-text-down'}`}>
                                        {percentChange > 0 ? '+' : ''}{percentChange.toFixed(0)}%
                                    </Text>
                                    <Text className="wallet-summary-change-label">
                                        vs last month
                                    </Text>
                                </View>
                            )}
                        </View>

                        <CategoryBreakdown 
                            expenses={filteredExpenses} 
                            selectedCategory={selectedCategory}
                            onCategoryPress={handleCategoryPress}
                        />

                        <View className="transactions-header">
                            <Text className="section-title">Transactions</Text>
                            {selectedCategory ? (
                                <Pressable 
                                    className="wallet-filter-clear"
                                    onPress={() => setSelectedCategory(null)}
                                >
                                    <Text className="wallet-filter-clear-text">
                                        Clear filter
                                    </Text>
                                </Pressable>
                            ) : (
                                <Text className="transactions-count">
                                    {filteredExpenses.length} expenses
                                </Text>
                            )}
                        </View>
                        {selectedCategory && (
                            <View className="wallet-filter-badge">
                                <Text className="wallet-filter-badge-text">
                                    {selectedCategory}
                                </Text>
                            </View>
                        )}
                    </>
                )}
                renderItem={({ item }) => <ExpenseCard expense={item} />}
                ListEmptyComponent={() => (
                    <View className="empty-state">
                        <Text className="empty-state-text">No expenses this month</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            <AddExpenseModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleAddExpense}
            />
        </SafeAreaView>
    );
};

export default Wallet;