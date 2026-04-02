import Navbar from "./CommonModule/NavbarModule/Navbar";
import SideBar from "./CommonModule/SideBarModule/SideBar";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex flex-1">
                <SideBar />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
