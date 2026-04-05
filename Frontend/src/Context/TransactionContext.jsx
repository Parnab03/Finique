import { createContext, useState, useCallback, useEffect } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [allTransactions, setAllTransactions] = useState([]);
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
                // Mark transactions as from preset
                const markedTransactions = presetData.transactions.map(
                    (tx) => ({
                        ...tx,
                        fromPreset: true,
                    }),
                );
                setAllTransactions(markedTransactions);
                localStorage.setItem(
                    "finique_transactions_preset",
                    JSON.stringify(markedTransactions),
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
        // Get current preset selection
        const settingsRaw = localStorage.getItem("finique_settings_v1");
        let currentPreset = "no-presets";
        try {
            if (settingsRaw) {
                const settings = JSON.parse(settingsRaw);
                currentPreset = settings.selectedPreset || "no-presets";
            }
        } catch (err) {
            console.error("Failed to parse settings:", err);
        }

        // Load appropriate storage based on current preset
        if (currentPreset === "no-presets") {
            // Load from custom storage
            const stored = localStorage.getItem("finique_transactions_custom");
            if (stored) {
                try {
                    setAllTransactions(JSON.parse(stored));
                } catch (err) {
                    console.error("Failed to parse stored transactions:", err);
                    setAllTransactions([]);
                    localStorage.setItem(
                        "finique_transactions_custom",
                        JSON.stringify([]),
                    );
                }
            } else {
                setAllTransactions([]);
                localStorage.setItem(
                    "finique_transactions_custom",
                    JSON.stringify([]),
                );
            }
        } else {
            // Load from preset storage
            const stored = localStorage.getItem("finique_transactions_preset");
            if (stored) {
                try {
                    setAllTransactions(JSON.parse(stored));
                } catch (err) {
                    console.error("Failed to parse stored transactions:", err);
                    setAllTransactions([]);
                }
            } else {
                setAllTransactions([]);
            }
        }
    }, [loadPresetData]);

    const reloadTransactions = useCallback(() => {
        // Get current preset selection
        const settingsRaw = localStorage.getItem("finique_settings_v1");
        let currentPreset = "no-presets";
        try {
            if (settingsRaw) {
                const settings = JSON.parse(settingsRaw);
                currentPreset = settings.selectedPreset || "no-presets";
            }
        } catch (err) {
            console.error("Failed to parse settings:", err);
        }

        // Load appropriate storage based on current preset
        if (currentPreset === "no-presets") {
            // Load from custom storage
            const stored = localStorage.getItem("finique_transactions_custom");
            if (stored) {
                try {
                    setAllTransactions(JSON.parse(stored));
                } catch (err) {
                    console.error("Failed to parse stored transactions:", err);
                    setAllTransactions([]);
                }
            } else {
                setAllTransactions([]);
            }
        } else {
            // Load from preset storage
            const stored = localStorage.getItem("finique_transactions_preset");
            if (stored) {
                try {
                    setAllTransactions(JSON.parse(stored));
                } catch (err) {
                    console.error("Failed to parse stored transactions:", err);
                    setAllTransactions([]);
                }
            } else {
                setAllTransactions([]);
            }
        }
    }, []);

    const addTransaction = (newTransaction) => {
        // Get current preset
        const settingsRaw = localStorage.getItem("finique_settings_v1");
        let currentPreset = "no-presets";
        try {
            if (settingsRaw) {
                const settings = JSON.parse(settingsRaw);
                currentPreset = settings.selectedPreset || "no-presets";
            }
        } catch (err) {
            console.error("Failed to parse settings:", err);
        }

        const updated = [newTransaction, ...allTransactions];
        setAllTransactions(updated);

        // Save to appropriate storage
        const storageKey =
            currentPreset === "no-presets"
                ? "finique_transactions_custom"
                : "finique_transactions_preset";
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    const deleteTransaction = (transactionId) => {
        const transaction = allTransactions.find(
            (tx) => tx.id === transactionId,
        );

        // Prevent deletion of preset data
        if (transaction?.fromPreset) {
            return { success: false, message: "Preset data cannot be deleted" };
        }

        const updated = allTransactions.filter((tx) => tx.id !== transactionId);
        setAllTransactions(updated);

        // Get current preset
        const settingsRaw = localStorage.getItem("finique_settings_v1");
        let currentPreset = "no-presets";
        try {
            if (settingsRaw) {
                const settings = JSON.parse(settingsRaw);
                currentPreset = settings.selectedPreset || "no-presets";
            }
        } catch (err) {
            console.error("Failed to parse settings:", err);
        }

        // Save to appropriate storage
        const storageKey =
            currentPreset === "no-presets"
                ? "finique_transactions_custom"
                : "finique_transactions_preset";
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return { success: true, message: "Transaction deleted successfully" };
    };

    return (
        <TransactionContext.Provider
            value={{
                isModalOpen,
                setIsModalOpen,
                allTransactions,
                setAllTransactions,
                addTransaction,
                deleteTransaction,
                loadPresetData,
                reloadTransactions,
                isManageGoalsOpen,
                setIsManageGoalsOpen,
                selectedGoalsMonth,
                setSelectedGoalsMonth,
            }}>
            {children}
        </TransactionContext.Provider>
    );
};
