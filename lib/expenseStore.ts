import { create } from 'zustand';
import { HOME_EXPENSES } from '@/constants/data';

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  setExpenses: (expenses: Expense[]) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: HOME_EXPENSES,
  addExpense: (expense) =>
    set((state) => ({ expenses: [expense, ...state.expenses] })),
  removeExpense: (id) =>
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),
  setExpenses: (expenses) => set({ expenses }),
}));