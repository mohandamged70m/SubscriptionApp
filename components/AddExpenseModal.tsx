import { View, Text, Modal, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '@/constants/data';

interface AddExpenseModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (expense: Expense) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ visible, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>('Other');
    const [note, setNote] = useState('');

    const isValidPrice = () => {
        const trimmedPrice = amount.trim();
        if (!trimmedPrice) return false;
        if (!/^\s*[+-]?(\d+(\.\d+)?|\.\d+)\s*$/.test(trimmedPrice)) return false;
        const numValue = Number(trimmedPrice);
        return Number.isFinite(numValue) && numValue > 0;
    };

    const isValidForm = name.trim() !== '' && isValidPrice();

    const handleSubmit = () => {
        if (!isValidForm) return;

        const amountValue = Number(amount.trim());

        const newExpense: Expense = {
            id: `expense-${Date.now()}`,
            name: name.trim(),
            amount: amountValue,
            currency: 'EGP',
            category,
            date: dayjs().toISOString(),
            note: note.trim() || undefined,
        };

        onSubmit(newExpense);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setName('');
        setAmount('');
        setCategory('Other');
        setNote('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={0}
            >
                <Pressable className="modal-overlay" onPress={handleClose}>
                    <Pressable className="modal-container" onPress={(e) => e.stopPropagation()}>
                        <View className="modal-header">
                            <Text className="modal-title">Add Expense</Text>
                            <Pressable className="modal-close" onPress={handleClose}>
                                <Text className="modal-close-text">✕</Text>
                            </Pressable>
                        </View>

                        <ScrollView
                            className="p-5"
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
                        >
                            <View className="auth-field">
                                <Text className="auth-label">Amount</Text>
                                <TextInput
                                    className="auth-input"
                                    placeholder="0.00"
                                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="decimal-pad"
                                />
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Name</Text>
                                <TextInput
                                    className="auth-input"
                                    placeholder="What did you spend on?"
                                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Category</Text>
                                <View className="category-scroll">
                                    {EXPENSE_CATEGORIES.map((cat) => (
                                        <Pressable
                                            key={cat}
                                            className={clsx('category-chip', category === cat && 'category-chip-active')}
                                            onPress={() => setCategory(cat)}
                                        >
                                            <Text className={clsx('category-chip-text', category === cat && 'category-chip-text-active')}>
                                                {cat}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Note (optional)</Text>
                                <TextInput
                                    className="auth-input auth-textarea"
                                    placeholder="Add a note..."
                                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                                    value={note}
                                    onChangeText={setNote}
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <Pressable
                                className={clsx('auth-button', !isValidForm && 'auth-button-disabled')}
                                onPress={handleSubmit}
                                disabled={!isValidForm}
                            >
                                <Text className="auth-button-text">Add Expense</Text>
                            </Pressable>
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default AddExpenseModal;