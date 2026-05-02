import StatCard from "../../components/StatCard";

const stats = [
  { title: "Total Products", value: "0", hint: "Source: /api/product/getProducts" },
  { title: "Pending Orders", value: "0", hint: "Source: /api/order/checkout" },
  { title: "Low Stock Alerts", value: "0", hint: "Source: /api/stock/get?alerts=true" },
  { title: "Total Annual Revenue", value: "PKR 8,245,000", hint: "Maintained 92% profit margin" },
];

function DashboardPage() {
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