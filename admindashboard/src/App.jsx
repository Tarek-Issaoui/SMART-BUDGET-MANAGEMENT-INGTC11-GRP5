import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard    from "./pages/Dashboard";
import Users        from "./pages/Users";
import Alertes      from "./pages/Alertes";
import Budgets       from "./pages/Budgets";
import Transactions  from "./pages/Transactions";
import Parametres    from "./pages/Parametres";

export default function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/"             element={<Dashboard />} />
        <Route path="/users"        element={<Users />} />
        <Route path="/alertes"      element={<Alertes />} />
        <Route path="/budgets"      element={<Budgets />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/parametres"   element={<Parametres />} />
      </Routes>
    </AdminLayout>
  );
}
