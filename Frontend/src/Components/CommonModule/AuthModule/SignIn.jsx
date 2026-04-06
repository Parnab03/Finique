import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import { ThemeContext } from "../../../Context/ThemeContext";
import LogoDarkMode from "./assets/Logo_dark_mode.svg";
import LogoLightMode from "./assets/Logo_light_mode.svg";
import LeftPanel from "./assets/left_panel.png";

const SignIn = () => {
    const navigate = useNavigate();
    const { login, loginAsGuest } = useContext(AuthContext);
    const { isDarkMode } = useContext(ThemeContext);

    const [selectedRole, setSelectedRole] = useState("admin"); // "admin" or "viewer"
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Get stored settings
            const settings = localStorage.getItem("finique_settings_v1");
            if (!settings) {
                setError("No account found. Please sign up first.");
                setIsLoading(false);
                return;
            }

            const parsed = JSON.parse(settings);

            // Verify credentials based on selected role
            if (selectedRole === "admin") {
                if (
                    parsed.userName === username &&
                    parsed.userPassword === password
                ) {
                    login(username, "Admin");
                    navigate("/");
                } else {
                    setError("Invalid admin credentials");
                }
            } else if (selectedRole === "viewer") {
                if (
                    parsed.viewerName === username &&
                    parsed.viewerPassword === password
                ) {
                    login(username, "Viewer");
                    navigate("/");
                } else {
                    setError("Invalid viewer credentials");
                }
            }
        } catch (err) {
            setError("Error signing in. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestLogin = (role) => {
        loginAsGuest(role);
        navigate("/");
    };

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
            className={`h-screen md:min-h-screen flex items-center justify-center p-4 overflow-hidden md:overflow-visible ${
                isDarkMode ? "bg-slate-950" : "bg-slate-50"
            }`}>
            {/* Main container with left visual and right form */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row items-stretch justify-center gap-0 rounded-3xl overflow-hidden md:overflow-visible max-h-full md:max-h-none">
                {/* Left Visual Section - Hidden on mobile, visible on md+ */}
                <div
                    className="hidden md:flex md:w-1/2 flex-col justify-between p-8 rounded-l-3xl bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${LeftPanel})` }}>
                    {/* Logo at top left */}
                    <div className="flex items-start">
                        <img
                            src={LogoDarkMode}
                            alt="Finique Logo"
                            className="h-12 w-auto"
                        />
                    </div>

                    {/* Features in middle */}
                    <div className="space-y-6">
                        {/* Feature 1 */}
                        <div>
                            <div className="flex items-start gap-3">
                                <svg
                                    className="w-6 h-6 text-green-400 flex-shrink-0 mt-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">
                                        Track Spending
                                    </h3>
                                    <div className="w-8 h-0.5 bg-green-400 my-1.5"></div>
                                    <p className="text-white/80 text-xs">
                                        Monitor your expenses and income in
                                        real-time
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div>
                            <div className="flex items-start gap-3">
                                <svg
                                    className="w-6 h-6 text-green-400 flex-shrink-0 mt-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">
                                        Set Goals
                                    </h3>
                                    <div className="w-8 h-0.5 bg-green-400 my-1.5"></div>
                                    <p className="text-white/80 text-xs">
                                        Create and manage financial goals with
                                        ease
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div>
                            <div className="flex items-start gap-3">
                                <svg
                                    className="w-6 h-6 text-green-400 flex-shrink-0 mt-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">
                                        Get Insights
                                    </h3>
                                    <div className="w-8 h-0.5 bg-green-400 my-1.5"></div>
                                    <p className="text-white/80 text-xs">
                                        Discover patterns and optimize your
                                        finances
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Notice at bottom left */}
                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg text-xs text-center bg-white/10 backdrop-blur-sm">
                        <svg
                            className="shrink-0 w-4 h-4 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path d="M10 1a4.5 4.5 0 00-4.5 4.5v2a2 2 0 00-2 2v6a2 2 0 002 2h9a2 2 0 002-2v-6a2 2 0 00-2-2v-2A4.5 4.5 0 0010 1zm3 8.5H7v6h6v-6z" />
                        </svg>
                        <span className="text-white/90">
                            All your data will be stored locally in your
                            browser. No data is sent to servers.
                        </span>
                    </div>
                </div>

                {/* Right Form Section */}
                <div
                    className={`w-full md:w-1/2 rounded-3xl md:rounded-none border md:border-0 md:border-l p-6 sm:p-8 flex flex-col justify-center ${
                        isDarkMode
                            ? "bg-slate-800 border-slate-700"
                            : "bg-white border-slate-200"
                    }`}>
                    <h1
                        className={`text-2xl sm:text-3xl font-bold mb-1 text-center ${
                            isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        Welcome Back
                    </h1>
                    <p
                        className={`text-center mb-6 text-xs sm:text-sm ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}>
                        Sign in to your Finique account
                    </p>

                    {/* Error is now displayed as a hover bubble above form fields */}

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label
                            className={`block text-xs sm:text-sm font-semibold mb-2.5 ${
                                isDarkMode ? "text-slate-300" : "text-slate-700"
                            }`}>
                            AUTH TYPE
                        </label>
                        <div
                            className={`flex gap-2 p-1 rounded-full ${
                                isDarkMode ? "bg-slate-700" : "bg-slate-100"
                            }`}>
                            {["admin", "viewer"].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setSelectedRole(role)}
                                    className={`flex-1 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 ${
                                        selectedRole === role
                                            ? isDarkMode
                                                ? "bg-blue-600 text-white shadow-lg"
                                                : "bg-blue-600 text-white shadow-lg"
                                            : isDarkMode
                                              ? "bg-transparent text-blue-600"
                                              : "bg-transparent text-blue-600"
                                    }`}>
                                    {role === "admin" ? "Admin" : "Viewer"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sign In Form */}
                    <form
                        onSubmit={handleSignIn}
                        className="space-y-4 sm:space-y-5">
                        <div className="relative">
                            <label
                                className={`block text-xs sm:text-sm font-semibold mb-2 ${
                                    isDarkMode
                                        ? "text-slate-300"
                                        : "text-slate-700"
                                }`}>
                                {selectedRole === "admin"
                                    ? "ADMIN NAME"
                                    : "VIEWER NAME"}
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={
                                    selectedRole === "admin"
                                        ? "Enter admin name"
                                        : "Enter viewer name"
                                }
                                className={`w-full px-4 py-2.5 sm:py-3 rounded-lg border font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    isDarkMode
                                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                                }`}
                                required
                            />
                            {error && renderErrorBubble(error)}
                        </div>

                        <div className="relative">
                            <label
                                className={`block text-xs sm:text-sm font-semibold mb-2 ${
                                    isDarkMode
                                        ? "text-slate-300"
                                        : "text-slate-700"
                                }`}>
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-2.5 sm:py-3 rounded-lg border font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                    isDarkMode
                                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                                }`}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                isLoading
                                    ? "bg-blue-600/50 text-white cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-5 sm:my-6">
                        <div
                            className={`flex-1 h-px ${
                                isDarkMode ? "bg-slate-700" : "bg-slate-300"
                            }`}
                        />
                        <span
                            className={`px-3 text-xs sm:text-sm ${
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}>
                            or
                        </span>
                        <div
                            className={`flex-1 h-px ${
                                isDarkMode ? "bg-slate-700" : "bg-slate-300"
                            }`}
                        />
                    </div>

                    {/* Guest Login Button */}
                    <button
                        type="button"
                        onClick={() => handleGuestLogin("admin")}
                        className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm transition-all border ${
                            isDarkMode
                                ? "bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50"
                                : "bg-transparent border-slate-300 text-slate-600 hover:bg-slate-50"
                        }`}>
                        Continue as Guest
                    </button>

                    {/* Sign Up Link */}
                    <div
                        className={`text-center text-xs sm:text-sm mt-5 sm:mt-6 ${
                            isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}>
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="text-blue-600 hover:text-blue-700 font-semibold">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
