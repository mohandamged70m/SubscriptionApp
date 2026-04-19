import { icons } from "./icons";

export const tabs: AppTab[] = [
    { name: "index", title: "Home", icon: icons.home },
    { name: "wallet", title: "Expenses", icon: icons.expense },
    { name: "subscriptions", title: "Subscriptions", icon: icons.wallet },
    { name: "insights", title: "Insights", icon: icons.activity },
    { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
    name: "Mohand Darwish",
};

export const HOME_BALANCE = {
    amount: 2489.48,
    nextRenewalDate: "2026-03-18T09:00:00.000Z",
};

export const UPCOMING_SUBSCRIPTIONS: UpcomingSubscription[] = [
    {
        id: "spotify",
        icon: icons.spotify,
        name: "Spotify",
        price: 5.99,
        currency: "EGP",
        daysLeft: 2,
    },
    {
        id: "notion",
        icon: icons.notion,
        name: "Notion",
        price: 12.0,
        currency: "EGP",
        daysLeft: 4,
    },
    {
        id: "figma",
        icon: icons.figma,
        name: "Figma",
        price: 15.0,
        currency: "EGP",
        daysLeft: 6,
    },
];

export const HOME_SUBSCRIPTIONS: Subscription[] = [
    {
        id: "adobe-creative-cloud",
        icon: icons.adobe,
        name: "Adobe Creative Cloud",
        plan: "Teams Plan",
        category: "Design",
        paymentMethod: "Visa ending in 8530",
        status: "active",
        startDate: "2025-03-20T10:00:00.000Z",
        price: 77.49,
        currency: "EGP",
        billing: "Monthly",
        renewalDate: "2026-04-20T10:00:00.000Z",
        color: "#f5c542",
    },
    {
        id: "github-pro",
        icon: icons.github,
        name: "GitHub Pro",
        plan: "Developer",
        category: "Developer Tools",
        paymentMethod: "Mastercard ending in 2408",
        status: "active",
        startDate: "2024-11-24T10:00:00.000Z",
        price: 9.99,
        currency: "EGP",
        billing: "Monthly",
        renewalDate: "2026-03-24T10:00:00.000Z",
        color: "#e8def8",
    },
    {
        id: "claude-pro",
        icon: icons.claude,
        name: "Claude Pro",
        plan: "Pro Plan",
        category: "AI Tools",
        paymentMethod: "Amex ending in 1010",
        status: "paused",
        startDate: "2025-06-27T10:00:00.000Z",
        price: 20.0,
        currency: "EGP",
        billing: "Monthly",
        renewalDate: "2026-03-27T10:00:00.000Z",
        color: "#b8d4e3",
    },
    {
        id: "canva-pro",
        icon: icons.canva,
        name: "Canva Pro",
        plan: "Yearly Access",
        category: "Design",
        paymentMethod: "Visa ending in 7784",
        status: "cancelled",
        startDate: "2024-04-02T10:00:00.000Z",
        price: 119.99,
        currency: "EGP",
        billing: "Yearly",
        renewalDate: "2026-04-02T10:00:00.000Z",
        color: "#b8e8d0",
    },
];

export type ExpenseCategory = 
    | 'Entertainment'
    | 'Food & Dining'
    | 'Transport'
    | 'Shopping'
    | 'Bills & Utilities'
    | 'Health'
    | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
    'Entertainment',
    'Food & Dining',
    'Transport',
    'Shopping',
    'Bills & Utilities',
    'Health',
    'Other',
];

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
    'Entertainment': '#ff6b6b',
    'Food & Dining': '#f9c74f',
    'Transport': '#90be6d',
    'Shopping': '#4dabf7',
    'Bills & Utilities': '#9775fa',
    'Health': '#f06595',
    'Other': '#adb5bd',
};

export const HOME_EXPENSES: Expense[] = [
    {
        id: 'expense-1',
        name: 'Netflix',
        amount: 5.99,
        currency: 'EGP',
        category: 'Entertainment',
        date: '2026-04-19T10:00:00.000Z',
        note: 'Monthly subscription',
    },
    {
        id: 'expense-2',
        name: 'Uber Eats',
        amount: 125.0,
        currency: 'EGP',
        category: 'Food & Dining',
        date: '2026-04-18T12:30:00.000Z',
        note: 'Lunch order',
    },
    {
        id: 'expense-3',
        name: 'Uber',
        amount: 45.0,
        currency: 'EGP',
        category: 'Transport',
        date: '2026-04-17T08:00:00.000Z',
    },
    {
        id: 'expense-4',
        name: 'Amazon',
        amount: 350.0,
        currency: 'EGP',
        category: 'Shopping',
        date: '2026-04-16T15:00:00.000Z',
        note: 'Headphones',
    },
    {
        id: 'expense-5',
        name: 'Electricity Bill',
        amount: 450.0,
        currency: 'EGP',
        category: 'Bills & Utilities',
        date: '2026-04-15T09:00:00.000Z',
        note: 'Monthly bill',
    },
    {
        id: 'expense-6',
        name: 'Pharmacy',
        amount: 85.0,
        currency: 'EGP',
        category: 'Health',
        date: '2026-04-14T11:00:00.000Z',
        note: 'Vitamins',
    },
    {
        id: 'expense-7',
        name: 'Coffee Shop',
        amount: 35.0,
        currency: 'EGP',
        category: 'Food & Dining',
        date: '2026-04-13T10:00:00.000Z',
    },
    {
        id: 'expense-8',
        name: 'Steam Game',
        amount: 199.0,
        currency: 'EGP',
        category: 'Entertainment',
        date: '2026-04-12T20:00:00.000Z',
    },
    {
        id: 'expense-9',
        name: 'Spotify',
        amount: 49.99,
        currency: 'EGP',
        category: 'Entertainment',
        date: '2026-03-20T10:00:00.000Z',
        note: 'Monthly subscription',
    },
    {
        id: 'expense-10',
        name: 'Grocery',
        amount: 280.0,
        currency: 'EGP',
        category: 'Food & Dining',
        date: '2026-03-15T14:00:00.000Z',
    },
    {
        id: 'expense-11',
        name: 'Gas Station',
        amount: 200.0,
        currency: 'EGP',
        category: 'Transport',
        date: '2026-03-10T08:00:00.000Z',
    },
    {
        id: 'expense-12',
        name: 'Water Bill',
        amount: 75.0,
        currency: 'EGP',
        category: 'Bills & Utilities',
        date: '2026-03-01T09:00:00.000Z',
    },
    {
        id: 'expense-13',
        name: 'Doctor Visit',
        amount: 150.0,
        currency: 'EGP',
        category: 'Health',
        date: '2026-02-25T11:00:00.000Z',
    },
    {
        id: 'expense-14',
        name: 'Restaurant',
        amount: 320.0,
        currency: 'EGP',
        category: 'Food & Dining',
        date: '2026-02-14T19:00:00.000Z',
        note: 'Valentine dinner',
    },
    {
        id: 'expense-15',
        name: 'Internet',
        amount: 250.0,
        currency: 'EGP',
        category: 'Bills & Utilities',
        date: '2026-02-01T09:00:00.000Z',
    },
]; 