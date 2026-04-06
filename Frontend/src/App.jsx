import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Dashboard from "./Components/DashboardModule/Dadhboard";
import Transactions from "./Components/TransactionsModule/Transactions";
import Insights from "./Components/InsightsModule/Insights";
import Settings from "./Components/SettingsModule/Settings";
import Layout from "./Components/Layout";
import SignIn from "./Components/CommonModule/AuthModule/SignIn";
import SignUp from "./Components/CommonModule/AuthModule/SignUp";
import ProtectedRoute from "./Components/ProtectedRoute";
import { TransactionProvider } from "./Context/TransactionContext";
import { RoleProvider } from "./Context/RoleContext";
import { AuthProvider } from "./Context/AuthContext";
import { Analytics } from "@vercel/analytics/react";

function App() {
    return (
        <>
            <AuthProvider>
                <RoleProvider>
                    <TransactionProvider>
                        <Router>
                            <Routes>
                                {/* Auth Routes - No protection */}
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/signup" element={<SignUp />} />

                                {/* Protected Routes - Require authentication */}
                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute>
                                            <Layout>
                                                <Dashboard />
                                            </Layout>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/transactions"
                                    element={
                                        <ProtectedRoute>
                                            <Layout>
                                                <Transactions />
                                            </Layout>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/insights"
                                    element={
                                        <ProtectedRoute>
                                            <Layout>
                                                <Insights />
                                            </Layout>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <ProtectedRoute>
                                            <Layout>
                                                <Settings />
                                            </Layout>
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Catch-all redirect */}
                                <Route
                                    path="*"
                                    element={<Navigate to="/" replace />}
                                />
                            </Routes>
                        </Router>
                    </TransactionProvider>
                </RoleProvider>
            </AuthProvider>
            <Analytics />
        </>
    );
}

export default App;
