import { useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import {
    getCategoryName,
    getCategoryIcon,
    getCategoryById,
} from "../../Constants/transactionCategories.jsx";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { TransactionContext } from "../../Context/TransactionContext";
import {
    calculateMonthlyData,
    calculateCategoryByMonth,
    calculateTotals,
    getLastSixMonths,
} from "../../utils/dataCalculations";

const Dashboard = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const { allTransactions } = useContext(TransactionContext); // Add this
    const navigate = useNavigate();
    const [monthFilter, setMonthFilter] = useState(6);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [transactionFilter, setTransactionFilter] = useState("All");
    const [categoryMonthFilter, setCategoryMonthFilter] = useState(null);

    // Dynamic data from transactions
    const totals = useMemo(
        () => calculateTotals(allTransactions),
        [allTransactions],
    );
    const lastSixMonths = useMemo(
        () => getLastSixMonths(allTransactions),
        [allTransactions],
    );

    // Get total available months of data
    const totalAvailableMonths = useMemo(() => {
        const allData = calculateMonthlyData(allTransactions);
        return allData.length;
    }, [allTransactions]);

    // Generate dynamic filter options based on available months
    const availableFilters = useMemo(() => {
        const filters = [];
        if (totalAvailableMonths >= 3) filters.push(3);
        if (totalAvailableMonths >= 6) filters.push(6);
        if (totalAvailableMonths >= 9) filters.push(9);
        if (totalAvailableMonths >= 12) filters.push(12);
        if (totalAvailableMonths > 3) filters.push("all"); // Add "all" if more than 3 months
        return filters;
    }, [totalAvailableMonths]);

    // Update categoryMonthFilter to always default to last month (most recent)
    useEffect(() => {
        if (lastSixMonths.length > 0) {
            setCategoryMonthFilter(lastSixMonths[lastSixMonths.length - 1]);
        }
    }, [lastSixMonths]);

    // Monthly data changes based on monthFilter
    const monthlyData = useMemo(() => {
        const allData = calculateMonthlyData(allTransactions);
        // Filter to last N months based on monthFilter
        if (monthFilter === "all") {
            return allData; // Show all months
        }
        const monthCount = { 3: 3, 6: 6, 9: 9, 12: 12 }[monthFilter];
        return allData.slice(-monthCount);
    }, [allTransactions, monthFilter]);

    // Category data for selected month
    const categoryData = useMemo(
        () => calculateCategoryByMonth(allTransactions, categoryMonthFilter),
        [allTransactions, categoryMonthFilter],
    );

    // Helper function to get monthly data
    const getMonthlyData = useMemo(() => {
        if (allTransactions.length === 0) {
            return { monthlyMap: {}, dateMap: {}, sortedKeys: [] };
        }

        const monthlyMap = {};
        const dateMap = {};

        allTransactions.forEach((tx) => {
            try {
                const date = new Date(tx.date);
                const monthName = date
                    .toLocaleString("default", { month: "short" })
                    .toUpperCase();
                const year = date.getFullYear();
                const key = `${year}-${monthName}`;

                if (!monthlyMap[key]) {
                    monthlyMap[key] = { income: 0, expense: 0 };
                    dateMap[key] = date;
                }

                if (tx.type === "income") {
                    monthlyMap[key].income += tx.amount;
                } else {
                    monthlyMap[key].expense += tx.amount;
                }
            } catch (e) {
                console.error("Error parsing date:", tx.date);
            }
        });

        const sortedKeys = Object.keys(monthlyMap).sort(
            (a, b) => dateMap[a] - dateMap[b],
        );

        return { monthlyMap, dateMap, sortedKeys };
    }, [allTransactions]);

    // Calculate balance change from last month
    const balanceChangeData = useMemo(() => {
        const { monthlyMap, sortedKeys } = getMonthlyData;

        if (sortedKeys.length < 2) {
            return {
                percentage: 0,
                isPositive: true,
                text: "Insufficient data",
                amount: 0, // Add this
            };
        }

        const currentMonthKey = sortedKeys[sortedKeys.length - 1];
        const previousMonthKey = sortedKeys[sortedKeys.length - 2];

        const currentBalance =
            monthlyMap[currentMonthKey].income -
            monthlyMap[currentMonthKey].expense;
        const previousBalance =
            monthlyMap[previousMonthKey].income -
            monthlyMap[previousMonthKey].expense;

        let percentage = 0;
        if (previousBalance !== 0) {
            percentage = Math.abs(
                ((currentBalance - previousBalance) / previousBalance) * 100,
            );
        } else if (currentBalance > 0) {
            percentage = 100;
        }

        const isPositive = currentBalance >= previousBalance;

        return {
            percentage: percentage.toFixed(1),
            isPositive,
            text: `${isPositive ? "+" : "-"}${percentage.toFixed(1)}% from last month`,
        };
    }, [getMonthlyData]);

    // Calculate income change from last month
    const incomeChangeData = useMemo(() => {
        const { monthlyMap, sortedKeys } = getMonthlyData;

        if (sortedKeys.length < 2) {
            return {
                percentage: 0,
                isPositive: true,
                text: "Insufficient data",
                amount: 0, // Add this
            };
        }

        const currentMonthKey = sortedKeys[sortedKeys.length - 1];
        const previousMonthKey = sortedKeys[sortedKeys.length - 2];

        const currentIncome = monthlyMap[currentMonthKey].income;
        const previousIncome = monthlyMap[previousMonthKey].income;

        let percentage = 0;
        if (previousIncome !== 0) {
            percentage = Math.abs(
                ((currentIncome - previousIncome) / previousIncome) * 100,
            );
        } else if (currentIncome > 0) {
            percentage = 100;
        }

        const isPositive = currentIncome >= previousIncome;

        return {
            percentage: percentage.toFixed(1),
            isPositive,
            amount: currentIncome,
        };
    }, [getMonthlyData]);

    // Calculate expense change from last month
    const expenseChangeData = useMemo(() => {
        const { monthlyMap, sortedKeys } = getMonthlyData;

        if (sortedKeys.length < 2) {
            return {
                percentage: 0,
                isPositive: true,
                text: "Insufficient data",
                amount: 0,
            };
        }

        const currentMonthKey = sortedKeys[sortedKeys.length - 1];
        const previousMonthKey = sortedKeys[sortedKeys.length - 2];

        const currentExpense = monthlyMap[currentMonthKey].expense;
        const previousExpense = monthlyMap[previousMonthKey].expense;

        let percentage = 0;
        if (previousExpense !== 0) {
            percentage = Math.abs(
                ((currentExpense - previousExpense) / previousExpense) * 100,
            );
        } else if (currentExpense > 0) {
            percentage = 100;
        }

        const isPositive = currentExpense <= previousExpense;

        return {
            percentage: percentage.toFixed(1),
            isPositive,
            amount: currentExpense, // Make sure this is here
        };
    }, [getMonthlyData]);

    // For recent transactions display - Show 8 latest transactions
    const filteredTransactions = useMemo(() => {
        const filtered = allTransactions.filter((tx) => {
            if (transactionFilter === "All") return true;
            if (transactionFilter === "Income") return tx.type === "income";
            if (transactionFilter === "Expenses") return tx.type === "expense";
            return true;
        });

        // Sort by date (newest first) and take 8 latest
        return [...filtered]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 8);
    }, [allTransactions, transactionFilter]);

    const chartTextColor = isDarkMode ? "#e2e8f0" : "#1e293b";
    const gridColor = isDarkMode ? "#334155" : "#e2e8f0";

    // Calculate insights data
    const categorySpending = allTransactions.reduce((acc, tx) => {
        if (tx.type === "expense") {
            const existing = acc.find(
                (item) => item.categoryId === tx.categoryId,
            );
            if (existing) {
                existing.amount += tx.amount;
            } else {
                acc.push({
                    categoryId: tx.categoryId,
                    amount: tx.amount,
                });
            }
        }
        return acc;
    }, []);

    const totalExpense = allTransactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalIncome = allTransactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const netBalance = totalIncome - totalExpense;

    const topCategory = [...categorySpending].sort(
        (a, b) => b.amount - a.amount,
    )[0];

    const spendingRate =
        totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

    // Generate resource links based on category
    const getResourcesForCategory = (categoryId) => {
        const resources = {
            Food: {
                video: "https://www.youtube.com/results?search_query=how+to+reduce+food+grocery+expenses",
                blog: "https://www.thebalancemoney.com/grocery-budget-tips-4768714",
            },
            Housing: {
                video: "https://www.youtube.com/results?search_query=how+to+reduce+housing+costs+rent",
                blog: "https://www.nerdwallet.com/article/finance/how-to-lower-your-housing-costs",
            },
            Transportation: {
                video: "https://www.youtube.com/results?search_query=save+money+on+car+expenses",
                blog: "https://www.bankrate.com/finance/auto/ways-to-lower-car-expenses.html",
            },
            Utilities: {
                video: "https://www.youtube.com/results?search_query=reduce+electricity+water+bills",
                blog: "https://www.consumerreports.org/money/how-to-lower-your-utility-bills/",
            },
            Entertainment: {
                video: "https://www.youtube.com/results?search_query=reduce+entertainment+spending+budget",
                blog: "https://www.thebalancemoney.com/entertainment-budget-4768684",
            },
            Healthcare: {
                video: "https://www.youtube.com/results?search_query=reduce+healthcare+costs+medical+expenses",
                blog: "https://www.investopedia.com/articles/personal-finance/072415/strategies-reduce-your-medical-bills.asp",
            },
            Shopping: {
                video: "https://www.youtube.com/results?search_query=smart+shopping+save+money+budgeting",
                blog: "https://www.thebalancemoney.com/smart-shopping-tips-4768652",
            },
        };

        return (
            resources[categoryId] || {
                video: "https://www.youtube.com/results?search_query=personal+finance+budgeting+tips",
                blog: "https://www.nerdwallet.com/article/finance/budgeting-tips",
            }
        );
    };

    // Generate spending insights
    const generateSpendingInsight = () => {
        if (!topCategory || allTransactions.length === 0) {
            return {
                title: "Start Tracking",
                description:
                    "Add more transactions to get personalized spending insights.",
                category: null,
            };
        }

        const percentage = Math.round(
            (topCategory.amount / totalExpense) * 100,
        );
        return {
            title: `${topCategory.categoryId} - Top Expense`,
            description: `${topCategory.categoryId} accounts for ${percentage}% of your monthly spending (₹${topCategory.amount.toLocaleString()}). Consider optimizing this category.`,
            category: topCategory.categoryId,
        };
    };

    // Generate savings insight
    const generateSavingsInsight = () => {
        if (totalIncome === 0 || allTransactions.length === 0) {
            return {
                title: "Build Your Income",
                description:
                    "Start logging income transactions to track your earnings and savings potential.",
            };
        }

        if (spendingRate <= 40) {
            return {
                title: "Excellent Savings Rate!",
                description: `You're spending only ${spendingRate}% of income, saving ${100 - spendingRate}%. Keep up this great discipline!`,
            };
        } else if (spendingRate <= 60) {
            return {
                title: "Balanced Spending",
                description: `You're spending ${spendingRate}% of income. This is a healthy range. Continue monitoring to optimize further.`,
            };
        } else {
            return {
                title: "High Spending Alert",
                description: `You're spending ${spendingRate}% of income. Consider reviewing your expenses to increase savings.`,
            };
        }
    };

    // Generate budgeting insight
    const generateBudgetingInsight = () => {
        if (allTransactions.length === 0) {
            return {
                title: "Create Your Budget",
                description:
                    "Start tracking transactions to establish a baseline for your budget planning.",
            };
        }

        const avgTransaction = Math.round(
            totalExpense / allTransactions.length,
        );
        return {
            title: "Budgeting Strategy",
            description: `Your average transaction is ₹${avgTransaction}. Track trends to build an effective budget aligned with the 50/30/20 rule.`,
        };
    };

    return (
        <div className={`p-8 space-y-8`}>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Total Balance Card */}
                <div
                    className={`lg:col-span-1 p-6 rounded-2xl transition-all duration-300 bg-blue-600 text-white shadow-[0_10px_15px_-3px_rgba(0,83,221,0.40),0_4px_6px_-4px_rgba(0,83,221,0.40)]`}>
                    <div className="flex items-start justify-between mb-6">
                        <div className="text-base font-semibold tracking-wide mb-6 text-blue-100">
                            TOTAL BALANCE
                        </div>
                        <div>
                            <svg
                                width="19"
                                height="18"
                                viewBox="0 0 19 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    opacity="0.6"
                                    d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2H10C8.81667 2 7.85417 2.37083 7.1125 3.1125C6.37083 3.85417 6 4.81667 6 6V12C6 13.1833 6.37083 14.1458 7.1125 14.8875C7.85417 15.6292 8.81667 16 10 16H18C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM10 14C9.45 14 8.97917 13.8042 8.5875 13.4125C8.19583 13.0208 8 12.55 8 12V6C8 5.45 8.19583 4.97917 8.5875 4.5875C8.97917 4.19583 9.45 4 10 4H17C17.55 4 18.0208 4.19583 18.4125 4.5875C18.8042 4.97917 19 5.45 19 6V12C19 12.55 18.8042 13.0208 18.4125 13.4125C18.0208 13.8042 17.55 14 17 14H10ZM13 10.5C13.4333 10.5 13.7917 10.3583 14.075 10.075C14.3583 9.79167 14.5 9.43333 14.5 9C14.5 8.56667 14.3583 8.20833 14.075 7.925C13.7917 7.64167 13.4333 7.5 13 7.5C12.5667 7.5 12.2083 7.64167 11.925 7.925C11.6417 8.20833 11.5 8.56667 11.5 9C11.5 9.43333 11.6417 9.79167 11.925 10.075C12.2083 10.3583 12.5667 10.5 13 10.5Z"
                                    fill="rgb(219 234 254 / 1)"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-6xl font-bold text-white">
                        ₹{totals.balance.toLocaleString("en-IN")}
                    </h2>
                    <p className="flex items-center text-center content-center gap-1.5 text-blue-100 text-sm font-medium pt-2 pb-1">
                        {balanceChangeData.isPositive ? (
                            <svg
                                width="10"
                                height="6"
                                viewBox="0 0 10 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.7 6L0 5.3L3.7 1.575L5.7 3.575L8.3 1H7V0H10V3H9V1.7L5.7 5L3.7 3L0.7 6Z"
                                    fill="rgb(219 234 254 / 1)"
                                />
                            </svg>
                        ) : (
                            <svg
                                width="10"
                                height="6"
                                viewBox="0 0 10 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.7 0L0 0.7L3.7 4.425L5.7 2.425L8.3 5H7V6H10V3H9V4.3L5.7 1L3.7 3L0.7 0Z"
                                    fill="rgb(219 234 254 / 1)"
                                />
                            </svg>
                        )}
                        {balanceChangeData.text}
                    </p>
                </div>

                {/* Total Income Card */}
                <div
                    className={`p-6 rounded-2xl border transition-all duration-300 ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                            : "bg-white border-slate-200 hover:border-slate-300"
                    }`}>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <svg
                                width="50"
                                height="50"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <rect
                                    width="40"
                                    height="40"
                                    rx="20"
                                    fill="#10b981"
                                    fillOpacity="0.1"
                                />
                                <path
                                    d="M11.4 26L10 24.6L17.4 17.15L21.4 21.15L26.6 16H24V14H30V20H28V17.4L21.4 24L17.4 20L11.4 26Z"
                                    fill="#10b981"
                                />
                            </svg>

                            <div
                                className={`w-16 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                                    incomeChangeData.isPositive
                                        ? "text-emerald-400 bg-emerald-500/20"
                                        : "text-red-400 bg-red-500/20"
                                }`}>
                                {incomeChangeData.isPositive ? "+" : "-"}
                                {incomeChangeData.percentage}%
                            </div>
                        </div>
                        <div>
                            <p
                                className={`text-sm font-semibold tracking-wider mb-2 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }`}>
                                MONTHLY INCOME
                            </p>
                            <h3
                                className={`text-4xl font-bold mb-1 ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                ₹{totals.income.toLocaleString("en-IN")}
                            </h3>
                            <p
                                className={`text-xs ${
                                    isDarkMode
                                        ? "text-slate-500"
                                        : "text-slate-600"
                                }`}>
                                Current month total
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Expenses Card */}
                <div
                    className={`p-6 rounded-2xl border transition-all duration-300 ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700 hover:border-slate-600"
                            : "bg-white border-slate-200 hover:border-slate-300"
                    }`}>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <svg
                                width="50"
                                height="50"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <rect
                                    width="40"
                                    height="40"
                                    rx="20"
                                    fill="#ef4444"
                                    fillOpacity="0.1"
                                />
                                <path
                                    d="M24 26V24H26.6L21.4 18.85L17.4 22.85L10 15.4L11.4 14L17.4 20L21.4 16L28 22.6V20H30V26H24Z"
                                    fill="#ef4444"
                                />
                            </svg>

                            <div
                                className={`w-16 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                                    expenseChangeData.isPositive
                                        ? "text-emerald-400 bg-emerald-500/20"
                                        : "text-red-400 bg-red-500/20"
                                }`}>
                                {expenseChangeData.isPositive ? "-" : "+"}
                                {expenseChangeData.percentage}%
                            </div>
                        </div>
                        <div>
                            <p
                                className={`text-sm font-semibold tracking-wider mb-2 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }`}>
                                MONTHLY EXPENSES
                            </p>
                            <h3
                                className={`text-4xl font-bold mb-1 ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                ₹{totals.expense.toLocaleString("en-IN")}
                            </h3>
                            <p
                                className={`text-xs ${
                                    isDarkMode
                                        ? "text-slate-500"
                                        : "text-slate-600"
                                }`}>
                                Current month total
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Spending Chart */}
                <div
                    className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3
                            className={`text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Monthly Spending Trend
                        </h3>

                        {/* Filter Buttons - Only show when there's data */}
                        {allTransactions.length > 0 &&
                            availableFilters.length > 0 && (
                                <div className="flex gap-2">
                                    {availableFilters.map((months) => (
                                        <button
                                            key={months}
                                            onClick={() =>
                                                setMonthFilter(months)
                                            }
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                monthFilter === months
                                                    ? "bg-blue-600 text-white"
                                                    : isDarkMode
                                                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}>
                                            {months === "all"
                                                ? "ALL"
                                                : `${months}M`}
                                        </button>
                                    ))}
                                </div>
                            )}
                    </div>

                    {allTransactions.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={monthlyData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={gridColor}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    stroke={chartTextColor}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    stroke={chartTextColor}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) =>
                                        `₹${(value / 1000).toFixed(0)}k`
                                    }
                                />
                                <Tooltip
                                    formatter={(value) =>
                                        `₹${(value / 1000).toFixed(1)}k`
                                    }
                                    contentStyle={{
                                        backgroundColor: isDarkMode
                                            ? "#1e293b"
                                            : "#ffffff",
                                        border: isDarkMode
                                            ? "1px solid #334155"
                                            : "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        color: chartTextColor,
                                        boxShadow:
                                            "0 10px 15px -3px rgba(0,0,0,0.1)",
                                    }}
                                    cursor={false}
                                />
                                <Bar
                                    dataKey="spending"
                                    fill="#2563eb"
                                    radius={[8, 8, 0, 0]}
                                    isAnimationActive={false}
                                    {...{ "data-testid": "bar" }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <h4
                                    className={`text-lg font-semibold mb-2 ${
                                        isDarkMode
                                            ? "text-white"
                                            : "text-slate-900"
                                    }`}>
                                    No Transaction Data
                                </h4>
                                <p
                                    className={`text-center ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}>
                                    Add transactions or load a preset to see
                                    spending trends
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Category-wise Chart */}
                <div
                    className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3
                            className={`text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Category-wise Spending
                        </h3>

                        {/* Month Filter Buttons - Only show when there's data */}
                        {allTransactions.length > 0 && (
                            <div className="flex gap-2">
                                {lastSixMonths.map((month) => (
                                    <button
                                        key={month}
                                        onClick={() =>
                                            setCategoryMonthFilter(month)
                                        }
                                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                                            categoryMonthFilter === month
                                                ? "bg-blue-600 text-white"
                                                : isDarkMode
                                                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}>
                                        {month}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {allTransactions.length > 0 ? (
                        <div className="flex gap-6 h-80">
                            {/* Left Side - Legend with Amount (Scrollable without scrollbar) */}
                            <div
                                className="flex-1 space-y-1 pr-2 overflow-y-auto"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                }}>
                                <style>{`
                                div::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                                {categoryData
                                    .filter((entry) => entry.amount > 0)
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            onMouseEnter={() =>
                                                setHoveredCategory(index)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredCategory(null)
                                            }
                                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                                                hoveredCategory === index
                                                    ? isDarkMode
                                                        ? "bg-slate-700/50"
                                                        : "bg-slate-100"
                                                    : ""
                                            }`}>
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}></div>
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-sm font-medium ${
                                                        isDarkMode
                                                            ? "text-slate-200"
                                                            : "text-slate-700"
                                                    }`}>
                                                    {item.name}
                                                </p>
                                                <p
                                                    className={`text-xs ${
                                                        isDarkMode
                                                            ? "text-slate-500"
                                                            : "text-slate-500"
                                                    }`}>
                                                    {item.value}%
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p
                                                    className={`text-sm font-bold ${
                                                        isDarkMode
                                                            ? "text-white"
                                                            : "text-slate-900"
                                                    }`}>
                                                    ₹
                                                    {item.amount.toLocaleString(
                                                        "en-IN",
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Right Side - Chart */}
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData.filter(
                                                (entry) => entry.amount > 0,
                                            )}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={false}
                                            onMouseEnter={(_, index) =>
                                                setHoveredCategory(index)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredCategory(null)
                                            }>
                                            {categoryData
                                                .filter(
                                                    (entry) => entry.amount > 0,
                                                )
                                                .map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                        opacity={
                                                            hoveredCategory ===
                                                                null ||
                                                            hoveredCategory ===
                                                                index
                                                                ? 1
                                                                : 0.5
                                                        }
                                                        style={{
                                                            cursor: "pointer",
                                                            transition:
                                                                "opacity 0.2s",
                                                        }}
                                                    />
                                                ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `${value}%`}
                                            contentStyle={{
                                                backgroundColor: isDarkMode
                                                    ? "#1e293b"
                                                    : "#ffffff",
                                                border: isDarkMode
                                                    ? "1px solid #334155"
                                                    : "1px solid #e2e8f0",
                                                borderRadius: "8px",
                                                color: chartTextColor,
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center h-80">
                            <div className="text-center">
                                <h4
                                    className={`text-lg font-semibold mb-2 ${
                                        isDarkMode
                                            ? "text-white"
                                            : "text-slate-900"
                                    }`}>
                                    No Transaction Data
                                </h4>
                                <p
                                    className={`text-center ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}>
                                    Add transactions or load a preset to see
                                    category breakdown
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Transactions Section - Full Width */}
            <div
                className={`rounded-2xl border transition-all duration-300 ${
                    isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-200"
                }`}>
                {/* Header with Title and Filters */}
                <div
                    className="p-6 border-b"
                    style={{
                        borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                    }}>
                    <div className="flex items-center justify-between">
                        <h3
                            className={`text-2xl font-bold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Recent Transactions
                        </h3>

                        <div className="flex items-center gap-3">
                            {/* Filter Buttons */}
                            <div className="flex gap-2">
                                {["All", "Income", "Expenses"].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() =>
                                            setTransactionFilter(filter)
                                        }
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            transactionFilter === filter
                                                ? isDarkMode
                                                    ? "bg-slate-700 text-white"
                                                    : "bg-slate-100 text-slate-900"
                                                : isDarkMode
                                                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700/50"
                                                  : "bg-white text-slate-600 hover:bg-slate-50"
                                        }`}>
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table - Only show when there's data */}
                {allTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    className={`border-b ${
                                        isDarkMode
                                            ? "bg-slate-700/30 border-slate-700"
                                            : "bg-slate-50 border-slate-200"
                                    }`}>
                                    <th
                                        className={`text-left py-4 px-6 text-xs font-semibold tracking-wide ${
                                            isDarkMode
                                                ? "text-slate-400"
                                                : "text-slate-600"
                                        }`}>
                                        TRANSACTION NAME
                                    </th>
                                    <th
                                        className={`text-center py-4 px-6 text-xs font-semibold tracking-wide ${
                                            isDarkMode
                                                ? "text-slate-400"
                                                : "text-slate-600"
                                        }`}>
                                        DATE
                                    </th>
                                    <th
                                        className={`text-center py-4 px-6 text-xs font-semibold tracking-wide ${
                                            isDarkMode
                                                ? "text-slate-400"
                                                : "text-slate-600"
                                        }`}>
                                        CATEGORY
                                    </th>
                                    <th
                                        className={`text-center py-4 px-6 text-xs font-semibold tracking-wide ${
                                            isDarkMode
                                                ? "text-slate-400"
                                                : "text-slate-600"
                                        }`}>
                                        AMOUNT
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className={`border-b transition-all duration-200 ${
                                            isDarkMode
                                                ? "border-slate-700"
                                                : "border-slate-200"
                                        }`}>
                                        {/* Transaction Name with Icon */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                        isDarkMode
                                                            ? "bg-slate-700 text-slate-300"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                                    style={{
                                                        color: getCategoryById(
                                                            transaction.categoryId,
                                                        )?.color,
                                                    }}>
                                                    {(() => {
                                                        const IconComponent =
                                                            getCategoryIcon(
                                                                transaction.categoryId,
                                                            );
                                                        return (
                                                            <IconComponent />
                                                        );
                                                    })()}
                                                </div>
                                                <div>
                                                    <p
                                                        className={`font-semibold ${
                                                            isDarkMode
                                                                ? "text-white"
                                                                : "text-slate-900"
                                                        }`}>
                                                        {transaction.name}
                                                    </p>
                                                    <p
                                                        className={`text-sm ${
                                                            isDarkMode
                                                                ? "text-slate-400"
                                                                : "text-slate-500"
                                                        }`}>
                                                        {
                                                            transaction.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td
                                            className={`py-4 px-6 text-center ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                            {transaction.date}
                                        </td>

                                        {/* Category Badge */}
                                        <td className="py-4 px-6 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    transaction.type ===
                                                    "income"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : isDarkMode
                                                          ? "bg-slate-700 text-slate-300"
                                                          : "bg-slate-200 text-slate-700"
                                                }`}>
                                                {getCategoryName(
                                                    transaction.categoryId,
                                                )}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td
                                            className={`py-4 px-6 text-center font-bold text-lg ${
                                                transaction.type === "income"
                                                    ? "text-emerald-500"
                                                    : "text-red-500"
                                            }`}>
                                            {transaction.type === "income"
                                                ? "+"
                                                : "-"}
                                            ₹
                                            {transaction.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 flex items-center justify-center">
                        <div className="text-center">
                            <h4
                                className={`text-lg font-semibold mb-2 ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                No Transactions Yet
                            </h4>
                            <p
                                className={`text-center ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}>
                                Add your first transaction or load a preset to
                                get started
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer with View All Link - Always show if there's data */}
                {allTransactions.length > 0 && (
                    <div
                        className={`py-4 text-center border-t ${
                            isDarkMode ? "border-slate-700" : "border-slate-200"
                        }`}>
                        <button
                            onClick={() => navigate("/transactions")}
                            className={`font-semibold transition-all duration-200 ${
                                isDarkMode
                                    ? "text-blue-400 hover:text-blue-500"
                                    : "text-blue-600 hover:text-blue-700"
                            }`}>
                            View All Transactions
                        </button>
                    </div>
                )}
            </div>

            {/* Smart Insights Section */}
            <div>
                <h2
                    className={`text-2xl font-bold mb-6 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                    }`}>
                    Smart Insights
                </h2>

                {allTransactions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Insight Card 1 - Spending Category */}
                        <div
                            className={`p-6 rounded-2xl border transition-all duration-300 ${
                                isDarkMode
                                    ? "bg-slate-800 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}>
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                                style={{
                                    backgroundColor: "#2563eb",
                                    opacity: 0.2,
                                }}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="2">
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <path d="M12 1v6m8.66 1.34l-4.24 4.24M23 12h-6m1.34 8.66l-4.24-4.24M12 23v-6m-8.66-1.34l4.24-4.24M1 12h6M5.34 5.34l4.24 4.24" />
                                </svg>
                            </div>
                            <h3
                                className={`text-sm font-semibold tracking-wide mb-3 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }`}>
                                TOP SPENDING CATEGORY
                            </h3>
                            <p
                                className={`text-xl font-bold mb-3 ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                {generateSpendingInsight().title}
                            </p>
                            <p
                                className={`text-sm mb-4 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}>
                                {generateSpendingInsight().description}
                            </p>
                            {topCategory && (
                                <div className="flex flex-col gap-2">
                                    <a
                                        href={
                                            getResourcesForCategory(
                                                topCategory.categoryId,
                                            ).video
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm">
                                        Watch video tips
                                    </a>
                                    <a
                                        href={
                                            getResourcesForCategory(
                                                topCategory.categoryId,
                                            ).blog
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm">
                                        Read detailed guide
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Insight Card 2 - Savings Rate */}
                        <div
                            className={`p-6 rounded-2xl border transition-all duration-300 ${
                                isDarkMode
                                    ? "bg-slate-800 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}>
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                                style={{
                                    backgroundColor: "#059669",
                                    opacity: 0.2,
                                }}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#059669"
                                    strokeWidth="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </div>
                            <h3
                                className={`text-sm font-semibold tracking-wide mb-3 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }`}>
                                SAVINGS RATE
                            </h3>
                            <p
                                className={`text-xl font-bold mb-3 ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                {generateSavingsInsight().title}
                            </p>
                            <p
                                className={`text-sm mb-4 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}>
                                {generateSavingsInsight().description}
                            </p>
                            <div className="flex flex-col gap-2">
                                <a
                                    href="https://www.youtube.com/results?search_query=personal+finance+savings+tips+budgeting"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold text-sm">
                                    Savings strategies
                                </a>
                                <a
                                    href="https://www.nerdwallet.com/article/finance/how-to-save-money"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold text-sm">
                                    Complete guide
                                </a>
                            </div>
                        </div>

                        {/* Insight Card 3 - Budgeting Tips */}
                        <div
                            className={`p-6 rounded-2xl border transition-all duration-300 ${
                                isDarkMode
                                    ? "bg-slate-800 border-slate-700"
                                    : "bg-white border-slate-200"
                            }`}>
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                                style={{
                                    backgroundColor: "#f59e0b",
                                    opacity: 0.2,
                                }}>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                            </div>
                            <h3
                                className={`text-sm font-semibold tracking-wide mb-3 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }`}>
                                BUDGETING STRATEGY
                            </h3>
                            <p
                                className={`text-xl font-bold mb-3 ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                {generateBudgetingInsight().title}
                            </p>
                            <p
                                className={`text-sm mb-4 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}>
                                {generateBudgetingInsight().description}
                            </p>
                            <div className="flex flex-col gap-2">
                                <a
                                    href="https://www.youtube.com/results?search_query=50+30+20+budgeting+rule+explained"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-semibold text-sm">
                                    Budgeting methods
                                </a>
                                <a
                                    href="https://www.thebalancemoney.com/the-50-30-20-rule-of-thumb-453922"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-semibold text-sm">
                                    Learn 50/30/20 rule
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="py-12 flex items-center justify-center rounded-2xl border"
                        style={{
                            borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                            backgroundColor: isDarkMode ? "#1e293b" : "#f8fafc",
                        }}>
                        <div className="text-center">
                            <h4
                                className={`text-lg font-semibold mb-2 ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                No Insights Available
                            </h4>
                            <p
                                className={`text-center ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}>
                                Start adding transactions to get personalized
                                financial insights
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
