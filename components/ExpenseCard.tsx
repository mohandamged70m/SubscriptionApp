import { View, Text, Pressable } from 'react-native';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { EXPENSE_CATEGORY_COLORS, ExpenseCategory } from '@/constants/data';
import { formatCurrency } from '@/lib/utils';

dayjs.extend(relativeTime);

interface ExpenseCardProps {
    expense: Expense;
    onPress?: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
    const categoryColor = EXPENSE_CATEGORY_COLORS[expense.category as ExpenseCategory] || '#adb5bd';
    
    const formatDate = (date: string) => {
        const today = dayjs().startOf('day');
        const expenseDate = dayjs(date).startOf('day');
        const yesterday = today.subtract(1, 'day');
        
        if (expenseDate.isSame(today)) {
            return 'Today';
        } else if (expenseDate.isSame(yesterday)) {
            return 'Yesterday';
        } else {
            return dayjs(date).format('MMM D');
        }
    };

    return (
        <Pressable className="expense-card" onPress={onPress}>
            <View 
                className="expense-icon-container"
                style={{ backgroundColor: categoryColor + '20' }}
            >
                <View 
                    className="expense-icon-dot"
                    style={{ backgroundColor: categoryColor }}
                />
            </View>
            
            <View className="expense-info">
                <Text className="expense-name" numberOfLines={1}>
                    {expense.name}
                </Text>
                <Text className="expense-category">{expense.category}</Text>
            </View>
            
            <View className="expense-right">
                <Text className="expense-amount">
                    -{formatCurrency(expense.amount)}
                </Text>
                <Text className="expense-date">
                    {formatDate(expense.date)}
                </Text>
            </View>
        </Pressable>
    );
};

export default ExpenseCard;