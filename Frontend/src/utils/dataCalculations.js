// Parse date string like "01 Apr, 2026" to Date object
export const parseDate = (dateStr) => {
    const monthMap = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
    };

    const parts = dateStr.trim().split(/\s+/);
    if (parts.length !== 3) {
        console.warn("Invalid date format:", dateStr);
        return new Date(dateStr); // fallback
    }

    const day = parseInt(parts[0], 10);
    // Remove comma from month if present (e.g., "Mar," -> "Mar")
    const monthStr = parts[1].replace(",", "");
    const month = monthMap[monthStr];
    const year = parseInt(parts[2], 10);

    if (month === undefined) {
        console.warn("Invalid month in date:", dateStr);
        return new Date(dateStr); // fallback
    }

    return new Date(year, month, day);
};

// Get month name from date
export const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "short" }).toUpperCase();
};

// Get month abbreviation from transaction date
export const getMonthFromTransaction = (date) => {
    const monthMap = {
        0: "JAN",
        1: "FEB",
        2: "MAR",
        3: "APR",
        4: "MAY",
        5: "JUN",
        6: "JUL",
        7: "AUG",
        8: "SEP",
        9: "OCT",
        10: "NOV",
        11: "DEC",
    };
    return monthMap[date.getMonth()];
};

// Calculate monthly spending from transactions
export const calculateMonthlyData = (transactions, monthCount = 6) => {
    const monthlyMap = {};
    const dateMap = {}; // Track dates for sorting

    transactions.forEach((tx) => {
        try {
            const date = parseDate(tx.date);
            const monthName = getMonthFromTransaction(date);
            const year = date.getFullYear();
            const key = `${year}-${monthName}`; // "2025-MAY", "2026-JAN", etc.

            if (!monthlyMap[key]) {
                monthlyMap[key] = 0;
                dateMap[key] = date; // Store actual date for sorting
            }
            if (tx.type === "expense") {
                monthlyMap[key] += tx.amount;
            }
        } catch (e) {
            console.error("Error parsing transaction date:", tx.date);
        }
    });

    // Sort by actual date, not calendar month
    const sortedKeys = Object.keys(monthlyMap).sort((a, b) => {
        return dateMap[a] - dateMap[b]; // Chronological sort
    });

    // Convert back to display format
    const result = sortedKeys.map((key) => {
        const monthName = key.split("-")[1];
        return {
            month: monthName,
            spending: monthlyMap[key],
        };
    });

    return result.length > 0 ? result : [];
};

// Calculate category breakdown for a specific month
export const calculateCategoryByMonth = (transactions, monthName) => {
    const categoryMap = {};
    let totalSpending = 0;

    transactions.forEach((tx) => {
        try {
            if (tx.type === "expense") {
                const month = getMonthFromTransaction(parseDate(tx.date));
                if (month === monthName) {
                    const category = tx.categoryId;
                    if (!categoryMap[category]) {
                        categoryMap[category] = 0;
                    }
                    categoryMap[category] += tx.amount;
                    totalSpending += tx.amount;
                }
            }
        } catch (e) {
            console.warn("Invalid date:", tx.date);
        }
    });

    // Convert to chart format
    const colors = {
        food: "#F4C816",
        travel: "#0053DD",
        shopping: "#FF6B6B",
        housing: "#4C9AFF",
        utilities: "#95E1D3",
        entertainment: "#8B5CF6",
        investment: "#059669",
        healthcare: "#EC4899",
        education: "#F59E0B",
        income: "#10B981",
    };

    const result = Object.entries(categoryMap)
        .filter(([_, amount]) => amount > 0) // Filter out zero amounts at source
        .map(([cat, amount]) => ({
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            value:
                totalSpending > 0
                    ? Math.round((amount / totalSpending) * 100)
                    : 0,
            amount,
            color: colors[cat] || "#6B7280",
        }));

    return result.length > 0
        ? result
        : [{ name: "No data", value: 100, amount: 0, color: "#D1D5DB" }];
};

// Calculate weekly breakdown for a month
export const calculateWeeklyData = (transactions, monthName) => {
    const weekMap = {};
    const monthMap = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11,
    };

    const monthNum = monthMap[monthName];

    transactions.forEach((tx) => {
        try {
            const date = parseDate(tx.date);
            const month = getMonthFromTransaction(date);

            if (month === monthName && tx.type === "expense") {
                const day = date.getDate();
                const week = Math.max(1, Math.ceil(day / 7));
                const weekKey = `${monthName} W${week}`;

                if (!weekMap[weekKey]) {
                    weekMap[weekKey] = 0;
                }
                weekMap[weekKey] += tx.amount;
            }
        } catch (e) {
            console.warn("Invalid date:", tx.date);
        }
    });

    // Create all 4 weeks even if no data
    const result = [];
    for (let week = 1; week <= 4; week++) {
        const weekKey = `${monthName} W${week}`;
        result.push({
            month: weekKey,
            amount: weekMap[weekKey] || 0,
        });
    }

    return result;
};

// Calculate totals
export const calculateTotals = (transactions) => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
        if (tx.type === "income") {
            totalIncome += tx.amount;
        } else if (tx.type === "expense") {
            totalExpense += tx.amount;
        }
    });

    return {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense,
    };
};

// Get last 6 months in order
export const getLastSixMonths = (transactions) => {
    const monthSet = new Set();
    const dateMap = {};

    transactions.forEach((tx) => {
        try {
            const date = parseDate(tx.date);
            const monthName = getMonthFromTransaction(date);
            const key = `${date.getFullYear()}-${monthName}`;
            monthSet.add(key);
            dateMap[key] = date;
        } catch (e) {
            console.error("Error parsing transaction date:", tx.date);
        }
    });

    const sortedKeys = Array.from(monthSet).sort((a, b) => {
        return dateMap[a] - dateMap[b];
    });

    // Return just the month names from last 6
    return sortedKeys.slice(-6).map((key) => key.split("-")[1]);
};
