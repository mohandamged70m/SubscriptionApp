import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_COLORS } from '@/constants/data';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownProps {
    expenses: Expense[];
    selectedCategory?: string | null;
    onCategoryPress?: (category: string) => void;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ expenses, selectedCategory, onCategoryPress }) => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryTotals = EXPENSE_CATEGORIES.map(category => {
        const categoryExpenses = expenses.filter(e => e.category === category);
        const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
        const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
        return {
            category,
            total,
            percentage,
            color: EXPENSE_CATEGORY_COLORS[category],
        };
    }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

    const maxPercentage = Math.max(...categoryTotals.map(c => c.percentage), 1);

    if (categoryTotals.length === 0) {
        return (
            <View className="category-breakdown">
                <Text className="section-title">Categories</Text>
                <View className="empty-state">
                    <Text className="empty-state-text">No expenses yet</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="category-breakdown">
            <Text className="section-title">Categories</Text>
            <View className="category-list">
                {categoryTotals.map((item) => (
                    <Pressable
                        key={item.category}
                        className={`category-row ${selectedCategory && selectedCategory !== item.category ? 'category-row-dimmed' : ''}`}
                        onPress={() => onCategoryPress?.(item.category)}
                    >
                        <View className="category-info">
                            <View 
                                className="category-dot" 
                                style={{ backgroundColor: item.color }} 
                            />
                            <Text className="category-name">{item.category}</Text>
                        </View>
                        <View className="category-amounts">
                            <Text className="category-amount">{formatCurrency(item.total)}</Text>
                            <Text className="category-percentage">
                                {item.percentage.toFixed(0)}%
                            </Text>
                        </View>
                        <View className="category-bar-container">
                            <View 
                                className="category-bar"
                                style={{ 
                                    width: `${(item.percentage / maxPercentage) * 100}%`,
                                    backgroundColor: item.color,
                                }}
                            />
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

export default CategoryBreakdown;