import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
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

const Dashboard = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [monthFilter, setMonthFilter] = useState(6);
    const [categoryMonthFilter, setCategoryMonthFilter] = useState("JUN");
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [transactionFilter, setTransactionFilter] = useState("All");

    // Different datasets for different filters (3/6/9/12 months aggregate)
    const allMonthsData = {
        3: [
            { month: "APR", spending: 55000 },
            { month: "MAY", spending: 48000 },
            { month: "JUN", spending: 65000 },
        ],
        6: [
            { month: "JAN", spending: 35000 },
            { month: "FEB", spending: 42000 },
            { month: "MAR", spending: 38000 },
            { month: "APR", spending: 55000 },
            { month: "MAY", spending: 48000 },
            { month: "JUN", spending: 65000 },
        ],
        9: [
            { month: "OCT", spending: 32000 },
            { month: "NOV", spending: 38000 },
            { month: "DEC", spending: 41000 },
            { month: "JAN", spending: 35000 },
            { month: "FEB", spending: 42000 },
            { month: "MAR", spending: 38000 },
            { month: "APR", spending: 55000 },
            { month: "MAY", spending: 48000 },
            { month: "JUN", spending: 65000 },
        ],
        12: [
            { month: "JUL", spending: 52000 },
            { month: "AUG", spending: 48000 },
            { month: "SEP", spending: 45000 },
            { month: "OCT", spending: 32000 },
            { month: "NOV", spending: 38000 },
            { month: "DEC", spending: 41000 },
            { month: "JAN", spending: 35000 },
            { month: "FEB", spending: 42000 },
            { month: "MAR", spending: 38000 },
            { month: "APR", spending: 55000 },
            { month: "MAY", spending: 48000 },
            { month: "JUN", spending: 65000 },
        ],
    };

    const monthlyData = allMonthsData[monthFilter];

    // Individual month data for category-wise chart (last 6 months)
    const categoryMonthData = {
        JAN: [
            { name: "Housing", value: 45, amount: 35000, color: "#2563eb" },
            { name: "Investment", value: 30, amount: 23000, color: "#059669" },
            { name: "Travel", value: 15, amount: 11000, color: "#dc2626" },
            { name: "Food", value: 10, amount: 8000, color: "#f59e0b" },
        ],
        FEB: [
            { name: "Housing", value: 42, amount: 42000, color: "#2563eb" },
            { name: "Investment", value: 32, amount: 32000, color: "#059669" },
            { name: "Travel", value: 15, amount: 15000, color: "#dc2626" },
            { name: "Food", value: 8, amount: 8000, color: "#f59e0b" },
            {
                name: "Entertainment",
                value: 3,
                amount: 3000,
                color: "#8b5cf6",
            },
        ],
        MAR: [
            { name: "Housing", value: 40, amount: 38000, color: "#2563eb" },
            {
                name: "Investment",
                value: 28,
                amount: 27000,
                color: "#059669",
            },
            { name: "Travel", value: 18, amount: 17000, color: "#dc2626" },
            { name: "Food", value: 9, amount: 9000, color: "#f59e0b" },
            {
                name: "Entertainment",
                value: 5,
                amount: 5000,
                color: "#8b5cf6",
            },
        ],
        APR: [
            { name: "Housing", value: 45, amount: 55000, color: "#2563eb" },
            { name: "Investment", value: 25, amount: 30000, color: "#059669" },
            { name: "Travel", value: 15, amount: 18000, color: "#dc2626" },
            { name: "Food", value: 10, amount: 12000, color: "#f59e0b" },
            {
                name: "Entertainment",
                value: 4,
                amount: 5000,
                color: "#8b5cf6",
            },
            { name: "Shopping", value: 1, amount: 2000, color: "#ec4899" },
        ],
        MAY: [
            { name: "Housing", value: 40, amount: 48000, color: "#2563eb" },
            { name: "Investment", value: 30, amount: 36000, color: "#059669" },
            { name: "Travel", value: 15, amount: 18000, color: "#dc2626" },
            { name: "Food", value: 10, amount: 12000, color: "#f59e0b" },
            {
                name: "Entertainment",
                value: 3,
                amount: 4000,
                color: "#8b5cf6",
            },
            { name: "Shopping", value: 2, amount: 2000, color: "#ec4899" },
        ],
        JUN: [
            { name: "Housing", value: 38, amount: 65000, color: "#2563eb" },
            { name: "Investment", value: 28, amount: 48000, color: "#059669" },
            { name: "Travel", value: 18, amount: 30000, color: "#dc2626" },
            { name: "Food", value: 7, amount: 12000, color: "#f59e0b" },
            {
                name: "Entertainment",
                value: 6,
                amount: 10000,
                color: "#8b5cf6",
            },
            { name: "Shopping", value: 2, amount: 3000, color: "#ec4899" },
            { name: "Utilities", value: 1, amount: 2000, color: "#10b981" },
        ],
    };

    const categoryData = categoryMonthData[categoryMonthFilter];
    const chartTextColor = isDarkMode ? "#e2e8f0" : "#1e293b";
    const gridColor = isDarkMode ? "#334155" : "#e2e8f0";

    // Transaction data
    const allTransactions = [
        {
            id: 1,
            name: "Gourmet Garden Bistro",
            description: "Fine Dining",
            date: "24 Oct, 2023",
            category: "FOOD & DRINK",
            amount: 4250,
            type: "expense",
            icon: "🍴",
        },
        {
            id: 2,
            name: "Global Tech Corp",
            description: "Monthly Salary",
            date: "01 Oct, 2023",
            category: "INCOME",
            amount: 125000,
            type: "income",
            icon: "💰",
        },
        {
            id: 3,
            name: "Skyways Aviation",
            description: "Business Trip",
            date: "28 Sep, 2023",
            category: "TRAVEL",
            amount: 12800,
            type: "expense",
            icon: "✈️",
        },
    ];

    const filteredTransactions = allTransactions.filter((tx) => {
        if (transactionFilter === "Income") return tx.type === "income";
        if (transactionFilter === "Expenses") return tx.type === "expense";
        return true;
    });

    return (
        <div className={`p-8 space-y-8`}>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Total Balance Card */}
                <div
                    className={`lg:col-span-1 p-6 rounded-2xl transition-all duration-300 bg-blue-600 text-white shadow-[0_10px_15px_-3px_rgba(0,83,221,0.40),0_4px_6px_-4px_rgba(0,83,221,0.40)]`}>
                    <div className="flex items-start justify-between mb-6">
                        <div className="text-base font-semibold tracking-wide mb-2 text-blue-100">
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
                    <h2 className="text-6xl font-bold text-white">₹4,28,450</h2>
                    <p className="flex items-center text-center content-center gap-1.5 text-blue-100 text-sm font-medium pt-2 pb-1">
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
                        +2.4% from last month
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
                                className={`w-16 h-7 rounded-full flex items-center justify-center text-sm font-medium text-emerald-400 ${
                                    isDarkMode
                                        ? "bg-emerald-500/20"
                                        : "bg-emerald-100"
                                }`}>
                                +12%
                            </div>
                        </div>
                        <div>
                            <p
                                className={`text-sm font-semibold tracking-wider mb-2 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }`}>
                                TOTAL INCOME
                            </p>
                            <h3
                                className={`text-4xl font-bold ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                ₹1,85,200
                            </h3>
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
                                className={`w-16 h-7 rounded-full flex items-center justify-center text-sm font-medium text-red-400 ${
                                    isDarkMode ? "bg-red-500/20" : "bg-red-100"
                                }`}>
                                -5.4%
                            </div>
                        </div>
                        <div>
                            <p
                                className={`text-sm font-semibold tracking-wider mb-2 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }`}>
                                TOTAL EXPENSES
                            </p>
                            <h3
                                className={`text-4xl font-bold ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                ₹92,340
                            </h3>
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

                        {/* Filter Buttons */}
                        <div className="flex gap-2">
                            {[3, 6, 9, 12].map((months) => (
                                <button
                                    key={months}
                                    onClick={() => setMonthFilter(months)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        monthFilter === months
                                            ? "bg-blue-600 text-white"
                                            : isDarkMode
                                              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}>
                                    {months}M
                                </button>
                            ))}
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={monthlyData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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

                        {/* Month Filter Buttons */}
                        <div className="flex gap-2">
                            {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"].map(
                                (month) => (
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
                                ),
                            )}
                        </div>
                    </div>

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
                            {categoryData.map((item, index) => (
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
                                            ₹{(item.amount / 1000).toFixed(0)}k
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
                                        data={categoryData}
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
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                opacity={
                                                    hoveredCategory === null ||
                                                    hoveredCategory === index
                                                        ? 1
                                                        : 0.5
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                    transition: "opacity 0.2s",
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

                {/* Table */}
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
                                <th
                                    className={`text-center py-4 px-6 text-xs font-semibold tracking-wide ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}>
                                    ACTIONS
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
                                                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                                                    isDarkMode
                                                        ? "bg-slate-700"
                                                        : "bg-slate-100"
                                                }`}>
                                                {transaction.icon}
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
                                                    {transaction.description}
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
                                                transaction.type === "income"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : isDarkMode
                                                      ? "bg-slate-700 text-slate-300"
                                                      : "bg-slate-200 text-slate-700"
                                            }`}>
                                            {transaction.category}
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
                                        ₹{transaction.amount.toLocaleString()}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-6">
                                        <div className="flex gap-3 justify-center">
                                            {/* Edit Button */}
                                            <button
                                                className={`p-2 rounded-lg transition-all duration-200 ${
                                                    isDarkMode
                                                        ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                                                        : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                                                }`}>
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2">
                                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                </svg>
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                className={`p-2 rounded-lg transition-all duration-200 ${
                                                    isDarkMode
                                                        ? "hover:bg-slate-700 text-slate-400 hover:text-red-400"
                                                        : "hover:bg-slate-100 text-slate-600 hover:text-red-600"
                                                }`}>
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    <line
                                                        x1="10"
                                                        y1="11"
                                                        x2="10"
                                                        y2="17"
                                                    />
                                                    <line
                                                        x1="14"
                                                        y1="11"
                                                        x2="14"
                                                        y2="17"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer with View All Link */}
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
            </div>

            {/* Smart Insights Section */}
            <div>
                <h2
                    className={`text-2xl font-bold mb-6 ${
                        isDarkMode ? "text-white" : "text-slate-900"
                    }`}>
                    Smart Insights
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Insight Card 1 */}
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
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}>
                            HIGHEST SPENDING CATEGORY
                        </h3>
                        <p
                            className={`text-xl font-bold mb-3 ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Housing accounts for 45% of your monthly budget.
                        </p>
                        <p
                            className={`text-sm mb-4 ${
                                isDarkMode ? "text-slate-400" : "text-slate-600"
                            }`}>
                            Consider refinancing or evaluating utility costs to
                            save up to ₹5,000 next month.
                        </p>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://www.youtube.com/results?search_query=how+to+reduce+housing+costs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm">
                                Watch a video guide
                            </a>
                            <a
                                href="https://www.investopedia.com/terms/r/refinance.asp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm">
                                Read detailed guide
                            </a>
                        </div>
                    </div>

                    {/* Insight Card 2 */}
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
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}>
                            MONTHLY COMPARISON
                        </h3>
                        <p
                            className={`text-xl font-bold mb-3 ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Your savings increased by +10% vs September.
                        </p>
                        <p
                            className={`text-sm mb-4 ${
                                isDarkMode ? "text-slate-400" : "text-slate-600"
                            }`}>
                            Excellent management! You've reached 85% of your
                            quarterly emergency fund goal.
                        </p>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://www.youtube.com/results?search_query=emergency+fund+importance"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold text-sm">
                                Track your goals
                            </a>
                            <a
                                href="https://www.nerdwallet.com/article/investing/emergency-fund"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold text-sm">
                                Learn more about emergency funds
                            </a>
                        </div>
                    </div>

                    {/* Insight Card 3 */}
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
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}>
                            SAVING TIP
                        </h3>
                        <p
                            className={`text-xl font-bold mb-3 ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            The 50/30/20 budgeting rule could optimize your
                            finances.
                        </p>
                        <p
                            className={`text-sm mb-4 ${
                                isDarkMode ? "text-slate-400" : "text-slate-600"
                            }`}>
                            You're currently spending 62% on needs. Reallocating
                            12% could boost your long-term wealth significantly.
                        </p>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://www.youtube.com/results?search_query=50+30+20+budgeting+rule"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-semibold text-sm">
                                Explore the budgeting rule
                            </a>
                            <a
                                href="https://www.thebalancemoney.com/the-50-30-20-rule-of-thumb-453922"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-semibold text-sm">
                                Read the complete guide
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
