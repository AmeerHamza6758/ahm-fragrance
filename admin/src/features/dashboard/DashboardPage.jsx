import { useState, useEffect } from "react";
import StatCard from "../../components/StatCard";
import { dashboardApi } from "../../services/endpoints";

function DashboardPage() {
  const [totalProducts, setTotalProducts] = useState("0");
  const [pendingOrders, setPendingOrders] = useState("0");
  const [lowStockAlerts, setLowStockAlerts] = useState("0");

  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const res = await dashboardApi.getTotalProducts();
        if (res.data && res.data.success) {
          setTotalProducts(String(res.data.totalProducts));
        }
      } catch (err) {
        console.error("Failed to fetch total products:", err);
      }
    };

    const fetchPendingOrders = async () => {
      try {
        const res = await dashboardApi.getPendingOrders();
        if (res.data && res.data.success) {
          setPendingOrders(String(res.data.totalPendingOrders));
        }
      } catch (err) {
        console.error("Failed to fetch pending orders:", err);
      }
    };

    const fetchLowStockCount = async () => {
      try {
        const res = await dashboardApi.getLowStockCount();
        if (res.data && res.data.success) {
          setLowStockAlerts(String(res.data.lowStockCount));
        }
      } catch (err) {
        console.error("Failed to fetch low stock count:", err);
      }
    };

    fetchTotalProducts();
    fetchPendingOrders();
    fetchLowStockCount();
  }, []);

  const stats = [
    { title: "Total Products", value: totalProducts, hint: "Source: /api/product/totalProducts" },
    { title: "Pending Orders", value: pendingOrders, hint: "Source: /api/order/pendingOrders" },
    { title: "Low Stock Alerts", value: lowStockAlerts, hint: "Source: /api/stock/lowStockCount" },
    { title: "Total Annual Revenue", value: "PKR 8,245,000", hint: "Maintained 92% profit margin" },
  ];

  return (
    <section>
      <div className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="page-note">
        Connect real data with `dashboardApi` in `src/services/endpoints.js`.
      </div>
    </section>
  );
}

export default DashboardPage;