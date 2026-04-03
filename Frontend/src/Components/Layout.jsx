import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";
import Navbar from "./CommonModule/NavbarModule/Navbar";
import SideBar from "./CommonModule/SideBarModule/SideBar";

const Layout = ({ children }) => {
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <div
            className={`flex flex-col min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
            <Navbar />
            <div className="flex flex-1">
                <SideBar />
                <main
                    className={`flex-1 ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
