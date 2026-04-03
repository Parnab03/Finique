import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

const Settings = () => {
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <div className="p-8">
            <h1
                className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Settings
            </h1>
        </div>
    );
};

export default Settings;
