import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UsersPage } from "./pages/UsersPage";
import { HomePage } from "./pages/HomePage";
import { RolePage } from "./pages/RolePage";
import { SalesPage } from "./pages/SalesPage";
import { ProductsPage } from "./pages/ProductsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolePage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/products" element={<ProductsPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
