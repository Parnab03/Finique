import { useContext, useEffect, useRef, useState, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../Context/ThemeContext";
import { RoleContext } from "../../Context/RoleContext";
import { TransactionContext } from "../../Context/TransactionContext";
import ManageGoalsModal from "./ManageGoalsModal";
import {
    calculateWeeklyData,
    getLastSixMonths,
} from "../../utils/dataCalculations";

const Insights = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const { selectedRole } = useContext(RoleContext);
    const { allTransactions } = useContext(TransactionContext);
    const [selectedMonth, setSelectedMonth] = useState("JUN");
    const [selectedGoalsMonth, setSelectedGoalsMonth] = useState("JUN");
    const [isManageGoalsOpen, setIsManageGoalsOpen] = useState(false);
    const [selectedExportMonth, setSelectedExportMonth] = useState("JUN");
    const [chatInput, setChatInput] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const chatEndRef = useRef(null);
    const chatScrollTriggeredRef = useRef(false);
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            role: "assistant",
            text: "Hi! I am your finance assistant. Ask me about saving, spending, goals, or budgeting.",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        },
    ]);

    const availableMonths = useMemo(
        () => getLastSixMonths(allTransactions),
        [allTransactions],
    );

    // Set initial month to last available month from data
    useEffect(() => {
        if (
            availableMonths.length > 0 &&
            availableMonths[availableMonths.length - 1]
        ) {
            setSelectedMonth(availableMonths[availableMonths.length - 1]);
            setSelectedExportMonth(availableMonths[availableMonths.length - 1]);
        }
    }, [availableMonths]);

    const chartData = useMemo(
        () => calculateWeeklyData(allTransactions, selectedMonth),
        [allTransactions, selectedMonth],
    );

    const lastSixMonths = useMemo(() => availableMonths, [availableMonths]);

    // Load savings goals from student-budget.json preset
    const [savingsGoalsData, setSavingsGoalsData] = useState({});
    const [baseGoals, setBaseGoals] = useState([]);

    useEffect(() => {
        const loadGoalsFromPreset = async () => {
            try {
                // Get current preset selection
                const settings = localStorage.getItem("finique_settings_v1");
                let currentPreset = "no-presets"; // DEFAULT to no-presets

                if (settings) {
                    try {
                        const parsedSettings = JSON.parse(settings);
                        currentPreset =
                            parsedSettings.selectedPreset || "no-presets";
                    } catch (err) {
                        console.error("Failed to parse settings:", err);
                    }
                }

                // If user has selected "No Presets", don't load any goals
                if (currentPreset === "no-presets") {
                    setBaseGoals([]);
                    return;
                }

                // For other presets, try to get stored goals from localStorage first
                const storedGoals = localStorage.getItem("finique_goals");
                if (storedGoals) {
                    try {
                        const goals = JSON.parse(storedGoals);
                        setBaseGoals(goals);
                    } catch (err) {
                        console.error("Failed to parse stored goals:", err);
                    }
                    return;
                }

                // If not in localStorage, fetch from the selected preset
                const response = await fetch(`/presets/${currentPreset}.json`);
                if (response.ok) {
                    const preset = await response.json();
                    if (preset.goals && Array.isArray(preset.goals)) {
                        setBaseGoals(preset.goals);
                        localStorage.setItem(
                            "finique_goals",
                            JSON.stringify(preset.goals),
                        );
                    }
                }
            } catch (error) {
                console.error("Error loading goals:", error);
            }
        };

        loadGoalsFromPreset();
    }, []);

    // Apply base goals to all available months
    useEffect(() => {
        if (availableMonths.length > 0 && baseGoals.length > 0) {
            const goalsDataByMonth = {};
            availableMonths.forEach((month) => {
                goalsDataByMonth[month] = baseGoals;
            });
            setSavingsGoalsData(goalsDataByMonth);

            // Set initial selected month to last available month
            setSelectedGoalsMonth(availableMonths[availableMonths.length - 1]);
        } else if (availableMonths.length === 0 && baseGoals.length > 0) {
            // Only clear if there's data to clear (avoid unnecessary updates)
            setBaseGoals([]);
            setSavingsGoalsData({});
        }
    }, [availableMonths]);

    const savingsGoals =
        savingsGoalsData[selectedGoalsMonth] || baseGoals || [];

    const handleSaveGoals = (updatedGoals) => {
        setSavingsGoalsData((prev) => ({
            ...prev,
            [selectedGoalsMonth]: updatedGoals,
        }));
    };

    // Calculate total spending by category from transactions
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

    const averageGoalProgress =
        savingsGoals.length > 0
            ? Math.round(
                  savingsGoals.reduce(
                      (sum, goal) => sum + (goal.current / goal.target) * 100,
                      0,
                  ) / savingsGoals.length,
              )
            : 0;

    // Calculate monthly comparison
    const getMonthlyExpenses = (month) => {
        return allTransactions
            .filter(
                (tx) =>
                    tx.type === "expense" &&
                    tx.date &&
                    tx.date.substring(0, 3).toUpperCase() ===
                        month.toUpperCase(),
            )
            .reduce((sum, tx) => sum + tx.amount, 0);
    };

    const currentMonthExpense = getMonthlyExpenses(selectedMonth);
    const previousMonthIndex = lastSixMonths.indexOf(selectedMonth) - 1;
    const previousMonthExpense =
        previousMonthIndex >= 0
            ? getMonthlyExpenses(lastSixMonths[previousMonthIndex])
            : null;

    const monthlyComparison =
        previousMonthExpense !== null
            ? ((currentMonthExpense - previousMonthExpense) /
                  previousMonthExpense) *
              100
            : null;

    // Calculate spending rate percentage
    const spendingRate =
        totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

    // Calculate average transaction
    const avgTransaction =
        allTransactions.length > 0
            ? Math.round(totalExpense / allTransactions.length)
            : 0;

    // Calculate top 3 categories
    const topThreeCategories = [...categorySpending]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

    // Generate useful observations
    const generateObservation = () => {
        if (allTransactions.length === 0) {
            return "Start tracking transactions to unlock personalized insights.";
        }

        if (spendingRate > 80) {
            return `High spending alert! You're spending ${spendingRate}% of your income. Consider cutting back non-essential expenses.`;
        }

        if (spendingRate < 40 && totalIncome > 0) {
            return `Great discipline! You're only spending ${spendingRate}% of income and saving ${100 - spendingRate}%.`;
        }

        if (monthlyComparison !== null && monthlyComparison > 20) {
            return `Spending increased by ${Math.round(Math.abs(monthlyComparison))}% vs last month. Watch your expenses!`;
        }

        if (monthlyComparison !== null && monthlyComparison < -20) {
            return `Great savings! Spending decreased by ${Math.round(Math.abs(monthlyComparison))}% compared to last month.`;
        }

        if (topCategory) {
            const topCategoryPercentage = Math.round(
                (topCategory.amount / totalExpense) * 100,
            );
            return `${topCategory.categoryId} accounts for ${topCategoryPercentage}% of your spending. Largest expense category.`;
        }

        return "Keep track of more transactions to unlock deeper insights.";
    };

    const aiInsights = [
        totalExpense > 0
            ? `Total Expense: ₹${totalExpense.toLocaleString()} | You're spending ${spendingRate}% of your income`
            : "No expenses tracked yet. Add transactions to unlock stronger insights.",
        topCategory
            ? `Highest Spending: ${topCategory.categoryId} (₹${topCategory.amount.toLocaleString()}) - ${Math.round((topCategory.amount / totalExpense) * 100)}% of total`
            : "No category trend yet. Start logging expenses by category.",
        monthlyComparison !== null
            ? `Monthly Comparison: ${monthlyComparison > 0 ? "↑ Increased" : "↓ Decreased"} by ${Math.round(Math.abs(monthlyComparison))}% vs last month (${previousMonthExpense > 0 ? `₹${previousMonthExpense.toLocaleString()}` : "N/A"})`
            : "Add more months of data for monthly comparisons.",
        totalIncome > 0
            ? `Net Balance: ₹${netBalance.toLocaleString()} (Income: ₹${totalIncome.toLocaleString()})`
            : "No income tracked yet. Add income transactions.",
        allTransactions.length > 0
            ? `Average Transaction: ₹${avgTransaction.toLocaleString()} across ${allTransactions.length} transactions`
            : "Track more transactions to see spending patterns.",
        savingsGoals.length > 0
            ? `Savings Goals: ${averageGoalProgress}% complete on average | You have ${savingsGoals.length} active goals`
            : "Create savings goals to track your financial targets.",
        generateObservation(),
    ];

    const buildAssistantReply = (message) => {
        const q = message.toLowerCase();

        if (q.includes("save") || q.includes("saving")) {
            return "Use this plan: automate a monthly transfer on salary day, cap one high-spend category, and increase your target savings by 5% every 2 months.";
        }
        if (q.includes("expense") || q.includes("spending")) {
            return topCategory
                ? `Your top spending is ${topCategory.categoryId}. Try reducing it by 10-15% this month for quick impact.`
                : "I need more transaction data to detect your biggest spending pattern.";
        }
        if (q.includes("goal")) {
            return `Your average goal progress is ${averageGoalProgress}%. Prioritize 1 goal for the next 30 days and fund it first.`;
        }
        if (q.includes("income")) {
            return `Income: ₹${totalIncome.toLocaleString()}, Expense: ₹${totalExpense.toLocaleString()}, Net: ₹${netBalance.toLocaleString()}.`;
        }

        return "I can help with budgeting, goal planning, debt reduction, and category optimization. Ask a specific finance question.";
    };

    const handleChatSend = (presetText) => {
        chatScrollTriggeredRef.current = true; // Enable scrolling ONLY after user action
        const text = (presetText ?? chatInput).trim();
        if (!text) return;

        const userMessage = {
            id: Date.now(),
            role: "user",
            text,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setChatMessages((prev) => [...prev, userMessage]);
        setChatInput("");
        setIsBotTyping(true);

        setTimeout(() => {
            const assistantMessage = {
                id: Date.now() + 1,
                role: "assistant",
                text: buildAssistantReply(text),
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setChatMessages((prev) => [...prev, assistantMessage]);
            setIsBotTyping(false);
        }, 600);
    };

    const handleClearChat = () => {
        chatScrollTriggeredRef.current = false; // Disable scroll on clear
        setChatMessages([
            {
                id: 1,
                role: "assistant",
                text: "Chat reset. Ask me anything about your finance.",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);
    };

    const exportAsPdf = () => {
        // Get chart data for SELECTED MONTH ONLY
        const selectedMonthChartData = calculateWeeklyData(
            allTransactions,
            selectedExportMonth,
        );

        // Filter transactions for selected export month ONLY
        const monthTransactions = allTransactions.filter(
            (tx) =>
                tx.date &&
                tx.date.substring(0, 3).toUpperCase() ===
                    selectedExportMonth.toUpperCase(),
        );

        // Use overall category spending from dashboard (not month-specific)
        const dashboardCategorySpending = categorySpending;

        // Prepare transaction rows (ONLY for selected month)
        const rows = monthTransactions
            .map(
                (t) =>
                    `<tr>
                        <td style="padding:8px;border:1px solid #ddd;">${t.date || "-"}</td>
                        <td style="padding:8px;border:1px solid #ddd;">${t.type || "-"}</td>
                        <td style="padding:8px;border:1px solid #ddd;">${t.categoryId || "-"}</td>
                        <td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${Number(
                            t.amount || 0,
                        ).toLocaleString()}</td>
                    </tr>`,
            )
            .join("");

        // Prepare Monthly Spending Trends rows (SELECTED MONTH ONLY)
        const monthlyTrendRows = selectedMonthChartData
            .map(
                (d) =>
                    `<tr>
                        <td style="padding:8px;border:1px solid #ddd;">${d.month || "-"}</td>
                        <td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${Number(
                            d.amount || 0,
                        ).toLocaleString()}</td>
                    </tr>`,
            )
            .join("");

        // Prepare Category-wise Spending rows (from dashboard - sorted by amount, descending)
        const categoryRows = [...dashboardCategorySpending]
            .sort((a, b) => b.amount - a.amount)
            .map(
                (c) =>
                    `<tr>
                        <td style="padding:8px;border:1px solid #ddd;">${c.categoryId || "-"}</td>
                        <td style="padding:8px;border:1px solid #ddd;text-align:right;">₹${Number(
                            c.amount || 0,
                        ).toLocaleString()}</td>
                        <td style="padding:8px;border:1px solid #ddd;text-align:right;">${
                            totalExpense > 0
                                ? Math.round((c.amount / totalExpense) * 100)
                                : 0
                        }%</td>
                    </tr>`,
            )
            .join("");

        const win = window.open("", "_blank", "width=1000,height=800");
        if (!win) return;

        win.document.write(`
            <html>
            <head>
                <title>Finique Financial Report - ${selectedExportMonth}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 24px; }
                    h2 { margin-top: 30px; margin-bottom: 15px; page-break-after: avoid; }
                    table { border-collapse: collapse; width: 100%; font-size: 14px; margin-bottom: 20px; }
                    th { background-color: #f0f0f0; padding: 10px; border: 1px solid #ddd; text-align: left; }
                    tr:nth-child(even) { background-color: #fafafa; }
                    .month-header { background-color: #e8f0ff; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
                </style>
            </head>
            <body>
                <h1 style="margin-bottom:8px;">Finique Financial Report</h1>
                <p style="margin:0 0 5px;font-size:12px;">Generated on: ${new Date().toLocaleString()}</p>
                <p style="margin:0 0 20px;font-size:12px;">Currency: INR</p>
                
                <div class="month-header">
                    <p style="margin:0;font-weight:bold;font-size:14px;">Report Period: ${selectedExportMonth} 2024</p>
                </div>

                ${
                    selectedMonthChartData.length > 0
                        ? `
                <h2>Monthly Spending Trends - ${selectedExportMonth}</h2>
                <table>
                    <thead>
                        <tr>
                            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Week</th>
                            <th style="padding:10px;border:1px solid #ddd;text-align:right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>${monthlyTrendRows}</tbody>
                </table>
                `
                        : ""
                }

                ${
                    dashboardCategorySpending.length > 0
                        ? `
                <h2>Category-wise Spending</h2>
                <table>
                    <thead>
                        <tr>
                            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Category</th>
                            <th style="padding:10px;border:1px solid #ddd;text-align:right;">Amount</th>
                            <th style="padding:10px;border:1px solid #ddd;text-align:right;">% of Total</th>
                        </tr>
                    </thead>
                    <tbody>${categoryRows}</tbody>
                </table>
                `
                        : ""
                }

                ${
                    rows
                        ? `
                <h2>Transactions for ${selectedExportMonth}</h2>
                <table>
                    <thead>
                        <tr>
                            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Date</th>
                            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Type</th>
                            <th style="padding:10px;border:1px solid #ddd;text-align:left;">Category</th>
                            <th style="padding:10px;border:1px solid #ddd;text-align:right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
                `
                        : ""
                }
            </body>
            </html>
        `);

        win.document.close();
        win.focus();
        win.print();
    };

    useEffect(() => {
        if (chatScrollTriggeredRef.current) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages, isBotTyping]);

    const quickPrompts = [
        "How can I save more each month?",
        "Where am I overspending?",
        "What should be my emergency fund target?",
        "How do I improve goal completion?",
    ];

    return (
        <div className={`p-4 sm:p-8 space-y-8`}>
            {/* Top row: Weekly + Monthly side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Spending Trends */}
                <div
                    className={`xl:col-span-2 rounded-2xl p-3 sm:p-6 border transition-all duration-300 flex flex-col ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                        <h3
                            className={`text-base sm:text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Monthly Spending Trends
                        </h3>

                        {allTransactions.length > 0 && (
                            <div className="flex gap-1 sm:gap-2 flex-wrap">
                                {lastSixMonths.map((month) => (
                                    <button
                                        key={month}
                                        onClick={() => setSelectedMonth(month)}
                                        className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                            selectedMonth === month
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
                        <div className="w-full py-2 min-h-48 sm:min-h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 40,
                                        left: 10,
                                        bottom: 0,
                                    }}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={
                                            isDarkMode ? "#475569" : "#e2e8f0"
                                        }
                                    />
                                    <XAxis
                                        dataKey="month"
                                        stroke={
                                            isDarkMode ? "#94a3b8" : "#64748b"
                                        }
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 600,
                                        }}
                                    />
                                    <YAxis
                                        stroke={
                                            isDarkMode ? "#94a3b8" : "#64748b"
                                        }
                                        style={{
                                            fontSize: "12px",
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDarkMode
                                                ? "#1e293b"
                                                : "#ffffff",
                                            border: `1px solid ${
                                                isDarkMode
                                                    ? "#475569"
                                                    : "#e2e8f0"
                                            }`,
                                            borderRadius: "0.5rem",
                                        }}
                                        labelStyle={{
                                            color: isDarkMode
                                                ? "#e2e8f0"
                                                : "#1e293b",
                                        }}
                                        formatter={(value) =>
                                            `₹${value.toLocaleString()}`
                                        }
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{
                                            fill: "#2563eb",
                                            r: 6,
                                        }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
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

                {/* Monthly Goals */}
                <div
                    className={`rounded-2xl p-4 sm:p-6 border transition-all duration-300 flex flex-col h-auto sm:h-[450px] ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2
                            className={`text-base sm:text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Monthly Goals
                        </h2>
                    </div>

                    {savingsGoals.length > 0 ? (
                        <>
                            <div
                                className="flex-1 overflow-y-auto pr-2 sm:pr-3"
                                style={{
                                    scrollbarWidth: "none",
                                    msOverflowStyle: "none",
                                }}>
                                <style>{`
                                    ::-webkit-scrollbar {
                                        width: 0px;
                                    }
                                `}</style>
                                <div className="space-y-4 sm:space-y-8">
                                    {savingsGoals.map((goal) => (
                                        <div
                                            key={goal.id}
                                            className="flex flex-col">
                                            <div className="flex justify-between items-baseline mb-2 sm:mb-2 gap-2">
                                                <h3
                                                    className={`font-semibold text-sm sm:text-base truncate ${
                                                        isDarkMode
                                                            ? "text-slate-100"
                                                            : "text-slate-900"
                                                    }`}>
                                                    {goal.title}
                                                </h3>
                                                <span
                                                    className={`text-xs sm:text-sm font-bold flex-shrink-0 ${
                                                        isDarkMode
                                                            ? "text-slate-300"
                                                            : "text-slate-700"
                                                    }`}>
                                                    ₹
                                                    {goal.current.toLocaleString()}{" "}
                                                    / ₹
                                                    {goal.target.toLocaleString()}
                                                </span>
                                            </div>

                                            <div
                                                className={`w-full h-2 sm:h-3 rounded-full overflow-hidden ${
                                                    isDarkMode
                                                        ? "bg-slate-700"
                                                        : "bg-slate-200"
                                                }`}>
                                                <div
                                                    className="h-full transition-all duration-300 rounded-full"
                                                    style={{
                                                        width: `${(
                                                            (goal.current /
                                                                goal.target) *
                                                            100
                                                        ).toFixed(0)}%`,
                                                        backgroundColor:
                                                            goal.color,
                                                    }}
                                                />
                                            </div>

                                            <p
                                                className={`text-xs font-semibold mt-2 ${
                                                    isDarkMode
                                                        ? "text-slate-400"
                                                        : "text-slate-500"
                                                }`}>
                                                {(
                                                    (goal.current /
                                                        goal.target) *
                                                    100
                                                ).toFixed(0)}
                                                % completed
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedRole !== "Viewer" && (
                                <button
                                    onClick={() => setIsManageGoalsOpen(true)}
                                    className={`w-full mt-4 sm:mt-6 py-2 sm:py-3 text-sm sm:text-base font-bold rounded-lg border-2 transition-all duration-200 ${
                                        isDarkMode
                                            ? "border-slate-700 text-slate-300 hover:bg-slate-700"
                                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                    }`}>
                                    MANAGE TARGETS
                                </button>
                            )}
                            {selectedRole === "Viewer" && (
                                <div
                                    className={`w-full text-center text-xs sm:text-sm py-3 sm:py-4 px-3 rounded-lg font-semibold mt-4 sm:mt-6 ${isDarkMode ? "bg-slate-700/50 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                                    Read-only Access
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                                    style={{
                                        backgroundColor: isDarkMode
                                            ? "#475569"
                                            : "#e2e8f0",
                                    }}>
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke={
                                            isDarkMode ? "#94a3b8" : "#64748b"
                                        }
                                        strokeWidth="2">
                                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01M9 16h.01"></path>
                                    </svg>
                                </div>
                                <h3
                                    className={`font-semibold mb-2 ${
                                        isDarkMode
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }`}>
                                    No Goals Set
                                </h3>
                                <p
                                    className={`text-sm mb-4 ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}>
                                    {selectedRole === "Viewer"
                                        ? "View goals when your administrator creates them"
                                        : "Create goals to track your savings targets"}
                                </p>
                                {selectedRole !== "Viewer" && (
                                    <button
                                        onClick={() =>
                                            setIsManageGoalsOpen(true)
                                        }
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                                        Create Goal
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Expandable Card for Manage Goals */}
            <ManageGoalsModal
                isOpen={isManageGoalsOpen}
                onClose={() => setIsManageGoalsOpen(false)}
                existingGoals={savingsGoals}
                onSaveGoals={handleSaveGoals}
            />

            {/* Bottom row: Chat + AI Insights side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Chat Section */}
                <div
                    className={`rounded-2xl border transition-all duration-300 flex flex-col ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}>
                    <div className="p-3 sm:p-6 pb-1 sm:pb-2">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <p
                                    className={`text-xs font-bold tracking-wider mb-1 sm:mb-2 ${
                                        isDarkMode
                                            ? "text-blue-400"
                                            : "text-blue-600"
                                    }`}>
                                    AI CHATBOT
                                </p>
                                <h2
                                    className={`text-base sm:text-lg font-semibold ${
                                        isDarkMode
                                            ? "text-white"
                                            : "text-slate-900"
                                    }`}>
                                    Talk to Your Finance Assistant
                                </h2>
                            </div>
                            {selectedRole !== "Viewer" && (
                                <button
                                    onClick={handleClearChat}
                                    className={`text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border flex-shrink-0 ${
                                        isDarkMode
                                            ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                                            : "border-slate-300 text-slate-600 hover:bg-slate-100"
                                    }`}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-3 sm:p-6 pt-2 sm:pt-4 flex flex-col gap-3 sm:gap-4">
                        {selectedRole !== "Viewer" && (
                            <>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {quickPrompts.map((prompt) => (
                                        <button
                                            key={prompt}
                                            onClick={() =>
                                                handleChatSend(prompt)
                                            }
                                            className={`text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all ${
                                                isDarkMode
                                                    ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                                                    : "border-slate-300 text-slate-600 hover:bg-slate-100"
                                            }`}>
                                            {prompt}
                                        </button>
                                    ))}
                                </div>

                                <div className="h-[320px] overflow-y-auto space-y-3 pr-1">
                                    {chatMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`max-w-[85%] p-3 rounded-xl ${
                                                msg.role === "user"
                                                    ? "ml-auto bg-blue-600 text-white"
                                                    : isDarkMode
                                                      ? "bg-slate-700 text-slate-200"
                                                      : "bg-slate-100 text-slate-700"
                                            }`}>
                                            <p className="text-sm leading-relaxed">
                                                {msg.text}
                                            </p>
                                            <p
                                                className={`text-[10px] mt-1 ${
                                                    msg.role === "user"
                                                        ? "text-blue-100"
                                                        : isDarkMode
                                                          ? "text-slate-400"
                                                          : "text-slate-500"
                                                }`}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    ))}
                                    {isBotTyping && (
                                        <div
                                            className={`max-w-[85%] p-3 rounded-xl text-sm ${
                                                isDarkMode
                                                    ? "bg-slate-700 text-slate-300"
                                                    : "bg-slate-100 text-slate-600"
                                            }`}>
                                            Assistant is typing...
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) =>
                                            setChatInput(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            handleChatSend()
                                        }
                                        placeholder="Ask about budget, savings, goals..."
                                        className={`flex-1 p-2 sm:p-3 rounded-lg border text-sm ${
                                            isDarkMode
                                                ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
                                                : "bg-slate-50 border-slate-300 text-slate-700 placeholder-slate-500"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    <button
                                        onClick={() => handleChatSend()}
                                        disabled={!chatInput.trim()}
                                        className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                                            chatInput.trim()
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-slate-400 text-white cursor-not-allowed"
                                        }`}>
                                        Send
                                    </button>
                                </div>
                            </>
                        )}
                        {selectedRole === "Viewer" && (
                            <div className="h-56 sm:h-[420px] flex flex-col items-center justify-center p-4 sm:p-0">
                                <div className="text-center space-y-4">
                                    <div className="p-3 sm:p-4 rounded-full bg-slate-700/30 w-fit mx-auto">
                                        <svg
                                            className={`w-6 h-6 sm:w-8 sm:h-8 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24">
                                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p
                                            className={`text-sm font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                                            Read-only Access
                                        </p>
                                        <p
                                            className={`text-xs mt-2 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                                            Chatbot features are not available
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Insights */}
                <div
                    className={`rounded-2xl border transition-all duration-300 flex flex-col ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}>
                    <div className="p-3 sm:p-6 pb-1 sm:pb-2">
                        <p
                            className={`text-xs font-bold tracking-wider mb-1 sm:mb-2 ${
                                isDarkMode
                                    ? "text-emerald-400"
                                    : "text-emerald-600"
                            }`}>
                            AI INSIGHTS
                        </p>
                        <h2
                            className={`text-base sm:text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Smart Finance Insights
                        </h2>
                    </div>

                    <div className="p-3 sm:p-6 space-y-2 sm:space-y-3">
                        {aiInsights.map((insight, idx) => (
                            <div
                                key={idx}
                                className={`p-3 sm:p-4 rounded-lg border text-sm ${
                                    isDarkMode
                                        ? "bg-slate-700 border-slate-600 text-slate-200"
                                        : "bg-slate-50 border-slate-200 text-slate-700"
                                }`}>
                                {insight}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className={`rounded-2xl border p-3 sm:p-6 transition-all duration-300 ${
                    isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-200"
                }`}>
                <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p
                            className={`text-xs font-bold tracking-wider mb-1 sm:mb-1 ${
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}>
                            EXPORT
                        </p>
                        <h3
                            className={`text-base sm:text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Export Financial Data
                        </h3>
                        <p
                            className={`text-xs sm:text-sm mt-1 ${
                                isDarkMode ? "text-slate-300" : "text-slate-600"
                            }`}>
                            Download a printable PDF report with totals and
                            transactions.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                        {lastSixMonths.length > 0 && (
                            <div className="flex flex-col">
                                <select
                                    id="exportMonthSelect"
                                    value={selectedExportMonth}
                                    onChange={(e) =>
                                        setSelectedExportMonth(e.target.value)
                                    }
                                    className={`appearance-none px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 rounded-lg text-xs sm:text-sm font-medium transition-all border cursor-pointer ${
                                        isDarkMode
                                            ? "bg-slate-700 border-slate-600 text-slate-100 hover:border-slate-500 focus:border-blue-500"
                                            : "bg-white border-slate-300 text-slate-700 hover:border-slate-400 focus:border-blue-500"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0`}
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23${isDarkMode ? "94a3b8" : "64748b"}' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "right 8px center",
                                        paddingRight: "24px",
                                    }}>
                                    {lastSixMonths.map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={exportAsPdf}
                            disabled={selectedRole === "Viewer"}
                            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all h-fit ${
                                selectedRole === "Viewer"
                                    ? "bg-slate-400 text-white cursor-not-allowed opacity-50"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}>
                            Export as PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
