// Icon functions that return JSX
const IconFood = () => (
    <svg
        width="15"
        height="20"
        viewBox="0 0 15 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 20V10.85C2.15 10.6167 1.4375 10.15 0.8625 9.45C0.2875 8.75 0 7.93333 0 7V0H2V7H3V0H5V7H6V0H8V7C8 7.93333 7.7125 8.75 7.1375 9.45C6.5625 10.15 5.85 10.6167 5 10.85V20H3ZM13 20V12H10V5C10 3.61667 10.4875 2.4375 11.4625 1.4625C12.4375 0.4875 13.6167 0 15 0V20H13Z"
            fill="#F4C816"
        />
    </svg>
);

const IconTravel = () => (
    <svg
        width="19"
        height="17"
        viewBox="0 0 21 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2 18.15V16.15H20V18.15H2ZM3.75 13.15L0 6.9L2.4 6.25L5.2 8.6L8.7 7.675L3.525 0.775L6.425 0L13.9 6.275L18.15 5.125C18.6833 4.975 19.1875 5.0375 19.6625 5.3125C20.1375 5.5875 20.45 5.99167 20.6 6.525C20.75 7.05833 20.6875 7.5625 20.4125 8.0375C20.1375 8.5125 19.7333 8.825 19.2 8.975L3.75 13.15Z"
            fill="#0053DD"
        />
    </svg>
);

const IconShopping = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const IconHousing = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const IconUtilities = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <path d="M8 6h.01M16 6h.01M8 12h.01M16 12h.01M8 18h.01M16 18h.01M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    </svg>
);

const IconEntertainment = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
    </svg>
);

const IconInvestment = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
    </svg>
);

const IconHealthcare = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
    </svg>
);

const IconEducation = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

const IconIncome = () => (
    <svg
        width="20"
        height="14"
        viewBox="0 0 22 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16H2ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10C8 9.45 7.80417 8.97917 7.4125 8.5875C7.02083 8.19583 6.55 8 6 8V10H8ZM18 10H20V8C19.45 8 18.9792 8.19583 18.5875 8.5875C18.1958 8.97917 18 9.45 18 10ZM13 9C13.8333 9 14.5417 8.70833 15.125 8.125C15.7083 7.54167 16 6.83333 16 6C16 5.16667 15.7083 4.45833 15.125 3.875C14.5417 3.29167 13.8333 3 13 3C12.1667 3 11.4583 3.29167 10.875 3.875C10.2917 4.45833 10 5.16667 10 6C10 6.83333 10.2917 7.54167 10.875 8.125C11.4583 8.70833 12.1667 9 13 9ZM6 4C6.55 4 7.02083 3.80417 7.4125 3.4125C7.80417 3.02083 8 2.55 8 2H6V4ZM20 4V2H18C18 2.55 18.1958 3.02083 18.5875 3.4125C18.9792 3.80417 19.45 4 20 4Z"
            fill="#006D4A"
        />
    </svg>
);

const IconMiscellaneous = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
);

export const TRANSACTION_CATEGORIES = [
    {
        id: "food",
        name: "Food & Dining",
        color: "#f59e0b",
        icon: IconFood,
    },
    {
        id: "travel",
        name: "Travel",
        color: "#dc2626",
        icon: IconTravel,
    },
    {
        id: "shopping",
        name: "Shopping",
        color: "#ec4899",
        icon: IconShopping,
    },
    {
        id: "housing",
        name: "Housing",
        color: "#2563eb",
        icon: IconHousing,
    },
    {
        id: "utilities",
        name: "Utilities",
        color: "#10b981",
        icon: IconUtilities,
    },
    {
        id: "entertainment",
        name: "Entertainment",
        color: "#8b5cf6",
        icon: IconEntertainment,
    },
    {
        id: "investment",
        name: "Investment",
        color: "#059669",
        icon: IconInvestment,
    },
    {
        id: "healthcare",
        name: "Healthcare",
        color: "#f43f5e",
        icon: IconHealthcare,
    },
    {
        id: "education",
        name: "Education",
        color: "#0ea5e9",
        icon: IconEducation,
    },
    {
        id: "income",
        name: "Income",
        color: "#16a34a",
        icon: IconIncome,
    },
    {
        id: "miscellaneous",
        name: "Miscellaneous",
        color: "#6b7280",
        icon: IconMiscellaneous,
    },
];

export const getCategoryById = (id) => {
    return TRANSACTION_CATEGORIES.find((cat) => cat.id === id);
};

export const getCategoryColor = (id) => {
    const category = getCategoryById(id);
    return category ? category.color : "#6b7280";
};

export const getCategoryIcon = (id) => {
    const category = getCategoryById(id);
    return category
        ? category.icon
        : TRANSACTION_CATEGORIES.find((c) => c.id === "miscellaneous").icon;
};

export const getCategoryName = (id) => {
    const category = getCategoryById(id);
    return category ? category.name : "Miscellaneous";
};
