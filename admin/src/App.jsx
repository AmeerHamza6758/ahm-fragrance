import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Loader from "./components/Loader";

// Lazy loaded features
const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage"));
const ProductsPage = lazy(() => import("./features/products/ProductsPage"));
const CategoriesPage = lazy(() => import("./features/categories/CategoriesPage"));
const OrdersPage = lazy(() => import("./features/orders/OrdersPage"));
const ViewOrder = lazy(() => import("./features/orders/ViewOrder"));
const StockPage = lazy(() => import("./features/stock/StockPage"));
const FaqPage = lazy(() => import("./features/FaqPage"));
const CustomersPage = lazy(() => import("./features/CustomersPage"));
const SettingsPage = lazy(() => import("./features/SettingsPage"));
const AddProducts = lazy(() => import("./features/products/AddProducts"));
const ViewProduct = lazy(() => import("./features/products/ViewProduct"));
const EditProduct = lazy(() => import("./features/products/EditProduct"));
const ViewCustomer = lazy(() => import("./features/ViewCustomer"));
const AnalyticPage = lazy(() => import("./features/dashboard/AnalyticPage"));
const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const ProfilePage = lazy(() => import("./features/ProfilePage"));

function App() {
  return (
    <Suspense fallback={<Loader fullScreen={true} text="Initializing Administrative Suite..." />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/view/:id" element={<ViewOrder />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/view/:id" element={<ViewCustomer />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="revenueanalytics" element={<AnalyticPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="products/add" element={<AddProducts />} />
            <Route path="products/view/:id" element={<ViewProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;