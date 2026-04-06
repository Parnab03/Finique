import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

const NUMBER_INPUT_NO_SPINNER =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

const ManageGoalsModal = ({ isOpen, onClose, existingGoals, onSaveGoals }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const [goals, setGoals] = useState(existingGoals);
    const [activeSection, setActiveSection] = useState("add");
    const [newGoal, setNewGoal] = useState({
        title: "",
        current: "",
        target: "",
        color: "#2563eb",
    });
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});

    const resetFormState = () => {
        setNewGoal({
            title: "",
            current: "",
            target: "",
            color: "#2563eb",
        });
        setErrors({});
        setEditingId(null);
        setActiveSection("add");
    };

    useEffect(() => {
        setGoals(existingGoals);

        if (!isOpen) {
            resetFormState();
        }
    }, [existingGoals, isOpen]);

    const colors = [
        "#2563eb",
        "#16a34a",
        "#f59e0b",
        "#8b5cf6",
        "#ec4899",
        "#06b6d4",
        "#ef4444",
        "#10b981",
    ];

    const inputBase = `${
        isDarkMode
            ? "bg-slate-700 border-slate-600 text-white"
            : "bg-white border-slate-200 text-slate-900"
    } rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`;

    const editInputBase = `${
        isDarkMode
            ? "bg-slate-600 border-slate-500 text-white"
            : "bg-white border-slate-300 text-slate-900"
    } rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`;

    const validateGoal = (goal) => {
        const nextErrors = {};
        const title = goal.title?.trim() ?? "";
        const currentText = String(goal.current ?? "").trim();
        const targetText = String(goal.target ?? "").trim();

        if (!title) nextErrors.title = "Title is required";
        if (!currentText) nextErrors.current = "Current amount is required";
        if (!targetText) nextErrors.target = "Target amount is required";

        const currentValue = Number(currentText);
        const targetValue = Number(targetText);

        if (currentText && Number.isNaN(currentValue)) {
            nextErrors.current = "Current amount must be a number";
        }
        if (targetText && Number.isNaN(targetValue)) {
            nextErrors.target = "Target amount must be a number";
        }
        if (
            !nextErrors.current &&
            !nextErrors.target &&
            currentText &&
            targetText &&
            currentValue > targetValue
        ) {
            nextErrors.target =
                "Target should be greater than or equal to current amount";
        }

        return { nextErrors, currentValue, targetValue, title };
    };

    const persistGoals = (updatedGoals) => {
        setGoals(updatedGoals);
        onSaveGoals(updatedGoals);
    };

    const handleAddGoal = () => {
        const { nextErrors, currentValue, targetValue, title } =
            validateGoal(newGoal);

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        const goal = {
            id: Date.now(),
            title,
            current: currentValue,
            target: targetValue,
            color: newGoal.color,
        };

        persistGoals([...goals, goal]);
        setNewGoal({
            title: "",
            current: "",
            target: "",
            color: "#2563eb",
        });
        setErrors({});
    };

    const handleUpdateGoalField = (id, field, rawValue) => {
        const updatedGoals = goals.map((goal) => {
            if (goal.id !== id) return goal;

            if (field === "current" || field === "target") {
                const parsed = Number(rawValue);
                return {
                    ...goal,
                    [field]: Number.isNaN(parsed) ? goal[field] : parsed,
                };
            }

            return { ...goal, [field]: rawValue };
        });

        persistGoals(updatedGoals);
    };

    const handleDeleteGoal = (id) => {
        const updatedGoals = goals.filter((goal) => goal.id !== id);
        persistGoals(updatedGoals);
    };

    const handleContainerBlur = (e) => {
        const nextFocused = e.relatedTarget;
        if (!e.currentTarget.contains(nextFocused)) {
            resetFormState();
        }
    };

    const handleClose = () => {
        resetFormState();
        onClose();
    };

    if (!isOpen) return null;

    const renderErrorBubble = (message) => (
        <div
            className={`absolute top-full left-0 mt-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-20 shadow-lg border ${
                isDarkMode
                    ? "bg-red-900/90 text-red-200 border-red-700"
                    : "bg-red-100 text-red-700 border-red-200"
            }`}>
            {message}
            <div
                className={`absolute bottom-full left-3 w-2 h-2 ${
                    isDarkMode ? "bg-red-900/90" : "bg-red-100"
                }`}
                style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 0)" }}
            />
        </div>
    );

    return (
        <div
            tabIndex={-1}
            onBlurCapture={handleContainerBlur}
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-[1200px] opacity-100 mb-8" : "max-h-0 opacity-0"
            }`}>
            <div
                className={`rounded-2xl border-2 shadow-lg overflow-hidden ${
                    isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-white border-slate-200"
                }`}>
                <div className="p-4 sm:p-8 pb-2 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <h2
                            className={`text-lg sm:text-2xl font-bold ${
                                isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            Manage Savings Goals
                        </h2>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <div
                                className={`flex gap-1 p-0.5 sm:p-1 rounded-full ${
                                    isDarkMode ? "bg-slate-700" : "bg-slate-100"
                                }`}>
                                <button
                                    onClick={() => setActiveSection("add")}
                                    className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                        activeSection === "add"
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : isDarkMode
                                              ? "text-blue-400"
                                              : "text-blue-600"
                                    }`}>
                                    <span>+</span>
                                    <span>Add Goal</span>
                                </button>
                                <button
                                    onClick={() => setActiveSection("manage")}
                                    className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                        activeSection === "manage"
                                            ? "bg-green-600 text-white shadow-lg"
                                            : isDarkMode
                                              ? "text-green-400"
                                              : "text-green-600"
                                    }`}>
                                    <span>✓</span>
                                    <span>Manage Goals</span>
                                </button>
                            </div>

                            <button
                                onClick={handleClose}
                                className={`text-xl font-extrabold transition-all hover:rotate-90 ${
                                    isDarkMode
                                        ? "text-slate-300 hover:text-white"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}>
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-8 pt-0 space-y-4 sm:space-y-6 max-h-[600px] overflow-y-auto">
                    {activeSection === "add" && (
                        <div className="space-y-4">
                            <div className="relative">
                                <label
                                    className={`block text-xs sm:text-sm font-semibold mb-1 sm:mb-2.5 ${
                                        isDarkMode
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }`}>
                                    TITLE
                                </label>
                                <input
                                    type="text"
                                    value={newGoal.title}
                                    onChange={(e) => {
                                        setNewGoal({
                                            ...newGoal,
                                            title: e.target.value,
                                        });
                                        if (errors.title) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                title: "",
                                            }));
                                        }
                                    }}
                                    placeholder="e.g., Laptop Fund"
                                    className={`w-full px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${inputBase} ${
                                        errors.title ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.title &&
                                    renderErrorBubble(errors.title)}
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <div className="relative">
                                    <label
                                        className={`block text-xs sm:text-sm font-semibold mb-1 sm:mb-2.5 ${
                                            isDarkMode
                                                ? "text-slate-300"
                                                : "text-slate-700"
                                        }`}>
                                        CURRENT AMOUNT
                                    </label>
                                    <div
                                        className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm ${inputBase} ${
                                            errors.current
                                                ? "border-red-500"
                                                : ""
                                        }`}>
                                        <span
                                            className={`text-lg font-bold flex-shrink-0 ${
                                                isDarkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-600"
                                            }`}>
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            value={newGoal.current}
                                            onChange={(e) => {
                                                setNewGoal({
                                                    ...newGoal,
                                                    current: e.target.value,
                                                });
                                                if (errors.current) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        current: "",
                                                    }));
                                                }
                                            }}
                                            placeholder="0"
                                            className={`w-full ml-2 bg-transparent border-none outline-none ${NUMBER_INPUT_NO_SPINNER} ${
                                                isDarkMode
                                                    ? "text-white placeholder-slate-400"
                                                    : "text-slate-900 placeholder-slate-500"
                                            }`}
                                        />
                                    </div>
                                    {errors.current &&
                                        renderErrorBubble(errors.current)}
                                </div>

                                <div className="relative">
                                    <label
                                        className={`block text-xs sm:text-sm font-semibold mb-1 sm:mb-2.5 ${
                                            isDarkMode
                                                ? "text-slate-300"
                                                : "text-slate-700"
                                        }`}>
                                        TARGET AMOUNT
                                    </label>
                                    <div
                                        className={`flex items-center px-2 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm ${inputBase} ${
                                            errors.target
                                                ? "border-red-500"
                                                : ""
                                        }`}>
                                        <span
                                            className={`text-lg font-bold flex-shrink-0 ${
                                                isDarkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-600"
                                            }`}>
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            value={newGoal.target}
                                            onChange={(e) => {
                                                setNewGoal({
                                                    ...newGoal,
                                                    target: e.target.value,
                                                });
                                                if (errors.target) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        target: "",
                                                    }));
                                                }
                                            }}
                                            placeholder="0"
                                            className={`w-full ml-2 bg-transparent border-none outline-none ${NUMBER_INPUT_NO_SPINNER} ${
                                                isDarkMode
                                                    ? "text-white placeholder-slate-400"
                                                    : "text-slate-900 placeholder-slate-500"
                                            }`}
                                        />
                                    </div>
                                    {errors.target &&
                                        renderErrorBubble(errors.target)}
                                </div>
                            </div>

                            <div>
                                <label
                                    className={`block text-xs sm:text-sm font-semibold mb-1 sm:mb-2.5 ${
                                        isDarkMode
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }`}>
                                    GOAL COLOR
                                </label>
                                <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() =>
                                                setNewGoal({
                                                    ...newGoal,
                                                    color,
                                                })
                                            }
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                                                newGoal.color === color
                                                    ? "border-slate-300 scale-110"
                                                    : "border-transparent"
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAddGoal}
                                className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 active:scale-95 transition-all duration-150">
                                Add Goal
                            </button>
                        </div>
                    )}

                    {activeSection === "manage" && (
                        <div>
                            {goals.length === 0 ? (
                                <p
                                    className={`text-center py-8 text-lg ${
                                        isDarkMode
                                            ? "text-slate-400"
                                            : "text-slate-500"
                                    }`}>
                                    No goals yet. Add one in the Add section.
                                </p>
                            ) : (
                                <div className="space-y-2 sm:space-y-3">
                                    {goals.map((goal) => (
                                        <div
                                            key={goal.id}
                                            className={`p-2 sm:p-4 rounded-lg border transition-all ${
                                                isDarkMode
                                                    ? "bg-slate-700 border-slate-600 hover:bg-slate-650"
                                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                            }`}>
                                            {editingId === goal.id ? (
                                                <div className="space-y-2 sm:space-y-3">
                                                    <input
                                                        type="text"
                                                        value={goal.title}
                                                        onChange={(e) =>
                                                            handleUpdateGoalField(
                                                                goal.id,
                                                                "title",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm ${editInputBase}`}
                                                    />
                                                    <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                                                        <input
                                                            type="number"
                                                            value={goal.current}
                                                            onChange={(e) =>
                                                                handleUpdateGoalField(
                                                                    goal.id,
                                                                    "current",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ${editInputBase} ${NUMBER_INPUT_NO_SPINNER}`}
                                                        />
                                                        <input
                                                            type="number"
                                                            value={goal.target}
                                                            onChange={(e) =>
                                                                handleUpdateGoalField(
                                                                    goal.id,
                                                                    "target",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={`w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ${editInputBase} ${NUMBER_INPUT_NO_SPINNER}`}
                                                        />
                                                    </div>
                                                    <div className="flex gap-1.5 sm:gap-2">
                                                        <button
                                                            onClick={() =>
                                                                setEditingId(
                                                                    null,
                                                                )
                                                            }
                                                            className="flex-1 bg-green-600 text-white py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold hover:bg-green-700 active:scale-95 transition-all">
                                                            Done
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setEditingId(
                                                                    null,
                                                                )
                                                            }
                                                            className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-semibold border-2 transition-all ${
                                                                isDarkMode
                                                                    ? "border-slate-600 text-slate-300 hover:bg-slate-600"
                                                                    : "border-slate-300 text-slate-600 hover:bg-slate-100"
                                                            }`}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                                                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                                        <div
                                                            className="w-4 h-4 rounded-full flex-shrink-0"
                                                            style={{
                                                                backgroundColor:
                                                                    goal.color,
                                                            }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p
                                                                className={`font-semibold truncate text-xs sm:text-base ${
                                                                    isDarkMode
                                                                        ? "text-white"
                                                                        : "text-slate-900"
                                                                }`}>
                                                                {goal.title}
                                                            </p>
                                                            <p
                                                                className={`text-xs sm:text-sm ${
                                                                    isDarkMode
                                                                        ? "text-slate-400"
                                                                        : "text-slate-600"
                                                                }`}>
                                                                ₹
                                                                {goal.current.toLocaleString()}{" "}
                                                                / ₹
                                                                {goal.target.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 sm:gap-3 justify-start sm:justify-center flex-shrink-0">
                                                        <button
                                                            onClick={() =>
                                                                setEditingId(
                                                                    goal.id,
                                                                )
                                                            }
                                                            className={`p-2 rounded-lg transition-all duration-200 ${
                                                                isDarkMode
                                                                    ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                                                                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                                                            }`}
                                                            aria-label="Edit goal">
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
                                                            onClick={() =>
                                                                handleDeleteGoal(
                                                                    goal.id,
                                                                )
                                                            }
                                                            className={`p-2 rounded-lg transition-all duration-200 ${
                                                                isDarkMode
                                                                    ? "hover:bg-slate-700 text-slate-400 hover:text-red-400"
                                                                    : "hover:bg-slate-100 text-slate-600 hover:text-red-600"
                                                            }`}
                                                            aria-label="Delete goal">
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
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageGoalsModal;
