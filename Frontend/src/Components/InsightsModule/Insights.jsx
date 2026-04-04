import { useContext, useEffect, useRef, useState } from "react";
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
import { TransactionContext } from "../../Context/TransactionContext";
import ManageGoalsModal from "./ManageGoalsModal";

const Insights = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const { allTransactions } = useContext(TransactionContext);
    const [selectedMonth, setSelectedMonth] = useState("JUN");
    const [selectedGoalsMonth, setSelectedGoalsMonth] = useState("JUN");
    const [isManageGoalsOpen, setIsManageGoalsOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const chatEndRef = useRef(null);
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

    // Last 6 months data with weekly breakdown
    const monthsData = {
        JAN: [
            { month: "JAN W1", amount: 2200 },
            { month: "JAN W2", amount: 2400 },
            { month: "JAN W3", amount: 2100 },
            { month: "JAN W4", amount: 2150 },
        ],
        FEB: [
            { month: "FEB W1", amount: 2500 },
            { month: "FEB W2", amount: 2600 },
            { month: "FEB W3", amount: 2400 },
            { month: "FEB W4", amount: 2450 },
        ],
        MAR: [
            { month: "MAR W1", amount: 2400 },
            { month: "MAR W2", amount: 2350 },
            { month: "MAR W3", amount: 2500 },
            { month: "MAR W4", amount: 2300 },
        ],
        APR: [
            { month: "APR W1", amount: 2400 },
            { month: "APR W2", amount: 2600 },
            { month: "APR W3", amount: 2300 },
            { month: "APR W4", amount: 2200 },
        ],
        MAY: [
            { month: "MAY W1", amount: 3200 },
            { month: "MAY W2", amount: 3100 },
            { month: "MAY W3", amount: 3300 },
            { month: "MAY W4", amount: 3000 },
        ],
        JUN: [
            { month: "JUN W1", amount: 2800 },
            { month: "JUN W2", amount: 2900 },
            { month: "JUN W3", amount: 2700 },
            { month: "JUN W4", amount: 2800 },
        ],
    };

    const chartData = monthsData[selectedMonth];
    const lastSixMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];

    // Savings goals data - NOW MUTABLE
    const [savingsGoalsData, setSavingsGoalsData] = useState({
        APR: [
            {
                id: 1,
                title: "Down Payment Fund",
                current: 10200,
                target: 20000,
                color: "#2563eb",
            },
            {
                id: 2,
                title: "Emergency Reserve",
                current: 4200,
                target: 5000,
                color: "#16a34a",
            },
            {
                id: 3,
                title: "Vacation Fund",
                current: 5800,
                target: 10000,
                color: "#f59e0b",
            },
        ],
        MAY: [
            {
                id: 1,
                title: "Down Payment Fund",
                current: 11300,
                target: 20000,
                color: "#2563eb",
            },
            {
                id: 2,
                title: "Emergency Reserve",
                current: 4600,
                target: 5000,
                color: "#16a34a",
            },
            {
                id: 3,
                title: "Vacation Fund",
                current: 6500,
                target: 10000,
                color: "#f59e0b",
            },
        ],
        JUN: [
            {
                id: 1,
                title: "Down Payment Fund",
                current: 12400,
                target: 20000,
                color: "#2563eb",
            },
            {
                id: 2,
                title: "Emergency Reserve",
                current: 4900,
                target: 5000,
                color: "#16a34a",
            },
            {
                id: 3,
                title: "Vacation Fund",
                current: 7200,
                target: 10000,
                color: "#f59e0b",
            },
        ],
    });

    const savingsGoals = savingsGoalsData[selectedGoalsMonth];
    const lastThreeMonths = ["APR", "MAY", "JUN"];

    // Handle saving goals from modal
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

    const aiInsights = [
        totalExpense > 0
            ? `You spent ₹${totalExpense.toLocaleString()} this cycle.`
            : "No expenses tracked yet. Add transactions to unlock stronger insights.",
        topCategory
            ? `Highest spend category: ${topCategory.categoryId} (₹${topCategory.amount.toLocaleString()}).`
            : "No category trend yet. Start logging expenses by category.",
        `Average savings goal completion: ${averageGoalProgress}%.`,
        netBalance >= 0
            ? `Net balance is positive: ₹${netBalance.toLocaleString()}.`
            : `Net balance is negative: ₹${Math.abs(netBalance).toLocaleString()}.`,
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
        const rows = allTransactions
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

        const win = window.open("", "_blank", "width=1000,height=800");
        if (!win) return;

        win.document.write(`
            <html>
            <head>
                <title>Finique Financial Report</title>
            </head>
            <body style="font-family:Arial, sans-serif;padding:24px;">
                <h1 style="margin-bottom:8px;">Finique Financial Report</h1>
                <p style="margin:0 0 20px;">Currency: INR</p>
                <p style="margin:0 0 8px;">Total Income: ₹${totalIncome.toLocaleString()}</p>
                <p style="margin:0 0 8px;">Total Expense: ₹${totalExpense.toLocaleString()}</p>
                <p style="margin:0 0 20px;">Net Balance: ₹${netBalance.toLocaleString()}</p>
                <h2>Transactions</h2>
                <table style="border-collapse:collapse;width:100%;font-size:14px;">
                    <thead>
                        <tr>
                            <th style="padding:8px;border:1px solid #ddd;text-align:left;">Date</th>
                            <th style="padding:8px;border:1px solid #ddd;text-align:left;">Type</th>
                            <th style="padding:8px;border:1px solid #ddd;text-align:left;">Category</th>
                            <th style="padding:8px;border:1px solid #ddd;text-align:right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>${rows || ""}</tbody>
                </table>
            </body>
            </html>
        `);

        win.document.close();
        win.focus();
        win.print();
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isBotTyping]);

    const quickPrompts = [
        "How can I save more each month?",
        "Where am I overspending?",
        "What should be my emergency fund target?",
        "How do I improve goal completion?",
    ];

    return (
        <div className={`p-8 space-y-8`}>
            {/* Top row: Weekly + Monthly side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Spending Trends */}
                <div
                    className={`xl:col-span-2 rounded-2xl p-6 border transition-all duration-300 flex flex-col ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3
                            className={`text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Weekly Spending Trends
                        </h3>

                        <div className="flex gap-2">
                            {lastSixMonths.map((month) => (
                                <button
                                    key={month}
                                    onClick={() => setSelectedMonth(month)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
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
                    </div>

                    <div className="flex-1 py-2" style={{ minHeight: "350px" }}>
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
                                    stroke={isDarkMode ? "#475569" : "#e2e8f0"}
                                />
                                <XAxis
                                    dataKey="month"
                                    stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 600,
                                    }}
                                />
                                <YAxis
                                    stroke={isDarkMode ? "#94a3b8" : "#64748b"}
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
                                            isDarkMode ? "#475569" : "#e2e8f0"
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
                </div>

                {/* Monthly Goals */}
                <div
                    className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}
                    style={{ minHeight: "400px" }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2
                            className={`text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Monthly Goals
                        </h2>

                        <div className="flex gap-2">
                            {lastThreeMonths.map((month) => (
                                <button
                                    key={month}
                                    onClick={() => setSelectedGoalsMonth(month)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        selectedGoalsMonth === month
                                            ? "bg-blue-600 text-white"
                                            : isDarkMode
                                              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}>
                                    {month}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto pr-3"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}>
                        <style>{`
                            ::-webkit-scrollbar {
                                width: 0px;
                            }
                        `}</style>
                        <div className="space-y-8">
                            {savingsGoals.map((goal) => (
                                <div key={goal.id} className="flex flex-col">
                                    <div className="flex justify-between items-baseline mb-3">
                                        <h3
                                            className={`font-semibold text-base ${
                                                isDarkMode
                                                    ? "text-slate-100"
                                                    : "text-slate-900"
                                            }`}>
                                            {goal.title}
                                        </h3>
                                        <span
                                            className={`text-sm font-bold ${
                                                isDarkMode
                                                    ? "text-slate-300"
                                                    : "text-slate-700"
                                            }`}>
                                            ₹{goal.current.toLocaleString()} / ₹
                                            {goal.target.toLocaleString()}
                                        </span>
                                    </div>

                                    <div
                                        className={`w-full h-3 rounded-full overflow-hidden ${
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
                                                backgroundColor: goal.color,
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
                                            (goal.current / goal.target) *
                                            100
                                        ).toFixed(0)}
                                        % completed
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setIsManageGoalsOpen(true)}
                        className={`w-full mt-6 py-3 font-bold rounded-lg border-2 transition-all duration-200 ${
                            isDarkMode
                                ? "border-slate-700 text-slate-300 hover:bg-slate-700"
                                : "border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}>
                        MANAGE TARGETS
                    </button>
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
                    <div className="p-6 border-b border-slate-700/40">
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className={`text-xs font-bold tracking-wider mb-2 ${
                                        isDarkMode
                                            ? "text-blue-400"
                                            : "text-blue-600"
                                    }`}>
                                    AI CHATBOT
                                </p>
                                <h2
                                    className={`text-lg font-semibold ${
                                        isDarkMode
                                            ? "text-white"
                                            : "text-slate-900"
                                    }`}>
                                    Talk to Your Finance Assistant
                                </h2>
                            </div>
                            <button
                                onClick={handleClearChat}
                                className={`text-xs px-3 py-1 rounded-lg border ${
                                    isDarkMode
                                        ? "border-slate-600 text-slate-300 hover:bg-slate-700"
                                        : "border-slate-300 text-slate-600 hover:bg-slate-100"
                                }`}>
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="p-6 pt-4 flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => handleChatSend(prompt)}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
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

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleChatSend()
                                }
                                placeholder="Ask about budget, savings, goals..."
                                className={`flex-1 p-3 rounded-lg border ${
                                    isDarkMode
                                        ? "bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
                                        : "bg-slate-50 border-slate-300 text-slate-700 placeholder-slate-500"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <button
                                onClick={() => handleChatSend()}
                                disabled={!chatInput.trim()}
                                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                                    chatInput.trim()
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-slate-400 text-white cursor-not-allowed"
                                }`}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Insights */}
                <div
                    className={`rounded-2xl border transition-all duration-300 flex flex-col ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}>
                    <div className="p-6 border-b border-slate-700/40">
                        <p
                            className={`text-xs font-bold tracking-wider mb-2 ${
                                isDarkMode
                                    ? "text-emerald-400"
                                    : "text-emerald-600"
                            }`}>
                            AI INSIGHTS
                        </p>
                        <h2
                            className={`text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Smart Finance Insights
                        </h2>
                    </div>

                    <div className="p-6 space-y-3">
                        {aiInsights.map((insight, idx) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-lg border ${
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
                className={`rounded-2xl border p-6 transition-all duration-300 ${
                    isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-200"
                }`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p
                            className={`text-xs font-bold tracking-wider mb-1 ${
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}>
                            EXPORT
                        </p>
                        <h3
                            className={`text-lg font-semibold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Export Financial Data
                        </h3>
                        <p
                            className={`text-sm mt-1 ${
                                isDarkMode ? "text-slate-300" : "text-slate-600"
                            }`}>
                            Download a printable PDF report with totals and
                            transactions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={exportAsPdf}
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all">
                        Export as PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Insights;
