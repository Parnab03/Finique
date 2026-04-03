import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import { TransactionContext } from "../Context/TransactionContext";
import Navbar from "./CommonModule/NavbarModule/Navbar";
import SideBar from "./CommonModule/SideBarModule/SideBar";
import AddTransactionModal from "./TransactionsModule/AddTransactionModal";

const Layout = ({ children }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const { isModalOpen, setIsModalOpen, addTransaction } =
        useContext(TransactionContext);

    return (
        <div
            className={`fixed inset-0 ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40">
                <Navbar />
            </div>

            {/* Main Layout with Fixed Sidebar */}
            <div className="fixed top-[70px] left-0 right-0 bottom-0 flex">
                {/* Fixed Sidebar */}
                <div className="fixed left-0 top-[70px] bottom-0 w-60 z-30 overflow-y-auto">
                    <SideBar />
                </div>

                {/* Main Content Area with Left Margin */}
                <main
                    className={`flex-1 ml-60 ${isDarkMode ? "bg-slate-900" : "bg-white"} overflow-y-auto`}>
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
