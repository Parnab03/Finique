import { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ThemeContext } from "../../Context/ThemeContext";
import { TRANSACTION_CATEGORIES } from "../../Constants/transactionCategories";

const AddTransactionModal = ({ isOpen, onClose, onAddTransaction }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
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
            title: "",
            description: "",
            categoryId: "select-category",
            date: new Date(),
        },
    });

    const transactionType = watch("type");

    // Handle modal close with form reset
    const handleClose = () => {
        reset();
        onClose();
    };

    // Handle cancel button with form reset
    const handleCancel = () => {
        reset();
        onClose();
    };

    const onSubmit = (data) => {
        if (data.categoryId === "select-category") {
            alert("Please select a category");
            return;
        }
        const newTransaction = {
            id: Date.now(),
            name: data.title || data.description,
            description: data.description,
            title: data.title,
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
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div
                className={`relative rounded-2xl shadow-2xl max-w-xl w-full mx-4 overflow-hidden ${
                    isDarkMode ? "bg-slate-800" : "bg-white"
                }`}>
                {/* Header */}
                <div className="p-8 pb-2">
                    <h2
                        className={`text-3xl font-bold mb-2 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        Add Transaction
                    </h2>
                    <p
                        className={`text-sm ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}>
                        Record a new movement in your ledger. Ensure all data
                        reflects current statements.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-8 pt-6 space-y-6">
                    {/* Type Toggle */}
                    <div
                        className={`flex gap-2 p-1.5 rounded-full ${
                            isDarkMode ? "bg-slate-700" : "bg-slate-100"
                        }`}>
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
                                        className={`flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all duration-200 ${
                                            field.value === "expense"
                                                ? isDarkMode
                                                    ? "bg-blue-600 text-white shadow-lg"
                                                    : "bg-blue-600 text-white shadow-lg"
                                                : isDarkMode
                                                  ? "bg-transparent text-blue-600"
                                                  : "bg-transparent text-blue-600"
                                        }`}>
                                        <span>↓</span>
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => field.onChange("income")}
                                        className={`flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all duration-200 ${
                                            field.value === "income"
                                                ? isDarkMode
                                                    ? "bg-green-600 text-white shadow-lg"
                                                    : "bg-green-600 text-white shadow-lg"
                                                : isDarkMode
                                                  ? "bg-transparent text-green-600"
                                                  : "bg-transparent text-green-600"
                                        }`}>
                                        <span>↑</span>
                                        Income
                                    </button>
                                </>
                            )}
                        />
                    </div>

                    {/* Date and Amount - Side by Side */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Date Input */}
                        <div>
                            <label
                                className={`block text-sm font-semibold mb-2.5 ${
                                    isDarkMode
                                        ? "text-slate-300"
                                        : "text-slate-700"
                                }`}>
                                DATE
                            </label>
                            <div className="relative">
                                <Controller
                                    name="date"
                                    control={control}
                                    rules={{ required: "Date is required" }}
                                    render={({ field }) => (
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) =>
                                                field.onChange(date)
                                            }
                                            dateFormat="dd MMM, yyyy"
                                            className={`w-full px-4 py-3 rounded-lg border font-medium pr-10 ${
                                                isDarkMode
                                                    ? "bg-slate-700 border-slate-600 text-white"
                                                    : "bg-white border-slate-200 text-slate-900"
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                errors.date
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                    )}
                                />
                                <svg
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${
                                        isDarkMode
                                            ? "text-slate-300"
                                            : "text-slate-500"
                                    }`}
                                    width="18"
                                    height="20"
                                    viewBox="0 0 18 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6ZM2 6V4V6Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                {errors.date && (
                                    <div
                                        className={`absolute top-full left-0 mt-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-20 shadow-lg border ${
                                            isDarkMode
                                                ? "bg-red-900/90 text-red-200 border-red-700"
                                                : "bg-red-100 text-red-700 border-red-200"
                                        }`}>
                                        {errors.date.message}
                                        <div
                                            className={`absolute bottom-full left-3 w-2 h-2 ${
                                                isDarkMode
                                                    ? "bg-red-900/90"
                                                    : "bg-red-100"
                                            }`}
                                            style={{
                                                clipPath:
                                                    "polygon(0 100%, 100% 100%, 50% 0)",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label
                                className={`block text-sm font-semibold mb-2.5 ${
                                    isDarkMode
                                        ? "text-slate-300"
                                        : "text-slate-700"
                                }`}>
                                AMOUNT
                            </label>
                            <div className="relative">
                                <div
                                    className={`flex items-center px-4 py-2.5 rounded-lg border ${
                                        isDarkMode
                                            ? "bg-slate-700 border-slate-600"
                                            : "bg-white border-slate-200"
                                    } ${errors.amount ? "border-red-500" : ""}`}>
                                    <span
                                        className={`text-lg font-bold flex-shrink-0 ${
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
                                                message:
                                                    "Amount must be a number",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                {...field}
                                                placeholder="0"
                                                className={`flex-1 ml-1 pb-0.5 bg-transparent outline-none font-medium text-left min-w-0 [&::-webkit-outer-spin-button]:[appearance:none] [&::-webkit-inner-spin-button]:[appearance:none] [-moz-appearance:textfield] ${
                                                    isDarkMode
                                                        ? "text-white placeholder-slate-500"
                                                        : "text-slate-900 placeholder-slate-400"
                                                }`}
                                            />
                                        )}
                                    />
                                </div>
                                {errors.amount && (
                                    <div
                                        className={`absolute top-full left-0 mt-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-20 shadow-lg border ${
                                            isDarkMode
                                                ? "bg-red-900 text-red-200 border-red-700"
                                                : "bg-red-100 text-red-700 border-red-200"
                                        }`}>
                                        {errors.amount.message}
                                        <div
                                            className={`absolute bottom-full left-3 w-2 h-2 ${
                                                isDarkMode
                                                    ? "bg-red-900/90"
                                                    : "bg-red-100"
                                            }`}
                                            style={{
                                                clipPath:
                                                    "polygon(0 100%, 100% 100%, 50% 0)",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label
                            className={`block text-sm font-semibold mb-2.5 ${
                                isDarkMode ? "text-slate-300" : "text-slate-700"
                            }`}>
                            TITLE
                        </label>
                        <div className="relative">
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: "Title is required" }}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        {...field}
                                        placeholder="e.g. AWS Cloud Services"
                                        className={`w-full px-4 py-2.5 rounded-lg border font-medium ${
                                            isDarkMode
                                                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                                                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.title ? "border-red-500" : ""
                                        }`}
                                    />
                                )}
                            />
                            {errors.title && (
                                <div
                                    className={`absolute top-full left-0 mt-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-20 shadow-lg border ${
                                        isDarkMode
                                            ? "bg-red-900 text-red-200 border-red-700"
                                            : "bg-red-100 text-red-700 border-red-200"
                                    }`}>
                                    {errors.title.message}
                                    <div
                                        className={`absolute bottom-full left-3 w-2 h-2 ${
                                            isDarkMode
                                                ? "bg-red-900/90"
                                                : "bg-red-100"
                                        }`}
                                        style={{
                                            clipPath:
                                                "polygon(0 100%, 100% 100%, 50% 0)",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Short Description */}
                    <div>
                        <label
                            className={`block text-sm font-semibold mb-2.5 ${
                                isDarkMode ? "text-slate-300" : "text-slate-700"
                            }`}>
                            SHORT DESCRIPTION
                        </label>
                        <div className="relative">
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: "Description is required" }}
                                render={({ field }) => (
                                    <input
                                        type="text"
                                        {...field}
                                        placeholder="e.g. Monthly AWS Subscription"
                                        className={`w-full px-4 py-2.5 rounded-lg border font-medium ${
                                            isDarkMode
                                                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                                                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.description
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                )}
                            />
                            {errors.description && (
                                <div
                                    className={`absolute top-full left-0 mt-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-20 shadow-lg border ${
                                        isDarkMode
                                            ? "bg-red-900 text-red-200 border-red-700"
                                            : "bg-red-100 text-red-700 border-red-200"
                                    }`}>
                                    {errors.description.message}
                                    <div
                                        className={`absolute bottom-full left-3 w-2 h-2 ${
                                            isDarkMode
                                                ? "bg-red-900/90"
                                                : "bg-red-100"
                                        }`}
                                        style={{
                                            clipPath:
                                                "polygon(0 100%, 100% 100%, 50% 0)",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category (Only for Expense) - Dimmed and disabled for Income */}
                    <div>
                        <label
                            className={`block text-sm font-semibold mb-2.5 ${
                                isDarkMode ? "text-slate-300" : "text-slate-700"
                            } ${transactionType === "income" ? "opacity-50" : ""}`}>
                            CATEGORY
                        </label>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => {
                                const selectedCategory =
                                    TRANSACTION_CATEGORIES.find(
                                        (cat) => cat.id === field.value,
                                    );
                                const isDisabled = transactionType === "income";
                                return (
                                    <div className="relative">
                                        <button
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => {
                                                if (!isDisabled) {
                                                    setIsCategoryDropdownOpen(
                                                        !isCategoryDropdownOpen,
                                                    );
                                                }
                                            }}
                                            className={`w-full px-4 py-2.5 rounded-lg border font-medium flex justify-between items-center transition-all ${
                                                isDisabled
                                                    ? isDarkMode
                                                        ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50"
                                                        : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                                                    : isDarkMode
                                                      ? "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                                                      : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed`}>
                                            <span>
                                                {selectedCategory?.name ||
                                                    "Select Category"}
                                            </span>
                                            <svg
                                                className={`w-5 h-5 transition-transform duration-200 ${
                                                    isCategoryDropdownOpen &&
                                                    !isDisabled
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                />
                                            </svg>
                                        </button>
                                        <div
                                            className={`${
                                                isCategoryDropdownOpen &&
                                                !isDisabled
                                                    ? ""
                                                    : "hidden"
                                            } absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-10 max-h-48 overflow-y-auto ${
                                                isDarkMode
                                                    ? "bg-slate-700 border-slate-600"
                                                    : "bg-white border-slate-200"
                                            }`}>
                                            {TRANSACTION_CATEGORIES.filter(
                                                (cat) => cat.id !== "income",
                                            ).map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => {
                                                        field.onChange(cat.id);
                                                        setIsCategoryDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 font-medium transition-all first:rounded-t-lg last:rounded-b-lg ${
                                                        field.value === cat.id
                                                            ? isDarkMode
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-blue-100 text-blue-600"
                                                            : isDarkMode
                                                              ? "text-slate-300 hover:bg-slate-600"
                                                              : "text-slate-700 hover:bg-slate-100"
                                                    }`}>
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-[1.5] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm">
                            Add Transaction
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`flex-1 font-semibold py-3 rounded-xl transition-all ${
                                isDarkMode
                                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}>
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Smart Insights Section - Separate */}
                <div
                    className={`px-8 py-6 border-t ${
                        isDarkMode
                            ? "bg-slate-700/50 border-slate-700"
                            : "bg-slate-50 border-slate-200"
                    }`}>
                    <div className="flex gap-3 items-start">
                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <h4
                                className={`font-semibold text-sm mb-1 ${
                                    isDarkMode
                                        ? "text-blue-300"
                                        : "text-blue-600"
                                }`}>
                                Smart Insights
                            </h4>
                            <p
                                className={`text-xs leading-relaxed ${
                                    isDarkMode
                                        ? "text-slate-300"
                                        : "text-slate-600"
                                }`}>
                                Consistent tracking helps you identify spending
                                patterns. Adding descriptions improves your
                                financial analysis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom DatePicker Styling */}
            <style>{`
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .react-datepicker__input-container {
                    width: 100%;
                }
                
                /* Calendar Container */
                .react-datepicker {
                    border: 1px solid #cbd5e1;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    font-family: inherit;
                }
                
                /* Header styling */
                .react-datepicker__header {
                    background: linear-gradient(to right, #2563eb, #1d4ed8);
                    border: none;
                    border-radius: 0.75rem 0.75rem 0 0;
                    padding: 12px 16px;
                }
                
                .react-datepicker__current-month {
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                /* Day of week header */
                .react-datepicker__day-names {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 2px;
                    padding: 0 8px;
                    background: white;
                }
                
                .react-datepicker__day-name {
                    color: #64748b;
                    font-size: 12px;
                    font-weight: 600;
                    text-align: center;
                    padding: 6px 0;
                    text-transform: uppercase;
                }
                
                /* Days container */
                .react-datepicker__month {
                    margin: 0;
                    padding: 0 8px;
                }
                
                .react-datepicker__week {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 2px;
                }
                
                /* Individual day cells */
                .react-datepicker__day {
                    color: #1e293b;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5rem;
                    padding: 0 8px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 200ms ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 36px;
                }
                
                
                
                .react-datepicker__day--selected {
                    background: #2563eb;
                    border-color: #2563eb;
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
                }
                
                .react-datepicker__day--selected:hover {
                    background: #1d4ed8;
                    border-color: #1d4ed8;
                }
                
                .react-datepicker__day--today {
                    border: 2px solid #2563eb;
                    // color: #2563eb;
                    font-weight: 600;
                }
                
                .react-datepicker__day--outside-month {
                    color: #cbd5e1;
                    background: #f8fafc;
                    cursor: not-allowed;
                }
                
                .react-datepicker__day--outside-month:hover {
                    background: #f8fafc;
                    border-color: #e2e8f0;
                    color: #cbd5e1;
                }
                
                /* Navigation arrows */
                .react-datepicker__navigation {
                    top: 6px;
                    line-height: 1;
                    z-index: 1;
                }
                
                .react-datepicker__navigation--previous {
                    left: 12px;
                }
                
                .react-datepicker__navigation--next {
                    right: 12px;
                }
                
                .react-datepicker__navigation-icon::before {
                    content: '';
                    border-color: white;
                    border-width: 2px 2px 0 0;
                    display: block;
                    height: 8px;
                    width: 8px;
                }
                
                .react-datepicker__navigation--previous:hover .react-datepicker__navigation-icon::before,
                .react-datepicker__navigation--next:hover .react-datepicker__navigation-icon::before {
                    border-color: white;
                }
                
                /* Dark mode styling */
                ${
                    isDarkMode
                        ? `
        .react-datepicker {
            background-color: #1e293b;
            border-color: #334155;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .react-datepicker__header {
            background: linear-gradient(to right, #1e40af, #1e3a8a);
            border: none;
        }
        
        .react-datepicker__current-month {
            color: #e0e7ff;
        }
        
        .react-datepicker__day-names {
            background: #0f172a;
            border-bottom: 1px solid #334155;
        }
        
        .react-datepicker__day-name {
            color: #94a3b8;
        }
        
        .react-datepicker__month {
            background: #1e293b;
        }
        
        .react-datepicker__day {
            color: #e2e8f0;
            background: #334155;
            border-color: #475569;
        }
        
        .react-datepicker__day:hover {
            background: #1e40af;
            border-color: #2563eb;
            color: #000;
        }
        
        .react-datepicker__day--selected {
            background: #2563eb;
            border-color: #2563eb;
            color: white;
            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.4);
        }
        
        .react-datepicker__day--selected:hover {
            background: #1d4ed8;
        }
        
        .react-datepicker__day--today {
            border: 2px solid #60a5fa;
            color: #60a5fa;
        }
        
        .react-datepicker__day--outside-month {
            color: #64748b;
            background: #0f172a;
            cursor: not-allowed;
        }
        
        .react-datepicker__day--outside-month:hover {
            background: #0f172a;
            border-color: #334155;
            color: #64748b;
        }
    `
                        : ""
                }
`}</style>
        </div>
    );
};

export default AddTransactionModal;
