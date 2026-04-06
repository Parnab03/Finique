# Finique

**A personal finance management application to track, analyze, and optimize your financial life.**

---

## Overview

Finique is a modern, intuitive web application designed to help you manage your personal finances effectively. Track your income and expenses, set financial goals, analyze spending patterns, and make informed financial decisions with detailed insights.

---

## Key Features

### Dashboard

- Real-time financial overview with income, expenses, and net balance
- Monthly comparison and spending trends
- Category-wise spending visualization
- Quick balance analytics

### Transactions

- Add, edit, and delete transactions
- Categorize income and expenses
- Monthly filtering and search functionality
- Preset templates for quick entry
- Transaction history with detailed information

### Insights & Analytics

- Weekly spending patterns and trends
- Category analysis and breakdowns
- Savings goals tracking with progress visualization
- AI-powered finance assistant for suggestions
- Export financial reports (PDF)
- Smart observations based on spending behavior

### Goals Management

- Create and manage savings goals
- Track goal progress in real-time
- Goal-based spending insights
- Multiple goal types support

### Settings

- Admin and Viewer account management
- Preset templates for transactions
- Theme preference (Dark/Light mode)
- Data management options

### Multi-User Support

- **Admin Role**: Full access to all features
- **Viewer Role**: Read-only access to view finances
- Create viewer accounts from settings for sharing

### Help & Documentation

- Comprehensive in-app help system
- Feature explanations and tutorials
- Getting started guide

---

## Tech Stack

**Frontend:**

- React 19+
- Tailwind CSS (styled with dark/light mode support)
- Recharts (for data visualization)
- Vite (build tool)

**Context & State:**

- React Context API (ThemeContext, RoleContext, TransactionContext, AuthContext)
- localStorage (for persistent data storage)

**Data Calculations:**

- Monthly expense/income calculations
- Category-wise spending breakdowns
- Comparison metrics and trends

---

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd Finique/Frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start development server**

    ```bash
    npm run dev
    ```

    The application will open at `http://localhost:5173`

4. **Build for production**
    ```bash
    npm run build
    ```

---

## How to Use Finique

### Getting Started Flow

#### 1. Sign Up / Sign In

- Create an **Admin account** with your credentials
- Or sign in as **Guest** (read-only, no editing)

#### 2. Dashboard Overview

- View your financial summary upon login
- See income, expenses, and net balance
- Check monthly comparisons and spending trends

#### 3. Add Your First Transaction

- Click **"Add Transaction"** button in the sidebar
- Select transaction type (Income/Expense)
- Choose category (e.g., Salary, Groceries, Entertainment)
- Enter amount and date
- Use presets for faster entry
- Save transaction

#### 4. View & Manage Transactions

- Navigate to **Transactions** section
- Filter by month or category
- Edit or delete transactions as needed
- Search for specific transactions
- Organize by preset templates

#### 5. Analyze in Insights

- Go to **Insights** section
- View weekly spending patterns
- Check category breakdowns
- Read AI-powered suggestions
- Export financial report as PDF

#### 6. Set Financial Goals

- Click **"Manage Goals"** in Insights
- Create new savings goals
- Set target amounts and deadlines
- Track progress visually
- Get goal-based recommendations

#### 7. Configure Settings

- Open **Settings** to manage preferences
- Create Viewer accounts (for read-only access)
- Choose dark/light theme
- Manage presets for common transactions
- Delete account or reset data

#### 8. Get Help

- Click **Help** in sidebar for in-app tutorial
- Learn about features and navigation
- Review role descriptions (Admin vs Viewer)
- Understand presets and goal tracking

---

## Project Structure

```
Finique/
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── DashboardModule/      # Dashboard overview
│   │   │   ├── InsightsModule/       # Analytics & reporting
│   │   │   ├── TransactionsModule/   # Transaction management
│   │   │   ├── SettingsModule/       # User settings
│   │   │   └── CommonModule/         # Shared components
│   │   ├── Context/                  # React Context providers
│   │   ├── Constants/                # App constants
│   │   └── utils/                    # Helper functions
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Data Storage

All data is stored securely in **browser's localStorage**:

- Transactions
- User settings & preferences
- Goals and progress
- Authentication tokens

**No server or cloud storage required** - your data stays private on your device.

---

## Security & Privacy

- Admin and Viewer role-based access control
- Can use Guest Mode, no need to make account
- All data stored locally on your browser
- No external API calls for data

---

## Features Highlights

| Feature               | Admin | Viewer |
| --------------------- | ----- | ------ |
| Add/Edit Transactions | ✓     | ✗      |
| View Dashboard        | ✓     | ✓      |
| View Insights         | ✓     | ✓      |
| Manage Goals          | ✓     | ✗      |
| Download Reports      | ✓     | ✓      |
| Manage Settings       | ✓     | ✗      |

---

## Tips for Best Results

- Add transactions regularly for accurate insights
- Use categories consistently for better analysis
- Set realistic savings goals to stay motivated
- Review insights monthly to track progress
- Create Viewer accounts for family members to share financial overview
- Use preset templates to speed up transaction entry

---

## Support

For issues, suggestions, or feature requests, please reach out or open an issue in the repository.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Start managing your finances smartly with Finique today!**
