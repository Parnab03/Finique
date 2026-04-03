import { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { ThemeContext } from "../../Context/ThemeContext";
import { TRANSACTION_CATEGORIES } from "../../Constants/transactionCategories";

const AddTransactionModal = ({ isOpen, onClose, onAddTransaction }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            type: "expense",
            amount: "",
            description: "",
            categoryId: "food",
            date: new Date().toISOString().split("T")[0],
        },
    });

    const transactionType = watch("type");

    const onSubmit = (data) => {
        const newTransaction = {
            id: Date.now(),
            name: data.description,
            description: data.description,
            date: new Date(data.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
            categoryId: data.type === "income" ? "income" : data.categoryId,
            amount: parseInt(data.amount),
            type: data.type,
        };

        onAddTransaction(newTransaction);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blur Background */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative rounded-2xl shadow-2xl max-w-md w-full mx-4 ${
                    isDarkMode ? "bg-slate-800" : "bg-white"
                }`}>
                {/* Header */}
                <div
                    className="p-6 border-b"
                    style={{
                        borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                    }}>
                    <h2
                        className={`text-xl font-bold ${
                            isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        Add Transaction
                    </h2>
                    <p
                        className={`text-sm mt-1 ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}>
                        Record a new movement in your ledger. Ensure all data
                        reflects current statements.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-5">
                    {/* Type Toggle */}
                    <div className="flex gap-3">
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            field.onChange("expense")
                                        }
                                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                            field.value === "expense"
                                                ? isDarkMode
                                                    ? "bg-red-600 text-white"
                                                    : "bg-red-100 text-red-600"
                                                : isDarkMode
                                                  ? "bg-slate-700 text-slate-300"
                                                  : "bg-slate-100 text-slate-600"
                                        }`}>
                                        ↓ Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => field.onChange("income")}
                                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                            field.value === "income"
                                                ? isDarkMode
                                                    ? "bg-green-600 text-white"
                                                    : "bg-green-100 text-green-600"
                                                : isDarkMode
                                                  ? "bg-slate-700 text-slate-300"
                                                  : "bg-slate-100 text-slate-600"
                                        }`}>
                                        ↑ Income
                                    </button>
                                </>
                            )}
                        />
                    </div>

                    {/* Date Input */}
                    <div>
                        <label
                            className={`block text-sm font-semibold mb-2 ${
                                isDarkMode ? "text-slate-300" : "text-slate-700"
                            }`}>
                            DATE
                        </label>
                        <Controller
                            name="date"
                            control={control}
                            rules={{ required: "Date is required" }}
                            render={({ field }) => (
                                <input
                                    type="date"
                                    {...field}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        isDarkMode
                                            ? "bg-slate-700 border-slate-600 text-white"
                                            : "bg-white border-slate-200 text-slate-900"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            )}
                        />
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label
                            className={`block text-sm font-semibold mb-2 ${
                                isDarkMode ? "text-slate-300" : "text-slate-700"
                            }`}>
                            AMOUNT
                        </label>
                        <div
                            className={`flex items-center px-4 py-2 rounded-lg border ${
                                isDarkMode
                                    ? "bg-slate-700 border-slate-600"
                                    : "bg-white border-slate-200"
                            }`}>
                            <span
                                className={`text-lg font-semibold ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}>
                                ₹
                            </span>
                            <Controller
                                name="amount"
                                control={control}
                                rules={{
                                    required: "Amount is required",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Amount must be a number",
                                    },
                                }}
                                render={({ field }) => (
                                    <input
                                        type="number"
                                        {...field}
                                        placeholder="0.00"
                                        className={`flex-1 ml-2 bg-transparent outline-none font-semibold ${
                                            isDarkMode
                                                ? "text-white"
                                                : "text-slate-900"
                                        }`}
                                    />
                                )}
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            className={`block text-sm font-semibold mb-2 ${
                                isDarkMode ? "text-slate-300" : "text-slate-700"
                            }`}>
                            DESCRIPTION
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: "Description is required" }}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    {...field}
                                    placeholder="e.g. Monthly AWS Subscription"
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        isDarkMode
                                            ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                                            : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Category (Only for Expense) */}
                    {transactionType === "expense" && (
                        <div>
                            <label
                                className={`block text-sm font-semibold mb-2 ${
                                    isDarkMode
                                        ? "text-slate-300"
                                        : "text-slate-700"
                                }`}>
                                CATEGORY
                            </label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            isDarkMode
                                                ? "bg-slate-700 border-slate-600 text-white"
                                                : "bg-white border-slate-200 text-slate-900"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                        {TRANSACTION_CATEGORIES.filter(
                                            (cat) => cat.id !== "income",
                                        ).map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all">
                            Add Transaction
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 font-semibold py-2 rounded-lg transition-all ${
                                isDarkMode
                                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
