import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import ProductsPage from "./features/products/ProductsPage";
import CategoriesPage from "./features/categories/CategoriesPage";
import BrandsPage from "./features/BrandsPage";
import OrdersPage from "./features/orders/OrdersPage";
import StockPage from "./features/stock/StockPage";
import FaqPage from "./features/FaqPage";
import CustomersPage from "./features/CustomersPage";
import SettingsPage from "./features/SettingsPage";
import AddProducts from "./features/products/AddProducts"
import AnalyticPage from "./features/dashboard/AnalyticPage"
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
        <Route path="revenueanalytics" element={<AnalyticPage/>}/>
        <Route path="products/add" element={<AddProducts />} /> 
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
