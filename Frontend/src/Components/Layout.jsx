import { useState, useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { TransactionContext } from "../Context/TransactionContext";
import Navbar from "./CommonModule/NavbarModule/Navbar";
import SideBar from "./CommonModule/SideBarModule/SideBar";
import AddTransactionModal from "./TransactionsModule/AddTransactionModal";

const Layout = ({ children }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const { isModalOpen, setIsModalOpen, addTransaction } =
        useContext(TransactionContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div
            className={`fixed inset-0 ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
            {/* Fixed Navbar - Responsive height */}
            <div className="fixed top-0 left-0 right-0 z-40 h-14 sm:h-[70px]">
                <Navbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </div>

            {/* Main Layout with Fixed Sidebar */}
            <div className="fixed top-10 sm:top-[70px] left-0 right-0 bottom-0 flex">
                {/* Desktop Sidebar - Hidden on mobile, visible on md+ screens */}
                <div className="hidden md:block fixed md:left-0 md:top-[70px] md:bottom-0 md:w-48 lg:w-60 md:z-30 md:overflow-y-auto">
                    <SideBar />
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 top-10 sm:top-[70px] bg-black/50 md:hidden z-20"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        {/* Mobile Sidebar */}
                        <div className="fixed left-0 top-10 sm:top-[70px] bottom-0 w-64 z-30 overflow-y-auto md:hidden">
                            <SideBar
                                onCloseMobileSidebar={() =>
                                    setIsSidebarOpen(false)
                                }
                            />
                        </div>
                    </>
                )}

                {/* Main Content Area - Full width on mobile, with margin on md+ */}
                <main
                    className={`flex-1 md:ml-48 lg:ml-60 ${isDarkMode ? "bg-slate-900" : "bg-white"} overflow-y-auto p-0`}>
                    {children}
                </main>
            </div>

            {/* Modal */}
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddTransaction={addTransaction}
            />
        </div>
    );
};

export default Layout;
