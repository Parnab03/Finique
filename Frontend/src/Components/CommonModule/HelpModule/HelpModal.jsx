import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

const HelpModal = ({ isOpen, onClose }) => {
    const { isDarkMode } = useContext(ThemeContext);

    if (!isOpen) return null;

    const sections = [
        {
            title: "Navigation Overview",
            content:
                "The left sidebar contains four main navigation sections: Dashboard, Transactions, Insights, and Settings. Each section provides specific functionality to manage your finances. On mobile devices, the sidebar is accessible through the menu button in the top-left corner.",
        },
        {
            title: "Top Navigation Bar",
            content:
                "The top bar displays the current page name and provides access to search, theme toggle (dark/light mode), and your profile menu. The role indicator shows whether you are logged in as Admin or Viewer. Use the search bar to quickly find transactions by title or description.",
        },
        {
            title: "Dashboard",
            content:
                "Your central hub for financial overview. The Dashboard displays your total balance, recent transactions, spending breakdown by category, and key financial metrics. Use this page to get a quick snapshot of your financial status. The dashboard updates in real-time as you add or modify transactions.",
        },
        {
            title: "Transactions",
            content:
                "Manage all your financial records here. Click the plus button to add new transactions (income or expense). Each transaction requires an amount, title, description, category, and date. You can filter, sort, and search transactions. The transaction list shows all your activity with details like amount, category, and date. Expense transactions require category selection, while income entries use a default income category.",
        },
        {
            title: "Insights",
            content:
                "Analyze your spending patterns and financial trends. This section provides visualizations of your spending by category, income vs. expense comparison, and monthly trends. Use insights to understand where your money goes and identify areas for financial improvement. Charts update automatically as you add new transactions.",
        },
        {
            title: "Settings - Admin Profile",
            content:
                "Configure your admin account details. Change your profile name, upload a profile picture, and set or update your password. This is your primary account with full access to all features. All changes are automatically saved to your device.",
        },
        {
            title: "Settings - Viewer Profile",
            content:
                "Create and manage a viewer account for read-only access. The Viewer profile can access the dashboard and transactions but cannot add, edit, or delete data. This is useful for sharing financial information with family members or colleagues without giving them full editing permissions.",
        },
        {
            title: "Presets - What Are They?",
            content:
                "Presets are pre-configured transaction templates designed for different financial lifestyles. They include common categories and sample transactions to help you get started quickly. Available presets include: No Presets (start fresh), Student Budget (low income management), Family Planner (household expenses), Freelancer Flow (irregular income), Small Business (revenue-expense split), and Minimal Tracker (basic tracking). Presets are optional and can be selected or changed anytime from Settings.",
        },
        {
            title: "How to Use Presets",
            content:
                "Go to Settings and select a preset that matches your financial situation. The selected preset will populate your transaction categories and provide sample structures. You can customize or delete preset categories at any time. Changing presets will not delete your existing transactions. Presets help you establish a category structure that aligns with your financial model.",
        },
        {
            title: "Admin Role - Full Access",
            content:
                "As an Admin, you have complete control over all features. You can add, edit, and delete transactions, create and manage viewer accounts, customize settings, upload profile pictures, and access all sections of the application. Admin access requires a password for security. Initialize your admin account during sign-up.",
        },
        {
            title: "Viewer Role - Read-Only Access",
            content:
                "Viewers can see the dashboard, transactions, and insights but cannot modify any data. They cannot add new transactions, edit existing ones, or change settings. Viewer accounts are created by the admin from the Settings page. This role is ideal for family members who want visibility without edit permissions.",
        },
        {
            title: "Data Security & Storage",
            content:
                "All your data is stored locally in your browser. No data is sent to external servers. This means your financial information remains completely private and on your device. Be aware that clearing your browser storage will delete all data. Consider backing up important data periodically. Your data persists as long as your browser storage is not cleared.",
        },
        {
            title: "Getting Started Tips",
            content:
                "Start by creating your admin account with a secure password. Choose a preset that matches your financial situation or start with 'No Presets' to build custom categories. Add some transactions to populate your dashboard. Explore each section to understand the available features. Create a viewer account if you want to share financial data with others. Review your insights regularly to understand spending patterns.",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blur Background */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden ${
                    isDarkMode ? "bg-slate-800" : "bg-white"
                }`}>
                {/* Header */}
                <div
                    className={`flex-shrink-0 p-4 sm:p-6 border-b ${
                        isDarkMode
                            ? "border-slate-700 bg-slate-900"
                            : "border-slate-200 bg-slate-50"
                    }`}>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1
                                className={`text-2xl sm:text-3xl font-bold ${
                                    isDarkMode ? "text-white" : "text-slate-900"
                                }`}>
                                Help & Guide
                            </h1>
                            <p
                                className={`text-sm mt-1 ${
                                    isDarkMode
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                }`}>
                                Learn how to use Finique and maximize your
                                financial management
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                                isDarkMode
                                    ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                            }`}
                            aria-label="Close help">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 space-y-6">
                        {sections.map((section, index) => (
                            <div key={index}>
                                <h2
                                    className={`text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2 ${
                                        isDarkMode
                                            ? "text-blue-400"
                                            : "text-blue-600"
                                    }`}>
                                    <span
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                            isDarkMode
                                                ? "bg-blue-600"
                                                : "bg-blue-500"
                                        }`}>
                                        {index + 1}
                                    </span>
                                    {section.title}
                                </h2>
                                <p
                                    className={`text-sm leading-relaxed ${
                                        isDarkMode
                                            ? "text-slate-300"
                                            : "text-slate-700"
                                    }`}>
                                    {section.content}
                                </p>
                            </div>
                        ))}

                        {/* Key Features Summary */}
                        <div
                            className={`mt-8 p-4 rounded-lg border ${
                                isDarkMode
                                    ? "bg-slate-900 border-slate-700"
                                    : "bg-slate-50 border-slate-200"
                            }`}>
                            <h3
                                className={`font-semibold mb-3 ${
                                    isDarkMode
                                        ? "text-green-400"
                                        : "text-green-600"
                                }`}>
                                Key Features Summary
                            </h3>
                            <ul
                                className={`space-y-2 text-sm ${
                                    isDarkMode
                                        ? "text-slate-300"
                                        : "text-slate-700"
                                }`}>
                                <li className="flex gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>
                                        Add, edit, and delete transactions with
                                        detailed information
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>
                                        Categorize expenses and income for
                                        better tracking
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>
                                        View comprehensive insights and spending
                                        patterns
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>
                                        Use presets to quickly get started with
                                        pre-configured categories
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>
                                        Manage multiple accounts with Admin and
                                        Viewer roles
                                    </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>
                                        All data stored locally for complete
                                        privacy
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className={`flex-shrink-0 p-4 sm:p-6 border-t ${
                        isDarkMode
                            ? "border-slate-700 bg-slate-900"
                            : "border-slate-200 bg-slate-50"
                    }`}>
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors">
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
