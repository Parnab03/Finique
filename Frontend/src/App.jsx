import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/DashboardModule/Dadhboard";
import Transactions from "./Components/TransactionsModule/Transactions";
import Insights from "./Components/InsightsModule/Insights";
import Settings from "./Components/SettingsModule/Settings";
import Layout from "./Components/Layout";
import { Analytics } from "@vercel/analytics/react";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Layout>
                                <Dashboard />
                            </Layout>
                        }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <Layout>
                                <Transactions />
                            </Layout>
                        }
                    />
                    <Route
                        path="/insights"
                        element={
                            <Layout>
                                <Insights />
                            </Layout>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <Layout>
                                <Settings />
                            </Layout>
                        }
                    />
                </Routes>
            </Router>
            <Analytics />
        </>
    );
}

export default App;
