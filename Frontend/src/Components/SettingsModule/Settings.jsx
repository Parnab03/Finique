import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import { TransactionContext } from "../../Context/TransactionContext";
import { AuthContext } from "../../Context/AuthContext";

const STORAGE_KEY = "finique_settings_v1";

const PRESET_OPTIONS = [
    {
        id: "no-presets",
        title: "No Presets",
        fileName: "none",
        description:
            "Start fresh - no presets are chosen. Add your own transactions.",
    },
    {
        id: "student-budget", // Changed from "preset-student"
        title: "Student Budget",
        fileName: "student-budget.json",
        description: "Low income, controlled spending, savings-first profile.",
    },
    {
        id: "family-planner", // Changed from "preset-family"
        title: "Family Planner",
        fileName: "family-planner.json",
        description: "Household essentials, bills, and monthly planning flow.",
    },
    {
        id: "freelancer-flow", // Changed from "preset-freelancer"
        title: "Freelancer Flow",
        fileName: "freelancer-flow.json",
        description: "Irregular income with tax and buffer-oriented structure.",
    },
    {
        id: "small-business", // Changed from "preset-business"
        title: "Small Business",
        fileName: "small-business.json",
        description:
            "Revenue-expense split with operational category defaults.",
    },
    {
        id: "minimal-tracker", // Changed from "preset-minimal"
        title: "Minimal Tracker",
        fileName: "minimal-tracker.json",
        description: "Simple setup for essential income and expense tracking.",
    },
];

