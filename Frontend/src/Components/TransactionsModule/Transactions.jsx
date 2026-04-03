import { useContext, useState } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import {
    TRANSACTION_CATEGORIES,
    getCategoryName,
    getCategoryIcon,
    getCategoryById,
} from "../../Constants/transactionCategories";

const Transactions = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const [transactionFilter, setTransactionFilter] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Complete transaction data
    const allTransactions = [
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

    const allFilteredTransactions = allTransactions.filter((tx) => {
        const filterByType =
            transactionFilter === "All"
                ? true
                : transactionFilter === "Income"
                  ? tx.type === "income"
                  : tx.type === "expense";

        const filterByCategory =
            selectedCategory === "All"
                ? true
                : tx.categoryId === selectedCategory;

        return filterByType && filterByCategory;
    });

    // Pagination calculations
    const totalPages = Math.ceil(allFilteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredTransactions = allFilteredTransactions.slice(
        startIndex,
        endIndex,
    );

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Reset to page 1 when filters change
    const handleFilterChange = (filterType, filterValue) => {
        setCurrentPage(1);
        if (filterType === "transaction") {
            setTransactionFilter(filterValue);
        } else if (filterType === "category") {
            setSelectedCategory(filterValue);
            setCategoryOpen(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-6">
                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    {/* Activity Filter */}
                    <div className="flex gap-2">
                        {["All Activity", "Income", "Expenses"].map(
                            (filter) => (
                                <button
                                    key={filter}
                                    onClick={() =>
                                        handleFilterChange(
                                            "transaction",
                                            filter === "All Activity"
                                                ? "All"
                                                : filter,
                                        )
                                    }
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        (filter === "All Activity" &&
                                            transactionFilter === "All") ||
                                        transactionFilter === filter
                                            ? isDarkMode
                                                ? "bg-blue-600 text-white"
                                                : "bg-blue-100 text-blue-600"
                                            : isDarkMode
                                              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}>
                                    {filter}
                                </button>
                            ),
                        )}
                    </div>

                    {/* Category Filter - Styled like Navbar Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setCategoryOpen(!categoryOpen)}
                            className={`px-4 py-2 flex items-center gap-0.5 text-sm font-semibold ${
                                isDarkMode
                                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            } px-2.5 py-1.5 rounded-lg transition-colors`}>
                            {selectedCategory === "All"
                                ? "All Categories"
                                : TRANSACTION_CATEGORIES.find(
                                      (cat) => cat.id === selectedCategory,
                                  )?.name || selectedCategory}
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </button>
                        {categoryOpen && (
                            <div
                                className={`absolute top-full mt-1 ${
                                    isDarkMode
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-white border-slate-200"
                                } border rounded-lg shadow-lg z-50`}>
                                <button
                                    onClick={() => {
                                        handleFilterChange("category", "All");
                                    }}
                                    className={`w-full text-left px-4 py-2 ${
                                        isDarkMode
                                            ? "hover:bg-slate-800 text-slate-300"
                                            : "hover:bg-slate-50 text-slate-700"
                                    } text-sm font-medium`}>
                                    All Categories
                                </button>
                                {TRANSACTION_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            handleFilterChange(
                                                "category",
                                                cat.id,
                                            );
                                        }}
                                        className={`w-full text-left px-4 py-2 ${
                                            isDarkMode
                                                ? "hover:bg-slate-800 text-slate-300"
                                                : "hover:bg-slate-50 text-slate-700"
                                        } text-sm font-medium`}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-200"
                }`}>
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
                                    className={`rounded-tl-2xl text-left py-4 px-6 text-xs font-semibold tracking-wide ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}>
                                    DATE
                                </th>
                                <th
                                    className={`text-left py-4 px-6 text-xs font-semibold tracking-wide ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}>
                                    DESCRIPTION
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
                                    className={`text-right py-4 px-6 text-xs font-semibold tracking-wide ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}>
                                    AMOUNT
                                </th>
                                <th
                                    className={` text-center py-4 px-6 text-xs font-semibold tracking-wide ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-600"
                                    }`}>
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className={`border-b transition-all duration-200 hover:${
                                            isDarkMode
                                                ? "bg-slate-700/50"
                                                : "bg-slate-50"
                                        } ${
                                            isDarkMode
                                                ? "border-slate-700"
                                                : "border-slate-200"
                                        }`}>
                                        {/* Date */}
                                        <td
                                            className={`py-4 px-6 ${
                                                isDarkMode
                                                    ? "text-slate-300"
                                                    : "text-slate-700"
                                            }`}>
                                            {transaction.date}
                                        </td>

                                        {/* Description */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
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

                                        {/* Category Badge */}
                                        <td className="py-4 px-6 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    transaction.type ===
                                                    "income"
                                                        ? "bg-green-100 text-green-700"
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
                                            className={`py-4 px-6 text-right font-bold text-lg ${
                                                transaction.type === "income"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}>
                                            {transaction.type === "income"
                                                ? "+"
                                                : "-"}
                                            ₹
                                            {transaction.amount.toLocaleString()}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-6">
                                            <div className="flex gap-3 justify-center">
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
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className={`py-8 px-6 text-center ${
                                            isDarkMode
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }`}>
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {allFilteredTransactions.length > 0 && (
                    <div
                        className={`py-4 px-6 border-t flex items-center justify-between ${
                            isDarkMode ? "border-slate-700" : "border-slate-200"
                        }`}>
                        <p
                            className={`text-sm ${
                                isDarkMode ? "text-slate-400" : "text-slate-600"
                            }`}>
                            <span className="font-semibold">
                                Page {currentPage} of {totalPages}
                            </span>{" "}
                            • Showing{" "}
                            <span className="font-semibold">
                                {startIndex + 1}-
                                {Math.min(
                                    endIndex,
                                    allFilteredTransactions.length,
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">
                                {allFilteredTransactions.length}
                            </span>{" "}
                            transactions
                        </p>

                        {/* Pagination Arrow Icons */}
                        <div className="flex gap-2">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    currentPage === 1
                                        ? isDarkMode
                                            ? "text-slate-600 cursor-not-allowed"
                                            : "text-slate-300 cursor-not-allowed"
                                        : isDarkMode
                                          ? "text-slate-300 hover:text-white hover:bg-slate-700"
                                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }`}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    currentPage === totalPages
                                        ? isDarkMode
                                            ? "text-slate-600 cursor-not-allowed"
                                            : "text-slate-300 cursor-not-allowed"
                                        : isDarkMode
                                          ? "text-slate-300 hover:text-white hover:bg-slate-700"
                                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }`}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
