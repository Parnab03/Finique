import { createContext, useState } from "react";

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [selectedRole, setSelectedRole] = useState("Admin");

    return (
        <RoleContext.Provider
            value={{
                selectedRole,
                setSelectedRole,
            }}>
            {children}
        </RoleContext.Provider>
    );
};
