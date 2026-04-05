import { useContext, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import { RoleContext } from "../../Context/RoleContext";
import { TransactionContext } from "../../Context/TransactionContext";
import {
    TRANSACTION_CATEGORIES,
    getCategoryName,
    getCategoryIcon,
    getCategoryById,
} from "../../Constants/transactionCategories";

const Transactions = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const { selectedRole } = useContext(RoleContext);
    const { allTransactions, deleteTransaction } =
        useContext(TransactionContext);
    const [transactionFilter, setTransactionFilter] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("latest");
    const [sortOpen, setSortOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const itemsPerPage = 10;
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    // Complete transaction data with filters and sorting
    const allFilteredTransactions = useMemo(() => {
        let filtered = allTransactions.filter((tx) => {
            // Existing type and category filters
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

            // NEW: Add search filter
            let filterBySearch = true;
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchFields = [
                    tx.name?.toLowerCase() || "",
                    tx.description?.toLowerCase() || "",
                    tx.date?.toLowerCase() || "",
                    tx.amount?.toString() || "",
                    tx.categoryId?.toLowerCase() || "",
                    tx.type?.toLowerCase() || "",
                ];
                filterBySearch = matchFields.some((field) =>
                    field.includes(query),
                );
            }

            return filterByType && filterByCategory && filterBySearch;
        });

        // Apply sorting (keep existing sorting logic)
        const sorted = [...filtered].sort((a, b) => {
            switch (sortOrder) {
                case "latest":
                    return new Date(b.date) - new Date(a.date);
                case "oldest":
                    return new Date(a.date) - new Date(b.date);
                case "lowToHigh":
                    return a.amount - b.amount;
                case "highToLow":
                    return b.amount - a.amount;
                default:
                    return 0;
            }
        });

        return sorted;
    }, [
        allTransactions,
        transactionFilter,
        selectedCategory,
        sortOrder,
        searchQuery,
    ]);

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
        } else if (filterType === "sort") {
            setSortOrder(filterValue);
            setSortOpen(false);
        }
    };

    const sortLabels = {
        latest: "Latest",
        oldest: "Oldest",
        lowToHigh: "Low to High",
        highToLow: "High to Low",
    };

    const exportToCSV = () => {
        if (filteredTransactions.length === 0) {
            alert("No transactions to export");
            return;
        }

        // CSV headers
        const headers = ["Date", "Description", "Category", "Amount", "Type"];

        // CSV rows
        const rows = filteredTransactions.map((tx) => [
            tx.date,
            tx.name,
            getCategoryName(tx.categoryId),
            tx.amount,
            tx.type,
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row
                    .map((cell) =>
                        typeof cell === "string" && cell.includes(",")
                            ? `"${cell}"`
                            : cell,
                    )
                    .join(","),
            ),
        ].join("\n");

        // Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleEditClick = (transaction) => {
        // Convert date to YYYY-MM-DD format if needed
        let dateValue = transaction.date;
        if (dateValue && dateValue.length > 0) {
            // If date is in DD-MM-YYYY format, convert to YYYY-MM-DD
            if (
                dateValue.includes("-") &&
                dateValue.split("-")[0].length === 2
            ) {
                const [day, month, year] = dateValue.split("-");
                dateValue = `${year}-${month}-${day}`;
            }
            // If date is in DD/MM/YYYY format, convert to YYYY-MM-DD
            else if (dateValue.includes("/")) {
                const [day, month, year] = dateValue.split("/");
                dateValue = `${year}-${month}-${day}`;
            }
        }

        setEditingId(transaction.id);
        setEditData({
            name: transaction.name,
            description: transaction.description,
            amount: transaction.amount,
            date: dateValue,
            categoryId: transaction.categoryId,
        });
    };

    const handleSaveEdit = () => {
        // Update the transaction in localStorage
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

        // Get correct storage key
        const storageKey =
            currentPreset === "no-presets"
                ? "finique_transactions_custom"
                : "finique_transactions_preset";

        // Update transaction in state and storage
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            const transactions = JSON.parse(stored);
            const updatedTransactions = transactions.map((tx) =>
                tx.id === editingId
                    ? {
                          ...tx,
                          name: editData.name,
                          description: editData.description,
                          amount: parseInt(editData.amount) || 0,
                          date: editData.date,
                          categoryId: editData.categoryId,
                      }
                    : tx,
            );
            localStorage.setItem(
                storageKey,
                JSON.stringify(updatedTransactions),
            );
            window.location.reload(); // Reload to reflect changes
        }

        setEditingId(null);
        setEditData({});
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    return (
        <div className="p-8">
            <div className="mb-4">
                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    {/* Activity Filter - Keeps Income */}
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

                    {/* Sorting and Category Filters */}
                    <div className="flex gap-2">
                        {/* Sort Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setSortOpen(!sortOpen)}
                                className={`px-4 py-2 flex items-center gap-2 text-sm font-semibold ${
                                    isDarkMode
                                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                } px-2.5 py-1.5 rounded-lg transition-colors`}>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24">
                                    <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                {sortLabels[sortOrder]}
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                            {sortOpen && (
                                <div
                                    className={`absolute top-full mt-1 ${
                                        isDarkMode
                                            ? "bg-slate-900 border-slate-700"
                                            : "bg-white border-slate-200"
                                    } border rounded-lg shadow-lg z-50 w-48`}>
                                    {[
                                        { id: "latest", label: "Latest First" },
                                        { id: "oldest", label: "Oldest First" },
                                        {
                                            id: "lowToHigh",
                                            label: "Amount: Low to High",
                                        },
                                        {
                                            id: "highToLow",
                                            label: "Amount: High to Low",
                                        },
                                    ].map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                handleFilterChange(
                                                    "sort",
                                                    option.id,
                                                );
                                            }}
                                            className={`w-full text-left px-4 py-2 ${
                                                sortOrder === option.id
                                                    ? isDarkMode
                                                        ? "bg-blue-600/30 text-blue-300"
                                                        : "bg-blue-50 text-blue-600"
                                                    : isDarkMode
                                                      ? "hover:bg-slate-800 text-slate-300"
                                                      : "hover:bg-slate-50 text-slate-700"
                                            } text-sm font-medium`}>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Category Filter - Removes income category only */}
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
                                            handleFilterChange(
                                                "category",
                                                "All",
                                            );
                                        }}
                                        className={`w-full text-left px-4 py-2 ${
                                            selectedCategory === "All"
                                                ? isDarkMode
                                                    ? "bg-blue-600/30 text-blue-300"
                                                    : "bg-blue-50 text-blue-600"
                                                : isDarkMode
                                                  ? "hover:bg-slate-800 text-slate-300"
                                                  : "hover:bg-slate-50 text-slate-700"
                                        } text-sm font-medium`}>
                                        All Categories
                                    </button>
                                    {TRANSACTION_CATEGORIES.filter(
                                        (cat) => cat.id !== "income",
                                    ).map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                handleFilterChange(
                                                    "category",
                                                    cat.id,
                                                );
                                            }}
                                            className={`w-full text-left px-4 py-2 ${
                                                selectedCategory === cat.id
                                                    ? isDarkMode
                                                        ? "bg-blue-600/30 text-blue-300"
                                                        : "bg-blue-50 text-blue-600"
                                                    : isDarkMode
                                                      ? "hover:bg-slate-800 text-slate-300"
                                                      : "hover:bg-slate-50 text-slate-700"
                                            } text-sm font-medium`}>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Export CSV Button */}
                        <div>
                            <button
                                onClick={exportToCSV}
                                className={`px-4 py-2 flex items-center gap-2 text-sm font-semibold rounded-lg transition-colors ${
                                    isDarkMode
                                        ? "bg-green-600 text-white hover:bg-green-700"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24">
                                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export CSV
                            </button>
                        </div>
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
                                        {editingId === transaction.id ? (
                                            // EDIT MODE - Expanded Row
                                            <td
                                                colSpan="5"
                                                className={`py-6 px-6 ${
                                                    isDarkMode
                                                        ? "bg-slate-700/50"
                                                        : "bg-slate-50"
                                                }`}>
                                                <div className="space-y-4">
                                                    <h3
                                                        className={`text-lg font-semibold mb-4 ${
                                                            isDarkMode
                                                                ? "text-white"
                                                                : "text-slate-900"
                                                        }`}>
                                                        Edit Transaction
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Title */}
                                                        <div>
                                                            <label
                                                                className={`block text-sm font-semibold mb-2 ${
                                                                    isDarkMode
                                                                        ? "text-slate-300"
                                                                        : "text-slate-700"
                                                                }`}>
                                                                Title
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editData.name
                                                                }
                                                                onChange={(e) =>
                                                                    setEditData(
                                                                        {
                                                                            ...editData,
                                                                            name: e
                                                                                .target
                                                                                .value,
                                                                        },
                                                                    )
                                                                }
                                                                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                                                                    isDarkMode
                                                                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                                                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500"
                                                                }`}
                                                            />
                                                        </div>

                                                        {/* Description */}
                                                        <div>
                                                            <label
                                                                className={`block text-sm font-semibold mb-2 ${
                                                                    isDarkMode
                                                                        ? "text-slate-300"
                                                                        : "text-slate-700"
                                                                }`}>
                                                                Description
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    editData.description
                                                                }
                                                                onChange={(e) =>
                                                                    setEditData(
                                                                        {
                                                                            ...editData,
                                                                            description:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                                                                    isDarkMode
                                                                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                                                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500"
                                                                }`}
                                                            />
                                                        </div>

                                                        {/* Amount */}
                                                        <div>
                                                            <label
                                                                className={`block text-sm font-semibold mb-2 ${
                                                                    isDarkMode
                                                                        ? "text-slate-300"
                                                                        : "text-slate-700"
                                                                }`}>
                                                                Amount
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={
                                                                    editData.amount
                                                                }
                                                                onChange={(e) =>
                                                                    setEditData(
                                                                        {
                                                                            ...editData,
                                                                            amount:
                                                                                parseInt(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ) ||
                                                                                0,
                                                                        },
                                                                    )
                                                                }
                                                                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                                                                    isDarkMode
                                                                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                                                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500"
                                                                }`}
                                                            />
                                                        </div>

                                                        {/* Date */}
                                                        <div>
                                                            <label
                                                                className={`block text-sm font-semibold mb-2 ${
                                                                    isDarkMode
                                                                        ? "text-slate-300"
                                                                        : "text-slate-700"
                                                                }`}>
                                                                Date
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    editData.date
                                                                }
                                                                onChange={(e) =>
                                                                    setEditData(
                                                                        {
                                                                            ...editData,
                                                                            date: e
                                                                                .target
                                                                                .value,
                                                                        },
                                                                    )
                                                                }
                                                                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer pointer-events-auto ${
                                                                    isDarkMode
                                                                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                                                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500"
                                                                }`}
                                                                style={{
                                                                    colorScheme:
                                                                        isDarkMode
                                                                            ? "dark"
                                                                            : "light",
                                                                }}
                                                            />
                                                        </div>

                                                        {/* Category */}
                                                        <div className="md:col-span-2">
                                                            <label
                                                                className={`block text-sm font-semibold mb-2 ${
                                                                    isDarkMode
                                                                        ? "text-slate-300"
                                                                        : "text-slate-700"
                                                                }`}>
                                                                Category
                                                            </label>
                                                            <select
                                                                value={
                                                                    editData.categoryId
                                                                }
                                                                onChange={(e) =>
                                                                    setEditData(
                                                                        {
                                                                            ...editData,
                                                                            categoryId:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none cursor-pointer bg-no-repeat ${
                                                                    isDarkMode
                                                                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                                                                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500"
                                                                }`}
                                                                style={{
                                                                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${isDarkMode ? "white" : "black"}" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>')`,
                                                                    backgroundPosition:
                                                                        "right 0.75rem center",
                                                                    backgroundSize:
                                                                        "1.5em 1.5em",
                                                                    paddingRight:
                                                                        "2.5rem",
                                                                }}>
                                                                {transaction.type ===
                                                                "income"
                                                                    ? TRANSACTION_CATEGORIES.filter(
                                                                          (
                                                                              cat,
                                                                          ) =>
                                                                              cat.id ===
                                                                              "income",
                                                                      ).map(
                                                                          (
                                                                              cat,
                                                                          ) => (
                                                                              <option
                                                                                  key={
                                                                                      cat.id
                                                                                  }
                                                                                  value={
                                                                                      cat.id
                                                                                  }>
                                                                                  {
                                                                                      cat.name
                                                                                  }
                                                                              </option>
                                                                          ),
                                                                      )
                                                                    : TRANSACTION_CATEGORIES.filter(
                                                                          (
                                                                              cat,
                                                                          ) =>
                                                                              cat.id !==
                                                                              "income",
                                                                      ).map(
                                                                          (
                                                                              cat,
                                                                          ) => (
                                                                              <option
                                                                                  key={
                                                                                      cat.id
                                                                                  }
                                                                                  value={
                                                                                      cat.id
                                                                                  }>
                                                                                  {
                                                                                      cat.name
                                                                                  }
                                                                              </option>
                                                                          ),
                                                                      )}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div
                                                        className="flex gap-3 justify-end mt-6 pt-4 border-t"
                                                        style={{
                                                            borderColor:
                                                                isDarkMode
                                                                    ? "#334155"
                                                                    : "#e2e8f0",
                                                        }}>
                                                        <button
                                                            onClick={
                                                                handleCancelEdit
                                                            }
                                                            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                                                                isDarkMode
                                                                    ? "bg-slate-600 text-white hover:bg-slate-500"
                                                                    : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                                                            }`}>
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={
                                                                handleSaveEdit
                                                            }
                                                            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700`}>
                                                            Save Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        ) : (
                                            // NORMAL VIEW - Regular Row
                                            <>
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
                                                                {
                                                                    transaction.name
                                                                }
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
                                                        transaction.type ===
                                                        "income"
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    }`}>
                                                    {transaction.type ===
                                                    "income"
                                                        ? "+"
                                                        : "-"}
                                                    ₹
                                                    {transaction.amount.toLocaleString()}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6">
                                                    {selectedRole ===
                                                        "Admin" && (
                                                        <div className="flex gap-3 justify-center">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditClick(
                                                                        transaction,
                                                                    )
                                                                }
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
                                                                onClick={() => {
                                                                    if (
                                                                        transaction.fromPreset
                                                                    ) {
                                                                        alert(
                                                                            "Preset data cannot be deleted",
                                                                        );
                                                                    } else {
                                                                        const result =
                                                                            deleteTransaction(
                                                                                transaction.id,
                                                                            );
                                                                        if (
                                                                            result.success
                                                                        ) {
                                                                            alert(
                                                                                result.message,
                                                                            );
                                                                            window.location.reload();
                                                                        } else {
                                                                            alert(
                                                                                result.message,
                                                                            );
                                                                        }
                                                                    }
                                                                }}
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
                                                    )}
                                                    {selectedRole ===
                                                        "Viewer" && (
                                                        <div
                                                            className={`text-center text-xs py-2 px-3 rounded-lg ${isDarkMode ? "bg-slate-700/50 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                                                            Read-only
                                                        </div>
                                                    )}
                                                </td>
                                            </>
                                        )}
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
                                        <div>
                                            <p className="text-lg font-medium">
                                                {searchQuery
                                                    ? "No transactions found matching your search"
                                                    : "No transactions available"}
                                            </p>
                                            {searchQuery && (
                                                <>
                                                    <p className="text-sm mt-2">
                                                        Try searching with
                                                        different keywords
                                                    </p>
                                                    <button
                                                        onClick={() =>
                                                            (window.location.href =
                                                                "/transactions")
                                                        }
                                                        className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            isDarkMode
                                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                                : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                                                        }`}>
                                                        Clear Search & View All
                                                        Transactions
                                                    </button>
                                                </>
                                            )}
                                        </div>
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
