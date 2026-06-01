import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Budgets } from "./pages/Budgets";
import { Transactions } from "./pages/Transactions";
import { Categories } from "./pages/Categories";
import { Groups } from "./pages/Groups";
import { Alerts } from "./pages/Alerts";

function AuthGuard({ children }: { children: React.ReactNode }) {
  // Auth check happens inside AppContext; Layout redirects if not logged in
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/connexion",
    Component: Auth,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "budgets", Component: Budgets },
      { path: "transactions", Component: Transactions },
      { path: "categories", Component: Categories },
      { path: "groupes", Component: Groups },
      { path: "alertes", Component: Alerts },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
