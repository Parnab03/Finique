import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../../../Context/ThemeContext";
import { RoleContext } from "../../../Context/RoleContext";
import { TransactionContext } from "../../../Context/TransactionContext";
import Light_mode_logo from "./assets/Logo_light_mode.svg";
import Dark_mode_logo from "./assets/Logo_dark_mode.svg";

const STORAGE_KEY = "finique_settings_v1";

const Navbar = () => {
    const [viewOpen, setViewOpen] = useState(false);
    const [roleOpen, setRoleOpen] = useState(false);
    const { selectedRole, setSelectedRole } = useContext(RoleContext);
    const location = useLocation();
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { allTransactions } = useContext(TransactionContext);
    const [searchQuery, setSearchQuery] = useState("");

    // Profile data from Settings
    const [adminName, setAdminName] = useState("Admin Profile");
    const [adminImage, setAdminImage] = useState("");
    const [viewerName, setViewerName] = useState("Public Viewer");
    const [viewerImage, setViewerImage] = useState("");

    const pageNames = {
        "/": "Finance Dashboard",
        "/transactions": "Transactions",
        "/insights": "Insights",
        "/settings": "Settings",
    };

    const currentPageName = pageNames[location.pathname] || "Finance Dashboard";

    // Load profile data from Settings storage
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        try {
            const saved = JSON.parse(raw);
            setAdminName(saved.userName || "Admin Profile");
            setAdminImage(saved.profileImage || "");
            setViewerName(saved.viewerName || "Public Viewer");
            setViewerImage(saved.viewerProfileImage || "");
        } catch {
            // Ignore malformed storage
        }
    }, [location]); // Re-check when navigating back from Settings

    const currentName = selectedRole === "Admin" ? adminName : viewerName;
    const currentImage = selectedRole === "Admin" ? adminImage : viewerImage;
    const currentInitials = currentName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/transactions?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    return (
        <nav
            className={`${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"} border-b`}>
            <div className="flex items-center justify-between gap-0">
                {/* Left - Logo */}
                <div className="w-[239px] flex items-center px-6 py-4 flex-shrink-0">
                    <img
                        className="w-25 h-auto"
                        src={isDarkMode ? Dark_mode_logo : Light_mode_logo}
                        alt="Logo"
                    />
                </div>
                <div
                    className={`h-10 border-r ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}></div>

                {/* Center - Title with Dropdowns and Search */}
                <div className="flex items-center gap-8 flex-1 px-8 py-4 pr-0">
                    <div className="flex items-center gap-2">
                        <h1
                            className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"} whitespace-nowrap`}>
                            {currentPageName}
                        </h1>

                        {/* Role Dropdown */}
                        <div className="relative pl-2">
                            <button
                                onClick={() => setRoleOpen(!roleOpen)}
                                className={`flex items-center content-center text-center gap-0.5 text-xs font-semibold ${isDarkMode ? "bg-blue-900 text-blue-400 hover:bg-blue-800" : "bg-blue-50 text-blue-600 hover:bg-blue-100"} px-2.5 py-1.5 rounded-md transition-colors`}>
                                {selectedRole}
                                <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                            {roleOpen && (
                                <div
                                    className={`absolute top-full mt-1 w-full ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} border rounded-lg shadow-lg z-50`}>
                                    <button
                                        onClick={() => {
                                            setSelectedRole("Admin");
                                            setRoleOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 ${isDarkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"} text-sm font-medium`}>
                                        Admin
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedRole("Viewer");
                                            setRoleOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 ${isDarkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"} text-sm font-medium`}>
                                        Viewer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Bar with Theme Toggle */}
                    <div className="flex flex-end items-center gap-3 ml-auto w-full max-w-md">
                        <div className="relative flex-1 max-w-sm">
                            <svg
                                className={`absolute left-3 top-2.5 w-5 h-5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search transactions by name, date, amount..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm ${isDarkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-750 focus:border-blue-500" : "bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:bg-white focus:border-blue-300"} border transition-colors focus:outline-none`}
                            />
                        </div>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                            title="Toggle dark mode">
                            {isDarkMode ? (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 25 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.625 3.375C14.625 3.07663 14.5065 2.79048 14.2955 2.5795C14.0845 2.36853 13.7984 2.25 13.5 2.25C13.2016 2.25 12.9155 2.36853 12.7045 2.5795C12.4935 2.79048 12.375 3.07663 12.375 3.375V5.625C12.375 5.92337 12.4935 6.20952 12.7045 6.4205C12.9155 6.63147 13.2016 6.75 13.5 6.75C13.7984 6.75 14.0845 6.63147 14.2955 6.4205C14.5065 6.20952 14.625 5.92337 14.625 5.625V3.375ZM7.13587 5.54513C6.92274 5.34526 6.64021 5.23616 6.34807 5.24091C6.05593 5.24565 5.77709 5.36387 5.57056 5.57054C5.36403 5.77722 5.24601 6.05614 5.24147 6.34829C5.23694 6.64043 5.34624 6.92288 5.54625 7.13587L7.137 8.72662C7.34918 8.93155 7.63336 9.04495 7.92833 9.04238C8.2233 9.03982 8.50546 8.9215 8.71405 8.71292C8.92263 8.50434 9.04095 8.22217 9.04351 7.9272C9.04607 7.63223 8.93268 7.34805 8.72775 7.13587L7.13587 5.54513ZM21.4549 7.13587C21.6598 6.9237 21.7732 6.63952 21.7706 6.34455C21.7681 6.04958 21.6498 5.76741 21.4412 5.55883C21.2326 5.35025 20.9504 5.23193 20.6555 5.22937C20.3605 5.2268 20.0763 5.3402 19.8641 5.54513L18.2734 7.13587C18.0684 7.34805 17.9551 7.63223 17.9576 7.9272C17.9602 8.22217 18.0785 8.50434 18.2871 8.71292C18.4957 8.9215 18.7778 9.03982 19.0728 9.04238C19.3678 9.04495 19.6519 8.93155 19.8641 8.72662L21.4549 7.13587ZM13.5 7.875C12.0082 7.875 10.5774 8.46763 9.52252 9.52252C8.46763 10.5774 7.875 12.0082 7.875 13.5C7.875 14.9918 8.46763 16.4226 9.52252 17.4775C10.5774 18.5324 12.0082 19.125 13.5 19.125C14.9918 19.125 16.4226 18.5324 17.4775 17.4775C18.5324 16.4226 19.125 14.9918 19.125 13.5C19.125 12.0082 18.5324 10.5774 17.4775 9.52252C16.4226 8.46763 14.9918 7.875 13.5 7.875ZM3.375 12.375C3.07663 12.375 2.79048 12.4935 2.5795 12.7045C2.36853 12.9155 2.25 13.2016 2.25 13.5C2.25 13.7984 2.36853 14.0845 2.5795 14.2955C2.79048 14.5065 3.07663 14.625 3.375 14.625H5.625C5.92337 14.625 6.20952 14.5065 6.4205 14.2955C6.63147 14.0845 6.75 13.7984 6.75 13.5C6.75 13.2016 6.63147 12.9155 6.4205 12.7045C6.20952 12.4935 5.92337 12.375 5.625 12.375H3.375ZM21.375 12.375C21.0766 12.375 20.7905 12.4935 20.5795 12.7045C20.3685 12.9155 20.25 13.2016 20.25 13.5C20.25 13.7984 20.3685 14.0845 20.5795 14.2955C20.7905 14.5065 21.0766 14.625 21.375 14.625H23.625C23.9234 14.625 24.2095 14.5065 24.4205 14.2955C24.6315 14.0845 24.75 13.7984 24.75 13.5C24.75 13.2016 24.6315 12.9155 24.4205 12.7045C24.2095 12.4935 23.9234 12.375 23.625 12.375H21.375ZM8.72662 19.8641C8.83407 19.7603 8.91978 19.6362 8.97874 19.499C9.0377 19.3617 9.06873 19.2141 9.07003 19.0647C9.07133 18.9153 9.04287 18.7672 8.9863 18.6289C8.92973 18.4907 8.8462 18.3651 8.74057 18.2594C8.63494 18.1538 8.50933 18.0703 8.37107 18.0137C8.23282 17.9571 8.08468 17.9287 7.9353 17.93C7.78592 17.9313 7.6383 17.9623 7.50104 18.0213C7.36379 18.0802 7.23965 18.1659 7.13587 18.2734L5.54513 19.8641C5.43768 19.9679 5.35197 20.092 5.29301 20.2293C5.23405 20.3666 5.20302 20.5142 5.20172 20.6635C5.20042 20.8129 5.22888 20.9611 5.28545 21.0993C5.34202 21.2376 5.42555 21.3632 5.53118 21.4688C5.63681 21.5744 5.76242 21.658 5.90068 21.7145C6.03894 21.7711 6.18707 21.7996 6.33645 21.7983C6.48583 21.797 6.63345 21.7659 6.77071 21.707C6.90796 21.648 7.0321 21.5623 7.13587 21.4549L8.72662 19.8641ZM19.8641 18.2734C19.6519 18.0684 19.3678 17.9551 19.0728 17.9576C18.7778 17.9602 18.4957 18.0785 18.2871 18.2871C18.0785 18.4957 17.9602 18.7778 17.9576 19.0728C17.9551 19.3678 18.0684 19.6519 18.2734 19.8641L19.8641 21.4549C20.0763 21.6598 20.3605 21.7732 20.6555 21.7706C20.9504 21.7681 21.2326 21.6498 21.4412 21.4412C21.6498 21.2326 21.7681 20.9504 21.7706 20.6555C21.7732 20.3605 21.6598 20.0763 21.4549 19.8641L19.8641 18.2734ZM14.625 21.375C14.625 21.0766 14.5065 20.7905 14.2955 20.5795C14.0845 20.3685 13.7984 20.25 13.5 20.25C13.2016 20.25 12.9155 20.3685 12.7045 20.5795C12.4935 20.7905 12.375 21.0766 12.375 21.375V23.625C12.375 23.9234 12.4935 24.2095 12.7045 24.4205C12.9155 24.6315 13.2016 24.75 13.5 24.75C13.7984 24.75 14.0845 24.6315 14.2955 24.4205C14.5065 24.2095 14.625 23.9234 14.625 23.625V21.375Z"
                                        fill="#94A3B8"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M9.675 0.0153916C9.54131 -0.00833877 9.40419 -0.00459614 9.272 0.0263916C4.09 0.400392 0 4.72239 0 10.0004C0 15.5234 4.477 20.0004 10 20.0004C14.356 20.0004 18.058 17.2164 19.43 13.3334C19.4854 13.1764 19.5008 13.0081 19.4747 12.8437C19.4486 12.6793 19.3819 12.524 19.2806 12.3919C19.1793 12.2598 19.0466 12.155 18.8946 12.0872C18.7425 12.0194 18.576 11.9906 18.41 12.0034C18.33 12.0094 18.305 12.0084 18.283 12.0084H18.282L18.254 12.0064C18.1694 12.0022 18.0847 12.0002 18 12.0004C15.8783 12.0004 13.8434 11.1575 12.3431 9.65725C10.8429 8.15696 10 6.12212 10 4.00039C10 3.04839 10.121 2.24839 10.404 1.44239C10.4673 1.30859 10.5001 1.1624 10.5 1.01439V1.00039C10.5001 0.765451 10.4175 0.537975 10.2666 0.357864C10.1158 0.177752 9.90632 0.0565063 9.675 0.0153916Z"
                                        fill="#64748B"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right - User profile - Now using synced data */}
                <div
                    className={`flex items-center h-10 gap-3 flex-shrink-0 px-6 py-4 ${isDarkMode ? "border-l border-slate-800" : "border-l border-slate-200"}`}>
                    <div className="text-right">
                        <p
                            className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {currentName}
                        </p>
                        <p
                            className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {selectedRole === "Admin" ? "Admin" : "Viewer"}
                        </p>
                    </div>
                    {currentImage ? (
                        <img
                            src={currentImage}
                            alt={currentName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            className={`w-10 h-10 ${isDarkMode ? "bg-gradient-to-br from-blue-600 to-blue-800" : "bg-gradient-to-br from-blue-400 to-blue-600"} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                            {currentInitials}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
