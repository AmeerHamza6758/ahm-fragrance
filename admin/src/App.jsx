import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import ProductsPage from "./features/ProductsPage";
import CategoriesPage from "./features/CategoriesPage";
import BrandsPage from "./features/BrandsPage";
import OrdersPage from "./features/OrdersPage";
import StockPage from "./features/StockPage";
import FaqPage from "./features/FaqPage";
import CustomersPage from "./features/CustomersPage";
import SettingsPage from "./features/SettingsPage";
import DashboardPage from "./features/DashboardPage";
import AddProducts from "./features/products/AddProducts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage/>} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="stock" element={<StockPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="products/add" element={<AddProducts/>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
