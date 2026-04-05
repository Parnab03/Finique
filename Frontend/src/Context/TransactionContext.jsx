import { createContext, useState, useCallback, useEffect } from "react";

export const TransactionContext = createContext();

const DEFAULT_TRANSACTIONS = [
    {
        id: 1,
        name: "Gourmet Garden Bistro",
        description: "Fine Dining",
        date: "24 Oct, 2023",
        categoryId: "food",
        amount: 4250,
        type: "expense",
    },
    {
        id: 2,
        name: "Global Tech Corp",
        description: "Monthly Salary",
        date: "01 Oct, 2023",
        categoryId: "income",
        amount: 125000,
        type: "income",
    },
    {
        id: 3,
        name: "Skyways Aviation",
        description: "Business Trip",
        date: "28 Sep, 2023",
        categoryId: "travel",
        amount: 12800,
        type: "expense",
    },
    {
        id: 4,
        name: "Apple Store Online",
        description: "Tech Gadget",
        date: "23 Oct, 2023",
        categoryId: "shopping",
        amount: 1299,
        type: "expense",
    },
    {
        id: 5,
        name: "Netflix Subscription",
        description: "Monthly Plan",
        date: "22 Oct, 2023",
        categoryId: "entertainment",
        amount: 499,
        type: "expense",
    },
    {
        id: 6,
        name: "Monthly Rent",
        description: "Apartment",
        date: "01 Oct, 2023",
        categoryId: "housing",
        amount: 50000,
        type: "expense",
    },
    {
        id: 7,
        name: "Freelance Project",
        description: "Web Design",
        date: "20 Oct, 2023",
        categoryId: "income",
        amount: 25000,
        type: "income",
    },
    {
        id: 8,
        name: "Electricity Bill",
        description: "Monthly Utility",
        date: "15 Oct, 2023",
        categoryId: "utilities",
        amount: 1200,
        type: "expense",
    },
    {
        id: 9,
        name: "Dr. Smith Medical Clinic",
        description: "Doctor Checkup",
        date: "20 Oct, 2023",
        categoryId: "healthcare",
        amount: 2500,
        type: "expense",
    },
    {
        id: 10,
        name: "Udemy Course",
        description: "Web Development",
        date: "18 Oct, 2023",
        categoryId: "education",
        amount: 1599,
        type: "expense",
    },
    {
        id: 11,
        name: "Bitcoin Investment",
        description: "Crypto Portfolio",
        date: "17 Oct, 2023",
        categoryId: "investment",
        amount: 15000,
        type: "expense",
    },
    {
        id: 12,
        name: "Concert Tickets",
        description: "Live Music Event",
        date: "16 Oct, 2023",
        categoryId: "entertainment",
        amount: 3500,
        type: "expense",
    },
    {
        id: 13,
        name: "Zara Fashion Store",
        description: "Winter Collection",
        date: "14 Oct, 2023",
        categoryId: "shopping",
        amount: 8750,
        type: "expense",
    },
    {
        id: 14,
        name: "Consulting Work",
        description: "Project Completion",
        date: "12 Oct, 2023",
        categoryId: "income",
        amount: 18500,
        type: "income",
    },
    {
        id: 15,
        name: "Flight to Dubai",
        description: "Vacation Trip",
        date: "10 Oct, 2023",
        categoryId: "travel",
        amount: 22000,
        type: "expense",
    },
];

export const TransactionProvider = ({ children }) => {
    const [allTransactions, setAllTransactions] =
        useState(DEFAULT_TRANSACTIONS);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageGoalsOpen, setIsManageGoalsOpen] = useState(false);
    const [selectedGoalsMonth, setSelectedGoalsMonth] = useState("APR");

    // DEFINE loadPresetData FIRST (before useEffect uses it)
    const loadPresetData = useCallback(async (presetId) => {
        try {
            const response = await fetch(`/presets/${presetId}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load preset: ${presetId}`);
            }
            const presetData = await response.json();

            if (
                presetData.transactions &&
                Array.isArray(presetData.transactions)
            ) {
                setAllTransactions(presetData.transactions);
                localStorage.setItem(
                    "finique_transactions",
                    JSON.stringify(presetData.transactions),
                );
            }

            if (presetData.goals && Array.isArray(presetData.goals)) {
                localStorage.setItem(
                    "finique_goals",
                    JSON.stringify(presetData.goals),
                );
            }

            return presetData;
        } catch (error) {
            console.error("Error loading preset:", error);
            return null;
        }
    }, []);

    // NOW useEffect can safely call it
    useEffect(() => {
        const stored = localStorage.getItem("finique_transactions");
        if (stored) {
            try {
                setAllTransactions(JSON.parse(stored));
            } catch (err) {
                console.error("Failed to parse stored transactions:", err);
                loadPresetData("student-budget");
            }
        } else {
            loadPresetData("student-budget");
        }
    }, [loadPresetData]);

    const addTransaction = (newTransaction) => {
        const updated = [newTransaction, ...allTransactions];
        setAllTransactions(updated);
        localStorage.setItem("finique_transactions", JSON.stringify(updated));
    };

    return (
        <TransactionContext.Provider
            value={{
                isModalOpen,
                setIsModalOpen,
                allTransactions,
                setAllTransactions,
                addTransaction,
                loadPresetData,
                isManageGoalsOpen,
                setIsManageGoalsOpen,
                selectedGoalsMonth,
                setSelectedGoalsMonth,
            }}>
            {children}
        </TransactionContext.Provider>
    );
};