const Settings = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const { loadPresetData, reloadTransactions } =
        useContext(TransactionContext);
    const { isGuest, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [profileImage, setProfileImage] = useState("");
    const [userName, setUserName] = useState("Admin Profile");
    const [userPassword, setUserPassword] = useState("");
    const [viewerName, setViewerName] = useState("Public Viewer");
    const [viewerPassword, setViewerPassword] = useState("");
    const [selectedPreset, setSelectedPreset] = useState("no-presets");

    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const [isEditingName, setIsEditingName] = useState(false);
    const [draftUserName, setDraftUserName] = useState("Admin Profile");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [viewerProfileImage, setViewerProfileImage] = useState("");
    const [isEditingViewerName, setIsEditingViewerName] = useState(false);
    const [draftViewerName, setDraftViewerName] = useState("Public Viewer");
    const [viewerNewPassword, setViewerNewPassword] = useState("");
    const [viewerConfirmPassword, setViewerConfirmPassword] = useState("");
    const viewerFileInputRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const fileInputRef = useRef(null);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // Set guest names if in guest mode
            if (isGuest) {
                setUserName("Guest Admin");
                setViewerName("Guest Viewer");
                setDraftUserName("Guest Admin");
                setDraftViewerName("Guest Viewer");
            }
            // Set default preset to "no-presets" for new users
            setSelectedPreset("no-presets");
            return;
        }

        try {
            const saved = JSON.parse(raw);

            // If guest mode, show guest names
            if (isGuest) {
                setUserName("Guest Admin");
                setViewerName("Guest Viewer");
                setDraftUserName("Guest Admin");
                setDraftViewerName("Guest Viewer");
                setUserPassword("");
                setViewerPassword("");
            } else {
                const savedName = saved.userName || "Admin Profile";
                setProfileImage(saved.profileImage || "");
                setUserName(savedName);
                setDraftUserName(savedName);
                setUserPassword(saved.userPassword || "");
                setViewerName(saved.viewerName || "Public Viewer");
                setDraftViewerName(saved.viewerName || "Public Viewer");
                setViewerProfileImage(saved.viewerProfileImage || "");
                setViewerPassword(saved.viewerPassword || "");
            }
            setSelectedPreset(saved.selectedPreset || "no-presets");
        } catch {
            // Ignore malformed storage
            setSelectedPreset("no-presets");
        }
    }, [isGuest]);

    const cardClass = `${
        isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
    } rounded-2xl border p-6`;

    const inputClass = `${
        isDarkMode
            ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
            : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500"
    } w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500`;

    const labelClass = `${
        isDarkMode ? "text-slate-300" : "text-slate-700"
    } text-sm font-semibold mb-2 block`;

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

    const validateAdminProfile = () => {
        const nextErrors = {};

        if (!draftUserName.trim()) {
            nextErrors.draftUserName = "Name is required";
        }

        if (newPassword.trim() || confirmPassword.trim()) {
            if (!newPassword.trim()) {
                nextErrors.newPassword = "New password is required";
            }
            if (!confirmPassword.trim()) {
                nextErrors.confirmPassword = "Confirm password is required";
            }
            if (
                newPassword.trim() &&
                confirmPassword.trim() &&
                newPassword !== confirmPassword
            ) {
                nextErrors.confirmPassword = "Passwords do not match";
            }
            if (newPassword.trim() && newPassword.length < 6) {
                nextErrors.newPassword =
                    "Password must be at least 6 characters";
            }
        }

        setErrors((prev) => ({ ...prev, ...nextErrors }));
        return Object.keys(nextErrors).length === 0;
    };

    const validateDelete = () => {
        const adminPassword = userPassword.trim();

        if (!adminPassword) {
            setErrors((prev) => ({
                ...prev,
                deleteConfirmText:
                    "Set an Admin Profile password first before deleting the account.",
            }));
            return false;
        }

        if (deleteConfirmText !== adminPassword) {
            setErrors((prev) => ({
                ...prev,
                deleteConfirmText: "Admin password does not match.",
            }));
            return false;
        }

        return true;
    };

    const saveSettings = () => {
        const payload = {
            profileImage,
            userName,
            userPassword,
            viewerName,
            viewerPassword,
            viewerProfileImage,
            selectedPreset,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setStatusMessage("Settings saved successfully.");
        setTimeout(() => setStatusMessage(""), 2000);
    };

    const onProfileImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageData = String(reader.result || "");
            setProfileImage(imageData);
            // Auto-save after image upload
            setTimeout(() => {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        profileImage: imageData,
                        userName,
                        userPassword,
                        viewerName,
                        viewerPassword,
                        viewerProfileImage,
                        selectedPreset,
                    }),
                );
            }, 0);
        };
        reader.readAsDataURL(file);
    };

    const openImagePicker = () => {
        fileInputRef.current?.click();
    };

    const handleNameSave = () => {
        setTouched((prev) => ({ ...prev, draftUserName: true }));

        if (!draftUserName.trim()) {
            setErrors((prev) => ({
                ...prev,
                draftUserName: "Name is required",
            }));
            return;
        }

        const newName = draftUserName.trim();
        setUserName(newName);
        setErrors((prev) => ({ ...prev, draftUserName: "" }));
        setIsEditingName(false);

        // Auto-save after name change
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                profileImage,
                userName: newName,
                userPassword,
                viewerName,
                viewerPassword,
                viewerProfileImage,
                selectedPreset,
            }),
        );
    };

    const canSetNewPassword =
        newPassword.trim() !== "" && confirmPassword.trim() !== "";

    const handleSetNewPassword = () => {
        setTouched((prev) => ({
            ...prev,
            newPassword: true,
            confirmPassword: true,
        }));

        if (!validateAdminProfile()) return;
        if (!newPassword.trim() || !confirmPassword.trim()) return;

        setUserPassword(newPassword);
        setNewPassword("");
        setConfirmPassword("");
        setErrors((prev) => ({
            ...prev,
            newPassword: "",
            confirmPassword: "",
        }));

        // Auto-save after password change
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                profileImage,
                userName,
                userPassword: newPassword,
                viewerName,
                viewerPassword,
                viewerProfileImage,
                selectedPreset,
            }),
        );

        setStatusMessage("Password updated successfully.");
        setTimeout(() => setStatusMessage(""), 2000);
    };

    const openViewerImagePicker = () => {
        viewerFileInputRef.current?.click();
    };

    const onViewerProfileImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageData = String(reader.result || "");
            setViewerProfileImage(imageData);
            // Auto-save after image upload
            setTimeout(() => {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        profileImage,
                        userName,
                        userPassword,
                        viewerName,
                        viewerPassword,
                        viewerProfileImage: imageData,
                        selectedPreset,
                    }),
                );
            }, 0);
        };
        reader.readAsDataURL(file);
    };

    const handleViewerNameSave = () => {
        setTouched((prev) => ({ ...prev, draftViewerName: true }));

        if (!draftViewerName.trim()) {
            setErrors((prev) => ({
                ...prev,
                draftViewerName: "Viewer name is required",
            }));
            return;
        }

        const newViewerName = draftViewerName.trim();
        setViewerName(newViewerName);
        setErrors((prev) => ({ ...prev, draftViewerName: "" }));
        setIsEditingViewerName(false);

        // Auto-save after viewer name change
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                profileImage,
                userName,
                userPassword,
                viewerName: newViewerName,
                viewerPassword,
                viewerProfileImage,
                selectedPreset,
            }),
        );
    };

    const canSetViewerNewPassword =
        viewerNewPassword.trim() !== "" && viewerConfirmPassword.trim() !== "";

    const handleSetViewerNewPassword = () => {
        setTouched((prev) => ({
            ...prev,
            viewerNewPassword: true,
            viewerConfirmPassword: true,
        }));

        const nextErrors = {};

        if (!viewerNewPassword.trim()) {
            nextErrors.viewerNewPassword = "New password is required";
        }
        if (!viewerConfirmPassword.trim()) {
            nextErrors.viewerConfirmPassword = "Confirm password is required";
        }
        if (
            viewerNewPassword.trim() &&
            viewerConfirmPassword.trim() &&
            viewerNewPassword !== viewerConfirmPassword
        ) {
            nextErrors.viewerConfirmPassword = "Passwords do not match";
        }
        if (viewerNewPassword.trim() && viewerNewPassword.length < 6) {
            nextErrors.viewerNewPassword =
                "Password must be at least 6 characters";
        }

        setErrors((prev) => ({ ...prev, ...nextErrors }));
        if (Object.keys(nextErrors).length > 0) return;

        setViewerPassword(viewerNewPassword);
        setViewerNewPassword("");
        setViewerConfirmPassword("");
        setErrors((prev) => ({
            ...prev,
            viewerNewPassword: "",
            viewerConfirmPassword: "",
        }));

        // Auto-save after viewer password change
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                profileImage,
                userName,
                userPassword,
                viewerName,
                viewerPassword: viewerNewPassword,
                viewerProfileImage,
                selectedPreset,
            }),
        );

        setStatusMessage("Viewer password updated successfully.");
        setTimeout(() => setStatusMessage(""), 2000);
    };

    const deleteAccount = () => {
        setTouched((prev) => ({ ...prev, deleteConfirmText: true }));

        if (!validateDelete()) {
            setStatusMessage(
                "Enter the correct Admin Profile password to delete account.",
            );
            setTimeout(() => setStatusMessage(""), 2000);
            return;
        }

        // Delete all data from localStorage
        localStorage.clear();

        // Call logout to clear auth context
        logout();

        // Navigate to sign-in page
        navigate("/signin");
    };

    const handleUsePreset = async (presetId) => {
        try {
            // Special case: No Presets - restore custom data
            if (presetId === "no-presets") {
                setSelectedPreset("no-presets");
                setStatusMessage(
                    "✓ No preset selected. Switched to your custom data!",
                );
                setTimeout(() => setStatusMessage(""), 2000);

                // Clear goals from localStorage when no preset is selected
                localStorage.removeItem("finique_goals");

                // Save to localStorage
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        profileImage,
                        userName,
                        userPassword,
                        viewerName,
                        viewerPassword,
                        viewerProfileImage,
                        selectedPreset: "no-presets",
                        updatedAt: new Date().toISOString(),
                    }),
                );

                // Reload transactions from custom storage
                setTimeout(() => reloadTransactions(), 0);
                return;
            }

            const presetData = await loadPresetData(presetId);
            if (presetData) {
                setSelectedPreset(presetId);
                setStatusMessage(
                    `✓ Preset "${presetData.name}" loaded successfully!`,
                );
                setTimeout(() => setStatusMessage(""), 2000);

                // Save to localStorage
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        profileImage,
                        userName,
                        userPassword,
                        viewerName,
                        viewerPassword,
                        viewerProfileImage,
                        selectedPreset: presetId,
                        updatedAt: new Date().toISOString(),
                    }),
                );

                // Reload transactions from preset storage
                setTimeout(() => reloadTransactions(), 0);
            } else {
                setStatusMessage("✗ Failed to load preset. Please try again.");
                setTimeout(() => setStatusMessage(""), 2000);
            }
        } catch (error) {
            console.error("Error loading preset:", error);
            setStatusMessage("✗ Error loading preset.");
            setTimeout(() => setStatusMessage(""), 2000);
        }
    };

    const getSettingsPayload = () => ({
        profileImage,
        userName,
        userPassword,
        viewerName,
        viewerPassword,
        viewerProfileImage,
        selectedPreset,
        updatedAt: new Date().toISOString(),
    });

    const handleDownloadBackup = () => {
        try {
            const payload = getSettingsPayload();
            const blob = new Blob([JSON.stringify(payload, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "finique-settings-backup.json";
            a.click();
            URL.revokeObjectURL(url);

            setStatusMessage("Backup downloaded successfully.");
            setTimeout(() => setStatusMessage(""), 2000);
        } catch {
            setStatusMessage("Unable to generate backup file.");
            setTimeout(() => setStatusMessage(""), 2000);
        }
    };

    const storageRaw = localStorage.getItem(STORAGE_KEY) || "";
    const storageSizeKb = (new Blob([storageRaw]).size / 1024).toFixed(2);
    const isAdminPasswordSet = userPassword.trim().length > 0;
    const isViewerPasswordSet = viewerPassword.trim().length > 0;
    const isPresetSelected = selectedPreset.trim().length > 0;

    return (
        <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Guest Mode Notice */}
            {isGuest && (
                <div
                    className={`rounded-lg p-4 border ${
                        isDarkMode
                            ? "bg-amber-900/30 border-amber-700 text-amber-300"
                            : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}>
                    <div className="flex items-start gap-3">
                        <svg
                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <p className="font-semibold">
                                You're using Guest Mode
                            </p>
                            <p className="text-sm mt-1">
                                Account creation is disabled in guest mode. Sign
                                in or create an account to manage profiles.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {statusMessage && (
                <div className="fixed top-[86px] right-3 sm:right-6 z-50">
                    <div
                        className={`rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium shadow-lg border backdrop-blur-sm transition-all duration-500 ${
                            statusMessage.includes("X")
                                ? isDarkMode
                                    ? "bg-red-900/90 text-red-200 border-red-700"
                                    : "bg-red-50 text-red-700 border-red-200"
                                : isDarkMode
                                  ? "bg-blue-900/40 text-blue-300 border-blue-700/50"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                        {statusMessage}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className={cardClass}>
                    <h2
                        className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        Admin Profile
                    </h2>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="relative flex-shrink-0">
                            <div
                                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border ${
                                    isDarkMode
                                        ? "border-slate-600 bg-slate-700"
                                        : "border-slate-300 bg-slate-100"
                                }`}>
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        viewBox="0 0 120 120"
                                        className="w-full h-full">
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="60"
                                            fill={
                                                isDarkMode
                                                    ? "#334155"
                                                    : "#e2e8f0"
                                            }
                                        />
                                        <circle
                                            cx="60"
                                            cy="46"
                                            r="18"
                                            fill={
                                                isDarkMode
                                                    ? "#94a3b8"
                                                    : "#64748b"
                                            }
                                        />
                                        <path
                                            d="M24 98c6-18 22-28 36-28s30 10 36 28"
                                            fill={
                                                isDarkMode
                                                    ? "#94a3b8"
                                                    : "#64748b"
                                            }
                                        />
                                    </svg>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={isGuest}
                                onClick={openImagePicker}
                                className={`absolute -bottom-1 -right-1 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                                    isGuest
                                        ? isDarkMode
                                            ? "bg-slate-600 border-slate-700 text-slate-400 cursor-not-allowed"
                                            : "bg-slate-400 border-slate-300 text-slate-300 cursor-not-allowed"
                                        : isDarkMode
                                          ? "bg-blue-600 border-slate-800 text-white hover:bg-blue-700"
                                          : "bg-blue-600 border-white text-white hover:bg-blue-700"
                                }`}
                                aria-label="Change profile image">
                                <svg
                                    width="14"
                                    height="14"
                                    className="sm:w-4 sm:h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onProfileImageUpload}
                                className="hidden"
                            />
                        </div>

                        <div className="flex-1 w-full sm:w-auto">
                            {!isEditingName ? (
                                <div className="flex items-center gap-2">
                                    <p
                                        className={`text-base sm:text-lg font-semibold ${
                                            isDarkMode
                                                ? "text-slate-100"
                                                : "text-slate-900"
                                        }`}>
                                        {userName}
                                    </p>
                                    <button
                                        type="button"
                                        disabled={isGuest}
                                        onClick={() => {
                                            setDraftUserName(userName);
                                            setIsEditingName(true);
                                        }}
                                        className={`p-2 rounded-lg transition-all ${
                                            isGuest
                                                ? isDarkMode
                                                    ? "text-slate-600 cursor-not-allowed"
                                                    : "text-slate-400 cursor-not-allowed"
                                                : isDarkMode
                                                  ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                        aria-label="Edit name">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="flex items-center gap-2">
                                        <input
                                            className={`${inputClass} ${
                                                errors.draftUserName
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                            value={draftUserName}
                                            onChange={(e) => {
                                                setDraftUserName(
                                                    e.target.value,
                                                );
                                                if (errors.draftUserName) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        draftUserName: "",
                                                    }));
                                                }
                                            }}
                                            onBlur={() =>
                                                setTouched((prev) => ({
                                                    ...prev,
                                                    draftUserName: true,
                                                }))
                                            }
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                handleNameSave()
                                            }
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={handleNameSave}
                                            className="px-3 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
                                            Save
                                        </button>
                                    </div>
                                    {touched.draftUserName &&
                                        errors.draftUserName &&
                                        renderErrorBubble(errors.draftUserName)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative mb-3 sm:mb-4">
                        <label className={`${labelClass} text-xs sm:text-sm`}>
                            Set New Password
                        </label>
                        <input
                            type="password"
                            disabled={isGuest}
                            className={`${inputClass} py-1.5 sm:py-2.5 text-xs sm:text-sm ${
                                errors.newPassword ? "border-red-500" : ""
                            } ${isGuest ? "opacity-50 cursor-not-allowed" : ""}`}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (errors.newPassword) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        newPassword: "",
                                    }));
                                }
                            }}
                            onBlur={() =>
                                setTouched((prev) => ({
                                    ...prev,
                                    newPassword: true,
                                }))
                            }
                            placeholder="Enter new password"
                        />
                        {touched.newPassword &&
                            errors.newPassword &&
                            renderErrorBubble(errors.newPassword)}
                    </div>

                    <div className="relative mb-3 sm:mb-4">
                        <label className={`${labelClass} text-xs sm:text-sm`}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            disabled={isGuest}
                            className={`${inputClass} py-1.5 sm:py-2.5 text-xs sm:text-sm ${
                                errors.confirmPassword ? "border-red-500" : ""
                            } ${isGuest ? "opacity-50 cursor-not-allowed" : ""}`}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirmPassword) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        confirmPassword: "",
                                    }));
                                }
                            }}
                            onBlur={() =>
                                setTouched((prev) => ({
                                    ...prev,
                                    confirmPassword: true,
                                }))
                            }
                            placeholder="Re-enter new password"
                        />
                        {touched.confirmPassword &&
                            errors.confirmPassword &&
                            renderErrorBubble(errors.confirmPassword)}
                    </div>

                    <button
                        type="button"
                        onClick={handleSetNewPassword}
                        disabled={!canSetNewPassword || isGuest}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                            canSetNewPassword && !isGuest
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-slate-400 text-white cursor-not-allowed opacity-60"
                        }`}>
                        Set Password
                    </button>
                </section>

                <section className={cardClass}>
                    <h2
                        className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        Viewer Profile
                    </h2>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="relative flex-shrink-0">
                            <div
                                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border ${
                                    isDarkMode
                                        ? "border-slate-600 bg-slate-700"
                                        : "border-slate-300 bg-slate-100"
                                }`}>
                                {viewerProfileImage ? (
                                    <img
                                        src={viewerProfileImage}
                                        alt="Viewer Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        viewBox="0 0 120 120"
                                        className="w-full h-full">
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="60"
                                            fill={
                                                isDarkMode
                                                    ? "#334155"
                                                    : "#e2e8f0"
                                            }
                                        />
                                        <circle
                                            cx="60"
                                            cy="46"
                                            r="18"
                                            fill={
                                                isDarkMode
                                                    ? "#94a3b8"
                                                    : "#64748b"
                                            }
                                        />
                                        <path
                                            d="M24 98c6-18 22-28 36-28s30 10 36 28"
                                            fill={
                                                isDarkMode
                                                    ? "#94a3b8"
                                                    : "#64748b"
                                            }
                                        />
                                    </svg>
                                )}
                            </div>

                            <button
                                type="button"
                                disabled={isGuest}
                                onClick={openViewerImagePicker}
                                className={`absolute -bottom-1 -right-1 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                                    isGuest
                                        ? isDarkMode
                                            ? "bg-slate-600 border-slate-700 text-slate-400 cursor-not-allowed"
                                            : "bg-slate-400 border-slate-300 text-slate-300 cursor-not-allowed"
                                        : isDarkMode
                                          ? "bg-blue-600 border-slate-800 text-white hover:bg-blue-700"
                                          : "bg-blue-600 border-white text-white hover:bg-blue-700"
                                }`}
                                aria-label="Change viewer profile image">
                                <svg
                                    width="14"
                                    height="14"
                                    className="sm:w-4 sm:h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </button>

                            <input
                                ref={viewerFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onViewerProfileImageUpload}
                                className="hidden"
                            />
                        </div>

                        <div className="flex-1 w-full sm:w-auto">
                            {!isEditingViewerName ? (
                                <div className="flex items-center gap-2">
                                    <p
                                        className={`text-base sm:text-lg font-semibold truncate ${
                                            isDarkMode
                                                ? "text-slate-100"
                                                : "text-slate-900"
                                        }`}>
                                        {viewerName}
                                    </p>
                                    <button
                                        type="button"
                                        disabled={isGuest}
                                        onClick={() => {
                                            setDraftViewerName(viewerName);
                                            setIsEditingViewerName(true);
                                        }}
                                        className={`p-2 rounded-lg transition-all ${
                                            isGuest
                                                ? isDarkMode
                                                    ? "text-slate-600 cursor-not-allowed"
                                                    : "text-slate-400 cursor-not-allowed"
                                                : isDarkMode
                                                  ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                        aria-label="Edit viewer name">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="flex items-center gap-2">
                                        <input
                                            className={`${inputClass} ${
                                                errors.draftViewerName
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                            value={draftViewerName}
                                            onChange={(e) => {
                                                setDraftViewerName(
                                                    e.target.value,
                                                );
                                                if (errors.draftViewerName) {
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        draftViewerName: "",
                                                    }));
                                                }
                                            }}
                                            onBlur={() =>
                                                setTouched((prev) => ({
                                                    ...prev,
                                                    draftViewerName: true,
                                                }))
                                            }
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                handleViewerNameSave()
                                            }
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={handleViewerNameSave}
                                            className="px-3 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
                                            Save
                                        </button>
                                    </div>
                                    {touched.draftViewerName &&
                                        errors.draftViewerName &&
                                        renderErrorBubble(
                                            errors.draftViewerName,
                                        )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative mb-3 sm:mb-4">
                        <label className={`${labelClass} text-xs sm:text-sm`}>
                            Set New Viewer Password
                        </label>
                        <input
                            type="password"
                            disabled={isGuest}
                            className={`${inputClass} py-1.5 sm:py-2.5 text-xs sm:text-sm ${
                                errors.viewerNewPassword ? "border-red-500" : ""
                            } ${isGuest ? "opacity-50 cursor-not-allowed" : ""}`}
                            value={viewerNewPassword}
                            onChange={(e) => {
                                setViewerNewPassword(e.target.value);
                                if (errors.viewerNewPassword) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        viewerNewPassword: "",
                                    }));
                                }
                            }}
                            onBlur={() =>
                                setTouched((prev) => ({
                                    ...prev,
                                    viewerNewPassword: true,
                                }))
                            }
                            placeholder="Enter new viewer password"
                        />
                        {touched.viewerNewPassword &&
                            errors.viewerNewPassword &&
                            renderErrorBubble(errors.viewerNewPassword)}
                    </div>

                    <div className="relative mb-3 sm:mb-4">
                        <label className={`${labelClass} text-xs sm:text-sm`}>
                            Confirm Viewer Password
                        </label>
                        <input
                            type="password"
                            disabled={isGuest}
                            className={`${inputClass} py-1.5 sm:py-2.5 text-xs sm:text-sm ${
                                errors.viewerConfirmPassword
                                    ? "border-red-500"
                                    : ""
                            } ${isGuest ? "opacity-50 cursor-not-allowed" : ""}`}
                            value={viewerConfirmPassword}
                            onChange={(e) => {
                                setViewerConfirmPassword(e.target.value);
                                if (errors.viewerConfirmPassword) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        viewerConfirmPassword: "",
                                    }));
                                }
                            }}
                            onBlur={() =>
                                setTouched((prev) => ({
                                    ...prev,
                                    viewerConfirmPassword: true,
                                }))
                            }
                            placeholder="Re-enter viewer password"
                        />
                        {touched.viewerConfirmPassword &&
                            errors.viewerConfirmPassword &&
                            renderErrorBubble(errors.viewerConfirmPassword)}
                    </div>

                    <button
                        type="button"
                        onClick={handleSetViewerNewPassword}
                        disabled={!canSetViewerNewPassword || isGuest}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                            canSetViewerNewPassword && !isGuest
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-slate-400 text-white cursor-not-allowed opacity-60"
                        }`}>
                        <span className="hidden sm:inline">
                            Set Viewer Password
                        </span>
                        <span className="sm:hidden">Set Password</span>
                    </button>
                </section>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className={cardClass}>
                    <h2
                        className={`text-lg sm:text-xl font-semibold mb-2 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        User Presets
                    </h2>

                    <p
                        className={`text-xs sm:text-sm mb-3 sm:mb-4 ${
                            isDarkMode ? "text-slate-300" : "text-slate-600"
                        }`}>
                        Pick one preset. These presets will be linked to JSON
                        files and will reflect across all modules once those
                        files are added.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                        {PRESET_OPTIONS.map((preset) => {
                            const isSelected = selectedPreset === preset.id;

                            return (
                                <div
                                    key={preset.id}
                                    className={`rounded-xl border p-2.5 sm:p-3 transition-all ${
                                        isSelected
                                            ? isDarkMode
                                                ? "border-blue-500 bg-blue-900/20"
                                                : "border-blue-400 bg-blue-50"
                                            : isDarkMode
                                              ? "border-slate-700 bg-slate-900/30"
                                              : "border-slate-200 bg-slate-50"
                                    }`}>
                                    <p
                                        className={`font-semibold text-xs sm:text-sm ${
                                            isDarkMode
                                                ? "text-slate-100"
                                                : "text-slate-900"
                                        }`}>
                                        {preset.title}
                                    </p>
                                    <p
                                        className={`text-xs mt-1 ${
                                            isDarkMode
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }`}>
                                        {preset.fileName}
                                    </p>
                                    <p
                                        className={`text-xs mt-1.5 sm:mt-2 min-h-[48px] line-clamp-4 ${
                                            isDarkMode
                                                ? "text-slate-300"
                                                : "text-slate-600"
                                        }`}>
                                        {preset.description}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleUsePreset(preset.id)
                                        }
                                        className={`mt-2 sm:mt-3 w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all ${
                                            isSelected
                                                ? "bg-green-600 text-white"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}>
                                        {isSelected ? "Active" : "Use Preset"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={saveSettings}
                        className={`w-full mt-3 sm:mt-4 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all ${
                            isDarkMode
                                ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                        }`}>
                        Save Settings
                    </button>
                </section>

                <section className={cardClass}>
                    <h2
                        className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        Information & Security
                    </h2>

                    <div
                        className={`rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border ${
                            isDarkMode
                                ? "bg-slate-700/50 border-slate-600 text-slate-200"
                                : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}>
                        <div className="flex items-start gap-3">
                            <svg
                                className="mt-0.5 shrink-0"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true">
                                <path d="M12 3a9 9 0 1 0 9 9" />
                                <path d="M12 7v5" />
                                <circle cx="12" cy="16.5" r="1" />
                                <path d="M21 3v6" />
                                <path d="M18 6h6" />
                            </svg>
                            <div>
                                <p className="font-semibold mb-1 text-xs sm:text-sm">
                                    How your data is handled
                                </p>
                                <p className="text-xs sm:text-sm leading-relaxed">
                                    Your profile, passwords, and preset
                                    preferences are stored in browser local
                                    storage on this device only. Login checks
                                    use this same local storage. Deleting the
                                    account removes all Finique data from this
                                    browser.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border ${
                            isDarkMode
                                ? "bg-blue-900/20 border-blue-700/40 text-blue-200"
                                : "bg-blue-50 border-blue-200 text-blue-800"
                        }`}>
                        <div className="flex items-start gap-2 sm:gap-3">
                            <svg
                                className="mt-0.5 shrink-0 w-4 h-4 sm:w-[18px] sm:h-[18px]"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2">
                                <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" />
                            </svg>
                            <div className="w-full">
                                <p className="font-semibold mb-2 text-xs sm:text-sm">
                                    Security status
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                                    <p>
                                        Admin password:{" "}
                                        {isAdminPasswordSet ? "Set" : "Not set"}
                                    </p>
                                    <p>
                                        Viewer password:{" "}
                                        {isViewerPasswordSet
                                            ? "Set"
                                            : "Not set"}
                                    </p>
                                    <p>
                                        Preset selected:{" "}
                                        {isPresetSelected ? "Yes" : "No"}
                                    </p>
                                    <p>Storage used: {storageSizeKb} KB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative pt-8 sm:pt-12">
                        <label className={`${labelClass} text-xs sm:text-sm`}>
                            Enter Admin Profile password to delete account
                        </label>
                        <input
                            type="password"
                            className={`${inputClass} mb-2 sm:mb-3 py-1.5 sm:py-2.5 text-xs sm:text-sm ${
                                errors.deleteConfirmText ? "border-red-500" : ""
                            }`}
                            value={deleteConfirmText}
                            onChange={(e) => {
                                setDeleteConfirmText(e.target.value);
                                if (errors.deleteConfirmText) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        deleteConfirmText: "",
                                    }));
                                }
                            }}
                            onBlur={() =>
                                setTouched((prev) => ({
                                    ...prev,
                                    deleteConfirmText: true,
                                }))
                            }
                            placeholder="Enter admin password"
                        />
                        {touched.deleteConfirmText &&
                            errors.deleteConfirmText &&
                            renderErrorBubble(errors.deleteConfirmText)}
                    </div>

                    <div className="space-y-3 mt-4">
                        <button
                            onClick={deleteAccount}
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base bg-red-600 text-white font-semibold hover:bg-red-700 transition-all">
                            Delete Account
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
